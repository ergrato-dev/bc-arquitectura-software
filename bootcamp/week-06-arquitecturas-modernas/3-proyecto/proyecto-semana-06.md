# 🚀 Proyecto Semana 06 — Arquitectura Hexagonal en Tu Dominio

> **Fecha de entrega**: Al finalizar la semana 06
> **Modalidad**: Individual
> **Repositorio base**: Continúa sobre **tu proyecto personal** de las semanas 04 y 05

> ⚠️ **Política anticopia**: Cada aprendiz trabaja con su dominio asignado en semana 01. Este proyecto debe reflejar las entidades, reglas de negocio y lógica propia de **tu** dominio. El reto de la semana (que sirve de ejemplo didáctico) no es el entregable.

---

## 🎯 Descripción

Refactoriza **tu proyecto personal** (dominio asignado en semana 01) desde su arquitectura actual (Express + lógica mezclada) hacia una **Arquitectura Hexagonal (Ports & Adapters)** completa.

Al finalizar, cualquier módulo del dominio debe ser testeable en **menos de 2 segundos** sin levantar servidor, sin conectar a BD y sin red.

---

## 📐 Arquitectura Objetivo

Adapta la estructura de carpetas a los nombres de las entidades de **tu dominio**. A continuación se muestra la plantilla genérica:

```
proyecto-[tu-dominio]/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── [entidad-principal].entity.js    ← Entidad 1  de tu dominio
│   │   │   ├── [entidad-secundaria].entity.js   ← Entidad 2 de tu dominio
│   │   │   └── [entidad-relacion].entity.js     ← Entidad de relación (si aplica)
│   │   ├── value-objects/
│   │   │   ├── [campo-validado].vo.js           ← Ej: email.vo.js, precio.vo.js
│   │   │   └── [campo-validado-2].vo.js
│   │   ├── aggregates/
│   │   │   └── [transaccion-principal].aggregate.js  ← La operación de negocio más importante
│   │   ├── ports/
│   │   │   ├── primary/
│   │   │   │   └── [entidad]-service.port.js    ← Interfaz que expone el dominio
│   │   │   └── secondary/
│   │   │       ├── [entidad].repository.port.js ← Puerto de persistencia
│   │   │       └── notification.port.js         ← Puerto de notificaciones
│   │   └── services/
│   │       └── [operacion].domain-service.js    ← Reglas que involucran 2+ entidades
│   ├── application/
│   │   └── use-cases/
│   │       ├── [crear-recurso].use-case.js      ← Caso de uso 1
│   │       ├── [actualizar-recurso].use-case.js ← Caso de uso 2
│   │       └── [consultar-recurso].use-case.js  ← Caso de uso 3
│   ├── infrastructure/
│   │   ├── repositories/
│   │   │   ├── in-memory-[entidad].repository.js   ← Para tests
│   │   │   └── postgres-[entidad].repository.js    ← Para producción
│   │   └── notifications/
│   │       └── console-notification.adapter.js
│   ├── interfaces/
│   │   └── http/
│   │       ├── [entidad].controller.js
│   │       └── [entidad-secundaria].controller.js
│   └── main.js
├── tests/
│   ├── domain/
│   │   ├── [entidad-principal].test.js
│   │   └── [transaccion].test.js
│   └── application/
│       └── [caso-de-uso].test.js
├── package.json
└── README.md
```

**Antes de escribir código**, completa esta tabla para tu dominio:

| Placeholder               | Tu valor concreto                      | Ejemplo                               |
| ------------------------- | -------------------------------------- | ------------------------------------- |
| `[entidad-principal]`     | ¿Cuál es la entidad central?           | `patient`, `product`, `vehicle`       |
| `[entidad-secundaria]`    | ¿Qué otra entidad importante hay?      | `appointment`, `order`, `booking`     |
| `[transaccion-principal]` | ¿Cuál es la operación más importante?  | `appointment`, `purchase`, `rental`   |
| `[campo-validado]`        | ¿Qué campo tiene reglas de validación? | `email`, `price`, `license-plate`     |
| `[caso-de-uso-1]`         | ¿Primera acción de negocio?            | `schedule-appointment`, `place-order` |

---

## 📋 Reglas de negocio de tu dominio

Antes de implementar, documenta las reglas de negocio propias de **tu dominio asignado**. Estas reglas deben vivir en la capa de dominio, nunca en controllers ni en la base de datos.

Usa la siguiente plantilla y rellena con tus reglas reales:

### Reglas de negocio (DEBEN vivir en el dominio)

