# 🎯 Reto Semana 03: Refactorizar "ShopNow" a Arquitectura en Capas

## 📋 Contexto del Reto

**ShopNow** es una aplicación de comercio electrónico que ha crecido rápidamente. El código inicial fue desarrollado sin estructura arquitectónica clara, mezclando lógica de negocio, acceso a datos y presentación en un solo archivo. Ahora el equipo necesita:

- ✅ Escalabilidad para agregar nuevas funcionalidades
- ✅ Mantenibilidad para corregir bugs sin romper otras partes
- ✅ Testeo independiente de cada capa
- ✅ Posibilidad de cambiar la base de datos sin afectar la lógica de negocio

---

## 🚨 Problema: Código Monolítico sin Estructura

### Código Actual (Violaciones Arquitectónicas)

```javascript
// shopnow-monolithic.js - TODO MEZCLADO ❌

const products = []; // "Base de datos" en memoria
let productIdCounter = 1;

// ❌ VIOLACIÓN: Lógica de negocio mezclada con acceso a datos y validación
function addProduct(name, price, stock) {
  // Validación mezclada
  if (!name || name.trim() === '') {
    throw new Error('Nombre inválido');
  }
  if (price <= 0) {
    throw new Error('Precio debe ser mayor a 0');
  }
  if (stock < 0) {
    throw new Error('Stock no puede ser negativo');
  }

  // Creación de producto (lógica de negocio)
  const product = {
    id: productIdCounter++,
    name: name.trim(),
    price,
    stock,
    active: true,
    createdAt: new Date(),
  };

  // Persistencia mezclada
  products.push(product);

  // Presentación mezclada
  console.log(`✅ Producto ${product.name} agregado con ID ${product.id}`);

  return product;
}

// ❌ VIOLACIÓN: Lógica de descuento mezclada con acceso a datos
function applyDiscount(productId, discountPercentage) {
  // Buscar en "base de datos"
  const product = products.find((p) => p.id === productId);

  if (!product) {
    throw new Error('Producto no encontrado');
  }

  if (discountPercentage < 0 || discountPercentage > 100) {
    throw new Error('Descuento inválido');
  }

  // Cálculo de descuento (lógica de negocio)
  const discountAmount = product.price * (discountPercentage / 100);
  product.price = product.price - discountAmount;

  // Presentación mezclada
  console.log(
    `💰 Descuento del ${discountPercentage}% aplicado. Nuevo precio: $${product.price}`,
  );

  return product;
}

// ❌ VIOLACIÓN: Búsqueda con formato de presentación mezclado
function searchProducts(query) {
  const results = products.filter(
    (p) => p.name.toLowerCase().includes(query.toLowerCase()) && p.active,
  );

  // Formateo mezclado con lógica
  console.log(`🔍 Búsqueda: "${query}"`);
  results.forEach((p) => {
    console.log(`  - ${p.name} ($${p.price}) - Stock: ${p.stock}`);
  });

  return results;
}

// ❌ VIOLACIÓN: Lógica de inventario mezclada con notificaciones
function updateStock(productId, quantity) {
  const product = products.find((p) => p.id === productId);

  if (!product) {
    throw new Error('Producto no encontrado');
  }

  product.stock += quantity;

  // Notificación mezclada
  if (product.stock < 10) {
    console.log(
      `⚠️ ALERTA: Stock bajo para ${product.name} (${product.stock} unidades)`,
    );
  }

  return product;
}

// ❌ USO: Todo mezclado
addProduct('Laptop Dell', 1200, 15);
addProduct('Mouse Logitech', 25, 50);
applyDiscount(1, 10); // 10% descuento
searchProducts('dell');
updateStock(1, -5);
```

### 🔴 Problemas Arquitectónicos Identificados:

1. **Violación de Separation of Concerns**: Validación, lógica de negocio, persistencia y presentación en mismo archivo
2. **Alto Acoplamiento**: Cambiar la base de datos requiere modificar toda la aplicación
3. **Difícil Testing**: No se puede testear lógica de negocio sin ejecutar console.log
4. **No escalable**: Agregar nuevos canales de presentación (API, CLI, UI) requiere duplicar código
5. **Responsabilidades mezcladas**: Una función hace validación + cálculo + persistencia + notificación

---

## 🎯 Tu Misión

