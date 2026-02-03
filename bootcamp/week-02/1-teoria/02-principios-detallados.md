# 🏗️ Los 5 Principios SOLID Explicados

## 🎯 Objetivos de Aprendizaje

Al finalizar esta sección, serás capaz de:

- ✅ Explicar cada uno de los 5 principios SOLID con ejemplos propios
- ✅ Identificar violaciones de cada principio en código real
- ✅ Refactorizar código para cumplir con SOLID
- ✅ Aplicar SOLID en diseño de nuevos componentes

---

## 1️⃣ Single Responsibility Principle (SRP)

### 🎯 ¿Qué es?

> **"Una clase debe tener una, y solo una, razón para cambiar"**
> — Robert C. Martin

Una **responsabilidad** es una razón para cambiar. Si una clase tiene múltiples responsabilidades, los cambios en una pueden afectar las otras.

### 🚀 ¿Para qué sirve?

- Clases más pequeñas y enfocadas
- Más fáciles de entender y mantener
- Cambios localizados (menor riesgo de bugs)
- Tests más simples

### 💥 ¿Qué impacto tiene?

**Si aplicas SRP:**

- ✅ Cada clase hace **una cosa y la hace bien**
- ✅ Cambios son **predecibles y seguros**
- ✅ Tests son **simples y rápidos**

**Si violas SRP:**

- ❌ Clases **gigantes y complejas** (God Classes)
- ❌ Cambios tienen **efectos secundarios inesperados**
- ❌ Tests **complicados con muchos mocks**

### ❌ Ejemplo de Violación (JavaScript)

```javascript
/**
 * ❌ VIOLACIÓN DE SRP
 * Esta clase tiene MÚLTIPLES responsabilidades:
 * 1. Validar usuario
 * 2. Guardar en BD
 * 3. Enviar email
 * 4. Generar reporte
 */
class UserManager {
  createUser(userData) {
    // Responsabilidad 1: Validación
    if (!userData.email || !userData.email.includes('@')) {
      throw new Error('Email inválido');
    }

    if (userData.password.length < 8) {
      throw new Error('Contraseña muy corta');
    }

    // Responsabilidad 2: Persistencia en BD
    const user = {
      id: Date.now(),
      ...userData,
      createdAt: new Date(),
    };

    database.users.push(user);

    // Responsabilidad 3: Envío de email
    const emailSubject = 'Bienvenido a nuestra plataforma';
    const emailBody = `Hola ${user.name}, gracias por registrarte...`;

    smtpClient.send({
      to: user.email,
      subject: emailSubject,
      body: emailBody,
    });

    // Responsabilidad 4: Generación de reporte
    logger.info(`Nuevo usuario registrado: ${user.email}`);
    analytics.track('user_registered', {
      userId: user.id,
      email: user.email,
      timestamp: user.createdAt,
    });

    return user;
  }
}

// ⚠️ PROBLEMAS:
// - Si cambias validación, afectas toda la clase
// - Si cambias el formato de email, afectas persistencia
// - Si cambias la BD, afectas el envío de emails
// - Imposible testear validación sin mockear BD y email
```

### ✅ Solución Aplicando SRP

```javascript
/**
 * ✅ APLICANDO SRP
 * Cada clase tiene UNA responsabilidad
 */

// Responsabilidad 1: Validación
class UserValidator {
  validate(userData) {
    const errors = [];

    if (!userData.email || !userData.email.includes('@')) {
      errors.push('Email inválido');
    }

    if (!userData.password || userData.password.length < 8) {
      errors.push('Contraseña debe tener al menos 8 caracteres');
    }

    if (!userData.name || userData.name.trim().length === 0) {
      errors.push('Nombre es requerido');
    }

    if (errors.length > 0) {
      throw new Error(`Errores de validación: ${errors.join(', ')}`);
    }

    return true;
  }
}

// Responsabilidad 2: Persistencia
class UserRepository {
  save(user) {
    const userToSave = {
      id: Date.now(),
      ...user,
      createdAt: new Date().toISOString(),
    };

    database.users.push(userToSave);
    return userToSave;
  }

  findByEmail(email) {
    return database.users.find((u) => u.email === email);
  }
}

// Responsabilidad 3: Notificaciones
class EmailService {
  sendWelcomeEmail(user) {
    const subject = 'Bienvenido a nuestra plataforma';
    const body = `Hola ${user.name}, gracias por registrarte...`;

    return smtpClient.send({
      to: user.email,
      subject,
      body,
    });
  }
}

// Responsabilidad 4: Analytics
class AnalyticsService {
  trackUserRegistration(user) {
    logger.info(`Nuevo usuario registrado: ${user.email}`);

    analytics.track('user_registered', {
      userId: user.id,
      email: user.email,
      timestamp: user.createdAt,
    });
  }
}

// Orquestador (caso de uso)
class CreateUserUseCase {
  constructor(validator, repository, emailService, analyticsService) {
    this.validator = validator;
    this.repository = repository;
    this.emailService = emailService;
    this.analyticsService = analyticsService;
  }

  async execute(userData) {
    // 1. Validar
    this.validator.validate(userData);

    // 2. Guardar
    const user = this.repository.save(userData);

    // 3. Notificar
    await this.emailService.sendWelcomeEmail(user);

    // 4. Rastrear
    this.analyticsService.trackUserRegistration(user);

    return user;
  }
}

// ✅ BENEFICIOS:
// - Cada clase hace UNA cosa
// - Fácil de testear (mockear solo lo necesario)
// - Cambiar email no afecta validación
// - Cambiar BD no afecta analytics
// - Reutilizable (UserValidator en otros contextos)
```

