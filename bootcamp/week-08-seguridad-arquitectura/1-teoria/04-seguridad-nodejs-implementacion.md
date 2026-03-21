# ⚙️ Implementación Segura en Node.js

> _"El código seguro no es más lento ni más difícil de escribir — es una cuestión de hábito y herramientas correctas."_

---

## 🎯 ¿Qué cubrimos en esta sección?

Los módulos teóricos anteriores cubrieron los conceptos: CIA Triad, JWT, OAuth 2.0, RBAC y OWASP. Ahora consolidamos las **herramientas y patrones concretos** para implementar seguridad en una API Express.js, integrando todo en la arquitectura hexagonal de EduFlow.

---

## 🪖 Helmet.js — Headers de Seguridad HTTP

### ¿Qué es?

Helmet.js es un middleware de Express que configura automáticamente **cabeceras HTTP de seguridad**. Por defecto, los navegadores y los frameworks no agregan estas cabeceras.

### ¿Para qué sirve?

Mitiga automáticamente:

- **Clickjacking** (X-Frame-Options)
- **MIME-type sniffing** (X-Content-Type-Options)
- **XSS** básico (Content-Security-Policy)
- **Protocol downgrade** (HSTS — solo si usas HTTPS)

```bash
pnpm add helmet
```

```javascript
// src/infrastructure/http/app.js

import express from "express";
import helmet from "helmet";

const app = express();

// Sin Helmet — headers por defecto de Express:
// X-Powered-By: Express          ← Revela el stack al atacante

// Con Helmet — headers añadidos automáticamente:
// Content-Security-Policy: default-src 'self'; ...
// Cross-Origin-Opener-Policy: same-origin
// Cross-Origin-Resource-Policy: same-origin
// Origin-Agent-Cluster: ?1
// Referrer-Policy: no-referrer
// Strict-Transport-Security: max-age=15552000; includeSubDomains
// X-Content-Type-Options: nosniff
// X-DNS-Prefetch-Control: off
// X-Download-Options: noopen
// X-Frame-Options: SAMEORIGIN
// X-Permitted-Cross-Domain-Policies: none
// X-XSS-Protection: 0

app.use(helmet());

// Configuración más específica para una API:
app.use(
  helmet({
    // API REST normalmente no sirve HTML, puede relajar CSP
    contentSecurityPolicy: false, // Si solo exposmos JSON

    // Informar al navegador que siempre use HTTPS (si tienes HTTPS)
    hsts:
      process.env.NODE_ENV === "production"
        ? { maxAge: 31536000, includeSubDomains: true }
        : false,
  }),
);
```

---

## 🚦 Rate Limiting — Protección contra Fuerza Bruta

### ¿Qué es?

Limita cuántas requests puede hacer un cliente en un período de tiempo. Esencial para:

- Prevenir ataques de **fuerza bruta** en login
- Prevenir **abuso de API** (scraping, spam)
- Contribuir a la **disponibilidad** (triada CIA)

```bash
pnpm add express-rate-limit
```

```javascript
// src/infrastructure/http/middlewares/rate-limiter.js

import rateLimit from "express-rate-limit";

/**
 * Rate limiter estricto para endpoints de autenticación
 * Máximo 5 intentos por IP en 15 minutos
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  standardHeaders: "draft-7", // Incluir headers RateLimit en response
  legacyHeaders: false,
  message: {
    error: "Demasiados intentos. Por favor espera 15 minutos.",
    retryAfter: "15 minutos",
  },
  // Función personalizada para identificar al cliente (por defecto: req.ip)
  keyGenerator: (req) => req.ip,

  // Handler cuando se excede el límite
  handler: (req, res, next, options) => {
    // Log del evento para monitoreo de seguridad
    console.warn({
      event: "rate_limit.exceeded",
      ip: req.ip,
      endpoint: req.path,
      timestamp: new Date().toISOString(),
    });
    res.status(options.statusCode).json(options.message);
  },
});

/**
 * Rate limiter general para la API
 * Máximo 100 requests por IP en 15 minutos
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes. Por favor espera." },
});

// Uso:
// app.use('/api', apiRateLimiter);
// app.use('/auth/login', authRateLimiter);
// app.use('/auth/register', authRateLimiter);
```

> 📌 **En producción con múltiples instancias**: usar Redis como store para el rate limiter (`rate-limit-redis`) para que los contadores sean compartidos entre instancias.

---

## 🌐 CORS Seguro

### ¿Qué es CORS?

