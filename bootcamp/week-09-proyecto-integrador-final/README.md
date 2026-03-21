# 📅 Semana 09: Proyecto Integrador Final

> **Tema Central**: Consolidación y demostración de competencias — construiste un sistema completo, ahora explícalo y defiéndelo

---

## 🎯 Objetivos de Aprendizaje

Al finalizar esta semana, serás capaz de:

- ✅ Sintetizar los conceptos de arquitectura de software aplicados durante las 8 semanas previas
- ✅ Documentar decisiones arquitectónicas usando el formato ADR (Architecture Decision Record)
- ✅ Presentar y defender tu sistema ante pares y docentes con argumentos técnicos sólidos
- ✅ Evaluar la arquitectura de otro proyecto aplicando criterios de calidad ISO 25010
- ✅ Identificar trade-offs aceptados en tu diseño y justificarlos con evidencia
- ✅ Reflexionar sobre el proceso de aprendizaje y planificar tu desarrollo como arquitecto
- ✅ Entregar documentación técnica completa: ADRs, diagramas C4, guía de despliegue y reporte de seguridad

---

## 📚 Contenido Teórico (4 horas presenciales)

1. **[Síntesis Arquitectónica: 8 Semanas en Perspectiva](1-teoria/01-sintesis-arquitectonica.md)** (60 min)
   - Línea de tiempo de evolución del sistema integrador
   - Cómo SOLID, patrones, hexagonal, cloud y seguridad se interconectan
   - El razonamiento arquitectónico como habilidad profesional

2. **[Documentación Arquitectónica: ADRs y C4 Model](1-teoria/02-documentacion-arquitectonica.md)** (60 min)
   - Architecture Decision Records: qué son, para qué sirven, cómo escribirlos
   - C4 Model: Context, Container, Component, Code — cuándo usar cada nivel
   - arc42 ligero: plantilla para documentar sistemas de mediana complejidad

3. **[Atributos de Calidad y Trade-offs en Arquitectura](1-teoria/03-calidad-tradeoffs.md)** (60 min)
   - ISO 25010: modelo de calidad para sistemas y software
   - Trade-offs inevitables: seguridad vs. rendimiento, escalabilidad vs. simplicidad
   - Architecture Fitness Functions: cómo verificar que tu arquitectura mantiene sus propiedades

4. **[Guía de Presentación y Defensa Técnica](1-teoria/04-presentacion-defensa.md)** (60 min)
   - Estructura de una presentación de arquitectura: contexto → problema → solución → trade-offs
   - Cómo demostrar un sistema en vivo de forma efectiva
   - Retroalimentación técnica entre pares: cómo dar y recibir crítica constructiva
   - Preguntas frecuentes en defensas de arquitectura

---

## 🎨 Material Visual

Los siguientes diagramas están vinculados en los archivos de teoría:

1. **[01-evolucion-sistema.svg](0-assets/01-evolucion-sistema.svg)** — Línea de tiempo: semanas 1–8 y cómo evolucionó EduFlow
2. **[02-c4-modelo-niveles.svg](0-assets/02-c4-modelo-niveles.svg)** — Los 4 niveles del C4 Model con ejemplos
3. **[03-arquitectura-final-completa.svg](0-assets/03-arquitectura-final-completa.svg)** — Arquitectura final de EduFlow: todas las capas integradas
4. **[04-iso25010-calidad.svg](0-assets/04-iso25010-calidad.svg)** — Modelo ISO 25010 de calidad del software

---

## 💻 Prácticas (2 horas autónomas)

1. **[Documentación con Architecture Decision Records](2-practicas/01-practica-adr-documentacion.md)** (60 min)
   - Escribir 3 ADRs para tu proyecto personal
   - Identificar y documentar trade-offs aceptados
   - Generar el diagrama C4 nivel 1 y 2 de tu sistema

2. **[Preparación de la Presentación Final](2-practicas/02-practica-presentacion-final.md)** (60 min)
   - Estructura el guión de tu presentación (7 minutos + Q&A)
   - Prepara la demo en vivo de tu API
   - Lista de verificación de entregables finales

---

## 🎯 Reto de la Semana

**[Reto: EduFlow Complete — 8 Semanas, un Sistema](reto-semana-09.md)**

> El sistema EduFlow ha pasado por 8 semanas de evolución: arquitectura en capas → SOLID → patrones clásicos → APIs REST → patrones GoF → arquitectura hexagonal → contenedores Docker → capa de seguridad JWT+RBAC. Ahora es momento de documentarlo, presentarlo y defenderlo como un arquitecto de software.

---

## 🚀 Proyecto Integrador Final

**[Proyecto Final: Tu Sistema Completo — Documentación y Defensa](3-proyecto/proyecto-semana-09.md)**

Documentar el sistema construido semana a semana, generar los ADRs de las decisiones clave, crear los diagramas C4 y preparar la defensa técnica ante pares y docentes.

---

## 📦 Recursos

- **[E-books gratuitos](4-recursos/ebooks-free/README.md)** — Documenting Software Architectures, arc42, C4 Model
- **[Videografía](4-recursos/videografia/README.md)** — C4 Model, ADRs, presentación de arquitectura
- **[Webgrafía](4-recursos/webgrafia/README.md)** — arc42.org, c4model.com, adr.github.io

---

## 📖 Glosario

**[Términos clave del Proyecto Integrador](5-glosario/README.md)** — ADR, C4 Model, ISO 25010, trade-off, quality attribute, arc42 y más.

---

## 🗓️ Distribución de Horas

| Actividad                         | Tipo       | Duración    |
| --------------------------------- | ---------- | ----------- |
| Síntesis Arquitectónica           | Presencial | 60 min      |
| Documentación ADRs y C4           | Presencial | 60 min      |
| Atributos de Calidad y Trade-offs | Presencial | 60 min      |
| Presentaciones y Defensa Técnica  | Presencial | 60 min      |
| **Total presencial**              |            | **4 horas** |
| Práctica ADRs y C4 Model          | Autónomo   | 60 min      |
| Preparación Presentación Final    | Autónomo   | 60 min      |
| **Total autónomo**                |            | **2 horas** |
| **TOTAL SEMANA**                  |            | **6 horas** |

---

## 🏆 Dinámica de la Semana 09

### Sesión Presencial — Presentaciones

| Bloque         | Actividad                             | Duración |
| -------------- | ------------------------------------- | -------- |
| Bloque 1       | Síntesis y teoría de documentación    | 60 min   |
| Bloque 2       | Calidad, trade-offs y guía de defensa | 60 min   |
| Presentaciones | Cada aprendiz: 7 min demo + 3 min Q&A | 120 min  |
| **Cierre**     | Retroalimentación grupal y reflexión  | Incluido |

> 💡 El tiempo de presentación se distribuye entre los aprendices del grupo. En grupos de 10 personas: 10 min por persona = 100 min + 20 min de retroalimentación.

---

## 🔗 Navegación del Bootcamp

| Semana                              | Tema                                       |
| ----------------------------------- | ------------------------------------------ |
| [← Semana 08](../week-08-seguridad-arquitectura/README.md) | Seguridad en la Arquitectura               |
| **Semana 09**                       | **Proyecto Integrador Final ← Estás aquí** |

---

_Bootcamp de Arquitectura de Software — SENA · bc-channel-epti_
