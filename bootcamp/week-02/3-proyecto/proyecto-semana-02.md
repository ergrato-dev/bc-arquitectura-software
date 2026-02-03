# 🚀 Proyecto Integrador Semana 02: Sistema de Gestión de Biblioteca

## 🎯 Objetivo

Aplicar **todos los principios SOLID** en un proyecto completo y funcional que simule un sistema real de gestión de biblioteca digital (similar a Kindle, Scribd).

---

## 📋 Descripción del Proyecto

Desarrollarás **BiblioTech**, un sistema de gestión de biblioteca que permite:

- Registro y autenticación de usuarios
- Catálogo de libros (físicos y digitales)
- Préstamos y devoluciones
- Notificaciones multicanal
- Reportes de actividad
- Múltiples formas de almacenamiento

---

## 🎯 Principios SOLID a Aplicar

| Principio | Aplicación en el Proyecto                               |
| --------- | ------------------------------------------------------- |
| **SRP**   | Cada clase tiene una responsabilidad única              |
| **OCP**   | Extensible para nuevos tipos de libros y notificaciones |
| **LSP**   | Subtipos de libros sustituibles                         |
| **ISP**   | Interfaces segregadas para usuarios y libros            |
| **DIP**   | Repositorios abstraídos de implementación concreta      |

---

## 📦 Estructura del Proyecto

```
week-02/3-proyecto/bibliotech/
├── package.json
├── README.md
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── user.js
│   │   │   ├── book.js
│   │   │   ├── physical-book.js
│   │   │   ├── digital-book.js
│   │   │   └── loan.js
│   │   └── interfaces/
│   │       ├── repository.js
│   │       ├── notification-channel.js
│   │       └── searchable.js
│   ├── repositories/
│   │   ├── memory-repository.js
│   │   └── json-repository.js
│   ├── services/
│   │   ├── user-service.js
│   │   ├── catalog-service.js
│   │   ├── loan-service.js
│   │   └── notification-service.js
│   ├── notifications/
│   │   ├── email-channel.js
│   │   └── sms-channel.js
│   ├── validators/
│   │   ├── user-validator.js
│   │   └── loan-validator.js
│   └── index.js
└── tests/
    └── loan-service.test.js
```

---

## 💻 Implementación

### Paso 1: Dominio (Entidades e Interfaces)

```javascript
// src/domain/entities/book.js
/**
 * ✅ SRP: Clase base solo define estructura de libro
 * ✅ LSP: Subtipos podrán sustituirla
 */
export class Book {
  constructor(id, title, author, isbn, publishedYear) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.publishedYear = publishedYear;
    this.available = true;
  }

  getInfo() {
    return `${this.title} - ${this.author} (${this.publishedYear})`;
  }

  markAsUnavailable() {
    this.available = false;
  }

  markAsAvailable() {
    this.available = true;
  }
}

// src/domain/entities/physical-book.js
/**
 * ✅ LSP: PhysicalBook puede sustituir a Book
 * ✅ OCP: Extensión sin modificar Book
 */
export class PhysicalBook extends Book {
  constructor(id, title, author, isbn, publishedYear, location, condition) {
    super(id, title, author, isbn, publishedYear);
    this.location = location; // Ej: "Estante A3"
    this.condition = condition; // "Nuevo", "Bueno", "Regular"
  }

  getInfo() {
    return `${super.getInfo()} - Ubicación: ${this.location} (${this.condition})`;
  }
}

// src/domain/entities/digital-book.js
/**
 * ✅ LSP: DigitalBook puede sustituir a Book
 * ✅ OCP: Nueva funcionalidad sin modificar código existente
 */
export class DigitalBook extends Book {
  constructor(id, title, author, isbn, publishedYear, format, fileSize) {
    super(id, title, author, isbn, publishedYear);
    this.format = format; // PDF, EPUB, MOBI
    this.fileSize = fileSize; // MB
  }

  getInfo() {
    return `${super.getInfo()} - Formato: ${this.format} (${this.fileSize}MB)`;
  }

  getDownloadLink() {
    return `https://bibliotech.com/downloads/${this.id}.${this.format.toLowerCase()}`;
  }
}

// src/domain/entities/user.js
/**
 * ✅ SRP: Solo representa un usuario
 */
export class User {
  constructor(id, name, email, membershipType) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.membershipType = membershipType; // "BASIC", "PREMIUM"
    this.activeLoans = [];
  }

  getMaxLoans() {
    return this.membershipType === 'PREMIUM' ? 5 : 2;
  }

  canBorrowMore() {
    return this.activeLoans.length < this.getMaxLoans();
  }

  addLoan(loanId) {
    this.activeLoans.push(loanId);
  }

  removeLoan(loanId) {
    this.activeLoans = this.activeLoans.filter((id) => id !== loanId);
  }
}

