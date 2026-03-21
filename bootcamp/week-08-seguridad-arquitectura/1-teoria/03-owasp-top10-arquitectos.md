# 🔟 OWASP Top 10 para Arquitectos

> _"Conocer el OWASP Top 10 no es opcional para un arquitecto — es el estándar mínimo de conocimiento de seguridad."_
> — OWASP Foundation

---

## 🎯 ¿Qué es OWASP?

### ¿Qué es?

**OWASP** (Open Web Application Security Project) es una fundación sin fines de lucro dedicada a mejorar la seguridad del software. Su **Top 10** es la lista de las vulnerabilidades más críticas en aplicaciones web, actualizada cada 3-4 años basándose en datos reales de miles de organizaciones.

### ¿Para qué sirve para un arquitecto?

- **Lenguaje común**: hablar de "A01:2021" comunica una vulnerabilidad específica sin ambigüedad
- **Diseño preventivo**: conocer las amenazas permite diseñar sistemas que las mitigan por estructura
- **Revisiones de código**: saber qué buscar en code reviews y auditorías
- **Priorización**: no todas las vulnerabilidades son iguales; el Top 10 prioriza por impacto

### ¿Qué impacto tiene?

**Si conoces OWASP:**

- ✅ Diseñas sistemas que previenen las vulnerabilidades más comunes
- ✅ Detectas problemas en revisiones de código antes de producción
- ✅ Apruebas auditorías de seguridad

**Si lo ignoras:**

- ❌ El 90% de los brechas de seguridad explotan vulnerabilidades del OWASP Top 10
- ❌ Vulnerabilidades conocidas y documentadas afectan tu sistema

---

## 📊 OWASP Top 10 — Edición 2021

<!-- Diagrama: 0-assets/05-owasp-top10.svg -->

![OWASP Top 10 2021](../0-assets/05-owasp-top10.svg)

---

## A01:2021 — Broken Access Control (Control de Acceso Roto)

**La vulnerabilidad #1 — subió desde A5 en 2017**

### ¿Qué es?

Cuando los controles de acceso no funcionan correctamente y los usuarios pueden actuar fuera de sus permisos.

### Manifestaciones comunes:

```javascript
// ❌ IDOR (Insecure Direct Object Reference) — El más común
// Usuario student puede ver enrollments de CUALQUIER estudiante
app.get("/enrollments/:id", async (req, res) => {
  const enrollment = await db.query(
    "SELECT * FROM enrollments WHERE id = $1",
    [req.params.id], // ← Sin verificar que es del usuario autenticado
  );
  res.json(enrollment);
});

// ✅ CORRECTO — Verificar que el recurso pertenece al usuario
app.get("/enrollments/:id", authenticate, async (req, res) => {
  const enrollment = await db.query(
    "SELECT * FROM enrollments WHERE id = $1 AND student_id = $2",
    [req.params.id, req.user.userId], // ← Siempre filtrar por userId
  );
  if (!enrollment.rows[0]) {
    return res.status(404).json({ error: "No encontrado" }); // No revelar que existe
  }
  res.json(enrollment.rows[0]);
});
```

```javascript
// ❌ Privilege Escalation — Acceder a endpoints de admin sin autorización
app.put("/users/:id/role", authenticate, async (req, res) => {
  // ← Sin verificar que req.user.role === 'admin'
  await db.query("UPDATE users SET role = $1 WHERE id = $2", [
    req.body.role,
    req.params.id,
  ]);
});

// ✅ CORRECTO
app.put(
  "/users/:id/role",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    // Solo admins pueden cambiar roles
  },
);
```

**Impacto arquitectónico**: El control de acceso debe estar en el **servidor**, nunca confiar en el cliente para ocultar opciones de la UI.

---

## A02:2021 — Cryptographic Failures (Fallas Criptográficas)

### ¿Qué es?

Uso incorrecto o ausencia de criptografía para proteger datos sensibles. Antes llamado "Sensitive Data Exposure".

### Manifestaciones comunes:

```javascript
// ❌ MAL — Contraseña en texto plano
await db.query(
  'INSERT INTO users (email, password) VALUES ($1, $2)',
  [email, password]  // ← Texto plano en BD
);

// ❌ MAL — Hash débil (MD5, SHA-1 no son válidos para contraseñas)
import crypto from 'node:crypto';
const hash = crypto.createHash('md5').update(password).digest('hex');

// ✅ BIEN — bcrypt con costo apropiado
const hash = await bcrypt.hash(password, 12);


// ❌ MAL — Transmitir datos sensibles en URLs (quedan en logs)
GET /users?token=eyJhbGciOiJIUzI1NiJ9...
// El token queda en: logs de servidor, historial del navegador, caché de proxy

// ✅ BIEN — Datos sensibles en headers o body
GET /users
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...


// ❌ MAL — Secretos hardcodeados
const JWT_SECRET = 'hardcoded-secret-12345';
const DB_PASSWORD = 'admin123';

// ✅ BIEN — Variables de entorno
const JWT_SECRET = process.env.JWT_SECRET;
```

**Impacto arquitectónico**: Clasificar qué datos son sensibles (PII, contraseñas, tokens) y garantizar cifrado en tránsito (TLS) y en reposo para todos ellos.

---

## A03:2021 — Injection (Inyección)

### ¿Qué es?

Datos no confiables (del usuario, de fuentes externas) se envían como parte de comandos o consultas al intérprete (SQL, OS, LDAP, etc.).

### SQL Injection:

```javascript
// ❌ VULNERABLE — SQL Injection clásica
const email = req.body.email; // "' OR '1'='1"
const query = `SELECT * FROM users WHERE email = '${email}'`;
// La query resultante: SELECT * FROM users WHERE email = '' OR '1'='1'
// Retorna TODOS los usuarios

// ✅ SEGURO — Consultas parametrizadas (siempre)
const result = await db.query(
  "SELECT * FROM users WHERE email = $1",
  [req.body.email], // El driver escapa automáticamente
);
```

### Command Injection:

```javascript
// ❌ VULNERABLE — Ejecutar comandos del SO con input del usuario
import { exec } from "node:child_process";
const filename = req.query.filename; // "file.txt; rm -rf /"
exec(`cat uploads/${filename}`); // ← PELIGROSO

// ✅ SEGURO — Validar y usar APIs seguras
import { readFile } from "node:fs/promises";
import path from "node:path";

const filename = path.basename(req.query.filename); // Solo el nombre, sin paths
const safePath = path.join("./uploads", filename);

// Verificar que el path resuelto está dentro del directorio esperado
if (!safePath.startsWith(path.resolve("./uploads"))) {
  return res.status(400).json({ error: "Path inválido" });
}
```

**Impacto arquitectónico**: Toda entrada del usuario es datos no confiables. Siempre usar consultas parametrizadas, ORMs, y validación estricta de entradas.

---

## A04:2021 — Insecure Design (Diseño Inseguro)

### ¿Qué es?

Vulnerabilidades derivadas de decisiones de diseño incorrectas desde el inicio. No es un bug de implementación — es un error de arquitectura.

### Ejemplos de diseño inseguro:

```javascript
// ❌ DISEÑO INSEGURO — Recuperación de contraseña revela información
// Si el email existe → "Te enviamos un email"
// Si no existe → "El email no está registrado"
// El atacante puede enumerar qué emails están registrados

// ✅ DISEÑO SEGURO — Mismo mensaje independientemente del resultado
app.post("/auth/forgot-password", async (req, res) => {
  const user = await userRepo.findByEmail(req.body.email);

  if (user) {
    await emailService.sendResetLink(user.email);
  }
  // Mismo mensaje siempre (no revela si el email existe)
  res.json({ message: "Si el email existe, recibirás instrucciones." });
});
```

```javascript
// ❌ DISEÑO INSEGURO — Sin límite de intentos de login
// Un atacante puede probar millones de contraseñas automáticamente

// ✅ DISEÑO SEGURO — Rate limiting + lockout temporal
const loginAttempts = new Map(); // En producción: Redis

app.post("/auth/login", (req, res, next) => {
  const key = `login:${req.ip}`;
  const attempts = loginAttempts.get(key) ?? 0;

  if (attempts >= 5) {
    return res.status(429).json({ error: "Cuenta bloqueada temporalmente" });
  }

  next();
});
```

