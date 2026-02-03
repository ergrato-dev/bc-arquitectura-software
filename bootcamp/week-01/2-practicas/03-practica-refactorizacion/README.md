# 💻 Práctica 03: Refactorización Monolito → Microservicios

## 🎯 Objetivos

- Comprender código monolítico y sus limitaciones
- Identificar bounded contexts para microservicios
- Aplicar el patrón Strangler Fig para migración gradual
- Implementar comunicación entre servicios

**Duración:** 90 minutos  
**Nivel:** Intermedio  
**Requisitos:** Node.js, pnpm, Docker (opcional)

---

## 📋 Escenario

Tienes un **sistema monolítico de e-commerce** que necesita evolucionar a microservicios para:

- Escalar componentes independientemente
- Permitir que múltiples equipos trabajen en paralelo
- Desplegar funcionalidades sin afectar todo el sistema

**Sistema actual:** Todo en un solo archivo con lógica mezclada

**Sistema objetivo:** Servicios independientes que se comunican vía HTTP

---

## 📂 Estructura del Proyecto

```
practica-03-refactorizacion/
├── README.md (este archivo)
├── 01-monolito/
│   ├── package.json
│   └── server.js (código monolítico)
├── 02-microservicios/
│   ├── users-service/
│   │   ├── package.json
│   │   └── server.js
│   ├── products-service/
│   │   ├── package.json
│   │   └── server.js
│   ├── orders-service/
│   │   ├── package.json
│   │   └── server.js
│   └── api-gateway/
│       ├── package.json
│       └── server.js
└── 03-solucion/ (código de referencia)
```

---

## 🔧 Paso 1: Analizar el Monolito (15 min)

### 1.1 Ejecutar el Sistema Monolítico

```bash
# Ir al directorio del monolito
cd 01-monolito

# Instalar dependencias
pnpm install

# Ejecutar servidor
pnpm start
```

El servidor iniciará en `http://localhost:3000`

### 1.2 Probar Endpoints

```bash
# Crear usuario
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Juan Pérez", "email": "juan@example.com"}'

# Listar usuarios
curl http://localhost:3000/api/users

# Crear producto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "price": 1200, "stock": 10}'

# Listar productos
curl http://localhost:3000/api/products

# Crear orden
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "productId": 1, "quantity": 2}'

# Listar órdenes
curl http://localhost:3000/api/orders
```

### 1.3 Tarea: Identificar Problemas

Lee el código `01-monolito/server.js` y responde:

1. **¿Qué problemas de acoplamiento identificas?**
   - [ ] Toda la lógica está en un solo archivo
   - [ ] Cambios en una funcionalidad afectan el resto
   - [ ] No se puede escalar por partes
   - [ ] Base de datos compartida (arrays en memoria)

2. **¿Cuántos bounded contexts diferentes ves?**
   - [ ] Users (gestión de usuarios)
   - [ ] Products (catálogo de productos)
   - [ ] Orders (procesamiento de órdenes)

3. **¿Qué pasaría si el tráfico de órdenes crece 10x?**
   - [ ] Todo el sistema se vería afectado
   - [ ] No puedes escalar solo Orders

---

## 🏗️ Paso 2: Diseñar la Arquitectura de Microservicios (20 min)

### 2.1 Identificar Servicios

Dibuja un diagrama de contexto con:

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    Users     │       │   Products   │       │    Orders    │
│   Service    │       │   Service    │       │   Service    │
│  Puerto 3001 │       │  Puerto 3002 │       │  Puerto 3003 │
└──────┬───────┘       └──────┬───────┘       └──────┬───────┘
       │                      │                      │
       └──────────────────────┴──────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   API Gateway     │
                    │   Puerto 3000     │
                    └───────────────────┘
