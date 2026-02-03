# 🚀 SOLID en JavaScript ES2023

## 🎯 Objetivos de Aprendizaje

Al finalizar esta sección, serás capaz de:

- ✅ Aplicar SOLID en JavaScript moderno (ES2023)
- ✅ Usar características del lenguaje para implementar SOLID
- ✅ Adaptar patrones orientados a objetos a JavaScript
- ✅ Crear arquitecturas SOLID con módulos ES6

---

## 📖 JavaScript y SOLID: Adaptaciones Necesarias

### 🎯 ¿Por qué necesitamos adaptar SOLID a JavaScript?

SOLID fue diseñado para lenguajes fuertemente tipados (Java, C#), pero JavaScript tiene características únicas:

1. **Tipado dinámico**: No hay interfaces explícitas
2. **Prototípico**: Herencia basada en prototipos
3. **Funcional**: Funciones de primera clase
4. **Flexible**: Duck typing y object literals

### 🚀 Ventajas de JavaScript para SOLID

- ✅ **Duck typing**: No necesitas interfaces formales
- ✅ **Funciones de primera clase**: Estrategias como funciones
- ✅ **Object literals**: Objetos simples sin clases
- ✅ **Módulos ES6**: Encapsulación natural

### 💥 Desafíos de JavaScript para SOLID

- ❌ **Sin tipos**: Difícil garantizar contratos (solución: TypeScript o JSDoc)
- ❌ **Sin interfaces**: Hay que simularlas con duck typing
- ❌ **Herencia prototípica**: Diferente a herencia de clases tradicional

---

## 1️⃣ SRP en JavaScript ES2023

### Patrón Clásico: Clases con Responsabilidad Única

```javascript
// ✅ SRP con clases modernas
class UserValidator {
  #emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  validateEmail(email) {
    if (!this.#emailPattern.test(email)) {
      throw new Error('Email inválido');
    }
    return true;
  }

  validatePassword(password) {
    if (password.length < 8) {
      throw new Error('Contraseña debe tener al menos 8 caracteres');
    }
    return true;
  }
}

class UserRepository {
  #users = new Map();

  save(user) {
    this.#users.set(user.id, user);
    return user;
  }

  findById(id) {
    return this.#users.get(id);
  }

  findByEmail(email) {
    return Array.from(this.#users.values()).find(
      (user) => user.email === email,
    );
  }
}

class EmailService {
  async send(to, subject, body) {
    console.log(`📧 Email enviado a ${to}: ${subject}`);
    // Aquí iría la lógica real de envío
    return { sent: true, timestamp: new Date() };
  }
}
```

### Patrón Funcional: Módulos con Funciones Puras

```javascript
// ✅ SRP estilo funcional (sin clases)
// archivo: user-validator.js
export const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    throw new Error('Email inválido');
  }
  return true;
};

export const validatePassword = (password) => {
  if (password.length < 8) {
    throw new Error('Contraseña debe tener al menos 8 caracteres');
  }
  return true;
};

// archivo: user-repository.js
const users = new Map();

export const saveUser = (user) => {
  users.set(user.id, user);
  return user;
};

export const findUserById = (id) => users.get(id);

export const findUserByEmail = (email) =>
  Array.from(users.values()).find((user) => user.email === email);

// archivo: email-service.js
export const sendEmail = async (to, subject, body) => {
  console.log(`📧 Email enviado a ${to}: ${subject}`);
  return { sent: true, timestamp: new Date() };
};
```

### Uso con Módulos ES6

```javascript
// app.js
import { validateEmail, validatePassword } from './user-validator.js';
import { saveUser, findUserById } from './user-repository.js';
import { sendEmail } from './email-service.js';

const createUser = async (userData) => {
  // Validar
  validateEmail(userData.email);
  validatePassword(userData.password);

  // Guardar
  const user = {
    id: crypto.randomUUID(),
    ...userData,
    createdAt: new Date(),
  };
  saveUser(user);

  // Notificar
  await sendEmail(user.email, 'Bienvenido', 'Tu cuenta fue creada');

  return user;
};
```

---

## 2️⃣ OCP en JavaScript ES2023

### Patrón: Strategy con Object Literals

```javascript
// ✅ OCP usando object literals (sin clases)
const discountStrategies = {
  percentage: (price, value) => price * (1 - value),
  fixed: (price, value) => price - value,
  seasonal: (price, value) => {
    const currentMonth = new Date().getMonth();
    const isHighSeason = [11, 0, 1].includes(currentMonth); // Diciembre, Enero, Febrero
    return isHighSeason ? price * (1 - value * 1.5) : price * (1 - value);
  },
  blackFriday: (price) => price * 0.5,
};

class PriceCalculator {
  constructor() {
    this.strategies = discountStrategies;
  }

  calculate(price, discountType, discountValue) {
    const strategy = this.strategies[discountType];
    if (!strategy) {
      throw new Error(`Estrategia de descuento desconocida: ${discountType}`);
    }
    return strategy(price, discountValue);
  }

  // ✅ ABIERTO para extensión (agregar nueva estrategia)
  registerStrategy(name, strategyFn) {
    this.strategies[name] = strategyFn;
  }
}

// Uso
const calculator = new PriceCalculator();
const finalPrice = calculator.calculate(1000, 'percentage', 0.1); // 900

// ✅ Extensión sin modificar código existente
calculator.registerStrategy('vip', (price) => price * 0.7);
const vipPrice = calculator.calculate(1000, 'vip'); // 700
```

### Patrón: Plugin System

```javascript
// ✅ OCP con sistema de plugins
class Logger {
  #plugins = [];

  use(plugin) {
    this.#plugins.push(plugin);
    return this; // Chainable
  }

  log(level, message) {
    const logEntry = {
      level,
      message,
      timestamp: new Date(),
      metadata: {},
    };

    // Cada plugin puede transformar el log
    const processedEntry = this.#plugins.reduce(
      (entry, plugin) => plugin(entry),
      logEntry,
    );

    console.log(JSON.stringify(processedEntry));
  }
}

// Plugins como funciones puras
const timestampPlugin = (entry) => ({
  ...entry,
  timestamp: entry.timestamp.toISOString(),
});

const userContextPlugin = (entry) => ({
  ...entry,
  metadata: {
    ...entry.metadata,
    userId: 'user-123',
    sessionId: 'session-456',
  },
});

const colorPlugin = (entry) => {
  const colors = { error: '\x1b[31m', warn: '\x1b[33m', info: '\x1b[36m' };
  return {
    ...entry,
    message: `${colors[entry.level] || ''}${entry.message}\x1b[0m`,
  };
};

// Uso
const logger = new Logger()
  .use(timestampPlugin)
  .use(userContextPlugin)
  .use(colorPlugin);

logger.log('info', 'Usuario creado');
// ✅ Extensible: agregar nuevos plugins sin modificar Logger
```

---

## 3️⃣ LSP en JavaScript ES2023

### Duck Typing para LSP

En JavaScript no necesitamos herencia formal, solo que los objetos cumplan el contrato:

```javascript
// ✅ LSP con duck typing
class PaymentProcessor {
  process(paymentMethod, amount) {
    // ✅ Solo verificamos que tenga el método necesario
    if (typeof paymentMethod.processPayment !== 'function') {
      throw new Error('PaymentMethod debe tener método processPayment');
    }

    return paymentMethod.processPayment(amount);
  }
}

// Diferentes implementaciones que cumplen el contrato
const creditCardPayment = {
  processPayment(amount) {
    console.log(`💳 Procesando ${amount} con tarjeta de crédito`);
    return { success: true, transactionId: 'cc-123' };
  },
};

const paypalPayment = {
  processPayment(amount) {
    console.log(`🅿️ Procesando ${amount} con PayPal`);
    return { success: true, transactionId: 'pp-456' };
  },
};

const bitcoinPayment = {
  processPayment(amount) {
    console.log(`₿ Procesando ${amount} con Bitcoin`);
    return { success: true, transactionId: 'btc-789' };
  },
};

// Uso
const processor = new PaymentProcessor();
processor.process(creditCardPayment, 100);
processor.process(paypalPayment, 200);
processor.process(bitcoinPayment, 300);

// ✅ Todos son sustituibles (LSP)
```

### Composición sobre Herencia

```javascript
// ✅ LSP con composición (mejor que herencia)
const createShape = (type, dimensions) => ({
  type,
  ...dimensions,
  area() {
    switch (type) {
      case 'rectangle':
        return dimensions.width * dimensions.height;
      case 'square':
        return dimensions.side ** 2;
      case 'circle':
        return Math.PI * dimensions.radius ** 2;
      default:
        throw new Error(`Tipo de forma desconocido: ${type}`);
    }
  },
});

const rectangle = createShape('rectangle', { width: 10, height: 5 });
const square = createShape('square', { side: 5 });
const circle = createShape('circle', { radius: 3 });

console.log(rectangle.area()); // 50
console.log(square.area()); // 25
console.log(circle.area()); // ~28.27

// ✅ Sin problemas de herencia (cuadrado/rectángulo)
```

---

## 4️⃣ ISP en JavaScript ES2023

### Mixins para Segregación de Interfaces

```javascript
// ✅ ISP con mixins
const Workable = {
  work() {
    console.log(`${this.name} está trabajando`);
  },
};

const Eatable = {
  eat() {
    console.log(`${this.name} está comiendo`);
  },
};

const Sleepable = {
  sleep() {
    console.log(`${this.name} está durmiendo`);
  },
};

// Componer capacidades según necesidad
class HumanWorker {
  constructor(name) {
    this.name = name;
    Object.assign(this, Workable, Eatable, Sleepable);
  }
}

class RobotWorker {
  constructor(name) {
    this.name = name;
    Object.assign(this, Workable); // ✅ Solo Workable
  }
}

const human = new HumanWorker('Juan');
human.work();
human.eat();
human.sleep();

const robot = new RobotWorker('R2D2');
robot.work();
// robot.eat(); // ✅ No existe, como debe ser
```

### Objetos con Solo Métodos Necesarios

```javascript
// ✅ ISP: objetos minimalistas
const createEmailNotifier = (emailService) => ({
  notify(message) {
    emailService.send(message);
  },
});

const createSMSNotifier = (smsService) => ({
  notify(message) {
    smsService.send(message);
  },
});

const createPushNotifier = (pushService) => ({
  notify(message) {
    pushService.send(message);
  },
});

// Cliente solo necesita notify()
class NotificationManager {
  constructor(notifiers) {
    this.notifiers = notifiers;
  }

  notifyAll(message) {
    this.notifiers.forEach((notifier) => notifier.notify(message));
  }
}

// Uso
const manager = new NotificationManager([
  createEmailNotifier(emailService),
  createSMSNotifier(smsService),
  createPushNotifier(pushService),
]);

manager.notifyAll('Nuevo mensaje');
```

---

## 5️⃣ DIP en JavaScript ES2023

### Inyección de Dependencias con Constructor

```javascript
// ✅ DIP con inyección en constructor
class UserService {
  constructor(database, emailService, logger) {
    this.database = database;
    this.emailService = emailService;
    this.logger = logger;
  }

  async createUser(userData) {
    try {
      this.logger.log('info', 'Creando usuario...');

      const user = await this.database.save({
        id: crypto.randomUUID(),
        ...userData,
        createdAt: new Date(),
      });

      await this.emailService.send(
        user.email,
        'Bienvenido',
        'Tu cuenta fue creada',
      );

      this.logger.log('info', `Usuario ${user.id} creado`);
      return user;
    } catch (error) {
      this.logger.log('error', `Error creando usuario: ${error.message}`);
      throw error;
    }
  }
}

// Implementaciones concretas
class PostgreSQLDatabase {
  async save(data) {
    console.log('💾 Guardando en PostgreSQL');
    return data;
  }
}

class MockDatabase {
  async save(data) {
    console.log('🧪 Guardando en Mock');
    return data;
  }
}

// Uso con diferentes implementaciones
const productionService = new UserService(
  new PostgreSQLDatabase(),
  new EmailService(),
  new Logger(),
);

const testService = new UserService(
  new MockDatabase(),
  new MockEmailService(),
  new ConsoleLogger(),
);
```

### Factory Pattern para DIP

```javascript
// ✅ DIP con Factory
class ServiceFactory {
  static create(environment) {
    const database =
      environment === 'production'
        ? new PostgreSQLDatabase()
        : new MockDatabase();

    const emailService =
      environment === 'production'
        ? new EmailService()
        : new MockEmailService();

    const logger =
      environment === 'production' ? new FileLogger() : new ConsoleLogger();

    return new UserService(database, emailService, logger);
  }
}

// Uso
const service = ServiceFactory.create(process.env.NODE_ENV);
```

### Dependency Injection Container

```javascript
// ✅ DIP con DI Container simple
class Container {
  #services = new Map();

  register(name, factory) {
    this.#services.set(name, factory);
  }

  resolve(name) {
    const factory = this.#services.get(name);
    if (!factory) {
      throw new Error(`Servicio no registrado: ${name}`);
    }
    return factory(this); // Permite resolver dependencias
  }
}

// Configuración
const container = new Container();

container.register('database', () => new PostgreSQLDatabase());
container.register('emailService', () => new EmailService());
container.register('logger', () => new ConsoleLogger());

container.register(
  'userService',
  (c) =>
    new UserService(
      c.resolve('database'),
      c.resolve('emailService'),
      c.resolve('logger'),
    ),
);

// Uso
const userService = container.resolve('userService');
```

---

## 🎨 Patrones Modernos de JavaScript para SOLID

### 1. Async/Await para Operaciones SOLID

```javascript
// ✅ SRP + async/await
class UserRepository {
  async save(user) {
    // Operación asíncrona bien encapsulada
    return await db.users.insert(user);
  }

  async findById(id) {
    return await db.users.findOne({ id });
  }
}

class EmailService {
  async send(to, subject, body) {
    return await mailProvider.send({ to, subject, body });
  }
}

// Orquestación con async/await
class CreateUserUseCase {
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  async execute(userData) {
    const user = await this.userRepository.save(userData);
    await this.emailService.send(user.email, 'Bienvenido', 'Cuenta creada');
    return user;
  }
}
```

### 2. Destructuring para Interfaces Mínimas (ISP)

```javascript
// ✅ ISP con destructuring
const processPayment = ({ amount, method }) => {
  // Solo necesita amount y method
  console.log(`Procesando ${amount} con ${method}`);
};

const order = {
  id: 1,
  items: [],
  customer: {},
  amount: 1000,
  method: 'credit-card',
  shippingAddress: {},
  // ... muchas otras propiedades
};

processPayment(order); // ✅ Solo usa lo que necesita
```

### 3. Optional Chaining y Nullish Coalescing

```javascript
// ✅ Código defensivo para LSP
class OrderProcessor {
  process(order) {
    // ✅ Manejo seguro de propiedades opcionales
    const discount = order?.discountStrategy?.calculate?.(order.total) ?? 0;
    const shipping = order?.shippingCalculator?.calculate?.() ?? 0;

    return order.total - discount + shipping;
  }
}
```

### 4. Proxy para Extensibilidad (OCP)

```javascript
// ✅ OCP con Proxy
const createLoggingProxy = (target) => {
  return new Proxy(target, {
    get(obj, prop) {
      if (typeof obj[prop] === 'function') {
        return function (...args) {
          console.log(`🔍 Llamando ${prop} con`, args);
          const result = obj[prop].apply(obj, args);
          console.log(`✅ ${prop} retornó`, result);
          return result;
        };
      }
      return obj[prop];
    },
  });
};

const userService = new UserService();
const loggedUserService = createLoggingProxy(userService);

// ✅ Sin modificar UserService, agregamos logging
loggedUserService.createUser({ name: 'Juan' });
```

---

## 📦 Módulos ES6 para SOLID

### Estructura de Proyecto SOLID

```
src/
├── domain/
│   ├── user.js                 # Entidades
│   └── order.js
├── repositories/
│   ├── user-repository.js      # SRP: Persistencia
│   └── order-repository.js
├── services/
│   ├── email-service.js        # SRP: Envío de emails
│   ├── payment-service.js      # SRP: Pagos
│   └── notification-service.js
├── use-cases/
│   ├── create-user.js          # SRP: Caso de uso
│   └── process-order.js
├── infrastructure/
│   ├── database/
│   │   ├── postgres.js         # DIP: Implementación
│   │   └── mock.js
│   └── email/
│       ├── sendgrid.js
│       └── mock.js
└── index.js                     # Composición
```

### Ejemplo de Módulo SOLID

```javascript
// domain/user.js
export class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
    };
  }
}

// repositories/user-repository.js
import { User } from '../domain/user.js';

export class UserRepository {
  constructor(database) {
    this.database = database;
  }

  async save(user) {
    const data = await this.database.insert('users', user.toJSON());
    return new User(data.id, data.name, data.email);
  }

  async findById(id) {
    const data = await this.database.findOne('users', { id });
    return data ? new User(data.id, data.name, data.email) : null;
  }
}

// use-cases/create-user.js
import { User } from '../domain/user.js';

export class CreateUserUseCase {
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  async execute({ name, email }) {
    const user = new User(crypto.randomUUID(), name, email);
    const savedUser = await this.userRepository.save(user);
    await this.emailService.send(email, 'Bienvenido', 'Cuenta creada');
    return savedUser;
  }
}

// index.js - Composición (Dependency Injection manual)
import { CreateUserUseCase } from './use-cases/create-user.js';
import { UserRepository } from './repositories/user-repository.js';
import { PostgreSQLDatabase } from './infrastructure/database/postgres.js';
import { SendGridEmailService } from './infrastructure/email/sendgrid.js';

const database = new PostgreSQLDatabase();
const emailService = new SendGridEmailService();
const userRepository = new UserRepository(database);
const createUserUseCase = new CreateUserUseCase(userRepository, emailService);

export { createUserUseCase };
```

---

## ✅ Checklist: SOLID en JavaScript ES2023

### SRP:

- [ ] Cada módulo/clase tiene una sola razón para cambiar
- [ ] Uso módulos ES6 para separar responsabilidades
- [ ] Funciones puras cuando es posible

### OCP:

- [ ] Uso strategies (funciones u objetos) para extensibilidad
- [ ] Sistema de plugins cuando necesito extensión dinámica
- [ ] Object literals para configuraciones extensibles

### LSP:

- [ ] Duck typing para sustituibilidad
- [ ] Composición sobre herencia cuando es posible
- [ ] Contratos claros (JSDoc o TypeScript)

### ISP:

- [ ] Mixins para capacidades opcionales
- [ ] Destructuring para interfaces mínimas
- [ ] Objetos pequeños con métodos específicos

### DIP:

- [ ] Inyección de dependencias en constructores
- [ ] Factory patterns para creación
- [ ] DI Container para aplicaciones grandes

---

## 🎯 Conclusión

JavaScript ES2023 ofrece herramientas poderosas para implementar SOLID:

- ✅ **Módulos ES6**: Encapsulación natural
- ✅ **Funciones de primera clase**: Estrategias sin clases
- ✅ **Duck typing**: Flexibilidad para LSP e ISP
- ✅ **Composición**: Alternativa a herencia
- ✅ **Proxy**: Extensibilidad sin modificar código

**Bootcamp de Arquitectura de Software**
_SENA - Week 02 - SOLID en JavaScript ES2023_

_"JavaScript moderno + SOLID = Arquitectura flexible y mantenible"_ 🚀
