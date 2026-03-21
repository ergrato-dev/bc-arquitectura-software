# 📊 Rúbrica de Evaluación - Semana 03: Patrones Arquitectónicos Clásicos

## 📋 Sistema de Evaluación SENA

Esta rúbrica está diseñada bajo el modelo de **3 tipos de evidencias** del SENA, con un criterio de aprobación mínimo del **70% en cada evidencia**.

---

## 🧠 1. Evidencia de Conocimiento (30%)

**Objetivo**: Demostrar comprensión conceptual de patrones arquitectónicos clásicos

| Criterio                             | Excelente (100%)                                                                                                                      | Satisfactorio (70-99%)                                                                      | Insuficiente (<70%)                                                          | Peso |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---- |
| **Definición de patrones**           | Explica con claridad qué es un patrón arquitectónico, diferencia con patrón de diseño, y proporciona ejemplos del mundo real          | Explica qué es un patrón arquitectónico pero con imprecisiones menores o ejemplos limitados | No diferencia entre patrón arquitectónico y de diseño, o explicación confusa | 20%  |
| **Comprensión de patrones clásicos** | Identifica correctamente características, ventajas y desventajas de los 4 patrones principales (Layered, C/S, Event-Driven, MVC/MVVM) | Identifica al menos 3 patrones con sus características básicas pero con imprecisiones       | No identifica correctamente los patrones o confunde sus características      | 30%  |
| **Criterios de selección**           | Explica de forma clara y estructurada los criterios para seleccionar un patrón (escalabilidad, complejidad, contexto, equipo)         | Menciona algunos criterios pero sin profundidad o estructura clara                          | No identifica criterios válidos de selección                                 | 25%  |
| **Casos de uso**                     | Asocia correctamente cada patrón con casos de uso reales y justifica por qué es apropiado                                             | Asocia patrones con casos de uso pero sin justificación clara                               | No identifica casos de uso apropiados para cada patrón                       | 25%  |

### ✅ Instrumentos de Evaluación:

- Documento `PATRON-SELECCIONADO.md` del proyecto integrador
- Respuestas en matriz de selección de patrones
- Justificaciones técnicas escritas

### 📊 Cálculo:

**Evidencia de Conocimiento = (Definición × 0.2) + (Comprensión × 0.3) + (Criterios × 0.25) + (Casos × 0.25)**

**Aprobación mínima**: 70/100

---

## 💪 2. Evidencia de Desempeño (40%)

**Objetivo**: Aplicar patrones arquitectónicos en análisis y diseño de sistemas

| Criterio                               | Excelente (100%)                                                                                                                          | Satisfactorio (70-99%)                                                    | Insuficiente (<70%)                                                           | Peso |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---- |
| **Análisis de arquitecturas reales**   | Identifica correctamente los patrones en 3+ sistemas reales (Netflix, Spotify, etc.), explicando el porqué                                | Identifica patrones en 2 sistemas con explicaciones básicas               | Identifica menos de 2 sistemas o con errores de concepto                      | 20%  |
| **Aplicación de Layered Architecture** | Implementa correctamente arquitectura en 3 capas con separación clara de responsabilidades y bajo acoplamiento                            | Implementa 3 capas pero con algunas mezclas de responsabilidades          | No separa correctamente las capas o mezcla lógica de negocio con presentación | 25%  |
| **Selección justificada de patrón**    | Selecciona patrón para su proyecto con matriz de decisión completa y justificación técnica sólida (escalabilidad, mantenibilidad, equipo) | Selecciona patrón con justificación básica pero sin análisis profundo     | Selección sin justificación o con argumentos incorrectos                      | 30%  |
| **Documentación arquitectónica**       | Crea diagramas claros (capas, componentes, flujo) con notación correcta y documentación explicativa                                       | Crea diagramas básicos pero con notación inconsistente o falta de detalle | Diagramas confusos o sin relación clara con el patrón seleccionado            | 25%  |

### ✅ Instrumentos de Evaluación:

- Prácticas guiadas completadas
- Diagramas de arquitectura del proyecto
- Código de implementación en capas
- Matriz de selección de patrones

### 📊 Cálculo:

**Evidencia de Desempeño = (Análisis × 0.2) + (Layered × 0.25) + (Selección × 0.3) + (Documentación × 0.25)**

**Aprobación mínima**: 70/100

---

## 📦 3. Evidencia de Producto (30%)

**Objetivo**: Entregar documentación arquitectónica y código funcional aplicando un patrón

| Criterio                             | Excelente (100%)                                                                                                          | Satisfactorio (70-99%)                                                               | Insuficiente (<70%)                                            | Peso |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------- | ---- |
| **Documento PATRON-SELECCIONADO.md** | Documento completo con: patrón elegido, justificación, ventajas/desventajas, diagrama arquitectónico, decisiones técnicas | Documento con los elementos principales pero falta profundidad o algunos componentes | Documento incompleto o sin justificación técnica clara         | 35%  |
| **Diagrama arquitectónico**          | Diagrama profesional con notación clara (C4, UML), componentes bien definidos, y relaciones explícitas                    | Diagrama funcional pero con notación inconsistente o falta de detalle                | Diagrama confuso o que no representa el patrón seleccionado    | 25%  |
| **Código estructurado según patrón** | Código organizado según el patrón seleccionado, carpetas claras, separación de responsabilidades evidente                 | Código con estructura básica del patrón pero mezcla algunas responsabilidades        | Código sin estructura clara o no refleja el patrón documentado | 30%  |
| **README actualizado**               | README con sección de arquitectura explicando patrón, diagrama, y decisiones tomadas                                      | README con información básica de arquitectura pero sin detalles                      | README sin información arquitectónica o desactualizado         | 10%  |

