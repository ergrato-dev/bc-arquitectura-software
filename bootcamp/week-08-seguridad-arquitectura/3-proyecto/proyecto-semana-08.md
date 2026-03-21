# 🔐 Proyecto Semana 08 — Capa de Seguridad en Tu Dominio

> **Fecha de entrega**: Al finalizar la semana 08
> **Modalidad**: Individual
> **Repositorio base**: Continúa sobre **tu proyecto personal** de las semanas anteriores

> ⚠️ **Política anticopia**: Cada aprendiz trabaja con su dominio asignado en semana 01. Las entidades, rutas, roles y reglas de acceso deben corresponder a **tu** dominio. El reto de la semana (EduFlow Secure) es el ejemplo didáctico, no el entregable.

---

## 🎯 Descripción

Agrega una **capa de seguridad completa** a la API de **tu proyecto personal**. Al finalizar, todas las rutas estarán protegidas con autenticación JWT, la autorización estará controlada por roles (RBAC) propios de tu dominio, y la API resistirá los principales ataques del OWASP Top 10.

**Al finalizar tendrás:**

- Registro y login con contraseñas hasheadas (bcrypt)
- Tokens JWT para autenticación sin estado
- Roles y permisos definidos según la lógica de tu negocio (RBAC)
- Hardening: headers seguros (Helmet), rate limiting, CORS, validación de entrada (Zod)
- Variables de entorno y secretos correctamente gestionados

---

## 🏗️ Arquitectura Objetivo

La seguridad se incorpora como una capa transversal en tu arquitectura hexagonal existente. Adapta los nombres a **tu dominio**:

```
[tu-dominio]/
├── src/
│   ├── domain/
│   │   └── ...                          (sin cambios — el dominio NO conoce seguridad)
│   ├── application/
│   │   ├── use-cases/
│   │   │   ├── register-user.use-case.js   ← Nuevo: registro con bcrypt
│   │   │   └── login-user.use-case.js      ← Nuevo: login + JWT
│   │   └── ports/secondary/
│   │       └── token.service.port.js       ← Puerto para firmar/verificar tokens
│   ├── infrastructure/
│   │   ├── security/
│   │   │   ├── token.service.js            ← Implementación JWT (jsonwebtoken)
│   │   │   ├── password.service.js         ← bcrypt hash + compare
│   │   │   └── rate-limiter.js             ← express-rate-limit configurado
│   │   └── repositories/
│   │       └── postgres-user.repository.js ← Repositorio de usuarios
│   └── interfaces/
│       └── http/
│           ├── middlewares/
│           │   ├── authenticate.js         ← Verifica JWT → req.user
│           │   ├── authorize.js            ← Verifica rol → 403 si no autorizado
│           │   └── validate.js             ← Zod schema → 400 si inválido
│           ├── auth.controller.js          ← POST /auth/register, /auth/login
│           └── [entidad-principal].controller.js  ← Rutas protegidas
├── .env.example                            ← JWT_SECRET, BCRYPT_ROUNDS, etc.
└── tests/
    └── security/
        ├── token.service.test.js
        └── authorize.middleware.test.js
```

**Antes de implementar**, define la matriz de roles de **tu dominio**:

| Rol       | ¿Quién es?                            | Acciones permitidas                         |
| --------- | ------------------------------------- | ------------------------------------------- |
| `[ROL_1]` | ej: cliente, paciente, lector         | ej: ver su propio perfil, crear solicitudes |
| `[ROL_2]` | ej: empleado, veterinario, instructor | ej: gestionar recursos de su área           |
| `[ROL_3]` | admin                                 | todo lo anterior + gestión de usuarios      |

---

## 📝 Entregables

### 1. Gestión de Usuarios y Contraseñas

Implementa el registro y login usando los puertos de tu arquitectura hexagonal. El `password.service.js` y `token.service.js` son adaptadores secundarios:

```javascript
// src/infrastructure/security/password.service.js
import bcrypt from "bcrypt";
import { config } from "../../config.js";

export class PasswordService {
  async hash(plainText) {
    return bcrypt.hash(plainText, config.bcryptRounds);
  }

  async compare(plainText, hashed) {
    return bcrypt.compare(plainText, hashed);
  }
}
```

