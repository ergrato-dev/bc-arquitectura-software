# 💪 Práctica 03 — Modelado DDD: Biblioteca Digital

> **Duración estimada**: 60 minutos
> **Nivel**: Intermedio-Avanzado
> **Prereq**: Haber leído `04-ddd-basico.md`

---

## 🎯 Objetivo

Modelar el dominio de una **biblioteca digital** usando los bloques de construcción de DDD: Entidades, Value Objects, Agregados, Repositorios y Servicios de Dominio.

---

## 🏛️ El dominio: Biblioteca Digital SENA

La biblioteca permite a los aprendices:

- Buscar y prestar libros digitales
- Un aprendiz puede tener máximo **3 préstamos activos**
- Un libro no puede prestarse si está agotado (0 copias disponibles)
- El préstamo dura **14 días**, con opción de renovar **1 vez**
- Si se devuelve tarde, el aprendiz queda **suspendido por 7 días**

---

## 🧱 Paso 1 — Value Objects

Identifica las características del dominio que no necesitan identidad:

```javascript
// src/domain/value-objects/isbn.vo.js
export class ISBN {
  #value;
  // ISBN-13: 13 dígitos, puede tener guiones
  static #REGEX = /^(?:\d{3}-?)?\d{1,5}-?\d{1,7}-?\d{1,6}-?[\dX]$/;

  constructor(value) {
    const cleaned = value.replace(/-/g, "");
    if (!/^\d{10}$|^\d{13}$/.test(cleaned)) {
      throw new Error(`Invalid ISBN: ${value}`);
    }
    this.#value = cleaned;
    Object.freeze(this);
  }

  equals(other) {
    return other instanceof ISBN && this.#value === other.value;
  }

  get value() {
    return this.#value;
  }
  toString() {
    return this.#value;
  }
}

// src/domain/value-objects/loan-period.vo.js
export class LoanPeriod {
  #startDate;
  #endDate;
  static DAYS = 14;

  constructor(startDate = new Date()) {
    this.#startDate = new Date(startDate);
    this.#endDate = new Date(startDate);
    this.#endDate.setDate(this.#endDate.getDate() + LoanPeriod.DAYS);
    Object.freeze(this);
  }

  isExpired(referenceDate = new Date()) {
    return new Date(referenceDate) > this.#endDate;
  }

  daysOverdue(referenceDate = new Date()) {
    const ref = new Date(referenceDate);
    if (!this.isExpired(ref)) return 0;
    return Math.floor((ref - this.#endDate) / (1000 * 60 * 60 * 24));
  }

  renew() {
    const newStart = new Date(this.#endDate);
    return new LoanPeriod(newStart);
  }

  get startDate() {
    return new Date(this.#startDate);
  }
  get endDate() {
    return new Date(this.#endDate);
  }
}
```

---

## 🧱 Paso 2 — Entidad Book

```javascript
// src/domain/entities/book.entity.js
import { randomUUID } from "crypto";
import { ISBN } from "../value-objects/isbn.vo.js";

export class Book {
  #id;
  #title;
  #author;
  #isbn;
  #totalCopies;
  #availableCopies;

  constructor({ id = randomUUID(), title, author, isbn, totalCopies }) {
    if (!title?.trim()) throw new Error("Book title is required");
    if (!author?.trim()) throw new Error("Book author is required");
    if (totalCopies < 0) throw new Error("Total copies cannot be negative");

    this.#id = id;
    this.#title = title.trim();
    this.#author = author.trim();
    this.#isbn = isbn instanceof ISBN ? isbn : new ISBN(isbn);
    this.#totalCopies = totalCopies;
    this.#availableCopies = totalCopies;
  }

  checkout() {
    if (!this.isAvailable) {
      throw new Error(`Book "${this.#title}" has no available copies`);
    }
    this.#availableCopies--;
  }

  returnCopy() {
    if (this.#availableCopies >= this.#totalCopies) {
      throw new Error("Cannot return: all copies already available");
    }
    this.#availableCopies++;
  }

  get id() {
    return this.#id;
  }
  get title() {
    return this.#title;
  }
  get author() {
    return this.#author;
  }
  get isbn() {
    return this.#isbn.value;
  }
  get isAvailable() {
    return this.#availableCopies > 0;
  }
  get availableCopies() {
    return this.#availableCopies;
  }
}
```

---

## 🧱 Paso 3 — Agregado Loan (Préstamo)

El `Loan` es el agregado raíz: encapsula Book, Borrower y LoanPeriod bajo una consistencia transaccional.