### ✅ Entregables:

1. **Carpeta de proyecto**: `bootcamp/week-03-patrones-arquitectonicos-clasicos/tu-proyecto/`
2. **Archivos obligatorios**:
   - `PATRON-SELECCIONADO.md` (documento principal)
   - `README.md` (actualizado con sección arquitectura)
   - Diagrama arquitectónico (SVG, PNG o PlantUML)
   - Código estructurado en carpetas según patrón
3. **Código ejecutable** (mínimo funcionalidad básica)

### 📊 Cálculo:

**Evidencia de Producto = (Documento × 0.35) + (Diagrama × 0.25) + (Código × 0.3) + (README × 0.1)**

**Aprobación mínima**: 70/100

---

## 🎯 Calificación Final

```
Nota Final = (Evidencia Conocimiento × 0.30) +
             (Evidencia Desempeño × 0.40) +
             (Evidencia Producto × 0.30)
```

### Escala de Calificación:

- **90-100**: Excelente - Dominio completo de patrones arquitectónicos
- **70-89**: Satisfactorio - Comprensión adecuada y aplicación correcta
- **< 70**: Insuficiente - Requiere refuerzo y retroalimentación

---

## 📋 Ejemplo de Evaluación

**Estudiante:** Juan Pérez  
**Dominio de proyecto:** Sistema de gestión de inventario

| Evidencia        | Criterios Evaluados                                                            | Nota      | Peso | Subtotal  |
| ---------------- | ------------------------------------------------------------------------------ | --------- | ---- | --------- |
| **Conocimiento** | - Definición: 90<br>- Comprensión: 85<br>- Criterios: 80<br>- Casos de uso: 90 | **86.25** | 30%  | 25.88     |
| **Desempeño**    | - Análisis: 95<br>- Layered: 80<br>- Selección: 85<br>- Documentación: 75      | **82.75** | 40%  | 33.10     |
| **Producto**     | - Documento: 85<br>- Diagrama: 80<br>- Código: 75<br>- README: 90              | **81.25** | 30%  | 24.38     |
| **TOTAL**        |                                                                                |           |      | **83.36** |

**Resultado**: ✅ **Aprobado - Satisfactorio**

---

## ⚠️ Criterios de Aprobación

Para aprobar esta semana, el estudiante debe cumplir:

1. ✅ **Mínimo 70/100 en Evidencia de Conocimiento**
2. ✅ **Mínimo 70/100 en Evidencia de Desempeño**
3. ✅ **Mínimo 70/100 en Evidencia de Producto**
4. ✅ **Nota final ≥ 70/100**

**⚠️ Importante**: Si alguna evidencia individual está por debajo de 70, aunque la nota final sea mayor a 70, el estudiante debe reforzar esa evidencia específica.

---

## 🔄 Retroalimentación y Mejora Continua

### Si obtienes menos de 70 en alguna evidencia:

**Conocimiento (<70)**:

- Revisar material teórico de la semana
- Ver videos explicativos en recursos
- Participar en sesiones de refuerzo
- Consultar ebooks sobre patrones arquitectónicos

**Desempeño (<70)**:

- Repetir prácticas guiadas con acompañamiento
- Analizar ejemplos adicionales de arquitecturas reales
- Solicitar retroalimentación sobre diagramas
- Revisar código de referencia en repositorios del bootcamp

**Producto (<70)**:

- Mejorar documentación con plantilla proporcionada
- Refinar diagrama con notación correcta
- Reestructurar código según patrón seleccionado
- Actualizar README con información completa

---

## 📅 Fechas Importantes

- **Entrega prácticas guiadas**: Fin de sesión presencial (Hora 4)
- **Entrega proyecto integrador**: Domingo 23:59 (fin de semana autónomo)
- **Retroalimentación**: Lunes siguiente (inicio de semana 04)
- **Plazo para mejoras**: 3 días después de retroalimentación

---

## 💡 Recomendaciones para Maximizar tu Calificación

1. ✅ **Lee toda la teoría antes de comenzar las prácticas**
2. ✅ **Analiza al menos 3 sistemas reales** (Netflix, Spotify, Uber, Amazon)
3. ✅ **Crea tu diagrama antes de escribir código**
4. ✅ **Justifica cada decisión arquitectónica** con argumentos técnicos
5. ✅ **Revisa la rúbrica antes de entregar** para verificar completitud
6. ✅ **Usa notación estándar** (C4, UML) en tus diagramas
7. ✅ **Mantén coherencia** entre documento, diagrama y código

---

## 📚 Recursos de Apoyo

- **Teoría completa**: `bootcamp/week-03-patrones-arquitectonicos-clasicos/1-teoria/`
- **Ejemplos de código**: `bootcamp/week-03-patrones-arquitectonicos-clasicos/2-practicas/`
- **Plantillas de documentación**: `bootcamp/week-03-patrones-arquitectonicos-clasicos/3-proyecto/`
- **Videos explicativos**: `bootcamp/week-03-patrones-arquitectonicos-clasicos/4-recursos/videografia/`
- **Consultas**: Foro del bootcamp o sesiones de tutoría

---

**Bootcamp de Arquitectura de Software - Semana 03**  
_SENA - Tecnología en Análisis y Desarrollo de Software_  
_bc-channel-epti_

_Rúbrica actualizada: Febrero 2026_
