# 🔗 Cohesión y Acoplamiento

## 🎯 Objetivos de Aprendizaje

Al finalizar esta sección, serás capaz de:

- ✅ Diferenciar cohesión y acoplamiento
- ✅ Identificar tipos de cohesión y acoplamiento en código
- ✅ Medir la calidad del diseño usando estas métricas
- ✅ Refactorizar para mejorar cohesión y reducir acoplamiento

---

## 📖 Cohesión: El Pegamento del Buen Diseño

### 🎯 ¿Qué es la Cohesión?

La **cohesión** es el grado en que los elementos dentro de un módulo (clase, función, archivo) están relacionados entre sí.

> **Alta cohesión** = Los elementos están fuertemente relacionados y trabajan juntos hacia un propósito común

> **Baja cohesión** = Los elementos no están relacionados, el módulo hace cosas inconexas

### 🚀 ¿Para qué sirve?

La alta cohesión sirve para:

1. **Comprensión más fácil**: El módulo tiene un propósito claro
2. **Mantenimiento más simple**: Cambios están localizados
3. **Reutilización efectiva**: Módulos enfocados son más reutilizables
4. **Menor complejidad**: Cada módulo hace una cosa bien

### 💥 ¿Qué impacto tiene?

**Alta cohesión:**

- ✅ Módulos **fáciles de entender**
- ✅ Cambios **predecibles y seguros**
- ✅ Código **reutilizable**
- ✅ Tests **simples y directos**

**Baja cohesión:**

- ❌ Módulos **confusos** ("hace muchas cosas no relacionadas")
- ❌ Cambios **impredecibles** (efectos secundarios)
- ❌ Difícil **reutilizar** (trae funcionalidad no deseada)
- ❌ Tests **complejos** (mockear muchas dependencias)

---

## 📊 Tipos de Cohesión (De Mejor a Peor)

### 1. Cohesión Funcional ⭐⭐⭐⭐⭐ (MEJOR)

**Definición**: Todos los elementos contribuyen a una única función bien definida.

**Ejemplo**:

```javascript
// ✅ ALTA COHESIÓN FUNCIONAL
// Todo contribuye a calcular el salario total
class SalaryCalculator {
  calculateBaseSalary(hours, hourlyRate) {
    return hours * hourlyRate;
  }

  calculateOvertime(overtimeHours, overtimeRate) {
    return overtimeHours * overtimeRate;
  }

  calculateBonus(performance) {
    const bonusRates = { excellent: 0.2, good: 0.1, average: 0 };
    return bonusRates[performance] || 0;
  }

  calculateTotalSalary(
    hours,
    hourlyRate,
    overtimeHours,
    overtimeRate,
    performance,
  ) {
    const base = this.calculateBaseSalary(hours, hourlyRate);
    const overtime = this.calculateOvertime(overtimeHours, overtimeRate);
    const basePlusOvertime = base + overtime;
    const bonus = this.calculateBonus(performance) * basePlusOvertime;

    return basePlusOvertime + bonus;
  }
}

// Todo método contribuye al cálculo de salario
// Propósito único y claro
```

### 2. Cohesión Secuencial ⭐⭐⭐⭐

**Definición**: La salida de una operación es entrada de la siguiente.

**Ejemplo**:

```javascript
// ✅ COHESIÓN SECUENCIAL
// Proceso de validación y creación de usuario
class UserRegistrationPipeline {
  validateEmail(email) {
    if (!email.includes('@')) {
      throw new Error('Email inválido');
    }
    return email.toLowerCase();
  }

  hashPassword(password) {
    // La salida de validateEmail podría usarse aquí
    return bcrypt.hashSync(password, 10);
  }

  createUser(email, password) {
    const validatedEmail = this.validateEmail(email);
    const hashedPassword = this.hashPassword(password);

    return {
      email: validatedEmail,
      password: hashedPassword,
      createdAt: new Date(),
    };
  }
}

// Cada método prepara datos para el siguiente
```

### 3. Cohesión Comunicacional ⭐⭐⭐

**Definición**: Operan sobre el mismo conjunto de datos.

**Ejemplo**:

```javascript
// ✅ COHESIÓN COMUNICACIONAL
// Operan sobre el mismo objeto Order
class OrderProcessor {
  constructor(order) {
    this.order = order;
  }

  calculateTotal() {
    return this.order.items.reduce((sum, item) => sum + item.price, 0);
  }

  applyDiscount() {
    const total = this.calculateTotal();
    this.order.discount = total > 1000 ? total * 0.1 : 0;
  }

  generateInvoice() {
    const total = this.calculateTotal();
    return {
      orderId: this.order.id,
      total: total - this.order.discount,
      date: new Date(),
    };
  }
}

// Todos los métodos trabajan con el mismo objeto order
```

