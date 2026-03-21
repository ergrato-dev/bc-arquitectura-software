# 📝 Práctica 01 — Documentación con Architecture Decision Records

> **Duración**: 60 minutos
> **Tipo**: Autónomo
> **Semana**: 09

---

## 🎯 Objetivos

- Escribir 3 ADRs completos y útiles para tu proyecto personal
- Identificar las decisiones arquitectónicas más importantes tomadas en 8 semanas
- Generar el diagrama C4 Nivel 1 (Contexto) y Nivel 2 (Contenedores) de tu sistema
- Mantener los ADRs en el repositorio como fuente de verdad arquitectónica

---

## ⚙️ Configuración Inicial

```bash
# En tu repositorio personal del bootcamp
# Crear la estructura de documentación arquitectónica

mkdir -p docs/adr
touch docs/README.md
```

---

## Paso 1 — Identificar tus 3 Decisiones Clave (10 min)

Antes de escribir, identifica las 3 decisiones que más impactaron tu sistema. Usa esta guía:

```
Pregunta 1: ¿Qué patrón arquitectónico elegiste y por qué? (Hexagonal, Clean, MVC+)
→ Esta es tu ADR-001 más probable

Pregunta 2: ¿Qué mecanismo de autenticación elegiste? (JWT, sessions, API Keys)
→ Esta es tu ADR-002

Pregunta 3: ¿Qué base de datos elegiste y por qué? O ¿qué patrón de comunicación?
→ Esta es tu ADR-003

Preguntas bonus para más ADRs:
→ ¿Por qué TypeScript/JavaScript? (o el lenguaje elegido)
→ ¿Por qué Express y no Fastify/Koa?
→ ¿Por qué PostgreSQL y no MongoDB?
→ ¿Por qué Vitest y no Jest?
```

---

## Paso 2 — ADR-001: Decisión de Arquitectura Principal (15 min)

Crea el archivo `docs/adr/ADR-001-[descripcion-corta].md`:

```markdown
# ADR-001: [Título descriptivo — qué arquitectura o patrón elegiste]

## Estado

Aceptado — [fecha: AAAA-MM-DD]

## Contexto

[DESCRIBE EL PROBLEMA O NECESIDAD QUE MOTIVÓ LA DECISIÓN]
[Incluye restricciones técnicas, restricciones de equipo, requisitos del negocio]
[2-4 oraciones. NO menciones la solución aquí todavía]

Ejemplo:
"[Tu dominio] necesita una arquitectura que permita cambiar el proveedor de
[recurso externo] sin reescribir la lógica de negocio. El sistema tendrá
[número] entidades principales y [número] tipos de usuarios con roles distintos.
El equipo tiene experiencia en Node.js pero no en arquitecturas avanzadas."

## Opciones Consideradas

### Opción 1: [Nombre]

- ✅ [ventaja 1]
- ✅ [ventaja 2]
- ❌ [desventaja 1]
- ❌ [desventaja 2]

### Opción 2: [Nombre]

- ✅ [ventaja 1]
- ❌ [desventaja 1]
- ❌ [desventaja 2]

### Opción 3: [Nombre — la que elegiste]

- ✅ [ventaja 1]
- ✅ [ventaja 2]
- ❌ [desventaja 1]

## Decisión

Elegimos [Opción 3] porque [RAZÓN TÉCNICA CONCRETA que referencia el contexto].

En particular, [criterio específico] fue determinante para descartar [Opción 1]
porque [razón].

## Consecuencias

### Positivas

- ✅ [beneficio concreto]
- ✅ [beneficio concreto]

### Negativas (trade-offs aceptados)

- ❌ [costo aceptado con justificación]
- ❌ [costo aceptado con justificación]

## Referencias

- [Libro, artículo o documentación relevante]
```

---

## Paso 3 — ADR-002: Autenticación (10 min)

Crea `docs/adr/ADR-002-autenticacion-jwt.md`:

**Guía rápida para completar**:

```markdown
# ADR-002: JWT Stateless vs. Sesiones en Servidor para Autenticación

## Estado

Aceptado — [fecha]

## Contexto

[Tu dominio] necesita autenticar a los usuarios y distinguir entre roles
([ROL_1], [ROL_2], [ROL_3]). El sistema se ejecuta en contenedores Docker
que pueden escalar horizontalmente en el futuro.

## Opciones Consideradas

### Opción 1: Sesiones en Servidor (express-session + Redis)

- ✅ Revocación inmediata de sesión al logout
- ✅ Tokens pequeños (solo session ID)
- ❌ Requiere almacén de sesiones compartido (Redis) para múltiples instancias
- ❌ Dependencia de estado en el servidor

### Opción 2: JSON Web Tokens (JWT) — stateless

- ✅ Sin estado en el servidor — escala horizontalmente sin configuración extra
- ✅ El rol del usuario viaja en el payload — no requiere consulta a BD en cada request
- ❌ Revocación inmediata requiere blacklist adicional (Redis)
- ❌ El payload es visible (no cifrado) — no incluir datos sensibles

### Opción 3: API Keys estáticas

- ✅ Muy simples de implementar
- ❌ No adecuadas para usuarios finales con contraseñas
- ❌ Difíciles de rotar sin afectar clientes

## Decisión

JWT stateless. La containerización y el modelo de roles del dominio hacen
que el overhead de Redis para sesiones no esté justificado en esta etapa.
El rol en el payload acelera la validación RBAC sin consultas adicionales a BD.

## Consecuencias

### Positivas

- ✅ Cada instancia de la API puede validar tokens independientemente
- ✅ Autorización RBAC sin round-trip a base de datos

### Negativas

- ❌ Logout verdadero requiere blacklist (asumido como deuda técnica documentada)
- ❌ Cambio de rol no se refleja hasta que el token expire (mitigado con duración corta: 15min)
```

