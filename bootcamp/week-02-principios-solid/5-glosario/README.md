# 📖 Glosario de Términos - Semana 02: Principios SOLID

## 🎯 Términos por Orden Alfabético

---

### A

**Abstracción**

- **Definición**: Proceso de ocultar los detalles de implementación y mostrar solo la funcionalidad esencial
- **En SOLID**: Base del DIP (Dependency Inversion Principle)
- **Ejemplo**: Clase `Database` que define métodos sin implementarlos

**Acoplamiento (Coupling)**

- **Definición**: Grado de interdependencia entre módulos
- **Tipos**: Fuerte (malo) vs Débil (bueno)
- **Relación SOLID**: Todos los principios buscan reducir acoplamiento
- **Ejemplo**: Usar interfaces reduce acoplamiento

**Alta Cohesión**

- **Definición**: Los elementos de un módulo están fuertemente relacionados
- **Beneficio**: Código más mantenible y comprensible
- **Relación SOLID**: SRP promueve alta cohesión
- **Ejemplo**: Clase `UserValidator` solo valida usuarios

---

### B

**Bajo Acoplamiento**

- **Definición**: Módulos con mínima dependencia entre sí
- **Beneficio**: Cambios localizados, menor propagación de errores
- **Relación SOLID**: DIP reduce acoplamiento mediante abstracciones
- **Ejemplo**: Servicio depende de interfaz, no de implementación concreta

---

### C

**Clase Abstracta**

- **Definición**: Clase que no puede ser instanciada directamente
- **Propósito**: Definir comportamiento base para subclases
- **En JavaScript**: Lanzar errores en métodos no implementados
- **Ejemplo**: `class NotificationChannel { send() { throw Error() } }`

**Cohesión**

- **Definición**: Medida de qué tan relacionadas están las responsabilidades dentro de un módulo
- **Niveles**: Funcional (mejor) → Temporal (peor)
- **Relación SOLID**: SRP maximiza cohesión
- **Ver**: Alta Cohesión

**Composición**

- **Definición**: Técnica de combinar objetos simples para crear complejos
- **vs Herencia**: Más flexible, menor acoplamiento
- **Relación SOLID**: Alternativa cuando LSP se viola
- **Ejemplo**: `class Car { engine = new Engine() }` en lugar de `class Car extends Engine`

**Contrato**

- **Definición**: Conjunto de promesas entre cliente y proveedor
- **Componentes**: Precondiciones, postcondiciones, invariantes
- **Relación SOLID**: LSP exige cumplir contratos
- **Ejemplo**: Método `save()` debe retornar entidad guardada

---

### D

**Dependencia**

- **Definición**: Relación donde un módulo necesita otro para funcionar
- **Problema**: Dependencias concretas crean acoplamiento
- **Solución**: Invertir con abstracciones (DIP)
- **Ejemplo**: `class Service { constructor(repository) }` (inyección)

**Dependency Inversion Principle (DIP)**

- **Definición**: Alto nivel no debe depender de bajo nivel; ambos de abstracciones
- **Beneficio**: Desacoplamiento, flexibilidad
- **Técnica**: Inyección de dependencias
- **Ejemplo**: Servicio recibe repositorio abstracto, no MongoDB concreto

**Duck Typing**

- **Definición**: "Si camina como pato y hace cuac, es un pato"
- **En JavaScript**: Objetos validados por estructura, no tipo
- **Relación SOLID**: Permite ISP sin interfaces formales
- **Ejemplo**: Si objeto tiene `send()`, puede ser canal de notificación

---

### E

**Encapsulación**

- **Definición**: Ocultar detalles internos de implementación
- **En JavaScript**: Campos privados con `#`
- **Beneficio**: Protege invariantes de la clase
- **Ejemplo**: `#password` en lugar de `this.password`

**Extensibilidad**

- **Definición**: Capacidad de agregar funcionalidad sin modificar código existente
- **Relación SOLID**: OCP (Open/Closed Principle)
- **Técnica**: Polimorfismo, Strategy Pattern
- **Ejemplo**: Agregar `PayPalPayment` sin modificar `PaymentService`

---

### H

**Herencia**

