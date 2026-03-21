# 🎯 Reto Semana 08: EduFlow Secure — "La API que cualquiera podía usar"

> _"La seguridad no es un producto, es un proceso. No es un destino, es un viaje continuo."_
> — Bruce Schneier

---

## 📖 Contexto

El equipo de **EduFlow** ha construido algo notable en 7 semanas:

- **Semana 04**: API REST con Express.js
- **Semana 05**: Patrones de diseño GoF aplicados
- **Semana 06**: Arquitectura Hexagonal — dominio desacoplado
- **Semana 07**: Containerización completa con Docker

El sistema funciona, es elegante y está containerizado. Pero el CTO acaba de leer el informe de seguridad del equipo de QA:

> _"Cualquier persona puede hacer `POST /courses` sin autenticarse. Cualquiera puede eliminar enrollments de otro estudiante. No hay límite de intentos de login. Las contraseñas se guardan en texto plano. El JWT_SECRET está hardcodeado en el código."_
>
> — Informe de Auditoría de Seguridad, EduFlow v0.7

**Un inversor interesado en EduFlow canceló la reunión** después de que su equipo técnico revisara el repositorio.

---

## 🚩 El Problema

La API de EduFlow tiene **cero seguridad**:

```bash
# Cualquier persona puede crear cursos sin autenticarse
curl -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -d '{"title": "Hacking ético", "instructorId": "malicious-actor"}'
# Respuesta: 201 Created — SIN CREDENCIALES

# Cualquiera puede ver todos los datos de todos los estudiantes
curl http://localhost:3000/enrollments
# Respuesta: [{ studentId: "...", progress: 100%, ... }]

# El JWT_SECRET está en el código fuente
const JWT_SECRET = "my-super-secret"; // ← En GitHub para todos
```

Esto viola las vulnerabilidades **A01 (Broken Access Control)**, **A02 (Cryptographic Failures)** y **A07 (Identification and Authentication Failures)** del OWASP Top 10.

---

## 🎯 Tu Misión

Transformar EduFlow en una API segura implementando:

### 1. Sistema de Autenticación con JWT

```javascript
// Lo que debe existir al final
POST / auth / register; // Registrar nuevo usuario
POST / auth / login; // Login → access token + refresh token
POST / auth / refresh; // Renovar access token
POST / auth / logout; // Invalidar refresh token
```

### 2. Sistema de Autorización RBAC

```javascript
// Roles del sistema EduFlow
const ROLES = {
  STUDENT: "student", // Ve sus cursos, actualiza su progreso
  INSTRUCTOR: "instructor", // Crea/edita sus cursos, ve sus estudiantes
  ADMIN: "admin", // Acceso total
};

// Matriz de permisos
//                      student  instructor  admin
// GET /courses            ✅        ✅        ✅
// POST /courses           ❌        ✅        ✅
// DELETE /courses/:id     ❌        ⚠️*       ✅
// GET /enrollments        ⚠️**      ✅        ✅
// POST /enrollments       ✅        ❌        ✅

// * Solo sus propios cursos
// ** Solo sus propias inscripciones
```

### 3. Hardening Anti-OWASP

```javascript
// Protecciones mínimas requeridas
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Headers de seguridad
app.use(helmet());

// Rate limiting en auth (max 5 intentos / 15 min)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Demasiados intentos. Espera 15 minutos." },
});
app.use("/auth/login", authLimiter);
```

---

## 📋 Código Base para Asegurar

```javascript
// src/infrastructure/http/app.js — Estado actual (SIN seguridad)
import express from "express";
import { CourseRouter } from "./course-router.js";
import { EnrollmentRouter } from "./enrollment-router.js";

const app = express();
app.use(express.json());

// PROBLEMA: Sin autenticación, sin autorización, sin protección
app.use("/courses", new CourseRouter(courseService).router);
app.use("/enrollments", new EnrollmentRouter(enrollmentService).router);

export { app };
```

```javascript
// src/domain/user.js — Entidad de dominio a crear
export class User {
  constructor({ id, email, passwordHash, role, createdAt }) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash; // NUNCA la contraseña en texto plano
    this.role = role; // 'student' | 'instructor' | 'admin'
    this.createdAt = createdAt;
  }
}
```

---

## 🛠️ Dependencias a Agregar

```bash
# Gestión de autenticación y seguridad
pnpm add jsonwebtoken bcrypt
pnpm add helmet express-rate-limit cors

# Validación de entradas
pnpm add zod

# Solo para desarrollo/testing
pnpm add -D @types/jsonwebtoken @types/bcrypt
```

---

## 📐 Arquitectura de la Solución

La capa de seguridad debe respetar la arquitectura hexagonal ya implementada:

```
src/
├── domain/
│   ├── user.js                    # Nueva entidad: User
│   └── user-repository.js         # Puerto: interfaz del repositorio
├── application/
│   └── auth-application-service.js # Caso de uso: login, register
├── infrastructure/
│   ├── http/
│   │   ├── auth-router.js         # Rutas de autenticación
│   │   ├── middlewares/
│   │   │   ├── authenticate.js    # Verifica JWT
│   │   │   └── authorize.js       # Verifica rol
│   └── persistence/
│       └── postgres-user-repository.js  # Adaptador para PostgreSQL
```

---

## ✅ Criterios de Aceptación

El reto está completo cuando:

- [ ] `POST /auth/register` crea un usuario con contraseña hasheada (bcrypt)
- [ ] `POST /auth/login` retorna un JWT válido con el rol del usuario
- [ ] Los endpoints de cursos requieren autenticación (401 sin token)
- [ ] Solo instructores/admins pueden crear cursos (403 si es student)
- [ ] Rate limiting activo en `/auth/login`
- [ ] Helmet.js configurado con headers de seguridad
- [ ] `JWT_SECRET` en variable de entorno (no hardcodeado)
- [ ] `docker compose up` levanta el stack completo con autenticación funcional
- [ ] `pnpm audit` sin vulnerabilidades críticas

---

## 🔥 Desafío Extra (Para quienes quieran ir más lejos)

Implementar **refresh tokens con rotación**:

```javascript
// Flujo con refresh token
// 1. Login → access token (15 min) + refresh token (7 días, guardado en BD)
// 2. Access token expira → usar refresh token para obtener nuevo par
// 3. Refresh token usado → invalidar el anterior (rotación)
// 4. Logout → invalidar refresh token en BD

// Tabla adicional en PostgreSQL
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  token_hash VARCHAR(255) NOT NULL,  -- Hash del token, no el token en texto plano
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP,              -- NULL = activo
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📊 Entregables

1. **Código fuente** en rama `week-08/eduflow-secure`
2. **`README.md` actualizado** con instrucciones de autenticación
3. **`.env.example`** documentado con todas las variables requeridas
4. **Capturas o logs** mostrando:
   - Login exitoso con JWT generado
   - Endpoint protegido rechazando request sin token (401)
   - Endpoint rechazando rol incorrecto (403)
   - Rate limiting activado tras 5 intentos

---

## 💡 Pistas Arquitectónicas

> **¿Dónde va la lógica de seguridad en la arquitectura hexagonal?**
>
> - La **validación de contraseña** y **generación de JWT** pertenecen al `AuthApplicationService` (capa de aplicación).
> - La **verificación del JWT** pertenece a los **middlewares de infraestructura** (no al dominio).
> - La **regla de negocio** "un instructor solo puede editar sus cursos" pertenece al **dominio**.
> - El **rate limiting** y **helmet** son preocupaciones de **infraestructura HTTP**.

---

_Bootcamp de Arquitectura de Software — SENA · bc-channel-epti_
