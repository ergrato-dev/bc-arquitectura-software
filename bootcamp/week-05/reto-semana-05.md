# 🎯 Reto Semana 05: ShopFlow — Sistema de Procesamiento de Pedidos

## 🏢 Contexto del Reto

**ShopFlow** es una plataforma de comercio electrónico que está creciendo rápidamente. El equipo de ingeniería heredó un código monolítico que ya no puede escalar, y te han contratado como arquitecto de software junior para refactorizarlo aplicando patrones de diseño.

El sistema actual tiene serios problemas:

- La creación de objetos está dispersa por todo el código (sin encapsulamiento)
- Los descuentos están codificados con `if/else` gigantes que nadie quiere tocar
- Cuando cambia el estado de un pedido, hay que actualizar manualmente 5 lugares distintos
- Integrar nuevas pasarelas de pago requiere modificar el núcleo del sistema
- El código de envíos mezcla lógica de múltiples servicios externos en un solo módulo

Tu misión: **refactorizar ShopFlow aplicando mínimo 5 patrones de diseño** y documentar cada decisión.

---

## 📋 El Sistema Heredado (El Problema)

```javascript
// ❌ CÓDIGO PROBLEMÁTICO - shopflow-legacy.js
// Todo mezclado, sin patrones, sin estructura

import crypto from 'crypto';

// ❌ Creación de objetos sin encapsulamiento
const createOrder = (userId, items) => {
  const order = {
    id: crypto.randomUUID(),
    userId,
    items,
    status: 'pending',
    createdAt: new Date(),
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
  return order;
};

// ❌ Lógica de descuentos con if/else masivo - difícil de extender
const applyDiscount = (order, userType, couponCode) => {
  let total = order.total;

  if (userType === 'vip') {
    total = total * 0.85;
  } else if (userType === 'member') {
    total = total * 0.95;
  } else if (userType === 'new') {
    total = total * 0.90;
  }

  if (couponCode === 'SUMMER20') {
    total = total * 0.80;
  } else if (couponCode === 'FLASH10') {
    total = total * 0.90;
  } else if (couponCode === 'WELCOME15') {
    total = total * 0.85;
  }

  return total;
};

// ❌ Procesamiento de pagos acoplado directamente — cada nueva pasarela = cambios al núcleo
const processPayment = (order, paymentData) => {
  if (paymentData.method === 'stripe') {
    // Lógica directa de Stripe
    console.log(`Stripe: cargando $${order.total} a tarjeta ${paymentData.cardNumber}`);
    return { success: true, transactionId: 'stripe_' + Date.now() };
  } else if (paymentData.method === 'paypal') {
    // Lógica directa de PayPal
    console.log(`PayPal: procesando pago de $${order.total} para ${paymentData.email}`);
    return { success: true, transactionId: 'paypal_' + Date.now() };
  } else if (paymentData.method === 'nequi') {
    // Lógica directa de Nequi
    console.log(`Nequi: transferencia de $${order.total} al ${paymentData.phone}`);
    return { success: true, transactionId: 'nequi_' + Date.now() };
  }
};

// ❌ Notificaciones acopladas — cada cambio de estado requiere modificar este bloque
const changeOrderStatus = (order, newStatus) => {
  order.status = newStatus;

  // Notificar manualmente a cada parte interesada
  console.log(`[EMAIL] Notificando a usuario ${order.userId}: pedido ${newStatus}`);
  console.log(`[SMS] Notificando a usuario ${order.userId}: pedido ${newStatus}`);
  console.log(`[PUSH] Notificando app: pedido ${newStatus}`);
  console.log(`[ANALYTICS] Registrando cambio de estado: ${newStatus}`);
  console.log(`[INVENTORY] Actualizando inventario para pedido ${order.id}`);
};

// ❌ Servicio de envíos mezclado — tres servicios externos acoplados
const calculateShipping = (order, address) => {
  let cost = 0;
  let estimatedDays = 0;
  let carrier = '';

  if (address.country !== 'CO') {
    // FedEx para internacional
    cost = order.total * 0.15;
    estimatedDays = 10;
    carrier = 'FedEx';
    console.log('Iniciando sesión en FedEx API...');
    console.log('Calculando tarifa internacional FedEx...');
  } else if (order.total > 200000) {
    // Servientrega para pedidos grandes en Colombia
    cost = 0; // envío gratis
    estimatedDays = 3;
    carrier = 'Servientrega';
    console.log('Conectando a API Servientrega...');
  } else {
    // Coordinadora para pedidos normales
    cost = 12000;
    estimatedDays = 5;
    carrier = 'Coordinadora';
    console.log('Conectando a API Coordinadora...');
  }

  return { cost, estimatedDays, carrier };
};

// ❌ Construcción de documentos confusa
const createInvoice = (order, customer) => {
  const invoice = {};
  invoice.number = 'INV-' + Date.now();
  invoice.date = new Date();
  invoice.customer = customer.name;
  invoice.customerEmail = customer.email;
  invoice.customerAddress = customer.address;
  invoice.customerNit = customer.nit;
  invoice.items = order.items;
  invoice.subtotal = order.total;
  invoice.tax = order.total * 0.19;
  invoice.total = order.total + order.total * 0.19;
  invoice.paymentMethod = order.paymentMethod;
  invoice.currency = 'COP';
  invoice.notes = '';
  return invoice;
};
```

