# 🤖 Instrucciones para GitHub Copilot

## 📋 Contexto del Bootcamp

Este es un **Bootcamp de Arquitectura de Software** diseñado para llevar a estudiantes tecnólogos del SENA desde los fundamentos arquitectónicos hasta el diseño de sistemas robustos, escalables y seguros.

### 📊 Datos del Bootcamp

- **Duración**: 9 semanas
- **Dedicación semanal**: 6 horas (4 presenciales + 2 autónomas)
- **Total de horas**: 54 horas
- **Nivel de entrada**: Estudiantes con conocimientos básicos de programación
- **Nivel de salida**: Arquitecto de software junior con capacidad de diseñar sistemas completos
- **Enfoque**: Arquitectura de software con implementaciones en JavaScript ES2023
- **Stack**: JavaScript ES2023, Node.js, pnpm, Docker, PostgreSQL, Draw.io/PlantUML/Mermaid
- **Público objetivo**: Aprendices del SENA - Tecnología en Análisis y Desarrollo de Software

---

## 🎯 Objetivos de Aprendizaje

Al finalizar el bootcamp, los estudiantes serán capaces de:

- ✅ Comprender qué es arquitectura de software y su importancia en proyectos reales
- ✅ Diferenciar entre arquitectura y diseño de software
- ✅ Aplicar principios SOLID en diseños arquitectónicos
- ✅ Seleccionar patrones arquitectónicos apropiados según el contexto del proyecto
- ✅ Diseñar componentes con alta cohesión y bajo acoplamiento
- ✅ Implementar patrones de diseño clásicos (Creacionales, Estructurales, de Comportamiento)
- ✅ Diseñar arquitecturas modernas (Microservicios, Clean Architecture, Hexagonal)
- ✅ Crear arquitecturas en la nube (IaaS, PaaS, SaaS, Serverless, Contenedores)
- ✅ Integrar seguridad en el diseño arquitectónico desde el inicio
- ✅ Documentar decisiones arquitectónicas con diagramas y justificaciones técnicas

---

## 📚 Estructura del Bootcamp por Semanas

**Semana 1**: Fundamentos de Arquitectura de Software
**Semana 2**: Principios SOLID
**Semana 3**: Patrones Arquitectónicos Clásicos
**Semana 4**: Diseño de Componentes y Comunicación
**Semana 5**: Patrones de Diseño
**Semana 6**: Arquitecturas Modernas
**Semana 7**: Arquitectura en la Nube
**Semana 8**: Seguridad en Arquitectura
**Semana 9**: Proyecto Integrador Final

---

## 🗂️ Estructura de Carpetas Estándar

Cada semana sigue esta estructura:

```
bootcamp/week-0X/
├── README.md                 # Descripción, objetivos y guía de la semana
├── rubrica-evaluacion.md     # Criterios detallados de evaluación
├── 0-assets/                 # Diagramas SVG, imágenes
├── 1-teoria/                 # Material teórico (.md)
├── 2-practicas/              # Ejercicios guiados
├── 3-proyecto/               # Proyecto integrador semanal
├── 4-recursos/               # Recursos adicionales
│   ├── ebooks-free/
│   ├── videografia/          # Videos YouTube bc-channel-epti
│   └── webgrafia/
└── 5-glosario/               # Términos clave A-Z
```

---

## 🎓 Convenciones de Contenido

### Estructura QUÉ-PARA-IMPACTO (OBLIGATORIA)

Cada concepto debe responder:

1. **¿Qué es?**: Definición clara y concisa
2. **¿Para qué sirve?**: Casos de uso y aplicaciones prácticas
3. **¿Qué impacto tiene?**: Consecuencias de usarlo o no usarlo

**Ejemplo:**

```markdown
## 🏗️ Principio de Responsabilidad Única (SRP)

### 🎯 ¿Qué es?

El SRP establece que una clase debe tener una sola razón para cambiar...

### 🚀 ¿Para qué sirve?

Permite crear código más mantenible y testeable...

### 💥 ¿Qué impacto tiene?

**Si lo aplicas:**

- ✅ Código más mantenible
- ✅ Facilita testing

**Si NO lo aplicas:**

- ❌ Clases complejas
- ❌ Cambios en cascada
```