Cross-Origin Resource Sharing. Los navegadores bloquean requests de un origen diferente al del servidor. CORS es el mecanismo para **habilitar selectivamente** el acceso desde orígenes específicos.

```bash
pnpm add cors
```

```javascript
// src/infrastructure/http/middlewares/cors-config.js

import cors from "cors";

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") ?? [];

// En desarrollo, puede ser: http://localhost:5173,http://localhost:3001
// En producción: https://app.eduflow.com,https://admin.eduflow.com

export const corsMiddleware = cors({
  // ❌ cors({ origin: '*' }) — Permite CUALQUIER origen (inseguro para APIs con auth)

  // ✅ Lista blanca explícita
  origin: (origin, callback) => {
    // Permitir requests sin origin (Postman, scripts del server)
    if (!origin) return callback(null, true);

    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origen no permitido: ${origin}`));
    }
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],

  // Permite enviar cookies en requests cross-origin
  credentials: true,

  // Duración del preflight cache (OPTIONS request)
  maxAge: 86400, // 24 horas
});
```

---

## ✅ Validación de Entradas con Zod

### ¿Por qué validar entradas?

**Toda entrada del usuario es potencialmente maliciosa**. La validación previene:

- A03 (Injection): datos malformados que rompen consultas o comandos
- A08 (Integrity): datos con estructura inesperada

```bash
pnpm add zod
```

```javascript
// src/infrastructure/http/validators/auth-validators.js

import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Email inválido").max(255, "Email demasiado largo"),

  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .max(72, "Máximo 72 caracteres") // bcrypt trunca a 72 bytes
    .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
    .regex(/[0-9]/, "Debe tener al menos un número"),

  role: z.enum(["student", "instructor"]).default("student"), // Los admins NO se registran desde la API pública
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createCourseSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  description: z.string().max(2000).optional(),
  instructorId: z.string().uuid(),
});

// Middleware genérico de validación
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Datos inválidos",
      details: result.error.flatten().fieldErrors,
    });
  }

  // Reemplazar req.body con los datos validados y sanitizados
  req.body = result.data;
  next();
};

// Uso:
// router.post('/register', validate(registerSchema), authController.register);
```

---

## 🔐 Gestión Segura de Secretos

### El problema del secreto en el código

```javascript
// ❌ MUY MAL — Secreto en código fuente (va a Git, visible para todos)
const JWT_SECRET = "super-secret-jwt-key-2024";

// ❌ MAL — En variable de entorno sin documentar
const JWT_SECRET = process.env.JWT_SECRET; // ¿Qué valor debe tener?

// ✅ BIEN — Variable de entorno con fallback seguro y documentación
```

```javascript
// src/infrastructure/config/environment.js

import { z } from "zod";

// Schema de validación de variables de entorno al arrancar
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.string().default("3000").transform(Number),

  // Base de datos
  DATABASE_URL: z.string().url("DATABASE_URL debe ser una URL válida"),

  // JWT — validar que tienen longitud suficiente
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET debe tener al menos 32 caracteres"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),

  // CORS
  ALLOWED_ORIGINS: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Si las variables de entorno no son válidas, no iniciar la aplicación
  console.error("❌ Variables de entorno inválidas:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1); // Fail fast: mejor no iniciar que iniciar inseguro
}

export const env = parsed.data;
```

```bash
# .env (NUNCA commitear, en .gitignore)
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://eduflow_app:password@localhost:5432/eduflow

# Generar con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6f7a8b9

JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

```
# .env.example (SÍ commitear — documentación sin valores reales)
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Generar con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Orígenes permitidos para CORS (separados por coma)
ALLOWED_ORIGINS=http://localhost:5173
```

---

## 🏗️ Integración en la Arquitectura Hexagonal

### ¿Dónde va cada cosa?

```
src/
├── domain/
│   ├── user.js                         # Entidad User (email, passwordHash, role)
│   └── user-repository.js              # Puerto (interfaz)
│
├── application/
│   └── auth-application-service.js     # Casos de uso: register, login, refresh
│
├── infrastructure/
│   ├── config/
│   │   └── environment.js              # Validación de env vars al arrancar
│   │
│   ├── http/
│   │   ├── app.js                      # Setup Express + middlewares globales
│   │   ├── auth-router.js              # Rutas /auth/*
│   │   ├── course-router.js            # Rutas /courses (ahora con auth)
│   │   │
│   │   ├── middlewares/
│   │   │   ├── authenticate.js         # Verifica JWT
│   │   │   ├── authorize.js            # Verifica rol
│   │   │   ├── cors-config.js          # CORS restrictivo
│   │   │   └── rate-limiter.js         # Rate limiting
│   │   │
│   │   └── validators/
│   │       ├── auth-validators.js      # Schemas de validación para auth
│   │       └── course-validators.js    # Schemas para cursos
│   │
│   ├── auth/
│   │   └── token-service.js            # JWT: generación y verificación
│   │
│   └── persistence/
│       └── postgres-user-repository.js # Adaptador PostgreSQL para User
```