// src/domain/entities/loan.js
/**
 * ✅ SRP: Solo representa un préstamo
 */
export class Loan {
  constructor(id, userId, bookId, loanDate, dueDate) {
    this.id = id;
    this.userId = userId;
    this.bookId = bookId;
    this.loanDate = loanDate;
    this.dueDate = dueDate;
    this.returnDate = null;
    this.status = 'ACTIVE'; // ACTIVE, RETURNED, OVERDUE
  }

  isOverdue() {
    if (this.status === 'RETURNED') return false;
    return new Date() > this.dueDate;
  }

  return() {
    this.returnDate = new Date();
    this.status = 'RETURNED';
  }
}
```

---

### Paso 2: Interfaces (Abstracciones)

```javascript
// src/domain/interfaces/repository.js
/**
 * ✅ DIP: Abstracción para cualquier repositorio
 * ✅ ISP: Interfaz específica para CRUD
 */
export class Repository {
  async save(entity) {
    throw new Error('Implementar save()');
  }

  async findById(id) {
    throw new Error('Implementar findById()');
  }

  async findAll() {
    throw new Error('Implementar findAll()');
  }

  async delete(id) {
    throw new Error('Implementar delete()');
  }
}

// src/domain/interfaces/notification-channel.js
/**
 * ✅ DIP: Abstracción para notificaciones
 * ✅ OCP: Abierto para nuevos canales
 */
export class NotificationChannel {
  async send(recipient, message) {
    throw new Error('Implementar send()');
  }

  getName() {
    throw new Error('Implementar getName()');
  }
}
```

---

### Paso 3: Repositorios (Implementaciones)

```javascript
// src/repositories/memory-repository.js
/**
 * ✅ DIP: Implementación concreta de Repository
 * ✅ SRP: Solo maneja almacenamiento en memoria
 */
import { Repository } from '../domain/interfaces/repository.js';

export class MemoryRepository extends Repository {
  #data = new Map();

  async save(entity) {
    this.#data.set(entity.id, entity);
    return entity;
  }

  async findById(id) {
    return this.#data.get(id) || null;
  }

  async findAll() {
    return Array.from(this.#data.values());
  }

  async delete(id) {
    return this.#data.delete(id);
  }

  async find(predicate) {
    const all = await this.findAll();
    return all.filter(predicate);
  }
}
```

---

### Paso 4: Servicios (Lógica de Negocio)

```javascript
// src/services/loan-service.js
/**
 * ✅ SRP: Solo maneja lógica de préstamos
 * ✅ DIP: Depende de abstracciones (Repository)
 */
import { Loan } from '../domain/entities/loan.js';

export class LoanService {
  constructor(
    loanRepository,
    bookRepository,
    userRepository,
    notificationService,
  ) {
    this.loanRepository = loanRepository;
    this.bookRepository = bookRepository;
    this.userRepository = userRepository;
    this.notificationService = notificationService;
  }

  async createLoan(userId, bookId, days = 14) {
    // Validar usuario
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');
    if (!user.canBorrowMore()) {
      throw new Error(
        `Usuario alcanzó límite de préstamos (${user.getMaxLoans()})`,
      );
    }

    // Validar libro
    const book = await this.bookRepository.findById(bookId);
    if (!book) throw new Error('Libro no encontrado');
    if (!book.available) throw new Error('Libro no disponible');

    // Crear préstamo
    const loanDate = new Date();
    const dueDate = new Date(loanDate.getTime() + days * 24 * 60 * 60 * 1000);

    const loan = new Loan(
      Date.now().toString(),
      userId,
      bookId,
      loanDate,
      dueDate,
    );

    // Actualizar estado
    book.markAsUnavailable();
    user.addLoan(loan.id);

    // Guardar
    await this.loanRepository.save(loan);
    await this.bookRepository.save(book);
    await this.userRepository.save(user);

    // Notificar
    await this.notificationService.send(
      user.email,
      `Préstamo confirmado: "${book.title}". Devolución: ${dueDate.toLocaleDateString()}`,
      'EMAIL',
    );

    return loan;
  }

  async returnLoan(loanId) {
    const loan = await this.loanRepository.findById(loanId);
    if (!loan) throw new Error('Préstamo no encontrado');
    if (loan.status === 'RETURNED') throw new Error('Préstamo ya devuelto');

    // Actualizar préstamo
    loan.return();

    // Actualizar libro
    const book = await this.bookRepository.findById(loan.bookId);
    book.markAsAvailable();

    // Actualizar usuario
    const user = await this.userRepository.findById(loan.userId);
    user.removeLoan(loanId);

    // Guardar cambios
    await this.loanRepository.save(loan);
    await this.bookRepository.save(book);
    await this.userRepository.save(user);

    // Notificar
    await this.notificationService.send(
      user.email,
      `Libro devuelto: "${book.title}". ¡Gracias!`,
      'EMAIL',
    );

    return loan;
  }

