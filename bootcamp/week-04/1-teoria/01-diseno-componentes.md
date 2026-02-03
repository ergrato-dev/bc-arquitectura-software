# 📦 Principios de Diseño Basado en Componentes

## 🎯 ¿Qué es un Componente?

### Definición

Un **componente** es una unidad de software modular, reemplazable y desplegable que encapsula su implementación y expone un conjunto de interfaces.

> 💡 _"Un componente es como una pieza de Lego: tiene una forma definida (interfaz), se conecta con otras piezas de manera predecible, y puede reemplazarse por otra pieza compatible."_

### Características de un Componente

![Anatomía de un Componente](../0-assets/01-componentes-interfaces.svg)

| Característica      | Descripción                                      |
| ------------------- | ------------------------------------------------ |
| **Encapsulamiento** | Oculta detalles de implementación                |
| **Reemplazable**    | Puede sustituirse por otro componente compatible |
| **Reutilizable**    | Puede usarse en diferentes contextos             |
| **Desplegable**     | Puede desplegarse de forma independiente         |
| **Documentado**     | Tiene contrato claro de entrada/salida           |

---

## 🎯 ¿Para qué sirve el Diseño Basado en Componentes?

### Casos de Uso

1. **Sistemas modulares**: Dividir un sistema grande en partes manejables
2. **Equipos distribuidos**: Cada equipo trabaja en componentes diferentes
3. **Reutilización**: Compartir funcionalidad entre proyectos
4. **Testing**: Probar componentes de forma aislada
5. **Mantenimiento**: Modificar sin afectar otras partes

### Ejemplo del Mundo Real: Sistema E-Commerce

Un sistema de comercio electrónico típico se compone de:

- **Componente de Catálogo**: Gestión de productos y categorías
- **Componente de Carrito**: Manejo del carrito de compras
- **Componente de Pagos**: Procesamiento de transacciones
- **Componente de Usuarios**: Autenticación, perfiles, preferencias

Cada componente tiene su interfaz bien definida y se comunica con los demás a través de contratos claros.

---

## 💥 ¿Qué Impacto Tiene?

### ✅ Si aplicas diseño basado en componentes:

| Beneficio          | Descripción                             |
| ------------------ | --------------------------------------- |
| **Mantenibilidad** | Cambios aislados, sin efectos cascada   |
| **Testabilidad**   | Unit tests por componente               |
| **Escalabilidad**  | Añadir componentes sin reescribir       |
| **Reutilización**  | Componentes compartidos entre proyectos |
| **Paralelización** | Equipos trabajan en paralelo            |

### ❌ Si NO lo aplicas:

| Problema              | Consecuencia                   |
| --------------------- | ------------------------------ |
| **Código espagueti**  | Todo depende de todo           |
| **Cambios riesgosos** | Un cambio rompe otras partes   |
| **Testing difícil**   | No puedes aislar funcionalidad |
| **Onboarding lento**  | Difícil entender el sistema    |

---

## 🔗 Interfaces y Contratos

### ¿Qué es una Interfaz?

Una **interfaz** define el contrato de comunicación de un componente: qué métodos expone, qué parámetros recibe, y qué retorna.

```javascript
// ✅ Interfaz bien definida (JavaScript con JSDoc)

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 */

/**
 * @typedef {Object} CreateUserInput
 * @property {string} name
 * @property {string} email
 * @property {string} [role='user']
 */

/**
 * Servicio de gestión de usuarios
 * @interface UserService
 */
const userServiceInterface = {
  /**
   * Obtiene todos los usuarios
   * @returns {Promise<User[]>}
   */
  getAll: async () => {},

  /**
   * Obtiene un usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise<User|null>}
   */
  getById: async (id) => {},

  /**
   * Crea un nuevo usuario
   * @param {CreateUserInput} data - Datos del usuario
   * @returns {Promise<User>}
   * @throws {ValidationError} Si los datos son inválidos
   */
  create: async (data) => {},

  /**
   * Elimina un usuario
   * @param {number} id - ID del usuario
   * @returns {Promise<boolean>}
   */
  delete: async (id) => {},
};
```

### Contrato de API

Un **contrato** especifica no solo la firma, sino también:

- **Precondiciones**: Qué debe cumplirse antes de llamar al método
- **Postcondiciones**: Qué garantiza el método después de ejecutarse
- **Invariantes**: Qué siempre debe ser verdad

