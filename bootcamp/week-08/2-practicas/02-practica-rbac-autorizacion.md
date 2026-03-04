# 🛡️ Práctica 02 — RBAC: Autorización por Roles

> **Tiempo estimado**: 40 minutos
> **Dificultad**: Intermedia
> **Requisitos**: Práctica 01 completada

---

## 🎯 Objetivo

Diseñar e implementar un sistema de **autorización basado en roles (RBAC)** para controlar qué acciones puede realizar cada tipo de usuario en la API.

Al terminar habrás:

- Diseñado una **matriz de roles y permisos** para un dominio real
- Implementado el middleware `authorize` como fábrica reutilizable
- Aplicado RBAC a un router de Express con múltiples niveles de acceso
- Escrito tests de autorización sin levantar servidor ni BD

---

## 📋 Contexto: EduFlow Secure (referencia didáctica)

Los instructores se quejaron de que los aprendices podían calificar sus propias tareas modificando directamente los endpoints. El RBAC que diseñarás aquí resuelve exactamente ese problema.

> 💡 Este escenario es el **ejemplo guía**. Aplicarás el mismo patrón a **tu propio proyecto** en el integrador.

---

## Paso 1 — Diseñar la matriz de roles (10 min)

Antes de escribir código, **documenta** la matriz de acceso. Este es el artefacto más importante del RBAC:

```
Caso de estudio: EduFlow — matriz de roles
```

| Recurso / Acción                | `student` |  `instructor`   | `admin` |
| ------------------------------- | :-------: | :-------------: | :-----: |
| `GET /cursos` (listar todos)    |    ✅     |       ✅        |   ✅    |
| `GET /cursos/:id` (detalle)     |    ✅     |       ✅        |   ✅    |
| `POST /cursos` (crear)          |    ❌     |       ✅        |   ✅    |
| `PATCH /cursos/:id` (editar)    |    ❌     | ✅ solo el suyo |   ✅    |
| `DELETE /cursos/:id` (eliminar) |    ❌     |       ❌        |   ✅    |
| `POST /calificaciones`          |    ❌     |       ✅        |   ✅    |
| `GET /usuarios`                 |    ❌     |       ❌        |   ✅    |
| `DELETE /usuarios/:id`          |    ❌     |       ❌        |   ✅    |

**Tu turno**: Diseña la misma tabla pero para **tu dominio asignado** antes de seguir.

---

## Paso 2 — Middleware `authorize` (5 min)

```javascript
// src/interfaces/http/middlewares/authorize.js

/**
 * Fábrica de middleware de autorización.
 * Uso: router.get('/ruta', authenticate, authorize('admin', 'instructor'), handler)
 *
 * @param {...string} allowedRoles - Roles que pueden acceder al endpoint
 */
export const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    // authenticate debe correr ANTES que authorize
    if (!req.user) {
      return res.status(401).json({ error: "Autenticación requerida" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      // 403 Forbidden: autenticado pero sin permiso
      // No revelar qué roles sí tienen acceso (OWASP A05)
      return res
        .status(403)
        .json({ error: "No tienes permiso para esta acción" });
    }

    next();
  };
```

---

## Paso 3 — Router con RBAC aplicado (10 min)

```javascript
// src/interfaces/http/courses.router.js
import { Router } from "express";
import { authenticate } from "./middlewares/authenticate.js";
import { authorize } from "./middlewares/authorize.js";
import { CoursesController } from "./courses.controller.js";

const router = Router();

// Inyección de dependencias del controlador
const controller = new CoursesController(/* sus dependencias */);

// Endpoints públicos (sin autenticación)
router.get("/", controller.list);
router.get("/:id", controller.findById);

// Endpoints para instructores y admins
router.post(
  "/",
  authenticate,
  authorize("instructor", "admin"),
  controller.create,
);

router.patch(
  "/:id",
  authenticate,
  authorize("instructor", "admin"),
  controller.update,
);

// Endpoint solo para admins
router.delete("/:id", authenticate, authorize("admin"), controller.remove);

export { router as coursesRouter };
```

**Ahora implementa el equivalente para tu dominio:**

```javascript
// PLANTILLA — adapta con tus entidades y roles
import { Router } from 'express';
import { authenticate } from './middlewares/authenticate.js';
import { authorize } from './middlewares/authorize.js';

const router = Router();

// Adapta los roles al modelo de TU dominio
// TUS ROLES: [ROL_LECTURA], [ROL_ESCRITURA], [ROL_ADMIN]

router.get('/',    /* público o autenticado según tu dominio */ );
router.post('/',   authenticate, authorize('[ROL_ESCRITURA]', '[ROL_ADMIN]'), /* controller */);
router.patch('/:id', authenticate, authorize('[ROL_ESCRITURA]', '[ROL_ADMIN]'), /* controller */);
router.delete('/:id', authenticate, authorize('[ROL_ADMIN]'), /* controller */);

export { router as [tuEntidad]Router };
```

---

## Paso 4 — Ownership check: autorización a nivel de recurso (5 min)

RBAC por rol no es suficiente cuando un usuario solo puede modificar **sus propios** recursos. Implementa un middleware adicional:

```javascript
// src/interfaces/http/middlewares/check-ownership.js

/**
 * Verifica que el recurso pertenece al usuario autenticado
 * o que el usuario tiene rol admin (que puede acceder a todo).
 *
 * Uso: router.patch('/:id', authenticate, checkOwnership(courseService), handler)
 */
export const checkOwnership = (resourceService) => async (req, res, next) => {
  // Los admins siempre pueden — no verificar ownership
  if (req.user.role === "admin") return next();

  try {
    const resource = await resourceService.findById(req.params.id);
    if (!resource)
      return res.status(404).json({ error: "Recurso no encontrado" });

    // Ajusta el campo 'instructorId' al nombre que usa tu aggregate
    const isOwner = resource.instructorId === req.user.userId;
    if (!isOwner) {
      return res
        .status(403)
        .json({ error: "Solo puedes modificar tus propios recursos" });
    }

    req.resource = resource; // Pasar al siguiente middleware para evitar doble fetch
    next();
  } catch {
    res.status(500).json({ error: "Error verificando permisos" });
  }
};
```

---

## Paso 5 — Tests de autorización (10 min)

```javascript
// tests/security/authorize.middleware.test.js
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { authorize } from "../../src/interfaces/http/middlewares/authorize.js";

// Helper: crea objetos req/res simulados
const makeCtx = ({ role = null } = {}) => {
  const res = {
    _status: null,
    _body: null,
    status(s) {
      this._status = s;
      return this;
    },
    json(b) {
      this._body = b;
      return this;
    },
  };
  const req = role ? { user: { userId: "u1", role } } : {};
  return { req, res };
};

describe("authorize middleware", () => {
  it("llama next() cuando el rol está permitido", (_, done) => {
    const { req, res } = makeCtx({ role: "instructor" });
    authorize("instructor", "admin")(req, res, done); // done como next → test pasa si se llama
  });

  it("retorna 403 cuando el rol no está en la lista", () => {
    const { req, res } = makeCtx({ role: "student" });
    let nextCalled = false;

    authorize("instructor", "admin")(req, res, () => {
      nextCalled = true;
    });

    assert.strictEqual(res._status, 403);
    assert.ok(!nextCalled);
  });

  it("retorna 401 cuando no hay usuario autenticado", () => {
    const { req, res } = makeCtx(); // sin role → sin user
    authorize("admin")(req, res, () => {});
    assert.strictEqual(res._status, 401);
  });

  it("admin puede acceder a ruta que también permite otro rol", (_, done) => {
    const { req, res } = makeCtx({ role: "admin" });
    authorize("instructor", "admin")(req, res, done);
  });

  it("student no puede acceder a ruta solo de admins", () => {
    const { req, res } = makeCtx({ role: "student" });
    authorize("admin")(req, res, () => {});
    assert.strictEqual(res._status, 403);
    assert.ok(res._body.error.includes("permiso"));
  });
});
```

```bash
node --test tests/security/authorize.middleware.test.js
```

**Resultado esperado**: 5 pruebas pasando en < 100ms.

---

## Paso 6 — Prueba de integración manual (forma alternativa sin BD)

```javascript
// experimento-rbac.js — prueba de integración con un servidor mínimo
import express from "express";
import { authenticate } from "./src/interfaces/http/middlewares/authenticate.js";
import { authorize } from "./src/interfaces/http/middlewares/authorize.js";
import { TokenService } from "./src/infrastructure/security/token.service.js";

const app = express();

// Fake TokenService con secret simple para el experimento
const tokenService = new TokenService({
  secret: "secret-de-32-caracteres-para-el-experimento",
  expiresIn: "5m",
  issuer: "experimento",
});

// Ruta de prueba con RBAC
app.get("/admin-only", authenticate, authorize("admin"), (_req, res) =>
  res.json({ mensaje: "¡Acceso de admin concedido!" }),
);

app.listen(4000, () => {
  console.log("Servidor en http://localhost:4000");

  // Generar tokens para prueba
  const studentToken = tokenService.sign({ userId: "u1", role: "student" });
  const adminToken = tokenService.sign({ userId: "u2", role: "admin" });

  console.log("\nToken student:", studentToken);
  console.log("Token admin:", adminToken);
  console.log("\nPrueba con:");
  console.log(
    `curl http://localhost:4000/admin-only -H "Authorization: Bearer ${adminToken}"`,
  );
  console.log(
    `curl http://localhost:4000/admin-only -H "Authorization: Bearer ${studentToken}"`,
  );
});
```

---

## ✅ Rúbrica de evaluación

| Criterio                               | Descripción                                       | Puntos |
| -------------------------------------- | ------------------------------------------------- | ------ |
| Matriz de roles documentada            | Tabla con roles y permisos para el dominio propio | 25     |
| `authorize` correctamente implementado | Fábrica de middleware, 401 vs 403 correcto        | 25     |
| Router con RBAC aplicado               | Endpoints diferenciados por rol                   | 25     |
| Tests pasando                          | 5+ assertions de autorización en < 2s             | 25     |

---

## 🔗 Siguiente práctica

→ [Práctica 03 — Hardening OWASP](./03-practica-hardening-owasp.md)