### 4. Cohesión Procedural ⭐⭐

**Definición**: Operaciones siguen una secuencia específica.

**Ejemplo**:

```javascript
// ⚠️ COHESIÓN PROCEDURAL (Aceptable pero no ideal)
class FileProcessor {
  openFile(path) {
    console.log(`Abriendo archivo: ${path}`);
    return { path, content: '' };
  }

  readFile(file) {
    console.log('Leyendo contenido...');
    file.content = 'Contenido del archivo';
    return file;
  }

  closeFile(file) {
    console.log('Cerrando archivo');
    file.content = null;
  }

  processFile(path) {
    const file = this.openFile(path);
    this.readFile(file);
    this.closeFile(file);
  }
}

// Relacionados por secuencia, no por función común
```

### 5. Cohesión Temporal ⭐

**Definición**: Ejecutadas al mismo tiempo (ej: inicialización).

**Ejemplo**:

```javascript
// ⚠️ COHESIÓN TEMPORAL (Débil)
class SystemInitializer {
  initialize() {
    this.connectDatabase();
    this.loadConfiguration();
    this.startLogger();
    this.initializeCache();
  }

  connectDatabase() {
    console.log('BD conectada');
  }

  loadConfiguration() {
    console.log('Config cargada');
  }

  startLogger() {
    console.log('Logger iniciado');
  }

  initializeCache() {
    console.log('Cache inicializado');
  }
}

// Relacionados solo porque se ejecutan al inicio
// No hay relación funcional real
```

### 6. Cohesión Lógica ❌

**Definición**: Operaciones similares agrupadas, pero no relacionadas.

**Ejemplo**:

```javascript
// ❌ COHESIÓN LÓGICA (MALO)
class Utilities {
  // Validación de email
  validateEmail(email) {
    return email.includes('@');
  }

  // Cálculo matemático
  calculatePercentage(value, total) {
    return (value / total) * 100;
  }

  // Formateo de fecha
  formatDate(date) {
    return date.toISOString();
  }

  // ❌ No relacionadas funcionalmente
  // Solo agrupadas porque son "utilidades"
}
```

### 7. Cohesión Coincidental ❌❌ (PEOR)

**Definición**: Sin relación aparente, agrupadas arbitrariamente.

**Ejemplo**:

```javascript
// ❌❌ COHESIÓN COINCIDENTAL (MUY MALO)
class Miscellaneous {
  sendEmail(to, subject) {
    console.log(`Email enviado a ${to}`);
  }

  calculateTax(amount) {
    return amount * 0.16;
  }

  drawCircle(x, y, radius) {
    console.log(`Círculo en (${x},${y}) radio ${radius}`);
  }

  connectToDatabase() {
    console.log('Conectando a BD...');
  }

  // ❌ Completamente no relacionadas
  // "God Class" o "Junk Drawer"
}
```

---

## 🔗 Acoplamiento: Las Cadenas del Mal Diseño

### 🎯 ¿Qué es el Acoplamiento?

El **acoplamiento** es el grado de interdependencia entre módulos.

> **Bajo acoplamiento** = Módulos independientes, cambios localizados

> **Alto acoplamiento** = Módulos muy dependientes, cambios en cascada

### 🚀 ¿Para qué sirve reducir el acoplamiento?

1. **Cambios seguros**: Modificar un módulo no rompe otros
2. **Reutilización fácil**: Módulos independientes se reutilizan mejor
3. **Testing simple**: Módulos se prueban aisladamente
4. **Mantenimiento predecible**: Menor efecto dominó

### 💥 ¿Qué impacto tiene?

**Bajo acoplamiento:**

- ✅ Cambios **localizados y seguros**
- ✅ Módulos **reutilizables**
- ✅ Tests **independientes**
- ✅ Sistema **modular y flexible**

**Alto acoplamiento:**

- ❌ Cambios **en cascada** (efecto dominó)
- ❌ Difícil **reutilizar** (dependencias múltiples)
- ❌ Tests **complejos** (muchos mocks)
- ❌ Sistema **frágil y rígido**

---

## 📊 Tipos de Acoplamiento (De Mejor a Peor)

### 1. Acoplamiento de Datos ⭐⭐⭐⭐⭐ (MEJOR)

**Definición**: Módulos se comunican solo con datos primitivos.

**Ejemplo**:

```javascript
// ✅ BAJO ACOPLAMIENTO - Solo datos
class TaxCalculator {
  calculate(amount) {
    return amount * 0.16; // Solo recibe un número
  }
}

class OrderService {
  constructor(taxCalculator) {
    this.taxCalculator = taxCalculator;
  }

  calculateTotal(orderAmount) {
    const tax = this.taxCalculator.calculate(orderAmount);
    return orderAmount + tax;
  }
}

// TaxCalculator no conoce OrderService
// Comunicación solo con números (datos)
```

### 2. Acoplamiento de Estampa ⭐⭐⭐⭐

**Definición**: Módulos pasan estructuras de datos completas.

**Ejemplo**:

```javascript
// ✅ ACOPLAMIENTO DE ESTAMPA
class ShippingCalculator {
  calculate(order) {
    // Usa solo algunas propiedades de order
    const { weight, distance } = order;
    return weight * distance * 0.5;
  }
}

const order = {
  id: 1,
  items: [],
  weight: 10,
  distance: 100,
  customer: {},
};

const calculator = new ShippingCalculator();
calculator.calculate(order); // Pasa objeto completo
```

### 3. Acoplamiento de Control ⭐⭐⭐

**Definición**: Un módulo controla el flujo de otro pasando flags.

**Ejemplo**:

```javascript
// ⚠️ ACOPLAMIENTO DE CONTROL
class ReportGenerator {
  generate(type) {
    if (type === 'PDF') {
      this.generatePDF();
    } else if (type === 'EXCEL') {
      this.generateExcel();
    } else {
      this.generateHTML();
    }
  }

  generatePDF() {
    /* ... */
  }
  generateExcel() {
    /* ... */
  }
  generateHTML() {
    /* ... */
  }
}

// Mejor: Strategy Pattern (visto en OCP)
```

### 4. Acoplamiento Común ⭐⭐

**Definición**: Módulos comparten datos globales.

**Ejemplo**:

```javascript
// ❌ ACOPLAMIENTO COMÚN (Malo)
// Variable global compartida
let globalConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

class UserService {
  getUsers() {
    // Depende de variable global
    fetch(globalConfig.apiUrl + '/users');
  }
}

class ProductService {
  getProducts() {
    // También depende de variable global
    fetch(globalConfig.apiUrl + '/products');
  }
}

// Cambiar globalConfig afecta ambos módulos
// Alto acoplamiento

// ✅ MEJOR: Inyección de dependencias
class UserService {
  constructor(config) {
    this.config = config;
  }

  getUsers() {
    fetch(this.config.apiUrl + '/users');
  }
}
```

### 5. Acoplamiento de Contenido ❌❌ (PEOR)

**Definición**: Un módulo modifica directamente el contenido interno de otro.

**Ejemplo**:

```javascript
// ❌❌ ACOPLAMIENTO DE CONTENIDO (MUY MALO)
class User {
  constructor(name) {
    this.name = name;
    this.status = 'active';
  }
}

class AdminService {
  banUser(user) {
    // ❌ Modifica directamente propiedades internas
    user.status = 'banned';
    user.bannedAt = new Date();
    user.bannedBy = 'admin';
  }
}

// ✅ MEJOR: Método en la propia clase
class User {
  constructor(name) {
    this.name = name;
    this.status = 'active';
  }

  ban(adminId) {
    this.status = 'banned';
    this.bannedAt = new Date();
    this.bannedBy = adminId;
  }
}

class AdminService {
  banUser(user, adminId) {
    user.ban(adminId); // ✅ Usa método público
  }
}
```

---

## 📏 Métricas de Cohesión y Acoplamiento

### Métrica LCOM (Lack of Cohesion in Methods)

Mide la cohesión de una clase:

- **LCOM = 0**: Alta cohesión (todos los métodos usan todos los atributos)
- **LCOM > 0**: Baja cohesión (métodos independientes)

**Ejemplo**:

```javascript
// ❌ LCOM Alto (Baja cohesión)
class UserManager {
  constructor() {
    this.name = '';
    this.email = '';
    this.orderTotal = 0;
  }

  // Usa name y email
  updateProfile(name, email) {
    this.name = name;
    this.email = email;
  }

  // Usa solo orderTotal (no relacionado)
  calculateDiscount() {
    return this.orderTotal > 1000 ? 0.1 : 0;
  }
}

// ✅ LCOM Bajo (Alta cohesión) - Dividir en 2 clases
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  updateProfile(name, email) {
    this.name = name;
    this.email = email;
  }
}

class OrderCalculator {
  constructor(orderTotal) {
    this.orderTotal = orderTotal;
  }

  calculateDiscount() {
    return this.orderTotal > 1000 ? 0.1 : 0;
  }
}
```

### Métrica de Acoplamiento Aferente (Ca)

**Ca**: Número de clases que dependen de esta clase

