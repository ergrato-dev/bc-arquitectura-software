# 🔑 Autenticación y Autorización: OAuth 2.0 y JWT

> _"Autenticación pregunta: ¿Quién eres? Autorización pregunta: ¿Qué puedes hacer?"_

---

## 🎯 La Confusión más Cara del Desarrollo

### ¿Qué es la diferencia?

|                  | Autenticación        | Autorización                                |
| ---------------- | -------------------- | ------------------------------------------- |
| **Pregunta**     | ¿Quién eres?         | ¿Qué puedes hacer?                          |
| **Verifica**     | Identidad            | Permisos                                    |
| **Respuesta**    | "Eres Ana Gómez"     | "Ana puede leer cursos pero no eliminarlos" |
| **Cuándo falla** | 401 Unauthorized     | 403 Forbidden                               |
| **Mecanismos**   | Password, JWT, OAuth | RBAC, ACL, ABAC                             |

**Ejemplo cotidiano:**

- En un aeropuerto, tu **pasaporte** te autentica (prueba que eres tú)
- Tu **tarjeta de embarque** te autoriza (acceso al vuelo específico)
- Pasar el control de seguridad da acceso a la zona de puertas de embarque, pero no a la cabina de piloto

### ¿Para qué sirve distinguirlos?

- **Arquitectura más limpia**: módulos separados con responsabilidades claras
- **Errores HTTP correctos**: 401 vs 403 tienen semánticas diferentes
- **Sistemas más seguros**: no mezclar "¿quién eres?" con "¿qué puedes hacer?"

---

## 🪙 JWT — JSON Web Tokens

<!-- Diagrama: 0-assets/02-jwt-estructura.svg -->

![JWT Estructura](../0-assets/02-jwt-estructura.svg)

### ¿Qué es un JWT?

Un JWT (JSON Web Token, pronunciado "yot") es un **estándar abierto (RFC 7519)** para transmitir información de forma compacta y segura como un objeto JSON. La información puede ser **verificada y confiada** porque está firmada digitalmente.

### Anatomía de un JWT

Un JWT tiene tres partes separadas por `.`:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAwOTAwfQ.V8YEZUgT7YkBwJHD4vB9lQe8hfnKpOLzON-Hhf2ABNE

PARTE 1: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
         ↑ Header (algoritmo y tipo)

PARTE 2: eyJ1c2VySWQiOiIxMjMiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAwOTAwfQ
         ↑ Payload (datos del usuario)

PARTE 3: V8YEZUgT7YkBwJHD4vB9lQe8hfnKpOLzON-Hhf2ABNE
         ↑ Signature (verificación de integridad)
```

#### Header (decodificado en base64):

```json
{
  "alg": "HS256", // Algoritmo de firma: HMAC-SHA256
  "typ": "JWT" // Tipo de token
}
```

#### Payload (decodificado en base64):

```json
{
  "userId": "123",
  "role": "student",
  "iat": 1700000000, // Issued At: cuándo se creó
  "exp": 1700000900 // Expiration: cuándo expira (15 min después)
}
```

#### Signature:

```
HMAC-SHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  JWT_SECRET
)
```

> ⚠️ **El payload NO es secreto** — solo está codificado en base64, no cifrado. Cualquiera puede decodificarlo. Lo que garantiza la **integridad** es la firma.

---

### Implementación en Node.js

```javascript
// src/infrastructure/auth/token-service.js

import jwt from "jsonwebtoken";
import crypto from "node:crypto";

// El secreto debe tener mínimo 256 bits de entropía
// Generar con: node -e "console.log(crypto.randomBytes(64).toString('hex'))"
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "15m";
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN ?? "7d";

