# 🌐 Webgrafía — Semana 06

## 📌 Recursos Oficiales y Fundacionales

| Recurso                        | Descripción                                   | URL                                                                                                                |
| ------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| The Clean Architecture         | Artículo original de Robert C. Martin         | [blog.cleancoder.com](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)                |
| Hexagonal Architecture         | Artículo original de Alistair Cockburn (2005) | [alistair.cockburn.us](https://alistair.cockburn.us/hexagonal-architecture/)                                       |
| Microservices — Fowler & Lewis | Artículo seminal que definió microservicios   | [martinfowler.com/articles/microservices.html](https://martinfowler.com/articles/microservices.html)               |
| Strangler Fig Application      | Patrón de migración de monolito               | [martinfowler.com/bliki/StranglerFigApplication.html](https://martinfowler.com/bliki/StranglerFigApplication.html) |
| DDD Reference                  | Resumen oficial del libro de Eric Evans       | [domainlanguage.com/ddd/reference](https://www.domainlanguage.com/ddd/reference/)                                  |

---

## 📚 Guías y Tutoriales Prácticos

### Clean Architecture en JavaScript/Node.js

| Recurso                            | Descripción                               | URL                                                                                                          |
| ---------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Organizing App Logic               | Capas de la aplicación con ejemplos en JS | [khalilstemmler.com](https://khalilstemmler.com/articles/software-design-architecture/organizing-app-logic/) |
| Clean Architecture on the Frontend | Aplicado a proyectos JavaScript modernos  | [dev.to/bespoyasov](https://dev.to/bespoyasov/clean-architecture-on-frontend-4311)                           |
| Node.js Clean Architecture         | Tutorial completo con tests               | [fullstackopen.com](https://fullstackopen.com/)                                                              |

### Arquitectura Hexagonal

| Recurso                           | Descripción                          | URL                                                                                                                                          |
| --------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Hexagonal Architecture in Node.js | Implementación completa con ejemplos | [jmgarridopaz.github.io](https://jmgarridopaz.github.io/content/hexagonalarchitecture.html)                                                  |
| Explicit Architecture             | DDD + Hexagonal + CQRS integrados    | [herbertograca.com](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/) |
| Ports and Adapters with Node.js   | Guía paso a paso                     | [medium.com — ports-adapters-nodejs](https://medium.com/pre-alpha-tech/hexagonal-architecture-ports-and-adapters-with-nodejs-62c2a6ef6a6a)   |

### Domain-Driven Design

| Recurso                         | Descripción                              | URL                                                                                                                                 |
| ------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| DDD in JavaScript               | Serie de artículos de DDD práctico en JS | [khalilstemmler.com/articles/categories/domain-driven-design](https://khalilstemmler.com/articles/categories/domain-driven-design/) |
| Value Objects — Why They Matter | Inmutabilidad y encapsulamiento          | [enterprisecraftsmanship.com](https://enterprisecraftsmanship.com/posts/value-objects-explained/)                                   |
| Aggregate Root Design           | Cómo modelar agregados                   | [dddcommunity.org](http://dddcommunity.org/library/vernon_2011/)                                                                    |
| Bounded Contexts Explained      | Contextos delimitados en la práctica     | [martinfowler.com/bliki/BoundedContext.html](https://martinfowler.com/bliki/BoundedContext.html)                                    |

---

## 🏢 Casos Reales de Arquitectura

| Empresa        | Artículo                                                               | URL                                                                                                       |
| -------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Netflix        | Migración del monolito a microservicios                                | [netflixtechblog.com](https://netflixtechblog.com/tagged/microservices)                                   |
| Uber           | Migración de base monolítica a microservicios                          | [eng.uber.com](https://eng.uber.com/microservice-architecture/)                                           |
| Amazon         | Arquitectura orientada a servicios desde 2002 (Jeff Bezos API mandate) | [apievangelist.com](https://apievangelist.com/2012/01/12/the-secret-to-amazons-success-internal-apis/)    |
| Shopify        | Modular Monolith antes de microservicios                               | [shopify.engineering](https://shopify.engineering/shopify-monolith)                                       |
| Stack Overflow | Por qué eligieron NO usar microservicios                               | [stackoverflow.blog](https://stackoverflow.blog/2022/05/17/smaller-faster-more-reliable-micro-frontends/) |

---

## 🛠️ Herramientas y Librerías

| Herramienta             | Uso                                                  | URL                                                          |
| ----------------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| **Node.js test runner** | Testing nativo sin librerías externas                | [nodejs.org/api/test.html](https://nodejs.org/api/test.html) |
| **C4 Model**            | Framework para diagramas de arquitectura por niveles | [c4model.com](https://c4model.com/)                          |
| **PlantUML**            | Diagramas como código (texto → diagrama)             | [plantuml.com](https://plantuml.com/)                        |
| **Mermaid**             | Diagramas en Markdown/GitHub                         | [mermaid.js.org](https://mermaid.js.org/)                    |
| **EventStorming**       | Técnica de modelado colaborativo DDD                 | [eventstorming.com](https://www.eventstorming.com/)          |

---

## 📊 Comparativas y Decisiones de Arquitectura

| Recurso                        | Descripción                            | URL                                                                                                                      |
| ------------------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Monolith vs Microservices      | Cuándo elegir cada uno                 | [martinfowler.com/articles/microservice-trade-offs.html](https://martinfowler.com/articles/microservice-trade-offs.html) |
| Don't Start with Microservices | Argumento a favor del monolito modular | [arnoldgalovics.com](https://arnoldgalovics.com/microservices-in-production/)                                            |
| Clean vs Hexagonal vs Onion    | Comparación de las tres arquitecturas  | [herbertograca.com](https://herbertograca.com/2017/08/03/layered-architecture/)                                          |
