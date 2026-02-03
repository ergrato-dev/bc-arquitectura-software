# 🎯 Práctica 03: Matriz de Selección de Patrones

## 📋 Información General

| Campo              | Detalle                              |
| ------------------ | ------------------------------------ |
| **Duración**       | 30 minutos                           |
| **Nivel**          | Intermedio                           |
| **Prerrequisitos** | Teoría semana 03 completa            |
| **Entregable**     | Documento de decisión arquitectónica |

---

## 🎯 Objetivos de Aprendizaje

Al finalizar esta práctica serás capaz de:

- ✅ Aplicar criterios objetivos para seleccionar patrones arquitectónicos
- ✅ Usar una matriz de decisión ponderada
- ✅ Documentar y justificar decisiones arquitectónicas
- ✅ Considerar trade-offs entre diferentes opciones

---

## 📖 Introducción

Seleccionar el patrón arquitectónico correcto es una de las decisiones más importantes en un proyecto de software. Una mala elección puede resultar en:

- ❌ Costos de refactorización elevados
- ❌ Problemas de escalabilidad
- ❌ Dificultad para mantener el código
- ❌ Tiempo de desarrollo excesivo

En esta práctica, aprenderás a usar una **matriz de decisión** para tomar decisiones arquitectónicas informadas y documentadas.

---

## 🛠️ La Matriz de Decisión

### ¿Qué es?

Una matriz de decisión es una herramienta que permite evaluar múltiples opciones contra criterios definidos, asignando puntuaciones y pesos para obtener una decisión objetiva.

### Componentes:

1. **Opciones**: Los patrones arquitectónicos a evaluar
2. **Criterios**: Los factores importantes para el proyecto
3. **Pesos**: La importancia relativa de cada criterio (suma = 100%)
4. **Puntuaciones**: Evaluación de cada opción por criterio (1-5)
5. **Score final**: Suma ponderada para cada opción

---

## 📝 Caso de Estudio: Sistema de Reservaciones

### Contexto del Proyecto

Una startup quiere desarrollar un **sistema de reservaciones para restaurantes** con las siguientes características:

| Aspecto                | Detalle                                    |
| ---------------------- | ------------------------------------------ |
| **Usuarios esperados** | 10,000 usuarios/mes (crecimiento moderado) |
| **Funcionalidades**    | Reservas, menús, reseñas, pagos            |
| **Equipo**             | 3 desarrolladores junior-medio             |
| **Tiempo**             | 4 meses para MVP                           |
| **Presupuesto**        | Limitado (startup early-stage)             |
| **Plataformas**        | Web + App móvil                            |

### Requisitos No Funcionales

- **Disponibilidad**: 99% uptime
- **Tiempo de respuesta**: < 2 segundos
- **Concurrencia**: 100 usuarios simultáneos (pico)
- **Datos**: Reservaciones, usuarios, restaurantes, reseñas

---

## 🎯 Ejercicio 1: Definir Criterios y Pesos

### Paso 1: Identifica los criterios relevantes

Basándote en el contexto del proyecto, completa la siguiente tabla con el peso (importancia) de cada criterio. **Los pesos deben sumar 100%**.

| Criterio                     | Descripción                          | Peso (%) |
| ---------------------------- | ------------------------------------ | -------- |
| **Tiempo de desarrollo**     | Rapidez para construir el MVP        | **\_**   |
| **Curva de aprendizaje**     | Facilidad para el equipo junior      | **\_**   |
| **Escalabilidad**            | Capacidad de crecer con más usuarios | **\_**   |
| **Mantenibilidad**           | Facilidad para hacer cambios futuros | **\_**   |
| **Costo de infraestructura** | Gastos en servidores y servicios     | **\_**   |
| **Performance**              | Velocidad de respuesta               | **\_**   |
| **TOTAL**                    |                                      | **100%** |

### Reflexión:

¿Por qué asignaste esos pesos? Justifica tu decisión:

```




```

---

## 🎯 Ejercicio 2: Evaluar Opciones

### Opciones a evaluar:

1. **Layered Architecture** (Monolito en capas)
2. **Cliente-Servidor tradicional** (API REST simple)
3. **Event-Driven** (Basado en eventos)
4. **Microservicios** (Servicios independientes)

### Paso 2: Puntúa cada opción (1-5)

Usa la siguiente escala:

- **5** = Excelente
- **4** = Bueno
- **3** = Aceptable
- **2** = Regular
- **1** = Deficiente