---

## 2️⃣ Open/Closed Principle (OCP)

### 🎯 ¿Qué es?

> **"Las entidades de software deben estar abiertas para extensión, pero cerradas para modificación"**
> — Bertrand Meyer

**Abierto para extensión**: Puedes agregar nuevas funcionalidades

**Cerrado para modificación**: Sin cambiar el código existente

### 🚀 ¿Para qué sirve?

- Agregar funcionalidades sin riesgo de romper lo existente
- Código más estable y predecible
- Despliegues más seguros

### 💥 ¿Qué impacto tiene?

**Si aplicas OCP:**

- ✅ Nuevas funcionalidades **sin modificar código probado**
- ✅ Menor riesgo de **regresiones**
- ✅ Sistema **extensible y flexible**

**Si violas OCP:**

- ❌ Cada nueva funcionalidad **modifica clases existentes**
- ❌ Alto riesgo de **romper funcionalidad probada**
- ❌ Tests existentes **pueden fallar**

### ❌ Ejemplo de Violación

```javascript
/**
 * ❌ VIOLACIÓN DE OCP
 * Para agregar nuevo tipo de descuento, hay que MODIFICAR esta clase
 */
class DiscountCalculator {
  calculateDiscount(order, discountType) {
    if (discountType === 'PERCENTAGE') {
      return order.total * 0.1; // 10% descuento
    }

    if (discountType === 'FIXED') {
      return 50; // $50 descuento fijo
    }

    if (discountType === 'SEASONAL') {
      const month = new Date().getMonth();
      return month === 11 ? order.total * 0.2 : order.total * 0.05;
    }

    // ⚠️ Para agregar "BLACK_FRIDAY", hay que MODIFICAR aquí
    // ⚠️ Cada cambio requiere re-testear TODA la clase

    return 0;
  }
}
```

### ✅ Solución Aplicando OCP (Strategy Pattern)

```javascript
/**
 * ✅ APLICANDO OCP
 * Para agregar nuevo descuento, SOLO creamos nueva estrategia
 */

// Abstracción (interface en TypeScript, clase base en JS)
class DiscountStrategy {
  calculate(order) {
    throw new Error('Método calculate debe ser implementado');
  }
}

// Estrategia concreta 1
class PercentageDiscount extends DiscountStrategy {
  constructor(percentage) {
    super();
    this.percentage = percentage;
  }

  calculate(order) {
    return order.total * (this.percentage / 100);
  }
}

// Estrategia concreta 2
class FixedDiscount extends DiscountStrategy {
  constructor(amount) {
    super();
    this.amount = amount;
  }

  calculate(order) {
    return Math.min(this.amount, order.total);
  }
}

// Estrategia concreta 3
class SeasonalDiscount extends DiscountStrategy {
  calculate(order) {
    const month = new Date().getMonth();
    const discountRate = month === 11 ? 0.2 : 0.05;
    return order.total * discountRate;
  }
}

// ✅ NUEVA estrategia SIN modificar código existente
class BlackFridayDiscount extends DiscountStrategy {
  calculate(order) {
    const today = new Date();
    const isBlackFriday = today.getMonth() === 10 && today.getDate() === 24;

    if (!isBlackFriday) {
      return 0;
    }

    // 30% descuento en Black Friday
    return order.total * 0.3;
  }
}

// Calculator que usa estrategias
class DiscountCalculator {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  calculateDiscount(order) {
    return this.strategy.calculate(order);
  }
}

// Uso
const order = { total: 1000 };

const calculator = new DiscountCalculator(new PercentageDiscount(10));
console.log(calculator.calculateDiscount(order)); // 100

calculator.setStrategy(new BlackFridayDiscount());
console.log(calculator.calculateDiscount(order)); // 300 (si es Black Friday)

// ✅ BENEFICIOS:
// - Nueva estrategia sin modificar DiscountCalculator
// - Código existente cerrado a modificación
// - Fácil testear cada estrategia independientemente
```