export class TokenService {
  /**
   * Genera un access token de corta duración
   * @param {Object} payload - Datos a incluir (userId, role)
   */
  generateAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: "eduflow-api", // Quién emite el token
      audience: "eduflow-client", // Para quién es el token
    });
  }

  /**
   * Genera un refresh token de larga duración (opaco, almacenado en BD)
   */
  generateRefreshToken() {
    return crypto.randomBytes(64).toString("hex");
  }

  /**
   * Verifica y decodifica un access token
   * @throws {JsonWebTokenError} Token inválido o manipulado
   * @throws {TokenExpiredError} Token expirado
   */
  verifyAccessToken(token) {
    return jwt.verify(token, JWT_SECRET, {
      issuer: "eduflow-api",
      audience: "eduflow-client",
    });
  }
}
```

---

### Middleware de Autenticación

```javascript
// src/infrastructure/http/middlewares/authenticate.js

import { TokenService } from "../auth/token-service.js";

const tokenService = new TokenService();

/**
 * Middleware: verifica que el request tiene un JWT válido
 * Agrega req.user con los datos del token si es válido
 */
export const authenticate = (req, res, next) => {
  // Obtener token del header Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Token de acceso requerido",
      hint: "Incluir header: Authorization: Bearer <token>",
    });
  }

  const token = authHeader.slice(7); // Remover "Bearer "

  try {
    const decoded = tokenService.verifyAccessToken(token);
    req.user = decoded; // { userId, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expirado",
        code: "TOKEN_EXPIRED", // El cliente puede usar esto para refrescar
      });
    }
    return res.status(401).json({ error: "Token inválido" });
  }
};
```

---

### Vulnerabilidades Comunes de JWT

#### 1. Algoritmo `none` (CVE crítica)

```javascript
// Un atacante puede crear un JWT con alg: "none" y sin firma
// Si el servidor acepta "alg: none", valida SIN verificar la firma

// ❌ VULNERABLE — Aceptar cualquier algoritmo
jwt.verify(token, secret);

// ✅ SEGURO — Especificar algoritmos permitidos
jwt.verify(token, secret, { algorithms: ["HS256"] });
```

#### 2. JWT Secret débil

```javascript
// ❌ MAL — Secreto adivinable por fuerza bruta
const JWT_SECRET = "secret";
const JWT_SECRET = "myapp";
const JWT_SECRET = "123456";

// ✅ BIEN — 512 bits de entropía aleatoria
// node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
const JWT_SECRET = process.env.JWT_SECRET;
// En .env: JWT_SECRET=a3f8b2c1... (128 caracteres hex)
```

#### 3. JWT sin expiración

```javascript
// ❌ MAL — Token que nunca expira
jwt.sign({ userId: "123" }, secret);

// ✅ BIEN — Siempre con expiración
jwt.sign({ userId: "123" }, secret, { expiresIn: "15m" });
```

---

### Access Token vs Refresh Token

```
CLIENTE                           SERVIDOR
  |                                  |
  |── POST /auth/login ─────────────>|
  |   { email, password }            |
  |                                  |
  |<── 200 OK ──────────────────────|
  |   {                              |
  |     accessToken: "eyJ..." (15m)  |
  |     refreshToken: "abc123" (7d)  |
  |   }                              |
  |                                  |
  |── GET /courses ─────────────────>|  (con accessToken)
  |<── 200 OK ──────────────────────|
  |                                  |
  |   ... 15 minutos después ...     |
  |                                  |
  |── GET /courses ─────────────────>|  accessToken expirado
  |<── 401 TOKEN_EXPIRED ───────────|
  |                                  |
  |── POST /auth/refresh ───────────>|  (con refreshToken)
  |<── 200 OK ──────────────────────|
  |   {                              |
  |     accessToken: "eyJ..." (nuevo)|  nuevo access token
  |     refreshToken: "xyz789" (nuevo)| refresh rotado (old invalidado)
  |   }                              |
```

La separación access/refresh token permite:

- **Access token corto (15m)**: si se filtra, expira pronto
- **Refresh token largo (7d)**: almacenado de forma segura, permite renovar sin re-login
- **Rotación de refresh token**: si alguien roba el refresh token y lo usa, el legítimo queda invalidado

---

## 🔐 Almacenamiento Seguro de Contraseñas

```javascript
// src/application/auth-application-service.js

import bcrypt from "bcrypt";

const SALT_ROUNDS = 12; // Factor de costo: 2^12 = 4096 iteraciones