Refactorizar **ShopNow** aplicando **Arquitectura en Capas (Layered Architecture)** con 3 capas principales:

```
┌─────────────────────────────────────┐
│   CAPA DE PRESENTACIÓN              │
│   (Interfaz con usuario/sistema)    │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│   CAPA DE LÓGICA DE NEGOCIO         │
│   (Reglas, cálculos, validaciones)  │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│   CAPA DE PERSISTENCIA              │
│   (Acceso a datos)                  │
└─────────────────────────────────────┘
```

---

## 📝 Requerimientos del Reto

### 1. Capa de Persistencia (Data Layer)

Crear `ProductRepository` que maneje SOLO acceso a datos:

```javascript
// src/data/product-repository.js

class ProductRepository {
  #products = [];
  #currentId = 1;

  save(product) {
    // SOLO persistencia
  }

  findById(id) {
    // SOLO búsqueda
  }

  findAll() {
    // SOLO recuperación
  }

  update(product) {
    // SOLO actualización
  }
}
```

### 2. Capa de Lógica de Negocio (Business Layer)

Crear servicios que manejen SOLO reglas de negocio:

```javascript
// src/business/product-service.js

class ProductService {
  constructor(productRepository, notificationService) {
    this.productRepository = productRepository;
    this.notificationService = notificationService;
  }

  createProduct(name, price, stock) {
    // 1. Validar datos
    // 2. Crear entidad de dominio
    // 3. Llamar a repositorio para persistir
    // 4. Notificar si es necesario
  }

  applyDiscount(productId, percentage) {
    // 1. Obtener producto
    // 2. Validar descuento
    // 3. Calcular nuevo precio
    // 4. Actualizar en repositorio
  }
}
```

### 3. Capa de Presentación (Presentation Layer)

Crear interfaz que SOLO formatee y muestre información:

```javascript
// src/presentation/cli-interface.js

class CLIInterface {
  constructor(productService) {
    this.productService = productService;
  }

  displayProduct(product) {
    // SOLO presentación
    console.log(`${product.name} - $${product.price}`);
  }

  displaySearchResults(products) {
    // SOLO formateo de resultados
  }
}
```

### 4. Estructura de Carpetas Esperada

```
bootcamp/week-03-patrones-arquitectonicos-clasicos/reto-shopnow/
├── package.json
├── README.md
├── src/
│   ├── data/                    # CAPA DE PERSISTENCIA
│   │   └── product-repository.js
│   ├── business/                # CAPA DE NEGOCIO
│   │   ├── product-service.js
│   │   ├── discount-calculator.js
│   │   └── notification-service.js
│   ├── presentation/            # CAPA DE PRESENTACIÓN
│   │   └── cli-interface.js
│   ├── domain/                  # Entidades (opcional)
│   │   └── product.js
│   └── index.js                 # Punto de entrada
└── tests/
    └── product-service.test.js
```

---

## ✅ Criterios de Éxito

### Separación de Capas (40%)

- [ ] Repositorio maneja SOLO persistencia (sin validaciones ni cálculos)
- [ ] Servicio maneja SOLO lógica de negocio (sin console.log)
- [ ] Interfaz maneja SOLO presentación (sin cálculos)

### Bajo Acoplamiento (30%)

- [ ] Capas se comunican mediante interfaces claras
- [ ] Cambiar repositorio (in-memory → PostgreSQL) no afecta lógica de negocio
- [ ] Cambiar presentación (CLI → API) no afecta servicios

### Funcionalidad Completa (20%)

- [ ] Crear productos
- [ ] Aplicar descuentos
- [ ] Buscar productos
- [ ] Actualizar inventario
- [ ] Notificaciones de stock bajo

### Código Limpio (10%)

