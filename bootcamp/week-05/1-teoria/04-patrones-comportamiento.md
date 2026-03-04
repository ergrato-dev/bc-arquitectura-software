# 📖 04 — Patrones de Comportamiento

> _Los patrones de comportamiento se ocupan de la comunicación entre objetos. Se focalizan en cómo los objetos colaboran e interactúan entre sí._
>
> — Gang of Four

---

## 🎯 ¿Qué son los Patrones de Comportamiento?

### ¿Qué son?

Los patrones de comportamiento describen **cómo los objetos interactúan y distribuyen responsabilidades**. No se preocupan tanto por cómo se crean o componen los objetos, sino por **los flujos de comunicación y la asignación de roles** entre ellos en tiempo de ejecución.

### ¿Para qué sirven?

- Definen protocolos de comunicación **flexibles** entre objetos
- Permiten cambiar el comportamiento de un sistema **sin cambiar su estructura**
- Separan el "qué hacer" del "quién lo hace" y del "cuándo hacerlo"

### ¿Qué impacto tiene?

**Si los aplicas:**
- ✅ Algoritmos son intercambiables sin modificar el código cliente
- ✅ Los objetos pueden reaccionar a eventos sin conocerse entre sí
- ✅ Las operaciones pueden deshacerse, encolarse o reintentarse con facilidad

**Si no los aplicas:**
- ❌ Lógica de `if/else` o `switch` gigante para manejar variaciones de comportamiento
- ❌ Cadenas de notificaciones manuales que se rompen cuando agregas un nuevo receptor
- ❌ Código cliente atado a implementaciones específicas de algoritmos

---

## 👁️ Observer

### ¿Qué es?

El **Observer** define una dependencia de uno a muchos entre objetos: cuando un objeto (el **Subject/Observable**) cambia su estado, todos los objetos dependientes (**Observers/Suscriptores**) son notificados y actualizados automáticamente.

```
Problema: Cuando el estado de un pedido cambia, necesitas 
          notificar a 5 sistemas distintos: email, SMS, analytics,
          inventario, push notifications.
          Si lo haces manualmente, cada nuevo sistema = 
          modificar el método que cambia el estado.

Solución: El pedido emite un evento. Los observadores se 
          registran y reaccionan. El pedido NO sabe quiénes
          son los observadores.
```

### Analogía Real

Una suscripción a YouTube. El canal (Subject) publica un video (cambio de estado). Todos los suscriptores (Observers) reciben la notificación. El canal no sabe quiénes son los suscriptores individualmente.

### Estructura

```
┌─────────────────────────────────────────────┐
│           OrderEventEmitter (Subject)        │
│─────────────────────────────────────────────│
│  - observers: Map                            │
│  + subscribe(event, observer)               │
│  + unsubscribe(event, observer)             │
│  + emit(event, data)                        │
└─────────────────────────┬───────────────────┘
                          │ notifica a
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌─────────────┐  ┌──────────────┐  ┌──────────────┐
│   Email     │  │  Analytics   │  │  Inventory   │
│  Observer   │  │   Observer   │  │   Observer   │
│ update()    │  │  update()    │  │  update()    │
└─────────────┘  └──────────────┘  └──────────────┘
```

### Implementación en JavaScript ES2023