```

### 2.2 Definir Responsabilidades

**Users Service (Puerto 3001):**

- Crear usuario
- Listar usuarios
- Obtener usuario por ID
- BD: Array de usuarios

**Products Service (Puerto 3002):**

- Crear producto
- Listar productos
- Obtener producto por ID
- Actualizar stock
- BD: Array de productos

**Orders Service (Puerto 3003):**

- Crear orden (llama a Users y Products)
- Listar órdenes
- Validar orden
- BD: Array de órdenes

**API Gateway (Puerto 3000):**

- Enrutar peticiones a servicios
- Punto único de entrada
- (Opcional) Autenticación/Rate limiting

---

## 💻 Paso 3: Implementar Users Service (15 min)

### 3.1 Crear Estructura

```bash
cd 02-microservicios/users-service
pnpm init
pnpm add express
```

### 3.2 Implementar `server.js`

```javascript
import express from 'express';

const app = express();
app.use(express.json());

// Base de datos en memoria
const users = [];
let userId = 1;

// Crear usuario
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  const newUser = {
    id: userId++,
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// Listar usuarios
app.get('/users', (req, res) => {
  res.json(users);
});

// Obtener usuario por ID
app.get('/users/:id', (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  res.json(user);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Users Service corriendo en puerto ${PORT}`);
});
```

### 3.3 Configurar `package.json`

```json
{
  "name": "users-service",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

### 3.4 Probar el Servicio

```bash
# Terminal 1: Ejecutar servicio
pnpm start

# Terminal 2: Probar
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Ana García", "email": "ana@example.com"}'

curl http://localhost:3001/users
```

---

## 🛍️ Paso 4: Implementar Products Service (15 min)

**Tu tarea:** Implementa el servicio de productos siguiendo el mismo patrón.

### Requisitos:

- Puerto: 3002
- Endpoints:
  - `POST /products` - Crear producto
  - `GET /products` - Listar productos
  - `GET /products/:id` - Obtener producto
  - `PUT /products/:id/stock` - Actualizar stock

### Código Base:

```javascript
import express from 'express';

const app = express();
app.use(express.json());

const products = [];
let productId = 1;

// TODO: Implementar endpoints

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🛍️ Products Service corriendo en puerto ${PORT}`);
});
```

---

## 📦 Paso 5: Implementar Orders Service con Comunicación (25 min)

Este servicio es el más complejo porque **llama a otros servicios**.

### 5.1 Instalar Dependencias

```bash
cd 02-microservicios/orders-service
pnpm init
pnpm add express node-fetch
```

### 5.2 Implementar con Llamadas HTTP

```javascript
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const orders = [];
let orderId = 1;

// URLs de otros servicios
const USERS_SERVICE = process.env.USERS_SERVICE || 'http://localhost:3001';
const PRODUCTS_SERVICE =
  process.env.PRODUCTS_SERVICE || 'http://localhost:3002';

// Crear orden (orquesta Users y Products)
app.post('/orders', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // 1. Verificar que usuario existe
    const userResponse = await fetch(`${USERS_SERVICE}/users/${userId}`);
    if (!userResponse.ok) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const user = await userResponse.json();

    // 2. Verificar que producto existe
    const productResponse = await fetch(
      `${PRODUCTS_SERVICE}/products/${productId}`,
    );
    if (!productResponse.ok) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const product = await productResponse.json();

    // 3. Validar stock suficiente
    if (product.stock < quantity) {
      return res.status(400).json({
        error: 'Stock insuficiente',
        available: product.stock,
        requested: quantity,
      });
    }

    // 4. Calcular total
    const total = product.price * quantity;

    // 5. Crear orden
    const newOrder = {
      id: orderId++,
      userId,
      userName: user.name,
      productId,
      productName: product.name,
      quantity,
      unitPrice: product.price,
      total,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);

    // 6. Actualizar stock del producto
    await fetch(`${PRODUCTS_SERVICE}/products/${productId}/stock`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: product.stock - quantity }),
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('❌ Error al crear orden:', error.message);
    res.status(500).json({ error: 'Error al procesar orden' });
  }
});

// Listar órdenes
app.get('/orders', (req, res) => {
  res.json(orders);
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`📦 Orders Service corriendo en puerto ${PORT}`);
});
```

---

## 🌐 Paso 6: Implementar API Gateway (Opcional - 20 min)

El API Gateway unifica todos los servicios bajo un solo endpoint.

```javascript
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

// URLs de servicios
const USERS_SERVICE = 'http://localhost:3001';
const PRODUCTS_SERVICE = 'http://localhost:3002';
const ORDERS_SERVICE = 'http://localhost:3003';

// Proxy genérico
const proxyRequest = async (serviceUrl, path, method, body) => {
  const url = `${serviceUrl}${path}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  return response.json();
};

// Rutas de Users
app.all('/api/users*', async (req, res) => {
  try {
    const path = req.path.replace('/api', '');
    const data = await proxyRequest(USERS_SERVICE, path, req.method, req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas de Products
app.all('/api/products*', async (req, res) => {
  try {
    const path = req.path.replace('/api', '');
    const data = await proxyRequest(
      PRODUCTS_SERVICE,
      path,
      req.method,
      req.body,
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas de Orders
app.all('/api/orders*', async (req, res) => {
  try {
    const path = req.path.replace('/api', '');
    const data = await proxyRequest(ORDERS_SERVICE, path, req.method, req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🌐 API Gateway corriendo en puerto ${PORT}`);
});
```

---

## 🚀 Paso 7: Ejecutar Todo el Sistema (10 min)

### 7.1 Ejecutar Todos los Servicios

Necesitas **4 terminales**:

```bash
# Terminal 1: Users Service
cd 02-microservicios/users-service
pnpm start

# Terminal 2: Products Service
cd 02-microservicios/products-service
pnpm start

# Terminal 3: Orders Service
cd 02-microservicios/orders-service
pnpm start

# Terminal 4: API Gateway (opcional)
cd 02-microservicios/api-gateway
pnpm start
```

### 7.2 Probar el Sistema Completo

```bash
# Crear usuario
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Carlos López", "email": "carlos@example.com"}'

# Crear producto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Mouse Gamer", "price": 50, "stock": 100}'

# Crear orden (vincula user y product)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "productId": 1, "quantity": 3}'

# Ver órdenes
curl http://localhost:3000/api/orders
```

---

## 📊 Comparación: Antes vs Después

| Aspecto           | Monolito         | Microservicios             |
| ----------------- | ---------------- | -------------------------- |
| **Archivos**      | 1 archivo grande | 4 servicios independientes |
| **Escalabilidad** | Todo o nada      | Por servicio               |
| **Despliegue**    | Todo junto       | Independiente              |
| **Equipo**        | 1 equipo         | Múltiples equipos          |
| **Fallas**        | Todo cae         | Fallas aisladas            |
| **Complejidad**   | Baja inicial     | Alta (comunicación)        |

---

## ✅ Ejercicios Adicionales

### Ejercicio 1: Manejo de Errores

¿Qué pasa si Products Service está caído cuando Orders intenta crear una orden?

**Implementa:**

- Circuit breaker básico
- Retry logic con exponential backoff

### Ejercicio 2: Base de Datos por Servicio

Reemplaza arrays en memoria con:

- SQLite para cada servicio
- PostgreSQL con esquemas separados

### Ejercicio 3: Event-Driven

En lugar de llamadas HTTP síncronas, implementa:

- Cola de mensajes (RabbitMQ/Redis)
- Eventos: `OrderCreated`, `StockUpdated`

---

## 🎯 Preguntas de Reflexión

1. **¿Cuándo preferirías monolito vs microservicios?**

2. **¿Qué problemas nuevos introducen los microservicios?**
   - Comunicación de red
   - Consistencia eventual
   - Debugging distribuido

3. **¿Cómo aplicarías Strangler Fig Pattern para migrar gradualmente?**
   - Fase 1: Monolito + Users Service
   - Fase 2: + Products Service
   - Fase 3: + Orders Service
   - Fase 4: Retirar monolito

4. **¿Qué atributos de calidad mejoran con microservicios?**
   - Escalabilidad ✅
   - Disponibilidad ✅
   - Mantenibilidad ✅
   - Simplicidad ❌ (se complica)

---

## 📚 Recursos Adicionales

- [Martin Fowler - Microservices](https://martinfowler.com/articles/microservices.html)
- [12-Factor App](https://12factor.net/)
- [Strangler Fig Pattern](https://martinfowler.com/bliki/StranglerFigApplication.html)

---

**Bootcamp de Arquitectura de Software**  
_SENA - Week 01 - Práctica 03_

_¡Refactorizar es evolucionar, no reescribir!_ 🚀
