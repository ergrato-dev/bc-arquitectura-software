# 🚀 Proyecto Integrador - Semana 02

## 🎯 Objetivo General

Aplicar **todos los principios SOLID** al dominio de negocio que te fue asignado, refactorizando o diseñando componentes que cumplan con cada principio de manera demostrable.

## ⏱️ Duración

- Trabajo en clase: 60 minutos
- Trabajo autónomo: 90 minutos
- **Total**: 2.5 horas

---

## 📋 Descripción del Proyecto

Este proyecto es la **segunda iteración** de tu caso de estudio personal:

- **Semana 01**: Selección de caso y metodología ✅
- **Semana 02**: Aplicación de principios SOLID ← **ESTÁS AQUÍ**
- **Semana 03**: Definición de patrón arquitectónico
- **Semana 04**: Diseño de APIs y componentes
- **Semana 05**: Implementación de patrones de diseño
- **Semana 06**: Arquitectura moderna (microservicios/hexagonal)
- **Semana 07**: Containerización con Docker
- **Semana 08**: Seguridad en la arquitectura
- **Semana 09**: Presentación final completa

---

## 🎯 Tu Dominio Asignado

Continuarás trabajando con el **dominio de negocio único** que te fue asignado en la semana 01. Esta semana aplicarás los 5 principios SOLID a ese dominio específico.

---

## 📝 Requerimientos de Esta Semana

### 1. Análisis de tu Dominio con SOLID

Identifica en tu dominio asignado dónde aplicarás cada principio:

**Ejemplos genéricos** (adapta a tu dominio):

- **Entidades principales**: ¿Qué objetos/conceptos maneja tu sistema?
- **Operaciones críticas**: ¿Qué acciones realizan los usuarios?
- **Variabilidad**: ¿Qué elementos pueden tener múltiples implementaciones?
- **Dependencias técnicas**: ¿Qué servicios externos necesitas?

### 2. Documentación de Aplicación de SOLID

Crea un documento `SOLID-APLICADO.md` que explique:

#### Single Responsibility Principle (SRP)

**Debes identificar**:

- Al menos **3 responsabilidades diferentes** en tu dominio
- Cómo dividirlas en clases separadas
- Razones por las que cada clase cambiaría

**Ejemplo de formato** (adapta a tu dominio):

```markdown
### SRP en [Tu Dominio]

#### Responsabilidad 1: Validación de [Entidad]

- **Clase**: `[Entidad]Validator`
- **Responsabilidad única**: Validar datos de entrada
- **Razón para cambiar**: Cambios en reglas de validación

#### Responsabilidad 2: Persistencia de [Entidad]

- **Clase**: `[Entidad]Repository`
- **Responsabilidad única**: Almacenar y recuperar datos
- **Razón para cambiar**: Cambio de base de datos

#### Responsabilidad 3: Notificaciones

- **Clase**: `NotificationService`
- **Responsabilidad única**: Enviar notificaciones a usuarios
- **Razón para cambiar**: Nuevo canal de comunicación
```

#### Open/Closed Principle (OCP)

**Debes identificar**:

- Al menos **1 elemento extensible** en tu dominio
- Estrategia para agregar variantes sin modificar código existente

**Ejemplo de formato**:

```markdown
### OCP en [Tu Dominio]

#### Elemento extensible: [Concepto Variable]

**Escenario**: En mi dominio, [concepto] puede tener múltiples tipos/variantes.

**Diseño actual** (cerrado para modificación):

- Clase base abstracta: `[ConceptoBase]`
- Define contrato común: `metodo1()`, `metodo2()`

**Extensiones posibles** (abierto para extensión):

- `[Variante1]` extiende `[ConceptoBase]`
- `[Variante2]` extiende `[ConceptoBase]`
- Futuras variantes solo requieren crear nueva clase

**Beneficio**: Agregar nueva variante no requiere modificar código existente.
```

#### Liskov Substitution Principle (LSP)

**Debes identificar**:

- Jerarquía de clases donde subtipos sustituyan al tipo base
- Garantía de que el comportamiento esperado se mantiene

**Ejemplo de formato**:

```markdown
### LSP en [Tu Dominio]

#### Jerarquía: [ConceptoBase] y sus subtipos

**Tipo base**: `[ConceptoBase]`

- Contrato: Métodos que todos los subtipos deben cumplir
- Invariantes: Condiciones que siempre se mantienen

**Subtipos**:

1. `[Subtipo1]` - Cumple contrato, sustituible ✅
2. `[Subtipo2]` - Cumple contrato, sustituible ✅

**Validación LSP**:

- Cliente que usa `[ConceptoBase]` funciona igual con cualquier subtipo
- No se lanzan excepciones inesperadas
- Postcondiciones se mantienen
```

#### Interface Segregation Principle (ISP)

**Debes identificar**:

- Interfaces específicas en lugar de una interfaz general
- Clientes que usan solo parte de la funcionalidad

**Ejemplo de formato**:

```markdown
### ISP en [Tu Dominio]

#### Problema evitado: Interfaz gorda

En lugar de una interfaz única con todos los métodos, creo interfaces específicas:

**Interfaces segregadas**:

1. `[CapacidadA]` - Solo para entidades que necesitan capacidad A
2. `[CapacidadB]` - Solo para entidades que necesitan capacidad B
3. `[CapacidadC]` - Solo para entidades que necesitan capacidad C

**Implementaciones**:

- `[Entidad1]` implementa `[CapacidadA]` + `[CapacidadB]`
- `[Entidad2]` implementa solo `[CapacidadB]`

**Beneficio**: Ninguna clase implementa métodos que no usa.
```

#### Dependency Inversion Principle (DIP)

**Debes identificar**:

- Dependencias abstraídas (repositorios, servicios externos)
- Inyección de dependencias en servicios

**Ejemplo de formato**:

````markdown
### DIP en [Tu Dominio]

#### Inversión de dependencias

**Alto nivel**: `[Servicio]Service`

- Define lógica de negocio
- Depende de abstracciones

**Bajo nivel**: Implementaciones concretas

- `[Implementacion1]` implementa abstracción
- `[Implementacion2]` implementa abstracción

**Abstracción**: `[NombreAbstraccion]`

- Interface/clase base que define contrato
- Ejemplo: `Repository`, `NotificationChannel`, `PaymentProcessor`

**Inyección**:

```javascript
class [Servicio]Service {
  constructor(repository, notificationChannel) {
    this.repository = repository; // ✅ Inyectado
    this.notificationChannel = notificationChannel; // ✅ Inyectado
  }
}
```
````

**Beneficio**: Cambiar implementación sin modificar servicio.

```

---

## 💻 Implementación en Código

### Estructura Mínima de Carpetas

Adapta esta estructura a tu dominio:

```

week-02/tu-proyecto/
├── package.json
├── README.md
├── SOLID-APLICADO.md
├── src/
│ ├── domain/
│ │ ├── entities/
│ │ │ ├── [entidad1].js
│ │ │ ├── [entidad2].js
│ │ │ └── [entidad3].js
│ │ └── interfaces/
│ │ ├── repository.js
│ │ └── [otra-abstraccion].js
│ ├── repositories/
│ │ └── memory-repository.js
│ ├── services/
│ │ ├── [servicio1]-service.js
│ │ └── [servicio2]-service.js
│ ├── validators/
│ │ └── [entidad]-validator.js
│ └── index.js
└── tests/
└── [servicio]-service.test.js

````

### Implementación Mínima Requerida

Debes implementar al menos:

1. **3 clases de dominio** (entidades principales de tu negocio)
2. **1 abstracción** (interfaz o clase base)
3. **2 implementaciones** de esa abstracción
4. **1 servicio** que use inyección de dependencias
5. **1 test** que demuestre funcionamiento

### Ejemplo de Código Genérico

**Entidad de dominio** (adapta a tu caso):