```javascript
// order-event-emitter.js
// Observer para eventos del ciclo de vida de un pedido

class OrderEventEmitter {
  // Mapa de evento → lista de observers
  #observers = new Map();

  /**
   * Suscribir un observer a un tipo de evento
   * @param {string} event - Nombre del evento ('status_changed', 'payment_processed', etc.)
   * @param {Function} observer - Función que se ejecuta cuando ocurre el evento
   */
  subscribe(event, observer) {
    if (!this.#observers.has(event)) {
      this.#observers.set(event, new Set());
    }
    this.#observers.get(event).add(observer);
  }

  /**
   * Desuscribir un observer
   */
  unsubscribe(event, observer) {
    this.#observers.get(event)?.delete(observer);
  }

  /**
   * Emitir un evento — notifica a todos los observers registrados
   * @param {string} event - Nombre del evento
   * @param {Object} data - Datos del evento
   */
  emit(event, data) {
    const observers = this.#observers.get(event);
    if (!observers || observers.size === 0) return;

    observers.forEach(observer => {
      try {
        observer(data);
      } catch (error) {
        // Un observer que falla no debe abortar los demás
        console.error(`[Observer Error] en evento "${event}":`, error.message);
      }
    });
  }
}

// Observers concretos — cada uno es una función o clase independiente
const emailObserver = ({ orderId, status, customerId }) => {
  console.log(`📧 [Email] Notificando al cliente ${customerId}: pedido ${orderId} → ${status}`);
};

const smsObserver = ({ orderId, status, customerPhone }) => {
  console.log(`📱 [SMS] Enviando a ${customerPhone}: tu pedido ${orderId} está ${status}`);
};

const analyticsObserver = ({ orderId, status, total }) => {
  console.log(`📊 [Analytics] Registrando: pedido ${orderId} cambió a ${status}, total $${total}`);
};

const inventoryObserver = ({ orderId, items, status }) => {
  if (status === 'confirmed') {
    console.log(`📦 [Inventario] Reservando stock para pedido ${orderId}:`, items.map(i => i.name));
  }
};

export { OrderEventEmitter, emailObserver, smsObserver, analyticsObserver, inventoryObserver };

// ──────────────────────────────────────────
// Integración con el modelo Order
// ──────────────────────────────────────────
import {
  OrderEventEmitter,
  emailObserver,
  smsObserver,
  analyticsObserver,
  inventoryObserver,
} from './order-event-emitter.js';

class Order {
  #eventEmitter;
  #status;

  constructor(data, eventEmitter) {
    this.id = data.id;
    this.customerId = data.customerId;
    this.items = data.items;
    this.total = data.total;
    this.#status = 'pending';
    this.#eventEmitter = eventEmitter;
  }

  get status() { return this.#status; }

  changeStatus(newStatus, metadata = {}) {
    const previousStatus = this.#status;
    this.#status = newStatus;

    // Emitir el evento — los observers reaccionan automáticamente
    this.#eventEmitter.emit('status_changed', {
      orderId: this.id,
      previousStatus,
      status: newStatus,
      customerId: this.customerId,
      items: this.items,
      total: this.total,
      ...metadata,
    });
  }
}

// Configuración de observers
const emitter = new OrderEventEmitter();
emitter.subscribe('status_changed', emailObserver);
emitter.subscribe('status_changed', smsObserver);
emitter.subscribe('status_changed', analyticsObserver);
emitter.subscribe('status_changed', inventoryObserver);

// Uso — un llamado dispara todas las notificaciones
const order = new Order(
  { id: 'ord_001', customerId: 'usr_001', items: [{ name: 'Teclado' }], total: 250000 },
  emitter
);

order.changeStatus('confirmed', { customerPhone: '+573001234567' });
// 📧 [Email] Notificando...
// 📱 [SMS] Enviando...
// 📊 [Analytics] Registrando...
// 📦 [Inventario] Reservando stock...
```

**Principios SOLID reforzados:**
- 🟢 **OCP**: Agregar un nuevo observer (WhatsApp) = suscribirlo. Sin modificar `Order`.
- 🟢 **SRP**: El pedido no sabe nada de notificaciones. Cada observer tiene una sola responsabilidad.

---

## 🎯 Strategy

### ¿Qué es?

El **Strategy** define una familia de algoritmos, encapsula cada uno de ellos y los hace intercambiables. Permite que el algoritmo varíe independientemente de los clientes que lo usan.

```
Problema: Tienes un proceso que puede ejecutarse de varias 
          formas (calcular descuentos, ordenar datos, validar 
          pagos...) y el enfoque cambia según el contexto.
          Con if/else manejas la variación, pero cada nueva 
          variante modifica el código existente.

Solución: Cada variación es una clase Strategy separada.
          El contexto recibe la estrategia a usar y la ejecuta.
```