- **Ca alto**: Clase muy usada (responsabilidad)
- **Ca bajo**: Clase poco usada (posible candidato a eliminar)

### Métrica de Acoplamiento Eferente (Ce)

**Ce**: Número de clases de las que esta clase depende

- **Ce alto**: Clase muy dependiente (frágil)
- **Ce bajo**: Clase independiente (estable)

### Inestabilidad (I)

**I = Ce / (Ca + Ce)**

- **I = 0**: Máximamente estable (solo otros dependen de ella)
- **I = 1**: Máximamente inestable (depende de muchos)

**Ideal**: Clases de alto nivel con I bajo, clases de bajo nivel con I alto

---

## 🎯 Principios para Mejorar Cohesión y Reducir Acoplamiento

### 1. Single Responsibility Principle (SRP)

**Problema**: Baja cohesión (clase hace muchas cosas)
**Solución**: Dividir en clases con responsabilidad única

### 2. Dependency Inversion Principle (DIP)

**Problema**: Alto acoplamiento (depende de concreciones)
**Solución**: Depender de abstracciones

### 3. Law of Demeter (Principio del Mínimo Conocimiento)

> **"Habla solo con tus amigos inmediatos"**

**Ejemplo**:

```javascript
// ❌ VIOLACIÓN - Muchas dependencias encadenadas
class OrderService {
  processOrder(order) {
    const city = order.customer.address.city; // ❌ Train wreck
    const shipping = order.items[0].product.supplier.shippingCost; // ❌
  }
}

// ✅ CUMPLE - Solo conoce al objeto directo
class OrderService {
  processOrder(order) {
    const city = order.getCustomerCity(); // ✅
    const shipping = order.getTotalShipping(); // ✅
  }
}

class Order {
  getCustomerCity() {
    return this.customer.getCity();
  }

  getTotalShipping() {
    return this.items.reduce((sum, item) => sum + item.getShipping(), 0);
  }
}
```

---

## 🔄 Refactorización: Mejorar Cohesión y Reducir Acoplamiento

### Técnica 1: Extract Class

**Cuándo**: Baja cohesión (clase hace muchas cosas)

**Antes**:

```javascript
// ❌ Baja cohesión
class Employee {
  constructor(name, email, salary, department) {
    this.name = name;
    this.email = email;
    this.salary = salary;
    this.department = department;
  }

  calculateBonus() {
    return this.salary * 0.1;
  }

  sendEmail(message) {
    console.log(`Email a ${this.email}: ${message}`);
  }
}
```

**Después**:

```javascript
// ✅ Alta cohesión
class Employee {
  constructor(name, contactInfo, compensation) {
    this.name = name;
    this.contactInfo = contactInfo;
    this.compensation = compensation;
  }
}

class ContactInfo {
  constructor(email) {
    this.email = email;
  }

  sendEmail(message) {
    console.log(`Email a ${this.email}: ${message}`);
  }
}

class Compensation {
  constructor(salary, department) {
    this.salary = salary;
    this.department = department;
  }

  calculateBonus() {
    return this.salary * 0.1;
  }
}
```

### Técnica 2: Introduce Parameter Object

**Cuándo**: Alto acoplamiento (pasa muchos parámetros)

**Antes**:

```javascript
// ❌ Acoplamiento de parámetros
function createUser(name, email, phone, address, city, country, zipCode) {
  // ...
}
```

**Después**:

```javascript
// ✅ Menor acoplamiento
class UserData {
  constructor(name, email, contactInfo, address) {
    this.name = name;
    this.email = email;
    this.contactInfo = contactInfo;
    this.address = address;
  }
}

function createUser(userData) {
  // ...
}
```

---

## ✅ Checklist: ¿Mi Código Tiene Buena Cohesión y Bajo Acoplamiento?

### Cohesión:

- [ ] Puedo describir la responsabilidad de cada clase en una frase
- [ ] Todos los métodos de la clase están relacionados
- [ ] Los atributos de la clase son usados por la mayoría de métodos
- [ ] No tengo métodos que no usen ningún atributo

### Acoplamiento:

- [ ] Mis clases no conocen detalles internos de otras clases
- [ ] Uso interfaces/abstracciones en lugar de concreciones
- [ ] No tengo cadenas largas de llamadas (`a.b.c.d.e()`)
- [ ] Puedo testear cada clase independientemente
- [ ] Cambiar una clase no requiere cambiar muchas otras

---

**Bootcamp de Arquitectura de Software**
_SENA - Week 02 - Cohesión y Acoplamiento_

_"Alta cohesión y bajo acoplamiento: el santo grial del diseño de software"_ 🔗
