# 🔐 Práctica 01 — JWT: Autenticación sin Estado

> **Tiempo estimado**: 40 minutos
> **Dificultad**: Intermedia
> **Requisitos**: Node.js 20+, `pnpm`, semana 06 completada

---

## 🎯 Objetivo

Implementar un sistema completo de registro y login con **JSON Web Tokens (JWT)** y contraseñas hasheadas con **bcrypt**, integrando los adaptadores de seguridad dentro de la arquitectura hexagonal.

Al terminar habrás:

- Comprendido la anatomía de un JWT y su ciclo de vida
- Implementado `PasswordService` con bcrypt
- Implementado `TokenService` con jsonwebtoken
- Creado los casos de uso `RegisterUserUseCase` y `LoginUserUseCase`
- Protegido rutas con el middleware `authenticate`

---

## 📋 Contexto: EduFlow Secure (referencia didáctica)

El CTO de EduFlow acaba de descubrir que la API expone datos de aprendices sin ninguna autenticación. Un pen-tester pudo acceder a todas las calificaciones con un simple `curl`. La misión es agregar JWT autenticación en las próximas horas.

> 💡 Este escenario de EduFlow es el **ejemplo guía** de la práctica. Los pasos que se muestran aquí te sirven para entender el patrón; los aplicarás a **tu propio proyecto** en el proyecto integrador.

---

## 🛠️ Setup

```bash
# Crea el directorio de práctica (usa el nombre de EduFlow solo para este ejercicio guiado)
mkdir practica-jwt-auth && cd practica-jwt-auth
pnpm init
pnpm add jsonwebtoken bcrypt zod
pnpm add -D @types/node

# Activa módulos ES
# En package.json agrega: "type": "module"
```

---

## Paso 1 — Entender la anatomía de un JWT (10 min)

Antes de escribir una sola línea de código, ejecuta este experimento:

```javascript
// experimento-jwt.js
import jwt from "jsonwebtoken";

const SECRET = "mi-secreto-solo-para-este-experimento";

// 1. Firmar un token
const token = jwt.sign(
  { userId: "u123", role: "student", nombre: "Ana García" },
  SECRET,
  { expiresIn: "5m", issuer: "eduflow-api" },
);

console.log("\n=== TOKEN GENERADO ===");
console.log(token);
console.log("\n=== PARTES DEL TOKEN ===");
const [header, payload, signature] = token.split(".");
console.log("Header  (base64url):", header);
console.log("Payload (base64url):", payload);
console.log("Signature (HMAC   ):", signature);

// 2. Decodificar SIN verificar (útil para debug, no uses en producción)
console.log("\n=== PAYLOAD DECODIFICADO ===");
console.log(JSON.parse(Buffer.from(payload, "base64url").toString()));

// 3. Verificar correctamente
const decoded = jwt.verify(token, SECRET);
console.log("\n=== VERIFICADO ===", decoded);

// 4. ¿Qué pasa con un token manipulado?
try {
  jwt.verify(token.slice(0, -4) + "xxxx", SECRET);
} catch (err) {
  console.log("\n=== TOKEN MANIPULADO ===", err.message);
}
```

```bash
node experimento-jwt.js
```

**Observa y responde**:

- ¿El payload está cifrado o solo codificado? ¿Por qué importa eso?
- ¿Qué contienen los campos `iat` y `exp`?
- ¿Qué error lanza el token manipulado? ¿Cómo lo manejarías en producción?

---

## Paso 2 — Password Service con bcrypt (10 min)

```javascript
// src/infrastructure/security/password.service.js
import bcrypt from "bcrypt";

// REGLA: las rondas de bcrypt deben venir de configuración, nunca hardcodeadas
const DEFAULT_ROUNDS = 12; // En tests usa 4 para velocidad, en prod mínimo 12

export class PasswordService {
  #rounds;

  constructor(rounds = DEFAULT_ROUNDS) {
    this.#rounds = rounds;
  }

  async hash(plainText) {
    // bcrypt incluye el salt en el hash resultante → no necesitas guardarlo por separado
    return bcrypt.hash(plainText, this.#rounds);
  }

  async compare(plainText, hashed) {
    // bcrypt.compare extrae el salt del hash para comparar → timing-safe
    return bcrypt.compare(plainText, hashed);
  }
}
```

**Experimento de tiempo de hash:**

```javascript
// experimento-bcrypt.js
import bcrypt from "bcrypt";

const password = "MiContraseña123!";

for (const rounds of [4, 8, 10, 12]) {
  const start = Date.now();
  const hash = await bcrypt.hash(password, rounds);
  const ms = Date.now() - start;
  console.log(`Rounds: ${rounds} → ${ms}ms → hash: ${hash.slice(0, 20)}...`);
}
```

```bash
node experimento-bcrypt.js
```

**Pregunta**: ¿Por qué no se recomienda subir más de 13 rondas en producción con muchos usuarios concurrentes?

---

## Paso 3 — Token Service (5 min)

```javascript
// src/infrastructure/security/token.service.js
import jwt from "jsonwebtoken";

export class TokenService {
  #secret;
  #expiresIn;
  #issuer;

  constructor({ secret, expiresIn = "15m", issuer = "api" }) {
    if (!secret || secret.length < 32) {
      throw new Error("JWT secret debe tener al menos 32 caracteres");
    }
    this.#secret = secret;
    this.#expiresIn = expiresIn;
    this.#issuer = issuer;
  }

  sign(payload) {
    // Nunca incluir información sensible en el payload (visible para todos)
    return jwt.sign(payload, this.#secret, {
      expiresIn: this.#expiresIn,
      issuer: this.#issuer,
    });
  }

  verify(token) {
    // Lanza JsonWebTokenError o TokenExpiredError si es inválido
    return jwt.verify(token, this.#secret, { issuer: this.#issuer });
  }
}
```