### Analogía Real

GPS de navegación: la aplicación puede calcular rutas por "más rápida", "más corta", "evitar peajes", "bicicleta". Cada algoritmo de ruta es una Strategy intercambiable. El usuario elige; el GPS ejecuta la estrategia sin cambiar su estructura.

### Implementación en JavaScript ES2023

```javascript
// discount-strategy.js
// Motor de descuentos con Strategy — reemplaza el if/else masivo

// Contrato de la estrategia
class DiscountStrategy {
  /**
   * @param {number} subtotal - Precio antes del descuento
   * @returns {{ discount: number, finalPrice: number, description: string }}
   */
  apply(subtotal) {
    throw new Error('apply() debe ser implementado');
  }
}

// Estrategia 1: Descuento VIP
class VipDiscountStrategy extends DiscountStrategy {
  #discountRate = 0.15; // 15% de descuento

  apply(subtotal) {
    const discount = subtotal * this.#discountRate;
    return {
      discount,
      finalPrice: subtotal - discount,
      description: 'Descuento VIP 15%',
    };
  }
}

// Estrategia 2: Descuento por cupón
class CouponDiscountStrategy extends DiscountStrategy {
  // Cupones válidos con sus porcentajes
  static #coupons = new Map([
    ['SUMMER20', 0.20],
    ['FLASH10', 0.10],
    ['WELCOME15', 0.15],
    ['SENA2025', 0.25],
  ]);

  #couponCode;

  constructor(couponCode) {
    super();
    this.#couponCode = couponCode.toUpperCase();
  }

  apply(subtotal) {
    const rate = CouponDiscountStrategy.#coupons.get(this.#couponCode);
    if (!rate) {
      return { discount: 0, finalPrice: subtotal, description: 'Cupón inválido' };
    }
    const discount = subtotal * rate;
    return {
      discount,
      finalPrice: subtotal - discount,
      description: `Cupón ${this.#couponCode} (${rate * 100}%)`,
    };
  }
}

// Estrategia 3: Descuento por volumen
class VolumeDiscountStrategy extends DiscountStrategy {
  static #tiers = [
    { minItems: 10, rate: 0.15, label: '15%' },
    { minItems: 5, rate: 0.10, label: '10%' },
    { minItems: 3, rate: 0.05, label: '5%' },
  ];

  #itemCount;

  constructor(itemCount) {
    super();
    this.#itemCount = itemCount;
  }

  apply(subtotal) {
    const tier = VolumeDiscountStrategy.#tiers.find(t => this.#itemCount >= t.minItems);
    if (!tier) {
      return { discount: 0, finalPrice: subtotal, description: 'Sin descuento por volumen' };
    }
    const discount = subtotal * tier.rate;
    return {
      discount,
      finalPrice: subtotal - discount,
      description: `Descuento por volumen ${tier.label} (${this.#itemCount} items)`,
    };
  }
}

// Estrategia 4: Sin descuento
class NoDiscountStrategy extends DiscountStrategy {
  apply(subtotal) {
    return { discount: 0, finalPrice: subtotal, description: 'Sin descuento' };
  }
}

// El Contexto — usa la estrategia sin saber cuál es
class PriceCalculator {
  #strategy;

  constructor(strategy = new NoDiscountStrategy()) {
    this.#strategy = strategy;
  }

  setStrategy(strategy) {
    this.#strategy = strategy;
  }

  calculate(subtotal) {
    return this.#strategy.apply(subtotal);
  }
}

export {
  PriceCalculator,
  VipDiscountStrategy,
  CouponDiscountStrategy,
  VolumeDiscountStrategy,
  NoDiscountStrategy,
};

// ──────────────────────────────────────────
// Uso — las estrategias son intercambiables
// ──────────────────────────────────────────
const calculator = new PriceCalculator();

// Usuario VIP
calculator.setStrategy(new VipDiscountStrategy());
console.log(calculator.calculate(300000));
// { discount: 45000, finalPrice: 255000, description: 'Descuento VIP 15%' }