---

## 3️⃣ Liskov Substitution Principle (LSP)

### 🎯 ¿Qué es?

> **"Los objetos de una clase derivada deben poder sustituir a objetos de la clase base sin alterar el correcto funcionamiento del programa"**
> — Barbara Liskov

Si `S` es subtipo de `T`, entonces objetos de tipo `T` pueden ser reemplazados por objetos de tipo `S` sin romper el programa.

### 🚀 ¿Para qué sirve?

- Herencia correcta y predecible
- Polimorfismo confiable
- Contratos claros entre clases

### 💥 ¿Qué impacto tiene?

**Si aplicas LSP:**

- ✅ Subtipos **funcionan como se espera**
- ✅ Polimorfismo **sin sorpresas**
- ✅ Código **robusto y confiable**

**Si violas LSP:**

- ❌ Subtipos con **comportamiento inesperado**
- ❌ Necesitas **if/else para verificar tipo** (code smell)
- ❌ Bugs **difíciles de rastrear**

### ❌ Ejemplo de Violación

```javascript
/**
 * ❌ VIOLACIÓN DE LSP
 * Square viola el contrato de Rectangle
 */
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  setWidth(width) {
    this.width = width;
  }

  setHeight(height) {
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  constructor(side) {
    super(side, side);
  }

  // ⚠️ VIOLACIÓN: Cambia comportamiento esperado
  setWidth(width) {
    this.width = width;
    this.height = width; // Cambia ambos lados
  }

  setHeight(height) {
    this.width = height; // Cambia ambos lados
    this.height = height;
  }
}

// Prueba que expone la violación
function testRectangle(rectangle) {
  rectangle.setWidth(5);
  rectangle.setHeight(10);

  // Esperamos: área = 50
  console.log(rectangle.getArea());
}

const rect = new Rectangle(0, 0);
testRectangle(rect); // ✅ 50 (correcto)

const square = new Square(0);
testRectangle(square); // ❌ 100 (incorrecto!) - Viola LSP
// Square NO puede sustituir a Rectangle
```

### ✅ Solución Aplicando LSP

```javascript
/**
 * ✅ APLICANDO LSP
 * Eliminar herencia incorrecta
 */

// Opción 1: No heredar (Composition over Inheritance)
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  setWidth(width) {
    this.width = width;
  }

  setHeight(height) {
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Square {
  constructor(side) {
    this.side = side;
  }

  setSide(side) {
    this.side = side;
  }

  getArea() {
    return this.side * this.side;
  }
}

// Opción 2: Abstracción común
class Shape {
  getArea() {
    throw new Error('Método getArea debe ser implementado');
  }
}

class RectangleShape extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class SquareShape extends Shape {
  constructor(side) {
    super();
    this.side = side;
  }

  getArea() {
    return this.side * this.side;
  }
}

// Función polimórfica que cumple LSP
function printArea(shape) {
  console.log(`Área: ${shape.getArea()}`);
}

printArea(new RectangleShape(5, 10)); // ✅ 50
printArea(new SquareShape(7)); // ✅ 49

// ✅ BENEFICIOS:
// - Ambos cumplen el contrato de Shape
// - Polimorfismo confiable
// - Sin comportamientos inesperados
```

---

## 4️⃣ Interface Segregation Principle (ISP)

### 🎯 ¿Qué es?

> **"Los clientes no deberían verse forzados a depender de interfaces que no usan"**
> — Robert C. Martin

Es mejor tener múltiples interfaces específicas que una interface genérica "gorda".

### 🚀 ¿Para qué sirve?

- Interfaces cohesivas y enfocadas
- Evitar dependencias innecesarias
- Clases más simples de implementar

### 💥 ¿Qué impacto tiene?

**Si aplicas ISP:**

- ✅ Interfaces **pequeñas y específicas**
- ✅ Clases **implementan solo lo que necesitan**
- ✅ Cambios **no afectan clientes innecesarios**

**Si violas ISP:**

