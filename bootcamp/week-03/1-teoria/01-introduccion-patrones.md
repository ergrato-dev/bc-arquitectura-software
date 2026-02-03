# 🏛️ Introducción a Patrones Arquitectónicos

## 🎯 ¿Qué es un Patrón Arquitectónico?

Un **patrón arquitectónico** es una solución reutilizable y probada para un problema recurrente en el diseño de la estructura fundamental de un sistema de software. Define la organización general del sistema: cómo se dividen las responsabilidades, cómo se comunican los componentes y qué restricciones rigen la estructura.

### Definición Formal

> "Un patrón arquitectónico expresa un esquema de organización estructural fundamental para sistemas de software. Proporciona un conjunto de subsistemas predefinidos, especifica sus responsabilidades e incluye reglas y guías para organizar las relaciones entre ellos."  
> — Bass, Clements & Kazman, *Software Architecture in Practice*

---

## 🚀 ¿Para Qué Sirven los Patrones Arquitectónicos?

### 1. **Evitar Reinventar la Rueda**

Los patrones arquitectónicos son soluciones que han sido validadas en miles de proyectos reales. Utilizar un patrón probado reduce el riesgo de error y acelera el diseño.

**Ejemplo real:**
- **Netflix** usa arquitectura en capas + microservicios para escalar a 200+ millones de usuarios
- **Spotify** usa event-driven para sincronizar playlists en tiempo real entre dispositivos
- **Amazon** usa cliente-servidor distribuido para gestionar millones de transacciones concurrentes

### 2. **Facilitar la Comunicación en Equipos**

Cuando dices "usaremos arquitectura en capas", todo el equipo entiende inmediatamente:
- Habrá separación entre presentación, lógica de negocio y datos
- Cada capa solo puede comunicarse con la capa inmediatamente inferior
- Los cambios en UI no afectarán la base de datos

### 3. **Guiar Decisiones de Diseño**

Los patrones vienen con **trade-offs** (ventajas/desventajas) conocidos:
- **Layered**: Fácil de entender, pero puede ser lento si hay muchas capas
- **Event-Driven**: Altamente escalable, pero difícil de debuggear
- **Cliente-Servidor**: Centralizado y fácil de controlar, pero punto único de falla

### 4. **Mejorar Atributos de Calidad**

Cada patrón favorece ciertos atributos:
- **Mantenibilidad**: Layered, MVC
- **Escalabilidad**: Event-Driven, Microservicios
- **Performance**: Cliente-Servidor, Pipe-and-Filter
- **Seguridad**: Cliente-Servidor con capas de autenticación

---

## 💥 ¿Qué Impacto Tiene Usar (o No Usar) Patrones?

### ✅ **Si lo aplicas:**

1. **Estructura clara y predecible**
   - Nuevos desarrolladores entienden rápidamente el sistema
   - Onboarding más rápido

2. **Escalabilidad planificada**
   - El sistema puede crecer sin colapsar
   - Agregar features no requiere reescribir todo

3. **Mantenimiento simplificado**
   - Los bugs se encuentran más rápido
   - Las correcciones no rompen otras partes

4. **Documentación implícita**
   - Decir "arquitectura en capas" es más claro que 100 páginas de diagramas

**Caso real: Spotify**
- Pasó de monolito a microservicios (patrón arquitectónico)
- Resultado: 100+ equipos trabajando en paralelo sin conflictos
- Despliegues independientes: 10,000+ deploys por semana

### ❌ **Si NO lo aplicas:**

1. **"Big Ball of Mud" (Bola de Barro)**
   - Código sin estructura clara
   - Todo depende de todo
   - Imposible de mantener

2. **Escalabilidad bloqueada**
   - Agregar usuarios colapsa el sistema
   - No puedes identificar cuellos de botella

3. **Equipo desorganizado**
   - Cada desarrollador crea su propia estructura
   - Merge conflicts constantes
   - Bugs en cascada

4. **Deuda técnica exponencial**
   - Cada feature nueva es más costosa que la anterior
   - Eventualmente, reescribir es más barato que mantener

**Caso real: Twitter (inicio)**
- Monolito sin patrón claro
- Resultado: "Fail Whale" constante (caídas del servicio)
- Solución: Migración a arquitectura de microservicios
- Impacto: De caídas diarias a disponibilidad 99.9%

