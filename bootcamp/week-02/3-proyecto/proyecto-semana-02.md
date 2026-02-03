# 🚀 Proyecto Integrador - Semana 02

## 🎯 Objetivo

Refactorizar tu dominio aplicando los **5 principios SOLID**, demostrando comprensión arquitectónica mediante código y documentación técnica.

## ⏱️ Duración

**2.5 horas** (60 min clase + 90 min autónomo)

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

### 1. Análisis SOLID en tu Dominio

Identifica para **cada principio SOLID**:

- ¿Dónde aplica en mi dominio?
- ¿Qué componente refactorizaré?
- ¿Qué problema arquitectónico resuelve?

### 2. Documentación de Aplicación de SOLID

Crea un documento `SOLID-APLICADO.md` que explique:

#### Single Responsibility Principle (SRP)

Identifica **mínimo 3 responsabilidades** separadas en clases distintas:

```markdown
### SRP en [Tu Dominio]

| Responsabilidad | Clase                 | Razón de Cambio          |
| --------------- | --------------------- | ------------------------ |
| Validación      | `[Entidad]Validator`  | Nuevas reglas de negocio |
| Persistencia    | `[Entidad]Repository` | Cambio de BD             |
| Notificaciones  | `NotificationService` | Nuevo canal              |
```

#### Open/Closed Principle (OCP)

Identifica **1 elemento extensible** usando herencia o composición:

- Clase base/interfaz (cerrada a modificación)
- Mínimo 2 extensiones concretas (abiertas a extensión)

#### Liskov Substitution Principle (LSP)

Demuestra jerarquía donde **subtipos sustituyan al tipo base** sin romper funcionalidad.

#### Interface Segregation Principle (ISP)

Crea **interfaces específicas** en lugar de una interfaz "gorda":

- Mínimo 2 interfaces segregadas
- Clases implementan solo lo que necesitan

#### Dependency Inversion Principle (DIP)

Implementa **inyección de dependencias**:

- Servicios dependen de abstracciones
- Implementaciones concretas inyectadas por constructor

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

1. **2 clases de dominio** (entidades principales de tu negocio)
2. **1 abstracción** (interfaz o clase base)
3. **1 implementación** de esa abstracción (puede ser MemoryRepository)
4. **1 servicio** que use inyección de dependencias
5. **Tests opcionales** (recomendados pero no obligatorios esta semana)

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
- [ ] README con instrucciones de ejecución
- [ ] Código ejecutable (mínimo `node src/index.js`)
- [ ] Tests funcionales (opcional, bonus +5%)

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
- Tests (opcionales, carpeta `tests/`)

### 3. README.md

Incluye:

- **Descripción** del dominio
- **Comandos**: `pnpm install`, `pnpm test`, `node src/index.js`
- **Referencia** a `SOLID-APLICADO.md`

---

## 💡 Guía Rápida

**✅ Haz**: Código funcional, tests, documentación técnica, campos privados (`#`)
**❌ Evita**: God Classes, código copiado, código no ejecutable

**Preguntas clave**:

- **SRP**: ¿Qué clases tienen múltiples razones para cambiar?
- **OCP**: ¿Qué elementos tienen variantes?
- **LSP**: ¿Los subtipos sustituyen correctamente al tipo base?
- **ISP**: ¿Hay interfaces con métodos no usados?
- **DIP**: ¿Dependes de abstracciones o implementaciones concretas?

---

## 🚀 Flujo de Trabajo

1. **Analiza**: Identifica dónde aplicar cada principio SOLID
2. **Diseña**: Diagrama de clases con relaciones
3. **Implementa**: Código en JavaScript ES2023
4. **Documenta**: `SOLID-APLICADO.md` con justificaciones
5. **Testea**: Valida funcionamiento

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

```
