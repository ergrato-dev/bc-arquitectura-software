# 📅 Semana 02: Principios SOLID

> **Tema Central**: Las bases de una arquitectura sólida y mantenible

## 🎯 Objetivos de Aprendizaje

Al finalizar esta semana, serás capaz de:

- ✅ Comprender y aplicar los 5 principios SOLID en código JavaScript ES2023
- ✅ Identificar violaciones de principios SOLID en código existente
- ✅ Refactorizar código para cumplir con principios de diseño
- ✅ Comprender modularidad, cohesión y acoplamiento
- ✅ Diseñar componentes con alta cohesión y bajo acoplamiento
- ✅ Justificar decisiones de diseño basadas en principios SOLID

---

## 📚 Contenido Teórico (4 horas)

1. **[Introducción a Principios SOLID](1-teoria/01-introduccion-solid.md)** (30 min)
   - ¿Qué son los principios SOLID?
   - Historia y propósito
   - Impacto en mantenibilidad

2. **[Los 5 Principios Explicados](1-teoria/02-principios-detallados.md)** (90 min)
   - Single Responsibility Principle (SRP)
   - Open/Closed Principle (OCP)
   - Liskov Substitution Principle (LSP)
   - Interface Segregation Principle (ISP)
   - Dependency Inversion Principle (DIP)

3. **[Cohesión y Acoplamiento](1-teoria/03-cohesion-acoplamiento.md)** (60 min)
   - Tipos de cohesión
   - Tipos de acoplamiento
   - Métricas de calidad

4. **[SOLID en JavaScript ES2023](1-teoria/04-solid-javascript.md)** (60 min)
   - Adaptaciones para JavaScript
   - Patrones modernos
   - Ejemplos prácticos

---

## 🎨 Material Visual

Los siguientes diagramas están vinculados en los archivos de teoría:

1. **[01-solid-overview.svg](0-assets/01-solid-overview.svg)** - Visión general de los 5 principios
2. **[02-srp-ejemplo.svg](0-assets/02-srp-ejemplo.svg)** - Single Responsibility en acción
3. **[03-ocp-extension.svg](0-assets/03-ocp-extension.svg)** - Open/Closed con estrategias
4. **[04-cohesion-acoplamiento.svg](0-assets/04-cohesion-acoplamiento.svg)** - Tipos de cohesión y acoplamiento
5. **[05-dependency-inversion.svg](0-assets/05-dependency-inversion.svg)** - Inversión de dependencias

---

## 💻 Prácticas (2 horas)

1. **[Identificar Violaciones SOLID](2-practicas/01-practica-srp.md)** (45 min)
   - Análisis de código con problemas
   - Identificar qué principio se viola
   - Proponer soluciones

2. **[Refactorización Guiada](2-practicas/02-practica-ocp.md)** (45 min)
   - Código inicial con múltiples violaciones
   - Paso a paso aplicando SOLID
   - Comparación antes/después

3. **[Diseño desde Cero con SOLID](2-practicas/03-practica-dip.md)** (30 min)
   - Sistema de notificaciones
   - Aplicar todos los principios
   - Código funcional en JavaScript ES2023

---

## 🚀 Proyecto Integrador

**[Proyecto Semana 02](3-proyecto/proyecto-semana-02.md)**: Refactorizar módulo del proyecto con principios SOLID

### Entregables:

- [ ] Código refactorizado aplicando los 5 principios SOLID
- [ ] Documento de análisis de violaciones encontradas
- [ ] Justificación técnica de cada refactorización
- [ ] Diagramas de clases antes y después
- [ ] Tests unitarios que validan el comportamiento

---

## 📖 Recursos

- **[Ebooks](4-recursos/ebooks-free/)**: Clean Code, SOLID Principles, Refactoring
- **[Videos bc-channel-epti](4-recursos/videografia/)**: Serie SOLID explicada
- **[Enlaces web](4-recursos/webgrafia/)**: Artículos y tutoriales

---

## 📝 [Glosario](5-glosario/README.md)

Términos clave de la semana: Cohesión, Acoplamiento, Abstracción, Polimorfismo, Inyección de Dependencias, etc.

---

## ✅ Evaluación

Consulta la **[Rúbrica de Evaluación](rubrica-evaluacion.md)** para conocer los criterios detallados.

| Evidencia       | Peso | Descripción                                     |
| --------------- | ---- | ----------------------------------------------- |
| Conocimiento 🧠 | 30%  | Quiz SOLID + Conceptos de cohesión/acoplamiento |
| Desempeño 💪    | 40%  | Refactorizaciones aplicando principios          |
| Producto 📦     | 30%  | Módulo refactorizado del proyecto               |

**Mínimo aprobatorio**: 70% en cada evidencia

---

## 🎓 Sesión Presencial (4 horas)

### Agenda:

1. **Principios SOLID explicados** (120 min)
   - Presentación teórica con ejemplos reales
   - Netflix, Spotify: ¿cómo usan SOLID?
   - Casos de violaciones y consecuencias

2. **Modularidad, cohesión y acoplamiento** (60 min)
   - Métricas de calidad de código
   - Cómo medir cohesión y acoplamiento
   - Trade-offs en el diseño

3. **Práctica guiada: Refactorización** (60 min)
   - Código en vivo con violaciones
   - Refactorización paso a paso
   - Discusión de alternativas

---

## 📚 Trabajo Autónomo (2 horas)

1. **Ejercicios de aplicación SOLID** (60 min)
   - Completar prácticas 01, 02 y 03
   - Implementar código en JavaScript ES2023

2. **Análisis de código existente** (60 min)
   - Revisar un proyecto open source
   - Identificar aplicación de SOLID
   - Documentar aprendizajes

---

## 🔗 Relación con Semanas Anteriores

**Week 01** ➔ **Week 02** ➔ Week 03

- Week 01: Entendimos **QUÉ es arquitectura** y metodologías
- Week 02: Aprendemos **CÓMO diseñar bien** con principios SOLID
- Week 03: Veremos **patrones arquitectónicos** que usan SOLID

---

## 💡 Consejos para el Éxito

1. **No memorices, comprende**: SOLID son guías, no leyes absolutas
2. **Practica con código real**: Refactoriza tus proyectos anteriores
3. **Identifica trade-offs**: A veces hay que balancear principios
4. **Usa ejemplos concretos**: Piensa en sistemas reales (e-commerce, redes sociales)
5. **Documenta tus decisiones**: Justifica por qué aplicas cada principio

---

## 🎬 Videos Recomendados (bc-channel-epti)

1. **SOLID Explicado con Ejemplos Reales** (20 min)
2. **Refactorización en Vivo: De Código Malo a Código SOLID** (25 min)
3. **Cohesión y Acoplamiento: ¿Cómo Medirlos?** (15 min)
4. **SOLID en JavaScript ES2023: Casos Prácticos** (30 min)

---

**Bootcamp de Arquitectura de Software** • SENA 2026 • Week 02/09

_"SOLID no es sobre perfección, es sobre mantenibilidad"_ 🏗️
