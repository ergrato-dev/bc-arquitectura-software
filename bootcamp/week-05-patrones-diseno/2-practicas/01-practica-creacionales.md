# 💻 Práctica 01 — Patrones Creacionales en Acción

## 🎯 Objetivos

- Implementar **Factory Method** para un sistema de notificaciones extensible
- Implementar **Builder** para construcción de consultas de base de datos
- Reconocer cuándo cada patrón aplica mejor

## ⏱️ Duración estimada: 40 minutos

---

## 🏋️ Ejercicio 1 — Factory Method: Sistema de Notificaciones (20 min)

### El Escenario

La plataforma **EduFlow** (sistema de gestión de aprendizaje) necesita enviar notificaciones a los estudiantes. Actualmente solo tiene email, pero pronto necesitará SMS, push notifications y notificaciones en la app web.

### Paso 1 — Configura el proyecto

```bash
mkdir practica-creacionales && cd practica-creacionales
pnpm init
```

```json
// package.json — agrega el campo type
{
  "name": "practica-creacionales",
  "type": "module",
  "scripts": {
    "start": "node src/index.js"
  }
}
```

### Paso 2 — Crea la estructura base

```
practica-creacionales/
└── src/
    ├── index.js
    ├── factory/
    │   ├── notification.js          ← Base abstracta
    │   ├── email-notification.js
    │   ├── sms-notification.js
    │   ├── push-notification.js
    │   └── notification-factory.js  ← La Factory
    └── builder/
        ├── query-builder.js
        └── query-builder.demo.js
```

### Paso 3 — Implementa la base abstracta

```javascript
// src/factory/notification.js

/**
 * Clase base abstracta para todas las notificaciones
 * Define el contrato que deben cumplir las implementaciones concretas
 */
class Notification {
  /**
   * @param {string} recipient - Destino (email, teléfono, token, etc.)
   */
  constructor(recipient) {
    if (new.target === Notification) {
      throw new Error('Notification es una clase abstracta. No puede instanciarse directamente.');
    }
    this.recipient = recipient;
  }

  /**
   * @param {Object} payload - Contenido del mensaje
   * @param {string} payload.subject - Asunto o título
   * @param {string} payload.body - Cuerpo del mensaje
   * @returns {{ sent: boolean, timestamp: Date, channel: string }}
   */
  send(payload) {
    throw new Error('send() debe ser implementado por la subclase');
  }
}

export { Notification };
```

### Paso 4 — Implementa las notificaciones concretas

```javascript
// src/factory/email-notification.js
import { Notification } from './notification.js';

class EmailNotification extends Notification {
  send({ subject, body }) {
    // En producción: llamaría a SendGrid, SES o similar
    const result = {
      sent: true,
      timestamp: new Date(),
      channel: 'email',
      to: this.recipient,
      messageId: `email_${Date.now()}`,
    };
    console.log(`📧 Email → ${this.recipient} | Asunto: "${subject}"`);
    return result;
  }
}

export { EmailNotification };
```

```javascript
// src/factory/sms-notification.js
import { Notification } from './notification.js';

class SmsNotification extends Notification {
  send({ body }) {
    // Limitar a 160 caracteres (límite de SMS)
    const smsBody = body.substring(0, 160);
    
    const result = {
      sent: true,
      timestamp: new Date(),
      channel: 'sms',
      to: this.recipient,
      messageId: `sms_${Date.now()}`,
      truncated: body.length > 160,
    };
    console.log(`📱 SMS → ${this.recipient} | "${smsBody}"`);
    return result;
  }
}

export { SmsNotification };
```

```javascript
// src/factory/push-notification.js
import { Notification } from './notification.js';

class PushNotification extends Notification {
  send({ subject, body }) {
    const result = {
      sent: true,
      timestamp: new Date(),
      channel: 'push',
      deviceToken: this.recipient,
      messageId: `push_${Date.now()}`,
    };
    console.log(`🔔 Push → ${this.recipient.substring(0, 12)}... | "${subject}"`);
    return result;
  }
}

export { PushNotification };
```

