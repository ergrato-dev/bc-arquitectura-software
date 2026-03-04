# 💪 Práctica 01 — Refactorización a Clean Architecture

> **Duración estimada**: 60 minutos
> **Nivel**: Intermedio
> **Prereq**: Haber leído `02-clean-architecture.md`

---

## 🎯 Objetivo

Tomar un endpoint Express real con lógica mezclada (SQL + negocio + HTTP) y refactorizarlo paso a paso en las cuatro capas de Clean Architecture.

---

## 🔴 Punto de partida — El código problemático

Este es el tipo de código que encuentras en proyectos reales. Todo está mezclado en un solo archivo:

```javascript
// ❌ ANTES: src/routes/orders.js — el caos total
import express from "express";
import pg from "pg";
import nodemailer from "nodemailer";

const router = express.Router();
const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });

router.post("/orders", async (req, res) => {
  const { customerId, items } = req.body;

  // Validación mezclada con negocio
  if (!customerId || !items?.length) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // SQL directo en el controlador
  const {
    rows: [customer],
  } = await db.query(
    "SELECT * FROM customers WHERE id = $1 AND active = true",
    [customerId],
  );
  if (!customer) return res.status(404).json({ error: "Customer not found" });

  // Cálculo de negocio junto con SQL
  let total = 0;
  const itemsWithDetails = [];
  for (const item of items) {
    const {
      rows: [product],
    } = await db.query("SELECT * FROM products WHERE id = $1 AND stock >= $2", [
      item.productId,
      item.quantity,
    ]);
    if (!product)
      return res
        .status(400)
        .json({ error: `Product ${item.productId} unavailable` });
    total += product.price * item.quantity;
    itemsWithDetails.push({
      ...item,
      price: product.price,
      name: product.name,
    });
  }

  if (total < 5000)
    return res.status(400).json({ error: "Minimum order is COP 5,000" });

  // Inserción en BD
  const {
    rows: [order],
  } = await db.query(
    `INSERT INTO orders (customer_id, status, total) VALUES ($1, 'PENDING', $2) RETURNING *`,
    [customerId, total],
  );
  for (const item of itemsWithDetails) {
    await db.query(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
      [order.id, item.productId, item.quantity, item.price],
    );
  }

  // Descuento inventario
  for (const item of items) {
    await db.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [
      item.quantity,
      item.productId,
    ]);
  }

  // Email directo en el controlador
  const transporter = nodemailer.createTransporter({
    /* config */
  });
  await transporter.sendMail({
    to: customer.email,
    subject: "Orden confirmada",
    text: `Tu orden #${order.id} fue creada. Total: COP ${total}`,
  });

  res.status(201).json({ id: order.id, total, status: "PENDING" });
});
```

**¿Qué problemas tiene este código?**

1. Imposible probar sin una BD real corriendo
2. Cambiar de `nodemailer` a `SendGrid` implica tocar el controlador
3. La regla "mínimo COP 5,000" vive en una ruta HTTP — nadie la encontrará
4. Si necesitas el mismo flujo desde CLI o workers, debes duplicar el código
5. Una sola prueba de integración puede tardar 5+ segundos

---

## 🟡 Paso 1 — Crear la capa de Dominio

Comienza extrayendo las **entidades** y **reglas de negocio** a una capa que no sepa nada de Express ni de PostgreSQL:

```javascript
// src/domain/entities/order.entity.js
import { randomUUID } from "crypto";

export class Order {
  #id;
  #customerId;
  #items;
  #status;
  #total;

  constructor({ id = randomUUID(), customerId, items, status = "PENDING" }) {
    if (!customerId) throw new Error("Order requires a customer ID");
    if (!items?.length) throw new Error("Order must have at least one item");

    this.#id = id;
    this.#customerId = customerId;
    this.#status = status;
    this.#items = items.map((i) => ({
      productId: i.productId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      subtotal: i.price * i.quantity,
    }));
    this.#total = this.#items.reduce((sum, i) => sum + i.subtotal, 0);

    // Regla de negocio: vive en el dominio, no en HTTP
    if (this.#total < 5000) {
      throw new Error("Order total must be at least COP 5,000");
    }
  }

  get id() {
    return this.#id;
  }
  get customerId() {
    return this.#customerId;
  }
  get items() {
    return [...this.#items];
  }
  get status() {
    return this.#status;
  }
  get total() {
    return this.#total;
  }
}
```

**Prueba (sin BD, sin servidor):**

```javascript
// tests/domain/order.test.js
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Order } from "../../src/domain/entities/order.entity.js";

