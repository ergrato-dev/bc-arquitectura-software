# 💪 Práctica 01: Aplicando Single Responsibility Principle (SRP)

## 🎯 Objetivo

Aprender a identificar y refactorizar clases que violan el principio de Responsabilidad Única, dividiendo responsabilidades en componentes cohesivos.

---

## 📋 Caso de Estudio: Sistema de Pedidos de E-commerce

Imagina que trabajas para **ShopFast**, un e-commerce como Amazon. El código actual tiene una clase `OrderManager` que hace demasiadas cosas.

---

## ❌ Código con Violación de SRP

```javascript
/**
 * ❌ VIOLACIÓN DE SRP
 * Esta clase tiene MÚLTIPLES responsabilidades:
 * 1. Validar datos del pedido
 * 2. Calcular descuentos y totales
 * 3. Persistir en base de datos
 * 4. Enviar email de confirmación
 * 5. Generar factura PDF
 * 6. Actualizar inventario
 */

class OrderManager {
  constructor() {
    this.orders = [];
    this.inventory = new Map();
  }

  createOrder(orderData) {
    // Responsabilidad 1: Validación
    if (!orderData.customerId) {
      throw new Error('CustomerId es requerido');
    }

    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('El pedido debe tener al menos un item');
    }

    for (const item of orderData.items) {
      if (item.quantity <= 0) {
        throw new Error('Cantidad debe ser mayor a 0');
      }
    }

    // Responsabilidad 2: Cálculo de precios
    let subtotal = 0;
    for (const item of orderData.items) {
      subtotal += item.price * item.quantity;
    }

    let discount = 0;
    if (orderData.couponCode === 'SAVE20') {
      discount = subtotal * 0.2;
    }

    const tax = (subtotal - discount) * 0.19; // IVA 19%
    const total = subtotal - discount + tax;

    // Responsabilidad 3: Persistencia
    const order = {
      id: Date.now(),
      customerId: orderData.customerId,
      items: orderData.items,
      subtotal,
      discount,
      tax,
      total,
      status: 'PENDING',
      createdAt: new Date(),
    };

    this.orders.push(order);

    // Responsabilidad 4: Enviar email
    console.log(`📧 Enviando email a cliente ${orderData.customerId}`);
    console.log(`Pedido #${order.id} - Total: $${total}`);

    // Responsabilidad 5: Generar factura
    console.log('📄 Generando factura PDF...');
    const invoice = `
      FACTURA #${order.id}
      Cliente: ${orderData.customerId}
      Total: $${total}
      Fecha: ${order.createdAt}
    `;
    console.log(invoice);

    // Responsabilidad 6: Actualizar inventario
    for (const item of orderData.items) {
      const currentStock = this.inventory.get(item.productId) || 0;
      this.inventory.set(item.productId, currentStock - item.quantity);
    }

    return order;
  }
}

// Uso
const orderManager = new OrderManager();

const order = orderManager.createOrder({
  customerId: 'CUST123',
  items: [
    { productId: 'PROD1', price: 100, quantity: 2 },
    { productId: 'PROD2', price: 50, quantity: 1 },
  ],
  couponCode: 'SAVE20',
});

