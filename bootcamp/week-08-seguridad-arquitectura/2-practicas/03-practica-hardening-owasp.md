# 🔒 Práctica 03 — Hardening: Defensa OWASP en Node.js

> **Tiempo estimado**: 40 minutos
> **Dificultad**: Intermedia–Avanzada
> **Requisitos**: Prácticas 01 y 02 completadas

---

## 🎯 Objetivo

Aplicar un conjunto de medidas de **hardening HTTP** que mitigan las principales vulnerabilidades del OWASP Top 10 (2021) en una API Node.js con Express.

Al terminar habrás:

- Configurado **Helmet.js** para eliminar headers inseguros por defecto
- Implementado **rate limiting** diferenciado (auth vs API general)
- Configurado **CORS** restrictivo con allowlist
- Validado la entrada con **Zod** como barrera contra inyección
- Verificado las mitigaciones con herramientas de línea de comandos

---

## 📋 Contexto

Una auditoría arrojó que la API EduFlow pasa las siguientes pruebas OWASP:

| Checklist                    | Estado inicial      | Objetivo                      |
| ---------------------------- | ------------------- | ----------------------------- |
| Headers HTTP seguros (A05)   | ❌ Ninguno          | ✅ Helmet activo              |
| Rate limiting en /auth (A07) | ❌ Sin límite       | ✅ 10 req/15min               |
| CORS (A05)                   | ❌ Cualquier origen | ✅ Solo orígenes listados     |
| Entrada validada (A03)       | ❌ Sin validación   | ✅ Zod en todos los endpoints |
| Secretos en código (A02)     | ❌ Hardcoded        | ✅ Variables de entorno       |

---

## Setup

```bash
mkdir practica-hardening && cd practica-hardening
pnpm init
# "type": "module" en package.json
pnpm add express helmet express-rate-limit cors zod
```

---

## Paso 1 — Headers de seguridad con Helmet (8 min)

### Antes (sin Helmet)

```bash
# Levanta un Express vacío y observa los headers
node -e "
import('express').then(({default: express}) => {
  const app = express();
  app.get('/', (_, res) => res.json({ok:true}));
  app.listen(3001, () => console.log('http://localhost:3001'));
});
"
curl -I http://localhost:3001/
```

Notarás headers como `X-Powered-By: Express` — ¡información que ayuda a atacantes!

### Después (con Helmet)

```javascript
// src/app.js
import express from "express";
import helmet from "helmet";

const app = express();
app.use(helmet()); // Agrega ~12 headers de seguridad de una sola línea

app.get("/", (_req, res) => res.json({ status: "ok" }));
export { app };
```

```bash
node -e "import('./src/app.js').then(({app}) => app.listen(3002))"
curl -I http://localhost:3002/
```

**Documenta los headers que ahora aparecen** y explica qué protegen:

| Header                            | Protege contra                     |
| --------------------------------- | ---------------------------------- |
| `X-Content-Type-Options: nosniff` | ?                                  |
| `X-Frame-Options: SAMEORIGIN`     | ?                                  |
| `Strict-Transport-Security`       | ?                                  |
| `Content-Security-Policy`         | ?                                  |
| ¿`X-Powered-By` aparece ahora?    | ¿Por qué es bueno que no aparezca? |

---

## Paso 2 — Rate Limiting (8 min)

Sin rate limiting, un atacante puede probar millones de contraseñas. Con rate limiting:

```javascript
// src/infrastructure/security/rate-limiter.js
import rateLimit from "express-rate-limit";

/**
 * Rate limit estricto para endpoints de autenticación.
 * 10 intentos por IP cada 15 minutos.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  standardHeaders: true, // Envía headers RateLimit-* (RFC 6585)
  legacyHeaders: false, // Deshabilita X-RateLimit-* antiguo
  message: {
    error: "Demasiados intentos de autenticación. Intenta en 15 minutos.",
  },
  // Clave por IP — en producción considera IP + email para más granularidad
  keyGenerator: (req) => req.ip,
});

/**
 * Rate limit general para la API.
 * 100 peticiones por IP por minuto.
 */
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas peticiones. Intenta en un momento." },
});
```

**Prueba el rate limit:**

```bash
# Script para simular ataque de fuerza bruta
for i in $(seq 1 15); do
  echo -n "Intento $i: "
  curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
  echo
done
```

**Observa** cómo los primeros 10 retornan 400/401 y los siguientes retornan **429 Too Many Requests**.

---

## Paso 3 — CORS restrictivo (5 min)

```javascript
// src/interfaces/http/cors.config.js
import cors from "cors";

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

export const corsMiddleware = cors({
  origin(origin, callback) {
    // Permitir requests sin origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origen no permitido por CORS: ${origin}`));
    }
  },
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400, // Cache preflight 24h
});
```

**Prueba:**

```bash
# Origen NO permitido → debe bloquear
curl -H "Origin: https://atacante.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS http://localhost:3000/api/cursos -v 2>&1 | grep -E "< HTTP|Access-Control"