describe("Order", () => {
  const validItems = [
    { productId: "p1", name: "Notebook", price: 6000, quantity: 1 },
  ];

  it("creates order when total >= 5000", () => {
    const order = new Order({ customerId: "c1", items: validItems });
    assert.equal(order.total, 6000);
    assert.equal(order.status, "PENDING");
  });

  it("rejects orders below minimum", () => {
    const items = [{ productId: "p2", name: "Pen", price: 1000, quantity: 1 }];
    assert.throws(() => new Order({ customerId: "c1", items }), /5,000/);
  });
});
```

---

## 🟡 Paso 2 — Crear Puertos (interfaces)

Define **contratos** para cada dependencia externa. El dominio los define; la infraestructura los implementa:

```javascript
// src/domain/ports/order.repository.port.js
export class IOrderRepository {
  async save(order) {
    throw new Error("Not implemented");
  }
  async findById(id) {
    throw new Error("Not implemented");
  }
}

// src/domain/ports/inventory.port.js
export class IInventoryPort {
  /** @returns {Promise<{ productId, name, price, availableStock }[]>} */
  async getAvailableItems(items) {
    throw new Error("Not implemented");
  }
  async reserveItems(items) {
    throw new Error("Not implemented");
  }
}

// src/domain/ports/notification.port.js
export class INotificationPort {
  async orderPlaced({ customerId, orderId, total }) {
    throw new Error("Not implemented");
  }
}
```

---

## 🟡 Paso 3 — Crear el Caso de Uso (Application Layer)

El caso de uso orquesta el dominio. No sabe qué BD ni qué framework está en uso:

```javascript
// src/application/use-cases/place-order.use-case.js
import { Order } from "../../domain/entities/order.entity.js";

export class PlaceOrderUseCase {
  #orderRepository;
  #inventoryPort;
  #notificationPort;

  constructor({ orderRepository, inventoryPort, notificationPort }) {
    this.#orderRepository = orderRepository;
    this.#inventoryPort = inventoryPort;
    this.#notificationPort = notificationPort;
  }

  async execute({ customerId, items }) {
    // Verificar disponibilidad (puerto secundario)
    const available = await this.#inventoryPort.getAvailableItems(items);

    for (const item of items) {
      const product = available.find((p) => p.productId === item.productId);
      if (!product || product.availableStock < item.quantity) {
        throw new Error(
          `Product ${item.productId} is not available in the requested quantity`,
        );
      }
    }

    // Crear la entidad (lógica de dominio pura)
    const enrichedItems = items.map((item) => {
      const product = available.find((p) => p.productId === item.productId);
      return { ...item, name: product.name, price: product.price };
    });

    const order = new Order({ customerId, items: enrichedItems });

    // Persistir (puerto secundario)
    await this.#orderRepository.save(order);

    // Reservar inventario (puerto secundario)
    await this.#inventoryPort.reserveItems(items);

    // Notificar (puerto secundario)
    await this.#notificationPort.orderPlaced({
      customerId,
      orderId: order.id,
      total: order.total,
    });

    return order;
  }
}
```

**Prueba del caso de uso — 100% sin BD:**

```javascript
// tests/application/place-order.test.js
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { PlaceOrderUseCase } from "../../src/application/use-cases/place-order.use-case.js";