  async getOverdueLoans() {
    const allLoans = await this.loanRepository.findAll();
    return allLoans.filter((loan) => loan.isOverdue());
  }
}
```

---

### Paso 5: Canales de Notificación

```javascript
// src/notifications/email-channel.js
/**
 * ✅ OCP: Extensión sin modificar NotificationService
 * ✅ SRP: Solo envía emails
 */
import { NotificationChannel } from '../domain/interfaces/notification-channel.js';

export class EmailChannel extends NotificationChannel {
  async send(recipient, message) {
    console.log(`📧 Email enviado a ${recipient}`);
    console.log(`   Mensaje: ${message}`);
    return { sent: true, channel: 'EMAIL', timestamp: new Date() };
  }

  getName() {
    return 'EMAIL';
  }
}

// src/notifications/sms-channel.js
export class SMSChannel extends NotificationChannel {
  async send(recipient, message) {
    console.log(`📱 SMS enviado a ${recipient}`);
    console.log(`   Mensaje: ${message}`);
    return { sent: true, channel: 'SMS', timestamp: new Date() };
  }

  getName() {
    return 'SMS';
  }
}
```

---

### Paso 6: Servicio de Notificaciones

```javascript
// src/services/notification-service.js
/**
 * ✅ DIP: Depende de abstracción NotificationChannel
 * ✅ OCP: Agregar canales sin modificar esta clase
 */
export class NotificationService {
  #channels = new Map();

  registerChannel(channel) {
    this.#channels.set(channel.getName(), channel);
  }

  async send(recipient, message, channelName) {
    const channel = this.#channels.get(channelName);
    if (!channel) {
      throw new Error(`Canal no registrado: ${channelName}`);
    }
    return await channel.send(recipient, message);
  }
}
```

---

## 🧪 Tests de Ejemplo

```javascript
// tests/loan-service.test.js
import { LoanService } from '../src/services/loan-service.js';
import { MemoryRepository } from '../src/repositories/memory-repository.js';
import { User } from '../src/domain/entities/user.js';
import { PhysicalBook } from '../src/domain/entities/physical-book.js';
import { NotificationService } from '../src/services/notification-service.js';
import { EmailChannel } from '../src/notifications/email-channel.js';

// Test básico
async function testCreateLoan() {
  // Configurar repositorios
  const userRepo = new MemoryRepository();
  const bookRepo = new MemoryRepository();
  const loanRepo = new MemoryRepository();

  // Configurar notificaciones
  const notifService = new NotificationService();
  notifService.registerChannel(new EmailChannel());

  // Crear servicio
  const loanService = new LoanService(
    loanRepo,
    bookRepo,
    userRepo,
    notifService,
  );

  // Crear datos de prueba
  const user = new User('U1', 'Juan Pérez', 'juan@example.com', 'BASIC');
  const book = new PhysicalBook(
    'B1',
    '1984',
    'George Orwell',
    '123-456',
    1949,
    'A3',
    'Bueno',
  );

  await userRepo.save(user);
  await bookRepo.save(book);

  // Ejecutar préstamo
  const loan = await loanService.createLoan('U1', 'B1');

  console.log('✅ Test createLoan:', loan);
  console.log('Libro disponible:', book.available); // false
  console.log('Préstamos activos usuario:', user.activeLoans.length); // 1
}

testCreateLoan();
```

---

## 📊 Cumplimiento de SOLID

| Principio | ¿Cómo se aplica?                        | Ejemplo                             |
| --------- | --------------------------------------- | ----------------------------------- |
| **SRP**   | Cada clase tiene una responsabilidad    | `LoanService` solo préstamos        |
| **OCP**   | Extensible con nuevos tipos             | Agregar `AudioBook`                 |
| **LSP**   | Subtipos sustituibles                   | `PhysicalBook` = `Book`             |
| **ISP**   | Interfaces específicas                  | `Repository`, `NotificationChannel` |
| **DIP**   | Dependencias inyectadas (abstracciones) | Servicios reciben interfaces        |

---

## 🚀 Ejecución

```bash
cd bootcamp/week-02/3-proyecto/bibliotech
pnpm install
node src/index.js
```

---

## 📝 Entregables

- [ ] Código completo funcional
- [ ] Al menos 3 tests
- [ ] README con instrucciones
- [ ] Diagrama de clases
- [ ] Documento explicando cómo aplicaste cada principio SOLID

---

**Bootcamp de Arquitectura de Software - Semana 02**
_SENA - Tecnología en Análisis y Desarrollo de Software_
