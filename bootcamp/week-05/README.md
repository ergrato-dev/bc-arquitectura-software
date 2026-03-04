# 📅 Semana 05: Patrones de Diseño

> **Tema Central**: Del concepto a la implementación práctica — Patrones que resuelven problemas reales

## 🎯 Objetivos de Aprendizaje

Al finalizar esta semana, serás capaz de:

- ✅ Comprender qué son los patrones de diseño y su relación con la arquitectura
- ✅ Implementar patrones creacionales: Factory Method, Singleton, Builder
- ✅ Aplicar patrones estructurales: Adapter, Decorator, Facade
- ✅ Usar patrones de comportamiento: Observer, Strategy, Command
- ✅ Seleccionar el patrón adecuado según el problema a resolver
- ✅ Reconocer patrones en frameworks y librerías de JavaScript
- ✅ Justificar el uso de patrones con argumentos técnicos concretos

---

## 📚 Contenido Teórico (4 horas)

1. **[Introducción a los Patrones de Diseño](1-teoria/01-introduccion-patrones-diseno.md)** (20 min)
   - Historia: del Gang of Four al mundo JavaScript
   - Categorías: Creacionales, Estructurales, de Comportamiento
   - Cuándo usar (y cuándo NO usar) patrones

2. **[Patrones Creacionales](1-teoria/02-patrones-creacionales.md)** (75 min)
   - Factory Method: crear objetos sin exponer la lógica
   - Singleton: instancia única, recurso compartido
   - Builder: construir objetos complejos paso a paso
   - Abstract Factory: familias de objetos relacionados

3. **[Patrones Estructurales](1-teoria/03-patrones-estructurales.md)** (75 min)
   - Adapter: conectar interfaces incompatibles
   - Decorator: agregar responsabilidades dinámicamente
   - Facade: simplificar sistemas complejos
   - Composite: tratar objetos individuales y colecciones igual

4. **[Patrones de Comportamiento](1-teoria/04-patrones-comportamiento.md)** (60 min)
   - Observer: notificación de cambios de estado
   - Strategy: algoritmos intercambiables
   - Command: encapsular acciones como objetos

---

## 🎨 Material Visual

Los siguientes diagramas están vinculados en los archivos de teoría:

1. **[01-categorias-patrones.svg](0-assets/01-categorias-patrones.svg)** - Mapa de los 23 patrones GoF
2. **[02-factory-method.svg](0-assets/02-factory-method.svg)** - Diagrama Factory Method
3. **[03-singleton.svg](0-assets/03-singleton.svg)** - Diagrama Singleton
4. **[04-builder.svg](0-assets/04-builder.svg)** - Diagrama Builder
5. **[05-adapter.svg](0-assets/05-adapter.svg)** - Diagrama Adapter
6. **[06-decorator.svg](0-assets/06-decorator.svg)** - Diagrama Decorator
7. **[07-facade.svg](0-assets/07-facade.svg)** - Diagrama Facade
8. **[08-observer.svg](0-assets/08-observer.svg)** - Diagrama Observer
9. **[09-strategy.svg](0-assets/09-strategy.svg)** - Diagrama Strategy
10. **[10-command.svg](0-assets/10-command.svg)** - Diagrama Command
11. **[11-patrones-en-js.svg](0-assets/11-patrones-en-js.svg)** - Patrones en el ecosistema JavaScript

---

## 💻 Prácticas (2 horas)

1. **[Patrones Creacionales en Práctica](2-practicas/01-practica-creacionales.md)** (40 min)
   - Implementar Factory Method para sistema de notificaciones
   - Implementar Builder para construcción de consultas

2. **[Patrones Estructurales en Práctica](2-practicas/02-practica-estructurales.md)** (40 min)
   - Implementar Adapter para integrar APIs externas
   - Implementar Facade para subsistemas de pago

3. **[Patrones de Comportamiento en Práctica](2-practicas/03-practica-comportamiento.md)** (40 min)
   - Implementar Observer para sistema de eventos
   - Implementar Strategy para motor de descuentos

---

## 🎯 Reto de la Semana

**[Reto: Sistema de Procesamiento de Pedidos con Patrones](reto-semana-05.md)**

- Aplicar mínimo 5 patrones de diseño en un sistema real
- Documentar qué problema resuelve cada patrón
- Demostrar cómo los patrones se combinan con los principios SOLID

---

## 🚀 Proyecto Integrador

**[Proyecto Semana 05](3-proyecto/proyecto-semana-05.md)**: Enriquecer tu API (semana 04) con patrones de diseño

**Continuidad del proyecto:**
- 🗓️ **Semana 03**: Elegiste el patrón arquitectónico (capas, MVC, event-driven)
- 🗓️ **Semana 04**: Diseñaste e implementaste la API RESTful con componentes
- 🗓️ **Semana 05**: _(hoy)_ Refactorizas la API aplicando patrones de diseño
- 🗓️ **Semana 06**: Migrarás a Clean Architecture / Hexagonal con microservicios

---

## 📦 Recursos

- **[Ebooks gratuitos](4-recursos/ebooks-free/)** — Design Patterns: Elements of Reusable Object-Oriented Software (GoF), Head First Design Patterns
- **[Videografía](4-recursos/videografia/)** — Videos del canal bc-channel-epti
- **[Webgrafía](4-recursos/webgrafia/)** — Referencias y tutoriales online

---

## 📖 Glosario

**[Términos clave de la semana](5-glosario/README.md)** — Patrón, Factory, Singleton, Builder, Adapter, Decorator, Facade, Observer, Strategy, Command, GoF, Anti-patrón

---

## 📊 Evaluación

| Tipo de Evidencia   | Peso | Criterio de Aprobación |
| ------------------- | ---- | ---------------------- |
| 🧠 Conocimiento     | 30%  | Mínimo 70%             |
| 💪 Desempeño        | 40%  | Mínimo 70%             |
| 📦 Producto         | 30%  | Mínimo 70%             |

Ver **[Rúbrica de Evaluación](rubrica-evaluacion.md)** para los criterios completos.

---

## 🗺️ Navegación del Bootcamp

| Semana | Tema | Enlace |
|--------|------|--------|
| 01 | Fundamentos de Arquitectura | [→ Semana 01](../week-01/README.md) |
| 02 | Principios SOLID | [→ Semana 02](../week-02/README.md) |
| 03 | Patrones Arquitectónicos Clásicos | [→ Semana 03](../week-03/README.md) |
| 04 | Diseño de Componentes y Comunicación | [→ Semana 04](../week-04/README.md) |
| **05** | **Patrones de Diseño** ← estás aquí | |
| 06 | Arquitecturas Modernas | [→ Semana 06](../week-06/README.md) |
| 07 | Arquitectura en la Nube | [→ Semana 07](../week-07/README.md) |
| 08 | Seguridad en Arquitectura | [→ Semana 08](../week-08/README.md) |
| 09 | Proyecto Integrador Final | [→ Semana 09](../week-09/README.md) |

---

> 💡 **Dato curioso**: Los 23 patrones del Gang of Four fueron publicados en 1994. Hoy, más de 30 años después, siguen siendo la base del vocabulario común entre arquitectos de software en todo el mundo.

_Bootcamp de Arquitectura de Software · SENA · bc-channel-epti_