- ❌ Interfaces **infladas** con métodos irrelevantes
- ❌ Implementaciones **forzadas con métodos vacíos**
- ❌ Clientes dependen de **métodos que no usan**

### ❌ Ejemplo de Violación

```javascript
/**
 * ❌ VIOLACIÓN DE ISP
 * Interface "gorda" obliga a implementar métodos innecesarios
 */
class Worker {
  work() {
    throw new Error('Implementar');
  }

  eat() {
    throw new Error('Implementar');
  }

  sleep() {
    throw new Error('Implementar');
  }
}

class HumanWorker extends Worker {
  work() {
    console.log('👷 Humano trabajando...');
  }

  eat() {
    console.log('🍔 Humano comiendo...');
  }

  sleep() {
    console.log('😴 Humano durmiendo...');
  }
}

class RobotWorker extends Worker {
  work() {
    console.log('🤖 Robot trabajando...');
  }

  // ⚠️ FORZADO a implementar métodos que no usa
  eat() {
    // Robots no comen
    throw new Error('Robots no comen');
  }

  sleep() {
    // Robots no duermen
    throw new Error('Robots no duermen');
  }
}

// Cliente que depende de métodos innecesarios
function manageWorker(worker) {
  worker.work();
  worker.eat(); // ❌ Falla si es Robot
  worker.sleep(); // ❌ Falla si es Robot
}
```

### ✅ Solución Aplicando ISP

```javascript
/**
 * ✅ APLICANDO ISP
 * Interfaces segregadas y específicas
 */

// Interfaces pequeñas y cohesivas
class Workable {
  work() {
    throw new Error('Implementar work()');
  }
}

class Eatable {
  eat() {
    throw new Error('Implementar eat()');
  }
}

class Sleepable {
  sleep() {
    throw new Error('Implementar sleep()');
  }
}

// Humano implementa las 3 interfaces
class HumanWorker extends Workable {
  work() {
    console.log('👷 Humano trabajando...');
  }
}

class HumanEater extends Eatable {
  eat() {
    console.log('🍔 Humano comiendo...');
  }
}

class HumanSleeper extends Sleepable {
  sleep() {
    console.log('😴 Humano durmiendo...');
  }
}

// Robot implementa solo lo que necesita
class RobotWorker extends Workable {
  work() {
    console.log('🤖 Robot trabajando...');
  }

  // ✅ No implementa eat() ni sleep()
}

// Clientes específicos
function manageWork(workable) {
  workable.work(); // ✅ Solo depende de Workable
}

function manageBreak(eatable, sleepable) {
  eatable.eat();
  sleepable.sleep();
  // ✅ Solo para humanos
}

const human = {
  work: new HumanWorker().work,
  eat: new HumanEater().eat,
  sleep: new HumanSleeper().sleep,
};

const robot = new RobotWorker();

manageWork(human); // ✅ Funciona
manageWork(robot); // ✅ Funciona

manageBreak(human, human); // ✅ Solo para humanos
// manageBreak(robot, robot); // ❌ Error de compilación (en TypeScript)

// ✅ BENEFICIOS:
// - Robot no implementa métodos innecesarios
// - Clientes dependen solo de lo que usan
// - Interfaces cohesivas y específicas
```

---

## 5️⃣ Dependency Inversion Principle (DIP)

### 🎯 ¿Qué es?

> **"Módulos de alto nivel no deben depender de módulos de bajo nivel. Ambos deben depender de abstracciones"**
> **"Abstracciones no deben depender de detalles. Detalles deben depender de abstracciones"**
> — Robert C. Martin

**Alto nivel**: Lógica de negocio
**Bajo nivel**: Detalles de implementación (BD, APIs, frameworks)

### 🚀 ¿Para qué sirve?

- Desacoplar lógica de negocio de detalles técnicos
- Facilitar testing (inyectar mocks)
- Cambiar implementaciones sin afectar lógica

### 💥 ¿Qué impacto tiene?

**Si aplicas DIP:**

- ✅ Lógica de negocio **independiente de detalles**
- ✅ Fácil **cambiar BD o API**
- ✅ Testing **simple con mocks**

**Si violas DIP:**

- ❌ Lógica **acoplada a detalles técnicos**
- ❌ Cambiar BD **requiere cambiar toda la lógica**
- ❌ Testing **complicado** (dependencias concretas)

### ❌ Ejemplo de Violación

