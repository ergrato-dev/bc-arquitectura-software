# 📖 02 — Patrones Creacionales

> _Los patrones creacionales abstraen el proceso de instanciación. Ayudan a hacer el sistema independiente de cómo sus objetos son creados, compuestos y representados._
>
> — Gang of Four

---

## 🎯 ¿Qué son los Patrones Creacionales?

### ¿Qué son?

Los patrones creacionales se encargan de **cómo se crean los objetos**. En lugar de instanciar directamente con `new ClaseX(params)` disperso por todo el sistema, estos patrones **encapsulan la lógica de creación** en un lugar definido y controlado.

### ¿Para qué sirven?

- Desacoplan el código que **usa** un objeto del código que lo **crea**
- Permiten cambiar qué tipo concreto se crea sin modificar el código cliente
- Centralizan y simplifican la creación de objetos complejos

### ¿Qué impacto tiene?

**Si los aplicas:**
- ✅ Cambiar la implementación de un objeto no requiere modificar el código cliente
- ✅ La creación de objetos complejos es legible y predecible
- ✅ Facilita el testing (puedes sustituir implementaciones fácilmente)

**Si no los aplicas:**
- ❌ `new ClaseX(a, b, c, d, e, f, g)` disperso en 20 archivos — un cambio en el constructor rompe todo
- ❌ Objetos complejos construidos de forma inconsistente según el lugar del código

---

## 🏭 Factory Method

### ¿Qué es?

El **Factory Method** define una **interfaz para crear un objeto**, pero permite que las subclases decidan cuál clase concreta instanciar. El código cliente trabaja con la interfaz, no con la clase concreta.

```
Problema: Tu código necesita crear objetos, pero no quieres acoplarte
          a una clase concreta específica.

Solución: Define un método para crear el objeto. Las subclases (o
          configuración) deciden QUÉ clase concreta se crea.
```

### Estructura

```
┌─────────────────────────────────────────────────────────┐
│                   NotificationFactory                   │
│ ──────────────────────────────────────────────────────  │
│  + createNotification(type): Notification  ← Factory   │
│  + send(message): void                                  │
└────────────────────────┬────────────────────────────────┘
                         │ crea
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
   ┌──────────┐  ┌──────────────┐  ┌──────────────┐
   │  Email   │  │     SMS      │  │    Push      │
   │Notif.    │  │  Notification│  │ Notification │
   └──────────┘  └──────────────┘  └──────────────┘
```

### Implementación en JavaScript ES2023

```javascript
// notification.js
// Interfaz base (contrato)
class Notification {
  send(message) {
    throw new Error('send() debe ser implementado por las subclases');
  }
}

// Implementaciones concretas
class EmailNotification extends Notification {
  #email;
  
  constructor(email) {
    super();
    this.#email = email;
  }

  send(message) {
    console.log(`📧 Email enviado a ${this.#email}: ${message}`);
    // Aquí iría la integración real con SendGrid, SES, etc.
    return { type: 'email', to: this.#email, message, sentAt: new Date() };
  }
}

class SmsNotification extends Notification {
  #phone;

  constructor(phone) {
    super();
    this.#phone = phone;
  }

  send(message) {
    console.log(`📱 SMS enviado a ${this.#phone}: ${message}`);
    return { type: 'sms', to: this.#phone, message, sentAt: new Date() };
  }
}

class PushNotification extends Notification {
  #deviceToken;

  constructor(deviceToken) {
    super();
    this.#deviceToken = deviceToken;
  }

