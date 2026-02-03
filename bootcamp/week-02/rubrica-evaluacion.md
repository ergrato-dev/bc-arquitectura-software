# 📊 Rúbrica de Evaluación - Semana 02

## 🎯 Sistema de Evaluación SENA

La evaluación sigue el modelo pedagógico del SENA basado en **evidencias de aprendizaje**:

- **Evidencia de Conocimiento** 🧠: Comprensión de principios SOLID
- **Evidencia de Desempeño** 💪: Aplicación práctica de principios
- **Evidencia de Producto** 📦: Código refactorizado y documentado

**Criterio de aprobación**: Mínimo **70%** en cada evidencia

---

## 📋 Distribución de Calificación

| Evidencia           | Peso | Puntaje Máximo |
| ------------------- | ---- | -------------- |
| **Conocimiento** 🧠 | 30%  | 30 puntos      |
| **Desempeño** 💪    | 40%  | 40 puntos      |
| **Producto** 📦     | 30%  | 30 puntos      |
| **TOTAL**           | 100% | **100 puntos** |

---

## 🧠 Evidencia de Conocimiento (30 puntos)

### Evaluación Teórica

**Método**: Quiz + Explicación oral de conceptos

| Criterio                                  | Excelente (9-10)                                         | Bueno (7-8)                              | Suficiente (6-7)                   | Insuficiente (0-5)        |
| ----------------------------------------- | -------------------------------------------------------- | ---------------------------------------- | ---------------------------------- | ------------------------- |
| **Los 5 Principios SOLID** (10pts)        | Explica todos los principios con ejemplos propios        | Explica los 5 principios correctamente   | Explica 3-4 principios básicamente | No diferencia principios  |
| **Cohesión y Acoplamiento** (10pts)       | Diferencia tipos y explica impacto con métricas          | Identifica diferencias y características | Define conceptos básicos           | No comprende diferencias  |
| **Identificación de Violaciones** (10pts) | Identifica violaciones y propone soluciones justificadas | Identifica mayoría de violaciones        | Identifica algunas violaciones     | No identifica violaciones |

### Instrumentos de Evaluación

1. **Quiz Online** (15 puntos)
   - 20 preguntas: 10 teóricas + 10 de análisis de código
   - Duración: 30 minutos
   - Temas: Los 5 principios, cohesión, acoplamiento, refactorización

2. **Explicación Oral** (15 puntos)
   - Explicar 1 principio SOLID con ejemplo propio
   - Justificar por qué es importante
   - Identificar violaciones en código mostrado

---

## 💪 Evidencia de Desempeño (40 puntos)

### Ejercicios Prácticos

| Práctica                                 | Puntaje | Criterios de Evaluación                                                                      |
| ---------------------------------------- | ------- | -------------------------------------------------------------------------------------------- |
| **Práctica 01: Identificar Violaciones** | 12 pts  | Identificación precisa de violaciones, Propuestas de solución viables, Justificación técnica |
| **Práctica 02: Refactorización Guiada**  | 18 pts  | Aplicación correcta de SOLID, Código funcional, Mejora mensurable de calidad                 |
| **Práctica 03: Diseño desde Cero**       | 10 pts  | Sistema extensible, Alta cohesión, Bajo acoplamiento                                         |

### Rúbrica Detallada - Práctica 01 (12 puntos)

| Criterio                          | Excelente (10-12)                                            | Bueno (7-9)                              | Suficiente (5-6)                    | Insuficiente (0-4)                  |
| --------------------------------- | ------------------------------------------------------------ | ---------------------------------------- | ----------------------------------- | ----------------------------------- |
| **Identificación de violaciones** | Identifica todas las violaciones (8+) con análisis detallado | Identifica 5-7 violaciones correctamente | Identifica 3-4 violaciones          | Identifica < 3 o incorrectamente    |
| **Propuestas de solución**        | Soluciones técnicamente sólidas y justificadas               | Soluciones razonables con justificación  | Soluciones básicas funcionales      | Soluciones incorrectas o no viables |
| **Comprensión de principios**     | Relaciona violaciones con impacto en mantenibilidad          | Explica qué principio se viola           | Identifica el principio básicamente | No relaciona con principios SOLID   |