```javascript
// src/infrastructure/security/token.service.js
import jwt from "jsonwebtoken";
import { config } from "../../config.js";

export class TokenService {
  // Adapta los campos del payload a los datos relevantes de TU dominio
  sign(payload) {
    // payload: { userId, role, [campoExtra: si aplica] }
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn ?? "15m",
      issuer: config.appName, // ← usa el nombre de TU app
    });
  }

  verify(token) {
    return jwt.verify(token, config.jwtSecret); // lanza si expirado/inválido
  }
}
```

```javascript
// src/application/use-cases/register-user.use-case.js
export class RegisterUserUseCase {
  #userRepository;
  #passwordService;

  constructor({ userRepository, passwordService }) {
    this.#userRepository = userRepository;
    this.#passwordService = passwordService;
  }

  async execute({ email, password, role }) {
    const existing = await this.#userRepository.findByEmail(email);
    if (existing) throw new Error("Email ya registrado");

    // Nunca almacenes contraseñas en texto plano
    const passwordHash = await this.#passwordService.hash(password);
    return this.#userRepository.save({ email, passwordHash, role });
  }
}
```

```javascript
// src/application/use-cases/login-user.use-case.js
export class LoginUserUseCase {
  #userRepository;
  #passwordService;
  #tokenService;

  constructor({ userRepository, passwordService, tokenService }) {
    this.#userRepository = userRepository;
    this.#passwordService = passwordService;
    this.#tokenService = tokenService;
  }

  async execute({ email, password }) {
    const user = await this.#userRepository.findByEmail(email);

    // Mensaje genérico: no revelar si el email existe o no (OWASP A07)
    const GENERIC_ERROR = "Credenciales incorrectas";
    if (!user) throw new Error(GENERIC_ERROR);

    const valid = await this.#passwordService.compare(
      password,
      user.passwordHash,
    );
    if (!valid) throw new Error(GENERIC_ERROR);

    // Incluye en el payload solo lo necesario para la autorización
    const token = this.#tokenService.sign({
      userId: user.id,
      role: user.role,
    });

    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }
}
```

---

### 2. Middlewares de Seguridad

```javascript
// src/interfaces/http/middlewares/authenticate.js
import { TokenService } from "../../../infrastructure/security/token.service.js";

const tokenService = new TokenService();

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }

  try {
    const token = header.slice(7);
    req.user = tokenService.verify(token); // { userId, role, iat, exp }
    next();
  } catch {
    // No enviar detalles del error al cliente (OWASP A09)
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};
```

```javascript
// src/interfaces/http/middlewares/authorize.js
// Fábrica de middleware: authorize('[ROL_REQUERIDO]')
export const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    // Adapta los roles al modelo de tu dominio
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para esta acción" });
    }

    next();
  };

// Uso en tus rutas:
// router.get('/recurso-sensible', authenticate, authorize('[ROL_1]', '[ROL_2]'), controller.list);
```

```javascript
// src/interfaces/http/middlewares/validate.js
// Fábrica de middleware: validate(zodSchema)
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Datos de entrada inválidos",
      // Devuelve los errores de validación al cliente (útil para UX)
      details: result.error.flatten().fieldErrors,
    });
  }

  // Reemplaza req.body con el valor parseado/sanitizado por Zod
  req.body = result.data;
  next();
};
```

---

### 3. Hardening HTTP