### Paso 5 — Implementa la Factory

```javascript
// src/factory/notification-factory.js
import { EmailNotification } from './email-notification.js';
import { SmsNotification } from './sms-notification.js';
import { PushNotification } from './push-notification.js';

class NotificationFactory {
  // Registro de tipos disponibles — fácil de extender
  static #registry = new Map([
    ['email', EmailNotification],
    ['sms', SmsNotification],
    ['push', PushNotification],
  ]);

  /**
   * Registrar un nuevo tipo de notificación (extensibilidad)
   * @param {string} type - Identificador del tipo
   * @param {Function} NotificationClass - Clase que extiende Notification
   */
  static register(type, NotificationClass) {
    NotificationFactory.#registry.set(type, NotificationClass);
  }

  /**
   * Crear una notificación según el tipo
   * @param {string} type - 'email' | 'sms' | 'push'
   * @param {string} recipient - Destino de la notificación
   */
  static create(type, recipient) {
    const NotificationClass = NotificationFactory.#registry.get(type);
    if (!NotificationClass) {
      const available = [...NotificationFactory.#registry.keys()].join(', ');
      throw new Error(`Tipo "${type}" no registrado. Disponibles: ${available}`);
    }
    return new NotificationClass(recipient);
  }

  static getAvailableTypes() {
    return [...NotificationFactory.#registry.keys()];
  }
}

export { NotificationFactory };
```

### Paso 6 — Prueba el sistema

```javascript
// src/index.js
import { NotificationFactory } from './factory/notification-factory.js';

console.log('=== EduFlow — Sistema de Notificaciones ===\n');
console.log('Tipos disponibles:', NotificationFactory.getAvailableTypes());

// Simular notificación de "calificación publicada"
const notifications = [
  { type: 'email', recipient: 'ana.garcia@sena.edu.co' },
  { type: 'sms', recipient: '+573001234567' },
  { type: 'push', recipient: 'device_token_abc123def456' },
];

const payload = {
  subject: '¡Calificación publicada!',
  body: 'Tu calificación de la Semana 05 ya está disponible en el portal.',
};

notifications.forEach(({ type, recipient }) => {
  const notif = NotificationFactory.create(type, recipient);
  const result = notif.send(payload);
  console.log('Resultado:', result, '\n');
});

// ─── Bonus: Agregar nuevo tipo WITHOUT modificar código existente ───
console.log('=== Extensión: Canal WhatsApp (sin modificar factory) ===');

class WhatsAppNotification {
  constructor(phone) { this.phone = phone; }
  send({ body }) {
    console.log(`💬 WhatsApp → ${this.phone} | "${body}"`);
    return { sent: true, channel: 'whatsapp', to: this.phone };
  }
}

NotificationFactory.register('whatsapp', WhatsAppNotification);
const wa = NotificationFactory.create('whatsapp', '+573009876543');
wa.send({ body: '¡Tu tarea fue calificada!' });
```

### ✅ Ejecutar

```bash
pnpm start
```

### 🤔 Preguntas de Reflexión

1. ¿Qué principio SOLID se refuerza al usar `NotificationFactory.register()` para agregar nuevos tipos?
2. ¿Qué problema existiría si en lugar de la Factory usaras `if/else` en `index.js` para crear notificaciones?
3. ¿Dónde ves este patrón en frameworks que conoces (Express, React, etc.)?

---

## 🏋️ Ejercicio 2 — Builder: Constructor de Consultas SQL (20 min)

### El Escenario

El sistema de reportes de EduFlow necesita construir consultas SQL dinámicamente. Las consultas pueden ser simples o muy complejas (con múltiples filtros, ordenamiento, paginación).

### Implementación