```javascript
// src/domain/entities/[entidad-principal].js
export class [EntidadPrincipal] {
  constructor(id, atributo1, atributo2) {
    this.id = id;
    this.atributo1 = atributo1;
    this.atributo2 = atributo2;
    this.estado = 'ACTIVO';
  }

  metodoDeNegocio() {
    // Lógica específica de tu dominio
  }
}
````

**Abstracción (Repository)** (igual para todos):

```javascript
// src/domain/interfaces/repository.js
export class Repository {
  async save(entity) {
    throw new Error('Implementar save()');
  }

  async findById(id) {
    throw new Error('Implementar findById()');
  }

  async findAll() {
    throw new Error('Implementar findAll()');
  }
}
```

**Implementación concreta**:

```javascript
// src/repositories/memory-repository.js
import { Repository } from '../domain/interfaces/repository.js';

export class MemoryRepository extends Repository {
  #data = new Map();

  async save(entity) {
    this.#data.set(entity.id, entity);
    return entity;
  }

  async findById(id) {
    return this.#data.get(id) || null;
  }

  async findAll() {
    return Array.from(this.#data.values());
  }
}
```

**Servicio con DIP**:

```javascript
// src/services/[dominio]-service.js
export class [Dominio]Service {
  constructor(repository, validator) {
    this.repository = repository; // ✅ DIP
    this.validator = validator;   // ✅ DIP
  }

