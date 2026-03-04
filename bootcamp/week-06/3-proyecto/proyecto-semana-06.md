# 🚀 Proyecto Semana 06 — EduFlow Hexagonal

> **Fecha de entrega**: Al finalizar la semana 06
> **Modalidad**: Individual o grupos de 2
> **Repositorio base**: Continúa sobre el código de EduFlow (semanas 04 y 05)

---

## 🎯 Descripción

Refactoriza la plataforma **EduFlow** desde su arquitectura actual (Express + lógica mezclada) hacia una **Arquitectura Hexagonal (Ports & Adapters)** completa.

Al finalizar, cualquier módulo del dominio debe ser testeable en **menos de 1 segundo** sin levantar servidor, sin conectar a BD y sin red.

---

## 📐 Arquitectura objetivo

```
bootcamp/week-06/3-proyecto/eduflow/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── student.entity.js
│   │   │   ├── course.entity.js
│   │   │   └── submission.entity.js
│   │   ├── value-objects/
│   │   │   ├── email.vo.js
│   │   │   ├── grade.vo.js
│   │   │   └── cohort.vo.js
│   │   ├── aggregates/
│   │   │   └── enrollment.aggregate.js
│   │   ├── ports/
│   │   │   ├── primary/
│   │   │   │   └── student-service.port.js
│   │   │   └── secondary/
│   │   │       ├── student.repository.port.js
│   │   │       ├── course.repository.port.js
│   │   │       └── notification.port.js
│   │   └── services/
│   │       └── enrollment.domain-service.js
│   ├── application/
│   │   └── use-cases/
│   │       ├── enroll-student.use-case.js
│   │       ├── submit-task.use-case.js
│   │       └── grade-submission.use-case.js
│   ├── infrastructure/
│   │   ├── repositories/
│   │   │   ├── in-memory-student.repository.js
│   │   │   └── postgres-student.repository.js
│   │   └── notifications/
│   │       ├── console-notification.adapter.js
│   │       └── in-memory-notification.adapter.js
│   ├── interfaces/
│   │   └── http/
│   │       ├── students.controller.js
│   │       └── courses.controller.js
│   └── main.js
├── tests/
│   ├── domain/
│   │   ├── student.test.js
│   │   ├── grade.test.js
│   │   └── enrollment.test.js
│   └── application/
│       ├── enroll-student.test.js
│       └── submit-task.test.js
├── package.json
└── README.md
```

---

## 📋 Requerimientos del dominio EduFlow

### Reglas de negocio (DEBEN vivir en el dominio)

1. **Registro de aprendices**
   - El email es único en el sistema
   - El nombre debe tener mínimo 3 caracteres
   - El cohort es obligatorio (ej: `2025-1`, `2025-2`)

2. **Matrículas (Enrollment)**
   - Un aprendiz puede estar matriculado en máximo **5 cursos activos**
   - No puede matricularse en el mismo curso dos veces
   - Un curso no puede tener más de **30 aprendices**

3. **Tareas y calificaciones**
   - La nota mínima es 0 y la máxima es 10
   - Una nota >= 6 es aprobatoria
   - Para aprobar un curso el promedio de notas debe ser >= 6
   - Una tarea solo puede calificarse una vez (no modificable)

4. **Notificaciones automáticas**
   - Al matricularse: notificar al aprendiz y al instructor
   - Al calificar con nota < 6: notificar al aprendiz con retroalimentación
   - Al aprobar el curso: notificar con certificado de aprobación

---

## 🛠️ Implementación paso a paso

### Fase 1 — Modelado del dominio (sin infraestructura)

**Student entity:**

```javascript
// src/domain/entities/student.entity.js
import { randomUUID } from "crypto";
import { Email } from "../value-objects/email.vo.js";
import { Cohort } from "../value-objects/cohort.vo.js";

export class Student {
  #id;
  #name;
  #email;
  #cohort;
  #isActive;

  constructor({ id = randomUUID(), name, email, cohort }) {
    if (!name || name.trim().length < 3) {
      throw new Error("Student name must have at least 3 characters");
    }
    this.#id = id;
    this.#name = name.trim();
    this.#email = email instanceof Email ? email : new Email(email);
    this.#cohort = cohort instanceof Cohort ? cohort : new Cohort(cohort);
    this.#isActive = true;
  }

  deactivate() {
    this.#isActive = false;
  }

  get id() {
    return this.#id;
  }
  get name() {
    return this.#name;
  }
  get email() {
    return this.#email.value;
  }
  get cohort() {
    return this.#cohort.value;
  }
  get isActive() {
    return this.#isActive;
  }
}
```

**Grade value object:**

```javascript
// src/domain/value-objects/grade.vo.js
export class Grade {
  #value;

  constructor(value) {
    const num = Number(value);
    if (isNaN(num) || num < 0 || num > 10) {
      throw new Error(`Invalid grade: ${value}. Must be between 0 and 10`);
    }
    this.#value = Math.round(num * 10) / 10; // 1 decimal
    Object.freeze(this);
  }

  get isApproved() {
    return this.#value >= 6;
  }
  get value() {
    return this.#value;
  }

  equals(other) {
    return other instanceof Grade && this.#value === other.value;
  }

  toString() {
    return this.#value.toString();
  }
}
```

**Enrollment aggregate:**

