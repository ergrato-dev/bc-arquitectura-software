# ADR-001: Nomenclatura de Carpetas de Semanas del Bootcamp

**Estado**: Aceptado  
**Fecha**: 2026-03-21  
**Autores**: Equipo bc-channel-epti  

---

## Contexto

Las carpetas de cada semana del bootcamp usaban el esquema `week-XX` (p. ej. `week-01`, `week-02`). Este esquema es funcional pero opaco: al navegar el repositorio o ver una ruta, no es posible identificar el tema de la semana sin abrir el README.

## Decisión

Se adopta el esquema `week-XX-tema_principal` para todas las carpetas de semanas del bootcamp.

El **tema principal** se extrae **exclusivamente del encabezado H1 del `README.md` de cada semana** (línea que contiene `# 📅 Semana XX: <Tema>`).

### Mapeo aplicado

| Carpeta anterior | Carpeta nueva | Tema extraído del README |
|---|---|---|
| `week-01` | `week-01-fundamentos-arquitectura` | Fundamentos y Contexto de la Arquitectura de Software |
| `week-02` | `week-02-principios-solid` | Principios SOLID |
| `week-03` | `week-03-patrones-arquitectonicos-clasicos` | Patrones Arquitectónicos Clásicos |
| `week-04` | `week-04-diseno-componentes-comunicacion` | Diseño de Componentes y Comunicación |
| `week-05` | `week-05-patrones-diseno` | Patrones de Diseño |
| `week-06` | `week-06-arquitecturas-modernas` | Arquitecturas Modernas |
| `week-07` | `week-07-arquitectura-nube` | Arquitectura en la Nube |
| `week-08` | `week-08-seguridad-arquitectura` | Seguridad en la Arquitectura |
| `week-09` | `week-09-proyecto-integrador-final` | Proyecto Integrador Final |

### Reglas de normalización del slug

Para convertir el título a slug se aplican estas reglas en orden:
1. Convertir a minúsculas.
2. Eliminar tildes y diacríticos (á→a, é→e, í→i, ó→o, ú→u, ñ→n).
3. Reemplazar espacios y signos de puntuación por guion `-`.
4. Eliminar palabras funcionales de relleno para mantener el slug conciso.
5. Prefijo `week-XX-` utilizando el número de semana con cero a la izquierda.

## Motivación

- **Legibilidad**: una ruta como `bootcamp/week-05-patrones-diseno/` comunica su contenido sin abrir ningún archivo.
- **Navegabilidad**: facilita orientación rápida en el explorador de archivos, GitHub y terminales.
- **Consistencia pedagógica**: el nombre del directorio refleja el aprendizaje central de la semana, alineado con la filosofía del bootcamp de hacer explícito el conocimiento.
- **Fuente única de verdad**: el tema principal siempre se lee del `README.md` de la semana, evitando divergencias.

## Alternativas consideradas

| Alternativa | Razón de descarte |
|---|---|
| Mantener `week-XX` | Opaco, no comunica el tema al navegar |
| Usar el nombre completo del título sin abreviar | Rutas demasiado largas, difíciles de usar en terminal |
| Derivar el tema de `copilot-instructions.md` u otro archivo | Viola el principio de fuente única de verdad; puede quedar desincronizado |

## Consecuencias

### Positivas
- Carpetas autodescriptivas en cualquier vista del repositorio.
- Menor fricción para estudiantes nuevos que navegan el repo por primera vez.
- Los enlaces internos entre semanas son más legibles en el markdown fuente.

### A tener en cuenta
- **Pull requests / ramas** que tengan el nombre de carpeta en su título deben actualizarse al nuevo esquema.
- **Referencias textuales** (no rutas) en ejemplos de commits (`feat(week-02):`) son convenciones de scope de Git y **no** se modifican; siguen usando solo el prefijo numérico para brevedad.
- Cualquier nueva semana debe seguir el mismo esquema: `week-XX-<slug-del-tema>`, donde el slug se extrae del H1 del README de esa semana.

## Archivos actualizados en este cambio

- `README.md` (raíz)
- `README_EN.md` (raíz)
- `bootcamp/week-03-patrones-arquitectonicos-clasicos/README.md`
- `bootcamp/week-04-diseno-componentes-comunicacion/README.md`
- `bootcamp/week-05-patrones-diseno/README.md`
- `bootcamp/week-06-arquitecturas-modernas/README.md`
- `bootcamp/week-07-arquitectura-nube/README.md`
- `bootcamp/week-07-arquitectura-nube/1-teoria/04-cloud-native-12factor.md`
- `bootcamp/week-08-seguridad-arquitectura/README.md`
- `bootcamp/week-09-proyecto-integrador-final/README.md`
- `.github/ISSUE_TEMPLATE/bug_report.yml`

---

_Bootcamp de Arquitectura de Software — SENA · bc-channel-epti_
