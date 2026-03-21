# 📖 Glosario - Semana 05: Patrones de Diseño

## A

### Abstract Factory

Patrón creacional que crea **familias de objetos relacionados** sin especificar sus clases concretas. Extiende el Factory Method para manejar grupos de objetos que deben usarse juntos.

### Adapter (Adaptador)

Patrón estructural que convierte la interfaz de una clase en otra que el cliente espera. Permite que clases con interfaces incompatibles trabajen juntas. También conocido como **Wrapper**.

_Ejemplo real_: Un driver de base de datos (Mongoose, Prisma) adapta la interfaz de MongoDB/PostgreSQL a la interfaz que usa tu código.

### Anti-patrón

Solución recurrente a un problema que parece razonable pero que en la práctica produce resultados negativos. Ejemplos: **God Object** (una clase que sabe y hace demasiado), **Spaghetti Code** (código sin estructura clara), **Golden Hammer** (usar el mismo patrón para todo).

---

## B

### Builder (Constructor)

Patrón creacional que separa la **construcción de un objeto complejo** de su representación final. Permite construir paso a paso usando métodos encadenados (API fluida), con validación en el paso final `build()`.

_Ejemplo_: `new OrderBuilder().forCustomer('usr_1').withItem(...).shippingTo(...).build()`

---

## C

### Chain of Responsibility (Cadena de responsabilidad)

Patrón de comportamiento que pasa una solicitud a través de una cadena de manejadores. Cada uno decide si la procesa o la pasa al siguiente. Implementado directamente en Express.js como **middleware**.

### Clase abstracta

En JavaScript ES2023, una clase que no debe instanciarse directamente. Se controla con `if (new.target === MiClase) throw new Error('...')`. Define el **contrato** (métodos que las subclases deben implementar).

### Command (Comando)

Patrón de comportamiento que encapsula una solicitud como un objeto. Permite: parametrizar acciones, encolarlas, registrarlas en un historial, y deshacerlas (`undo()`).

_Ejemplo real_: Redux — cada `dispatch(action)` es un Command. Ctrl+Z en un editor de texto ejecuta `undo()`.

### Composite

Patrón estructural que trata a objetos individuales y a colecciones de objetos de forma **uniforme**, mediante una estructura de árbol.

_Ejemplo_: Un sistema de archivos donde tanto una carpeta como un archivo tienen métodos `getName()` y `getSize()`.

### Contexto (Context)

En el patrón **Strategy**, el objeto que contiene una referencia a la estrategia activa y la invoca. No conoce el algoritmo específico, solo llama al método definido en la interfaz.

---

## D

### Decorator (Decorador)

Patrón estructural que agrega responsabilidades a un objeto **en tiempo de ejecución**, envolviéndolo en otro objeto con la misma interfaz. Alternativa más flexible a la herencia.

_Ejemplo real_: `@Injectable()` en NestJS, middleware en Express, decoradores de TypeScript.

---

## E

### Encapsulamiento

Principio de ocultar los detalles internos de un objeto, exponiendo solo lo necesario mediante su interfaz pública. Los campos privados en ES2023 (`#campo`) refuerzan el encapsulamiento.

---

## F

### Facade (Fachada)

Patrón estructural que proporciona una **interfaz simplificada** a un conjunto complejo de interfaces o subsistemas. No reemplaza la complejidad, la oculta detrás de métodos de alto nivel.

_Ejemplo real_: El SDK de AWS que agrupa cientos de servicios bajo una interfaz coherente.

### Factory Method (Método Fábrica)

Patrón creacional que define una interfaz para crear objetos, pero permite que las subclases o la configuración decidan qué clase concreta instanciar. Centraliza la creación sin acoplarse a clases específicas.

_Ejemplo real_: `document.createElement('div')` — no importa cómo se crea el elemento internamente.

### Flyweight

Patrón estructural que minimiza el uso de memoria compartiendo estado entre muchos objetos similares.

---

## G

### Gang of Four (GoF)

Nombre con el que se conoce al grupo de cuatro autores del libro **"Design Patterns: Elements of Reusable Object-Oriented Software"** (1994): Erich Gamma, Richard Helm, Ralph Johnson y John Vlissides. Su libro documenta 23 patrones de diseño que se convirtieron en referencia universal.

### God Object

Anti-patrón donde una clase acumula demasiadas responsabilidades y conoce demasiado de otros módulos. Violación directa del SRP.

---

## I

### Interfaz (en patrones de diseño)