### Lenguaje Motivador

- ✅ Usa tono que inspire el aprendizaje
- ✅ Celebra logros y progreso
- ✅ Presenta desafíos como oportunidades
- ✅ Mantén entusiasmo por la arquitectura

---

## 📝 Convenciones de Código

### JavaScript ES2023 (OBLIGATORIO)

```javascript
// ✅ BIEN - const por defecto
const API_CONFIG = { baseUrl: 'https://api.example.com' };

// ✅ BIEN - let solo si necesitas reasignar
let retryCount = 0;

// ❌ MAL - no usar var
var oldStyle = 'evitar';

// ✅ BIEN - arrow functions
const createUser = (name, email) => ({ id: generateId(), name, email });

// ✅ BIEN - template literals
const message = `Usuario ${name} creado`;

// ✅ BIEN - optional chaining y nullish coalescing
const city = user?.address?.city;
const port = config.port ?? 3000;

// ✅ BIEN - destructuring y spread
const { id, name } = user;
const updatedUser = { ...user, name: 'New' };

// ✅ BIEN - clases modernas con campos privados
class UserRepository {
  #connection;

  constructor(connection) {
    this.#connection = connection;
  }
}

// ✅ BIEN - módulos ES6
import { UserService } from './services/user-service.js';
export { UserRepository };
```

### Nomenclatura

- **Variables/funciones**: camelCase
- **Constantes globales**: UPPER_SNAKE_CASE
- **Clases**: PascalCase
- **Archivos**: kebab-case.js
- **Carpetas**: kebab-case/

### Idioma en Código

- ✅ **Código en INGLÉS**: Variables, funciones, clases
- ✅ **Comentarios técnicos en ESPAÑOL**
- ✅ **Documentación markdown en ESPAÑOL** (para estudiantes SENA)

---

## 🛠️ Herramientas y Tecnologías

### Gestión de Paquetes

- ✅ **SOLO usar `pnpm`** (NUNCA npm)
- Razón: Mejor rendimiento, gestión eficiente

```bash
# Instalar dependencias
pnpm install

# Agregar paquete
pnpm add <paquete>

# Agregar dev dependency
pnpm add -D <paquete>
```

### Base de Datos

- ✅ **PostgreSQL** como BD principal
- ✅ SQLite para ejemplos locales simples

### Diagramas

- ✅ **Herramientas**: Draw.io, PlantUML, Mermaid, Lucidchart
- ✅ **Formato preferido**: SVG (escalable)
- ✅ **Tipos requeridos**: Contexto, Componentes, Secuencia, Despliegue

---

## 📊 Evaluación (Sistema SENA)

Cada semana incluye **tres tipos de evidencias**:

### 1. Evidencia de Conocimiento 🧠 (30%)

- Comprensión de conceptos
- Capacidad de explicar principios
- Justificación de decisiones

### 2. Evidencia de Desempeño 💪 (40%)

- Aplicación de principios SOLID
- Diseño de diagramas
- Implementación de patrones

### 3. Evidencia de Producto 📦 (30%)

- Proyecto integrador funcional
- Documentación arquitectónica
- Código bien estructurado

**Criterio de aprobación**: Mínimo 70% en cada evidencia

---

## 🎬 Contenido para YouTube (bc-channel-epti)

Cada semana debe incluir:

- 📹 **Video teórico** (15-20 min): Conceptos clave
- 📹 **Video práctico** (20-30 min): Ejercicio paso a paso
- 📹 **Video de proyecto** (15-20 min): Guía del proyecto
- 📹 **Casos reales** (10-15 min): Análisis de arquitecturas en producción

---

## 🤖 Instrucciones Específicas para Copilot

### Límites de Respuesta

1. **❌ NUNCA superar límites de tokens**
2. **✅ SIEMPRE dividir contenido extenso**
3. **✅ Crear por secciones, esperar confirmación**
4. **✅ Indicar qué falta por entregar**

### Al Generar Código

1. ✅ Usar siempre ES2023
2. ✅ Solo pnpm (nunca npm)
3. ✅ Comentarios educativos
4. ✅ Ejemplos completos y funcionales
5. ✅ Demostrar principios SOLID

### Al Crear Contenido