- **Definición**: Mecanismo donde clase deriva de otra
- **Riesgo**: Puede violar LSP si no se usa correctamente
- **Regla**: "Es-un" verdadero (Cuadrado NO es Rectángulo)
- **Ejemplo**: `class DigitalBook extends Book` (correcto)

---

### I

**Implementación**

- **Definición**: Código concreto que realiza la funcionalidad
- **vs Interfaz**: Interfaz define qué, implementación define cómo
- **Relación SOLID**: DIP dice depender de interfaces, no implementaciones
- **Ejemplo**: `MongoDBRepository` implementa `Repository`

**Inyección de Dependencias**

- **Definición**: Pasar dependencias desde el exterior en lugar de crearlas internamente
- **Tipos**: Constructor, Setter, Interfaz
- **Beneficio**: Facilita testing y cumple DIP
- **Ejemplo**: `new Service(repository)` en lugar de `new Service()` que crea `new MongoDB()`

**Interface Segregation Principle (ISP)**

- **Definición**: Clientes no deben depender de interfaces que no usan
- **Beneficio**: Interfaces específicas, no gordas
- **Técnica**: Dividir interfaces grandes en pequeñas
- **Ejemplo**: `Switchable` + `Dimmable` en lugar de `SmartDevice`

**Interfaz (Interface)**

- **Definición**: Contrato que define métodos sin implementarlos
- **En JavaScript**: Clase base con métodos que lanzan errores
- **En TypeScript**: Keyword `interface`
- **Ejemplo**: `class Repository { save() { throw Error() } }`

**Invariante**

- **Definición**: Condición que siempre debe ser verdadera
- **Relación SOLID**: LSP exige mantener invariantes
- **Ejemplo**: Balance bancario nunca negativo

---

### L

**Liskov Substitution Principle (LSP)**

- **Definición**: Objetos de subclases deben sustituir objetos de clase base sin errores
- **Regla**: Si S es subtipo de T, entonces T puede ser reemplazado por S
- **Violación clásica**: Cuadrado hereda de Rectángulo
- **Ejemplo correcto**: `PhysicalBook` sustituye a `Book` sin problemas

---

### M

**Mantenibilidad**

- **Definición**: Facilidad para modificar y corregir código
- **Métricas**: Cohesión, acoplamiento, complejidad
- **Relación SOLID**: Todos los principios mejoran mantenibilidad
- **Beneficio**: Menor costo a largo plazo

**Modularidad**

- **Definición**: Organización del código en módulos independientes
- **Beneficio**: Reutilización, testing aislado
- **Relación SOLID**: SRP promueve módulos cohesivos
- **Ejemplo**: `validators/`, `repositories/`, `services/`

---

### O

**Open/Closed Principle (OCP)**

- **Definición**: Entidades abiertas para extensión, cerradas para modificación
- **Beneficio**: Agregar funcionalidad sin riesgo
- **Técnica**: Polimorfismo, Strategy Pattern
- **Ejemplo**: Agregar `WhatsAppChannel` sin modificar `NotificationService`

---

### P

**Polimorfismo**

- **Definición**: Capacidad de objetos diferentes responder al mismo mensaje
- **Tipos**: Ad-hoc, Paramétrico, Subtipado
- **Relación SOLID**: Clave para OCP y LSP
- **Ejemplo**: `EmailChannel.send()` y `SMSChannel.send()` ambos responden a `send()`

**Postcondición**

- **Definición**: Garantía que método cumple después de ejecutarse
- **Relación SOLID**: LSP dice que subtipos no pueden debilitar postcondiciones
- **Ejemplo**: Método `save()` debe retornar entidad guardada

**Precondición**

- **Definición**: Requisito que debe cumplirse antes de ejecutar método
- **Relación SOLID**: LSP dice que subtipos no pueden fortalecer precondiciones
- **Ejemplo**: Método `divide(a, b)` requiere `b !== 0`

**Principio**

- **Definición**: Regla fundamental que guía decisiones de diseño
- **SOLID**: Acrónimo de 5 principios clave
- **Propósito**: Crear código mantenible, extensible, testeable
- **Origen**: Robert C. Martin (Uncle Bob)

---

### R

**Refactorización**

