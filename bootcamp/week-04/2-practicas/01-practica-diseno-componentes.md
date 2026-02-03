# 🏗️ Práctica 01: Diseño de Componentes

## 📋 Información General

| Campo             | Valor                                        |
| ----------------- | -------------------------------------------- |
| **Duración**      | 30 minutos                                   |
| **Dificultad**    | ⭐⭐ Intermedio                              |
| **Prerequisitos** | Semana 02 (SOLID), Semana 03 (Patrones)      |
| **Habilidades**   | Diseño de interfaces, Cohesión, Acoplamiento |

---

## 🎯 Objetivos de Aprendizaje

Al completar esta práctica serás capaz de:

- ✅ Diseñar componentes con interfaces claras
- ✅ Aplicar alta cohesión y bajo acoplamiento
- ✅ Implementar inyección de dependencias
- ✅ Crear componentes reemplazables y testeables

---

## 📖 Contexto del Ejercicio

Una startup de delivery te contrata para diseñar el sistema de **notificaciones**. El sistema debe poder enviar notificaciones por múltiples canales (email, SMS, push) y ser fácilmente extensible para nuevos canales en el futuro.

**Requisitos del negocio:**

1. Enviar confirmación de pedido
2. Notificar cambios de estado del pedido
3. Enviar promociones y ofertas
4. El usuario elige sus canales preferidos

---

## 🚨 Problema: Código Actual (Alto Acoplamiento)

```javascript
// ❌ MAL: Componente con múltiples responsabilidades y alto acoplamiento
class NotificationManager {
  constructor() {
    // Dependencias hardcodeadas
    this.emailConfig = {
      host: 'smtp.example.com',
      port: 587,
      user: 'noreply@example.com',
      password: 'secret123',
    };
    this.smsApiKey = 'SMS_API_KEY_123';
    this.pushConfig = { appId: 'APP_123' };
  }

  // Método gigante que hace todo
  async sendNotification(userId, type, message) {
    // Obtener preferencias del usuario (lógica mezclada)
    const user = await this.getUserFromDatabase(userId);

    if (type === 'order_confirmation') {
      // Lógica de email mezclada
      if (user.preferences.email) {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransporter(this.emailConfig);
        await transporter.sendMail({
          to: user.email,
          subject: 'Pedido Confirmado',
          html: `<h1>${message}</h1>`,
        });
      }

      // Lógica de SMS mezclada
      if (user.preferences.sms) {
        const twilio = require('twilio');
        const client = twilio(this.smsApiKey);
        await client.messages.create({
          to: user.phone,
          body: message,
        });
      }

      // Lógica de push mezclada
      if (user.preferences.push) {
        const firebase = require('firebase-admin');
        await firebase.messaging().send({
          token: user.deviceToken,
          notification: { title: 'Pedido', body: message },
        });
      }
    }

    // Más tipos de notificación con código duplicado...
    if (type === 'order_status') {
      // Código casi idéntico repetido...
    }
  }

  async getUserFromDatabase(userId) {
    // Acceso directo a BD
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: 'postgres://...' });
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [
      userId,
    ]);
    return result.rows[0];
  }
}
```

**🔴 Problemas identificados:**

1. **Baja cohesión**: Una clase hace email, SMS, push, BD, formateo
2. **Alto acoplamiento**: Dependencias hardcodeadas (nodemailer, twilio, firebase)
3. **Difícil de testear**: No se pueden mockear las dependencias
4. **Difícil de extender**: Agregar un canal requiere modificar la clase
5. **Código duplicado**: Lógica repetida para cada tipo de notificación

---

## ✅ Ejercicio: Rediseñar con Componentes

### Paso 1: Definir la Interfaz del Canal de Notificación