1. ✅ Estructura QUÉ-PARA-IMPACTO
2. ✅ Ejemplos del mundo real (Netflix, Spotify, Amazon, Uber)
3. ✅ Lenguaje motivador
4. ✅ Progresión pedagógica (simple → complejo)
5. ✅ Recomendar mejores prácticas

### Al Documentar

1. ✅ Español para READMEs y teoría
2. ✅ Inglés para código y nomenclatura técnica
3. ✅ Diagramas profesionales
4. ✅ Referencias a libros (Bass, Fowler, Gamma, Martin)

---

## 🔄 Orden de Generación de Contenido por Semana

**IMPORTANTE**: Seguir estrictamente este orden para mantener consistencia y calidad pedagógica.

### 📋 Proceso Secuencial (OBLIGATORIO)

1. **📖 README de la semana**
   - Introducción y objetivos
   - Navegación del contenido
   - Resumen de actividades

2. **📊 Rúbrica de evaluación**
   - 3 evidencias (Conocimiento 30%, Desempeño 40%, Producto 30%)
   - Criterios específicos y medibles
   - Formato SENA

3. **🎯 Reto de la semana**
   - Inspirado en: https://github.com/ergrato-dev/bc-javascript-es2023
   - Problema motivador del mundo real
   - Conexión con los objetivos semanales

4. **📚 Teoría**
   - Estructura QUÉ-PARA-IMPACTO
   - Conceptos fundamentales
   - Ejemplos del mundo real

5. **🖼️ Assets y vinculación**
   - Crear diagramas SVG/PlantUML/Mermaid
   - Guardar en `0-assets/`
   - Vincular en archivos de teoría

6. **💪 Prácticas guiadas**
   - Ejercicios paso a paso
   - Código completo funcional
   - Casos de estudio aplicados

7. **🚀 Proyecto integrador**
   - Aplicación práctica de la semana
   - Documentación arquitectónica
   - Entregables específicos

8. **📦 Recursos completos**
   - Ebooks (4-recursos/ebooks-free/)
   - Videos YouTube (4-recursos/videografia/)
   - Referencias web (4-recursos/webgrafia/)

9. **📖 Glosario**
   - Términos técnicos A-Z
   - Definiciones claras
   - Ejemplos de uso

### ⚠️ Reglas Importantes

- ✅ **SIEMPRE revisar semanas anteriores** para identificar patrones
- ✅ **Mantener coherencia** en estructura y estilo
- ✅ **No saltar pasos** en el proceso secuencial
- ✅ **Validar completitud** antes de pasar al siguiente elemento

---

## ✅ Checklist para Nuevas Semanas

- [ ] Estructura de carpetas completa
- [ ] README.md con objetivos y navegación
- [ ] Rúbrica con 3 evidencias (30%-40%-30%)
- [ ] Reto de la semana vinculado
- [ ] Teoría con estructura QUÉ-PARA-IMPACTO
- [ ] Assets creados y vinculados en teoría
- [ ] Prácticas guiadas con código funcional
- [ ] Proyecto integrador con documentación
- [ ] Recursos completos (ebooks, videos, webgrafía)
- [ ] Glosario de términos
- [ ] Diagramas en SVG/PlantUML/Mermaid
- [ ] Código en JavaScript ES2023
- [ ] Uso de pnpm (no npm)
- [ ] Guiones para videos YouTube

---

## 📚 Referencias Principales

- **Software Architecture in Practice** (Bass, Clements, Kazman)
- **Design Patterns** (Gang of Four)
- **Clean Architecture** (Robert C. Martin)
- **MDN Web Docs**: https://developer.mozilla.org/
- **PlantUML**: https://plantuml.com/

---

## 💡 Filosofía del Bootcamp

- **Prioridad**: Comprensión profunda sobre memorización
- **Enfoque**: Aprendizaje basado en proyectos reales
- **Objetivo**: Formar arquitectos capaces de tomar decisiones informadas
- **Método**: Aprender haciendo, con justificación técnica

---

**Bootcamp de Arquitectura de Software**
_SENA - Tecnología en Análisis y Desarrollo de Software_
_bc-channel-epti_

_Última actualización: Febrero 2026_
_Versión: 1.0_