**Impacto arquitectónico**: Los modelos de amenaza (Threat Modeling) deben hacerse en la fase de diseño. **STRIDE** (Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation of Privilege) es un framework útil.

---

## A05:2021 — Security Misconfiguration (Configuración Insegura)

### ¿Qué es?

Configuraciones por defecto inseguras, configuraciones incompletas, o información de error excesiva.

### Ejemplos comunes:

```javascript
// ❌ MAL — Headers de seguridad ausentes
// Por defecto, Express no agrega headers de seguridad
// X-Powered-By: Express ← Revela información del stack al atacante

// ✅ BIEN — Helmet.js configura headers de seguridad
import helmet from "helmet";
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"], // Sin inline scripts
      },
    },
    hsts: {
      maxAge: 31536000, // 1 año
      includeSubDomains: true,
    },
  }),
);
// Agrega: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, etc.
```

```javascript
// ❌ MAL — Stack traces en producción
app.use((err, req, res, next) => {
  res.json({ error: err.stack }); // Revela rutas, versiones, lógica interna
});

// ✅ BIEN — Errores genéricos en producción
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
  res.status(500).json({ error: "Error interno" });
});
```

```dockerfile
# ❌ MAL — Puertos innecesarios expuestos en Docker
# Si PostgreSQL está en el mismo compose, no debe estar accesible externamente
services:
  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"  # ← Expone la BD al host (y a la red si el host es un servidor)

# ✅ BIEN — Sin puertos expuestos, solo accesible dentro de la red Docker
services:
  db:
    image: postgres:16-alpine
    # Sin ports → solo accesible desde otros servicios del compose
    networks:
      - internal
```

---

## A06:2021 — Vulnerable and Outdated Components

### ¿Qué es?

Usar librerías, frameworks o dependencias con vulnerabilidades conocidas.

```bash
# Detectar vulnerabilidades en dependencias
pnpm audit

# Output ejemplo:
# ┌─────────────────────────────────────────────────────────────┐
# │                    === npm audit report ===                  │
# │                                                             │
# │ jsonwebtoken  <=8.5.1                                       │
# │ Severity: high                                              │
# │ Verification bypass in jsonwebtoken                         │
# │ fix available via `pnpm audit fix`                         │
# └─────────────────────────────────────────────────────────────┘

# Corregir automáticamente (minor y patch)
pnpm audit fix

# Ver dependencias desactualizadas
pnpm outdated
```

**Impacto arquitectónico**: El `pnpm audit` debe ser parte del pipeline de CI/CD. Si hay vulnerabilidades críticas, el build debe fallar.

```yaml
# En GitHub Actions / CI
- name: Audit dependencies
  run: pnpm audit --audit-level=high
  # Falla si hay vulnerabilidades de nivel 'high' o 'critical'
```

---

## A07:2021 — Identification and Authentication Failures

### ¿Qué es?

Implementaciones débiles de autenticación que permiten comprometer identidades.

```javascript
// ❌ Contraseñas sin requisitos mínimos
// El sistema acepta contraseñas de 1 carácter

// ✅ Validar fortaleza de contraseña
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Al menos una mayúscula")
    .regex(/[0-9]/, "Al menos un número")
    .regex(/[^A-Za-z0-9]/, "Al menos un caracter especial"),
});

// ❌ JWT sin expiración ni validación de audiencia
jwt.sign({ userId: "123" }, secret);

// ✅ JWT con expiración y validación completa
jwt.sign({ userId: "123", role: "student" }, secret, {
  expiresIn: "15m",
  issuer: "eduflow",
  audience: "eduflow-client",
});
jwt.verify(token, secret, {
  algorithms: ["HS256"], // Especificar algoritmo
  issuer: "eduflow",
  audience: "eduflow-client",
});
```

---

## A08:2021 — Software and Data Integrity Failures

### ¿Qué es?

Código e infraestructura que no protege contra modificaciones no autorizadas en el pipeline de CI/CD o en deserialización de datos.