describe("PlaceOrderUseCase", () => {
  let useCase, mockRepository, mockInventory, mockNotification;

  beforeEach(() => {
    mockRepository = {
      saved: null,
      async save(order) {
        this.saved = order;
      },
    };
    mockInventory = {
      async getAvailableItems(items) {
        return items.map((i) => ({
          productId: i.productId,
          name: "Product X",
          price: 10000,
          availableStock: 99,
        }));
      },
      reserved: [],
      async reserveItems(items) {
        this.reserved = items;
      },
    };
    mockNotification = {
      sent: null,
      async orderPlaced(data) {
        this.sent = data;
      },
    };

    useCase = new PlaceOrderUseCase({
      orderRepository: mockRepository,
      inventoryPort: mockInventory,
      notificationPort: mockNotification,
    });
  });

  it("places an order successfully", async () => {
    const order = await useCase.execute({
      customerId: "c1",
      items: [{ productId: "p1", quantity: 2 }],
    });

    assert.ok(order.id);
    assert.equal(order.total, 20000);
    assert.ok(mockRepository.saved);
    assert.ok(mockNotification.sent);
  });

  it("rejects when product is unavailable", async () => {
    mockInventory.getAvailableItems = async () => [
      { productId: "p1", name: "X", price: 1000, availableStock: 0 },
    ];

    await assert.rejects(
      () =>
        useCase.execute({
          customerId: "c1",
          items: [{ productId: "p1", quantity: 1 }],
        }),
      /not available/,
    );
  });
});
```

---

## 🟢 Paso 4 — Adaptadores de Infraestructura

Implementa los puertos con tecnología real:

```javascript
// src/infrastructure/repositories/postgres-order.repository.js
import { IOrderRepository } from "../../domain/ports/order.repository.port.js";
import { Order } from "../../domain/entities/order.entity.js";

export class PostgresOrderRepository extends IOrderRepository {
  #db;
  constructor({ db }) {
    super();
    this.#db = db;
  }

  async save(order) {
    const client = await this.#db.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO orders (id, customer_id, status, total)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET status = $3`,
        [order.id, order.customerId, order.status, order.total],
      );
      for (const item of order.items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
          [order.id, item.productId, item.quantity, item.price],
        );
      }
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}

// src/infrastructure/email/nodemailer-notification.adapter.js
import nodemailer from "nodemailer";
import { INotificationPort } from "../../domain/ports/notification.port.js";

export class NodemailerNotificationAdapter extends INotificationPort {
  #transporter;

  constructor() {
    super();
    this.#transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }

  async orderPlaced({ customerId, orderId, total }) {
    await this.#transporter.sendMail({
      to: `${customerId}@example.com`,
      subject: "Orden confirmada",
      text: `Tu orden #${orderId} fue creada exitosamente. Total: COP ${total.toLocaleString("es-CO")}`,
    });
  }
}
```

---

## 🟢 Paso 5 — Controlador HTTP (Interface Layer)

```javascript
// src/interfaces/http/orders.controller.js
export class OrdersController {
  #placeOrderUseCase;

  constructor({ placeOrderUseCase }) {
    this.#placeOrderUseCase = placeOrderUseCase;
  }

  register(app) {
    app.post("/orders", (req, res) => this.#handlePlaceOrder(req, res));
  }

  async #handlePlaceOrder(req, res) {
    const { customerId, items } = req.body;

    if (!customerId || !items?.length) {
      return res
        .status(400)
        .json({ error: "customerId and items are required" });
    }

    try {
      const order = await this.#placeOrderUseCase.execute({
        customerId,
        items,
      });
      return res
        .status(201)
        .json({ id: order.id, total: order.total, status: order.status });
    } catch (err) {
      if (
        err.message.includes("not available") ||
        err.message.includes("5,000")
      ) {
        return res.status(422).json({ error: err.message });
      }
      console.error("Unexpected error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
```

---

## 📁 Estructura de carpetas final

```
src/
├── domain/
│   ├── entities/
│   │   └── order.entity.js
│   └── ports/
│       ├── order.repository.port.js
│       ├── inventory.port.js
│       └── notification.port.js
├── application/
│   └── use-cases/
│       └── place-order.use-case.js
├── infrastructure/
│   ├── repositories/
│   │   └── postgres-order.repository.js
│   └── email/
│       └── nodemailer-notification.adapter.js
├── interfaces/
│   └── http/
│       └── orders.controller.js
└── main.js
tests/
├── domain/
│   └── order.test.js
└── application/
    └── place-order.test.js
```

---

## ✅ Ejercicio para entregar

1. Implementa el adaptador `InMemoryOrderRepository` en `infrastructure/repositories/`
2. Agrega el método `cancel()` a `Order` y el caso de uso `CancelOrderUseCase`
3. Escribe 3 pruebas adicionales para el caso de uso usando los mocks del paso 3
4. Conecta todo en `main.js` usando el composition root

**Criterio de éxito**: `node --test tests/` debe correr en menos de 1 segundo sin BD.
