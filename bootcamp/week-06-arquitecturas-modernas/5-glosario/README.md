# 📖 Glosario — Semana 06: Arquitecturas Modernas

---

## A

**Adapter (Adaptador)**
Implementación concreta de un puerto que traduce el contrato del dominio a una tecnología específica (BD, API externa, email). El adaptador "habla" con el mundo exterior y "traduce" al lenguaje del dominio.
_Ejemplo: `PostgresOrderRepository` implementa el puerto `IOrderRepository`._

**Aggregate (Agregado)**
Grupo de entidades y value objects que forman una unidad de consistencia transaccional. Todo acceso externo pasa por la **raíz del agregado** (Aggregate Root). Garantiza las invariantes del dominio.
_Ejemplo: `Order` (raíz) + `OrderItem[]` forman un agregado._

**Aggregate Root (Raíz del Agregado)**
La entidad principal de un agregado, único punto de acceso al mismo desde el exterior. El repositorio solo guarda y carga raíces de agregado.

---

## B

**Bounded Context (Contexto Delimitado)**
Límite explícito dentro del cual un modelo del dominio es válido. El mismo término puede tener distintos significados en distintos contextos. Base natural para dividir microservicios.
_Ejemplo: "Cliente" en el contexto de Ventas = quien compra; en el de Facturación = entidad con NIT para la DIAN._

---

## C

**Clean Architecture**
Estilo arquitectónico de Robert C. Martin que organiza el software en capas concéntricas (Dominio → Aplicación → Infraestructura → Interfaces). La **Regla de Dependencia** establece que las dependencias solo pueden apuntar hacia adentro.

**Cohesión**
Medida de lo bien relacionadas que están las responsabilidades de un módulo. Alta cohesión = cada clase/módulo hace una sola cosa con sentido.

**Composition Root**
Único punto de la aplicación donde se instancian las dependencias concretas y se ensambla el grafo de objetos. Típicamente es `main.js` o `app.js`.

---

## D

**Dependency Inversion Principle (DIP)**
El quinto principio SOLID: los módulos de alto nivel no deben depender de módulos de bajo nivel; ambos deben depender de abstracciones (interfaces/puertos).

**Domain Event (Evento de Dominio)**
Hechos ocurridos en el dominio que merecen ser registrados: `OrderPlaced`, `PaymentFailed`, `UserRegistered`. Se publican porque otras partes del sistema pueden estar interesadas.

**Domain Service (Servicio de Dominio)**
Lógica de negocio que no pertenece naturalmente a ninguna entidad —generalmente porque involucra múltiples agregados.
_Ejemplo: `LoanDomainService.canBorrow(borrower, activeLoans)` — involucra Borrower y Loan._

**DDD (Domain-Driven Design)**
Enfoque de diseño de software de Eric Evans que coloca el dominio del negocio en el centro. Propone un vocabulario compartido (Ubiquitous Language) y bloques de construcción (Entities, VOs, Aggregates).

---

## E

**Entity (Entidad)**
Objeto del dominio con **identidad única** que persiste en el tiempo. Se compara por `id`, no por valor de sus atributos.
_Ejemplo: `Customer(id='c1', name='Juan')` es el mismo cliente aunque cambie de nombre._

---

## H

**Hexagonal Architecture**
Sinónimo de **Ports & Adapters**. Propuesta por Alistair Cockburn (2005). Protege el núcleo de la aplicación del mundo exterior mediante puertos e isolates para pruebas.

---

## I

**Immutability (Inmutabilidad)**
Propiedad de los Value Objects: una vez creados no pueden cambiar. Para "modificar" un VO se crea un nuevo objeto con el nuevo valor.

**Invariant (Invariante)**
Regla de negocio que siempre debe ser verdadera para que un objeto sea válido. Las invariantes se verifican en el constructor de la entidad o en sus métodos de negocio.

---

## M

**Microservice (Microservicio)**
Estilo arquitectónico donde la aplicación se construye como un conjunto de pequeños servicios independientes, cada uno ejecutándose en su propio proceso y comunicándose por APIs ligeras.

**Modular Monolith (Monolito Modular)**
Aplicación desplegada como una sola unidad pero internamente dividida en módulos claramente delimitados. Recomendado como primer paso antes de microservicios.

---

## P

**Port (Puerto)**
Interfaz abstracta en el borde del hexágono. Define el contrato que debe cumplir cualquier adaptador.

- **Puerto primario**: cómo el mundo exterior activa la aplicación (IOrderService).
- **Puerto secundario**: cómo la aplicación contacta al mundo exterior (IOrderRepository).

---

## R

**Repository (Repositorio)**
Patrón que provee una **ilusión de colección en memoria** para los agregados. El dominio define la interfaz; la infraestructura la implementa.

- `save(entity)` — guardar
- `findById(id)` — buscar por identidad

**Regla de Dependencia (Dependency Rule)**
Regla fundamental de Clean Architecture: el código fuente solo puede apuntar hacia adentro (hacia el dominio). El dominio nunca importa nada de la infraestructura.

---

## S

**Strangler Fig Pattern**
Técnica de migración que consiste en construir el nuevo sistema gradualmente "alrededor" del sistema heredado, redirigiendo funcionalidades una a una hasta que el monolito puede ser "eliminado".

---

## U

**Ubiquitous Language (Lenguaje Ubicuo)**
Vocabulario compartido entre desarrolladores y expertos del negocio. Se usa en conversaciones, historias de usuario, código, pruebas y documentación. Eliminación de la brecha entre negocio y tecnología.

**Use Case (Caso de Uso)**
Clase en la capa de aplicación que orquesta la ejecución de una operación del negocio. Coordina entidades, repositorios y servicios del dominio. No contiene lógica de negocio; solo orquesta.
_Ejemplo: `PlaceOrderUseCase`, `EnrollStudentUseCase`._

---

## V

**Value Object (Objeto de Valor)**
Objeto del dominio sin identidad propia que describe características. Es **inmutable** y se compara por valor (todos sus atributos). `Object.freeze()` en JavaScript lo hace definitivamente inmutable.
_Ejemplo: `Money(5000, 'COP')`, `Email('user@example.com')`, `Grade(8.5)`._
