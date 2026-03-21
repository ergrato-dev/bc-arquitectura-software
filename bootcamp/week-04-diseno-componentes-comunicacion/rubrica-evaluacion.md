# 📊 Rúbrica de Evaluación - Semana 04

## Diseño de Componentes y Comunicación

---

## 🎯 Competencias a Evaluar

Esta semana evalúa las siguientes competencias del programa de formación:

1. **Diseñar** componentes de software con interfaces bien definidas
2. **Implementar** APIs RESTful siguiendo estándares y mejores prácticas
3. **Documentar** APIs usando especificaciones OpenAPI/Swagger
4. **Justificar** decisiones de diseño de comunicación (síncrona vs asíncrona)

---

## 📋 Estructura de Evaluación

| Tipo de Evidencia | Peso | Criterio de Aprobación |
| ----------------- | ---- | ---------------------- |
| 🧠 Conocimiento   | 30%  | Mínimo 70%             |
| 💪 Desempeño      | 40%  | Mínimo 70%             |
| 📦 Producto       | 30%  | Mínimo 70%             |

---

## 🧠 Evidencia de Conocimiento (30%)

### Criterios de Evaluación

| Criterio                               | Excelente (100%)                                                                                | Bueno (85%)                                      | Aceptable (70%)                | Insuficiente (<70%)                       |
| -------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------ | ----------------------------------------- |
| **Comprensión de componentes**         | Explica con precisión qué es un componente, interfaz y contrato. Relaciona con principios SOLID | Explica correctamente los conceptos con ejemplos | Explica los conceptos básicos  | Confunde conceptos o no puede explicarlos |
| **Comunicación síncrona vs asíncrona** | Diferencia claramente ambos tipos. Identifica trade-offs y casos de uso específicos             | Diferencia correctamente con ejemplos            | Diferencia con errores menores | No diferencia o confunde los conceptos    |
| **Principios REST**                    | Explica los 6 principios REST, niveles de madurez de Richardson y HATEOAS                       | Explica principios básicos y algunos avanzados   | Explica principios básicos     | No conoce los principios REST             |
| **GraphQL vs REST**                    | Compara ambos con criterios técnicos claros. Identifica cuándo usar cada uno                    | Compara correctamente con algunos criterios      | Menciona diferencias básicas   | No puede comparar o confunde              |

### Instrumento de Evaluación

- **Quiz teórico** (15 preguntas, 20 minutos)
- **Pregunta abierta**: Justificar elección REST vs GraphQL para un caso dado

---

## 💪 Evidencia de Desempeño (40%)

### Criterios de Evaluación

| Criterio                      | Excelente (100%)                                                                          | Bueno (85%)                                | Aceptable (70%)                 | Insuficiente (<70%)                          |
| ----------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------- | -------------------------------------------- |
| **Diseño de componentes**     | Identifica componentes con interfaces claras. Aplica alta cohesión y bajo acoplamiento    | Diseño correcto con interfaces definidas   | Diseño básico funcional         | Diseño confuso sin interfaces claras         |
| **Diseño de API RESTful**     | Endpoints bien nombrados, verbos HTTP correctos, códigos de estado apropiados, versionado | Diseño correcto con errores menores        | Diseño básico funcional         | Endpoints mal diseñados o verbos incorrectos |
| **Implementación Express.js** | Código limpio, estructura modular, manejo de errores, validación de entrada               | Implementación funcional bien estructurada | Implementación básica funcional | No funciona o código desorganizado           |
| **Documentación OpenAPI**     | Especificación completa con esquemas, ejemplos, descripciones y tags                      | Especificación correcta con detalles       | Especificación básica funcional | Incompleta o incorrecta                      |

### Instrumento de Evaluación

- **Práctica guiada**: Implementación de API CRUD observada
- **Revisión de código**: Estructura y calidad del código

---

## 📦 Evidencia de Producto (30%)

### Criterios de Evaluación