---

## 🛠️ Tu Misión

### Paso 1 — Análisis (sin código)

Antes de escribir código, responde en un documento `docs/analisis-previo.md`:

1. ¿Qué problema específico tiene cada función del código heredado?
2. ¿Qué patrón de diseño resolvería cada problema y por qué?
3. ¿Cómo se relaciona cada patrón con algún principio SOLID?

### Paso 2 — Implementación

Refactoriza ShopFlow aplicando los siguientes patrones (mínimo):

| # | Dónde aplicarlo | Patrón Sugerido | Justificación |
|---|----------------|-----------------|--------------|
| 1 | Creación de pedidos y facturas | **Builder** | Construcción paso a paso de objetos complejos |
| 2 | Procesamiento de pagos | **Adapter** | Conectar pasarelas con interfaces distintas |
| 3 | Motor de descuentos | **Strategy** | Algoritmos de descuento intercambiables |
| 4 | Cambios de estado | **Observer** | Notificar múltiples suscriptores automáticamente |
| 5 | Servicio de envíos | **Facade** | Unificar 3 carriers bajo una interfaz simple |
| 6 | _(Bonus)_ Tipos de pedido | **Factory Method** | Crear distintos tipos de pedido sin acoplamiento |

### Paso 3 — Documentación

Para cada patrón aplicado, crea una entrada en `docs/patrones-aplicados.md` con:

```markdown
## Patrón: [Nombre del Patrón]

**Problema original**: [descripción del problema en el código heredado]
**Solución**: [cómo lo resuelve el patrón]
**Principio SOLID reforzado**: [cuál/es principios aplica]
**Diagrama**: [enlace al diagrama Mermaid/SVG]
**Código clave**: [fragmento del antes vs después]
```

---

## 🏗️ Estructura Esperada del Proyecto

```
shopflow-patterns/
├── README.md
├── package.json
├── docs/
│   ├── analisis-previo.md
│   ├── patrones-aplicados.md
│   └── diagramas/
│       ├── builder-order.md        # Mermaid
│       ├── adapter-payment.md
│       ├── strategy-discount.md
│       ├── observer-status.md
│       └── facade-shipping.md
└── src/
    ├── index.js                    # Demo de uso del sistema
    ├── patterns/
    │   ├── builder/
    │   │   └── order-builder.js
    │   ├── adapter/
    │   │   ├── payment-adapter.js
    │   │   ├── stripe-adapter.js
    │   │   ├── paypal-adapter.js
    │   │   └── nequi-adapter.js
    │   ├── strategy/
    │   │   ├── discount-strategy.js
    │   │   ├── vip-discount.js
    │   │   ├── coupon-discount.js
    │   │   └── new-user-discount.js
    │   ├── observer/
    │   │   ├── order-event-emitter.js
    │   │   ├── email-observer.js
    │   │   ├── sms-observer.js
    │   │   └── analytics-observer.js
    │   └── facade/
    │       └── shipping-facade.js
    └── legacy/
        └── shopflow-legacy.js      # El código original (referencia)
```

---

## 📋 Criterios de Aceptación

### Mínimo para Aprobar ✅

- [ ] Mínimo 5 patrones implementados correctamente
- [ ] Cada patrón tiene documentación en `patrones-aplicados.md`
- [ ] El código usa JavaScript ES2023 (módulos ES6, arrow functions, clases)
- [ ] `src/index.js` demuestra el uso de todos los patrones
- [ ] `README.md` incluye instrucciones para ejecutar con `pnpm`

### Para Nota Excelente 🌟

- [ ] Los 6 patrones implementados (incluyendo el bonus)
- [ ] Diagramas Mermaid para cada patrón
- [ ] El análisis previo documenta el problema antes del código
- [ ] Unit tests básicos (al menos 1 por patrón usando Node.js test runner)
- [ ] El código muestra cómo agregar un nuevo patrón sin modificar los existentes

---

## 🚀 Para Comenzar

```bash
# Clonar el repositorio del bootcamp
git clone https://github.com/TU_USUARIO/shopflow-patterns

# Instalar dependencias
pnpm install

# Ejecutar demo
pnpm start

# Ejecutar tests (bonus)
pnpm test
```

---

## 💡 Pistas

> **¿Por dónde empezar?**
> 
> 1. Lee primero todo el código heredado y escribe el análisis previo
> 2. Implementa Observer primero — es el patrón más visual (ves los resultados inmediatamente)
> 3. Luego Strategy para los descuentos — transformarás el `if/else` gigante en clases limpias
> 4. Adapter para pagos — te enseñará a aislar dependencias externas
> 5. Builder para pedidos/facturas — verás la elegancia de construir paso a paso
> 6. Facade para envíos — tu último paso hacia un código limpio

> **¿Qué hacer si un patrón no "encaja"?**
> 
> Un error común es forzar un patrón donde no corresponde. Si sientes que un patrón no aplica bien, documéntalo en tu análisis: eso también demuestra criterio técnico.

---

_Bootcamp de Arquitectura de Software · SENA · bc-channel-epti_
