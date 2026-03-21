# 💪 Práctica 02 — Ports & Adapters: Sistema de Notificaciones

> **Duración estimada**: 45 minutos
> **Nivel**: Intermedio
> **Prereq**: Haber completado la Práctica 01

---

## 🎯 Objetivo

Implementar un sistema de notificaciones usando Arquitectura Hexagonal donde se pueda **cambiar el canal de comunicación** (email, SMS, consola) sin modificar la lógica de la aplicación.

---

## 📐 Diseño del sistema

```
         Driving Side (Primary)               Hexágono              Driven Side (Secondary)
         ─────────────────────────────────────────────────────────────────────────────────
                                          ┌─────────────────┐
         NotifyUserController ───────────►│                 │
                                          │  NotifyUserUseCase│────────► INotificationChannel
         CLI (node notify.js) ──────────►│                 │              │
                                          └─────────────────┘              ├── ConsoleAdapter
                                                                            ├── NodemailerAdapter
                                                                            └── TwilioAdapter
```

---

## 🔌 Puerto Secundario — INotificationChannel

```javascript
// src/domain/ports/notification-channel.port.js

/**
 * Puerto secundario: contrato que deben cumplir todos los
 * canales de notificacion (email, SMS, push, consola, etc.)
 */
export class INotificationChannel {
  /**
   * @param {{ to: string, subject: string, body: string }} message
   * @returns {Promise<{ success: boolean, messageId: string }>}
   */
  async send(message) {
    throw new Error(`${this.constructor.name} must implement send()`);
  }

  /**
   * @returns {string} nombre del canal para logs y diagnostico
   */
  get channelName() {
    throw new Error(`${this.constructor.name} must implement channelName`);
  }
}
```

---

## 🔌 Puerto Primario — INotificationService

```javascript
// src/domain/ports/notification-service.port.js
export class INotificationService {
  /**
   * @param {{ userId: string, event: string, data: object }} notification
   * @returns {Promise<void>}
   */
  async notify(notification) {
    throw new Error(`${this.constructor.name} must implement notify()`);
  }
}
```

---

## 🏗️ Caso de Uso (Application Layer)

```javascript
// src/application/use-cases/notify-user.use-case.js
export class NotifyUserUseCase {
  #channels; // INotificationChannel[]
  #userRepo; // para obtener preferencias del usuario

  constructor({ channels, userRepository }) {
    if (!channels?.length)
      throw new Error("At least one notification channel is required");
    this.#channels = channels;
    this.#userRepo = userRepository;
  }

  async execute({ userId, event, data }) {
    const user = await this.#userRepo.findById(userId);
    if (!user) throw new Error(`User ${userId} not found`);

    const message = this.#buildMessage(event, data, user);
    const results = [];

    // Enviar por todos los canales configurados
    for (const channel of this.#channels) {
      try {
        const result = await channel.send({
          to: channel.channelName === "sms" ? user.phone : user.email,
          subject: message.subject,
          body: message.body,
        });
        results.push({
          channel: channel.channelName,
          success: true,
          messageId: result.messageId,
        });
      } catch (err) {
        // Un canal que falla no bloquea los demas
        results.push({
          channel: channel.channelName,
          success: false,
          error: err.message,
        });
      }
    }

    const failures = results.filter((r) => !r.success);
    if (failures.length === this.#channels.length) {
      throw new Error(
        `All notification channels failed: ${JSON.stringify(failures)}`,
      );
    }

    return results;
  }

  #buildMessage(event, data, user) {
    const templates = {
      ORDER_PLACED: {
        subject: "Tu pedido fue confirmado",
        body: `Hola ${user.name}, tu orden #${data.orderId} por COP ${data.total?.toLocaleString("es-CO")} fue procesada con exito.`,
      },
      PASSWORD_RESET: {
        subject: "Restablecer contrasena",
        body: `Hola ${user.name}, tu codigo de verificacion es: ${data.code}. Expira en 15 minutos.`,
      },
      WELCOME: {
        subject: "Bienvenido a la plataforma",
        body: `Hola ${user.name}, tu cuenta ha sido creada exitosamente. Usuario: ${user.email}`,
      },
    };

    return (
      templates[event] ?? {
        subject: `Notificacion: ${event}`,
        body: `Se ha producido el evento ${event}. Datos: ${JSON.stringify(data)}`,
      }
    );
  }
}
```

---

## 🛠️ Adaptadores

### ConsoleAdapter (desarrollo / debugging)

```javascript
// src/infrastructure/notifications/console-notification.adapter.js
import { INotificationChannel } from "../../domain/ports/notification-channel.port.js";
import { randomUUID } from "crypto";

export class ConsoleNotificationAdapter extends INotificationChannel {
  get channelName() {
    return "console";
  }

  async send({ to, subject, body }) {
    const messageId = randomUUID();
    console.log("\n📬 [NOTIFICATION]");
    console.log(`  To:      ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Body:    ${body}`);
    console.log(`  ID:      ${messageId}\n`);
    return { success: true, messageId };
  }
}
```

### NodemailerAdapter (email producción)

```javascript
// src/infrastructure/notifications/nodemailer.adapter.js
import nodemailer from "nodemailer";
import { INotificationChannel } from "../../domain/ports/notification-channel.port.js";