| Criterio              | Layered | Cliente-Servidor | Event-Driven | Microservicios |
| --------------------- | :-----: | :--------------: | :----------: | :------------: |
| Tiempo de desarrollo  | **\_**  |      **\_**      |    **\_**    |     **\_**     |
| Curva de aprendizaje  | **\_**  |      **\_**      |    **\_**    |     **\_**     |
| Escalabilidad         | **\_**  |      **\_**      |    **\_**    |     **\_**     |
| Mantenibilidad        | **\_**  |      **\_**      |    **\_**    |     **\_**     |
| Costo infraestructura | **\_**  |      **\_**      |    **\_**    |     **\_**     |
| Performance           | **\_**  |      **\_**      |    **\_**    |     **\_**     |

### Justifica al menos 3 de tus puntuaciones:

1. ****\*\*****\_\_\_\_**\*\*\*\***:\*\*

   ```

   ```

2. ****\*\*****\_\_\_\_**\*\*\*\***:\*\*

   ```

   ```

3. ****\*\*****\_\_\_\_**\*\*\*\***:\*\*

   ```

   ```

---

## 🎯 Ejercicio 3: Calcular Scores

### Paso 3: Calcula el score ponderado

**Fórmula:** `Score = Σ (Peso × Puntuación)`

#### Ejemplo de cálculo:

Si Tiempo de desarrollo tiene peso 30% y Layered tiene puntuación 5:

- Contribución = 0.30 × 5 = 1.5

Completa la tabla de cálculo:

| Criterio              |   Peso    |      Layered      |        C-S        |       Event       |       Micro       |
| --------------------- | :-------: | :---------------: | :---------------: | :---------------: | :---------------: |
| Tiempo de desarrollo  | \_\_\_\_% | × \_**\_ = \_\_** | × \_**\_ = \_\_** | × \_**\_ = \_\_** | × \_**\_ = \_\_** |
| Curva de aprendizaje  | \_\_\_\_% | × \_**\_ = \_\_** | × \_**\_ = \_\_** | × \_**\_ = \_\_** | × \_**\_ = \_\_** |
| Escalabilidad         | \_\_\_\_% | × \_**\_ = \_\_** | × \_**\_ = \_\_** | × \_**\_ = \_\_** | × \_**\_ = \_\_** |
| Mantenibilidad        | \_\_\_\_% | × \_**\_ = \_\_** | × \_**\_ = \_\_** | × \_**\_ = \_\_** | × \_**\_ = \_\_** |
| Costo infraestructura | \_\_\_\_% | × \_**\_ = \_\_** | × \_**\_ = \_\_** | × \_**\_ = \_\_** | × \_**\_ = \_\_** |
| Performance           | \_\_\_\_% | × \_**\_ = \_\_** | × \_**\_ = \_\_** | × \_**\_ = \_\_** | × \_**\_ = \_\_** |
| **SCORE TOTAL**       | **100%**  | \***\*\_\_\*\***  | \***\*\_\_\*\***  | \***\*\_\_\*\***  | \***\*\_\_\*\***  |

### Resultado:

**El patrón ganador es:** ****\*\*****\_\_\_****\*\*****

**Score obtenido:** **\_\_\_**

---

## 🎯 Ejercicio 4: Documentar la Decisión (ADR)

### Architecture Decision Record (ADR)

Completa el siguiente documento de decisión arquitectónica:

```markdown
# ADR-001: Selección de Patrón Arquitectónico

## Estado

Propuesto

## Contexto

[Describe brevemente el problema y el contexto del proyecto]

## Decisión

Hemos decidido usar el patrón **\*\*\*\***\_\_**\*\*\*\*** para el sistema de reservaciones.

## Justificación

### Criterios evaluados:

1.
2.
3.

### Por qué esta opción:

### Por qué NO las otras opciones:

- Layered:
- Cliente-Servidor:
- Event-Driven:
- Microservicios:

## Consecuencias

### Positivas:

-
-
-

### Negativas (trade-offs aceptados):

-
-

### Riesgos mitigables:

-

## Notas

- Fecha de decisión: **\*\***\_\_\_**\*\***
- Participantes: **\*\***\_\_\_**\*\***
```

---

## 🎯 Ejercicio 5: Escenario Alternativo

### Cambio de contexto:

Ahora imagina que el proyecto cambia:

| Aspecto                | Nuevo Detalle             |
| ---------------------- | ------------------------- |
| **Usuarios esperados** | 1,000,000 usuarios/mes    |
| **Equipo**             | 15 desarrolladores senior |
| **Tiempo**             | 12 meses                  |
| **Presupuesto**        | Alto (Series A funding)   |

### Pregunta:

¿Cambiarían tus pesos y tu decisión final? ¿Por qué?

```




```

### Nueva matriz rápida:

Con los nuevos pesos que consideras apropiados:

| Criterio              | Nuevo Peso | Patrón Ganador Probable |
| --------------------- | :--------: | :---------------------: |
| Tiempo de desarrollo  | \_\_\_\_%  |                         |
| Curva de aprendizaje  | \_\_\_\_%  |                         |
| Escalabilidad         | \_\_\_\_%  |                         |
| Mantenibilidad        | \_\_\_\_%  |                         |
| Costo infraestructura | \_\_\_\_%  |                         |
| Performance           | \_\_\_\_%  |                         |

**Nueva decisión:** ****\*\*****\_\_\_****\*\*****

---

## 📊 Tabla de Referencia

### Características típicas de cada patrón:

| Patrón           | Tiempo Dev | Aprendizaje | Escalabilidad | Mantenibilidad |   Costo    |
| ---------------- | :--------: | :---------: | :-----------: | :------------: | :--------: |
| Layered          | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐  |     ⭐⭐      |    ⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐ |
| Cliente-Servidor |  ⭐⭐⭐⭐  |  ⭐⭐⭐⭐   |    ⭐⭐⭐     |     ⭐⭐⭐     |  ⭐⭐⭐⭐  |
| Event-Driven     |    ⭐⭐    |    ⭐⭐     |  ⭐⭐⭐⭐⭐   |      ⭐⭐      |   ⭐⭐⭐   |
| Microservicios   |     ⭐     |     ⭐      |  ⭐⭐⭐⭐⭐   |     ⭐⭐⭐     |    ⭐⭐    |

> ⭐⭐⭐⭐⭐ = Mejor | ⭐ = Peor

---

## ✅ Checklist de Entrega

- [ ] Definí criterios y pesos que suman 100%
- [ ] Evalué las 4 opciones con puntuaciones 1-5
- [ ] Calculé los scores ponderados correctamente
- [ ] Completé el ADR con justificaciones claras
- [ ] Analicé el escenario alternativo
- [ ] Puedo defender mi decisión ante el equipo

---

## 💡 Tips para el Mundo Real

1. **Involucra al equipo**: Las decisiones arquitectónicas deben ser colaborativas
2. **Documenta siempre**: Un ADR te salvará de explicar la misma decisión 100 veces
3. **Revisa periódicamente**: Las decisiones pueden cambiar con nuevos requisitos
4. **No existe el patrón perfecto**: Siempre hay trade-offs
5. **Empieza simple**: Es más fácil agregar complejidad que quitarla

---

## 🔑 Respuestas Sugeridas (Solo para Instructores)

<details>
<summary>Ver respuestas sugeridas para el caso de estudio</summary>

### Pesos sugeridos para startup con equipo junior:

| Criterio              | Peso |
| --------------------- | :--: |
| Tiempo de desarrollo  | 30%  |
| Curva de aprendizaje  | 25%  |
| Escalabilidad         | 15%  |
| Mantenibilidad        | 15%  |
| Costo infraestructura | 10%  |
| Performance           |  5%  |

### Puntuaciones sugeridas:

| Criterio       | Layered | C-S | Event | Micro |
| -------------- | :-----: | :-: | :---: | :---: |
| Tiempo         |    5    |  4  |   2   |   1   |
| Aprendizaje    |    5    |  4  |   2   |   1   |
| Escalabilidad  |    2    |  3  |   5   |   5   |
| Mantenibilidad |    4    |  3  |   2   |   3   |
| Costo          |    5    |  4  |   3   |   2   |
| Performance    |    3    |  4  |   5   |   5   |

### Score calculado:

- **Layered: 4.20** ← Ganador
- Cliente-Servidor: 3.70
- Event-Driven: 2.70
- Microservicios: 2.10

### Decisión recomendada:

**Layered Architecture** es la mejor opción para este contexto específico debido a la combinación de equipo junior, tiempo limitado y presupuesto ajustado.

</details>

---

**¡Felicidades! 🎉** Has aprendido a tomar decisiones arquitectónicas de forma estructurada y justificada.

---

[⬅️ Práctica Anterior](02-practica-layered.md) | [➡️ Volver al README](../README.md)