```javascript
// Ejemplo de contrato con validación
class UserService {
  /**
   * Crea un nuevo usuario
   *
   * CONTRATO:
   * - Precondición: email debe ser único y válido
   * - Precondición: name no debe estar vacío
   * - Postcondición: retorna usuario con id generado
   * - Postcondición: usuario existe en el repositorio
   * - Invariante: nunca hay dos usuarios con mismo email
   */
  async create(data) {
    // Validar precondiciones
    if (!data.name?.trim()) {
      throw new ValidationError('El nombre es requerido');
    }

    if (!this.#isValidEmail(data.email)) {
      throw new ValidationError('Email inválido');
    }

    const existingUser = await this.#repository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('El email ya está registrado');
    }

    // Ejecutar lógica
    const user = await this.#repository.create({
      ...data,
      id: this.#generateId(),
      createdAt: new Date(),
    });

    // Postcondición implícita: user tiene id
    return user;
  }

  #isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  #generateId() {
    return Date.now();
  }
}
```

---

## 🧩 Principios de Diseño de Componentes

### 1. Alta Cohesión

> _"Un componente debe hacer una cosa y hacerla bien."_

```javascript
// ❌ BAJA COHESIÓN - Componente hace demasiadas cosas
class UserManager {
  createUser() {
    /* ... */
  }
  sendEmail() {
    /* ... */
  } // ❌ Responsabilidad de email
  generateReport() {
    /* ... */
  } // ❌ Responsabilidad de reportes
  validatePayment() {
    /* ... */
  } // ❌ Responsabilidad de pagos
}

// ✅ ALTA COHESIÓN - Cada componente tiene una responsabilidad
class UserService {
  create() {
    /* ... */
  }
  update() {
    /* ... */
  }
  delete() {
    /* ... */
  }
  findById() {
    /* ... */
  }
}

class EmailService {
  send() {
    /* ... */
  }
  sendBulk() {
    /* ... */
  }
}

class ReportService {
  generate() {
    /* ... */
  }
  export() {
    /* ... */
  }
}
```

### 2. Bajo Acoplamiento

> _"Los componentes deben depender de abstracciones, no de implementaciones concretas."_

```javascript
// ❌ ALTO ACOPLAMIENTO - Dependencia directa
class OrderService {
  constructor() {
    // Dependencia hardcodeada
    this.emailService = new GmailEmailService();
    this.paymentService = new StripePaymentService();
  }

  async processOrder(order) {
    await this.paymentService.charge(order.total);
    await this.emailService.sendConfirmation(order);
  }
}

// ✅ BAJO ACOPLAMIENTO - Inyección de dependencias
class OrderService {
  #emailService;
  #paymentService;

  constructor(emailService, paymentService) {
    // Dependencias inyectadas (pueden ser cualquier implementación)
    this.#emailService = emailService;
    this.#paymentService = paymentService;
  }

  async processOrder(order) {
    await this.#paymentService.charge(order.total);
    await this.#emailService.sendConfirmation(order);
  }
}

// Uso: puedo cambiar implementaciones sin modificar OrderService
const orderService = new OrderService(
  new SendGridEmailService(), // Cambié de Gmail a SendGrid
  new PayPalPaymentService(), // Cambié de Stripe a PayPal
);
```

### 3. Principio de Segregación de Interfaces

> _"Los clientes no deben depender de interfaces que no usan."_

```javascript
// ❌ Interfaz monolítica - Cliente debe conocer todo
const fullUserService = {
  create: () => {},
  update: () => {},
  delete: () => {},
  findById: () => {},
  findAll: () => {},
  exportToCSV: () => {},
  importFromCSV: () => {},
  generateReport: () => {},
  sendWelcomeEmail: () => {},
};

// ✅ Interfaces segregadas - Cliente usa solo lo que necesita
const readOnlyUserService = {
  findById: () => {},
  findAll: () => {},
};

const writeUserService = {
  create: () => {},
  update: () => {},
  delete: () => {},
};

const userExportService = {
  exportToCSV: () => {},
  importFromCSV: () => {},
};
```

### 4. Principio de Inversión de Dependencias

> _"Depende de abstracciones, no de concreciones."_

```javascript
// ✅ Definir interfaz abstracta
const DataRepository = {
  findAll: async () => {},
  findById: async (id) => {},
  create: async (data) => {},
  update: async (id, data) => {},
  delete: async (id) => {},
};

// Implementación concreta 1: En memoria
class InMemoryRepository {
  #data = [];

  async findAll() {
    return [...this.#data];
  }

  async findById(id) {
    return this.#data.find((item) => item.id === id) ?? null;
  }

  async create(data) {
    const newItem = { ...data, id: Date.now() };
    this.#data.push(newItem);
    return newItem;
  }

  async update(id, data) {
    const index = this.#data.findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.#data[index] = { ...this.#data[index], ...data };
    return this.#data[index];
  }

  async delete(id) {
    const index = this.#data.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.#data.splice(index, 1);
    return true;
  }
}

// Implementación concreta 2: PostgreSQL
class PostgresRepository {
  #pool;
  #tableName;

  constructor(pool, tableName) {
    this.#pool = pool;
    this.#tableName = tableName;
  }

  async findAll() {
    const result = await this.#pool.query(`SELECT * FROM ${this.#tableName}`);
    return result.rows;
  }

  async findById(id) {
    const result = await this.#pool.query(
      `SELECT * FROM ${this.#tableName} WHERE id = $1`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  // ... resto de métodos
}

