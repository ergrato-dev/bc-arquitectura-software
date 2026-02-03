# 📅 Semana 03: Patrones Arquitectónicos Clásicos

> **Tema Central**: Soluciones probadas para problemas recurrentes

## 🎯 Objetivos de Aprendizaje

Al finalizar esta semana, serás capaz de:

- ✅ Comprender qué son los patrones arquitectónicos y cuándo usarlos
- ✅ Identificar las características del patrón en capas (Layered)
- ✅ Diferenciar entre arquitectura Cliente-Servidor y Event-Driven
- ✅ Aplicar el patrón MVC/MVVM en aplicaciones modernas
- ✅ Seleccionar el patrón arquitectónico apropiado según el contexto del problema
- ✅ Justificar decisiones arquitectónicas basadas en ventajas y desventajas de cada patrón
- ✅ Documentar decisiones arquitectónicas con diagramas y argumentación técnica

---

## 📚 Contenido Teórico (4 horas)

1. **[Introducción a Patrones Arquitectónicos](1-teoria/01-introduccion-patrones.md)** (30 min)
   - ¿Qué es un patrón arquitectónico?
   - Diferencia entre patrón arquitectónico y patrón de diseño
   - Historia y catálogos de patrones

2. **[Arquitectura en Capas (Layered)](1-teoria/02-patron-capas.md)** (60 min)
   - Definición y características
   - Capas típicas: Presentación, Negocio, Persistencia
   - Ventajas, desventajas y casos de uso

3. **[Cliente-Servidor y Event-Driven](1-teoria/03-cliente-servidor-eventos.md)** (60 min)
   - Arquitectura Cliente-Servidor (C/S)
   - Arquitectura basada en Eventos (Event-Driven)
   - Comparación y contextos de aplicación

4. **[MVC/MVVM en el Contexto Actual](1-teoria/04-mvc-mvvm.md)** (45 min)
   - Model-View-Controller (MVC)
   - Model-View-ViewModel (MVVM)
   - Aplicaciones en frameworks modernos (React, Vue, Angular)

5. **[Selección de Patrón Arquitectónico](1-teoria/05-seleccion-patron.md)** (45 min)
   - Criterios de selección
   - Matriz de decisión
   - Casos de uso por industria

---

## 🎨 Material Visual

Los siguientes diagramas están vinculados en los archivos de teoría:

1. **[01-patron-vs-diseno.svg](0-assets/01-patron-vs-diseno.svg)** - Diferencia entre patrones arquitectónicos y de diseño
2. **[02-layered-architecture.svg](0-assets/02-layered-architecture.svg)** - Arquitectura en capas tradicional
3. **[03-client-server.svg](0-assets/03-client-server.svg)** - Patrón Cliente-Servidor
4. **[04-event-driven.svg](0-assets/04-event-driven.svg)** - Arquitectura basada en eventos
5. **[05-mvc-mvvm.svg](0-assets/05-mvc-mvvm.svg)** - Comparación MVC vs MVVM
6. **[06-matriz-seleccion.svg](0-assets/06-matriz-seleccion.svg)** - Criterios de selección de patrones

---

## 💻 Prácticas (2 horas)

1. **[Análisis de Arquitecturas Reales](2-practicas/practica-01-analisis-arquitecturas.md)** (45 min)
   - Netflix: Arquitectura en capas + microservicios
   - Slack: Event-Driven
   - Identificar patrones en sistemas conocidos

2. **[Implementación de Layered Architecture](2-practicas/practica-02-layered.md)** (45 min)
   - Crear aplicación de 3 capas en JavaScript ES2023
   - Separación clara de responsabilidades

3. **[Matriz de Selección de Patrones](2-practicas/practica-03-seleccion.md)** (30 min)
   - Ejercicio guiado para seleccionar patrón
   - Justificación técnica de decisiones

---

## 🎯 Reto de la Semana

**[Reto: Refactorizar Aplicación Monolítica con Patrón en Capas](reto-semana-03.md)**

- Código inicial: Aplicación monolítica sin estructura clara
- Objetivo: Aplicar arquitectura en capas separando responsabilidades
- Bonus: Implementar variante Event-Driven