---

## Paso 4 — ADR-003: [Tu Tercera Decisión] (10 min)

Elige la decisión más relevante para tu dominio. Opciones comunes:

| Opción A                   | Opción B                         | Opción C                         |
| -------------------------- | -------------------------------- | -------------------------------- |
| `ADR-003-base-de-datos.md` | `ADR-003-patron-comunicacion.md` | `ADR-003-validacion-esquemas.md` |
| PostgreSQL vs MongoDB      | Síncrono vs Asíncrono            | Zod vs Joi vs validación manual  |

Sigue el mismo formato de los pasos anteriores. Recuerda:

- Contexto sin solución
- 3 opciones con pros/cons honestos
- Decisión con razón técnica
- Consecuencias positivas Y negativas

---

## Paso 5 — Diagrama C4 Nivel 1 (Contexto) — Mermaid (10 min)

Agrega este diagrama al `README.md` de tu proyecto:

```markdown
## 🗺️ Arquitectura del Sistema

### C4 Level 1 — Contexto

\`\`\`mermaid
graph TB
[rolPrincipal]"👤 [Nombre del actor principal]"]
[rolSecundario]"👤 [Nombre del actor secundario]"]
[rolAdmin]["👤 Administrador"]

    subgraph sistema["🌐 [Tu Dominio] API [Software System]"]
        api["[Tu Dominio] Platform\nNode.js REST API\n[qué hace en una línea]"]
    end

    externo1["📧 [Sistema Externo 1]\n[External System]\n[descripción]"]

    [rolPrincipal] -->|"HTTPS - [acción principal]"| api
    [rolSecundario] -->|"HTTPS - [acción secundaria]"| api
    [rolAdmin] -->|"HTTPS - administrar"| api
    api -->|"[protocolo]"| externo1

\`\`\`
```

Reemplaza los placeholders:

- `[rolPrincipal]` → el actor principal de tu dominio (ej: `cliente`, `paciente`, `empleado`)
- `[Tu Dominio]` → el nombre de tu sistema
- `[Sistema Externo 1]` → sistemas externos que usa tu API (email, pagos, etc.)

---

## Paso 6 — Diagrama C4 Nivel 2 (Contenedores) — Mermaid (5 min)

```markdown
### C4 Level 2 — Contenedores

\`\`\`mermaid
graph TB
usuario["👤 Usuarios del Sistema"]

    subgraph dominio["[Tu Dominio] [Software System]"]
        api["🔷 [Tu Dominio] API\n[Container: Node.js + Express]\nArquitectura Hexagonal\nJWT + RBAC"]
        db["🗄️ PostgreSQL\n[Container: Database]\nDatos del dominio"]
        pgadmin["🖥️ pgAdmin\n[Container: Tool]\nAdmin BD"]
    end

    usuario -->|"HTTPS :3000 / JSON"| api
    api      -->|"SQL :5432"| db
    pgadmin  -->|"SQL :5432"| db

\`\`\`
```

---

## ✅ Checklist de Verificación

Antes de dar por completada la práctica:

- [ ] `docs/adr/ADR-001-[nombre].md` existe y tiene todos los campos
- [ ] `docs/adr/ADR-002-autenticacion-jwt.md` existe con trade-offs documentados
- [ ] `docs/adr/ADR-003-[nombre].md` existe para tu tercera decisión
- [ ] El README del proyecto tiene el diagrama C4 L1 en Mermaid
- [ ] El README del proyecto tiene el diagrama C4 L2 en Mermaid
- [ ] Las consecuencias negativas en cada ADR son honestas (no solo positivas)
- [ ] Los ADRs tienen fecha

```bash
# Verificar que los archivos existen
ls docs/adr/
# ADR-001-*.md  ADR-002-*.md  ADR-003-*.md

# Hacer commit con mensaje descriptivo
git add docs/
git commit -m "docs: add architecture decision records ADR-001 through ADR-003"

git add README.md
git commit -m "docs: add C4 model diagrams (context and containers)"
```

---

## 🔍 Auto-evaluación

| Criterio   | Pregunta de verificación                                     |
| ---------- | ------------------------------------------------------------ |
| Contexto   | ¿El contexto describe el problema sin mencionar la solución? |
| Opciones   | ¿Consideré al menos 3 alternativas reales?                   |
| Decisión   | ¿La razón técnica referencia el contexto?                    |
| Trade-offs | ¿Documenté consecuencias NEGATIVAS honestas?                 |
| C4 L1      | ¿Están todos los actores y sistemas externos?                |
| C4 L2      | ¿Todos los contenedores tienen tecnología y protocolo?       |

---

_Semana 09 · Proyecto Integrador Final · Bootcamp de Arquitectura de Software_
