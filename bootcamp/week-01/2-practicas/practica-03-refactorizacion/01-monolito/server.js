/**
 * SISTEMA MONOLÍTICO DE E-COMMERCE
 *
 * ⚠️ PROBLEMAS ARQUITECTÓNICOS:
 * - Toda la lógica en un solo archivo
 * - Acoplamiento entre módulos (Users, Products, Orders)
 * - No se puede escalar por partes
 * - Base de datos compartida (en memoria)
 * - Cambios en una parte afectan todo el sistema
 *
 * TU OBJETIVO: Identificar bounded contexts y migrar a microservicios
 */

import express from 'express';

const app = express();
app.use(express.json());

// ============================================
// BASE DE DATOS EN MEMORIA (COMPARTIDA)
// ============================================

const users = [];
const products = [];
const orders = [];

let userId = 1;
let productId = 1;
let orderId = 1;

// ============================================
// MÓDULO: USUARIOS
// ============================================

/**
 * Crear usuario
 * POST /api/users
 */
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;

  // Validación básica
  if (!name || !email) {
    return res.status(400).json({ error: 'Nombre y email son requeridos' });
  }

  // Verificar email duplicado
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'Email ya registrado' });
  }

  const newUser = {
    id: userId++,
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  console.log(`✅ Usuario creado: ${newUser.name} (ID: ${newUser.id})`);
  res.status(201).json(newUser);
});

/**
 * Listar todos los usuarios
 * GET /api/users
 */
app.get('/api/users', (req, res) => {
  console.log(`📋 Listando ${users.length} usuarios`);
  res.json(users);
});

/**
 * Obtener usuario por ID
 * GET /api/users/:id
 */
app.get('/api/users/:id', (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  res.json(user);
});

// ============================================
// MÓDULO: PRODUCTOS
// ============================================

/**
 * Crear producto
 * POST /api/products
 */
app.post('/api/products', (req, res) => {
  const { name, price, stock } = req.body;

  // Validación
  if (!name || price === undefined || stock === undefined) {
    return res.status(400).json({
      error: 'Nombre, precio y stock son requeridos',
    });
  }

  if (price < 0) {
    return res.status(400).json({ error: 'Precio debe ser positivo' });
  }

  if (stock < 0) {
    return res.status(400).json({ error: 'Stock debe ser positivo' });
  }

  const newProduct = {
    id: productId++,
    name,
    price,
    stock,
    createdAt: new Date().toISOString(),
  };

  products.push(newProduct);

  console.log(`✅ Producto creado: ${newProduct.name} (ID: ${newProduct.id})`);
  res.status(201).json(newProduct);
});

/**
 * Listar todos los productos
 * GET /api/products
 */
app.get('/api/products', (req, res) => {
  console.log(`📋 Listando ${products.length} productos`);
  res.json(products);
});

/**
 * Obtener producto por ID
 * GET /api/products/:id
 */
app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.json(product);
});

/**
 * Actualizar stock de producto
 * PUT /api/products/:id/stock
 */
app.put('/api/products/:id/stock', (req, res) => {
  const { quantity } = req.body;

  const product = products.find((p) => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  if (quantity < 0) {
    return res.status(400).json({ error: 'Stock no puede ser negativo' });
  }

  const oldStock = product.stock;
  product.stock = quantity;

  console.log(
    `📦 Stock actualizado: ${product.name} (${oldStock} → ${quantity})`,
  );
  res.json(product);
});

// ============================================
// MÓDULO: ÓRDENES
// ============================================

/**
 * Crear orden
 * POST /api/orders
 *
 * ⚠️ PROBLEMA: Esta función hace demasiadas cosas
 * - Valida usuario
 * - Valida producto
 * - Calcula total
 * - Actualiza stock
 * - Crea orden
 *
 * En microservicios, esto se distribuiría entre servicios
 */
app.post('/api/orders', (req, res) => {
  const {
    userId: requestUserId,
    productId: requestProductId,
    quantity,
  } = req.body;

  // Validación básica
  if (!requestUserId || !requestProductId || !quantity) {
    return res.status(400).json({
      error: 'userId, productId y quantity son requeridos',
    });
  }

  if (quantity <= 0) {
    return res.status(400).json({ error: 'Cantidad debe ser positiva' });
  }

  // 1. Verificar que usuario existe
  const user = users.find((u) => u.id === requestUserId);
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // 2. Verificar que producto existe
  const product = products.find((p) => p.id === requestProductId);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  // 3. Verificar stock suficiente
  if (product.stock < quantity) {
    return res.status(400).json({
      error: 'Stock insuficiente',
      available: product.stock,
      requested: quantity,
    });
  }

  // 4. Calcular total
  const unitPrice = product.price;
  const total = unitPrice * quantity;

  // 5. Crear orden
  const newOrder = {
    id: orderId++,
    userId: requestUserId,
    userName: user.name,
    productId: requestProductId,
    productName: product.name,
    quantity,
    unitPrice,
    total,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);

  // 6. Actualizar stock del producto
  const newStock = product.stock - quantity;
  product.stock = newStock;

  console.log(
    `✅ Orden creada: ID ${newOrder.id} - ${user.name} compró ${quantity}x ${product.name}`,
  );
  console.log(`📦 Stock actualizado: ${product.name} (${newStock} restantes)`);

  res.status(201).json(newOrder);
});

/**
 * Listar todas las órdenes
 * GET /api/orders
 */
app.get('/api/orders', (req, res) => {
  console.log(`📋 Listando ${orders.length} órdenes`);
  res.json(orders);
});

/**
 * Obtener orden por ID
 * GET /api/orders/:id
 */
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find((o) => o.id === parseInt(req.params.id));

  if (!order) {
    return res.status(404).json({ error: 'Orden no encontrada' });
  }

  res.json(order);
});

// ============================================
// ENDPOINT DE SALUD
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Ecommerce Monolito',
    timestamp: new Date().toISOString(),
    stats: {
      users: users.length,
      products: products.length,
      orders: orders.length,
    },
  });
});

// ============================================
// INICIO DEL SERVIDOR
// ============================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║  🏢 SISTEMA MONOLÍTICO E-COMMERCE    ║
╠═══════════════════════════════════════╣
║  Puerto: ${PORT}                        ║
║  Endpoints:                          ║
║  - POST /api/users                   ║
║  - GET  /api/users                   ║
║  - POST /api/products                ║
║  - GET  /api/products                ║
║  - POST /api/orders                  ║
║  - GET  /api/orders                  ║
║  - GET  /health                      ║
╚═══════════════════════════════════════╝

⚠️  PROBLEMAS ARQUITECTÓNICOS:
- Todo acoplado en 1 archivo
- No escala por partes
- Cambios afectan todo el sistema
- BD compartida (en memoria)

🎯 TU MISIÓN: Refactorizar a microservicios
  `);
});