```javascript
/**
 * ❌ VIOLACIÓN DE DIP
 * Lógica de negocio depende de implementación concreta (MySQL)
 */
class MySQLDatabase {
  connect() {
    console.log('Conectando a MySQL...');
  }

  query(sql) {
    console.log(`Ejecutando query MySQL: ${sql}`);
    return [{ id: 1, name: 'Usuario' }];
  }
}

// ⚠️ Alto nivel depende de bajo nivel (MySQL)
class UserService {
  constructor() {
    this.database = new MySQLDatabase(); // ❌ Dependencia concreta
  }

  getUsers() {
    this.database.connect();
    return this.database.query('SELECT * FROM users');
  }
}

// Problemas:
// - No puedes testear UserService sin MySQL
// - No puedes cambiar a PostgreSQL sin modificar UserService
// - Alto acoplamiento
```

### ✅ Solución Aplicando DIP

```javascript
/**
 * ✅ APLICANDO DIP
 * Depender de abstracciones, no de concreciones
 */

// Abstracción (interface)
class Database {
  connect() {
    throw new Error('Implementar connect()');
  }

  query(sql) {
    throw new Error('Implementar query()');
  }
}

// Detalle: Implementación MySQL
class MySQLDatabase extends Database {
  connect() {
    console.log('✅ Conectando a MySQL...');
  }

  query(sql) {
    console.log(`🔍 Query MySQL: ${sql}`);
    return [{ id: 1, name: 'Usuario MySQL' }];
  }
}

// Detalle: Implementación PostgreSQL
class PostgreSQLDatabase extends Database {
  connect() {
    console.log('✅ Conectando a PostgreSQL...');
  }

  query(sql) {
    console.log(`🔍 Query PostgreSQL: ${sql}`);
    return [{ id: 1, name: 'Usuario PostgreSQL' }];
  }
}

// Detalle: Mock para testing
class MockDatabase extends Database {
  connect() {
    console.log('✅ Mock DB conectada');
  }

  query(sql) {
    return [{ id: 999, name: 'Usuario Mock' }];
  }
}

// ✅ Alto nivel depende de abstracción
class UserService {
  constructor(database) {
    this.database = database; // ✅ Inyección de dependencia
  }

  getUsers() {
    this.database.connect();
    return this.database.query('SELECT * FROM users');
  }
}

// Uso en producción
const mysqlDb = new MySQLDatabase();
const userService1 = new UserService(mysqlDb);
console.log(userService1.getUsers());

// Cambiar a PostgreSQL sin modificar UserService
const postgresDb = new PostgreSQLDatabase();
const userService2 = new UserService(postgresDb);
console.log(userService2.getUsers());

// Testing con mock
const mockDb = new MockDatabase();
const userServiceTest = new UserService(mockDb);
console.log(userServiceTest.getUsers());

// ✅ BENEFICIOS:
// - UserService desacoplado de implementación
// - Fácil cambiar BD
// - Testing simple con mocks
// - Cumple DIP: ambos dependen de abstracción Database
```

---

## 🎯 Resumen de los 5 Principios

| Principio | Pregunta Clave                                 | Solución                         |
| --------- | ---------------------------------------------- | -------------------------------- |
| **SRP**   | ¿Esta clase hace una sola cosa?                | Dividir responsabilidades        |
| **OCP**   | ¿Puedo extender sin modificar?                 | Usar abstracciones y estrategias |
| **LSP**   | ¿Subtipo sustituye correctamente al tipo base? | Herencia correcta o composición  |
| **ISP**   | ¿Implemento métodos que no uso?                | Interfaces segregadas            |
| **DIP**   | ¿Dependo de abstracciones o concreciones?      | Inyección de dependencias        |

---

## ✅ Checklist de Aplicación

Antes de considerar que tu código cumple SOLID:

### SRP:

- [ ] Cada clase tiene una sola razón para cambiar
- [ ] Puedes describir la responsabilidad en una frase

### OCP:

- [ ] Puedes agregar nuevas funcionalidades sin modificar código existente
- [ ] Usas abstracciones (interfaces, clases base)

### LSP:

- [ ] Los subtipos funcionan correctamente en lugar del tipo base
- [ ] No necesitas `if (tipo === 'X')` para verificar tipo

### ISP:

- [ ] Tus interfaces tienen < 5 métodos relacionados
- [ ] No implementas métodos vacíos o que lanzan errores

### DIP:

- [ ] Lógica de negocio depende de abstracciones
- [ ] Inyectas dependencias (constructor o setter)
- [ ] Puedes testear con mocks fácilmente

---

**Bootcamp de Arquitectura de Software**
_SENA - Week 02 - Los 5 Principios SOLID_

_"SOLID transforma código frágil en código robusto"_ 🏗️
