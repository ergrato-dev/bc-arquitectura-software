# 💪 Práctica 02: Aplicando Open/Closed Principle (OCP)

## 🎯 Objetivo

Aprender a diseñar código que sea **abierto para extensión** pero **cerrado para modificación**, permitiendo agregar nuevas funcionalidades sin cambiar código existente.

---

## 📋 Caso de Estudio: Sistema de Notificaciones

Trabajas en **NotifyHub**, una plataforma de notificaciones multicanal (similar a Twilio). Actualmente soporta email y SMS, pero necesitan agregar más canales sin modificar el código existente.

---

## ❌ Código con Violación de OCP

```javascript
/**
 * ❌ VIOLACIÓN DE OCP
 * Para agregar nuevo canal (WhatsApp, Slack), hay que MODIFICAR esta clase
 */

class NotificationService {
  send(notification, channel) {
    if (channel === 'EMAIL') {
      console.log(`📧 Enviando email a ${notification.recipient}`);
      console.log(`   Asunto: ${notification.subject}`);
      console.log(`   Mensaje: ${notification.message}`);
      // Lógica de email...
      return { sent: true, channel: 'EMAIL' };
    }

    if (channel === 'SMS') {
      console.log(`📱 Enviando SMS a ${notification.recipient}`);
      console.log(`   Mensaje: ${notification.message}`);
      // Lógica de SMS...
      return { sent: true, channel: 'SMS' };
    }

    if (channel === 'PUSH') {
      console.log(`🔔 Enviando notificación push a ${notification.recipient}`);
      console.log(`   Título: ${notification.subject}`);
      console.log(`   Mensaje: ${notification.message}`);
      // Lógica de push...
      return { sent: true, channel: 'PUSH' };
    }

    // ⚠️ Para agregar WhatsApp, Slack, Telegram, etc.
    // hay que MODIFICAR este método (viola OCP)

    throw new Error(`Canal no soportado: ${channel}`);
  }

  // Más violaciones: validaciones específicas por canal
  validate(notification, channel) {
    if (channel === 'EMAIL') {
      if (!notification.subject) {
        throw new Error('Email requiere subject');
      }
    }

    if (channel === 'SMS') {
      if (notification.message.length > 160) {
        throw new Error('SMS no puede exceder 160 caracteres');
      }
    }

    // ⚠️ Cada nuevo canal requiere modificar aquí también
  }
}

// Uso
const service = new NotificationService();

service.send(
  {
    recipient: 'user@example.com',
    subject: 'Bienvenido',
    message: 'Gracias por registrarte',
  },
  'EMAIL',
);

service.send(
  {
    recipient: '+573001234567',
    message: 'Código de verificación: 123456',
  },
  'SMS',
);
```

---

## 🤔 Análisis del Problema

### ¿Qué pasa cuando necesitamos agregar WhatsApp?

1. ❌ Modificar el método `send()` (agregar un nuevo `if`)
2. ❌ Modificar el método `validate()` (agregar validaciones de WhatsApp)
3. ❌ Re-testear TODA la clase
4. ❌ Riesgo de romper funcionalidad existente

**Viola OCP**: No está cerrado para modificación.

---

## ✅ Solución: Aplicando OCP

### Estrategia: Patrón Strategy

Cada canal será una **estrategia independiente** que implementa la misma interfaz.

---

### Paso 1: Definir Interfaz Base (Abstracción)

```javascript
/**
 * ✅ Clase base abstracta para notificaciones
 * Define el contrato que todos los canales deben cumplir
 */
class NotificationChannel {
  send(notification) {
    throw new Error('Método send() debe ser implementado');
  }

  validate(notification) {
    throw new Error('Método validate() debe ser implementado');
  }

  getName() {
    throw new Error('Método getName() debe ser implementado');
  }
}
```

---

### Paso 2: Implementar Canales Concretos

```javascript
// ✅ Canal: Email
class EmailNotificationChannel extends NotificationChannel {
  send(notification) {
    console.log(`📧 Enviando email a ${notification.recipient}`);
    console.log(`   Asunto: ${notification.subject}`);
    console.log(`   Mensaje: ${notification.message}`);

    // Aquí iría integración con servicio real (SendGrid, AWS SES, etc.)
    return {
      sent: true,
      channel: this.getName(),
      timestamp: new Date(),
    };
  }

  validate(notification) {
    if (!notification.recipient || !notification.recipient.includes('@')) {
      throw new Error('Email inválido');
    }

    if (!notification.subject) {
      throw new Error('Email requiere subject');
    }

    if (!notification.message) {
      throw new Error('Email requiere message');
    }

    return true;
  }

  getName() {
    return 'EMAIL';
  }
}

// ✅ Canal: SMS
class SMSNotificationChannel extends NotificationChannel {
  #MAX_LENGTH = 160;

  send(notification) {
    console.log(`📱 Enviando SMS a ${notification.recipient}`);
    console.log(`   Mensaje: ${notification.message}`);

    // Aquí iría integración con servicio real (Twilio, AWS SNS, etc.)
    return {
      sent: true,
      channel: this.getName(),
      timestamp: new Date(),
    };
  }

  validate(notification) {
    if (!notification.recipient || !notification.recipient.startsWith('+')) {
      throw new Error(
        'Número de teléfono inválido (debe incluir código de país)',
      );
    }

    if (!notification.message) {
      throw new Error('SMS requiere message');
    }

    if (notification.message.length > this.#MAX_LENGTH) {
      throw new Error(`SMS no puede exceder ${this.#MAX_LENGTH} caracteres`);
    }

    return true;
  }

  getName() {
    return 'SMS';
  }
}