```javascript
// src/domain/aggregates/loan.aggregate.js
import { randomUUID } from "crypto";
import { LoanPeriod } from "../value-objects/loan-period.vo.js";

const LoanStatus = Object.freeze({
  ACTIVE: "ACTIVE",
  RETURNED: "RETURNED",
  OVERDUE: "OVERDUE",
  RENEWED: "RENEWED",
});

export class Loan {
  #id;
  #bookId;
  #borrowerId;
  #period;
  #status;
  #renewalCount;
  #events = [];

  static MAX_RENEWALS = 1;

  constructor({
    id = randomUUID(),
    bookId,
    borrowerId,
    period,
    status = LoanStatus.ACTIVE,
    renewalCount = 0,
  }) {
    if (!bookId) throw new Error("Loan requires a book ID");
    if (!borrowerId) throw new Error("Loan requires a borrower ID");

    this.#id = id;
    this.#bookId = bookId;
    this.#borrowerId = borrowerId;
    this.#period = period instanceof LoanPeriod ? period : new LoanPeriod();
    this.#status = status;
    this.#renewalCount = renewalCount;
  }

  renew() {
    if (
      this.#status !== LoanStatus.ACTIVE &&
      this.#status !== LoanStatus.RENEWED
    ) {
      throw new Error("Only active loans can be renewed");
    }
    if (this.#renewalCount >= Loan.MAX_RENEWALS) {
      throw new Error("Maximum renewals reached for this loan");
    }
    if (this.#period.isExpired()) {
      throw new Error(
        "Cannot renew an expired loan — please return the book first",
      );
    }

    this.#period = this.#period.renew();
    this.#renewalCount++;
    this.#status = LoanStatus.RENEWED;
    this.#events.push({ type: "LoanRenewed", loanId: this.#id });
  }

  return(returnDate = new Date()) {
    if (this.#status === LoanStatus.RETURNED) {
      throw new Error("This loan has already been returned");
    }
    const daysOverdue = this.#period.daysOverdue(returnDate);
    this.#status = LoanStatus.RETURNED;
    this.#events.push({
      type: "BookReturned",
      loanId: this.#id,
      bookId: this.#bookId,
      borrowerId: this.#borrowerId,
      daysOverdue,
      isLate: daysOverdue > 0,
    });
  }

  markOverdue() {
    if (
      this.#status !== LoanStatus.ACTIVE &&
      this.#status !== LoanStatus.RENEWED
    )
      return;
    this.#status = LoanStatus.OVERDUE;
  }

  pullEvents() {
    const events = [...this.#events];
    this.#events = [];
    return events;
  }

  get id() {
    return this.#id;
  }
  get bookId() {
    return this.#bookId;
  }
  get borrowerId() {
    return this.#borrowerId;
  }
  get dueDate() {
    return this.#period.endDate;
  }
  get status() {
    return this.#status;
  }
  get isActive() {
    return (
      this.#status === LoanStatus.ACTIVE || this.#status === LoanStatus.RENEWED
    );
  }
  get canRenew() {
    return this.isActive && this.#renewalCount < Loan.MAX_RENEWALS;
  }
}
```

---

## 🧱 Paso 4 — Servicio de Dominio: LoanService

La regla "máximo 3 préstamos activos" involucra tanto al Borrower como al Loan. No pertenece a ninguno solo:

```javascript
// src/domain/services/loan.domain-service.js
export class LoanDomainService {
  static MAX_ACTIVE_LOANS = 3;
  static SUSPENSION_DAYS = 7;

  /**
   * Verifica si un aprendiz puede tomar prestado un libro.
   * Involucra Borrower (estado de suspension) y Loan[] (conteo activos).
   */
  canBorrow(borrower, activeLoans) {
    if (borrower.isSuspended) {
      const { daysLeft } = borrower.suspensionInfo;
      throw new Error(`Borrower is suspended. Days remaining: ${daysLeft}`);
    }

    if (activeLoans.length >= LoanDomainService.MAX_ACTIVE_LOANS) {
      throw new Error(
        `Maximum of ${LoanDomainService.MAX_ACTIVE_LOANS} active loans reached`,
      );
    }
  }

  /**
   * Calcula la penalizacion de una devolucion tardia.
   * La logica de suspension pertenece al dominio, no a la infra.
   */
  calculatePenalty(daysOverdue) {
    if (daysOverdue <= 0) return null;

    const suspensionDays = Math.min(
      daysOverdue * LoanDomainService.SUSPENSION_DAYS,
      30, // maximo 30 dias de suspension
    );

    return {
      type: "SUSPENSION",
      days: suspensionDays,
      reason: `Devolucion con ${daysOverdue} dia(s) de retraso`,
    };
  }
}
```

