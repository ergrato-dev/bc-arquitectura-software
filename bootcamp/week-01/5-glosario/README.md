# 📚 Glosario - Semana 01: Fundamentos de Arquitectura

## 🎯 Términos Clave de la Semana

Este glosario contiene las definiciones de los términos más importantes de la Semana 01. Úsalo como referencia rápida.

---

## A

### ADR (Architecture Decision Record)

**¿Qué es?**: Documento que registra una decisión arquitectónica importante, incluyendo contexto, alternativas consideradas y consecuencias.

**¿Para qué sirve?**: Mantener historial de decisiones técnicas para futuros desarrolladores y tu yo del futuro.

**Ejemplo**: "ADR-001: Elegimos PostgreSQL sobre MongoDB porque necesitamos transacciones ACID para pagos."

**Ver también**: Deuda Técnica, Trade-off

---

### Arquitectura de Software

**¿Qué es?**: Conjunto de decisiones estructurales fundamentales sobre cómo se organizan los componentes de un sistema y cómo se relacionan entre sí.

**¿Para qué sirve?**: Definir el "plano maestro" del sistema antes de construirlo.

**Analogía**: Es como el plano de un edificio: define estructura, materiales, ubicación de pilares.

**Ver también**: Diseño de Software, Patrones Arquitectónicos

---

### Atributos de Calidad

**¿Qué es?**: Características medibles del sistema que determinan qué tan bien cumple su propósito.

**Principales atributos**:

- **Rendimiento**: Qué tan rápido responde
- **Escalabilidad**: Capacidad de crecer
- **Disponibilidad**: Porcentaje de tiempo operativo
- **Seguridad**: Protección contra amenazas
- **Mantenibilidad**: Facilidad para modificar
- **Usabilidad**: Facilidad de uso

**Ver también**: NFR (Non-Functional Requirements)

---

## B

### Bounded Context

**¿Qué es?**: Límite explícito dentro del cual un modelo de dominio es aplicable (concepto de DDD).

**Ejemplo**: En un e-commerce:

- Contexto "Pedidos": Producto tiene precio, stock
- Contexto "Catálogo": Producto tiene descripción, imágenes

**Ver también**: Microservicio, Domain-Driven Design

---

## C

### CI/CD (Continuous Integration / Continuous Delivery)

**¿Qué es?**: Prácticas de automatizar integración de código y despliegue a producción.

**CI (Continuous Integration)**:

- Integrar código varias veces al día
- Ejecutar tests automatizados

**CD (Continuous Delivery)**:

- Código siempre listo para producción
- Deploy automático

**Herramientas**: Jenkins, GitHub Actions, GitLab CI, CircleCI

**Ver también**: DevOps, Deployment

---

### Cohesión

**¿Qué es?**: Grado en que los elementos dentro de un módulo están relacionados entre sí.

**Alta cohesión (✅ bueno)**:

```javascript
class UserService {
  createUser() {}
  updateUser() {}
  deleteUser() {}
  // Todo relacionado con usuarios
}
```

**Baja cohesión (❌ malo)**:

```javascript
class UtilityService {
  createUser() {}
  sendEmail() {}
  calculateTax() {}
  // Cosas NO relacionadas
}
```

**Ver también**: Acoplamiento, Principio de Responsabilidad Única

---

## D

### Deuda Técnica

**¿Qué es?**: Costo futuro que se paga por tomar atajos o decisiones subóptimas en el presente.

**Tipos**:

- **Deliberada**: "Sabemos que está mal, pero lanzamos ya"
- **Accidental**: Por falta de conocimiento
- **Obsolescencia**: Tecnologías desactualizadas

**Analogía**: Como pedir un préstamo: avanzas rápido ahora, pero pagarás intereses después.

**Ver también**: Refactorización, Mantenibilidad

---

### DevOps

**¿Qué es?**: Cultura y conjunto de prácticas que unifican desarrollo (Dev) y operaciones (Ops).

**Prácticas clave**:

- CI/CD automatizado
- Infraestructura como código (IaC)
- Monitoreo continuo
- Cultura de colaboración

**Objetivo**: Despliegues frecuentes, seguros y rápidos.

**Ver también**: CI/CD, Microservicios

---

### Diseño de Software

**¿Qué es?**: Decisiones a bajo nivel sobre cómo implementar componentes específicos (clases, métodos, algoritmos).

**Diferencia con Arquitectura**:

- Arquitectura: "Usaremos microservicios"
- Diseño: "La clase UserService tendrá el método createUser()"

**Ver también**: Arquitectura de Software, Patrones de Diseño

---

## E

### Escalabilidad

**¿Qué es?**: Capacidad de un sistema de manejar crecimiento de usuarios, datos o transacciones.

**Tipos**:

**Escalado Vertical (Scale Up)**:

- Agregar más poder a un servidor (más RAM, CPU)
- Límite físico
- Más costoso

**Escalado Horizontal (Scale Out)**:

- Agregar más servidores
- Casi ilimitado
- Más económico

**Ver también**: Rendimiento, Load Balancer

---

## K

### Kanban

**¿Qué es?**: Metodología ágil basada en visualización del flujo de trabajo.

**Características**:

- Tablero visual (To Do, In Progress, Done)
- Límites de trabajo en progreso (WIP limits)
- Flujo continuo (no sprints)

**Cuándo usar**: Soporte, mantenimiento, trabajo impredecible.

**Ver también**: Scrum, Metodologías Ágiles

---

## M

### Metodología de Desarrollo

**¿Qué es?**: Conjunto estructurado de prácticas y procesos para planificar, diseñar y construir software.

**Tipos principales**:

- **Tradicionales**: Cascada (Waterfall)
- **Ágiles**: Scrum, Kanban, XP