  async crearOperacion(datos) {
    // Validar (SRP - validator)
    this.validator.validate(datos);

    // Crear entidad
    const entidad = new [EntidadPrincipal](...datos);

    // Persistir (SRP - repository)
    return await this.repository.save(entidad);
  }
}
```

---

## 📊 Tabla de Cumplimiento SOLID

Incluye en tu `SOLID-APLICADO.md` esta tabla completada:

| Principio | ¿Dónde se aplica en mi dominio? | Clase/Archivo  | ✅  |
| --------- | ------------------------------- | -------------- | --- |
| **SRP**   | [Descripción específica]        | `[archivo.js]` | [ ] |
| **OCP**   | [Descripción específica]        | `[archivo.js]` | [ ] |
| **LSP**   | [Descripción específica]        | `[archivo.js]` | [ ] |
| **ISP**   | [Descripción específica]        | `[archivo.js]` | [ ] |
| **DIP**   | [Descripción específica]        | `[archivo.js]` | [ ] |

---

## 🎯 Criterios de Evaluación

### Evidencia de Conocimiento (30%)

- [ ] Documento `SOLID-APLICADO.md` completo
- [ ] Identificación correcta de dónde aplicar cada principio
- [ ] Explicación clara de por qué aplicaste SOLID en cada caso
- [ ] Comparación antes/después (si refactorizaste código de semana 01)

### Evidencia de Desempeño (40%)

- [ ] Código implementa SRP (responsabilidades separadas)
- [ ] Código implementa OCP (extensible sin modificar)
- [ ] Código implementa LSP (subtipos sustituibles)
- [ ] Código implementa ISP (interfaces específicas)
- [ ] Código implementa DIP (inyección de dependencias)
- [ ] Código funcional en JavaScript ES2023

### Evidencia de Producto (30%)

- [ ] Estructura de carpetas clara
- [ ] Al menos 1 test funcional
- [ ] README con instrucciones de ejecución
- [ ] Diagrama de clases básico (opcional pero recomendado)

---

## 📋 Entregables

### 1. Carpeta de Proyecto

```
bootcamp/week-02/tu-proyecto/
```

### 2. Archivos Obligatorios

- `README.md`: Instrucciones de instalación y ejecución
- `SOLID-APLICADO.md`: Documentación detallada de aplicación de SOLID
- `package.json`: Configuración del proyecto
- Código fuente en `src/`
- Al menos 1 test en `tests/`

### 3. Contenido del README.md

Debe incluir:

````markdown
# [Nombre de Tu Proyecto]

## Descripción

[Breve descripción de tu dominio]

## Instalación

```bash
cd bootcamp/week-02/tu-proyecto
pnpm install
```
````

## Ejecución

```bash
node src/index.js
```

## Tests

```bash
node tests/[nombre]-test.js
```

## Principios SOLID Aplicados

Ver documento [SOLID-APLICADO.md](./SOLID-APLICADO.md) para detalles.

## Estructura del Proyecto

[Descripción de carpetas y archivos principales]

```

---

## 💡 Consejos Prácticos

### ✅ Haz

1. **Empieza simple**: No intentes implementar todo tu dominio
2. **Enfócate en SOLID**: Mejor 3 clases bien diseñadas que 10 mal diseñadas
3. **Documenta decisiones**: Explica POR QUÉ aplicaste cada principio
4. **Testea**: Al menos un test que demuestre DIP o OCP
5. **Usa campos privados**: `#atributo` en JavaScript ES2023

### ❌ Evita

1. **God Classes**: Clases que hacen de todo (viola SRP)
2. **Código no funcional**: Debe ejecutarse sin errores
3. **Copiar dominios de ejemplos**: Usa TU dominio asignado
4. **Ignorar algún principio**: Debes aplicar los 5

---

## 🔍 Preguntas Guía para tu Dominio

Responde estas preguntas para aplicar SOLID:

### Para SRP:
- ¿Qué responsabilidades diferentes existen en mi dominio?
- ¿Qué clases cambiarían por razones diferentes?

### Para OCP:
- ¿Qué elementos de mi dominio tienen variantes o tipos?
- ¿Cómo puedo agregar nuevas variantes sin modificar código?

### Para LSP:
- ¿Tengo jerarquías de clases en mi dominio?
- ¿Los subtipos pueden sustituir al tipo base?

### Para ISP:
- ¿Alguna entidad implementa métodos que no usa?
- ¿Puedo dividir interfaces grandes en específicas?

### Para DIP:
- ¿Qué servicios externos usa mi sistema?
- ¿Mis servicios dependen de abstracciones o implementaciones concretas?

---

## 🚀 Ejemplo de Flujo de Trabajo

**Paso 1**: Analiza tu dominio asignado
- Identifica entidades principales
- Define operaciones críticas

**Paso 2**: Diseña aplicando SOLID
- Dibuja diagrama de clases (papel o digital)
- Identifica dónde aplica cada principio

**Paso 3**: Implementa incremental
- Empieza con entidades (SRP)
- Agrega abstracciones (DIP)
- Implementa extensibilidad (OCP)

**Paso 4**: Documenta
- Completa `SOLID-APLICADO.md`
- Explica cada decisión

**Paso 5**: Testea
- Crea al menos 1 test
- Valida que funcione

---

## 📚 Recursos de Apoyo

- **Teoría**: `bootcamp/week-02/1-teoria/`
- **Prácticas**: `bootcamp/week-02/2-practicas/`
- **Reto**: `bootcamp/week-02/reto-semana-02.md` (ejemplo de refactorización)
- **Ebooks**: `bootcamp/week-02/4-recursos/ebooks-free/`

---

## ⚠️ Política Anticopia

- **Tu dominio es único**: No copies implementaciones de compañeros
- **Referencias permitidas**: Puedes inspirarte en las prácticas del bootcamp
- **Código propio**: Todo debe ser escrito por ti, adaptado a tu dominio
- **Evaluación individual**: Se verificará que el código corresponda a tu dominio asignado

---

## 🎯 Resultado Esperado

Al finalizar esta semana, deberías tener:

- ✅ Proyecto con estructura clara separando responsabilidades (SRP)
- ✅ Capacidad de agregar nuevas variantes sin modificar código (OCP)
- ✅ Jerarquías correctas donde subtipos sustituyan a base (LSP)
- ✅ Interfaces específicas sin métodos innecesarios (ISP)
- ✅ Servicios que dependen de abstracciones, no implementaciones (DIP)

---

**Bootcamp de Arquitectura de Software - Semana 02**
_SENA - Tecnología en Análisis y Desarrollo de Software_
_bc-channel-epti_
```