```javascript
// ❌ Deserializar datos sin validación
app.post("/import", (req, res) => {
  const data = JSON.parse(req.body.data); // ← Sin validación del schema
  processData(data); // ← data puede tener estructura maliciosa
});

// ✅ Validar schema antes de procesar
import { z } from "zod";

const importSchema = z
  .array(
    z.object({
      courseId: z.string().uuid(),
      progress: z.number().min(0).max(100),
    }),
  )
  .max(100); // Limitar tamaño del array

app.post("/import", (req, res) => {
  const result = importSchema.safeParse(req.body.data);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  processData(result.data);
});
```

---

## A09:2021 — Security Logging and Monitoring Failures

### ¿Qué es?

Sin logging adecuado, los ataques no se detectan. El tiempo promedio para detectar un breach es **197 días**.

```javascript
// ❌ MAL — Sin logs de seguridad
app.post("/auth/login", async (req, res) => {
  // Login fallido: sin registro
});

// ✅ BIEN — Logs de eventos de seguridad
app.post("/auth/login", async (req, res) => {
  try {
    const result = await authService.login(req.body);
    // Log de login exitoso
    logger.info({
      event: "auth.login.success",
      userId: result.userId,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      timestamp: new Date().toISOString(),
    });
    res.json(result);
  } catch (err) {
    // Log de intento fallido (para detectar fuerza bruta)
    logger.warn({
      event: "auth.login.failed",
      email: req.body.email, // NOTA: No loguear contraseñas
      ip: req.ip,
      reason: err.message,
      timestamp: new Date().toISOString(),
    });
    res.status(401).json({ error: "Credenciales inválidas" });
  }
});
```

> ⚠️ **Nunca loguear**: contraseñas, tokens JWT, números de tarjeta de crédito, datos PII sin anonimizar.

---

## A10:2021 — Server-Side Request Forgery (SSRF)

### ¿Qué es?

Un atacante logra que el servidor haga requests a una URL controlada por él, pudiendo acceder a servicios internos.

```javascript
// ❌ VULNERABLE — El servidor hace fetch a una URL proporcionada por el usuario
app.get("/fetch-preview", async (req, res) => {
  const url = req.query.url; // "http://169.254.169.254/metadata" ← AWS metadata!
  const response = await fetch(url); // ← El servidor accede a servicios internos
  res.json(await response.json());
});

// ✅ SEGURO — Lista blanca de dominios permitidos
const ALLOWED_DOMAINS = ["eduflow.com", "cdn.eduflow.com"];

app.get("/fetch-preview", async (req, res) => {
  const url = new URL(req.query.url); // Parsear para validar

  if (!ALLOWED_DOMAINS.includes(url.hostname)) {
    return res.status(400).json({ error: "Dominio no permitido" });
  }

  const response = await fetch(url.toString());
  res.json(await response.json());
});
```

---

## 📋 Resumen OWASP Top 10 — Decisiones Arquitectónicas

| #   | Vulnerabilidad            | Decisión Arquitectónica                            |
| --- | ------------------------- | -------------------------------------------------- |
| A01 | Broken Access Control     | RBAC en servidor, never trust client               |
| A02 | Cryptographic Failures    | bcrypt para passwords, TLS, no hardcode secrets    |
| A03 | Injection                 | Consultas parametrizadas, validación de entradas   |
| A04 | Insecure Design           | Threat modeling, mismo mensaje de error            |
| A05 | Security Misconfiguration | Helmet.js, no exponer puertos innecesarios         |
| A06 | Vulnerable Components     | `pnpm audit` en CI/CD                              |
| A07 | Auth Failures             | JWT con expiración, rate limiting en login         |
| A08 | Integrity Failures        | Validación de schema en deserialización            |
| A09 | Logging Failures          | Logs de eventos de seguridad (sin datos sensibles) |
| A10 | SSRF                      | Lista blanca de dominios para requests externos    |

---

## 🔗 Navegación

**[← Autenticación y Autorización](02-autenticacion-autorizacion.md)** | **[→ Seguridad en Node.js](04-seguridad-nodejs-implementacion.md)**

---

_Bootcamp de Arquitectura de Software — SENA · bc-channel-epti_
