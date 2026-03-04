# 📊 Rúbrica de Evaluación - Semana 05

## Patrones de Diseño

---

## 🎯 Competencias a Evaluar

Esta semana evalúa las siguientes competencias del programa de formación:

1. **Identificar** patrones de diseño y relacionarlos con los problemas que resuelven
2. **Implementar** patrones creacionales, estructurales y de comportamiento en JavaScript ES2023
3. **Seleccionar** el patrón adecuado según el contexto del problema
4. **Justificar** decisiones de diseño con argumentos técnicos usando vocabulario preciso

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

| Criterio | Excelente (100%) | Bueno (85%) | Aceptable (70%) | Insuficiente (<70%) |
| -------- | ---------------- | ----------- | --------------- | ------------------- |
| **Comprensión de patrones GoF** | Clasifica correctamente los 23 patrones. Explica el propósito de cada categoría con ejemplos del mundo real | Clasifica y explica los patrones trabajados con ejemplos | Identifica las 3 categorías y da ejemplos básicos | No logra clasificar o confunde los patrones |
| **Problemas que resuelve cada patrón** | Para cada patrón implementado, explica con precisión el problema que existía antes y cómo el patrón lo soluciona | Explica el problema y la solución con detalles suficientes | Explica el propósito general de cada patrón | No puede relacionar patrones con problemas |
| **Patrones vs Anti-patrones** | Identifica anti-patrones comunes (God Object, Spaghetti Code). Explica la diferencia entre un patrón y un anti-patrón | Identifica anti-patrones con ejemplos básicos | Menciona qué es un anti-patrón | No conoce el concepto de anti-patrón |
| **Relación con SOLID** | Relaciona cada patrón con los principios SOLID que refuerza. Ej: Strategy → OCP, Factory → DIP | Relaciona la mayoría de patrones con principios SOLID | Relaciona algunos patrones con principios básicos | No logra relacionar patrones con SOLID |

### Instrumento de Evaluación

- **Quiz teórico** (20 preguntas, 25 minutos)
- **Pregunta de análisis**: Dado un diagrama de clases, identificar el/los patrones utilizados y justificar
- **Pregunta de selección**: Para un requisito dado, elegir el patrón más adecuado y explicar por qué

---

## 💪 Evidencia de Desempeño (40%)

### Criterios de Evaluación

| Criterio | Excelente (100%) | Bueno (85%) | Aceptable (70%) | Insuficiente (<70%) |
| -------- | ---------------- | ----------- | --------------- | ------------------- |
| **Implementación de creacionales** | Implementa Factory Method, Builder y/o Singleton correctamente. El código demuestra comprensión profunda (manejo de edge cases, extensibilidad) | Implementación correcta y funcional de 2+ patrones | Implementación básica funcional de al menos 1 patrón | Implementación incorrecta o no funciona |
| **Implementación de estructurales** | Implementa Adapter, Decorator y/o Facade correctamente. Código limpio con nombres expresivos y documentación | Implementación correcta y funcional de 2+ patrones | Implementación básica funcional de al menos 1 patrón | Implementación incorrecta o no funciona |
| **Implementación de comportamiento** | Implementa Observer, Strategy y/o Command correctamente. Demuestra comprensión de los flujos de ejecución | Implementación correcta y funcional de 2+ patrones | Implementación básica funcional de al menos 1 patrón | Implementación incorrecta o no funciona |
| **Calidad del código** | Código ES2023, nombres expresivos, módulos ES6, sin duplicación. Los patrones son reconocibles y bien estructurados | Código correcto con pequeñas mejoras posibles | Código funcional con oportunidades de mejora | Código desorganizado o difícil de leer |

### Instrumento de Evaluación

- **Práctica guiada** observada: Implementación en vivo de un patrón seleccionado al azar
- **Análisis de código**: Se entrega código con patrón implementado incorrectamente y se pide identificar y corregir el error
- **Live coding** (opcional, +5 puntos): Implementar un patrón adicional no visto en clase

---

## 📦 Evidencia de Producto (30%)

### Criterios de Evaluación

| Criterio | Excelente (100%) | Bueno (85%) | Aceptable (70%) | Insuficiente (<70%) |
| -------- | ---------------- | ----------- | --------------- | ------------------- |
| **Proyecto refactorizado** | El proyecto de semana 04 está refactorizado con mínimo 5 patrones. Cada refactorización mejora la calidad del código de forma visible | Proyecto refactorizado con 3-4 patrones aplicados correctamente | Proyecto con 2 patrones aplicados | Sin refactorización o patrones mal aplicados |
| **Documentación de decisiones** | Para cada patrón aplicado: explica el problema original, la solución con el patrón, el diagrama UML correspondiente y los beneficios obtenidos | Documenta la mayoría de patrones con sus justificaciones | Documenta los patrones aplicados básicamente | Sin documentación de decisiones |
| **Diagramas UML/Mermaid** | Diagramas de clases para cada patrón aplicado, con notación UML correcta, relaciones claras y nombrado preciso | Diagramas correctos para los principales patrones | Diagramas básicos para al menos 2 patrones | Sin diagramas o incorrectos |
| **Pruebas de funcionamiento** | Demuestra que cada patrón funciona con ejemplos de uso. La API sigue funcionando correctamente después de la refactorización | La mayoría de patrones demostrados funcionando | Al menos 2 patrones demostrados funcionando | No demuestra funcionamiento |

### Entregables Requeridos

1. **Código fuente** refactorizado en repositorio Git con historial de commits claro
2. **Documento de decisiones arquitectónicas** (`docs/patrones-aplicados.md`): qué, por qué y cómo de cada patrón
3. **Diagramas UML** de cada patrón aplicado (Mermaid o Draw.io exportado como SVG)
4. **README actualizado** del proyecto con sección de "Patrones de Diseño Utilizados"

---

## 📝 Formato de Entrega

### Estructura de Carpetas Esperada

```
proyecto-semana-05/
├── README.md                       # Documentado con sección de patrones
├── docs/
│   ├── patrones-aplicados.md       # Documento de decisiones
│   └── diagramas/
│       ├── factory-notification.svg
│       ├── observer-events.svg
│       └── ...
├── src/
│   ├── index.js
│   ├── patterns/                   # Implementaciones de patrones (demos)
│   │   ├── factory/
│   │   ├── observer/
│   │   └── strategy/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   └── models/
└── package.json
```

---

## 📅 Fechas importantes

| Actividad | Fecha |
| --------- | ----- |
| Inicio semana | Lunes (semana 5) |
| Entrega del proyecto | Domingo (semana 5) |
| Retroalimentación | Lunes (semana 6) |

---

## 🔢 Cálculo de Nota Final

```
Nota Final = (Conocimiento × 0.30) + (Desempeño × 0.40) + (Producto × 0.30)

Ejemplo:
  Conocimiento:  85/100 × 0.30 = 25.5
  Desempeño:     90/100 × 0.40 = 36.0
  Producto:      80/100 × 0.30 = 24.0
  ─────────────────────────────────────
  Nota Final:                   = 85.5 ✅ APROBADO
```

**Mínimo aprobatorio: 70 puntos en CADA evidencia**

---

_Bootcamp de Arquitectura de Software · SENA · bc-channel-epti_