export class AuthApplicationService {
  constructor({ userRepository, tokenService }) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }

  async register({ email, password, role = "student" }) {
    // 1. Validar que el email no existe
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error("Email ya registrado"); // No revelar si es el email o la contraseña
    }

    // 2. Hash con bcrypt (incluye salt automáticamente)
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // 3. Guardar usuario con el hash (NUNCA la contraseña)
    return this.userRepository.save({
      email,
      passwordHash,
      role,
    });
  }

  async login({ email, password }) {
    // 1. Buscar usuario
    const user = await this.userRepository.findByEmail(email);

    // 2. Comparación de tiempo constante (evita timing attacks)
    // bcrypt.compare tarda igual si el usuario existe o no
    const validPassword = user
      ? await bcrypt.compare(password, user.passwordHash)
      : await bcrypt.compare(password, "$2b$12$invalidhashpadding000000000000");
    // ↑ Si el usuario no existe, ejecutamos bcrypt igual (evita timing attack)

    if (!user || !validPassword) {
      throw new Error("Credenciales inválidas"); // Mismo mensaje para email Y contraseña inválidos
    }

    // 3. Generar tokens
    const accessToken = this.tokenService.generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = this.tokenService.generateRefreshToken();

    return { accessToken, refreshToken };
  }
}
```

---

## 🏷️ OAuth 2.0 — Autorización Delegada

<!-- Diagrama: 0-assets/03-oauth-flujo.svg -->

![OAuth 2.0 Flujo](../0-assets/03-oauth-flujo.svg)

### ¿Qué es OAuth 2.0?

OAuth 2.0 (RFC 6749) es un **protocolo de autorización** que permite a una aplicación obtener acceso limitado a una cuenta en otro servicio, **en nombre del usuario**, sin que el usuario entregue sus credenciales a la aplicación.

> **Importante**: OAuth 2.0 es autorización, NO autenticación. Para autenticación sobre OAuth 2.0 existe **OpenID Connect (OIDC)**.

### Los 4 Roles de OAuth 2.0

| Rol                      | Descripción                   | Ejemplo en EduFlow             |
| ------------------------ | ----------------------------- | ------------------------------ |
| **Resource Owner**       | El usuario dueño de los datos | Ana Gómez (estudiante)         |
| **Client**               | La app que quiere acceso      | EduFlow Frontend (SPA)         |
| **Authorization Server** | Quien emite tokens            | Auth0, Google, servidor propio |
| **Resource Server**      | La API con los datos          | EduFlow API (Express)          |

---

### Flujo Authorization Code con PKCE

Es el flujo recomendado para aplicaciones de una sola página (SPA) y aplicaciones móviles:

```
USUARIO    CLIENTE (SPA)         AUTH SERVER         RESOURCE SERVER
  |             |                     |                    |
  |─ click ─────>|                    |                    |
  |             |── Redirect ─────────>|                   |
  |             |  ?response_type=code |                   |
  |             |  &code_challenge=... |                   |
  |             |  (PKCE)              |                   |
  |             |                     |                   |
  |<── Login UI ─────────────────────|                   |
  |─ credentials ───────────────────>|                   |
  |                                  |                   |
  |<── Redirect con authorization_code ────────────────|
  |             |                    |                   |
  |─ code ──────>|                   |                   |
  |             |── POST /token ─────>|                  |
  |             |  code + code_verifier (PKCE)           |
  |             |<── access_token + id_token ───────────|
  |             |                    |                   |
  |             |── GET /courses ─────────────────────>|
  |             |  Authorization: Bearer <access_token>  |
  |             |<── 200 OK ──────────────────────────|
```

**¿Por qué PKCE?** Previene que un atacante intercepte el `authorization_code` y lo use para obtener tokens. El `code_verifier` (secreto generado por el cliente) transforma en `code_challenge` usando SHA-256. Sin el `code_verifier` original, el `authorization_code` robado es inútil.

---

## 🏛️ RBAC — Role-Based Access Control

<!-- Diagrama: 0-assets/04-rbac-modelo.svg -->

![RBAC Modelo](../0-assets/04-rbac-modelo.svg)

### ¿Qué es RBAC?

RBAC es un modelo de control de acceso donde los **permisos se asignan a roles**, y los **roles se asignan a usuarios**. Es el modelo más común en aplicaciones empresariales.

```
USUARIOS         ROLES              PERMISOS
─────────        ──────────         ──────────────────────
Ana Gómez   ──>  student     ──-->  courses:read
Carlos Ruiz ──>  instructor  ──-->  courses:create
                             ──-->  courses:read