console.log('Pedido creado:', order);
```

---

## 🤔 Análisis del Problema

### ¿Cuántas razones tiene esta clase para cambiar?

1. **Cambian reglas de validación** → Modifica `createOrder`
2. **Cambia cálculo de impuestos** → Modifica `createOrder`
3. **Cambia formato de factura** → Modifica `createOrder`
4. **Cambia servidor de email** → Modifica `createOrder`
5. **Cambia base de datos** → Modifica `createOrder`
6. **Cambia lógica de inventario** → Modifica `createOrder`

**Resultado**: ¡6 razones para cambiar! Claramente viola SRP.

---

## ✅ Solución: Aplicando SRP

### Paso 1: Identificar Responsabilidades

| Responsabilidad             | Nueva Clase        |
| --------------------------- | ------------------ |
| Validar pedidos             | `OrderValidator`   |
| Calcular precios/descuentos | `PriceCalculator`  |
| Persistir pedidos           | `OrderRepository`  |
| Enviar emails               | `EmailService`     |
| Generar facturas            | `InvoiceGenerator` |
| Gestionar inventario        | `InventoryService` |
| Coordinar el proceso        | `OrderService`     |

---

### Paso 2: Crear Clases con Responsabilidad Única

```javascript
// ✅ 1. Validación de pedidos
class OrderValidator {
  validate(orderData) {
    const errors = [];

    if (!orderData.customerId) {
      errors.push('CustomerId es requerido');
    }

    if (!orderData.items || orderData.items.length === 0) {
      errors.push('El pedido debe tener al menos un item');
    }

    for (const item of orderData.items) {
      if (item.quantity <= 0) {
        errors.push(`Cantidad inválida para producto ${item.productId}`);
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return true;
  }
}

// ✅ 2. Cálculo de precios
class PriceCalculator {
  #TAX_RATE = 0.19; // IVA 19%

  calculateSubtotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  calculateDiscount(subtotal, couponCode) {
    const coupons = {
      SAVE20: 0.2,
      SAVE10: 0.1,
      SAVE5: 0.05,
    };

    const discountRate = coupons[couponCode] || 0;
    return subtotal * discountRate;
  }

  calculateTax(amount) {
    return amount * this.#TAX_RATE;
  }

  calculateTotal(items, couponCode = null) {
    const subtotal = this.calculateSubtotal(items);
    const discount = this.calculateDiscount(subtotal, couponCode);
    const taxableAmount = subtotal - discount;
    const tax = this.calculateTax(taxableAmount);

    return {
      subtotal,
      discount,
      tax,
      total: taxableAmount + tax,
    };
  }
}

// ✅ 3. Repositorio de pedidos
class OrderRepository {
  #orders = [];

  save(order) {
    this.#orders.push(order);
    return order;
  }

  findById(orderId) {
    return this.#orders.find((o) => o.id === orderId);
  }

  findByCustomerId(customerId) {
    return this.#orders.filter((o) => o.customerId === customerId);
  }

  getAll() {
    return [...this.#orders];
  }
}

// ✅ 4. Servicio de email
class EmailService {
  sendOrderConfirmation(order) {
    // Aquí iría integración con servicio real (SendGrid, AWS SES, etc.)
    console.log(`📧 Email enviado a cliente ${order.customerId}`);
    console.log(`   Pedido #${order.id} - Total: $${order.total.toFixed(2)}`);
    return { sent: true, timestamp: new Date() };
  }
}

// ✅ 5. Generador de facturas
class InvoiceGenerator {
  generate(order) {
    const invoice = {
      invoiceNumber: `INV-${order.id}`,
      customerId: order.customerId,
      date: order.createdAt,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      tax: order.tax,
      total: order.total,
    };

    // Aquí generarías un PDF real (PDFKit, jsPDF, etc.)
    console.log('📄 Factura generada:');
    console.log(`   Número: ${invoice.invoiceNumber}`);
    console.log(`   Total: $${invoice.total.toFixed(2)}`);

    return invoice;
  }
}

// ✅ 6. Servicio de inventario
class InventoryService {
  #inventory = new Map();

  constructor() {
    // Inventario inicial de ejemplo
    this.#inventory.set('PROD1', 100);
    this.#inventory.set('PROD2', 50);
  }

  checkAvailability(items) {
    for (const item of items) {
      const stock = this.#inventory.get(item.productId) || 0;
      if (stock < item.quantity) {
        throw new Error(
          `Stock insuficiente para ${item.productId}. Disponible: ${stock}, Solicitado: ${item.quantity}`,
        );
      }
    }
    return true;
  }

  reserve(items) {
    for (const item of items) {
      const currentStock = this.#inventory.get(item.productId) || 0;
      this.#inventory.set(item.productId, currentStock - item.quantity);
    }
    console.log('📦 Inventario actualizado');
  }

  getStock(productId) {
    return this.#inventory.get(productId) || 0;
  }
}

// ✅ 7. Servicio orquestador (coordina las demás clases)
class OrderService {
  constructor(
    validator,
    calculator,
    repository,
    emailService,
    invoiceGenerator,
    inventoryService,
  ) {
    this.validator = validator;
    this.calculator = calculator;
    this.repository = repository;
    this.emailService = emailService;
    this.invoiceGenerator = invoiceGenerator;
    this.inventoryService = inventoryService;
  }

  createOrder(orderData) {
    // 1. Validar
    this.validator.validate(orderData);

    // 2. Verificar inventario
    this.inventoryService.checkAvailability(orderData.items);

    // 3. Calcular precios
    const pricing = this.calculator.calculateTotal(
      orderData.items,
      orderData.couponCode,
    );

    // 4. Crear pedido
    const order = {
      id: Date.now(),
      customerId: orderData.customerId,
      items: orderData.items,
      ...pricing,
      status: 'PENDING',
      createdAt: new Date(),
    };

    // 5. Guardar
    this.repository.save(order);

    // 6. Actualizar inventario
    this.inventoryService.reserve(orderData.items);

    // 7. Enviar email
    this.emailService.sendOrderConfirmation(order);

    // 8. Generar factura
    this.invoiceGenerator.generate(order);

    return order;
  }

  getOrderById(orderId) {
    return this.repository.findById(orderId);
  }

  getCustomerOrders(customerId) {
    return this.repository.findByCustomerId(customerId);
  }
}
```

---

### Paso 3: Uso del Sistema Refactorizado

```javascript
// Crear instancias de servicios
const validator = new OrderValidator();
const calculator = new PriceCalculator();
const repository = new OrderRepository();
const emailService = new EmailService();
const invoiceGenerator = new InvoiceGenerator();
const inventoryService = new InventoryService();

// Inyección de dependencias en OrderService
const orderService = new OrderService(
  validator,
  calculator,
  repository,
  emailService,
  invoiceGenerator,
  inventoryService,
);

// Crear pedido
const order = orderService.createOrder({
  customerId: 'CUST123',
  items: [
    { productId: 'PROD1', price: 100, quantity: 2 },
    { productId: 'PROD2', price: 50, quantity: 1 },
  ],
  couponCode: 'SAVE20',
});

console.log('\n✅ Pedido creado exitosamente:', order);

// Consultar pedidos del cliente
const customerOrders = orderService.getCustomerOrders('CUST123');
console.log('\n📋 Pedidos del cliente:', customerOrders);
```

---

## 🎯 Beneficios de Aplicar SRP

### Antes (Violación de SRP)

- ❌ 1 clase gigante con 6 responsabilidades
- ❌ Difícil de testear (necesitas mockear todo)
- ❌ Cambiar email requiere modificar `OrderManager`
- ❌ Cambiar cálculo de impuestos afecta toda la clase
- ❌ Alto acoplamiento

### Después (Aplicando SRP)

- ✅ 7 clases, cada una con 1 responsabilidad
- ✅ Fácil de testear (testeas cada clase independientemente)
- ✅ Cambiar email solo afecta `EmailService`
- ✅ Cambiar impuestos solo afecta `PriceCalculator`
- ✅ Bajo acoplamiento

---

## 🧪 Ejercicio Práctico

### Tarea

El código actual no valida stock antes de crear el pedido. Agrega esta validación **sin modificar `OrderService`**.

**Pista**: Solo modifica `InventoryService` y agrégalo al flujo en `OrderService.createOrder()`.

### Solución

Ya está implementado en el código refactorizado con `inventoryService.checkAvailability()` 😉

---

## 📊 Comparación de Complejidad

| Métrica               | Antes (Violación) | Después (SRP) |
| --------------------- | ----------------- | ------------- |
| Líneas por clase      | ~100              | ~20-30        |
| Responsabilidades     | 6                 | 1             |
| Razones para cambiar  | 6                 | 1             |
| Dificultad de testing | Alta              | Baja          |
| Reutilización         | Imposible         | Alta          |

---

## 🏆 Conclusión

**SRP no es solo dividir clases, es dividir responsabilidades de manera cohesiva**.

Cada clase debe tener:

- ✅ Un propósito claro
- ✅ Una razón para cambiar
- ✅ Alta cohesión interna

---

**Próxima práctica**: Open/Closed Principle (OCP)

---

**Bootcamp de Arquitectura de Software - Semana 02**
_SENA - Tecnología en Análisis y Desarrollo de Software_
_bc-channel-epti_
