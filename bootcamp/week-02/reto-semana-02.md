# 🚀 Reto Semana 02: Refactorización con Principios SOLID

## 🎯 Contexto del Reto

Has sido contratado como arquitecto de software en **StreamFlix**, una plataforma de streaming emergente que compite con Netflix y Disney+. El equipo anterior dejó un código funcional pero difícil de mantener, y el CTO te ha asignado la tarea de refactorizar el sistema aplicando **principios SOLID**.

El código actual funciona, pero cada vez que intentan agregar nuevas funcionalidades (nuevos tipos de suscripción, métodos de pago, formatos de video), tienen que modificar múltiples clases y a menudo rompen funcionalidades existentes.

---

## 📋 Problema a Resolver

El sistema actual tiene las siguientes violaciones de SOLID:

### ❌ Código Legacy (Violaciones SOLID)

```javascript
/**
 * ⚠️ CÓDIGO HEREDADO - MÚLTIPLES VIOLACIONES SOLID
 */

class StreamingService {
  constructor() {
    this.users = [];
    this.subscriptions = [];
    this.payments = [];
  }

  // Viola SRP: Hace demasiadas cosas
  registerUser(userData) {
    // Validación
    if (!userData.email || !userData.email.includes('@')) {
      throw new Error('Email inválido');
    }

    // Persistencia
    const user = {
      id: Date.now(),
      ...userData,
      createdAt: new Date(),
    };
    this.users.push(user);

    // Email
    console.log(`📧 Enviando email de bienvenida a ${user.email}`);

    // Analytics
    console.log(`📊 Usuario registrado: ${user.email}`);

    return user;
  }

  // Viola OCP: Para agregar nueva suscripción, modificas este método
  calculateSubscriptionPrice(type, isAnnual) {
    if (type === 'BASIC') {
      return isAnnual ? 89.99 : 9.99;
    }
    if (type === 'STANDARD') {
      return isAnnual ? 149.99 : 14.99;
    }
    if (type === 'PREMIUM') {
      return isAnnual ? 199.99 : 19.99;
    }
    // ⚠️ Agregar "FAMILY" requiere modificar aquí
    return 0;
  }

  // Viola DIP: Depende de implementación concreta de pago
  processPayment(userId, amount, cardNumber) {
    // Lógica hardcodeada para tarjeta
    console.log(`💳 Procesando pago con tarjeta ${cardNumber}`);
    console.log(`💰 Monto: $${amount}`);

    // ⚠️ No puede usar PayPal, criptomonedas, etc. sin modificar
    const payment = {
      id: Date.now(),
      userId,
      amount,
      method: 'CARD',
      timestamp: new Date(),
    };

    this.payments.push(payment);
    return payment;
  }

  // Viola ISP: Fuerza a todos los usuarios a tener métodos que quizás no usan
  getUserFullProfile(userId) {
    const user = this.users.find((u) => u.id === userId);
    const subscription = this.subscriptions.find((s) => s.userId === userId);
    const payments = this.payments.filter((p) => p.userId === userId);

    return {
      ...user,
      subscription,
      payments,
      watchHistory: [], // ⚠️ No todos necesitan esto
      recommendations: [], // ⚠️ No todos necesitan esto
    };
  }
}
```

---

## 🎯 Tu Misión

Refactorizar el código anterior aplicando los **5 principios SOLID**:

### 1️⃣ Single Responsibility Principle (SRP)

**Tarea**: Dividir `StreamingService` en clases con responsabilidad única.

**Ejemplos**:

- `UserValidator`: Validar datos de usuario
- `UserRepository`: Persistir usuarios
- `EmailService`: Enviar emails
- `AnalyticsService`: Rastrear eventos

### 2️⃣ Open/Closed Principle (OCP)

**Tarea**: Permitir agregar nuevos tipos de suscripción sin modificar código existente.

**Pista**: Usa el patrón Strategy con clases de suscripción.

### 3️⃣ Liskov Substitution Principle (LSP)

**Tarea**: Asegurar que cualquier implementación de suscripción pueda sustituirse sin romper el código.

**Requisito**: Todas las suscripciones deben cumplir el contrato base.

### 4️⃣ Interface Segregation Principle (ISP)

**Tarea**: Separar el perfil de usuario en interfaces específicas.

**Ejemplos**:

- `BasicUserProfile`: id, nombre, email
- `SubscriptionInfo`: tipo, precio, fecha
- `WatchHistory`: historial de reproducción

### 5️⃣ Dependency Inversion Principle (DIP)

**Tarea**: Hacer que el servicio dependa de abstracciones, no de implementaciones concretas.

**Requisito**: Poder cambiar entre tarjeta, PayPal, cripto sin modificar la lógica.

---

## 📦 Entregables

### 1. Código Refactorizado

Estructura esperada:

```
week-02/reto/
├── package.json
├── README.md
├── src/
│   ├── validators/
│   │   └── user-validator.js
│   ├── repositories/
│   │   └── user-repository.js
│   ├── services/
│   │   ├── email-service.js
│   │   ├── analytics-service.js
│   │   └── user-service.js
│   ├── subscriptions/
│   │   ├── subscription.js (clase base)
│   │   ├── basic-subscription.js
│   │   ├── standard-subscription.js
│   │   └── premium-subscription.js
│   ├── payments/
│   │   ├── payment-processor.js (interfaz)
│   │   ├── card-payment.js
│   │   └── paypal-payment.js
│   └── index.js
└── tests/
    └── user-service.test.js
```

### 2. Documentación

Archivo `EXPLICACION-SOLID.md` que incluya:

- ✅ Identificación de cada violación SOLID en el código original
- ✅ Explicación de cómo lo refactorizaste
- ✅ Diagrama de clases (PlantUML, Mermaid o Draw.io)
- ✅ Justificación de decisiones arquitectónicas

### 3. Tests

Al menos **3 tests** que demuestren:

- SRP: Testear `UserValidator` independientemente
- DIP: Cambiar entre diferentes métodos de pago
- OCP: Agregar nueva suscripción sin modificar código

---

## 🎓 Criterios de Evaluación

### Evidencia de Conocimiento (30%)

- [ ] Identificas correctamente las 5 violaciones SOLID
- [ ] Explicas por qué cada refactorización mejora el diseño
- [ ] Documentas decisiones arquitectónicas

### Evidencia de Desempeño (40%)

- [ ] Aplicas SRP dividiendo responsabilidades
- [ ] Aplicas OCP con estrategias extensibles
- [ ] Aplicas LSP con herencia correcta
- [ ] Aplicas ISP con interfaces segregadas
- [ ] Aplicas DIP con inyección de dependencias

### Evidencia de Producto (30%)

- [ ] Código funcional en JavaScript ES2023
- [ ] Estructura de carpetas clara
- [ ] Tests que validan la refactorización
- [ ] Diagrama de clases profesional
- [ ] README con instrucciones de ejecución

---

## 🚀 Bonus (Opcional)

Para destacar aún más:

1. **Agregar TypeScript**: Interfaces explícitas
2. **Patrón Factory**: Para crear suscripciones
3. **Patrón Observer**: Notificar eventos de suscripción
4. **Docker**: Contenedor con PostgreSQL
5. **CI/CD**: GitHub Actions con tests automáticos

---

## 📚 Recursos de Apoyo

- [Teoría SOLID](./1-teoria/)
- [Ejemplos de refactorización](./2-practicas/)
- [Clean Code - Robert C. Martin](./4-recursos/ebooks-free/)
- [Videos explicativos](./4-recursos/videografia/)

---

## 💡 Tips para el Éxito

1. **Empieza simple**: Primero identifica violaciones
2. **Refactoriza incremental**: Un principio a la vez
3. **Testea constantemente**: Asegura que no rompiste nada
4. **Documenta decisiones**: Explica tu razonamiento
5. **Revisa patrones**: Strategy, Factory, Dependency Injection

---

## 🎯 Resultado Esperado

Al finalizar, deberías poder:

- ✅ Agregar nueva suscripción "FAMILY" sin modificar código existente
- ✅ Cambiar método de pago de tarjeta a PayPal con 1 línea de código
- ✅ Testear cada componente independientemente
- ✅ Explicar cómo cada principio SOLID mejora el diseño

---

**¡Buena suerte, arquitecto! 🏗️**

_Este reto está inspirado en problemas reales de plataformas de streaming como Netflix, Disney+ y Spotify._

---

**Bootcamp de Arquitectura de Software - Semana 02**
_SENA - Tecnología en Análisis y Desarrollo de Software_
_bc-channel-epti_