```javascript
// notification-channel.interface.js

/**
 * @interface NotificationChannel
 * Contrato que deben implementar todos los canales de notificación
 *
 * Principios aplicados:
 * - ISP: Interfaz específica para envío de notificaciones
 * - DIP: Depender de abstracción, no de implementaciones
 */

/**
 * @typedef {Object} NotificationPayload
 * @property {string} to - Destinatario (email, teléfono, token)
 * @property {string} subject - Asunto/título
 * @property {string} body - Contenido del mensaje
 * @property {Object} [metadata] - Datos adicionales opcionales
 */

/**
 * @typedef {Object} NotificationResult
 * @property {boolean} success - Si el envío fue exitoso
 * @property {string} channelName - Nombre del canal
 * @property {string} [messageId] - ID del mensaje enviado
 * @property {string} [error] - Mensaje de error si falló
 */

// Interfaz base usando clase abstracta
export class NotificationChannel {
  /**
   * Nombre único del canal
   * @returns {string}
   */
  get name() {
    throw new Error('Getter "name" debe ser implementado');
  }

  /**
   * Verifica si el usuario puede recibir por este canal
   * @param {Object} user - Usuario con sus datos de contacto
   * @returns {boolean}
   */
  canSend(user) {
    throw new Error('Método "canSend" debe ser implementado');
  }

  /**
   * Envía la notificación
   * @param {NotificationPayload} payload
   * @returns {Promise<NotificationResult>}
   */
  async send(payload) {
    throw new Error('Método "send" debe ser implementado');
  }
}
```

### Paso 2: Implementar Canales Concretos

```javascript
// channels/email-channel.js
import { NotificationChannel } from '../notification-channel.interface.js';

/**
 * Canal de notificaciones por Email
 * Implementa NotificationChannel
 */
export class EmailChannel extends NotificationChannel {
  #transporter; // Campo privado

  /**
   * @param {Object} transporter - Transportador de email inyectado
   */
  constructor(transporter) {
    super();
    this.#transporter = transporter;
  }

  get name() {
    return 'email';
  }

  canSend(user) {
    return Boolean(user?.email && user?.preferences?.email);
  }

  async send({ to, subject, body, metadata = {} }) {
    try {
      const result = await this.#transporter.sendMail({
        to,
        subject,
        html: body,
        ...metadata,
      });

      return {
        success: true,
        channelName: this.name,
        messageId: result.messageId,
      };
    } catch (error) {
      return {
        success: false,
        channelName: this.name,
        error: error.message,
      };
    }
  }
}
```

```javascript
// channels/sms-channel.js
import { NotificationChannel } from '../notification-channel.interface.js';

/**
 * Canal de notificaciones por SMS
 */
export class SmsChannel extends NotificationChannel {
  #smsClient;

  constructor(smsClient) {
    super();
    this.#smsClient = smsClient;
  }

  get name() {
    return 'sms';
  }

  canSend(user) {
    return Boolean(user?.phone && user?.preferences?.sms);
  }

  async send({ to, body }) {
    try {
      const message = await this.#smsClient.messages.create({
        to,
        body: body.substring(0, 160), // SMS tiene límite
      });

      return {
        success: true,
        channelName: this.name,
        messageId: message.sid,
      };
    } catch (error) {
      return {
        success: false,
        channelName: this.name,
        error: error.message,
      };
    }
  }
}
```

```javascript
// channels/push-channel.js
import { NotificationChannel } from '../notification-channel.interface.js';

/**
 * Canal de notificaciones Push
 */
export class PushChannel extends NotificationChannel {
  #firebaseMessaging;

  constructor(firebaseMessaging) {
    super();
    this.#firebaseMessaging = firebaseMessaging;
  }

  get name() {
    return 'push';
  }

  canSend(user) {
    return Boolean(user?.deviceToken && user?.preferences?.push);
  }

  async send({ to, subject, body, metadata = {} }) {
    try {
      const result = await this.#firebaseMessaging.send({
        token: to,
        notification: {
          title: subject,
          body,
        },
        data: metadata,
      });

      return {
        success: true,
        channelName: this.name,
        messageId: result,
      };
    } catch (error) {
      return {
        success: false,
        channelName: this.name,
        error: error.message,
      };
    }
  }
}
```

### Paso 3: Crear el Servicio de Notificaciones