1. **[Entidad principal] — Creación y validación**
   - ¿Qué campos son obligatorios?
   - ¿Qué validaciones tiene el identificador único (email, código, placa…)?
   - ¿Qué restricciones de formato o longitud aplican?

2. **[Transacción principal] — La operación central de tu negocio**
   - ¿Cuántas veces puede un [Entidad1] hacer [Operación] en [Entidad2]?
   - ¿Cuándo se debe rechazar la operación?
   - ¿Cuál es el límite máximo de capacidad o cantidad?

3. **[Campo con lógica] — Value Object**
   - ¿Cuál es el rango válido o el formato aceptado?
   - ¿Qué valor representa un estado "aprobado" o "exitoso"?
   - ¿Es inmutable una vez asignado?

4. **Notificaciones o efectos secundarios**
   - ¿Qué evento dispara una notificación?
   - ¿A quién se notifica?
   - ¿Qué información contiene la notificación?

> 💡 **Tip**: Consulta el proyecto de semana 01 donde describiste las reglas de negocio de tu dominio. Si aún no las tienes claras, este es el momento de definirlas antes de escribir código.

---

## 🛠️ Implementación paso a paso

> Los ejemplos de código a continuación usan `[TuEntidad]` y `[TuCampo]` como marcadores de posición. **Reemplázalos** con los nombres concretos de tu dominio antes de escribir los archivos.

### Fase 1 — Modelado del dominio (sin infraestructura)

**Entidad principal:**

```javascript
// src/domain/entities/[entidad-principal].entity.js
import { randomUUID } from 'crypto';
import { [TuCampoVO] } from '../value-objects/[campo-validado].vo.js';

export class [TuEntidad] {
  #id;
  #nombre;         // ← renombra según tu dominio
  #[campoUnico];   // ← el campo identificador único de tu entidad
  #estado;

  constructor({ id = randomUUID(), nombre, [campoUnico] }) {
    // Regla 1: validaciones de la entidad (ej: nombre mínimo N caracteres)
    if (!nombre || nombre.trim().length < 3) {
      throw new Error('[TuEntidad] nombre must have at least 3 characters');
    }

    this.#id = id;
    this.#nombre = nombre.trim();
    this.#[campoUnico] = [campoUnico] instanceof [TuCampoVO]
      ? [campoUnico]
      : new [TuCampoVO]([campoUnico]);
    this.#estado = 'ACTIVO';
  }

  desactivar() {
    this.#estado = 'INACTIVO';
  }

  get id()           { return this.#id; }
  get nombre()       { return this.#nombre; }
  get [campoUnico]() { return this.#[campoUnico].value; }
  get estado()       { return this.#estado; }
}
```

**Value Object para campo con lógica de validación:**

```javascript
// src/domain/value-objects/[campo-validado].vo.js
export class [TuCampoVO] {
  #value;

  constructor(value) {
    // Regla 2: define aquí el rango/formato válido de tu campo
    // Ejemplo: un campo numérico entre MIN y MAX
    const num = Number(value);
    if (isNaN(num) || num < [MIN] || num > [MAX]) {
      throw new Error(`[TuCampoVO] inválido: ${value}. Debe estar entre [MIN] y [MAX]`);
    }
    this.#value = num;
    Object.freeze(this);
  }

  // Agrega métodos de lógica de negocio relevantes para tu campo
  // Ejemplo: ¿supera el umbral de aprobación?
  get superaUmbral() {
    return this.#value >= [UMBRAL];
  }

  get value() { return this.#value; }

  equals(other) {
    return other instanceof [TuCampoVO] && this.#value === other.value;
  }
}
```

**Aggregate (la transacción principal de negocio):**