```javascript
// src/builder/query-builder.js

class Query {
  constructor({ table, fields, conditions, orderBy, limit, offset }) {
    this.table = table;
    this.fields = fields;
    this.conditions = conditions;
    this.orderBy = orderBy;
    this.limit = limit;
    this.offset = offset;
  }

  toSQL() {
    const select = `SELECT ${this.fields.join(', ')}`;
    const from = `FROM ${this.table}`;
    const where = this.conditions.length > 0
      ? `WHERE ${this.conditions.join(' AND ')}`
      : '';
    const order = this.orderBy ? `ORDER BY ${this.orderBy}` : '';
    const limitClause = this.limit ? `LIMIT ${this.limit}` : '';
    const offsetClause = this.offset ? `OFFSET ${this.offset}` : '';

    return [select, from, where, order, limitClause, offsetClause]
      .filter(Boolean)
      .join(' ')
      .trim();
  }
}

class QueryBuilder {
  #table = '';
  #fields = ['*'];
  #conditions = [];
  #orderBy = null;
  #limit = null;
  #offset = null;

  from(table) {
    this.#table = table;
    return this;
  }

  select(...fields) {
    this.#fields = fields;
    return this;
  }

  where(condition) {
    this.#conditions.push(condition);
    return this;
  }

  orderBy(field, direction = 'ASC') {
    this.#orderBy = `${field} ${direction}`;
    return this;
  }

  limit(n) {
    this.#limit = n;
    return this;
  }

  offset(n) {
    this.#offset = n;
    return this;
  }

  // Página es más expresiva que limit+offset directo
  page(pageNumber, pageSize = 10) {
    this.#limit = pageSize;
    this.#offset = (pageNumber - 1) * pageSize;
    return this;
  }

  build() {
    if (!this.#table) throw new Error('La consulta requiere una tabla (usa .from())');
    return new Query({
      table: this.#table,
      fields: this.#fields,
      conditions: this.#conditions,
      orderBy: this.#orderBy,
      limit: this.#limit,
      offset: this.#offset,
    });
  }
}

export { QueryBuilder };
```

```javascript
// src/builder/query-builder.demo.js
import { QueryBuilder } from './query-builder.js';

console.log('=== EduFlow — Demo de Query Builder ===\n');

// Consulta 1: Simple
const q1 = new QueryBuilder()
  .from('students')
  .build();
console.log('Consulta simple:');
console.log(q1.toSQL());
// SELECT * FROM students

// Consulta 2: Con campos y filtros
const q2 = new QueryBuilder()
  .from('students')
  .select('id', 'name', 'email', 'grade')
  .where("status = 'active'")
  .where('grade >= 70')
  .orderBy('name')
  .build();
console.log('\nConsulta con filtros:');
console.log(q2.toSQL());
// SELECT id, name, email, grade FROM students WHERE status = 'active' AND grade >= 70 ORDER BY name ASC

// Consulta 3: Con paginación
const q3 = new QueryBuilder()
  .from('tasks')
  .select('id', 'title', 'status', 'assignee_id')
  .where("status != 'archived'")
  .orderBy('created_at', 'DESC')
  .page(2, 10)
  .build();
console.log('\nConsulta con paginación (página 2, 10 por página):');
console.log(q3.toSQL());
// SELECT id, title, status, assignee_id FROM tasks WHERE status != 'archived' ORDER BY created_at DESC LIMIT 10 OFFSET 10
```

### 🤔 Preguntas de Reflexión

1. ¿Qué pasaría si cambiäramos la implementación de `toSQL()` para generar MongoDB queries en lugar de SQL? ¿Habría que modificar el `QueryBuilder`?
2. ¿Cómo ayuda el patrón Builder a evitar errores que ocurrirían con `new Query(tabla, campos, condiciones, orden, limite, offset)`?
3. Identifica al menos 2 librerías de JavaScript/Node.js que usen el patrón Builder en su API.

---

## 🏆 Desafío Extra (opcional)

Agrega validación al `QueryBuilder` para prevenir SQL injection:

```javascript
// ¿Cómo detectarías esto en el método where()?
queryBuilder.where("1=1; DROP TABLE students; --");
```

> 💡 Pista: en una implementación real, usarías **consultas parametrizadas** (`WHERE id = $1`) en lugar de interpolación directa. El Builder podría recibir `where('id', '=', userId)` y construir el parámetro seguro internamente.

---

_Bootcamp de Arquitectura de Software · SENA · bc-channel-epti_