### Rúbrica Detallada - Práctica 02 (18 puntos)

| Criterio               | Excelente (15-18)                                 | Bueno (11-14)                           | Suficiente (8-10)             | Insuficiente (0-7)           |
| ---------------------- | ------------------------------------------------- | --------------------------------------- | ----------------------------- | ---------------------------- |
| **Aplicación de SRP**  | Clases con responsabilidad única y bien definida  | Clases mayormente con 1 responsabilidad | Algunas clases refactorizadas | SRP no aplicado              |
| **Aplicación de OCP**  | Sistema extensible sin modificar código existente | Extensibilidad en la mayoría de casos   | Extensibilidad básica         | Sistema cerrado a extensión  |
| **Aplicación de LSP**  | Herencia correcta, subtipos sustituibles          | Herencia razonable                      | Herencia funcional            | Violaciones de LSP           |
| **Aplicación de ISP**  | Interfaces segregadas, sin métodos innecesarios   | Interfaces razonables                   | Interfaces básicas            | Interfaces infladas          |
| **Aplicación de DIP**  | Dependencias a abstracciones, bajo acoplamiento   | Algunas dependencias invertidas         | Inversión básica              | Alto acoplamiento a detalles |
| **Calidad del código** | Código limpio, bien documentado, tests incluidos  | Código funcional y legible              | Código funcional básico       | Código difícil de entender   |

### Rúbrica Detallada - Práctica 03 (10 puntos)

| Criterio                      | Excelente (9-10)                                 | Bueno (7-8)                            | Suficiente (5-6)                 | Insuficiente (0-4)             |
| ----------------------------- | ------------------------------------------------ | -------------------------------------- | -------------------------------- | ------------------------------ |
| **Diseño SOLID desde inicio** | Todos los principios aplicados armónicamente     | 4 de 5 principios bien aplicados       | 3 de 5 principios aplicados      | < 3 principios o mal aplicados |
| **Extensibilidad**            | Fácil agregar nuevas funcionalidades sin cambios | Extensible con algunos cambios menores | Extensible con cambios moderados | Cambios requieren reescribir   |
| **Cohesión**                  | Alta cohesión en todos los módulos               | Alta cohesión en mayoría de módulos    | Cohesión moderada                | Baja cohesión                  |
| **Acoplamiento**              | Bajo acoplamiento, dependencias mínimas          | Acoplamiento razonable                 | Acoplamiento moderado            | Alto acoplamiento              |

---

## 📦 Evidencia de Producto (30 puntos)

### Proyecto Integrador - Refactorización con SOLID

| Componente                | Puntaje | Criterios                                                                        |
| ------------------------- | ------- | -------------------------------------------------------------------------------- |
| **Código Refactorizado**  | 15 pts  | Aplicación de los 5 principios SOLID, Funcionalidad preservada, Calidad mejorada |
| **Documento de Análisis** | 5 pts   | Violaciones identificadas, Impacto explicado, Decisiones justificadas            |
| **Diagramas de Clases**   | 5 pts   | Antes y después claros, Notación UML correcta, Cambios evidentes                 |
| **Tests Unitarios**       | 5 pts   | Cobertura adecuada, Tests significativos, Validación de comportamiento           |

### Rúbrica Detallada - Código Refactorizado (15 puntos)

| Criterio                  | Excelente (13-15)                             | Bueno (10-12)                           | Suficiente (7-9)                | Insuficiente (0-6)                 |
| ------------------------- | --------------------------------------------- | --------------------------------------- | ------------------------------- | ---------------------------------- |
| **Single Responsibility** | Todas las clases con responsabilidad única    | Mayoría de clases con 1 responsabilidad | Algunas clases refactorizadas   | SRP no aplicado                    |
| **Open/Closed**           | Fácilmente extensible sin modificación        | Extensible con cambios mínimos          | Algo extensible                 | Requiere modificaciones constantes |
| **Liskov Substitution**   | Herencia correcta, polimorfismo bien usado    | Herencia funcional                      | Herencia básica                 | Violaciones de LSP                 |
| **Interface Segregation** | Interfaces cohesivas y específicas            | Interfaces razonables                   | Interfaces funcionales          | Interfaces infladas                |
| **Dependency Inversion**  | Dependencias invertidas, uso de abstracciones | Algunas inversiones de dependencia      | Inversión básica                | Alto acoplamiento concreto         |
| **Funcionalidad**         | Funcionalidad 100% preservada y mejorada      | Funcionalidad preservada                | Funcionalidad básica conservada | Funcionalidad rota                 |