---

## 🧱 Paso 5 — Repositorios (puertos)

```javascript
// src/domain/repositories/loan.repository.js
export class ILoanRepository {
  async save(loan) {
    throw new Error("Not implemented");
  }
  async findById(id) {
    throw new Error("Not implemented");
  }
  async findActiveByBorrower(borrowerId) {
    throw new Error("Not implemented");
  }
  async findOverdueLoans(referenceDate) {
    throw new Error("Not implemented");
  }
}

// src/infrastructure/repositories/in-memory-loan.repository.js
import { ILoanRepository } from "../../domain/repositories/loan.repository.js";

export class InMemoryLoanRepository extends ILoanRepository {
  #loans = new Map();

  async save(loan) {
    this.#loans.set(loan.id, loan);
  }
  async findById(id) {
    return this.#loans.get(id) ?? null;
  }

  async findActiveByBorrower(borrowerId) {
    return [...this.#loans.values()].filter(
      (l) => l.borrowerId === borrowerId && l.isActive,
    );
  }

  async findOverdueLoans(referenceDate = new Date()) {
    return [...this.#loans.values()].filter(
      (l) => l.isActive && new Date(l.dueDate) < referenceDate,
    );
  }
}
```

---

## ✅ Pruebas del modelo de dominio

```javascript
// tests/domain/loan.test.js
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Loan } from "../../src/domain/aggregates/loan.aggregate.js";
import { LoanPeriod } from "../../src/domain/value-objects/loan-period.vo.js";

describe("Loan Aggregate", () => {
  const makeLoan = (overrides = {}) =>
    new Loan({
      bookId: "book-1",
      borrowerId: "borrower-1",
      ...overrides,
    });

  describe("renewal", () => {
    it("renews an active loan once", () => {
      const loan = makeLoan();
      loan.renew();
      assert.equal(loan.status, "RENEWED");
      assert.equal(loan.canRenew, false);
    });

    it("cannot renew more than once", () => {
      const loan = makeLoan();
      loan.renew();
      assert.throws(() => loan.renew(), /Maximum renewals/);
    });

    it("cannot renew returned loan", () => {
      const loan = makeLoan();
      loan.return();
      assert.throws(() => loan.renew(), /Only active loans/);
    });
  });

  describe("return", () => {
    it("returns on time with no penalty event", () => {
      const loan = makeLoan();
      loan.return(new Date());
      const events = loan.pullEvents();
      assert.equal(events[0].type, "BookReturned");
      assert.equal(events[0].isLate, false);
    });

    it("returns late with overdue days", () => {
      // Simula prestamo que vencio hace 3 dias
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 20);
      const period = new LoanPeriod(pastDate);
      const loan = makeLoan({ period });

      loan.return(new Date());
      const events = loan.pullEvents();
      assert.ok(events[0].daysOverdue > 0, "Should have overdue days");
      assert.equal(events[0].isLate, true);
    });
  });
});

describe("LoanPeriod Value Object", () => {
  it("creates period with 14 day duration", () => {
    const period = new LoanPeriod();
    const diff = period.endDate - period.startDate;
    assert.equal(diff / (1000 * 60 * 60 * 24), 14);
  });

  it("calculates days overdue correctly", () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 20);
    const period = new LoanPeriod(pastDate);
    assert.equal(period.daysOverdue(new Date()), 6); // 20 - 14 = 6 dias vencido
  });

  it("renew creates new period starting from end date", () => {
    const period = new LoanPeriod(new Date("2024-01-01"));
    const renewed = period.renew();
    assert.equal(renewed.startDate.getTime(), period.endDate.getTime());
  });
});
```

---

## ✅ Ejercicio para entregar

1. Implementa la entidad `Borrower` con los campos `id`, `name`, `email`, `isSuspended` y el método `suspend(days)` que calcule la fecha de fin de suspensión
2. Crea el caso de uso `CheckoutBookUseCase` que:
   - Verifica que el libro está disponible
   - Llama al `LoanDomainService.canBorrow()`
   - Crea el `Loan`
   - Descuenta una copia del `Book`
   - Persiste ambos en sus repositorios
3. Agrega pruebas para los 3 escenarios felices y 3 escenarios de error del caso de uso

**Criterio de éxito**: Las pruebas del dominio y del caso de uso corren sin BD en < 500ms.