```javascript
// notification.service.js

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} phone
 * @property {string} deviceToken
 * @property {Object} preferences
 */

/**
 * @typedef {Object} NotificationRequest
 * @property {string} userId
 * @property {string} type - Tipo de notificación
 * @property {string} subject
 * @property {string} body
 * @property {Object} [data] - Datos adicionales
 */

/**
 * Servicio de Notificaciones
 *
 * Responsabilidad única: Orquestar el envío de notificaciones
 * por múltiples canales según las preferencias del usuario.
 *
 * Principios aplicados:
 * - SRP: Solo orquesta, no envía directamente
 * - OCP: Abierto a nuevos canales sin modificar
 * - DIP: Depende de abstracciones (NotificationChannel)
 */
export class NotificationService {
  #channels;
  #userRepository;
  #logger;

  /**
   * @param {Object} dependencies - Dependencias inyectadas
   * @param {NotificationChannel[]} dependencies.channels - Canales disponibles
   * @param {Object} dependencies.userRepository - Repositorio de usuarios
   * @param {Object} dependencies.logger - Logger para auditoría
   */
  constructor({ channels, userRepository, logger }) {
    this.#channels = channels;
    this.#userRepository = userRepository;
    this.#logger = logger;
  }

  /**
   * Envía notificación a un usuario por todos sus canales preferidos
   * @param {NotificationRequest} request
   * @returns {Promise<NotificationResult[]>}
   */
  async notify({ userId, type, subject, body, data = {} }) {
    // Obtener usuario
    const user = await this.#userRepository.findById(userId);

    if (!user) {
      this.#logger.warn(`Usuario no encontrado: ${userId}`);
      return [];
    }

    // Filtrar canales habilitados para este usuario
    const enabledChannels = this.#channels.filter((channel) =>
      channel.canSend(user),
    );

    if (enabledChannels.length === 0) {
      this.#logger.info(`Usuario ${userId} no tiene canales habilitados`);
      return [];
    }

    // Preparar payloads por canal
    const payloads = enabledChannels.map((channel) => ({
      channel,
      payload: this.#buildPayload(channel.name, user, { subject, body, data }),
    }));

    // Enviar en paralelo
    const results = await Promise.all(
      payloads.map(async ({ channel, payload }) => {
        const result = await channel.send(payload);

        // Logging de auditoría
        this.#logger.info('Notificación enviada', {
          userId,
          type,
          channel: channel.name,
          success: result.success,
        });

        return result;
      }),
    );

    return results;
  }

  /**
   * Construye el payload específico para cada canal
   * @private
   */
  #buildPayload(channelName, user, { subject, body, data }) {
    const destinations = {
      email: user.email,
      sms: user.phone,
      push: user.deviceToken,
    };

    return {
      to: destinations[channelName],
      subject,
      body,
      metadata: data,
    };
  }

  /**
   * Obtiene los canales disponibles
   * @returns {string[]}
   */
  getAvailableChannels() {
    return this.#channels.map((c) => c.name);
  }
}
```

### Paso 4: Composición y Factory

```javascript
// notification.factory.js
import { NotificationService } from './notification.service.js';
import { EmailChannel } from './channels/email-channel.js';
import { SmsChannel } from './channels/sms-channel.js';
import { PushChannel } from './channels/push-channel.js';

/**
 * Factory para crear el servicio de notificaciones
 * con todas sus dependencias configuradas
 */
export const createNotificationService = ({
  emailTransporter,
  smsClient,
  firebaseMessaging,
  userRepository,
  logger,
}) => {
  // Crear canales con sus dependencias
  const channels = [
    new EmailChannel(emailTransporter),
    new SmsChannel(smsClient),
    new PushChannel(firebaseMessaging),
  ];

  // Crear y retornar el servicio
  return new NotificationService({
    channels,
    userRepository,
    logger,
  });
};
```

### Paso 5: Uso del Sistema

```javascript
// app.js
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import admin from 'firebase-admin';
import { createNotificationService } from './notification.factory.js';
import { UserRepository } from './repositories/user.repository.js';
import { Logger } from './utils/logger.js';

// Configurar dependencias externas
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const smsClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

admin.initializeApp({
  credential: admin.credential.cert('./firebase-key.json'),
});
const firebaseMessaging = admin.messaging();

// Crear servicio
const notificationService = createNotificationService({
  emailTransporter,
  smsClient,
  firebaseMessaging,
  userRepository: new UserRepository(),
  logger: new Logger(),
});

// Usar el servicio
const results = await notificationService.notify({
  userId: 'user-123',
  type: 'order_confirmation',
  subject: '¡Pedido Confirmado!',
  body: 'Tu pedido #456 ha sido confirmado',
  data: { orderId: '456' },
});

console.log('Resultados:', results);
// [
//   { success: true, channelName: 'email', messageId: '...' },
//   { success: true, channelName: 'push', messageId: '...' }
// ]
```