---

## 🚀 Proyecto Integrador

**[Proyecto Semana 03](3-proyecto/proyecto-semana-03.md)**: Definir y justificar el patrón arquitectónico para tu dominio

**Continuidad del proyecto:**

- **Semana 01**: Selección de dominio y metodología ✅
- **Semana 02**: Aplicación de principios SOLID ✅
- **Semana 03**: Definición de patrón arquitectónico ← **ESTÁS AQUÍ**
- **Semana 04**: Diseño de APIs y componentes
- **Semana 05**: Implementación de patrones de diseño
- **Semana 06**: Arquitectura moderna (microservicios/hexagonal)
- **Semana 07**: Containerización con Docker
- **Semana 08**: Seguridad en la arquitectura
- **Semana 09**: Presentación final completa

---

## 📖 Recursos Adicionales

- **[Ebooks gratuitos](4-recursos/ebooks-free/)** - Libros sobre patrones arquitectónicos
- **[Videos bc-channel-epti](4-recursos/videografia/)** - Serie de videos explicativos
- **[Referencias web](4-recursos/webgrafia/)** - Artículos y documentación oficial

---

## 📝 [Glosario](5-glosario/README.md)

Términos clave de la semana:

- Patrón arquitectónico
- Capas (Layers)
- Cliente-Servidor
- Event-Driven
- MVC/MVVM
- Separation of Concerns
- Y más...

---

## ✅ [Rúbrica de Evaluación](rubrica-evaluacion.md)

| Evidencia    | Peso |
| ------------ | ---- |
| Conocimiento | 30%  |
| Desempeño    | 40%  |
| Producto     | 30%  |

**Criterio de aprobación**: Mínimo 70% en cada evidencia

---

## ⏱️ Distribución de Tiempo

**Sesión Presencial (4 horas)**:

- Teoría: 3 horas
- Prácticas guiadas: 1 hora

**Trabajo Autónomo (2 horas)**:

- Proyecto integrador: 1.5 horas
- Recursos complementarios: 30 min

**Total**: 6 horas semanales

---

## 🎓 Competencias Desarrolladas

- **Análisis arquitectónico**: Identificar patrones en sistemas existentes
- **Toma de decisiones**: Seleccionar patrón apropiado según contexto
- **Documentación técnica**: Justificar decisiones con argumentos sólidos
- **Diseño de sistemas**: Aplicar patrones a problemas reales

---

## 📊 Progreso en el Bootcamp

```
Semana 01 ████████████ 100% - Fundamentos ✅
Semana 02 ████████████ 100% - SOLID ✅
Semana 03 ▓▓▓▓▓▓▓▓▓▓▓▓  33% - Patrones Arquitectónicos ← ESTÁS AQUÍ
Semana 04 ░░░░░░░░░░░░   0% - Componentes y Comunicación
Semana 05 ░░░░░░░░░░░░   0% - Patrones de Diseño
Semana 06 ░░░░░░░░░░░░   0% - Arquitecturas Modernas
Semana 07 ░░░░░░░░░░░░   0% - Arquitectura en la Nube
Semana 08 ░░░░░░░░░░░░   0% - Seguridad
Semana 09 ░░░░░░░░░░░░   0% - Proyecto Final
```

---

## 💡 Consejos para esta Semana

✅ **Enfócate en entender el PROBLEMA que resuelve cada patrón, no solo en memorizarlo**
✅ **Analiza arquitecturas reales (Netflix, Spotify, Uber) para ver patrones en acción**
✅ **No existe "el mejor patrón", existe el patrón apropiado para cada contexto**
✅ **Documenta tus decisiones: el "por qué" es tan importante como el "qué"**
✅ **Combina patrones cuando sea necesario, no son mutuamente excluyentes**

---

## 🔗 Navegación

⬅️ [Semana 02: Principios SOLID](../week-02/README.md)
➡️ [Semana 04: Diseño de Componentes y Comunicación](../week-04/README.md)

---

**Bootcamp de Arquitectura de Software - Semana 03**
_SENA - Tecnología en Análisis y Desarrollo de Software_
_bc-channel-epti_