// ✅ Canal: Push Notification
class PushNotificationChannel extends NotificationChannel {
  send(notification) {
    console.log(`🔔 Enviando push a ${notification.recipient}`);
    console.log(`   Título: ${notification.subject}`);
    console.log(`   Mensaje: ${notification.message}`);

    // Aquí iría integración con servicio real (Firebase, OneSignal, etc.)
    return {
      sent: true,
      channel: this.getName(),
      timestamp: new Date(),
    };
  }

  validate(notification) {
    if (!notification.recipient) {
      throw new Error('Push requiere deviceToken');
    }

    if (!notification.subject) {
      throw new Error('Push requiere subject (título)');
    }

    if (!notification.message) {
      throw new Error('Push requiere message');
    }

    return true;
  }

  getName() {
    return 'PUSH';
  }
}
```

---

### Paso 3: Agregar Nuevos Canales (¡Sin Modificar Código Existente!)

```javascript
// ✅ NUEVO CANAL: WhatsApp
// ¡No modificamos ninguna clase existente!
class WhatsAppNotificationChannel extends NotificationChannel {
  send(notification) {
    console.log(`💬 Enviando WhatsApp a ${notification.recipient}`);
    console.log(`   Mensaje: ${notification.message}`);

    // Integración con WhatsApp Business API
    return {
      sent: true,
      channel: this.getName(),
      timestamp: new Date(),
    };
  }

  validate(notification) {
    if (!notification.recipient || !notification.recipient.startsWith('+')) {
      throw new Error('WhatsApp requiere número con código de país');
    }

    if (!notification.message) {
      throw new Error('WhatsApp requiere message');
    }

    return true;
  }

  getName() {
    return 'WHATSAPP';
  }
}

// ✅ NUEVO CANAL: Slack
class SlackNotificationChannel extends NotificationChannel {
  send(notification) {
    console.log(`💼 Enviando mensaje a Slack: ${notification.recipient}`);
    console.log(`   Mensaje: ${notification.message}`);

    // Integración con Slack Webhooks
    return {
      sent: true,
      channel: this.getName(),
      timestamp: new Date(),
    };
  }

  validate(notification) {
    if (!notification.recipient || !notification.recipient.startsWith('#')) {
      throw new Error('Slack requiere nombre de canal (#general, #dev, etc.)');
    }

    if (!notification.message) {
      throw new Error('Slack requiere message');
    }

    return true;
  }

  getName() {
    return 'SLACK';
  }
}
```

---

### Paso 4: Servicio Refactorizado (Cerrado para Modificación)

```javascript
/**
 * ✅ Servicio refactorizado aplicando OCP
 * Abierto para extensión, cerrado para modificación
 */
class NotificationService {
  #channels = new Map();

  registerChannel(channel) {
    this.#channels.set(channel.getName(), channel);
    console.log(`✅ Canal registrado: ${channel.getName()}`);
  }

  send(notification, channelName) {
    const channel = this.#channels.get(channelName);

    if (!channel) {
      throw new Error(`Canal no registrado: ${channelName}`);
    }

    // Validar antes de enviar
    channel.validate(notification);

    // Enviar
    return channel.send(notification);
  }

