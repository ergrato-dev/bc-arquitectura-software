# 📅 Semana 06: Arquitecturas Modernas

> **Tema Central**: Del monolito al futuro — Microservicios, Clean Architecture y Arquitectura Hexagonal

## 🎯 Objetivos de Aprendizaje

Al finalizar esta semana, serás capaz de:

- ✅ Comprender la evolución del monolito hacia arquitecturas modernas y cuándo hace sentido migrar
- ✅ Diseñar sistemas aplicando Clean Architecture de Robert C. Martin
- ✅ Implementar la Arquitectura Hexagonal (Ports & Adapters) en JavaScript ES2023
- ✅ Identificar Bounded Contexts y entidades de dominio con principios de DDD básico
- ✅ Comparar arquitecturas modernas y seleccionar la más adecuada según el contexto
- ✅ Conectar los patrones de diseño (semana 05) con las arquitecturas modernas (semana 06)
- ✅ Refactorizar la API del proyecto hacia una arquitectura limpia

---

## 📚 Contenido Teórico (4 horas)

1. **[De Monolitos a Microservicios](1-teoria/01-monolito-a-microservicios.md)** (60 min)
   - Monolito: ventajas, limitaciones y cuándo seguir usándolo
   - Microservicios: qué son, qué resuelven y el precio que cobran
   - Modular Monolith: el camino intermedio que nadie habla
   - Cuándo migrar (y cuándo NO migrar)

2. **[Clean Architecture](1-teoria/02-clean-architecture.md)** (60 min)
   - La regla de dependencia: capas que solo apuntan hacia adentro
   - Entidades, Casos de Uso, Adaptadores, Frameworks
   - Independencia del framework, base de datos y UI
   - Implementación en JavaScript ES2023

3. **[Arquitectura Hexagonal (Ports & Adapters)](1-teoria/03-arquitectura-hexagonal.md)** (60 min)
   - El hexágono: dominio en el centro, mundo exterior en los bordes
   - Ports: interfaces que el dominio define
   - Adapters: implementaciones concretas del mundo exterior
   - Comparación con Clean Architecture

4. **[Domain-Driven Design (DDD) Básico](1-teoria/04-ddd-basico.md)** (60 min)
   - Ubiquitous Language: hablar el idioma del negocio
   - Entities y Value Objects
   - Aggregates y Repositories
   - Bounded Contexts: dividir el dominio con sentido

---

## 🎨 Material Visual

Los siguientes diagramas están vinculados en los archivos de teoría:

1. **[01-evolucion-arquitecturas.svg](0-assets/01-evolucion-arquitecturas.svg)** - Monolito → Modular → Microservicios
2. **[02-clean-architecture-capas.svg](0-assets/02-clean-architecture-capas.svg)** - Capas concéntricas y regla de dependencia
3. **[03-hexagonal-puertos-adaptadores.svg](0-assets/03-hexagonal-puertos-adaptadores.svg)** - Diagrama del hexágono
4. **[04-ddd-conceptos.svg](0-assets/04-ddd-conceptos.svg)** - Building blocks de DDD
5. **[05-comparacion-arquitecturas.svg](0-assets/05-comparacion-arquitecturas.svg)** - Tabla comparativa

---

## 💻 Prácticas (2 horas)

1. **[Clean Architecture en Práctica](2-practicas/01-practica-clean-architecture.md)** (40 min)
   - Estructurar un proyecto Node.js con capas limpias
   - Implementar un caso de uso con independencia del framework

2. **[Arquitectura Hexagonal en Práctica](2-practicas/02-practica-hexagonal.md)** (40 min)
   - Definir Ports como interfaces
   - Crear Adapters para base de datos y HTTP
   - Intercambiar adaptadores sin tocar el dominio

3. **[Bounded Contexts con DDD](2-practicas/03-practica-ddd.md)** (40 min)
   - Identificar entidades y value objects en un dominio
   - Modelar un Aggregate con su Repository
   - Diseñar Bounded Contexts para un sistema real

---