  send(message) {
    console.log(`🔔 Push enviado a dispositivo ${this.#deviceToken}: ${message}`);
    return { type: 'push', to: this.#deviceToken, message, sentAt: new Date() };
  }
}

// La Factory — centraliza la creación
class NotificationFactory {
  static create(type, destination) {
    const factories = {
      email: () => new EmailNotification(destination),
      sms: () => new SmsNotification(destination),
      push: () => new PushNotification(destination),
    };

    const factory = factories[type];
    if (!factory) {
      throw new Error(`Tipo de notificación desconocido: "${type}"`);
    }

    return factory();
  }
}

export { NotificationFactory };

// Uso del patrón — el cliente NO conoce las clases concretas
import { NotificationFactory } from './notification.js';

const notif1 = NotificationFactory.create('email', 'ana@sena.edu.co');
const notif2 = NotificationFactory.create('sms', '+573001234567');
const notif3 = NotificationFactory.create('push', 'device_token_abc123');

// Todos se usan de la misma forma — polimorfismo
[notif1, notif2, notif3].forEach(n => n.send('Tu pedido ha sido confirmado'));
```

**Principios SOLID reforzados:**
- 🟢 **OCP**: Agregar un nuevo tipo de notificación (WhatsApp) = nueva clase + agregar entrada al mapa. Sin modificar las existentes.
- 🟢 **DIP**: El cliente depende de la abstracción `Notification`, no de `EmailNotification`.

---

## 🔂 Singleton

### ¿Qué es?

El **Singleton** garantiza que una clase tenga **solo una instancia** en toda la aplicación, y proporciona un punto de acceso global a esa instancia.

```
Problema: Necesitas exactamente UNA instancia de algo (pool de
          conexiones, configuración, logger centralizado).

Solución: La clase controla su propia instanciación. La primera
          vez crea la instancia, las siguientes devuelven la misma.
```

### ⚠️ Advertencia importante

El Singleton es uno de los patrones más **discutidos y frecuentemente mal usado**. Úsalo solo cuando genuinamente necesitas una instancia única. El abuso convierte el Singleton en un anti-patrón (estado global implícito, dificulta el testing).

### Implementación en JavaScript ES2023

```javascript
// database-connection.js
// Singleton para el pool de conexiones a PostgreSQL

class DatabaseConnection {
  // Campo privado estático — almacena la instancia única
  static #instance = null;
  #pool = null;
  #config;

  // Constructor privado — nadie puede hacer `new DatabaseConnection()`
  constructor(config) {
    this.#config = config;
  }

  // Punto de acceso global — el único lugar donde se crea/accede la instancia
  static getInstance(config) {
    if (!DatabaseConnection.#instance) {
      DatabaseConnection.#instance = new DatabaseConnection(config);
      console.log('✅ Pool de conexiones creado (primera vez)');
    } else {
      console.log('♻️  Reutilizando pool de conexiones existente');
    }
    return DatabaseConnection.#instance;
  }

  async connect() {
    // Simulación — en producción usarías pg o pg-pool
    this.#pool = { host: this.#config.host, active: true };
    console.log(`🔌 Conectado a ${this.#config.host}:${this.#config.port}`);
  }

  async query(sql, params = []) {
    if (!this.#pool?.active) {
      throw new Error('No hay conexión activa a la base de datos');
    }
    console.log(`🗄️  Ejecutando: ${sql}`, params);
    // Retornaría los resultados reales
    return { rows: [], rowCount: 0 };
  }

  // Útil para testing — permite resetear la instancia
  static resetInstance() {
    DatabaseConnection.#instance = null;
  }
}

export { DatabaseConnection };

// Uso — desde múltiples módulos
import { DatabaseConnection } from './database-connection.js';

const DB_CONFIG = {
  host: 'localhost',
  port: 5432,
  database: 'shopflow_db',
  user: 'app_user',
};

// En el módulo de usuarios
const db1 = DatabaseConnection.getInstance(DB_CONFIG);
await db1.connect();

// En el módulo de pedidos (distinto archivo)
const db2 = DatabaseConnection.getInstance(); // devuelve la MISMA instancia
// db1 === db2  →  true ✅
```

> 💡 **¿Sabías que?** En JavaScript, los módulos ES (`import/export`) son singletons por naturaleza: un módulo se carga una sola vez, y todas las importaciones apuntan a la misma instancia del módulo. Muchas veces no necesitas el patrón explícito.

---

## 🏗️ Builder

### ¿Qué es?

El **Builder** separa la **construcción de un objeto complejo** de su representación, de forma que el mismo proceso de construcción pueda crear diferentes representaciones.

```
Problema: Tienes un objeto con muchas propiedades opcionales.
          El constructor se vuelve ilegible: 
          new Pedido(id, usuario, items, cupon, dir, metPago, ...)

Solución: Un Builder construye el objeto paso a paso con métodos
          expresivos. Solo se "ensambla" al llamar build().
```

### Implementación en JavaScript ES2023

```javascript
// order-builder.js

class Order {
  constructor({ id, customerId, items, discountCode, shippingAddress, paymentMethod, notes }) {
    this.id = id;
    this.customerId = customerId;
    this.items = items;
    this.discountCode = discountCode ?? null;
    this.shippingAddress = shippingAddress;
    this.paymentMethod = paymentMethod;
    this.notes = notes ?? '';
    this.status = 'pending';
    this.createdAt = new Date();
    this.total = this.#calculateTotal();
  }