```javascript
// src/interfaces/http/app.js
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { config } from "../../config.js";

// Límites específicos para endpoints sensibles
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máx 10 intentos de login por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos, intenta en 15 minutos" },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Lista blanca de orígenes permitidos — ajusta según tu deploy
const allowedOrigins = (config.allowedOrigins ?? "http://localhost:5173").split(
  ",",
);

export const createApp = () => {
  const app = express();

  // Headers de seguridad (OWASP A05)
  app.use(helmet());

  // CORS restrictivo — solo orígenes explícitamente permitidos
  app.use(
    cors({
      origin(origin, callback) {
        // Permitir llamadas sin origin (ej: curl, Postman en dev)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Origen no permitido: ${origin}`));
        }
      },
      credentials: true,
    }),
  );

  // Limitar tamaño del body (OWASP A03 — evitar payloads gigantes)
  app.use(express.json({ limit: "100kb" }));

  // Health check (sin autenticación, sin rate limit)
  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  // Rate limit para autenticación
  app.use("/auth", authLimiter);

  // Rate limit general para la API
  app.use("/api", apiLimiter);

  // TODO: registra aquí los routers de TU dominio
  // app.use('/auth', authRouter);
  // app.use('/api/[entidad-principal]', authenticate, [entidadPrincipal]Router);

  return app;
};
```

---

### 4. Variables de Entorno y Configuración

```javascript
// src/config.js — 12-Factor III: toda la config desde env
import { z } from "zod";

// Esquema de validación de configuración (falla rápido si falta algo crítico)
const configSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET debe tener al menos 32 caracteres"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  BCRYPT_ROUNDS: z.coerce.number().min(10).default(12),
  ALLOWED_ORIGINS: z.string().default("http://localhost:5173"),
  APP_NAME: z.string().default("[tu-dominio]-api"),
});

const parsed = configSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Variables de entorno inválidas:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = {
  port: parsed.data.PORT,
  nodeEnv: parsed.data.NODE_ENV,
  databaseUrl: parsed.data.DATABASE_URL,
  jwtSecret: parsed.data.JWT_SECRET,
  jwtExpiresIn: parsed.data.JWT_EXPIRES_IN,
  bcryptRounds: parsed.data.BCRYPT_ROUNDS,
  allowedOrigins: parsed.data.ALLOWED_ORIGINS,
  appName: parsed.data.APP_NAME,
};
```

```bash
# .env.example — copia a .env y rellena valores reales
# NUNCA hagas commit del archivo .env real

# Base de datos
DATABASE_URL=postgres://[tu-dominio]:CAMBIAR_ESTO@localhost:5432/[tu-dominio]

# API
PORT=3000
NODE_ENV=development
APP_NAME=[tu-dominio]-api

# JWT — genera con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=CAMBIAR_ESTO_MINIMO_32_CARACTERES_ALEATORIOS
JWT_EXPIRES_IN=15m

# bcrypt
BCRYPT_ROUNDS=12

# CORS — lista separada por comas
ALLOWED_ORIGINS=http://localhost:5173
```

---

### 5. Tests de Seguridad (sin BD, sin servidor)

```javascript
// tests/security/token.service.test.js
import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { TokenService } from "../../src/infrastructure/security/token.service.js";

// Configurar env mínimo para los tests
process.env.JWT_SECRET = "test-secret-de-al-menos-32-caracteres-para-testing";
process.env.APP_NAME = "[tu-dominio]-test";

describe("TokenService", () => {
  let tokenService;

  before(() => {
    tokenService = new TokenService();
  });

  it("firma y verifica un token válido", () => {
    const payload = { userId: "123", role: "[ROL_1]" };
    const token = tokenService.sign(payload);

    assert.ok(typeof token === "string", "El token debe ser un string");
    assert.ok(
      token.split(".").length === 3,
      "El token JWT debe tener 3 segmentos",
    );

    const decoded = tokenService.verify(token);
    assert.strictEqual(decoded.userId, payload.userId);
    assert.strictEqual(decoded.role, payload.role);
  });

  it("lanza error en token manipulado", () => {
    const token = tokenService.sign({ userId: "123", role: "[ROL_1]" });
    const tampered = token.slice(0, -5) + "xxxxx";

    assert.throws(
      () => tokenService.verify(tampered),
      /invalid signature|jwt malformed/i,
    );
  });
});
```

```javascript
// tests/security/authorize.middleware.test.js
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { authorize } from "../../src/interfaces/http/middlewares/authorize.js";