### Rúbrica Detallada - Documento de Análisis (5 puntos)

| Criterio                      | Excelente (5)                                     | Bueno (4)                            | Suficiente (3)                    | Insuficiente (0-2)         |
| ----------------------------- | ------------------------------------------------- | ------------------------------------ | --------------------------------- | -------------------------- |
| **Violaciones identificadas** | Todas las violaciones con análisis de impacto     | Mayoría de violaciones identificadas | Algunas violaciones identificadas | Pocas o incorrectas        |
| **Justificación técnica**     | Decisiones justificadas con trade-offs analizados | Decisiones justificadas              | Justificaciones básicas           | Sin justificaciones claras |
| **Claridad y estructura**     | Documento profesional y bien estructurado         | Documento claro                      | Documento básico                  | Documento confuso          |

### Rúbrica Detallada - Diagramas de Clases (5 puntos)

| Criterio                    | Excelente (5)                          | Bueno (4)               | Suficiente (3)    | Insuficiente (0-2)               |
| --------------------------- | -------------------------------------- | ----------------------- | ----------------- | -------------------------------- |
| **Diagramas antes/después** | Ambos claros con mejoras evidentes     | Diagramas completos     | Diagramas básicos | Diagramas incompletos o confusos |
| **Notación UML**            | UML correcta con relaciones apropiadas | UML mayormente correcta | UML básica        | Notación incorrecta              |
| **Legibilidad**             | Diagramas profesionales y legibles     | Diagramas claros        | Diagramas básicos | Difícil de entender              |

### Rúbrica Detallada - Tests Unitarios (5 puntos)

| Criterio             | Excelente (5)                                | Bueno (4)         | Suficiente (3)    | Insuficiente (0-2)            |
| -------------------- | -------------------------------------------- | ----------------- | ----------------- | ----------------------------- |
| **Cobertura**        | > 80% cobertura con tests significativos     | 60-80% cobertura  | 40-60% cobertura  | < 40% cobertura               |
| **Calidad de tests** | Tests que validan comportamiento, casos edge | Tests funcionales | Tests básicos     | Tests triviales o incorrectos |
| **Organización**     | Tests bien organizados y documentados        | Tests organizados | Tests funcionales | Tests desorganizados          |

---

## ✅ Checklist de Entrega

Antes de entregar, verifica:

### Evidencia de Conocimiento

- [ ] Quiz completado (20 preguntas)
- [ ] Participación en explicaciones orales

### Evidencia de Desempeño

- [ ] Práctica 01: Violaciones identificadas con soluciones
- [ ] Práctica 02: Refactorización completa paso a paso
- [ ] Práctica 03: Sistema diseñado desde cero con SOLID

### Evidencia de Producto

- [ ] Código refactorizado funcional (JavaScript ES2023)
- [ ] Documento de análisis (PDF o Markdown)
- [ ] Diagrama de clases ANTES (UML)
- [ ] Diagrama de clases DESPUÉS (UML)
- [ ] Tests unitarios ejecutables (Jest/Mocha)
- [ ] README con instrucciones de ejecución
- [ ] package.json con dependencias

---

## 📊 Ejemplos de Calificación

### Ejemplo 1: Estudiante Excelente (92 puntos - Aprobado)

| Evidencia    | Puntaje Obtenido | Puntaje Máximo |
| ------------ | ---------------- | -------------- |
| Conocimiento | 28/30            | 93%            |
| Desempeño    | 37/40            | 92%            |
| Producto     | 27/30            | 90%            |
| **TOTAL**    | **92/100**       | **92%**        |

**Retroalimentación**: Excelente comprensión y aplicación de SOLID. Código refactorizado muestra dominio de todos los principios. Diagramas claros y tests completos. Continúa con esa calidad.