// Con cupón
calculator.setStrategy(new CouponDiscountStrategy('SENA2025'));
console.log(calculator.calculate(300000));
// { discount: 75000, finalPrice: 225000, description: 'Cupón SENA2025 (25%)' }

// Agregar una nueva estrategia en el futuro NO modifica PriceCalculator ✅
```

---

## ⚙️ Command

### ¿Qué es?

El **Command** encapsula una solicitud como un objeto, permitiendo parametrizar clientes con diferentes solicitudes, encolar o registrar solicitudes, y soportar operaciones reversibles (undo/redo).

```
Problema: Necesitas registrar quién hizo qué, poder deshacer 
          acciones, o encolar operaciones para ejecutarlas más tarde.

Solución: Cada acción es un objeto Command con execute() y 
          opcionalmente undo(). Un Invoker ejecuta comandos sin 
          saber qué hacen internamente.
```

### Casos de Uso Reales

- **Redux** en React — cada acción es un Command
- **Colas de trabajo** (Bull, RabbitMQ) — los jobs son Commands serializados
- **Editor de texto** — Ctrl+Z (undo) deshace el último Command
- **Transacciones de base de datos** — una saga es una secuencia de Commands

### Implementación en JavaScript ES2023

```javascript
// task-commands.js
// Sistema de gestión de tareas con Command (soporte para undo)

// Almacén de datos (simulación)
const taskStore = new Map([
  ['task_001', { id: 'task_001', title: 'Diseñar mockups', status: 'pending', priority: 'high' }],
  ['task_002', { id: 'task_002', title: 'Implementar API', status: 'pending', priority: 'medium' }],
]);

// Contrato base de un Command
class Command {
  execute() { throw new Error('execute() debe ser implementado'); }
  undo() { throw new Error('undo() debe ser implementado'); }
  getDescription() { return this.constructor.name; }
}

// Command concreto: cambiar estado de tarea
class ChangeTaskStatusCommand extends Command {
  #taskId;
  #newStatus;
  #previousStatus; // para poder deshacer

  constructor(taskId, newStatus) {
    super();
    this.#taskId = taskId;
    this.#newStatus = newStatus;
  }

