# 🚀 Proyecto Semana 05 — Refactorización con Patrones de Diseño

## 📌 Contexto del Proyecto Integrador

Este es el **quinto entregable** de tu proyecto integrador. Si llevas el hilo del bootcamp:

| Semana | Lo que construiste                                 |
| ------ | -------------------------------------------------- |
| 03     | Elegiste la arquitectura (capas, MVC, etc.)        |
| 04     | Diseñaste e implementaste la API RESTful           |
| **05** | _(hoy)_ Refactorizas la API con patrones de diseño |
| 06     | Migrarás hacia Clean Architecture o Hexagonal      |

> ⚠️ **Política anticopia**: Este entregable es la continuación directa de tu API de la semana 04. Debes trabajar con **tu dominio asignado** en semana 01. El reto de la semana (que usa otro dominio como ejemplo) es material de aprendizaje, no el entregable.

---

## 🎯 Objetivo del Proyecto

Tomar el código de la semana 04 (o el sistema del reto) y **refactorizarlo aplicando mínimo 5 patrones de diseño**, documentando cada decisión con:

- El problema que existía
- El patrón que lo resuelve
- Un diagrama UML o Mermaid
- El código resultante

---

## 📋 Requisitos Obligatorios

### 1. Patrones Creacionales (mínimo 1)

Identifica en tu API al menos uno de estos problemas:

| Problema                                        | Patrón         |
| ----------------------------------------------- | -------------- |
| Creación de objetos dispersa por todo el código | Factory Method |
| Constructor con 6+ parámetros                   | Builder        |
| Recurso compartido (pool DB, config, logger)    | Singleton      |

**Entregable**: Muestra el código **antes** y **después** de aplicar el patrón.

### 2. Patrones Estructurales (mínimo 2)

| Problema                                                       | Patrón    |
| -------------------------------------------------------------- | --------- |
| Integraste un SDK externo (pago, email, storage)               | Adapter   |
| Quieres agregar logging/caché sin modificar el servicio        | Decorator |
| El usuario del módulo necesita coordinar múltiples subsistemas | Facade    |

### 3. Patrones de Comportamiento (mínimo 2)

| Problema                                                       | Patrón   |
| -------------------------------------------------------------- | -------- |
| Al cambiar un estado, N sistemas deben reaccionar              | Observer |
| Una operación puede hacerse de varias formas según el contexto | Strategy |
| Las acciones deben poder deshacerse o encolarse                | Command  |

---

## 🗂️ Estructura de Entrega

```
proyecto-semana-05/
├── README.md                         # Documentado
├── package.json                      # pnpm, ES2023
├── docs/
│   ├── patrones-aplicados.md         # Documento de decisiones (ver abajo)
│   └── diagramas/
│       ├── factory-[nombre].md       # Diagrama Mermaid
│       ├── adapter-[nombre].md
│       ├── observer-[nombre].md
│       └── strategy-[nombre].md
└── src/
    ├── index.js
    ├── patterns/                     # Demos aislados de cada patrón
    ├── routes/
    ├── controllers/
    ├── services/
    └── models/
```

---

## 📝 Documento de Decisiones — Plantilla

Crea `docs/patrones-aplicados.md` con el siguiente formato para cada patrón:

```markdown
## Patrón: Factory Method

### Problema Original

// Describe qué problema tenías en el código

### Antes (❌)

// Fragmento del código problemático

### Después (✅)

// Fragmento del código refactorizado

### Principio SOLID Reforzado

// Cuál principio y cómo

### Diagrama

// Enlace al diagrama Mermaid

### Beneficios Obtenidos

// Qué mejoró concretamente
```

---

## 🎨 Diagramas Mermaid (Ejemplo)

Crea un archivo `.md` en `docs/diagramas/` para cada patrón:

````markdown
<!-- docs/diagramas/observer-[tu-entidad].md -->

## Diagrama Observer — Eventos de [TuEntidadPrincipal]

```mermaid
classDiagram
    class [TuEntidad]Service {
        +changeStatus(id, status)
        -eventBus: EventBus
    }
    class EventBus {
        +on(event, handler)
        +emit(event, data)
        -handlers: Map
    }
    class EmailObserver {
        +handle(data)
    }
    class AuditObserver {
        +handle(data)
    }
    class NotificationObserver {
        +handle(data)
    }

    [TuEntidad]Service --> EventBus : usa
    EventBus --> EmailObserver : notifica
    EventBus --> AuditObserver : notifica
    EventBus --> NotificationObserver : notifica
```
````

> Reemplaza `[TuEntidad]` con la entidad principal de tu dominio asignado.

````

---

## 🏆 Criterios de Evaluación

### Mínimo para Aprobar (70/100)

- [ ] 5 patrones implementados y funcionando
- [ ] `docs/patrones-aplicados.md` con descripción de cada patrón
- [ ] La API original sigue funcionando (no romper lo de semana 04)
- [ ] Código en ES2023, módulos ES6
- [ ] `pnpm start` ejecuta el demo sin errores

### Bueno (85/100)

- [ ] Todo lo anterior +
- [ ] Diagramas Mermaid para al menos 3 patrones
- [ ] Comparación antes/después del código
- [ ] Al menos 1 patrón de cada categoría (creacional, estructural, comportamiento)

### Excelente (100/100)

- [ ] Todo lo anterior +
- [ ] 6+ patrones implementados
- [ ] Tests unitarios básicos (Node.js test runner o Vitest)
- [ ] El README explica la relación entre los patrones y cómo cooperan
- [ ] Demuestra extensibilidad: muestra cómo agregar una funcionalidad nueva SIN modificar código existente

---

## 💻 Setup Inicial

```bash
# Continuación del proyecto semana 04 (obligatorio — usa tu dominio asignado)
cd tu-proyecto-[tu-dominio]
git checkout -b semana-05-patrones
````

> No hay opción alternativa. El entregable de esta semana **es la evolución del código de semana 04** con tu dominio. Si tienes dificultades con el código base, consulta al instructor antes de iniciar.

---

## 🔗 Conexión con Semanas Anteriores

Los patrones que apliques esta semana **deben respetar** la arquitectura que elegiste:

- Si elegiste **Capas**: los patrones van dentro de cada capa (Factory en la capa de datos, Observer en la capa de negocio, etc.)
- Si elegiste **MVC**: los patrones complementan el rol de cada capa
- Si elegiste **Event-Driven**: Observer + Command son patrones naturales de tu arquitectura

---

## 📚 Referencias

- 📘 GoF: [refactoring.guru/design-patterns](https://refactoring.guru/design-patterns)
- 📘 Patrones en JavaScript moderno: [patterns.dev](https://www.patterns.dev)
- 📹 Videos semana 05 del bootcamp — canal bc-channel-epti

---

_Bootcamp de Arquitectura de Software · SENA · bc-channel-epti_