**Ver también**: Scrum, Cascada, Proceso de Desarrollo

---

### Microservicio

**¿Qué es?**: Estilo arquitectónico donde la aplicación se compone de servicios pequeños, independientes y desplegables por separado.

**Características**:

- Cada servicio tiene su propia base de datos
- Comunicación vía APIs (HTTP REST, gRPC)
- Desplegables independientemente
- Escalado granular

**Ejemplo**: Netflix tiene 700+ microservicios.

**Ver también**: Monolito, Arquitectura Distribuida

---

### Monolito

**¿Qué es?**: Estilo arquitectónico donde toda la aplicación es una sola unidad desplegable.

**Características**:

- Todo el código en un solo repositorio
- Una sola base de datos
- Deploy conjunto (todo o nada)

**Ventajas**:

- ✅ Simple de desarrollar inicialmente
- ✅ Fácil de debuggear
- ✅ Menos complejidad operacional

**Desventajas**:

- ❌ Difícil de escalar
- ❌ Deploy riesgoso (todo junto)
- ❌ Acoplamiento alto

**Ver también**: Microservicio, N-Capas

---

## N

### NFR (Non-Functional Requirements)

**¿Qué es?**: Requisitos que NO son funcionalidades, sino atributos de calidad.

**Ejemplos**:

- "El sistema debe responder en < 2 segundos" (Rendimiento)
- "Disponibilidad 99.9%" (Disponibilidad)
- "Soportar 10,000 usuarios concurrentes" (Escalabilidad)

**Ver también**: Atributos de Calidad, Requisitos Funcionales

---

## P

### Patrones Arquitectónicos

**¿Qué es?**: Soluciones reutilizables para problemas comunes de arquitectura.

**Ejemplos**:

- **Layered (N-Capas)**: Presentación → Lógica → Datos
- **Microservicios**: Servicios independientes
- **Event-Driven**: Basado en eventos
- **Clean Architecture**: Independencia de frameworks

**Ver también**: Arquitectura de Software, Patrones de Diseño

---

## R

### Refactorización

**¿Qué es?**: Mejorar la estructura interna del código SIN cambiar su comportamiento externo.

**Objetivos**:

- Mejorar legibilidad
- Reducir complejidad
- Facilitar mantenimiento
- Pagar deuda técnica

**Cuándo hacerla**: Continuamente (no esperar hasta que el código sea inmanejable).

**Ver también**: Deuda Técnica, Mantenibilidad

---

## S

### Scrum

**¿Qué es?**: Framework ágil con iteraciones fijas (sprints) de 1-4 semanas.

**Roles**:

- Product Owner: Representa al cliente
- Scrum Master: Facilita el proceso
- Development Team: Desarrolladores

**Ceremonias**:

- Sprint Planning
- Daily Standup
- Sprint Review
- Retrospectiva

**Artefactos**:

- Product Backlog
- Sprint Backlog
- Increment

**Ver también**: Metodologías Ágiles, Kanban

---

### Sprint

**¿Qué es?**: Iteración de tiempo fijo (usualmente 2 semanas) en Scrum donde se entrega un incremento funcional.

**Fases**:

1. Planning: Qué haremos
2. Development: Construir
3. Review: Mostrar al cliente
4. Retrospective: Qué mejorar

**Ver también**: Scrum, Iteración

---

### Stakeholder

**¿Qué es?**: Cualquier persona u organización interesada en el proyecto.

**Ejemplos**:

- Cliente/Usuario final
- Product Owner
- Equipo de desarrollo
- Gerencia
- Inversionistas

**Ver también**: Product Owner, Usuario

---

## T

### Trade-off

**¿Qué es?**: Compromiso donde ganas algo pero pierdes otra cosa. No hay solución perfecta, solo trade-offs.

**Ejemplos**:

- **Rendimiento vs Seguridad**: Encriptar es seguro pero lento
- **Flexibilidad vs Simplicidad**: Microservicios son flexibles pero complejos
- **Tiempo vs Calidad**: Lanzar rápido vs lanzar pulido

**Ver también**: Atributos de Calidad, Decisiones Arquitectónicas

---

## W

### Waterfall (Cascada)

**¿Qué es?**: Metodología tradicional donde las fases son secuenciales y no se solapan.

**Fases**:

1. Requisitos
2. Diseño
3. Implementación
4. Pruebas
5. Despliegue
6. Mantenimiento

**Características**:

- Planificación exhaustiva al inicio
- Documentación extensa
- Cambios difíciles y costosos

**Ver también**: Metodologías Tradicionales, V-Model

---

## X

### XP (Extreme Programming)

**¿Qué es?**: Metodología ágil enfocada en excelencia técnica.

**Prácticas**:

- Test-Driven Development (TDD)
- Pair Programming
- Continuous Integration
- Refactoring continuo
- Simple Design

**Ver también**: TDD, Metodologías Ágiles

---

## 📚 Referencias

Para profundizar en estos términos:

- **Software Architecture in Practice** - Bass, Clements, Kazman
- **Design Patterns** - Gang of Four
- **Clean Architecture** - Robert C. Martin
- **The Phoenix Project** - Gene Kim (DevOps)
- **Scrum Guide** - Ken Schwaber, Jeff Sutherland

---

## 🔍 Cómo Usar Este Glosario

1. **Durante la lectura**: Consulta términos que no entiendas
2. **Antes de evaluaciones**: Repasa definiciones clave
3. **En tu proyecto**: Usa la terminología correcta en documentación
4. **Expande**: Agrega tus propias notas y ejemplos

---

**Bootcamp de Arquitectura de Software**
_SENA - Week 01 - Glosario_

_Este glosario se expandirá cada semana con nuevos términos._
