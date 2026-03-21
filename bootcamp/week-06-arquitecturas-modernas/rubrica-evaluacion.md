# 📊 Rúbrica de Evaluación - Semana 06

## Arquitecturas Modernas: Microservicios, Clean Architecture y Arquitectura Hexagonal

---

## 🎯 Competencias a Evaluar

Esta semana evalúa las siguientes competencias del programa de formación:

1. **Comprender** las diferencias entre arquitecturas monolítica, microservicios, Clean Architecture y Hexagonal
2. **Diseñar** la separación entre dominio, aplicación e infraestructura siguiendo Clean Architecture
3. **Implementar** puertos y adaptadores en la Arquitectura Hexagonal con JavaScript ES2023
4. **Aplicar** principios de DDD básico: entidades, value objects, repositorios y servicios de dominio
5. **Justificar** la selección de una arquitectura moderna según el contexto del negocio

---

## 📋 Estructura de Evaluación

| Tipo de Evidencia | Peso | Criterio de Aprobación |
| ----------------- | ---- | ---------------------- |
| 🧠 Conocimiento   | 30%  | Mínimo 70%             |
| 💪 Desempeño      | 40%  | Mínimo 70%             |
| 📦 Producto       | 30%  | Mínimo 70%             |

---

## 🧠 Evidencia de Conocimiento (30%)

### Criterios de Evaluación

| Criterio                        | Excelente (100%)                                                                                                        | Bueno (85%)                                           | Aceptable (70%)                           | Insuficiente (<70%)                              |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------- | ------------------------------------------------ |
| **Monolito vs Microservicios**  | Explica ventajas, desventajas y criterios de decisión. Cita ejemplos reales (Amazon, Netflix) y el patrón Strangler Fig | Explica las diferencias principales con ejemplos      | Identifica las diferencias básicas        | No logra diferenciar los estilos arquitectónicos |
| **Capas de Clean Architecture** | Describe con precisión las 4 capas (Entities, Use Cases, Interface Adapters, Frameworks) y la Regla de Dependencia      | Describe las capas y la dirección de dependencias     | Identifica las capas principales          | No logra describir la estructura de capas        |
| **Puertos y Adaptadores**       | Explica qué es un puerto (contrato) y qué es un adaptador (implementación). Distingue puertos primarios de secundarios  | Explica la diferencia con ejemplos                    | Entiende el concepto básico de separación | Confunde puertos con adaptadores                 |
| **DDD básico**                  | Define correctamente entidades, value objects, agregados, repositorios y servicios de dominio con ejemplos de código    | Define los conceptos principales con ejemplos básicos | Identifica entidades y repositorios       | No logra definir los conceptos de DDD            |

### Instrumento de Evaluación

- **Quiz teórico** (20 preguntas, 25 minutos)
- **Diagrama de capas**: dado un monolito, identificar qué partes pertenecen al dominio, aplicación e infraestructura
- **Pregunta de selección**: para un caso de negocio dado, justificar si usar monolito, microservicios o Clean Architecture

---

## 💪 Evidencia de Desempeño (40%)

### Criterios de Evaluación

| Criterio                               | Excelente (100%)                                                                                                                                   | Bueno (85%)                                           | Aceptable (70%)                                                    | Insuficiente (<70%)                                         |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| **Separación dominio/infraestructura** | El dominio no importa frameworks, librerías externas ni detalles de BD. Regla de dependencia respetada en todos los módulos                        | La separación es visible con mínimas violaciones      | Existe separación parcial entre dominio y datos                    | No hay separación; el dominio depende de la infraestructura |
| **Puertos definidos como interfaces**  | Los puertos (IUserRepository, IEmailPort) están definidos como clases abstractas o JSDoc @interface. Los adaptadores los implementan correctamente | Puertos y adaptadores definidos con pequeños errores  | Existe alguna interfaz aunque no completamente correcta            | No existen puertos definidos                                |
| **Inyección de dependencias**          | Las dependencias se inyectan por constructor. Ningún caso de uso crea instancias concretas con `new` de infraestructura                            | DI aplicada en los casos de uso principales           | DI parcialmente aplicada                                           | Sin DI; dependencias hardcodeadas                           |
| **Casos de uso (Use Cases)**           | Cada caso de uso cumple SRP: una acción del negocio, orquesta dominio y puertos, maneja errores de dominio                                         | Casos de uso claros con lógica de negocio correcta    | Casos de uso identificables aunque mezclan algo de infraestructura | No hay casos de uso separados                               |
| **Entidades y Value Objects**          | Las entidades tienen identidad e invariantes validadas. Los Value Objects son inmutables y encapsulan lógica de validación                         | Entidades y Value Objects implementados correctamente | Entidades reconocibles aunque sin Value Objects                    | Sin entidades de dominio; solo DTOs/plain objects           |