Contrato que define los métodos públicos que un objeto debe implementar. En JavaScript se implementa mediante **clases base abstractas** o convención (duck typing). Define el **qué**, no el **cómo**.

### Iterator (Iterador)

Patrón de comportamiento que permite recorrer colecciones sin exponer su representación interna. En JavaScript: `for...of`, `Symbol.iterator`, generadores (`function*`).

---

## M

### Mediator (Mediador)

Patrón de comportamiento que define un objeto que centraliza la comunicación entre otros objetos, reduciendo las dependencias directas entre ellos. Similar al Observer pero con un componente central explícito.

_Ejemplo real_: El store de Redux actúa como Mediator entre componentes.

### Memento

Patrón de comportamiento que permite capturar y restaurar el estado interno de un objeto sin violar el encapsulamiento. Base para sistemas de **undo/redo**.

---

## O

### Observer (Observador)

Patrón de comportamiento que define una dependencia de uno a muchos: cuando el **Subject** (sujeto) cambia de estado, todos los **Observers** suscriptores son notificados automáticamente.

_Ejemplo real_: `EventEmitter` en Node.js, `addEventListener` en el DOM, `useState`/`useEffect` en React.

---

## P

### Patrón de diseño

Solución reutilizable, probada y documentada para un problema recurrente en el diseño de software. No es código copiable; es una **plantilla conceptual** que se adapta al contexto.

### Patrón arquitectónico

Solución de alto nivel para organizar **sistemas completos** (Capas, MVC, Microservicios). Se diferencia de los patrones de diseño en que estos últimos resuelven problemas **dentro de componentes**.

### Polimorfismo

Capacidad de tratar objetos de distintas clases de forma uniforme a través de una interfaz común. Pilar del principio de sustitución de Liskov (LSP) y fundamental para que los patrones como Strategy, Factory y Observer funcionen.

### Prototype (Prototipo)

Patrón creacional que crea nuevos objetos **copiando** (clonando) un objeto existente. Útil cuando crear un objeto desde cero es costoso.

### Proxy

Patrón estructural que actúa como sustituto o intermediario de otro objeto para controlar el acceso, agregar funcionalidad o hacer lazy loading.

_Ejemplo real_: El objeto `Proxy` nativo de JavaScript (`new Proxy(target, handler)`).

---

## S

### Singleton

Patrón creacional que garantiza que una clase tenga **exactamente una instancia** en toda la aplicación, con un punto de acceso global.

_Nota importante_: Los módulos ES (`import/export`) son singletons por naturaleza en JavaScript. Úsalo con cuidado — el abuso genera estado global difícil de testear.

### State (Estado)

Patrón de comportamiento que permite a un objeto cambiar su comportamiento cuando cambia su estado interno. El objeto parece cambiar de clase.

_Ejemplo_: Un pedido en estado `pending` tiene comportamiento diferente a uno en estado `shipped`.

### Strategy (Estrategia)

Patrón de comportamiento que define una familia de algoritmos, encapsula cada uno en su propia clase y los hace intercambiables.

_Ejemplo real_: Passport.js — estrategias de autenticación: `LocalStrategy`, `GoogleStrategy`, `JwtStrategy`.

### Subject

En el patrón **Observer**, el objeto que mantiene el estado y notifica a los observers cuando cambia. También llamado Observable o EventEmitter.

---

## T

### Template Method (Método Plantilla)

Patrón de comportamiento que define el **esqueleto de un algoritmo** en una clase base, dejando que las subclases implementen pasos específicos sin cambiar la estructura general.

---

## V

### Visitor (Visitante)

Patrón de comportamiento que permite agregar nuevas operaciones a una estructura de objetos sin modificar las clases de los objetos. Común en compiladores y transformadores de AST.

---

## W

### Wrapper

Nombre alternativo para el patrón **Adapter**. Envuelve a un objeto para adaptar su interfaz.

---

## 🔗 Relación Patrones → Principios SOLID

| Principio                     | Patrones que lo refuerzan                     |
| ----------------------------- | --------------------------------------------- |
| **S** — Single Responsibility | Command, Strategy, Observer                   |
| **O** — Open/Closed           | Strategy, Decorator, Factory Method, Observer |
| **L** — Liskov Substitution   | Strategy, Template Method                     |
| **I** — Interface Segregation | Adapter, Facade                               |
| **D** — Dependency Inversion  | Factory Method, Abstract Factory, Adapter     |

---

_Bootcamp de Arquitectura de Software · SENA · bc-channel-epti_