---

## 🆚 Patrón Arquitectónico vs Patrón de Diseño

### Diferencias Clave

| Aspecto | Patrón Arquitectónico | Patrón de Diseño |
|---------|----------------------|------------------|
| **Alcance** | Sistema completo | Componentes específicos |
| **Nivel** | Alto nivel (estructura general) | Bajo nivel (implementación) |
| **Ejemplo** | Layered, Event-Driven, MVC | Factory, Singleton, Observer |
| **Impacto** | Afecta toda la aplicación | Afecta módulos específicos |
| **Decisión** | Difícil de cambiar después | Puede refactorizarse fácilmente |
| **Quién decide** | Arquitecto de software | Desarrolladores |

### Ejemplo Visual

```
🏗️ PATRÓN ARQUITECTÓNICO (Edificio completo)
┌─────────────────────────────────────┐
│   Arquitectura en Capas (Layered)   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Presentación (UI)            │ │ ← Aquí se usa patrón MVC
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │  Lógica de Negocio            │ │ ← Aquí se usa patrón Strategy
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │  Persistencia (BD)            │ │ ← Aquí se usa patrón Repository
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘

🔩 PATRÓN DE DISEÑO (Habitaciones específicas)
```

### Analogía con Construcción

- **Patrón Arquitectónico**: "Construiremos un edificio de 3 pisos con estructura en capas"
- **Patrón de Diseño**: "En el piso 2, usaremos puertas corredizas (Adapter pattern)"

---

## 📚 Historia y Catálogos de Patrones

### Origen: Arquitectura Física (Christopher Alexander, 1977)

Los patrones en software se inspiraron en **Christopher Alexander**, quien creó catálogos de patrones para arquitectura física de edificios:
- "A Pattern Language" (1977)
- Problema recurrente → Solución probada

### Gang of Four (1994)

**Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides**
- Publicaron "Design Patterns: Elements of Reusable Object-Oriented Software"
- 23 patrones de diseño clásicos
- Enfoque: Nivel de código (no arquitectura)

### Patrones Arquitectónicos (1996)

**Frank Buschmann et al.**
- "Pattern-Oriented Software Architecture, Volume 1"
- Primer catálogo formal de patrones arquitectónicos:
  - Layered
  - Pipes and Filters
  - Blackboard
  - Broker
  - Model-View-Controller

### Era Moderna (2000-presente)

- **Martin Fowler**: "Patterns of Enterprise Application Architecture" (2002)
- **Microservicios**: Sam Newman, "Building Microservices" (2015)
- **Cloud Patterns**: Microsoft Azure Architecture Patterns
- **DDD**: Eric Evans, "Domain-Driven Design" (2003)

---

## 🧩 Catálogo Básico de Patrones Arquitectónicos

### Patrones Clásicos (Esta Semana)

1. **Layered (En Capas)**
   - Organización horizontal por responsabilidades
   - Ejemplo: Presentación → Negocio → Persistencia

2. **Cliente-Servidor**
   - Separación entre proveedor de servicios (server) y consumidor (client)
   - Ejemplo: Aplicación web (navegador + servidor backend)

3. **Event-Driven (Basado en Eventos)**
   - Comunicación asíncrona mediante eventos
   - Ejemplo: Notificaciones push, sistemas de mensajería

4. **MVC/MVVM**
   - Separación entre datos (Model), vista (View) y lógica (Controller/ViewModel)
   - Ejemplo: Frameworks web modernos (React, Vue, Angular)

### Patrones Modernos (Próximas Semanas)

5. **Microservicios**
   - Aplicación como conjunto de servicios independientes
   - Ejemplo: Netflix, Amazon

6. **Hexagonal (Puertos y Adaptadores)**
   - Núcleo de negocio aislado de tecnologías externas
   - Ejemplo: Aplicaciones bancarias

7. **Serverless**
   - Funciones bajo demanda sin gestión de infraestructura
   - Ejemplo: AWS Lambda, Google Cloud Functions

---

## 🎯 ¿Cuándo Aplicar un Patrón Arquitectónico?

### Señales de que NECESITAS un patrón:

✅ El equipo no sabe dónde poner nuevo código
✅ Cambios en UI rompen la lógica de negocio
✅ Testing es imposible sin levantar toda la app
✅ Escalabilidad requiere reescribir todo
✅ Nuevos desarrolladores tardan semanas en entender el código

### Señales de que AÚN NO lo necesitas:

⚠️ Es un prototipo que se descartará en 2 semanas
⚠️ Es un script de 100 líneas que se ejecuta 1 vez
⚠️ El equipo tiene < 2 personas y el alcance es muy pequeño

**Regla general:** Si el proyecto vivirá más de 6 meses y tendrá 2+ desarrolladores, usa un patrón arquitectónico desde el inicio.

---

## 🔍 Criterios para Seleccionar un Patrón

Al elegir un patrón, considera:

### 1. **Requerimientos No Funcionales**
- ¿Performance es crítico? → Cliente-Servidor, Pipe-and-Filter
- ¿Escalabilidad es crítica? → Event-Driven, Microservicios
- ¿Mantenibilidad es clave? → Layered, Hexagonal

### 2. **Tamaño y Complejidad del Sistema**
- Pequeño/mediano → Layered, MVC
- Grande/complejo → Microservicios, Event-Driven

### 3. **Experiencia del Equipo**
- Equipo junior → Layered (más simple)
- Equipo senior → Microservicios (más complejo)

### 4. **Restricciones Tecnológicas**
- Backend tradicional → Layered, Cliente-Servidor
- Cloud-native → Serverless, Microservicios
- Tiempo real → Event-Driven

### 5. **Contexto de Negocio**
- E-commerce → Layered + Event-Driven
- Streaming → Event-Driven + Microservicios
- Sistemas bancarios → Hexagonal + Layered

---

## 📊 Matriz de Decisión (Vista Previa)

| Patrón | Mantenibilidad | Escalabilidad | Performance | Complejidad | Mejor Para |
|--------|---------------|---------------|-------------|-------------|------------|
| **Layered** | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐ | Apps tradicionales |
| **Cliente-Servidor** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | Apps web/móvil |
| **Event-Driven** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Tiempo real |
| **MVC/MVVM** | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ | UIs complejas |

---

## 💡 Principios Generales de Patrones

Todos los patrones arquitectónicos buscan:

1. **Separation of Concerns (SoC)**
   - Cada componente tiene una responsabilidad clara

2. **Loose Coupling (Bajo Acoplamiento)**
   - Componentes independientes que pueden cambiar sin afectar otros

3. **High Cohesion (Alta Cohesión)**
   - Elementos relacionados están juntos

4. **Abstraction (Abstracción)**
   - Ocultar detalles de implementación

5. **Reusability (Reutilización)**
   - Componentes que se pueden usar en múltiples contextos

---

## 🎯 Objetivos de Aprendizaje (Repaso)

Después de leer este documento, deberías poder:

- ✅ Definir qué es un patrón arquitectónico
- ✅ Explicar la diferencia con patrones de diseño
- ✅ Nombrar al menos 4 patrones arquitectónicos clásicos
- ✅ Justificar por qué usar patrones (ventajas)
- ✅ Identificar cuándo NO usar patrones
- ✅ Reconocer señales de que un sistema necesita arquitectura

---

## 🚀 Próximos Pasos

Ahora que entiendes QUÉ son los patrones arquitectónicos, continuaremos con:

1. **[Patrón en Capas (Layered)](02-patron-capas.md)** - El más utilizado en apps tradicionales
2. **[Cliente-Servidor y Event-Driven](03-cliente-servidor-eventos.md)** - Arquitecturas distribuidas
3. **[MVC/MVVM](04-mvc-mvvm.md)** - Patrones para interfaces de usuario
4. **[Selección de Patrón](05-seleccion-patron.md)** - Cómo elegir el apropiado

---

## 📚 Referencias

- Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.)
- Buschmann, F., et al. (1996). *Pattern-Oriented Software Architecture, Volume 1*
- Fowler, M. (2002). *Patterns of Enterprise Application Architecture*
- Alexander, C. (1977). *A Pattern Language*

---

**Bootcamp de Arquitectura de Software - Semana 03**  
_SENA - Tecnología en Análisis y Desarrollo de Software_  
_bc-channel-epti_
