# 🎯 Reto Semana 06: EduFlow — Refactorización hacia Arquitectura Hexagonal

## 🏢 Contexto del Reto

**EduFlow** es la plataforma de gestión de aprendizaje que ha venido creciendo durante las semanas anteriores del bootcamp. En la semana 04 construiste su API REST con Express.js. En la semana 05 aplicaste patrones de diseño GoF. Ahora el equipo técnico tiene un problema serio:

> _"Cada vez que queremos testear la lógica de negocio, tenemos que levantar Express, conectar a la base de datos y simular requests HTTP. Las pruebas tardan 30 segundos. El CI/CD está roto la mitad del tiempo."_
> — Tech Lead de EduFlow

El problema de raíz: la **lógica de negocio está mezclada con los frameworks**. Express, la base de datos y los detalles técnicos están enredados con las reglas de negocio reales.

Tu misión: **refactorizar EduFlow hacia Arquitectura Hexagonal** para que el dominio sea completamente independiente de Express, de la base de datos, y de cualquier detalle de infraestructura.

---

## 📋 El Sistema Heredado (El Problema)

```javascript
// ❌ CÓDIGO PROBLEMÁTICO — eduflow-legacy.js
// Express, lógica de negocio y base de datos mezclados

import express from "express";

const app = express();
app.use(express.json());

// ❌ La base de datos está directamente en el handler
const students = new Map(); // Simula BD
const tasks = new Map();
const submissions = new Map();

// ❌ Lógica de negocio mezclada con el routing HTTP
app.post("/api/students", (req, res) => {
  const { name, email, cohort } = req.body;

  // ¿Esto es lógica de negocio o HTTP?
  if (!name || !email) {
    return res.status(400).json({ error: "name y email son requeridos" });
  }

  if (students.has(email)) {
    return res.status(409).json({ error: "El email ya está registrado" });
  }

  // ¿Dónde termina el dominio y dónde empieza la infraestructura?
  const student = {
    id: `stu_${Date.now()}`,
    name,
    email,
    cohort,
    createdAt: new Date(),
    status: "active",
  };

  students.set(student.id, student);
  res.status(201).json(student);
});

app.post("/api/tasks/:taskId/submit", (req, res) => {
  const { taskId } = req.params;
  const { studentId, repositoryUrl, notes } = req.body;

  // ❌ Reglas de negocio incrustadas en el router
  const task = tasks.get(taskId);
  if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

  const student = students.get(studentId);
  if (!student)
    return res.status(404).json({ error: "Estudiante no encontrado" });

  if (student.status !== "active") {
    return res
      .status(403)
      .json({ error: "Solo estudiantes activos pueden entregar" });
  }

  const existingSubmission = [...submissions.values()].find(
    (s) => s.taskId === taskId && s.studentId === studentId,
  );
  if (existingSubmission) {
    return res
      .status(409)
      .json({ error: "Ya existe una entrega para esta tarea" });
  }

  // ¿Cómo hago test unitario de esta lógica? Necesito HTTP...
  const submission = {
    id: `sub_${Date.now()}`,
    taskId,
    studentId,
    repositoryUrl,
    notes: notes ?? "",
    submittedAt: new Date(),
    status: "pending_review",
    grade: null,
  };

  submissions.set(submission.id, submission);
  res.status(201).json(submission);
});

app.listen(3000, () => console.log("EduFlow en http://localhost:3000"));
```

---

## 🏗️ La Arquitectura Hexagonal que Debes Implementar

```
eduflow-hexagonal/
├── src/
│   ├── domain/                      ← El hexágono central (sin dependencias externas)
│   │   ├── entities/
│   │   │   ├── student.js           ← Entidad Student con reglas de negocio
│   │   │   └── submission.js        ← Entidad Submission
│   │   ├── repositories/            ← Ports de salida (interfaces)
│   │   │   ├── student-repository.js
│   │   │   └── submission-repository.js
│   │   └── use-cases/               ← Casos de uso (lógica de aplicación)
│   │       ├── register-student.js
│   │       ├── submit-task.js
│   │       └── grade-submission.js
│   │
│   ├── infrastructure/              ← Adapters de salida (implementaciones)
│   │   ├── persistence/
│   │   │   ├── in-memory-student-repo.js
│   │   │   └── in-memory-submission-repo.js
│   │   └── http/                    ← Adapter de entrada
│   │       ├── express-server.js
│   │       └── routes/
│   │           ├── student-routes.js
│   │           └── submission-routes.js
│   │
│   └── index.js                     ← Composición (conecta todo)
│
├── docs/
│   ├── arquitectura-hexagonal.md    ← Documento de decisión
│   └── diagramas/
│       └── hexagonal-eduflow.md     ← Diagrama Mermaid
├── package.json
└── README.md
```

---

## 🛠️ Tu Misión

### Paso 1 — Modelar el Dominio

Implementa las entidades con sus reglas de negocio **puras** (sin Express, sin BD):

**`Student`** — Reglas de negocio:

- Un estudiante necesita nombre, email y cohort
- El email debe ser válido
- Un estudiante puede estar `active`, `inactive` o `graduated`
- Solo estudiantes `active` pueden hacer entregas

**`Submission`** — Reglas de negocio:

- Una entrega necesita studentId, taskId y repositoryUrl
- La URL del repositorio debe ser de GitHub
- Una entrega empieza en `pending_review`
- Solo puede calificarse si está en `pending_review`
- La nota debe estar entre 0 y 100

### Paso 2 — Definir los Ports

Crea las interfaces (contracts) que el dominio necesita del mundo exterior:

```javascript
// Puerto de salida — el dominio define lo que necesita
class StudentRepository {
  async findById(id) {
    throw new Error("findById() no implementado");
  }
  async findByEmail(email) {
    throw new Error("findByEmail() no implementado");
  }
  async save(student) {
    throw new Error("save() no implementado");
  }
  async findAll() {
    throw new Error("findAll() no implementado");
  }
}
```

### Paso 3 — Implementar los Casos de Uso

Cada caso de uso recibe los repos por inyección de dependencias:

```javascript
// Caso de uso — solo conoce ports (interfaces), no implementaciones
class RegisterStudent {
  #studentRepository;

  constructor({ studentRepository }) {
    this.#studentRepository = studentRepository;
  }

  async execute({ name, email, cohort }) {
    // Toda la lógica de negocio aquí — sin Express, sin BD
  }
}
```

### Paso 4 — Crear los Adapters

Implementa los ports concretos:

- `InMemoryStudentRepository` — para tests y demos
- `ExpressStudentRouter` — adapter de entrada HTTP

### Paso 5 — Componer en index.js

```javascript
// index.js — el "pegamento" que conecta todo
const studentRepo = new InMemoryStudentRepository();
const registerStudent = new RegisterStudent({ studentRepository: studentRepo });
// ...inyectar en Express
```

### Paso 6 — Documentar

Crea `docs/arquitectura-hexagonal.md` explicando:

- ¿Por qué elegiste Hexagonal sobre Clean Architecture?
- ¿Cuáles son los ports y qué representan?
- ¿Cómo agregarías PostgreSQL sin tocar el dominio?
- Diagrama Mermaid del hexágono

---

## 🔬 Criterio Clave de Validación

> El dominio **debe poder ejecutarse sin Express y sin base de datos real**.

Este test debe pasar sin levantar ningún servidor:

```javascript
// test-dominio.js — prueba el dominio puro
import { RegisterStudent } from "./src/domain/use-cases/register-student.js";
import { InMemoryStudentRepository } from "./src/infrastructure/persistence/in-memory-student-repo.js";

const repo = new InMemoryStudentRepository();
const useCase = new RegisterStudent({ studentRepository: repo });

// Sin Express, sin HTTP → solo lógica de negocio
const student = await useCase.execute({
  name: "Ana García",
  email: "ana@sena.edu.co",
  cohort: "ADSO-2026",
});

console.assert(student.id, "El estudiante debe tener ID");
console.assert(student.status === "active", "El estudiante debe estar activo");
console.log("✅ Dominio validado sin infraestructura");
```

Si este test pasa, **lograste la independencia del dominio**.

---

## 📋 Criterios de Aceptación

### Mínimo para Aprobar ✅

- [ ] Dominio separado de la infraestructura (carpetas `domain/` e `infrastructure/`)
- [ ] Al menos 2 entidades con reglas de negocio en clases ES2023
- [ ] Al menos 1 caso de uso implementado con inyección de dependencias
- [ ] Al menos 1 Port (interface) y 1 Adapter (implementación) que lo cumple
- [ ] `index.js` demuestra la composición del sistema
- [ ] `docs/arquitectura-hexagonal.md` con decisiones documentadas

### Para Nota Excelente 🌟

- [ ] Los 3 casos de uso implementados (`RegisterStudent`, `SubmitTask`, `GradeSubmission`)
- [ ] Tests del dominio sin infraestructura (Node.js test runner)
- [ ] Diagrama Mermaid del hexágono
- [ ] Demostración: cambiar `InMemoryStudentRepository` por otro adapter sin modificar el dominio
- [ ] Los patrones de diseño de semana 05 están presentes (Observer, Factory, etc.)

---

## 🚀 Para Comenzar

```bash
mkdir eduflow-hexagonal && cd eduflow-hexagonal
pnpm init
# Agregar "type": "module"

# Estructura básica
mkdir -p src/domain/{entities,repositories,use-cases}
mkdir -p src/infrastructure/{persistence,http/routes}
mkdir -p docs/diagramas
```

---

## 💡 Pistas

> **¿Cómo saber si el dominio está "limpio"?**
> Revisa el archivo de la entidad o del caso de uso. Si ves `express`, `fetch`, `pg`, `mongoose` o cualquier librería/framework externo → el dominio está contaminado.

> **¿Qué es un Port exactamente?**
> Es una clase abstracta (o interfaz) definida **dentro de `domain/`** que describe qué necesita el dominio del mundo exterior. El nombre del port debe estar en lenguaje de negocio, no técnico: `StudentRepository`, no `PostgresStudentTable`.

> **¿Qué es un Adapter?**
> Es la implementación concreta del Port, pero vive en `infrastructure/`. Puede ser `InMemoryStudentRepository`, `PostgresStudentRepository` o `MongoStudentRepository`. El dominio nunca sabe cuál está activo.

---

_Bootcamp de Arquitectura de Software · SENA · bc-channel-epti_