### El app.js actualizado

```javascript
// src/infrastructure/http/app.js

import express from "express";
import helmet from "helmet";
import { corsMiddleware } from "./middlewares/cors-config.js";
import { apiRateLimiter } from "./middlewares/rate-limiter.js";
import { AuthRouter } from "./auth-router.js";
import { CourseRouter } from "./course-router.js";
import { EnrollmentRouter } from "./enrollment-router.js";

export const createApp = ({
  authService,
  courseService,
  enrollmentService,
}) => {
  const app = express();

  // ─── Seguridad (primer middleware) ─────────────────────────────
  app.use(helmet());
  app.use(corsMiddleware);

  // ─── Parsing ────────────────────────────────────────────────────
  app.use(express.json({ limit: "10kb" })); // Limitar tamaño del body

  // ─── Rate limiting global ──────────────────────────────────────
  app.use("/api", apiRateLimiter);

  // ─── Rutas ──────────────────────────────────────────────────────
  app.use("/auth", new AuthRouter(authService).router);
  app.use("/api/courses", new CourseRouter(courseService).router);
  app.use("/api/enrollments", new EnrollmentRouter(enrollmentService).router);

  // ─── Health check (sin auth, para Docker/K8s) ──────────────────
  app.get("/health", (req, res) => res.json({ status: "ok" }));

  // ─── Manejo de errores (último middleware) ────────────────────
  app.use((err, req, res, next) => {
    // Solo mostrar stack en desarrollo
    if (process.env.NODE_ENV !== "production") {
      console.error(err);
    }
    res.status(err.status ?? 500).json({
      error: err.message ?? "Error interno del servidor",
    });
  });

  return app;
};
```

---

## 🔍 Auditoría de Dependencias

```bash
# Revisar vulnerabilidades en dependencias
pnpm audit

# Solo mostrar vulnerabilidades de nivel high o critical
pnpm audit --audit-level=high

# Intentar corregir automáticamente (solo actualiza versiones compatibles)
pnpm audit fix

# Ver todas las dependencias desactualizadas
pnpm outdated

# Actualizar a versiones patch/minor compatibles
pnpm update
```

### Checklist de Seguridad para EduFlow

```javascript
// scripts/security-check.js — Ejecutar antes de cada deploy

const checks = [
  {
    name: "JWT_SECRET configurado",
    check: () => process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32,
  },
  {
    name: "NODE_ENV configurado",
    check: () =>
      ["development", "production", "test"].includes(process.env.NODE_ENV),
  },
  {
    name: "DATABASE_URL sin credenciales hardcodeadas",
    check: () => !process.env.DATABASE_URL?.includes("password"), // simplificado
  },
];

checks.forEach(({ name, check }) => {
  const passed = check();
  console.log(`${passed ? "✅" : "❌"} ${name}`);
  if (!passed && process.env.NODE_ENV === "production") {
    process.exit(1);
  }
});
```

---

## 📋 Resumen de Herramientas

| Herramienta          | Propósito                     | Vulnerabilidades OWASP que mitiga          |
| -------------------- | ----------------------------- | ------------------------------------------ |
| `helmet`             | Headers HTTP de seguridad     | A05 (Misconfiguration)                     |
| `express-rate-limit` | Rate limiting                 | A04 (Insecure Design), A07 (Auth Failures) |
| `cors`               | Control de origen de requests | A05 (Misconfiguration)                     |
| `zod`                | Validación de entradas        | A03 (Injection), A08 (Integrity)           |
| `bcrypt`             | Hash de contraseñas           | A02 (Cryptographic Failures)               |
| `jsonwebtoken`       | Tokens de autenticación       | A07 (Auth Failures)                        |
| `pnpm audit`         | Audit de dependencias         | A06 (Vulnerable Components)                |

---

## 🔗 Navegación

**[← OWASP Top 10](03-owasp-top10-arquitectos.md)** | **[→ Prácticas](../2-practicas/01-practica-jwt-autenticacion.md)**

---

_Bootcamp de Arquitectura de Software — SENA · bc-channel-epti_