- **Definición**: Mejorar estructura del código sin cambiar funcionalidad
- **Cuándo**: Cuando se detectan violaciones SOLID
- **Técnicas**: Extract Class, Extract Method, Replace Conditional with Polymorphism
- **Herramienta**: Refactoring Guru

**Responsabilidad**

- **Definición**: Razón para cambiar una clase
- **Relación SOLID**: SRP dice "una clase, una responsabilidad"
- **Identificación**: Pregunta "¿Por qué cambiaría esta clase?"
- **Ejemplo**: `UserValidator` tiene responsabilidad de validar usuarios

**Reutilización**

- **Definición**: Usar código en múltiples contextos
- **Beneficio**: Menos duplicación, mayor productividad
- **Relación SOLID**: Alta cohesión + Bajo acoplamiento = Alta reutilización
- **Ejemplo**: `EmailService` usado en múltiples módulos

---

### S

**Separación de Concerns (SoC)**

- **Definición**: Dividir programa en secciones con responsabilidades distintas
- **Relación SOLID**: SRP es aplicación de SoC a clases
- **Beneficio**: Mantenibilidad, testabilidad
- **Ejemplo**: Separar validación, persistencia, notificación

**Single Responsibility Principle (SRP)**

- **Definición**: Clase debe tener una sola razón para cambiar
- **Beneficio**: Clases pequeñas, enfocadas, fáciles de entender
- **Técnica**: Identificar responsabilidades y dividir
- **Ejemplo**: `UserService`, `UserValidator`, `UserRepository` separados

**SOLID**

- **Acrónimo**: **S**ingle Responsibility, **O**pen/Closed, **L**iskov Substitution, **I**nterface Segregation, **D**ependency Inversion
- **Autor**: Robert C. Martin (concepto), Michael Feathers (acrónimo)
- **Propósito**: Guiar diseño orientado a objetos
- **Aplicación**: Cualquier lenguaje OOP (Java, C#, JavaScript, Python)

**Strategy Pattern**

- **Definición**: Patrón que encapsula algoritmos como objetos intercambiables
- **Relación SOLID**: Implementa OCP
- **Componentes**: Contexto, Estrategia, Estrategias Concretas
- **Ejemplo**: Canales de notificación (Email, SMS, WhatsApp)

**Subtipo**

- **Definición**: Tipo derivado de otro (clase hija)
- **Relación SOLID**: LSP rige cómo crear subtipos correctos
- **Regla**: Debe ser sustituible por tipo base
- **Ejemplo**: `DigitalBook` es subtipo de `Book`

---

### T

**Testing**

- **Definición**: Verificación de que código funciona correctamente
- **Relación SOLID**: Código que cumple SOLID es más testeable
- **Beneficios de SOLID**: Mocks fáciles (DIP), tests enfocados (SRP)
- **Herramientas**: Jest, Mocha, Vitest

---

### V

**Violación**

- **Definición**: Incumplimiento de un principio SOLID
- **Identificación**: Code smells, god classes, rigidez
- **Solución**: Refactorización aplicando el principio violado
- **Ejemplo**: Clase que hace validación + persistencia + email (viola SRP)

---

## 📚 Recursos Adicionales

- **Teoría completa**: Ver carpeta `1-teoria/`
- **Ejemplos prácticos**: Ver carpeta `2-practicas/`
- **Proyecto integrador**: Ver carpeta `3-proyecto/`

---

## 🔍 Términos Relacionados por Principio

### SRP (Single Responsibility)

- Responsabilidad, Cohesión, Separación de Concerns, Modularidad

### OCP (Open/Closed)

- Extensibilidad, Polimorfismo, Strategy Pattern, Abstracción

### LSP (Liskov Substitution)

- Herencia, Subtipo, Contrato, Precondición, Postcondición, Invariante

### ISP (Interface Segregation)

- Interfaz, Cliente, Dependencia, Duck Typing

### DIP (Dependency Inversion)

- Abstracción, Inyección de Dependencias, Acoplamiento, Implementación

---

**Bootcamp de Arquitectura de Software - Semana 02**
_SENA - Tecnología en Análisis y Desarrollo de Software_
_bc-channel-epti_