| Criterio                    | Excelente (100%)                                                                   | Bueno (85%)                                    | Aceptable (70%)              | Insuficiente (<70%)     |
| --------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------- | ----------------------- |
| **Diagrama de componentes** | Diagrama C4 o UML completo. Interfaces claras, relaciones documentadas             | Diagrama correcto con componentes principales  | Diagrama básico legible      | Sin diagrama o ilegible |
| **Especificación OpenAPI**  | YAML/JSON válido, todos los endpoints documentados, esquemas completos, ejemplos   | Especificación válida con mayoría de endpoints | Especificación básica válida | Inválida o incompleta   |
| **API funcional**           | Todos los endpoints funcionan, validación, manejo de errores, respuestas correctas | API funcional con errores menores              | API básica funcional         | No funciona             |
| **Swagger UI operativo**    | Documentación interactiva, se pueden probar todos los endpoints                    | Documentación visible y navegable              | Swagger básico funcionando   | No funciona             |

### Entregables Requeridos

1. **Diagrama de componentes** (formato: PNG/SVG exportado de Draw.io o PlantUML)
2. **Especificación OpenAPI** (archivo `openapi.yaml` o `openapi.json`)
3. **Código fuente API** (repositorio Git con estructura de carpetas clara)
4. **README del proyecto** con instrucciones de ejecución

---

## 📝 Formato de Entrega

### Estructura de Carpetas Esperada

```
proyecto-semana-04/
├── README.md                    # Instrucciones y documentación
├── docs/
│   ├── diagrama-componentes.svg # Diagrama de arquitectura
│   └── openapi.yaml             # Especificación OpenAPI
├── src/
│   ├── index.js                 # Punto de entrada
│   ├── routes/                  # Rutas de la API
│   ├── controllers/             # Controladores
│   ├── services/                # Lógica de negocio
│   └── models/                  # Modelos de datos
└── package.json
```

### Criterios Técnicos

- ✅ JavaScript ES2023 (const, arrow functions, async/await)
- ✅ pnpm como gestor de paquetes
- ✅ Express.js para el servidor HTTP
- ✅ Swagger UI Express para documentación
- ✅ Código comentado en español (para estudiantes SENA)

---

## 🎯 Lista de Verificación del Estudiante

### Antes de Entregar

- [ ] Mi diagrama de componentes muestra todas las partes del sistema
- [ ] Mi API tiene al menos 4 endpoints CRUD funcionando
- [ ] Uso los verbos HTTP correctos (GET, POST, PUT, DELETE)
- [ ] Los códigos de estado son apropiados (200, 201, 400, 404, 500)
- [ ] Mi especificación OpenAPI es válida (validada en editor.swagger.io)
- [ ] Swagger UI muestra y permite probar mis endpoints
- [ ] El código usa JavaScript ES2023
- [ ] El proyecto tiene README con instrucciones claras
- [ ] Puedo explicar mis decisiones de diseño

---

## 📊 Cálculo de Nota Final

```
Nota Final = (Conocimiento × 0.30) + (Desempeño × 0.40) + (Producto × 0.30)
```

### Ejemplo de Cálculo

| Evidencia    | Puntuación | Peso | Aporte    |
| ------------ | ---------- | ---- | --------- |
| Conocimiento | 85%        | 30%  | 25.5%     |
| Desempeño    | 90%        | 40%  | 36.0%     |
| Producto     | 80%        | 30%  | 24.0%     |
| **Total**    |            |      | **85.5%** |

---

## 🏆 Niveles de Desempeño

| Rango   | Nivel             | Descripción                                                         |
| ------- | ----------------- | ------------------------------------------------------------------- |
| 90-100% | **Sobresaliente** | Supera las expectativas. API profesional con documentación completa |
| 80-89%  | **Alto**          | Cumple todas las expectativas. API funcional bien documentada       |
| 70-79%  | **Básico**        | Cumple expectativas mínimas. API funcional básica                   |
| <70%    | **No Aprobado**   | No cumple expectativas mínimas. Requiere refuerzo                   |

---

## 📅 Fechas Importantes

| Actividad                   | Fecha |
| --------------------------- | ----- |
| Inicio de semana            | Día 1 |
| Entrega de práctica guiada  | Día 3 |
| Entrega de proyecto semanal | Día 5 |
| Retroalimentación           | Día 6 |

---

## 💬 Retroalimentación

La retroalimentación incluirá:

1. **Fortalezas identificadas** en el diseño y la implementación
2. **Oportunidades de mejora** con sugerencias específicas
3. **Recursos adicionales** para profundizar en temas débiles
4. **Conexión con la siguiente semana** (Patrones de Diseño)

---

[⬅️ Volver al README](README.md) | [➡️ Reto de la Semana](reto-semana-04.md)
