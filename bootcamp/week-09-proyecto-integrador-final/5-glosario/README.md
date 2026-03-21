# 📖 Glosario — Semana 09: Proyecto Integrador Final

> Términos técnicos del cierre del bootcamp: documentación arquitectónica, calidad de software y presentación de sistemas.

---

## A

### ADR (Architecture Decision Record)
Documento que registra una decisión arquitectónica importante: el contexto que la motivó, las opciones evaluadas, la decisión tomada y las consecuencias aceptadas. Los ADRs viven en el repositorio junto al código.

**Ejemplo**: `docs/adr/ADR-001-patron-hexagonal.md`

**Por qué importa**: Sin ADRs, la razón de las decisiones se pierde cuando el equipo cambia. Los ADRs convierten el conocimiento tácito en conocimiento explícito y consultable.

---

### arc42
Plantilla estándar para documentar arquitecturas de software. Define 12 secciones (contexto, restricciones, vista de building blocks, etc.). Es de uso libre y adaptable a proyectos de cualquier tamaño.

**Sitio oficial**: https://arc42.org

---

### Architecture Fitness Function
Prueba automatizada que verifica si la arquitectura sigue cumpliendo una propiedad deseada. Pueden ser tests unitarios, scripts de análisis estático, o herramientas de monitoreo.

**Ejemplo**: Un test que verifica que ningún módulo del dominio importa directamente de la capa de infraestructura.

```javascript
// Fitness function: el dominio no puede importar de infraestructura
const infraFiles = await glob('src/domain/**/*.js');
for (const file of infraFiles) {
  const content = await fs.readFile(file, 'utf-8');
  expect(content).not.toMatch(/from ['"].*infrastructure/);
}
```

---

### Atributo de Calidad
Característica no funcional de un sistema de software que define *cómo* se comporta (en lugar de *qué* hace). Definidos en ISO 25010: mantenibilidad, seguridad, fiabilidad, usabilidad, portabilidad, rendimiento, compatibilidad, y adecuación funcional.

---

## C

### C4 Model
Marco de documentación arquitectónica creado por Simon Brown. Define cuatro niveles de abstracción con diferentes audiencias:

- **L1 — Contexto**: El sistema y sus usuarios externos. Para cualquier persona.
- **L2 — Contenedores**: Procesos, bases de datos, aplicaciones web. Para el equipo de desarrollo.
- **L3 — Componentes**: Módulos dentro de un contenedor. Para desarrolladores.
- **L4 — Código**: Clases y relaciones. Para el IDE.

---

### Cohesión
Grado en que los elementos dentro de un módulo pertenecen juntos. **Alta cohesión** significa que un módulo hace una cosa y la hace bien. Visto en Semana 04.

---

### Contenedor (C4)
En el contexto del modelo C4, no se refiere a Docker. Un "contenedor" C4 es cualquier ejecutable, proceso, base de datos, sistema de archivos o aplicación que forma parte del sistema. Un contenedor Docker sí puede ser un contenedor C4.

---

### Contexto (C4)
El primer nivel del modelo C4. Muestra el sistema como una caja negra, rodeado de sus usuarios y sistemas externos. Responde: ¿qué hace el sistema y quién lo usa?

---

## D

### Deuda Técnica
Coste implícito de tomar atajos en el diseño o implementación de software. Como una deuda financiera, genera "intereses" en forma de mayor dificultad para modificar el sistema en el futuro.

**Tipos**: deuda de código (atajos de implementación), deuda arquitectónica (decisiones de diseño subóptimas), deuda de pruebas (falta de tests), deuda de documentación.

---

### Diagrama de Contexto
El diagrama C4 de nivel 1. Muestra el sistema y sus relaciones con usuarios y sistemas externos. Es el diagrama más fácil de entender para personas no técnicas.

---

## E

### Evolutionary Architecture
Arquitectura diseñada para cambiar de forma guiada con el tiempo. En lugar de intentar diseñar el sistema perfecto desde el inicio, se usa fitness functions para proteger propiedades importantes mientras el sistema evoluciona.

---

## F

### Fitness Function
Ver *Architecture Fitness Function*.