## 🎯 Reto de la Semana

**[Reto: EduFlow — Refactorización hacia Arquitectura Hexagonal](reto-semana-06.md)**

- Tomar el código de semanas anteriores y migrarlo a Hexagonal
- Definir ports para la persistencia y la entrega HTTP
- Demostrar que el dominio funciona sin Express ni base de datos real
- Documentar las decisiones arquitectónicas

---

## 🚀 Proyecto Integrador

**[Proyecto Semana 06](3-proyecto/proyecto-semana-06.md)**: Migrar tu API hacia Clean Architecture o Arquitectura Hexagonal

**Continuidad del proyecto:**

- 🗓️ **Semana 01**: Seleccionaste el dominio y la metodología ✅
- 🗓️ **Semana 02**: Aplicaste principios SOLID ✅
- 🗓️ **Semana 03**: Definiste el patrón arquitectónico ✅
- 🗓️ **Semana 04**: Diseñaste e implementaste la API RESTful ✅
- 🗓️ **Semana 05**: Aplicaste patrones de diseño GoF ✅
- 🗓️ **Semana 06**: _(hoy)_ Migras a una arquitectura moderna
- 🗓️ **Semana 07**: Dockerizarás la aplicación
- 🗓️ **Semana 08**: Agregarás seguridad por diseño
- 🗓️ **Semana 09**: Presentación del proyecto final

---

## 📦 Recursos

- **[Ebooks gratuitos](4-recursos/ebooks-free/README.md)** — Clean Architecture (Robert C. Martin), DDD Quickly (gratis), Building Microservices (Sam Newman)
- **[Videografía](4-recursos/videografia/README.md)** — Videos del canal bc-channel-epti + referencias externas
- **[Webgrafía](4-recursos/webgrafia/README.md)** — Referencias, herramientas y comunidades

---

## 📖 Glosario

**[Términos clave de la semana](5-glosario/README.md)** — Monolito, Microservicio, Clean Architecture, Hexagonal, Port, Adapter, DDD, Bounded Context, Ubiquitous Language, Entity, Value Object, Aggregate, Repository, Use Case

---

## 📊 Evaluación

| Tipo de Evidencia | Peso | Criterio de Aprobación |
| ----------------- | ---- | ---------------------- |
| 🧠 Conocimiento   | 30%  | Mínimo 70%             |
| 💪 Desempeño      | 40%  | Mínimo 70%             |
| 📦 Producto       | 30%  | Mínimo 70%             |

Ver **[Rúbrica de Evaluación](rubrica-evaluacion.md)** para los criterios completos.

---

## 🗺️ Navegación del Bootcamp

| Semana | Tema                                    | Enlace                              |
| ------ | --------------------------------------- | ----------------------------------- |
| 01     | Fundamentos de Arquitectura             | [→ Semana 01](../week-01/README.md) |
| 02     | Principios SOLID                        | [→ Semana 02](../week-02/README.md) |
| 03     | Patrones Arquitectónicos Clásicos       | [→ Semana 03](../week-03/README.md) |
| 04     | Diseño de Componentes y Comunicación    | [→ Semana 04](../week-04/README.md) |
| 05     | Patrones de Diseño                      | [→ Semana 05](../week-05/README.md) |
| **06** | **Arquitecturas Modernas** ← estás aquí |                                     |
| 07     | Arquitectura en la Nube                 | [→ Semana 07](../week-07/README.md) |
| 08     | Seguridad en Arquitectura               | [→ Semana 08](../week-08/README.md) |
| 09     | Proyecto Integrador Final               | [→ Semana 09](../week-09/README.md) |

---

> 💡 **Reflexión**: Netflix procesaba todo en un monolito en 2008. En 2009 comenzó la migración a microservicios que duró **7 años**. Hoy gestiona más de 700 microservicios. La lección no es "los microservicios son mejores" — es "elige la arquitectura que tu equipo y tu contexto pueden sostener".

_Bootcamp de Arquitectura de Software · SENA · bc-channel-epti_