```javascript
// src/domain/aggregates/[transaccion-principal].aggregate.js
import { randomUUID } from 'crypto';
import { [TuCampoVO] } from '../value-objects/[campo-validado].vo.js';

export class [TuTransaccion] {
  #id;
  #[entidadPrincipalId];
  #[entidadSecundariaId];
  #estado;
  #registros = [];   // ← colección de VO o datos asociados
  #events = [];

  constructor({ id = randomUUID(), [entidadPrincipalId], [entidadSecundariaId], estado = 'ACTIVO', registros = [] }) {
    this.#id = id;
    this.#[entidadPrincipalId] = [entidadPrincipalId];
    this.#[entidadSecundariaId] = [entidadSecundariaId];
    this.#estado = estado;
    this.#registros = registros.map(r => r instanceof [TuCampoVO] ? r : new [TuCampoVO](r));
  }

  // La operación central de negocio del aggregate
  registrar(valor) {
    if (this.#estado !== 'ACTIVO') {
      throw new Error('No se puede registrar en una transacción inactiva');
    }
    const registro = new [TuCampoVO](valor);
    this.#registros.push(registro);

    // Disparar evento de dominio
    this.#events.push({
      type: '[TuTransaccion]Registrada',
      aggregateId: this.#id,
      valor: registro.value,
      superaUmbral: registro.superaUmbral,
    });

    // Verificar compleción (agrega tu lógica de negocio)
    if (this.#debeFinalizarse()) {
      this.#finalizarTransaccion();
    }
  }

  #debeFinalizarse() {
    // Regla 3: ¿Cuándo se completa/cierra la transacción?
    return this.#registros.length >= [MAX_REGISTROS];
  }

  #finalizarTransaccion() {
    const promedio = this.promedio;
    this.#estado = promedio >= [UMBRAL] ? 'APROBADO' : 'RECHAZADO';
    this.#events.push({
      type: this.#estado === 'APROBADO' ? '[TuTransaccion]Aprobada' : '[TuTransaccion]Rechazada',
      aggregateId: this.#id,
      promedio,
    });
  }

  get promedio() {
    if (!this.#registros.length) return null;
    const sum = this.#registros.reduce((acc, r) => acc + r.value, 0);
    return Math.round((sum / this.#registros.length) * 10) / 10;
  }

  pullEvents() {
    const events = [...this.#events];
    this.#events = [];
    return events;
  }

  get id()    { return this.#id; }
  get estado(){ return this.#estado; }
}
```

---

### Fase 2 — Casos de uso

```javascript
// src/application/use-cases/[operacion-principal].use-case.js
import { [TuTransaccion] } from '../../domain/aggregates/[transaccion-principal].aggregate.js';

export class [OperacionPrincipal]UseCase {
  #[entidadPrincipal]Repository;
  #[entidadSecundaria]Repository;
  #[transaccion]Repository;
  #notificationPort;
  #domainService;

  constructor({
    [entidadPrincipal]Repository,
    [entidadSecundaria]Repository,
    [transaccion]Repository,
    notificationPort,
    domainService,
  }) {
    this.#[entidadPrincipal]Repository  = [entidadPrincipal]Repository;
    this.#[entidadSecundaria]Repository = [entidadSecundaria]Repository;
    this.#[transaccion]Repository       = [transaccion]Repository;
    this.#notificationPort              = notificationPort;
    this.#domainService                 = domainService;
  }

  async execute({ [entidadPrincipalId], [entidadSecundariaId] }) {
    // 1. Cargar entidades
    const [[entidadPrincipal], [entidadSecundaria]] = await Promise.all([
      this.#[entidadPrincipal]Repository.findById([entidadPrincipalId]),
      this.#[entidadSecundaria]Repository.findById([entidadSecundariaId]),
    ]);

    if (![entidadPrincipal]) throw new Error(`[TuEntidad] ${[entidadPrincipalId]} no encontrado`);
    if (![entidadSecundaria]) throw new Error(`[EntidadSecundaria] ${[entidadSecundariaId]} no encontrada`);

    // 2. Validar reglas de negocio con servicio de dominio
    const existentes = await this.#[transaccion]Repository.findActivosBy[EntidadPrincipal]([entidadPrincipalId]);
    this.#domainService.validar[OperacionPrincipal]([entidadPrincipal], [entidadSecundaria], existentes);

    // 3. Crear y persistir el aggregate
    const transaccion = new [TuTransaccion]({ [entidadPrincipalId], [entidadSecundariaId] });
    await this.#[transaccion]Repository.save(transaccion);

    // 4. Notificar (a través del puerto secundario)
    await this.#notificationPort.[operacionRealizada]({ [entidadPrincipal], [entidadSecundaria] });

    return transaccion;
  }
}
```

---

### Fase 3 — Tests (sin BD, sin servidor)