```javascript
// src/domain/aggregates/enrollment.aggregate.js
import { randomUUID } from "crypto";
import { Grade } from "../value-objects/grade.vo.js";

export class Enrollment {
  #id;
  #studentId;
  #courseId;
  #grades = [];
  #status;
  #events = [];

  static MAX_GRADE_ENTRIES = 10;

  constructor({
    id = randomUUID(),
    studentId,
    courseId,
    status = "ACTIVE",
    grades = [],
  }) {
    this.#id = id;
    this.#studentId = studentId;
    this.#courseId = courseId;
    this.#status = status;
    this.#grades = grades.map((g) => (g instanceof Grade ? g : new Grade(g)));
  }

  addGrade(value) {
    if (this.#status !== "ACTIVE") {
      throw new Error("Cannot add grade to non-active enrollment");
    }
    const grade = new Grade(value);
    this.#grades.push(grade);

    this.#events.push({
      type: "GradeAdded",
      enrollmentId: this.#id,
      studentId: this.#studentId,
      courseId: this.#courseId,
      grade: grade.value,
      isApproved: grade.isApproved,
    });

    // Verificar si completo el curso
    if (this.#grades.length >= Enrollment.MAX_GRADE_ENTRIES) {
      this.#checkCompletion();
    }
  }

  #checkCompletion() {
    const avg = this.averageGrade;
    this.#status = avg >= 6 ? "APPROVED" : "FAILED";
    this.#events.push({
      type: this.#status === "APPROVED" ? "CourseApproved" : "CourseFailed",
      enrollmentId: this.#id,
      studentId: this.#studentId,
      courseId: this.#courseId,
      averageGrade: avg,
    });
  }

  get averageGrade() {
    if (!this.#grades.length) return null;
    const sum = this.#grades.reduce((acc, g) => acc + g.value, 0);
    return Math.round((sum / this.#grades.length) * 10) / 10;
  }

  pullEvents() {
    const events = [...this.#events];
    this.#events = [];
    return events;
  }

  get id() {
    return this.#id;
  }
  get studentId() {
    return this.#studentId;
  }
  get courseId() {
    return this.#courseId;
  }
  get status() {
    return this.#status;
  }
  get grades() {
    return this.#grades.map((g) => g.value);
  }
}
```

---

### Fase 2 — Casos de uso

```javascript
// src/application/use-cases/enroll-student.use-case.js
import { Enrollment } from "../../domain/aggregates/enrollment.aggregate.js";

export class EnrollStudentUseCase {
  #studentRepository;
  #courseRepository;
  #enrollmentRepository;
  #notificationPort;
  #enrollmentService;

  constructor({
    studentRepository,
    courseRepository,
    enrollmentRepository,
    notificationPort,
    enrollmentService,
  }) {
    this.#studentRepository = studentRepository;
    this.#courseRepository = courseRepository;
    this.#enrollmentRepository = enrollmentRepository;
    this.#notificationPort = notificationPort;
    this.#enrollmentService = enrollmentService;
  }

  async execute({ studentId, courseId }) {
    const [student, course] = await Promise.all([
      this.#studentRepository.findById(studentId),
      this.#courseRepository.findById(courseId),
    ]);

    if (!student) throw new Error(`Student ${studentId} not found`);
    if (!course) throw new Error(`Course ${courseId} not found`);

    const activeEnrollments =
      await this.#enrollmentRepository.findActiveByStudent(studentId);
    const courseEnrollments =
      await this.#enrollmentRepository.findByCourse(courseId);

    // Reglas de negocio via servicio de dominio
    this.#enrollmentService.validateEnrollment(
      student,
      course,
      activeEnrollments,
      courseEnrollments,
    );

    const enrollment = new Enrollment({ studentId, courseId });
    await this.#enrollmentRepository.save(enrollment);

    await this.#notificationPort.studentEnrolled({ student, course });

    return enrollment;
  }
}
```

---

### Fase 3 — Tests (sin BD, sin servidor)

```javascript
// tests/application/enroll-student.test.js
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { EnrollStudentUseCase } from "../../src/application/use-cases/enroll-student.use-case.js";

describe("EnrollStudentUseCase", () => {
  // TODO: Implementa los mocks y pruebas aquí
  // PISTA: Usa objetos JavaScript simples como mocks de repositorios
  it("enrolls student in available course", async () => {
    // Tu implementación aquí
    assert.ok(true); // Reemplaza con assertion real
  });
});
```

---

## 📊 Entregables

| Entregable                              | Descripción                                   | Peso |
| --------------------------------------- | --------------------------------------------- | ---- |
| `domain/` completo                      | Entidades, VOs, Agregados, Puertos, Servicios | 30%  |
| `application/` con 3 casos de uso       | enroll, submit-task, grade-submission         | 25%  |
| `infrastructure/` con InMemory adapters | Cada repositorio y notificación               | 20%  |
| Tests corriendo sin BD                  | `node --test tests/` < 2 segundos             | 25%  |

---

## ✅ Criterios de éxito

```bash
# Comando de verificación
node --test tests/

# Resultado esperado:
# ✓ Student entity - valid creation
# ✓ Student entity - rejects short name
# ✓ Grade VO - approves >= 6
# ✓ Enrollment aggregate - adds grade and fires event
# ✓ EnrollStudentUseCase - enrolls successfully
# ✓ EnrollStudentUseCase - rejects when max enrollments reached
# ... (mínimo 10 pruebas pasando)
#
# Duration: < 2000ms
# No DB connections. No HTTP servers. No network calls.
```

---

## 💡 Recursos de apoyo

- [Teoría: Clean Architecture](../1-teoria/02-clean-architecture.md)
- [Teoría: Arquitectura Hexagonal](../1-teoria/03-arquitectura-hexagonal.md)
- [Teoría: DDD Básico](../1-teoria/04-ddd-basico.md)
- [Práctica 01: Refactorización](../2-practicas/01-practica-clean-architecture.md)
- [Práctica 02: Ports & Adapters](../2-practicas/02-practica-hexagonal.md)
- [Práctica 03: DDD](../2-practicas/03-practica-ddd.md)