- [ ] JavaScript ES2023 (clases, campos privados #, const/let)
- [ ] Nombres descriptivos
- [ ] Comentarios explicativos en cada capa

---

## 🎁 Bonus (Opcional +15%)

### Bonus 1: Variante Event-Driven (+5%)

Implementar notificaciones usando patrón Observer/Event-Driven:

```javascript
// src/business/event-emitter.js
class EventEmitter {
  #listeners = new Map();

  on(event, callback) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, []);
    }
    this.#listeners.get(event).push(callback);
  }

  emit(event, data) {
    const listeners = this.#listeners.get(event) || [];
    listeners.forEach((callback) => callback(data));
  }
}

// En ProductService
this.emit('product:created', product);
this.emit('stock:low', { product, stock: product.stock });
```

### Bonus 2: Tests Unitarios (+5%)

```javascript
// tests/product-service.test.js
import { ProductService } from '../src/business/product-service.js';

// Test: Debe crear producto válido
// Test: Debe rechazar precio negativo
// Test: Debe aplicar descuento correctamente
```

### Bonus 3: Múltiples Repositorios (+5%)

Crear `FileRepository` y `MemoryRepository` con misma interfaz.

---

## 📊 Evaluación

| Criterio                | Peso | Descripción                              |
| ----------------------- | ---- | ---------------------------------------- |
| **Separación correcta** | 40%  | Cada capa tiene una sola responsabilidad |
| **Bajo acoplamiento**   | 30%  | Capas intercambiables sin romper código  |
| **Funcionalidad**       | 20%  | Todas las operaciones funcionan          |
| **Código limpio**       | 10%  | ES2023, nombres claros, comentarios      |
| **Bonus**               | +15% | Event-Driven, tests, múltiples repos     |

**Total posible**: 115% (100% + 15% bonus)

---

## 🚀 Cómo Empezar

### Paso 1: Crear estructura de carpetas

```bash
mkdir -p bootcamp/week-03-patrones-arquitectonicos-clasicos/reto-shopnow/src/{data,business,presentation,domain}
mkdir -p bootcamp/week-03-patrones-arquitectonicos-clasicos/reto-shopnow/tests
cd bootcamp/week-03-patrones-arquitectonicos-clasicos/reto-shopnow
pnpm init
```

### Paso 2: Identificar responsabilidades

Revisa el código monolítico y anota:

- ¿Qué líneas corresponden a PERSISTENCIA?
- ¿Qué líneas corresponden a LÓGICA DE NEGOCIO?
- ¿Qué líneas corresponden a PRESENTACIÓN?

### Paso 3: Crear capa de persistencia primero

Comienza por el repositorio (más bajo nivel).

### Paso 4: Crear capa de negocio

Servicios que usan el repositorio.

### Paso 5: Crear capa de presentación

Interfaz que usa los servicios.

### Paso 6: Conectar todo en index.js

```javascript
// src/index.js
import { ProductRepository } from './data/product-repository.js';
import { ProductService } from './business/product-service.js';
import { CLIInterface } from './presentation/cli-interface.js';

// Inyección de dependencias (siguiente semana veremos DIP)
const repository = new ProductRepository();
const service = new ProductService(repository);
const cli = new CLIInterface(service);

// Usar la aplicación
const product = service.createProduct('Laptop', 1200, 15);
cli.displayProduct(product);
```

---

## 💡 Pistas

- **No dupliques datos entre capas**: Pasa entidades completas, no atributos sueltos
- **Inyección de dependencias**: Constructor recibe dependencias (repositories, services)
- **Interfaces claras**: Métodos con nombres descriptivos (`createProduct`, no `add`)
- **Validaciones en capa de negocio**: No en presentación ni persistencia
- **Repositorio sin lógica**: Solo CRUD (Create, Read, Update, Delete)

---

## 📚 Recursos de Apoyo

- **Teoría**: [Patrón en Capas](../1-teoria/02-patron-capas.md)
- **Ejemplo práctico**: [Implementación Layered](../2-practicas/02-practica-layered.md)
- **Videos**: [Serie Arquitectura en Capas](../4-recursos/videografia/README.md)

---

## 📅 Entrega

**Archivos a entregar:**

- Código refactorizado en carpetas por capa
- `README.md` explicando la estructura
- Diagrama de las 3 capas (opcional pero recomendado)

**Formato**: Carpeta `reto-shopnow/` dentro de tu repositorio

---

## 🎯 Reflexión Final

Después de completar el reto, responde:

1. ¿Qué ventajas tiene separar en capas vs código monolítico?
2. ¿Cómo cambiarías la base de datos ahora (in-memory → PostgreSQL)?
3. ¿Cómo agregarías una API REST sin modificar la lógica de negocio?
4. ¿Qué desventajas tiene la arquitectura en capas?

---

**¡Éxito en tu refactorización!** 🚀

**Bootcamp de Arquitectura de Software - Semana 03**  
_SENA - Tecnología en Análisis y Desarrollo de Software_  
_bc-channel-epti_