```javascript
// tests/application/[operacion-principal].test.js
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { [OperacionPrincipal]UseCase } from '../../src/application/use-cases/[operacion-principal].use-case.js';

describe('[OperacionPrincipal]UseCase', () => {

  // Mock de repositorio InMemory
  let [entidadPrincipal]Repo;
  let transaccionRepo;
  let notificationMock;
  let useCase;

  beforeEach(() => {
    // Crea tus mocks aquí — objetos simples que implementan los puertos
    [entidadPrincipal]Repo = {
      data: new Map(),
      findById(id) { return Promise.resolve(this.data.get(id) ?? null); },
      save(entity) { this.data.set(entity.id, entity); return Promise.resolve(); },
    };

    transaccionRepo = {
      data: [],
      findActivosBy[EntidadPrincipal]: () => Promise.resolve([]),
      save(t) { this.data.push(t); return Promise.resolve(); },
    };

    notificationMock = { [operacionRealizada]: () => Promise.resolve() };

    useCase = new [OperacionPrincipal]UseCase({
      [entidadPrincipal]Repository: [entidadPrincipal]Repo,
      // agrega los demás repositorios según tu caso de uso
      [transaccion]Repository: transaccionRepo,
      notificationPort: notificationMock,
      domainService: { validar[OperacionPrincipal]: () => {} }, // mock que no lanza
    });
  });

  it('realiza [operacion] exitosamente', async () => {
    // Arrange: prepara datos de prueba con tus entidades reales
    const entidad = new [TuEntidad]({ nombre: 'Nombre Prueba', [campoUnico]: '[valor-valido]' });
    [entidadPrincipal]Repo.data.set(entidad.id, entidad);

    // Act
    const resultado = await useCase.execute({ [entidadPrincipalId]: entidad.id, /* otros parámetros */ });

    // Assert
    assert.ok(resultado, 'Debe retornar el aggregate creado');
    assert.strictEqual(transaccionRepo.data.length, 1, 'Debe persistir exactamente 1 transacción');
  });

  it('rechaza [operacion] cuando se viola una regla de negocio', async () => {
    // Configura el mock del domainService para lanzar la excepción esperada
    useCase = new [OperacionPrincipal]UseCase({
      [entidadPrincipal]Repository: [entidadPrincipal]Repo,
      [transaccion]Repository: transaccionRepo,
      notificationPort: notificationMock,
      domainService: {
        validar[OperacionPrincipal]: () => {
          throw new Error('Regla de negocio violada: [describe la regla]');
        },
      },
    });

    // Arrange
    const entidad = new [TuEntidad]({ nombre: 'Nombre Prueba', [campoUnico]: '[valor-valido]' });
    [entidadPrincipal]Repo.data.set(entidad.id, entidad);

    // Act & Assert
    await assert.rejects(
      () => useCase.execute({ [entidadPrincipalId]: entidad.id }),
      /Regla de negocio violada/,
    );
  });
});
```

---

## 📊 Entregables

| Entregable                              | Descripción                                                                | Peso |
| --------------------------------------- | -------------------------------------------------------------------------- | ---- |
| `domain/` completo                      | Entidades, VOs, Aggregates, Puertos y DomainService de **tu dominio**      | 30%  |
| `application/` con 3 casos de uso       | Las 3 operaciones principales de tu dominio (crear, actualizar, consultar) | 25%  |
| `infrastructure/` con InMemory adapters | Repositorios InMemory y adaptador de notificaciones para testing           | 20%  |
| Tests corriendo sin BD                  | `node --test tests/` finaliza en < 2 segundos, mínimo 10 pruebas           | 25%  |

---

## ✅ Criterios de éxito

```bash
# Comando de verificación
node --test tests/

# Resultado esperado (con nombres de TU dominio):
# ✓ [TuEntidad] entity - creación válida
# ✓ [TuEntidad] entity - rechaza [campo inválido]
# ✓ [TuCampoVO] VO - acepta valor dentro del rango
# ✓ [TuCampoVO] VO - rechaza valor fuera del rango
# ✓ [TuTransaccion] aggregate - registra operación y dispara evento
# ✓ [OperacionPrincipal]UseCase - ejecuta exitosamente
# ✓ [OperacionPrincipal]UseCase - rechaza cuando se viola regla de negocio
# ... (mínimo 10 pruebas pasando)
#
# Duration: < 2000ms
# No DB connections. No HTTP servers. No network calls.
```

> ⚠️ Los nombres de las pruebas deben reflejar **tu dominio**, no EduFlow ni ningún otro dominio ajeno.

---

## 💡 Recursos de apoyo

- [Teoría: Clean Architecture](../1-teoria/02-clean-architecture.md)
- [Teoría: Arquitectura Hexagonal](../1-teoria/03-arquitectura-hexagonal.md)
- [Teoría: DDD Básico](../1-teoria/04-ddd-basico.md)
- [Práctica 01: Refactorización](../2-practicas/01-practica-clean-architecture.md)
- [Práctica 02: Ports & Adapters](../2-practicas/02-practica-hexagonal.md)
- [Práctica 03: DDD](../2-practicas/03-practica-ddd.md)