---

## Paso 4 — Casos de uso (10 min)

```javascript
// src/application/use-cases/register-user.use-case.js
export class RegisterUserUseCase {
  #userRepository;
  #passwordService;

  constructor({ userRepository, passwordService }) {
    this.#userRepository = userRepository;
    this.#passwordService = passwordService;
  }

  async execute({ email, password, role = "student" }) {
    // Validar que el email no exista antes de hashear (costoso)
    const existing = await this.#userRepository.findByEmail(email);
    if (existing) {
      throw new Error("Email ya registrado");
    }

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
    // OWASP A07: mensaje de error genérico para no revelar si el email existe
    const GENERIC_ERROR = "Credenciales incorrectas";

    const user = await this.#userRepository.findByEmail(email);
    if (!user) throw new Error(GENERIC_ERROR);

    const isValid = await this.#passwordService.compare(
      password,
      user.passwordHash,
    );
    if (!isValid) throw new Error(GENERIC_ERROR);

    const token = this.#tokenService.sign({
      userId: user.id,
      role: user.role,
    });

    return {
      token,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}
```

---

## Paso 5 — Middleware authenticate (5 min)

```javascript
// src/interfaces/http/middlewares/authenticate.js
import { TokenService } from "../../../infrastructure/security/token.service.js";
import { config } from "../../../config.js";

// Una sola instancia de TokenService (singleton implícito del módulo)
const tokenService = new TokenService({
  secret: config.jwtSecret,
  expiresIn: config.jwtExpiresIn,
  issuer: config.appName,
});

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de acceso requerido" });
  }

  try {
    const token = authHeader.slice(7); // Quitar "Bearer "
    req.user = tokenService.verify(token);
    next();
  } catch (err) {
    // OWASP A09: no revelar detalles del error al cliente
    const isExpired = err.name === "TokenExpiredError";
    res.status(401).json({
      error: isExpired ? "Token expirado" : "Token inválido",
    });
  }
};
```

---

## Paso 6 — Tests sin BD (10 min)

```javascript
// tests/security/token.service.test.js
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { TokenService } from "../../src/infrastructure/security/token.service.js";

const tokenService = new TokenService({
  secret: "test-secret-de-al-menos-32-caracteres-para-prueba",
  expiresIn: "1m",
  issuer: "test-api",
});

describe("TokenService", () => {
  it("firma y verifica un token válido", () => {
    const payload = { userId: "u1", role: "student" };
    const token = tokenService.sign(payload);

    assert.ok(typeof token === "string");
    assert.strictEqual(
      token.split(".").length,
      3,
      "Debe tener 3 segmentos JWT",
    );

    const decoded = tokenService.verify(token);
    assert.strictEqual(decoded.userId, "u1");
    assert.strictEqual(decoded.role, "student");
  });

  it("lanza JsonWebTokenError en token manipulado", () => {
    const token = tokenService.sign({ userId: "u1" });
    const tampered = token.slice(0, -3) + "abc";

    assert.throws(
      () => tokenService.verify(tampered),
      /invalid signature|jwt malformed/i,
    );
  });

  it("rechaza tokens de otro emisor", () => {
    const otherService = new TokenService({
      secret: "test-secret-de-al-menos-32-caracteres-para-prueba",
      expiresIn: "1m",
      issuer: "otro-api",
    });
    const token = otherService.sign({ userId: "u1" });

    assert.throws(() => tokenService.verify(token), /jwt issuer invalid/i);
  });
});
```

```javascript
// tests/security/password.service.test.js
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PasswordService } from "../../src/infrastructure/security/password.service.js";

// Usar 4 rondas en tests para velocidad
const passwordService = new PasswordService(4);

describe("PasswordService", () => {
  it("genera un hash diferente al texto plano", async () => {
    const plain = "MiContraseña123!";
    const hash = await passwordService.hash(plain);

    assert.notStrictEqual(hash, plain);
    assert.ok(hash.startsWith("$2b$"), "Debe ser un hash bcrypt");
  });

  it("verifica correctamente la contraseña", async () => {
    const plain = "MiContraseña123!";
    const hash = await passwordService.hash(plain);

    assert.ok(await passwordService.compare(plain, hash));
    assert.ok(!(await passwordService.compare("otra-clave", hash)));
  });
});
```

```bash
node --test tests/security/
```

---

## ✅ Rúbrica de evaluación

| Criterio              | Descripción                                                    | Puntos |
| --------------------- | -------------------------------------------------------------- | ------ |
| Arquitectura correcta | `PasswordService` y `TokenService` son adaptadores secundarios | 25     |
| bcrypt seguro         | BCRYPT_ROUNDS desde config, nunca hardcodeado                  | 20     |
| Mensajes genéricos    | Login no revela si el email existe o no                        | 20     |
| Middleware correcto   | `authenticate` maneja Bearer token y error 401                 | 20     |
| Tests pasando         | Mínimo 5 assertions relevantes en < 5s                         | 15     |

---

## 🔗 Siguiente práctica

→ [Práctica 02 — RBAC: Autorización por Roles](./02-practica-rbac-autorizacion.md)