describe("authorize middleware", () => {
  // Helper para simular req/res/next
  const makeCtx = (role) => ({
    req: { user: role ? { userId: "1", role } : undefined },
    res: {
      status(s) {
        this._status = s;
        return this;
      },
      json(b) {
        this._body = b;
        return this;
      },
    },
    next: () => {
      this.called = true;
    },
  });

  it("permite acceso a rol autorizado", () => {
    const ctx = makeCtx("[ROL_2]");
    let nextCalled = false;
    authorize("[ROL_1]", "[ROL_2]")(ctx.req, ctx.res, () => {
      nextCalled = true;
    });
    assert.ok(nextCalled, "next() debe llamarse para rol autorizado");
  });

  it("retorna 403 para rol no autorizado", () => {
    const ctx = makeCtx("[ROL_1]");
    authorize("[ROL_2]")(ctx.req, ctx.res, () => {});
    assert.strictEqual(ctx.res._status, 403);
  });

  it("retorna 401 sin usuario autenticado", () => {
    const ctx = makeCtx(null);
    authorize("[ROL_1]")(ctx.req, ctx.res, () => {});
    assert.strictEqual(ctx.res._status, 401);
  });
});
```

---

## 📊 Entregables

| Entregable                                 | Descripción                                                                    | Peso |
| ------------------------------------------ | ------------------------------------------------------------------------------ | ---- |
| `PasswordService` + `TokenService`         | bcrypt y JWT correctamente implementados como adaptadores secundarios          | 20%  |
| `RegisterUserUseCase` + `LoginUserUseCase` | Registro y login con mensajes de error genéricos (sin revelar info)            | 20%  |
| Middlewares de seguridad                   | `authenticate`, `authorize`, `validate` + hardening (Helmet, rate limit, CORS) | 30%  |
| Tests de seguridad                         | Mínimo 8 pruebas sin BD: TokenService, authorize, validate                     | 20%  |
| `.env.example` + `config.js` con Zod       | Configuración validada, sin secretos en código                                 | 10%  |

---

## ✅ Criterios de éxito

```bash
# 1. Tests pasan sin BD
node --test tests/security/
# Resultado esperado (con nombres de TU dominio):
# ✓ TokenService - firma y verifica un token válido
# ✓ TokenService - lanza error en token manipulado
# ✓ authorize middleware - permite acceso a rol autorizado
# ✓ authorize middleware - retorna 403 para rol no autorizado
# ✓ authorize middleware - retorna 401 sin usuario autenticado
# ... (mínimo 8 pruebas)
# Duration: < 2000ms

# 2. Headers de seguridad presentes
curl -I http://localhost:3000/health
# Debe incluir: x-content-type-options, x-frame-options, strict-transport-security

# 3. Rate limiting activo en /auth
for i in {1..15}; do curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"x@x.com","password":"wrong"}'; done
# Las últimas respuestas deben ser 429 Too Many Requests

# 4. .env no está en el repositorio
git ls-files .env  # Debe estar vacío (no trackeado)
```

> ⚠️ Los nombres de los roles, entidades y rutas deben reflejar **tu dominio asignado**, no EduFlow ni ningún dominio ajeno.

---

## 💡 Recursos de apoyo

- [Teoría: Fundamentos CIA](../1-teoria/01-seguridad-fundamentos-cia.md)
- [Teoría: Autenticación y Autorización](../1-teoria/02-autenticacion-autorizacion.md)
- [Teoría: OWASP Top 10 para Arquitectos](../1-teoria/03-owasp-top10-arquitectos.md)
- [Teoría: Seguridad en Node.js](../1-teoria/04-seguridad-nodejs-implementacion.md)
- [Práctica 01: JWT Auth](../2-practicas/01-practica-jwt-autenticacion.md)
- [Práctica 02: RBAC](../2-practicas/02-practica-rbac-autorizacion.md)
- [Práctica 03: Hardening OWASP](../2-practicas/03-practica-hardening-owasp.md)

---

## 🔗 Navegación

← [Semana 08 — Inicio](../README.md) | [Práctica 03 — Hardening](../2-practicas/03-practica-hardening-owasp.md)
