# 📅 Semana 04: Diseño de Componentes y Comunicación

> **Tema Central**: La comunicación efectiva entre partes del sistema

## 🎯 Objetivos de Aprendizaje

Al finalizar esta semana, serás capaz de:

- ✅ Comprender los principios del diseño basado en componentes
- ✅ Diferenciar entre comunicación síncrona y asíncrona
- ✅ Diseñar APIs RESTful siguiendo mejores prácticas
- ✅ Entender cuándo usar GraphQL vs REST
- ✅ Implementar APIs con Express.js en JavaScript ES2023
- ✅ Documentar APIs usando OpenAPI/Swagger
- ✅ Aplicar contratos de API para garantizar interoperabilidad

---

## 📚 Contenido Teórico (4 horas)

1. **[Principios de Diseño Basado en Componentes](1-teoria/01-diseno-componentes.md)** (60 min)
   - ¿Qué es un componente?
   - Interfaces y contratos
   - Acoplamiento y cohesión en componentes
   - Principios de diseño modular

2. **[Comunicación Síncrona vs Asíncrona](1-teoria/02-comunicacion-sincrona-asincrona.md)** (60 min)
   - Request-Response (síncrono)
   - Message Queue y Pub/Sub (asíncrono)
   - Event-Driven vs Command-Driven
   - Cuándo usar cada enfoque

3. **[APIs RESTful: Diseño y Mejores Prácticas](1-teoria/03-apis-restful.md)** (60 min)
   - Principios REST
   - Diseño de recursos y endpoints
   - Códigos de estado HTTP
   - Versionado y paginación
   - HATEOAS y madurez de Richardson

4. **[GraphQL vs REST: Cuándo Usar Cada Uno](1-teoria/04-graphql-vs-rest.md)** (30 min)
   - Introducción a GraphQL
   - Ventajas y desventajas comparativas
   - Casos de uso para cada enfoque

5. **[Documentación de APIs con OpenAPI](1-teoria/05-documentacion-openapi.md)** (30 min)
   - Especificación OpenAPI 3.0
   - Swagger UI y Swagger Editor
   - Generación de documentación automática

---

## 🎨 Material Visual

Los siguientes diagramas están vinculados en los archivos de teoría:

1. **[01-componentes-interfaces.svg](0-assets/01-componentes-interfaces.svg)** - Anatomía de un componente
2. **[02-sincrono-asincrono.svg](0-assets/02-sincrono-asincrono.svg)** - Comparación de comunicación
3. **[03-rest-arquitectura.svg](0-assets/03-rest-arquitectura.svg)** - Arquitectura RESTful
4. **[04-graphql-vs-rest.svg](0-assets/04-graphql-vs-rest.svg)** - Comparación GraphQL vs REST
5. **[05-openapi-workflow.svg](0-assets/05-openapi-workflow.svg)** - Flujo de documentación con OpenAPI

---

## 💻 Prácticas (2 horas)

1. **[Diseño de Componentes Modulares](2-practicas/01-practica-diseno-componentes.md)** (30 min)
   - Identificar componentes en un sistema
   - Definir interfaces claras
   - Documentar contratos

2. **[Implementación de API RESTful](2-practicas/02-practica-api-rest.md)** (60 min)
   - Crear API con Express.js
   - Implementar CRUD completo
   - Aplicar códigos de estado correctos
   - Manejo de errores

3. **[Documentación con Swagger](2-practicas/03-practica-swagger.md)** (30 min)
   - Crear especificación OpenAPI
   - Configurar Swagger UI
   - Generar documentación interactiva

---

## 🎯 Reto de la Semana

**[Reto: API para Sistema de Gestión](reto-semana-04.md)**

- Diseñar API RESTful para un sistema de gestión de tareas
- Implementar endpoints CRUD
- Documentar con OpenAPI/Swagger
- Bonus: Agregar comunicación asíncrona con eventos

---

## 🚀 Proyecto Integrador

**[Proyecto Semana 04](3-proyecto/proyecto-semana-04.md)**: Diseñar e implementar la API para tu dominio

**Continuidad del proyecto:**

- **Semana 01**: Selección de dominio y metodología ✅
- **Semana 02**: Aplicación de principios SOLID ✅
- **Semana 03**: Definición de patrón arquitectónico ✅
- **Semana 04**: Diseño de APIs y componentes ← **ESTÁS AQUÍ**
- **Semana 05**: Implementación de patrones de diseño
- **Semana 06**: Arquitectura moderna (microservicios/hexagonal)
- **Semana 07**: Containerización con Docker
- **Semana 08**: Seguridad en la arquitectura
- **Semana 09**: Presentación del proyecto final

**Entregables de esta semana:**

1. Diagrama de componentes del sistema
2. Especificación OpenAPI de la API
3. Implementación funcional con Express.js
4. Documentación interactiva con Swagger UI

---

## 📦 Recursos

- **[Ebooks Gratuitos](4-recursos/ebooks-free/README.md)**
- **[Videografía](4-recursos/videografia/README.md)**
- **[Webgrafía](4-recursos/webgrafia/README.md)**

---

## 📖 Glosario

Consulta el **[Glosario de Términos](5-glosario/README.md)** para definiciones de:

- API, REST, GraphQL
- Componente, Interfaz, Contrato
- Síncrono, Asíncrono
- OpenAPI, Swagger
- HATEOAS, Richardson Maturity Model

---

## ⏱️ Distribución del Tiempo

| Actividad                | Tiempo      |
| ------------------------ | ----------- |
| Teoría: Componentes      | 60 min      |
| Teoría: Comunicación     | 60 min      |
| Teoría: REST + GraphQL   | 90 min      |
| Teoría: OpenAPI          | 30 min      |
| Práctica: Diseño         | 30 min      |
| Práctica: Implementación | 60 min      |
| Práctica: Documentación  | 30 min      |
| Proyecto integrador      | 60 min      |
| **Total**                | **7 horas** |

---

## 🔗 Conexión con Otras Semanas

| Semana Anterior                                             | Semana Actual                     | Semana Siguiente                                      |
| ----------------------------------------------------------- | --------------------------------- | ----------------------------------------------------- |
| [Semana 03: Patrones Arquitectónicos](../week-03/README.md) | **Semana 04: Componentes y APIs** | [Semana 05: Patrones de Diseño](../week-05/README.md) |

**¿Cómo conecta?**

- **Semana 03** definió el patrón arquitectónico (capas, cliente-servidor)
- **Semana 04** diseña la comunicación entre esos componentes
- **Semana 05** implementará patrones de diseño dentro de los componentes

---

## 💡 Tip de la Semana

> "Una buena API es como un buen restaurante: el cliente no necesita saber cómo funciona la cocina, solo importa que el menú sea claro y la comida llegue bien preparada."

---

[⬅️ Semana 03](../week-03/README.md) | [🏠 Inicio](../../README.md) | [➡️ Semana 05](../week-05/README.md)