# Origen permitido → debe funcionar
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS http://localhost:3000/api/cursos -v 2>&1 | grep -E "< HTTP|Access-Control"
```

---

## Paso 4 — Validación de entrada con Zod (10 min)

```javascript
// src/interfaces/http/middlewares/validate.js
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Datos de entrada inválidos",
      details: result.error.flatten().fieldErrors,
    });
  }

  req.body = result.data; // Reemplazar con datos sanitizados y tipados
  next();
};
```

```javascript
// src/interfaces/http/schemas/auth.schema.js
import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .max(255)
    .transform((e) => e.toLowerCase().trim()), // Normalizar
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(128)
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),
  role: z.enum(["student", "instructor"]).default("student"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .transform((e) => e.toLowerCase().trim()),
  password: z.string().min(1, "Contraseña requerida").max(128),
});
```

**Prueba de inyección SQL (debe ser bloqueada por Zod):**

```bash
# Intento de SQL injection clásico
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com\" OR 1=1 --", "password": "x"}'

# Debe retornar 400 (email inválido) — Zod rechaza el formato
```

```bash
# Payload gigante (intentar DoS)
python3 -c "import json; print(json.dumps({'email': 'a@b.com', 'password': 'x' * 10000}))" \
  | curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d @-
# Debe retornar 413 o 400 — el limit de express.json('100kb') lo bloquea
```

---

## Paso 5 — Gestión segura de secretos (5 min)

```javascript
// src/config.js — VERSIÓN SEGURA
import { z } from "zod";

const schema = z.object({
  JWT_SECRET: z.string().min(32, "JWT_SECRET debe tener mínimo 32 caracteres"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
});

const result = schema.safeParse(process.env);

if (!result.success) {
  // Falla rápido en startup — mejor que fallar en producción durante un request
  console.error(
    "❌ Configuración inválida:",
    result.error.flatten().fieldErrors,
  );
  process.exit(1);
}

export const config = result.data;
```

```bash
# Generar un JWT_SECRET de 64 bytes aleatorios (producción)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Verificar que .env no está trackeado
echo ".env" >> .gitignore
git status  # .env no debe aparecer
git ls-files .env  # debe estar vacío
```

---

## Paso 6 — App completa con todas las mitigaciones

```javascript
// src/app.js — Hardening completo
import express from "express";
import helmet from "helmet";
import { corsMiddleware } from "./interfaces/http/cors.config.js";
import {
  authRateLimiter,
  apiRateLimiter,
} from "./infrastructure/security/rate-limiter.js";

export const createApp = () => {
  const app = express();

  // A05 — Headers de seguridad
  app.use(helmet());

  // A05 — CORS restrictivo
  app.use(corsMiddleware);

  // A03 — Limitar tamaño del body (evitar DoS por payloads gigantes)
  app.use(express.json({ limit: "100kb" }));

  // Health check sin rate limit (para load balancers)
  app.get("/health", (_req, res) =>
    res.json({ status: "ok", timestamp: new Date().toISOString() }),
  );

  // A07 — Rate limit en autenticación (10 req / 15min por IP)
  app.use("/auth", authRateLimiter);

  // Rate limit general para la API
  app.use("/api", apiRateLimiter);

  // Manejo global de errores — no revelar detalles en producción (A09)
  app.use((err, _req, res, _next) => {
    const isProd = process.env.NODE_ENV === "production";
    console.error(
      JSON.stringify({
        // Loggear internamente con contexto
        event: "unhandled_error",
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString(),
      }),
    );
    res.status(500).json({
      error: isProd ? "Error interno del servidor" : err.message,
    });
  });

  return app;
};
```

---

## ✅ Checklist de verificación final

Antes de considerar completa la práctica, verifica cada punto:

```bash
# 1. Headers de seguridad presentes
curl -I http://localhost:3000/health | grep -E "x-content|x-frame|strict-transport|content-security"

# 2. X-Powered-By eliminado
curl -I http://localhost:3000/health | grep -i "x-powered-by"
# Debe estar vacío

# 3. Rate limiting activo en /auth
for i in {1..12}; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" -d '{"email":"x@x.com","password":"wrong"}')
  echo "Intento $i: HTTP $CODE"
done
# Primeros ~10: 400 o 401; siguientes: 429

# 4. Validación Zod activa
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "no-es-email", "password": "123"}'
# Debe retornar 400 con detalles de error

# 5. .env no en repositorio
git ls-files .env 2>/dev/null | wc -l  # Debe ser 0
cat .gitignore | grep "^\.env"         # Debe aparecer
```

---

## ✅ Rúbrica de evaluación

| Criterio                | Descripción                                                        | Puntos |
| ----------------------- | ------------------------------------------------------------------ | ------ |
| Helmet activo           | Al menos 4 headers de seguridad presentes en las respuestas        | 25     |
| Rate limiting funcional | 429 después del límite configurado en /auth                        | 25     |
| CORS restrictivo        | Origen no permitido recibe error, origen permitido funciona        | 20     |
| Validación Zod          | Entrada inválida retorna 400 con detalles; SQL injection bloqueada | 20     |
| Secretos en .env        | JWT_SECRET no hardcodeado, .env en .gitignore                      | 10     |

---

## 🔗 Siguiente paso

→ [Proyecto Semana 08 — Capa de Seguridad en Tu Dominio](../3-proyecto/proyecto-semana-08.md)