María López ──>  admin       ──-->  courses:create
                             ──-->  courses:read
                             ──-->  courses:delete
                             ──-->  users:manage
```

### Implementación en Express.js

```javascript
// src/infrastructure/http/middlewares/authorize.js

/**
 * Middleware factory: verifica que el usuario tiene el rol requerido
 * Debe ejecutarse DESPUÉS del middleware authenticate
 *
 * @param {...string} allowedRoles - Roles que tienen acceso
 * @returns {Function} Middleware de Express
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user fue establecido por el middleware authenticate
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Sin permisos para esta acción",
        required: allowedRoles,
        current: req.user.role,
      });
    }

    next();
  };
};

// Uso en rutas:
// router.post('/', authenticate, authorize('instructor', 'admin'), createCourse);
// router.get('/', authenticate, getCourses);           // cualquier autenticado
// router.delete('/:id', authenticate, authorize('admin'), deleteCourse);
```

```javascript
// src/infrastructure/http/course-router.js

import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

export class CourseRouter {
  #router;
  #courseController;

  constructor(courseController) {
    this.#router = Router();
    this.#courseController = courseController;
    this.#setupRoutes();
  }

  #setupRoutes() {
    // Cualquier usuario autenticado puede ver cursos
    this.#router.get("/", authenticate, this.#courseController.getAll);

    // Solo instructores y admins pueden crear cursos
    this.#router.post(
      "/",
      authenticate,
      authorize("instructor", "admin"),
      this.#courseController.create,
    );

    // Solo admins pueden eliminar cursos
    this.#router.delete(
      "/:id",
      authenticate,
      authorize("admin"),
      this.#courseController.delete,
    );
  }

  get router() {
    return this.#router;
  }
}
```

---

### RBAC vs Otros Modelos

| Modelo                        | Descripción                      | Cuándo usar                                                           |
| ----------------------------- | -------------------------------- | --------------------------------------------------------------------- |
| **RBAC**                      | Permisos por rol                 | La mayoría de aplicaciones (por su simplicidad)                       |
| **ACL** (Access Control List) | Permisos por recurso individual  | "Ana puede editar solo el curso X"                                    |
| **ABAC** (Attribute-Based)    | Permisos por atributos dinámicos | "Solo usuarios de Colombia, en horario laboral, desde IP corporativa" |

Para EduFlow, **RBAC es suficiente**. ABAC agrega complejidad innecesaria en esta etapa.

---

## 📋 Resumen

| Concepto          | Descripción                             | Código clave                         |
| ----------------- | --------------------------------------- | ------------------------------------ |
| **JWT**           | Token firmado para transmitir identidad | `jwt.sign()` / `jwt.verify()`        |
| **Access Token**  | Token de corta duración (15min)         | `expiresIn: '15m'`                   |
| **Refresh Token** | Token largo, renovar access tokens      | `crypto.randomBytes(64)`             |
| **bcrypt**        | Hash de contraseñas con salt            | `bcrypt.hash()` / `bcrypt.compare()` |
| **OAuth 2.0**     | Autorización delegada a terceros        | Authorization Code + PKCE            |
| **RBAC**          | Permisos por rol                        | `authorize('admin', 'instructor')`   |
| **401**           | No autenticado                          | Sin token o token inválido           |
| **403**           | No autorizado                           | Token válido pero sin permiso        |

---

## 🔗 Navegación

**[← Fundamentos CIA](01-seguridad-fundamentos-cia.md)** | **[→ OWASP Top 10](03-owasp-top10-arquitectos.md)**

---

_Bootcamp de Arquitectura de Software — SENA · bc-channel-epti_