---

## H

### Hexagonal Architecture
Ver *Ports and Adapters Architecture*. El dominio del negocio está en el centro, rodeado de puertos (interfaces) y adaptadores (implementaciones concretas). Implementada en Semana 06.

---

## I

### ISO 25010
Estándar internacional que define el modelo de calidad del producto de software. Define 8 características principales: adecuación funcional, rendimiento/eficiencia, compatibilidad, usabilidad, fiabilidad, seguridad, mantenibilidad y portabilidad.

---

## M

### Mantenibilidad
Capacidad de un sistema para ser modificado con facilidad. Sub-características: modularidad, reusabilidad, analizabilidad, modificabilidad, capacidad de prueba.

---

### Mermaid
Herramienta para crear diagramas como código. Se integra nativamente en GitHub Markdown y en muchas herramientas de documentación. Usada en el bootcamp para C4 L1 y C4 L2.

**Editor online**: https://mermaid.live

---

## O

### Over-Engineering
Hacer que una solución sea más compleja de lo necesario para el problema que resuelve. La antítesis del principio YAGNI ("You Aren't Gonna Need It"). Uno de los riesgos más comunes al aprender patrones de diseño.

---

## P

### Portabilidad
Capacidad de un sistema para ser transferido de un entorno a otro. Docker mejora dramáticamente la portabilidad. Sub-características del ISO 25010: adaptabilidad, instalabilidad, reemplazabilidad.

---

## Q

### Quality Attribute
Ver *Atributo de Calidad*.

---

## R

### Refactoring
Proceso de reestructurar código existente sin cambiar su comportamiento externo. El objetivo es mejorar la legibilidad, mantenibilidad o estructura interna. Visto en Semana 01.

---

### Retrospectiva
Práctica ágil de reflexión al final de un sprint o proyecto. El equipo identifica qué salió bien, qué puede mejorar, y qué acciones concretas tomará. En el contexto del bootcamp: reflexión final sobre el aprendizaje del arquitecto.

---

## S

### SOLID (repaso)
Cinco principios de diseño orientado a objetos establecidos por Robert C. Martin:

- **S** — Single Responsibility: una clase, una razón para cambiar
- **O** — Open/Closed: abierto a extensión, cerrado a modificación
- **L** — Liskov Substitution: los subtipos deben ser sustituibles por sus tipos base
- **I** — Interface Segregation: muchas interfaces específicas > una interfaz general
- **D** — Dependency Inversion: depender de abstracciones, no de implementaciones

Estudiados en profundidad en Semana 02.

---

### Síntesis
En pedagogía, el nivel más alto de comprensión: combinar elementos para formar un todo nuevo. La Semana 09 pide síntesis: integrar los conceptos de las 8 semanas anteriores en una presentación y documento coherentes.

---

## T

### Trade-off
Compensación: obtener un beneficio en una dimensión aceptando un costo en otra. Toda decisión arquitectónica implica trade-offs. Documentarlos explícitamente (en ADRs) es señal de madurez técnica.

**Ejemplo**: JWT ofrece escalabilidad (sin estado en servidor) a cambio de no poder revocar tokens inmediatamente.

---

### Tácticas Arquitectónicas
Decisiones de diseño que afectan directamente a un atributo de calidad. Por ejemplo, para mejorar la *disponibilidad*: redundancia, "heartbeat", "retry". Para mejorar la *seguridad*: autenticación, autorización, cifrado.

---

## U

### Ubiquitous Language
Vocabulario común compartido por el equipo de desarrollo y el negocio. Concepto central del Domain-Driven Design (DDD). El código debe usar los mismos términos que usa el negocio.

---

## V

### Vista Arquitectónica
Representación de un sistema desde una perspectiva específica. El modelo C4 define 4 vistas. arc42 define 12 secciones. El modelo 4+1 de Kruchten define 5 vistas (lógica, procesos, desarrollo, física, escenarios).

---

_Este glosario consolida los términos técnicos de todo el bootcamp, con énfasis en los conceptos de la semana de cierre._

_Semana 09 · Glosario · Bootcamp de Arquitectura de Software_