---

### Ejemplo 2: Estudiante Aprobado (74 puntos - Aprobado)

| Evidencia    | Puntaje Obtenido | Puntaje Máximo |
| ------------ | ---------------- | -------------- |
| Conocimiento | 22/30            | 73%            |
| Desempeño    | 29/40            | 72.5%          |
| Producto     | 23/30            | 77%            |
| **TOTAL**    | **74/100**       | **74%**        |

**Retroalimentación**: Comprensión adecuada de SOLID. Aplica mayoría de principios correctamente. Mejorar LSP y DIP. Tests funcionales pero pueden ser más completos. Buen trabajo.

---

### Ejemplo 3: Estudiante No Aprobado (62 puntos - Reprobado)

| Evidencia    | Puntaje Obtenido | Puntaje Máximo |
| ------------ | ---------------- | -------------- |
| Conocimiento | 18/30            | 60% ❌         |
| Desempeño    | 24/40            | 60% ❌         |
| Producto     | 20/30            | 67% ❌         |
| **TOTAL**    | **62/100**       | **62%**        |

**Retroalimentación**: Comprensión básica de SOLID pero aplicación insuficiente. Muchas violaciones de principios en código refactorizado. LSP y DIP no aplicados. Tests insuficientes. Requiere refuerzo.

**Acción**: Plan de mejoramiento con tutorías adicionales.

---

## 🔄 Plan de Mejoramiento

Si no alcanzas el 70% en alguna evidencia:

### Paso 1: Identificar Debilidades

- Revisa qué principios SOLID no dominas
- Identifica qué prácticas fallaste

### Paso 2: Refuerzo Teórico

- Repasa teoría de principios específicos
- Ve videos explicativos de bc-channel-epti
- Consulta ejemplos adicionales en recursos

### Paso 3: Práctica Adicional

- Ejercicios de refactorización extra
- Code katas de SOLID (disponibles en plataforma)
- Pair programming con compañeros

### Paso 4: Tutoría Personalizada

- Sesión con instructor (1 hora)
- Revisión de código en vivo
- Aclaración de dudas específicas

### Paso 5: Reentrega

- Plazo: 1 semana después de recibir calificación
- Solo se mejoran evidencias con < 70%
- Mismo formato y criterios

---

## 📅 Cronograma de Evaluación

| Actividad                        | Fecha                        | Peso |
| -------------------------------- | ---------------------------- | ---- |
| **Quiz (Conocimiento)**          | Viernes de semana presencial | 15%  |
| **Explicación oral**             | Durante sesión presencial    | 15%  |
| **Práctica 01**                  | Martes EOD                   | 12%  |
| **Práctica 02**                  | Miércoles EOD                | 18%  |
| **Práctica 03**                  | Jueves EOD                   | 10%  |
| **Proyecto + Tests + Diagramas** | Domingo 23:59                | 30%  |

**EOD** = End of Day (fin del día)

---

## 📧 Contacto y Dudas

**Dudas sobre evaluación**:

- Consulta en sesión presencial
- Email: instructor@sena.edu.co
- Foro del curso

**Solicitud de revisión de calificación**:

- Plazo: 3 días hábiles después de publicar calificación
- Formato: Email con justificación técnica

---

## 💡 Consejos para Obtener Excelente Calificación

1. **Comprende el "por qué"**: No solo apliques SOLID, entiende por qué cada principio importa
2. **Ejemplos concretos**: Usa casos del mundo real en tus explicaciones
3. **Justifica decisiones**: Explica trade-offs cuando balanceas principios
4. **Código limpio**: No solo SOLID, también nombres claros y comentarios útiles
5. **Tests significativos**: No tests triviales, valida comportamiento real
6. **Diagramas profesionales**: Usa herramientas (Draw.io, PlantUML, Mermaid)
7. **Documenta tu proceso**: Explica cómo llegaste a cada decisión

---

**Bootcamp de Arquitectura de Software**
_SENA - Week 02 - Rúbrica de Evaluación_

_"La calidad del código se mide por su mantenibilidad, no su complejidad"_ 🏗️