  execute() {
    const task = taskStore.get(this.#taskId);
    if (!task) throw new Error(`Tarea "${this.#taskId}" no encontrada`);
    
    this.#previousStatus = task.status; // Guardar para undo
    task.status = this.#newStatus;
    taskStore.set(this.#taskId, { ...task });
    
    console.log(`✅ Tarea "${task.title}": ${this.#previousStatus} → ${this.#newStatus}`);
  }

  undo() {
    const task = taskStore.get(this.#taskId);
    if (!task || this.#previousStatus === undefined) return;
    
    task.status = this.#previousStatus;
    taskStore.set(this.#taskId, { ...task });
    
    console.log(`↩️  Deshecho: "${task.title}" vuelve a ${this.#previousStatus}`);
  }

  getDescription() {
    return `Cambiar estado de ${this.#taskId} a "${this.#newStatus}"`;
  }
}

// Command concreto: cambiar prioridad
class ChangeTaskPriorityCommand extends Command {
  #taskId;
  #newPriority;
  #previousPriority;

  constructor(taskId, newPriority) {
    super();
    this.#taskId = taskId;
    this.#newPriority = newPriority;
  }

  execute() {
    const task = taskStore.get(this.#taskId);
    if (!task) throw new Error(`Tarea "${this.#taskId}" no encontrada`);
    
    this.#previousPriority = task.priority;
    task.priority = this.#newPriority;
    taskStore.set(this.#taskId, { ...task });
    
    console.log(`✅ Prioridad de "${task.title}": ${this.#previousPriority} → ${this.#newPriority}`);
  }

  undo() {
    const task = taskStore.get(this.#taskId);
    if (!task || this.#previousPriority === undefined) return;
    
    task.priority = this.#previousPriority;
    taskStore.set(this.#taskId, { ...task });
    
    console.log(`↩️  Deshecho: prioridad de "${task.title}" vuelve a ${this.#previousPriority}`);
  }
}

// El Invoker — ejecuta y gestiona el historial de comandos
class TaskCommandInvoker {
  #history = [];
  #redoStack = [];

  execute(command) {
    command.execute();
    this.#history.push(command);
    this.#redoStack = []; // Al ejecutar un nuevo comando, se limpia el redo
    console.log(`[Historial] ${this.#history.length} comando(s) en historial`);
  }

  undo() {
    const command = this.#history.pop();
    if (!command) {
      console.log('[Undo] No hay comandos para deshacer');
      return;
    }
    command.undo();
    this.#redoStack.push(command);
  }

  redo() {
    const command = this.#redoStack.pop();
    if (!command) {
      console.log('[Redo] No hay comandos para rehacer');
      return;
    }
    command.execute();
    this.#history.push(command);
  }

  getHistory() {
    return this.#history.map(cmd => cmd.getDescription());
  }
}

export { TaskCommandInvoker, ChangeTaskStatusCommand, ChangeTaskPriorityCommand };

// ──────────────────────────────────────────
// Uso — ejecutar, deshacer, rehacer
// ──────────────────────────────────────────
const invoker = new TaskCommandInvoker();

invoker.execute(new ChangeTaskStatusCommand('task_001', 'in_progress'));
invoker.execute(new ChangeTaskPriorityCommand('task_001', 'critical'));
invoker.execute(new ChangeTaskStatusCommand('task_002', 'in_progress'));

console.log('\nHistorial:', invoker.getHistory());

console.log('\n--- Deshacer último ---');
invoker.undo();

console.log('\n--- Deshacer otro ---');
invoker.undo();

console.log('\n--- Rehacer ---');
invoker.redo();
```

---

## 📊 Los 11 Patrones de Comportamiento — Resumen Rápido

| Patrón | En una línea | Ejemplo en JavaScript |
|--------|--------------|----------------------|
| **Observer** | Suscripción a eventos | EventEmitter, React hooks |
| **Strategy** | Algoritmos intercambiables | Passport.js strategies |
| **Command** | Encapsular acciones como objetos | Redux actions, undo/redo |
| **Chain of Responsibility** | Pasar solicitud por cadena de handlers | Middleware de Express.js |
| **Iterator** | Recorrer colecciones sin exponer estructura | `for...of`, generadores |
| **Mediator** | Objeto central coordina la comunicación | Redux store, EventBus |
| **State** | Comportamiento cambia según estado interno | Máquina de estados de un pedido |
| **Template Method** | Esqueleto de algoritmo, pasos variables | Clase base con métodos hook |
| **Memento** | Capturar y restaurar estado interno | Sistema de undo, snapshots |
| **Visitor** | Operaciones sobre estructura sin modificarla | AST transformers, compiladores |
| **Interpreter** | Gramática para un lenguaje | Parsers, motores de reglas |

---

## 🔗 Combinando Patrones

Los patrones raramente viven en aislamiento. En un sistema real:

```
OrderService
  ├── usa Builder para construir el pedido
  ├── usa Strategy para calcular descuentos
  ├── usa Observer para notificar el cambio de estado
  ├── usa Command para registrar y deshacer acciones
  └── usa Facade para crear el envío

Esta combinación es lo que hace un sistema real robusto.
```

---

## ✅ Resumen de la Semana 05

| Categoría | Patrones vistos | Principio SOLID clave |
|-----------|----------------|----------------------|
| Creacionales | Factory Method, Singleton, Builder, Abstract Factory | DIP, OCP |
| Estructurales | Adapter, Decorator, Facade | OCP, ISP, DIP |
| Comportamiento | Observer, Strategy, Command | SRP, OCP |

---

_Anterior: [03 — Estructurales ←](03-patrones-estructurales.md)_

_Bootcamp de Arquitectura de Software · SENA · bc-channel-epti_