  getAvailableChannels() {
    return Array.from(this.#channels.keys());
  }
}
```

---

### Paso 5: Uso del Sistema Refactorizado

```javascript
// Crear servicio
const notificationService = new NotificationService();

// Registrar canales (extensión sin modificación)
notificationService.registerChannel(new EmailNotificationChannel());
notificationService.registerChannel(new SMSNotificationChannel());
notificationService.registerChannel(new PushNotificationChannel());

// ✅ Agregar nuevos canales sin modificar NotificationService
notificationService.registerChannel(new WhatsAppNotificationChannel());
notificationService.registerChannel(new SlackNotificationChannel());

console.log('Canales disponibles:', notificationService.getAvailableChannels());
// ['EMAIL', 'SMS', 'PUSH', 'WHATSAPP', 'SLACK']

// Enviar notificaciones
notificationService.send(
  {
    recipient: 'user@example.com',
    subject: 'Bienvenido',
    message: 'Gracias por registrarte',
  },
  'EMAIL',
);

notificationService.send(
  {
    recipient: '+573001234567',
    message: 'Código: 123456',
  },
  'SMS',
);

notificationService.send(
  {
    recipient: '+573001234567',
    message: '¡Hola desde WhatsApp!',
  },
  'WHATSAPP',
);

notificationService.send(
  {
    recipient: '#general',
    message: 'Nueva versión desplegada ✅',
  },
  'SLACK',
);
```

---

## 🎯 Beneficios de Aplicar OCP

### Antes (Violación de OCP)

- ❌ Modificar `send()` para cada nuevo canal
- ❌ Modificar `validate()` para cada nuevo canal
- ❌ Re-testear toda la clase
- ❌ Riesgo de regresiones
- ❌ Código difícil de mantener

### Después (Aplicando OCP)

- ✅ Agregar nuevo canal = nueva clase independiente
- ✅ `NotificationService` **nunca cambia**
- ✅ Testear solo el nuevo canal
- ✅ Cero riesgo de romper canales existentes
- ✅ Fácil de mantener y extender

---

## 🧪 Ejercicio Práctico

### Tarea 1: Implementar Canal de Telegram

Crea una clase `TelegramNotificationChannel` que:

- Valide que `recipient` sea un número de chat
- Envíe el mensaje con un emoji 🤖
- Se registre en el servicio

<details>
<summary>💡 Ver Solución</summary>

```javascript
class TelegramNotificationChannel extends NotificationChannel {
  send(notification) {
    console.log(`🤖 Enviando Telegram a ${notification.recipient}`);
    console.log(`   Mensaje: ${notification.message}`);
    return {
      sent: true,
      channel: this.getName(),
      timestamp: new Date(),
    };
  }

  validate(notification) {
    if (!notification.recipient) {
      throw new Error('Telegram requiere chatId');
    }
    if (!notification.message) {
      throw new Error('Telegram requiere message');
    }
    return true;
  }

  getName() {
    return 'TELEGRAM';
  }
}

// Registrar
notificationService.registerChannel(new TelegramNotificationChannel());
```

</details>

---

### Tarea 2: Implementar Filtro de Spam

Crea un `SpamFilterChannel` que **valide** que el mensaje no contenga palabras prohibidas antes de enviar.

**Pista**: Usa el patrón Decorator.

<details>
<summary>💡 Ver Solución</summary>

```javascript
class SpamFilterChannel extends NotificationChannel {
  #forbiddenWords = ['spam', 'viagra', 'casino'];
  #innerChannel;

  constructor(innerChannel) {
    super();
    this.#innerChannel = innerChannel;
  }

  send(notification) {
    // Verificar spam
    const lowerMessage = notification.message.toLowerCase();
    for (const word of this.#forbiddenWords) {
      if (lowerMessage.includes(word)) {
        throw new Error(
          `Mensaje bloqueado: contiene palabra prohibida "${word}"`,
        );
      }
    }

    // Delegar al canal real
    return this.#innerChannel.send(notification);
  }

  validate(notification) {
    return this.#innerChannel.validate(notification);
  }

  getName() {
    return this.#innerChannel.getName();
  }
}

// Uso
const emailWithSpamFilter = new SpamFilterChannel(
  new EmailNotificationChannel(),
);
notificationService.registerChannel(emailWithSpamFilter);
```

</details>

---

## 📊 Comparación de Extensibilidad

| Acción                    | Antes (Violación)   | Después (OCP) |
| ------------------------- | ------------------- | ------------- |
| Agregar nuevo canal       | Modificar 2 métodos | Crear 1 clase |
| Líneas modificadas        | ~10-15              | 0             |
| Riesgo de regresión       | Alto                | Cero          |
| Tests a re-ejecutar       | Todos               | Solo el nuevo |
| Tiempo para agregar canal | 2-3 horas           | 30 minutos    |

---

## 🏆 Conclusión

**OCP se logra mediante abstracciones y polimorfismo**:

1. Define una **interfaz/clase base** (contrato)
2. Implementa **estrategias concretas** (canales)
3. Usa **polimorfismo** para tratarlas igual
4. Extiende agregando **nuevas estrategias**

**Resultado**: Código estable, extensible y profesional.

---

**Próxima práctica**: Liskov Substitution Principle (LSP)

---

**Bootcamp de Arquitectura de Software - Semana 02**
_SENA - Tecnología en Análisis y Desarrollo de Software_
_bc-channel-epti_
