# 📖 Glosario: Patrones Arquitectónicos

## Semana 03 - Términos Clave de la A a la Z

---

## A

### **Acoplamiento (Coupling)**

Grado de dependencia entre módulos o componentes. El **acoplamiento bajo** es deseable porque permite modificar un componente sin afectar a otros.

> 💡 _"Si cambias una clase y debes modificar 10 más, tienes alto acoplamiento"_

### **ADR (Architecture Decision Record)**

Documento que registra una decisión arquitectónica significativa junto con su contexto, opciones consideradas y justificación.

> 💡 _"Los ADRs son la memoria del por qué de tu arquitectura"_

### **API (Application Programming Interface)**

Contrato que define cómo dos componentes de software se comunican entre sí. En Cliente-Servidor, la API define qué operaciones puede solicitar el cliente.

### **Arquitectura en Capas (Layered Architecture)**

Ver [Layered Architecture](#layered-architecture-arquitectura-en-capas)

---

## B

### **Broker (Message Broker)**

Intermediario que recibe mensajes de productores y los entrega a consumidores en arquitecturas Event-Driven. Ejemplos: RabbitMQ, Kafka, Redis Pub/Sub.

### **Business Logic (Lógica de Negocio)**

Reglas y procesos que definen cómo opera el dominio del problema. En Layered Architecture, reside en la capa de negocio o dominio.

---

## C

### **Capa (Layer)**

Nivel horizontal de organización en una arquitectura que agrupa responsabilidades similares. Las capas típicas son: Presentación, Negocio, Datos.

### **Cliente (Client)**

En arquitectura Cliente-Servidor, es el componente que inicia las solicitudes. Puede ser un navegador web, aplicación móvil, o CLI.

### **Cohesión (Cohesion)**

Grado en que los elementos de un módulo pertenecen juntos. La **alta cohesión** es deseable porque indica que el módulo tiene una responsabilidad clara.

> 💡 _"Una clase con alta cohesión hace una sola cosa y la hace bien"_

### **Componente**

Unidad de software modular, desplegable y reemplazable que encapsula su implementación y expone interfaces.

### **Controller (Controlador)**

En MVC, es el componente que recibe las entradas del usuario, coordina con el Model y actualiza la View.

### **CQRS (Command Query Responsibility Segregation)**

Patrón que separa las operaciones de lectura (Query) de las de escritura (Command). Frecuentemente usado con Event Sourcing.

---

## D

### **Data Access Layer (Capa de Acceso a Datos)**

Capa responsable de la comunicación con la base de datos o sistemas de almacenamiento. Implementa el patrón Repository.

### **Data Binding (Enlace de Datos)**

Mecanismo que sincroniza automáticamente datos entre el Model y la View. Es la característica distintiva de MVVM.

- **One-way binding**: Model → View
- **Two-way binding**: Model ↔ View

### **Dependencia Unidireccional**

Principio donde las capas superiores pueden depender de las inferiores, pero no al revés. Fundamental en Layered Architecture.

---

## E

### **Escalabilidad (Scalability)**

Capacidad de un sistema para manejar mayor carga de trabajo.

- **Escalabilidad horizontal**: Agregar más instancias (más servidores)
- **Escalabilidad vertical**: Aumentar recursos de una instancia (más RAM, CPU)

### **Event (Evento)**

Notificación de que algo significativo ha ocurrido en el sistema. Inmutable y representa un hecho pasado.

> 💡 _"Un evento dice 'esto pasó', no 'haz esto'"_

### **Event Bus**

Canal de comunicación que transporta eventos entre productores y consumidores. Puede ser síncrono (en memoria) o asíncrono (distribuido).

### **Event-Driven Architecture (Arquitectura Basada en Eventos)**

Estilo arquitectónico donde los componentes se comunican a través de la producción y consumo de eventos, promoviendo el desacoplamiento.

### **Event Sourcing**

Patrón donde el estado de la aplicación se deriva de una secuencia de eventos. En lugar de guardar el estado actual, se guardan todos los cambios.

---

## F

### **Facade (Fachada)**

Patrón que proporciona una interfaz simplificada a un subsistema complejo. Útil para ocultar complejidad entre capas.

### **Fat Client / Thin Client**

- **Fat Client**: Cliente con lógica de negocio (aplicación desktop)
- **Thin Client**: Cliente solo de presentación (navegador web básico)

---

## G

### **Gateway**

Punto de entrada único a un sistema que maneja cross-cutting concerns como autenticación, rate limiting, y routing.

---

## H

### **Handler**

Componente que procesa eventos o comandos específicos. En Event-Driven, cada tipo de evento puede tener uno o más handlers.

### **HTTP (HyperText Transfer Protocol)**

Protocolo de comunicación usado en Cliente-Servidor web. Define métodos como GET, POST, PUT, DELETE.

---

## I

### **Inversión de Dependencias**

Principio SOLID (DIP) donde los módulos de alto nivel no dependen de los de bajo nivel; ambos dependen de abstracciones.

---

## L

### **Layered Architecture (Arquitectura en Capas)**

Patrón que organiza el código en capas horizontales con responsabilidades definidas. Cada capa solo conoce a la capa inmediatamente inferior.

**Capas típicas:**

1. **Presentación**: UI, API REST
2. **Negocio/Aplicación**: Lógica de negocio
3. **Datos/Persistencia**: Acceso a BD

---

## M

### **Message Queue (Cola de Mensajes)**

Mecanismo de comunicación asíncrona donde los mensajes se almacenan en una cola hasta que son procesados. Garantiza entrega y permite desacoplamiento temporal.

### **Model (Modelo)**

En MVC/MVVM, representa los datos y la lógica de negocio de la aplicación. Es independiente de la interfaz de usuario.

### **Monolito (Monolith)**

Aplicación donde todo el código está en un único desplegable. Contrasta con microservicios.

### **MVC (Model-View-Controller)**

Patrón que separa una aplicación en tres componentes:

- **Model**: Datos y lógica de negocio
- **View**: Interfaz de usuario
- **Controller**: Coordina Model y View

### **MVP (Model-View-Presenter)**

Variante de MVC donde el Presenter tiene referencia directa a la View para actualizarla.

### **MVVM (Model-View-ViewModel)**

Patrón que usa **data binding** para sincronizar Model y View a través de un ViewModel intermedio. Popular en frameworks reactivos.

---

## N

### **N-Tier Architecture**

Arquitectura donde las capas se despliegan en diferentes niveles físicos (tiers). Una arquitectura de 3 capas puede desplegarse en 2 o 3 tiers.

---

## O

### **Observer Pattern (Patrón Observador)**

Patrón de diseño base de Event-Driven donde los objetos (observers) se suscriben para recibir notificaciones de cambios.

---

## P

### **Patrón Arquitectónico**

Solución probada y reutilizable para un problema común de diseño a nivel de sistema. Opera a mayor escala que los patrones de diseño.

### **Presentation Layer (Capa de Presentación)**

Capa responsable de la interfaz de usuario y la interacción con el usuario final. Incluye UI, API REST, CLI.

### **Producer (Productor)**

En Event-Driven, componente que genera y publica eventos. También llamado Publisher.

### **Pub/Sub (Publish/Subscribe)**

Patrón de mensajería donde los productores publican mensajes a topics y los consumidores se suscriben a los topics de interés.

---

## R

### **Repository (Repositorio)**

Patrón que encapsula la lógica de acceso a datos, proporcionando una interfaz de colección para el dominio.

### **Request-Response**

Modelo de comunicación síncrona donde el cliente envía una solicitud y espera una respuesta del servidor.

### **REST (Representational State Transfer)**

Estilo arquitectónico para APIs que usa HTTP y recursos identificados por URLs. Principios: stateless, cacheable, uniform interface.

---

## S

### **Separation of Concerns (Separación de Responsabilidades)**

Principio de diseño que promueve dividir un programa en secciones distintas, cada una con una responsabilidad única.

### **Servidor (Server)**

En Cliente-Servidor, componente que espera y responde solicitudes de clientes. Puede servir a múltiples clientes simultáneamente.

### **Service Layer (Capa de Servicios)**

Capa que define la frontera de la aplicación y coordina operaciones de negocio. Orquesta la lógica de dominio.

### **Síncrono vs Asíncrono**

- **Síncrono**: El emisor espera la respuesta (Request-Response)
- **Asíncrono**: El emisor continúa sin esperar (Event-Driven)

### **Subscriber (Suscriptor)**

En Pub/Sub, componente que se registra para recibir mensajes de topics específicos. También llamado Consumer.

---

## T

### **Three-Tier Architecture**

Arquitectura física de 3 niveles: Cliente, Servidor de Aplicación, Base de Datos. Puede o no corresponder a 3 capas lógicas.

### **Trade-off**

Compromiso entre dos cualidades en tensión. Por ejemplo: simplicidad vs flexibilidad, rendimiento vs mantenibilidad.

> 💡 _"Toda decisión arquitectónica implica trade-offs"_

---

## U

### **UI (User Interface)**

Interfaz de usuario. En Layered Architecture, pertenece a la capa de presentación.

---

## V

### **View (Vista)**

En MVC/MVVM, componente responsable de renderizar la interfaz de usuario y mostrar datos al usuario.

### **ViewModel**

En MVVM, intermediario entre Model y View que expone datos y comandos. Maneja la lógica de presentación.

---

## W

### **WebSocket**

Protocolo de comunicación bidireccional persistente entre cliente y servidor. Usado para aplicaciones en tiempo real.

---

## 📊 Relaciones Entre Términos

```
┌─────────────────────────────────────────────────────────────┐
│                    PATRONES ARQUITECTÓNICOS                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layered          Cliente-Servidor      Event-Driven        │
│     │                   │                    │              │
│     ▼                   ▼                    ▼              │
│  - Capa             - Request           - Evento           │
│  - Cohesión         - Response          - Productor        │
│  - Dependencia      - API               - Consumidor       │
│    unidireccional   - REST              - Event Bus        │
│                     - WebSocket         - Pub/Sub          │
│                                                             │
│  MVC/MVVM                                                   │
│     │                                                       │
│     ▼                                                       │
│  - Model            - Controller         - Data Binding    │
│  - View             - Presenter          - ViewModel       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 Referencias

- Bass, L., Clements, P., & Kazman, R. (2021). _Software Architecture in Practice_ (4th ed.)
- Fowler, M. (2002). _Patterns of Enterprise Application Architecture_
- Richards, M. (2015). _Software Architecture Patterns_
- Martin, R. C. (2017). _Clean Architecture_

---

[⬅️ Volver a Webgrafía](../4-recursos/webgrafia/README.md) | [🏠 Volver al README](../README.md)