---

## 🧪 Testing Fácil

```javascript
// notification.service.test.js
import { describe, it, expect, vi } from 'vitest';
import { NotificationService } from './notification.service.js';

describe('NotificationService', () => {
  // Mock de canal
  const createMockChannel = (name, canSendResult = true) => ({
    name,
    canSend: vi.fn().mockReturnValue(canSendResult),
    send: vi.fn().mockResolvedValue({ success: true, channelName: name }),
  });

  // Mock de repositorio
  const mockUserRepo = {
    findById: vi.fn().mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      phone: '+1234567890',
      deviceToken: 'token-123',
      preferences: { email: true, sms: true, push: true },
    }),
  };

  // Mock de logger
  const mockLogger = {
    info: vi.fn(),
    warn: vi.fn(),
  };

  it('debe enviar por todos los canales habilitados', async () => {
    const emailChannel = createMockChannel('email');
    const smsChannel = createMockChannel('sms');

    const service = new NotificationService({
      channels: [emailChannel, smsChannel],
      userRepository: mockUserRepo,
      logger: mockLogger,
    });

    const results = await service.notify({
      userId: 'user-1',
      type: 'test',
      subject: 'Test',
      body: 'Test message',
    });

    expect(results).toHaveLength(2);
    expect(emailChannel.send).toHaveBeenCalled();
    expect(smsChannel.send).toHaveBeenCalled();
  });

  it('debe filtrar canales según preferencias', async () => {
    const emailChannel = createMockChannel('email', true);
    const smsChannel = createMockChannel('sms', false); // Usuario no acepta SMS

    const service = new NotificationService({
      channels: [emailChannel, smsChannel],
      userRepository: mockUserRepo,
      logger: mockLogger,
    });

    const results = await service.notify({
      userId: 'user-1',
      type: 'test',
      subject: 'Test',
      body: 'Test message',
    });

    expect(results).toHaveLength(1);
    expect(results[0].channelName).toBe('email');
    expect(smsChannel.send).not.toHaveBeenCalled();
  });
});
```

---

## 📊 Comparación: Antes vs Después

| Aspecto            | ❌ Antes                         | ✅ Después                         |
| ------------------ | -------------------------------- | ---------------------------------- |
| **Cohesión**       | Baja (todo mezclado)             | Alta (cada canal es independiente) |
| **Acoplamiento**   | Alto (dependencias hardcodeadas) | Bajo (inyección de dependencias)   |
| **Testabilidad**   | Difícil (mocks complejos)        | Fácil (interfaces claras)          |
| **Extensibilidad** | Modificar clase                  | Agregar nueva clase                |
| **Mantenibilidad** | Cambios riesgosos                | Cambios aislados                   |
| **Reutilización**  | No reutilizable                  | Canales reutilizables              |

---

## 🏆 Entregables

1. **Código refactorizado** aplicando los principios de diseño de componentes
2. **Diagrama de componentes** mostrando la arquitectura
3. **Tests unitarios** para el servicio de notificaciones
4. **Documentación** explicando las decisiones de diseño

---

## 📚 Recursos Adicionales

- [01-diseno-componentes.md](../1-teoria/01-diseno-componentes.md) - Teoría completa
- [Diagrama de Componentes](../0-assets/01-componentes-interfaces.svg) - Referencia visual

---

## 💡 Reflexión Final

> "Un buen componente es como un buen empleado: sabe exactamente cuál es su trabajo, lo hace bien, y se comunica claramente con los demás."

La clave está en **diseñar para el cambio**. Las interfaces estables permiten que las implementaciones evolucionen sin romper el sistema.

---

**Tiempo estimado de completación:** 30 minutos
