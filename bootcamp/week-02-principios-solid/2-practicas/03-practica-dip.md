# 💪 Práctica 03: Aplicando Dependency Inversion Principle (DIP)

## 🎯 Objetivo

Aprender a desacoplar módulos de alto nivel (lógica de negocio) de módulos de bajo nivel (detalles técnicos) mediante abstracciones e inyección de dependencias.

---

## 📋 Caso de Estudio: Sistema de Reportes

Trabajas en **DataViz**, una plataforma de análisis de datos. El sistema genera reportes, pero está acoplado a MongoDB. Necesitan soportar PostgreSQL y Redis sin modificar la lógica.

---

## ❌ Código con Violación de DIP

```javascript
/**
 * ❌ VIOLACIÓN DE DIP
 * ReportService depende de implementación concreta (MongoDB)
 */

class MongoDBClient {
  connect() {
    console.log('🍃 Conectado a MongoDB');
  }

  query(collection, filter) {
    console.log(`🔍 Query en ${collection}:`, filter);
    return [{ id: 1, data: 'Dato de Mongo' }];
  }
}

// ⚠️ Alto nivel depende de bajo nivel (MongoDB)
class ReportService {
  constructor() {
    this.db = new MongoDBClient(); // ❌ Dependencia concreta
  }

  generateSalesReport() {
    this.db.connect();
    const sales = this.db.query('sales', { date: '2026-01' });

    return {
      title: 'Reporte de Ventas',
      data: sales,
      total: sales.length,
    };
  }
}

// Problemas:
// - No puedes testear sin MongoDB
// - No puedes cambiar a PostgreSQL
// - ReportService acoplado a detalles técnicos
```

---

## ✅ Solución: Aplicando DIP

### Paso 1: Definir Abstracción (Interface)

```javascript
/**
 * ✅ Abstracción: Contrato para cualquier base de datos
 */
class Database {
  connect() {
    throw new Error('Implementar connect()');
  }

  query(collection, filter) {
    throw new Error('Implementar query()');
  }

  disconnect() {
    throw new Error('Implementar disconnect()');
  }
}
```

---

### Paso 2: Implementar Detalles Concretos

```javascript
// ✅ Detalle: MongoDB
class MongoDBClient extends Database {
  connect() {
    console.log('🍃 MongoDB conectado');
    return true;
  }

  query(collection, filter) {
    console.log(`🔍 Mongo query en ${collection}`);
    return [
      { id: 1, amount: 1000, product: 'Laptop' },
      { id: 2, amount: 500, product: 'Mouse' },
    ];
  }

  disconnect() {
    console.log('🍃 MongoDB desconectado');
  }
}

// ✅ Detalle: PostgreSQL
class PostgreSQLClient extends Database {
  connect() {
    console.log('🐘 PostgreSQL conectado');
    return true;
  }

  query(table, filter) {
    console.log(`🔍 SQL query en ${table}`);
    return [
      { id: 1, amount: 1200, product: 'Keyboard' },
      { id: 2, amount: 300, product: 'Cable' },
    ];
  }

  disconnect() {
    console.log('🐘 PostgreSQL desconectado');
  }
}

// ✅ Detalle: Mock para testing
class MockDatabase extends Database {
  #data = [{ id: 999, amount: 100, product: 'Test Product' }];

  connect() {
    console.log('🧪 Mock DB conectado');
    return true;
  }

  query(collection, filter) {
    return this.#data;
  }

  disconnect() {
    console.log('🧪 Mock DB desconectado');
  }
}
```

---

### Paso 3: Servicio de Alto Nivel (Depende de Abstracción)

```javascript
/**
 * ✅ APLICANDO DIP
 * ReportService depende de abstracción Database
 */
class ReportService {
  #database;

  constructor(database) {
    this.#database = database; // ✅ Inyección de dependencia
  }

  generateSalesReport() {
    this.#database.connect();
    const sales = this.#database.query('sales', { date: '2026-01' });

    const total = sales.reduce((sum, sale) => sum + sale.amount, 0);

    this.#database.disconnect();

    return {
      title: 'Reporte de Ventas',
      period: '2026-01',
      data: sales,
      total,
      count: sales.length,
    };
  }

  generateInventoryReport() {
    this.#database.connect();
    const inventory = this.#database.query('inventory', {});

    this.#database.disconnect();

    return {
      title: 'Reporte de Inventario',
      items: inventory,
      count: inventory.length,
    };
  }
}
```

---

### Paso 4: Uso con Diferentes Implementaciones

```javascript
// Producción con MongoDB
const mongoDb = new MongoDBClient();
const reportServiceMongo = new ReportService(mongoDb);
console.log('\n📊 Reporte con MongoDB:');
console.log(reportServiceMongo.generateSalesReport());

// Producción con PostgreSQL
const postgresDb = new PostgreSQLClient();
const reportServicePostgres = new ReportService(postgresDb);
console.log('\n📊 Reporte con PostgreSQL:');
console.log(reportServicePostgres.generateSalesReport());

// Testing con Mock
const mockDb = new MockDatabase();
const reportServiceTest = new ReportService(mockDb);
console.log('\n🧪 Reporte con Mock (Testing):');
console.log(reportServiceTest.generateSalesReport());
```

---

## 🎯 Beneficios de Aplicar DIP

| Aspecto       | Antes (Violación) | Después (DIP)     |
| ------------- | ----------------- | ----------------- |
| Acoplamiento  | Alto              | Bajo              |
| Testing       | Imposible         | Fácil (mocks)     |
| Cambiar BD    | Modificar código  | Cambiar inyección |
| Flexibilidad  | Cero              | Máxima            |
| Reutilización | Imposible         | Total             |

---

## 🧪 Ejercicio Práctico

**Tarea**: Implementa `RedisClient` que almacene datos en caché y úsalo en `ReportService` sin modificarlo.

<details>
<summary>💡 Ver Solución</summary>

```javascript
class RedisClient extends Database {
  #cache = new Map();

  connect() {
    console.log('📦 Redis conectado');
    return true;
  }

  query(key, filter) {
    console.log(`🔍 Redis GET ${key}`);
    return this.#cache.get(key) || [];
  }

  disconnect() {
    console.log('📦 Redis desconectado');
  }

  // Método adicional para cachear
  cache(key, data) {
    this.#cache.set(key, data);
  }
}

// Uso
const redis = new RedisClient();
redis.cache('sales', [{ id: 1, amount: 5000 }]);

const reportServiceRedis = new ReportService(redis);
console.log(reportServiceRedis.generateSalesReport());
```

</details>

---

## 🏆 Conclusión

**DIP = Invertir la dirección de las dependencias**

- Alto nivel define la abstracción
- Bajo nivel implementa la abstracción
- Ambos dependen de la abstracción, no entre sí

**Técnica clave**: Inyección de dependencias

---

**Bootcamp de Arquitectura de Software - Semana 02**
_SENA - Tecnología en Análisis y Desarrollo de Software_
