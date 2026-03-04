# 🎯 Reto Semana 09: EduFlow Complete — "8 Semanas, un Sistema"

> _"La arquitectura de software no es una actividad de una sola vez, es un proceso de toma de decisiones continuo. Cada decisión que tomas hoy define las opciones que tendrás mañana."_
> — Grady Booch

---

## 📖 Contexto: La Evolución de EduFlow

El equipo de **EduFlow** ha recorrido un viaje extraordinario en 8 semanas. Lo que comenzó como una idea sobre una plataforma educativa se convirtió en un sistema robusto, escalable y seguro:

```
Semana 01 → Metodología definida. Dominio del negocio analizado.
Semana 02 → Código refactorizado con SOLID. No más Dios-clases.
Semana 03 → Patrón arquitectónico seleccionado: capas + eventos.
Semana 04 → API REST documentada. Módulos con contratos claros.
Semana 05 → Observer, Strategy, Factory. El código habla.
Semana 06 → Arquitectura Hexagonal. El dominio libre de frameworks.
Semana 07 → Docker + Compose. "Works on my machine" eliminado.
Semana 08 → JWT + RBAC + Hardening. Cero brechas evidentes.
Semana 09 → Documentar, demostrar, defender. ← Estás aquí.
```

El CTO de EduFlow está preparando la ronda de inversión Serie A. Los inversores técnicos quieren revisar la arquitectura antes de tomar la decisión. Necesitas preparar la presentación técnica más importante de tu carrera.

---

## 🚩 El Desafío Final

El equipo técnico de los inversores ha enviado una lista de requisitos para la revisión:

### 1. Diagrama de Contexto C4 (C4 Level 1)

> _"Muéstrame quién usa el sistema y con qué sistemas externos habla."_

```
┌─────────────────────────────────────────────────────────────┐
│                     Sistema EduFlow                          │
│                                                             │
│  Actores:           Sistema:           Externos:           │
│  - Estudiante       EduFlow API         - Email Service     │
│  - Instructor       (Node.js)          - (futuro: OAuth)   │
│  - Admin                                                    │
└─────────────────────────────────────────────────────────────┘
```

**Pregunta del equipo inversor**: "¿Por qué eligieron Node.js sobre Go o Java para el backend?"

### 2. Diagrama de Contenedores C4 (C4 Level 2)

> _"Muéstrame cómo está dividido internamente el sistema que desplegarías en producción."_

```
┌──────────────────────────────────────────────────────────────────────┐
│  [Browser / Mobile]  ──HTTP──→  [EduFlow API Container]             │
│                                  Express.js + Node.js               │
│                                  ↓ SQL                              │
│                                 [PostgreSQL Container]               │
│                                  datos persistentes                 │
│                                  ↓                                  │
│                                 [pgAdmin Container]                  │
│                                  administración BD                  │
└──────────────────────────────────────────────────────────────────────┘
```

**Pregunta del equipo inversor**: "¿Cómo escalarían si llegan a 100,000 usuarios concurrentes?"

### 3. ADR #1 — Decisión de Arquitectura Hexagonal

> _"¿Por qué hexagonal? Convénceme de que no es over-engineering para una startup."_

**Formato esperado de ADR**:

```markdown
# ADR-001: Adoptar Arquitectura Hexagonal

## Estado

Aceptado — 2026-XX-XX

## Contexto

EduFlow necesita una arquitectura que permita cambiar la base de datos de
PostgreSQL a MongoDB en el futuro sin reescribir la lógica de negocio.
El equipo tiene 3 developers Node.js de nivel junior-mid.

## Opciones Consideradas

1. MVC + Express.js (más simple, familiar)
2. Arquitectura en Capas (más estructura)
3. Arquitectura Hexagonal (más flexible)

## Decisión

Arquitectura Hexagonal con puertos y adaptadores.

## Consecuencias

✅ Dominio completamente testeable sin infraestructura
✅ Fácil de cambiar el adaptador de base de datos
❌ Curva de aprendizaje más alta para el equipo
❌ Más archivos y mayor estructura inicial
```

### 4. Demo en Vivo (5 endpoints críticos)

El equipo inversor quiere ver el sistema funcionando:

```bash
# Endpoint 1: Health check
curl http://localhost:3000/health

# Endpoint 2: Registro de usuario
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "student@eduflow.com", "password": "SecurePass123!", "role": "student"}'

# Endpoint 3: Login → JWT
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "student@eduflow.com", "password": "SecurePass123!"}'
# Guarda el token: export TOKEN="eyJ..."

# Endpoint 4: Operación del dominio (protegida)
curl -X GET http://localhost:3000/courses \
  -H "Authorization: Bearer $TOKEN"

# Endpoint 5: Operación con RBAC (solo admin)
curl -X POST http://localhost:3000/courses \
  -H "Authorization: Bearer $TOKEN_STUDENT" \
  -d '{"title": "Test"}'
# Esperado: 403 Forbidden — demuestra que el RBAC funciona
```

### 5. Reporte de Seguridad (OWASP Top 10)

> _"Muéstrame que tu API no aparecerá en las noticias el primer mes de producción."_