  #calculateTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}

// El Builder — construye el objeto paso a paso
class OrderBuilder {
  #customerId = null;
  #items = [];
  #discountCode = null;
  #shippingAddress = null;
  #paymentMethod = null;
  #notes = '';

  // Cada método retorna `this` para encadenamiento fluido
  forCustomer(customerId) {
    this.#customerId = customerId;
    return this;
  }

  withItem(productId, name, price, quantity) {
    this.#items.push({ productId, name, price, quantity });
    return this;
  }

  withDiscount(couponCode) {
    this.#discountCode = couponCode;
    return this;
  }

  shippingTo(address) {
    this.#shippingAddress = address;
    return this;
  }

  payWith(method) {
    this.#paymentMethod = method;
    return this;
  }

  withNotes(notes) {
    this.#notes = notes;
    return this;
  }

  // Valida y ensambla el objeto final
  build() {
    if (!this.#customerId) throw new Error('El pedido requiere un cliente');
    if (this.#items.length === 0) throw new Error('El pedido requiere al menos un ítem');
    if (!this.#shippingAddress) throw new Error('El pedido requiere una dirección de envío');
    if (!this.#paymentMethod) throw new Error('El pedido requiere un método de pago');

    return new Order({
      id: crypto.randomUUID(),
      customerId: this.#customerId,
      items: this.#items,
      discountCode: this.#discountCode,
      shippingAddress: this.#shippingAddress,
      paymentMethod: this.#paymentMethod,
      notes: this.#notes,
    });
  }
}

export { OrderBuilder };

// Uso — código expresivo, legible como prosa
import { OrderBuilder } from './order-builder.js';

const order = new OrderBuilder()
  .forCustomer('usr_001')
  .withItem('prod_abc', 'Teclado Mecánico', 250000, 1)
  .withItem('prod_def', 'Mouse Gamer', 120000, 2)
  .withDiscount('SUMMER20')
  .shippingTo({ street: 'Cra 15 #45-67', city: 'Bogotá', country: 'CO' })
  .payWith('nequi')
  .withNotes('Entregar en la portería')
  .build();

console.log(order);
```

**Ventajas clave:**
- La construcción es **legible** — puedes leer el `build()` como una historia
- Las validaciones viven en un solo lugar (el `build()`)
- Puedes crear diferentes "configuraciones" del objeto sin constructores sobrecargados

---

## 🏭 Abstract Factory (Bonus)

El **Abstract Factory** lleva el Factory Method un paso más allá: crea **familias de objetos relacionados** sin especificar sus clases concretas.

```javascript
// abstract-factory.js
// Ejemplo: distintas familias de UI para diferentes plataformas

// Familia Web
class WebButton {
  render() { return '<button class="btn">Click</button>'; }
}
class WebInput {
  render() { return '<input type="text" class="form-control" />'; }
}

// Familia Mobile
class MobileButton {
  render() { return 'TouchableOpacity component'; }
}
class MobileInput {
  render() { return 'TextInput component'; }
}

// Abstract Factory
class UIFactory {
  static create(platform) {
    const factories = {
      web: {
        createButton: () => new WebButton(),
        createInput: () => new WebInput(),
      },
      mobile: {
        createButton: () => new MobileButton(),
        createInput: () => new MobileInput(),
      },
    };

    const factory = factories[platform];
    if (!factory) throw new Error(`Plataforma desconocida: ${platform}`);
    return factory;
  }
}

// El cliente trabaja con la familia sin conocer las clases concretas
const ui = UIFactory.create('web');
const button = ui.createButton(); // WebButton
const input = ui.createInput();   // WebInput
```

---

## 📊 Comparación de Patrones Creacionales

| Patrón | Cuándo usarlo | Complejidad |
|--------|---------------|-------------|
| **Factory Method** | Cuando no sabes de antemano qué clase exacta crear | Baja |
| **Abstract Factory** | Cuando necesitas familias de objetos relacionados | Media |
| **Builder** | Cuando un objeto tiene muchos parámetros opcionales o construcción compleja | Media |
| **Prototype** | Cuando copiar un objeto es más eficiente que crearlo desde cero | Baja |
| **Singleton** | Cuando necesitas exactamente 1 instancia compartida | Baja |

---

_Anterior: [01 — Introducción ←](01-introduccion-patrones-diseno.md) | Siguiente: [03 — Patrones Estructurales →](03-patrones-estructurales.md)_

_Bootcamp de Arquitectura de Software · SENA · bc-channel-epti_