export class NodemailerAdapter extends INotificationChannel {
  #transporter;
  #from;

  constructor({ host, port, user, pass, from }) {
    super();
    this.#from = from ?? `"Plataforma" <${user}>`;
    this.#transporter = nodemailer.createTransport({
      host,
      port,
      auth: { user, pass },
    });
  }

  get channelName() {
    return "email";
  }

  async send({ to, subject, body }) {
    const info = await this.#transporter.sendMail({
      from: this.#from,
      to,
      subject,
      text: body,
    });
    return { success: true, messageId: info.messageId };
  }
}
```

### InMemoryAdapter (pruebas)

```javascript
// src/infrastructure/notifications/in-memory-notification.adapter.js
import { INotificationChannel } from "../../domain/ports/notification-channel.port.js";
import { randomUUID } from "crypto";

export class InMemoryNotificationAdapter extends INotificationChannel {
  #sent = [];
  #shouldFail;

  constructor({ shouldFail = false } = {}) {
    super();
    this.#shouldFail = shouldFail;
  }

  get channelName() {
    return "in-memory";
  }
  get sentMessages() {
    return [...this.#sent];
  }
  get lastMessage() {
    return this.#sent.at(-1) ?? null;
  }

  async send(message) {
    if (this.#shouldFail) throw new Error("Simulated channel failure");
    const record = { ...message, id: randomUUID(), sentAt: new Date() };
    this.#sent.push(record);
    return { success: true, messageId: record.id };
  }

  clear() {
    this.#sent = [];
  }
}
```

---

## ✅ Pruebas del caso de uso

```javascript
// tests/application/notify-user.test.js
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { NotifyUserUseCase } from "../../src/application/use-cases/notify-user.use-case.js";
import { InMemoryNotificationAdapter } from "../../src/infrastructure/notifications/in-memory-notification.adapter.js";

describe("NotifyUserUseCase", () => {
  let useCase, emailChannel, smsChannel, mockUserRepo;

  const fakeUser = {
    id: "u1",
    name: "Maria",
    email: "maria@test.com",
    phone: "+573001234567",
  };

  beforeEach(() => {
    emailChannel = new InMemoryNotificationAdapter();
    smsChannel = new InMemoryNotificationAdapter();
    mockUserRepo = {
      async findById(id) {
        return id === "u1" ? fakeUser : null;
      },
    };

    useCase = new NotifyUserUseCase({
      channels: [emailChannel, smsChannel],
      userRepository: mockUserRepo,
    });
  });

  it("sends to all configured channels", async () => {
    const results = await useCase.execute({
      userId: "u1",
      event: "WELCOME",
      data: {},
    });

    assert.equal(results.length, 2);
    assert.ok(results.every((r) => r.success));
    assert.equal(emailChannel.sentMessages.length, 1);
    assert.equal(smsChannel.sentMessages.length, 1);
  });

  it("contains personalized message", async () => {
    await useCase.execute({ userId: "u1", event: "WELCOME", data: {} });
    assert.ok(emailChannel.lastMessage.body.includes("Maria"));
  });

  it("continues when one channel fails", async () => {
    const failingChannel = new InMemoryNotificationAdapter({
      shouldFail: true,
    });
    const workingChannel = new InMemoryNotificationAdapter();

    const uc = new NotifyUserUseCase({
      channels: [failingChannel, workingChannel],
      userRepository: mockUserRepo,
    });

    const results = await uc.execute({
      userId: "u1",
      event: "WELCOME",
      data: {},
    });

    assert.equal(results[0].success, false);
    assert.equal(results[1].success, true);
    assert.equal(workingChannel.sentMessages.length, 1);
  });

  it("throws when ALL channels fail", async () => {
    const failing1 = new InMemoryNotificationAdapter({ shouldFail: true });
    const failing2 = new InMemoryNotificationAdapter({ shouldFail: true });

    const uc = new NotifyUserUseCase({
      channels: [failing1, failing2],
      userRepository: mockUserRepo,
    });

    await assert.rejects(
      () => uc.execute({ userId: "u1", event: "WELCOME", data: {} }),
      /All notification channels failed/,
    );
  });

  it("throws when user not found", async () => {
    await assert.rejects(
      () => useCase.execute({ userId: "unknown", event: "WELCOME", data: {} }),
      /not found/,
    );
  });
});
```

---

## 🚀 Ejecución

```bash
# Instalar dependencias
pnpm add nodemailer
pnpm add -D @types/nodemailer

# Correr pruebas (sin servidor, sin BD, sin SMTP)
node --test tests/application/notify-user.test.js

# Usar el adaptador de consola en desarrollo
node src/scripts/send-test-notification.js
```

---

## ✅ Ejercicio para entregar

1. Implementa un `TelegramAdapter` que llame a la API de Telegram Bot
2. Agrega la opción de que el usuario tenga `preferredChannel` en su perfil y el caso de uso respete esa preferencia
3. Agrega una prueba que verifique que si el `preferredChannel` es `email`, solo se envía por ese canal
4. Documenta con un comentario por qué `InMemoryNotificationAdapter` tiene el método `clear()` y cuándo usarlo

**Criterio de éxito**: agregar un nuevo canal no requiere modificar `NotifyUserUseCase`.