// El servicio depende de la abstracción, no de la implementación
class ProductService {
  #repository;

  constructor(repository) {
    this.#repository = repository;
  }

  async getAllProducts() {
    return this.#repository.findAll();
  }
}

// En desarrollo: usa memoria
const devService = new ProductService(new InMemoryRepository());

// En producción: usa PostgreSQL
const prodService = new ProductService(
  new PostgresRepository(pool, 'products'),
);
```

---

## 🏗️ Patrones de Composición de Componentes

### 1. Composición por Agregación

Un componente contiene referencias a otros componentes.

```javascript
class OrderProcessor {
  #inventoryService;
  #paymentService;
  #shippingService;
  #notificationService;

  constructor(inventory, payment, shipping, notification) {
    this.#inventoryService = inventory;
    this.#paymentService = payment;
    this.#shippingService = shipping;
    this.#notificationService = notification;
  }

  async processOrder(order) {
    // 1. Verificar inventario
    const available = await this.#inventoryService.checkAvailability(
      order.items,
    );
    if (!available) {
      throw new Error('Productos no disponibles');
    }

    // 2. Procesar pago
    const payment = await this.#paymentService.charge(
      order.total,
      order.paymentMethod,
    );

    // 3. Reservar inventario
    await this.#inventoryService.reserve(order.items);

    // 4. Crear envío
    const shipping = await this.#shippingService.createShipment(order);

    // 5. Notificar al cliente
    await this.#notificationService.sendOrderConfirmation(order, shipping);

    return { order, payment, shipping };
  }
}
```

### 2. Composición por Plugins

Componentes que extienden funcionalidad mediante plugins.

```javascript
class ValidationEngine {
  #validators = new Map();

  // Registrar validadores como plugins
  registerValidator(name, validator) {
    this.#validators.set(name, validator);
    return this; // Permite encadenamiento
  }

  async validate(data, rules) {
    const errors = [];

    for (const [field, validatorNames] of Object.entries(rules)) {
      for (const validatorName of validatorNames) {
        const validator = this.#validators.get(validatorName);

        if (!validator) {
          throw new Error(`Validador "${validatorName}" no registrado`);
        }

        const result = await validator(data[field], field, data);
        if (!result.valid) {
          errors.push({ field, message: result.message });
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }
}

// Validadores como plugins
const requiredValidator = (value, field) => ({
  valid: value !== undefined && value !== null && value !== '',
  message: `${field} es requerido`,
});

const emailValidator = (value) => ({
  valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  message: 'Email inválido',
});

const minLengthValidator = (min) => (value, field) => ({
  valid: value?.length >= min,
  message: `${field} debe tener al menos ${min} caracteres`,
});

// Uso
const engine = new ValidationEngine()
  .registerValidator('required', requiredValidator)
  .registerValidator('email', emailValidator)
  .registerValidator('minLength:3', minLengthValidator(3))
  .registerValidator('minLength:8', minLengthValidator(8));

const result = await engine.validate(
  { name: 'Ana', email: 'ana@test.com', password: '123' },
  {
    name: ['required', 'minLength:3'],
    email: ['required', 'email'],
    password: ['required', 'minLength:8'],
  },
);
// { valid: false, errors: [{ field: 'password', message: '...' }] }
```

---

## 📊 Diagrama de Referencia

![Componentes e Interfaces](../0-assets/01-componentes-interfaces.svg)

---

## 🎯 Resumen

| Concepto              | Definición                                 |
| --------------------- | ------------------------------------------ |
| **Componente**        | Unidad modular, reemplazable y desplegable |
| **Interfaz**          | Contrato público del componente            |
| **Contrato**          | Especificación de pre/post condiciones     |
| **Alta cohesión**     | Un componente, una responsabilidad         |
| **Bajo acoplamiento** | Depender de abstracciones                  |
| **ISP**               | Interfaces específicas para clientes       |
| **DIP**               | Invertir dependencias hacia abstracciones  |

---

## 📚 Referencias

- Martin, R. C. (2017). _Clean Architecture_. Capítulo 13: Component Cohesion
- Bass, L. et al. (2021). _Software Architecture in Practice_. Capítulo 7
- Fowler, M. (2002). _Patterns of Enterprise Application Architecture_

---

[⬅️ Volver al README](../README.md) | [➡️ Siguiente: Comunicación Síncrona vs Asíncrona](02-comunicacion-sincrona-asincrona.md)