El equipo inversor pide una tabla de evidencia:

| Vulnerabilidad OWASP            | ¿Mitigada? | Evidencia en código         |
| ------------------------------- | ---------- | --------------------------- |
| A01 - Broken Access Control     | ✅         | `authorize.js` middleware   |
| A02 - Cryptographic Failures    | ✅         | `bcrypt` + TLS              |
| A03 - Injection                 | ✅         | Zod validation + ORM        |
| A05 - Security Misconfiguration | ✅         | Helmet.js headers           |
| A07 - Identification Failures   | ✅         | JWT + rate limiting         |
| A09 - Logging Failures          | ⚠️         | Logging básico implementado |

---

## 🎯 Tu Misión

Como arquitecto del equipo EduFlow, prepara para la reunión con inversores:

### Checklist de Entregables

- [ ] **Diagrama C4 Nivel 1** — Contexto del sistema (herramienta libre: Mermaid, Draw.io, PlantUML)
- [ ] **Diagrama C4 Nivel 2** — Contenedores y tecnologías
- [ ] **ADR-001** — Decisión de arquitectura hexagonal
- [ ] **ADR-002** — Decisión de JWT vs. sessions para autenticación
- [ ] **ADR-003** — Decisión de PostgreSQL vs. alternativas
- [ ] **Demo funcional** — Los 5 endpoints en vivo
- [ ] **Reporte OWASP** — Tabla de mitigaciones con evidencia de código
- [ ] **Trade-offs aceptados** — Al menos 2 trade-offs documentados con su justificación

---

## 🔥 Preguntas Trampa del Equipo Inversor

El equipo técnico **siempre hace estas preguntas**. Prepara tus respuestas:

> **"Si tuvieras que rehacer el sistema desde cero, ¿qué cambiarías?"**
>
> _Esta pregunta evalúa tu madurez técnica. La respuesta correcta no es "nada", es identificar una limitación real del diseño._

---

> **"Tu arquitectura hexagonal tiene límites. ¿Dónde falla?"**
>
> _Todo patrón tiene sus trade-offs. Un buen arquitecto los conoce: mayor cantidad de archivos, curva de aprendizaje, puede ser over-engineering en proyectos pequeños._

---

> **"¿Cómo garantizas que el sistema sigue siendo 'hexagonal' dentro de 6 meses cuando lleguen developers nuevos?"**
>
> _La respuesta tiene que ver con: documentación (ADRs), tests de arquitectura, code reviews, convenciones de naming._

---

> **"Tu dockerfile expone el puerto 3000 directamente. En producción real, ¿qué pones delante?"**
>
> _Respuesta esperada: un reverse proxy (Nginx/Traefik), HTTPS termination, posiblemente un API Gateway._

---

## 🏆 Criterios de Éxito del Reto

Un arquitecto senior en EduFlow aprobaría tu entrega si:

```javascript
const criteriosExito = {
  c4Contexto: "Sistema, actores y externos identificados correctamente",
  c4Contenedores:
    "Todos los contenedores con tecnología y protocolo explícitos",
  adr001: "Contexto claro, 3 alternativas consideradas, consecuencias honestas",
  adr002: "JWT vs sessions: latencia, stateless, revocación explicados",
  adr003: "Justificación de BD con criterios técnicos del dominio",
  demoVivo: "5 endpoints funcionando: health, register, login, CRUD, RBAC 403",
  reporteOwasp: "Al menos 5 de 6 vulnerabilidades con evidencia de código",
  tradeoffs: "2+ trade-offs documentados con consecuencia asumida explícita",
};
```

---

## 💡 Bonus: Architecture Fitness Functions

Si terminas antes del tiempo, implementa una función de fitness arquitectónico:

```javascript
// fitness-function.test.js
// Verifica que la arquitectura mantiene su propiedad hexagonal:
// ningún archivo en domain/ puede importar desde infrastructure/

import { describe, it, expect } from "vitest";
import { glob } from "glob";
import { readFileSync } from "fs";

describe("Architecture Fitness Functions", () => {
  it("domain layer must not import from infrastructure", async () => {
    // Obtener todos los archivos del dominio
    const domainFiles = await glob("src/domain/**/*.js");

    for (const file of domainFiles) {
      const content = readFileSync(file, "utf-8");
      // Ningún archivo del dominio puede importar desde infrastructure
      expect(content).not.toMatch(/from ['"].*infrastructure.*['"]/);
      expect(content).not.toMatch(/require\(['"].*infrastructure.*['"]\)/);
    }
  });

  it("domain layer must not import Express or external frameworks", async () => {
    const domainFiles = await glob("src/domain/**/*.js");

    for (const file of domainFiles) {
      const content = readFileSync(file, "utf-8");
      const forbiddenImports = [
        "express",
        "fastify",
        "pg",
        "mongoose",
        "axios",
      ];

      for (const forbidden of forbiddenImports) {
        expect(content).not.toMatch(new RegExp(`from ['"]${forbidden}`));
      }
    }
  });
});
```

---

_Bootcamp de Arquitectura de Software — SENA · bc-channel-epti_