### Instrumento de Evaluación

- **Code review en vivo**: se revisa el proyecto y se identifican violaciones a la Regla de Dependencia
- **Live coding**: agregar un nuevo adaptador (ej. cambiar PostgreSQL por SQLite) sin modificar el dominio
- **Refactorización guiada**: transformar una función que mezcla lógica de negocio con SQL en un caso de uso + repositorio

---

## 📦 Evidencia de Producto (30%)

### Criterios de Evaluación

| Criterio                              | Excelente (100%)                                                                                                                                                 | Bueno (85%)                                              | Aceptable (70%)                                                         | Insuficiente (<70%)                                             |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Estructura de carpetas**            | La estructura refleja la arquitectura: `domain/`, `application/`, `infrastructure/`, `interfaces/`. Nombres expresivos y consistentes                            | Estructura clara con alguna inconsistencia menor         | Estructura básica diferenciando dominio de infraestructura              | Sin estructura arquitectónica reconocible                       |
| **Dominio puro**                      | El directorio `domain/` contiene solo entidades, value objects, repositorios (interfaces) y servicios de dominio. Cero imports de frameworks                     | Dominio casi limpio con algún import menor de utilidades | Dominio separado aunque con algún import de infraestructura             | El dominio importa Express, Knex, pg u otras librerías externas |
| **Intercambiabilidad de adaptadores** | Existe al menos un adaptador alternativo (ej. `InMemoryUserRepository` para tests, `PostgresUserRepository` para producción) que demuestra la intercambiabilidad | Un adaptador alternativo implementado parcialmente       | La arquitectura permite intercambiar, aunque no se demuestra con código | Sin adaptadores intercambiables                                 |
| **Documentación arquitectónica**      | Diagrama de capas, lista de puertos con su propósito, decisiones ADR documentadas con contexto, problema y decisión                                              | Diagrama y descripción de puertos principales            | Descripción de la arquitectura sin diagramas formales                   | Sin documentación arquitectónica                                |

### Entregables Requeridos

1. **Código fuente** en repositorio Git con estructura de Clean/Hexagonal Architecture
2. **Diagrama de arquitectura** (`docs/arquitectura.md`): capas, puertos, adaptadores y flujo
3. **ADR (Architecture Decision Record)** (`docs/adr-001.md`): decisión de arquitectura con contexto y consecuencias
4. **README** del proyecto con instrucciones para cambiar de adaptador

---

## ⏱️ Cronograma de Evaluación

| Actividad                 | Duración   | Modalidad  |
| ------------------------- | ---------- | ---------- |
| Quiz teórico              | 25 min     | Individual |
| Live coding / code review | 30 min     | Individual |
| Sustentación del proyecto | 15 min     | Individual |
| **Total**                 | **70 min** | —          |

---

## 📈 Escala de Valoración SENA

| Rango   | Calificación | Significado                      |
| ------- | ------------ | -------------------------------- |
| 90–100% | Excelente    | Supera ampliamente lo esperado   |
| 80–89%  | Bueno        | Cumple con holgura los criterios |
| 70–79%  | Aceptable    | Cumple los criterios mínimos     |
| < 70%   | Insuficiente | No alcanza los criterios mínimos |

> ⚠️ Se requiere mínimo **70% en cada evidencia** para aprobar la semana.

---

## 💡 Recomendaciones para el Aprendiz

- Practica la Regla de Dependencia: corre `grep -r "express\|knex\|pg" src/domain/` — el resultado debe estar **vacío**
- Implementa primero el dominio y los casos de uso antes de tocar Express o la BD
- Cada vez que vayas a escribir `new PostgresRepository()` dentro de un caso de uso, detente y usa inyección de dependencias
- El test más valioso: ¿puedes ejecutar tus casos de uso **sin ningúna conexión a la BD**?
