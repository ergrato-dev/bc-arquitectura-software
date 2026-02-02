# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al Bootcamp de Arquitectura de Software! Este es un proyecto educativo del SENA y valoramos todas las contribuciones que ayuden a mejorar el material de aprendizaje.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Puedo Contribuir?](#cómo-puedo-contribuir)
- [Proceso de Contribución](#proceso-de-contribución)
- [Guías de Estilo](#guías-de-estilo)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Commits](#commits)

---

## 📜 Código de Conducta

Este proyecto se adhiere al [Código de Conducta](CODE_OF_CONDUCT.md). Al participar, se espera que mantengas un ambiente respetuoso y colaborativo.

---

## 🎯 ¿Cómo Puedo Contribuir?

### 🐛 Reportar Errores

Si encuentras un error en el contenido, código o documentación:

1. **Verifica** que el error no haya sido reportado previamente en [Issues](https://github.com/ergrato-dev/bc-arquitectura-software/issues)
2. **Abre un nuevo Issue** usando la plantilla de bug report
3. **Incluye**:
   - Descripción clara del error
   - Pasos para reproducirlo
   - Comportamiento esperado vs actual
   - Screenshots si es aplicable
   - Semana/archivo afectado

### 💡 Sugerir Mejoras

Para proponer mejoras en el contenido educativo:

1. **Abre un Issue** usando la plantilla de feature request
2. **Describe**:
   - Qué mejorarías y por qué
   - Cómo beneficiaría a los estudiantes
   - Ejemplos o referencias si las tienes

### 📝 Mejorar Documentación

- Correcciones de ortografía o gramática
- Aclaraciones en explicaciones
- Ejemplos adicionales
- Traducciones

### 💻 Contribuir con Código

- Corregir errores en código de ejemplo
- Mejorar implementaciones existentes
- Agregar casos de uso adicionales
- **Nota**: Todo el código debe estar en JavaScript ES2023

---

## 🔄 Proceso de Contribución

### 1. Fork del Repositorio

```bash
# Fork desde GitHub UI, luego clona tu fork
git clone https://github.com/TU-USUARIO/bc-arquitectura-software.git
cd bc-arquitectura-software
```

### 2. Configura el Upstream

```bash
git remote add upstream https://github.com/ergrato-dev/bc-arquitectura-software.git
git fetch upstream
```

### 3. Crea una Rama

```bash
# Usa un nombre descriptivo
git checkout -b fix/week-02-solid-typo
# o
git checkout -b feat/week-05-new-pattern-example
# o
git checkout -b docs/improve-readme-installation
```

**Convención de nombres de rama**:

- `fix/` - Corrección de errores
- `feat/` - Nueva funcionalidad o contenido
- `docs/` - Mejoras en documentación
- `refactor/` - Refactorización de código
- `test/` - Agregar o corregir tests

### 4. Realiza tus Cambios

Sigue las [Guías de Estilo](#guías-de-estilo) del proyecto.

### 5. Haz Commit de tus Cambios

```bash
git add .
git commit -m "fix(week-02): corrige ejemplo de SRP en UserService"
```

Ver [Guía de Commits](#commits) para más detalles.

### 6. Mantén tu Rama Actualizada

```bash
git fetch upstream
git rebase upstream/main
```

### 7. Push a tu Fork

```bash
git push origin fix/week-02-solid-typo
```

### 8. Abre un Pull Request

1. Ve a tu fork en GitHub
2. Haz clic en "New Pull Request"
3. Usa la plantilla de PR proporcionada
4. Describe claramente tus cambios
5. Referencia cualquier Issue relacionado

---

## 🎨 Guías de Estilo

### Markdown

- Usa headers (`#`, `##`, `###`) de forma jerárquica
- Incluye una línea en blanco antes y después de bloques de código
- Usa backticks para código inline: `const example = true;`
- Usa triple backtick con lenguaje para bloques:

```javascript
const example = () => {
  return 'Hello World';
};
```

- Usa emojis para mejorar legibilidad (con moderación)
- Links: `[texto descriptivo](url)`

### JavaScript ES2023

**Obligatorio**:

```javascript
// ✅ BIEN - const por defecto
const API_URL = 'https://api.example.com';

// ✅ BIEN - let solo si reasignas
let counter = 0;

// ❌ MAL - nunca var
var oldStyle = 'avoid';

// ✅ BIEN - arrow functions
const getUserById = (id) => users.find((user) => user.id === id);

// ✅ BIEN - template literals
const message = `Usuario ${name} creado exitosamente`;

// ✅ BIEN - destructuring
const { id, name, email } = user;

// ✅ BIEN - spread operator
const newUser = { ...baseUser, role: 'admin' };

// ✅ BIEN - optional chaining
const city = user?.address?.city;

// ✅ BIEN - nullish coalescing
const port = config.port ?? 3000;

// ✅ BIEN - módulos ES6
import { UserService } from './services/user-service.js';
export { UserRepository };
```

### Nomenclatura

| Elemento   | Convención       | Ejemplo            |
| ---------- | ---------------- | ------------------ |
| Variables  | camelCase        | `userService`      |
| Constantes | UPPER_SNAKE_CASE | `MAX_RETRIES`      |
| Funciones  | camelCase        | `createUser()`     |
| Clases     | PascalCase       | `UserRepository`   |
| Archivos   | kebab-case       | `user-service.js`  |
| Carpetas   | kebab-case       | `design-patterns/` |

### Idioma

- **Código**: Inglés (variables, funciones, clases, comentarios técnicos)
- **Documentación**: Español (READMEs, teoría, guías)
- **Commits**: Español

```javascript
// ✅ CORRECTO
class UserService {
  constructor(repository) {
    this.repository = repository;
  }

  // Valida el formato del email según RFC 5322
  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
```

### Estructura de Contenido Teórico

Cada concepto debe seguir la estructura **QUÉ-PARA-IMPACTO**:

```markdown
## 🏗️ Nombre del Concepto

### 🎯 ¿Qué es?

Definición clara y concisa del concepto.

### 🚀 ¿Para qué sirve?

Explicación de casos de uso y aplicaciones prácticas.

### 💥 ¿Qué impacto tiene?

**Si lo aplicas:**

- ✅ Beneficio 1
- ✅ Beneficio 2

**Si NO lo aplicas:**

- ❌ Consecuencia negativa 1
- ❌ Consecuencia negativa 2

### 📝 Ejemplo

\`\`\`javascript
// Código de ejemplo aquí
\`\`\`

### 📚 Recursos Adicionales

- [Enlace 1](url)
- [Enlace 2](url)
```

---

## 📁 Estructura del Proyecto

```
bc-arquitectura-software/
├── _assets/                  # Recursos visuales globales
├── _docs/                    # Documentación pedagógica SENA
├── bootcamp/
│   └── week-XX/
│       ├── README.md         # Descripción y objetivos
│       ├── rubrica-evaluacion.md
│       ├── 0-assets/         # Recursos visuales de la semana
│       ├── 1-teoria/         # Material teórico (.md)
│       ├── 2-practicas/      # Ejercicios guiados
│       ├── 3-proyecto/       # Proyecto integrador
│       ├── 4-recursos/       # Recursos adicionales
│       │   ├── ebooks-free/
│       │   ├── videografia/
│       │   └── webgrafia/
│       └── 5-glosario/       # Términos clave
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── copilot-instructions.md
├── README.md
├── README_EN.md
├── CONTRIBUTING.md           # Este archivo
├── CODE_OF_CONDUCT.md
├── SECURITY.md
└── .gitignore
```

### Carpetas Importantes

- **NO modificar**: `_docs/` (documentación oficial del SENA)
- **Contenido educativo**: `bootcamp/week-XX/`
- **Soluciones**: NO incluir en el repositorio (ver `.gitignore`)

---

## 📝 Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

### Formato

```
<tipo>(<alcance>): <descripción>

[cuerpo opcional]

[footer opcional]
```

### Tipos

| Tipo       | Uso                             |
| ---------- | ------------------------------- |
| `feat`     | Nueva funcionalidad o contenido |
| `fix`      | Corrección de error             |
| `docs`     | Solo cambios en documentación   |
| `style`    | Formato (no afecta el código)   |
| `refactor` | Refactorización de código       |
| `test`     | Agregar o corregir tests        |
| `chore`    | Tareas de mantenimiento         |

### Alcance

Indica la semana o área afectada:

- `week-01`, `week-02`, etc.
- `docs` - Documentación general
- `assets` - Recursos visuales
- `config` - Configuraciones

### Ejemplos

```bash
# Nueva teoría
git commit -m "feat(week-02): agrega sección sobre DIP con ejemplos"

# Corrección
git commit -m "fix(week-05): corrige implementación de Factory Pattern"

# Documentación
git commit -m "docs(readme): actualiza instrucciones de instalación"

# Mejora de código
git commit -m "refactor(week-03): simplifica ejemplo de Event-Driven"

# Assets
git commit -m "feat(week-04): agrega diagrama de comunicación entre componentes"
```

### Commits Complejos

Para cambios grandes, usa cuerpo y footer:

```bash
git commit -m "feat(week-06): implementa módulo de Clean Architecture

Agrega:
- Estructura de carpetas para Clean Architecture
- Ejemplos de casos de uso
- Diagramas de dependencias
- Tests unitarios

Refs: #42
```

---

## ✅ Checklist Pre-Pull Request

Antes de abrir un PR, verifica que:

### Contenido

- [ ] El contenido sigue la estructura QUÉ-PARA-IMPACTO
- [ ] Los ejemplos son claros y funcionales
- [ ] No hay errores ortográficos o gramaticales
- [ ] Las referencias y enlaces funcionan

### Código

- [ ] Usa JavaScript ES2023
- [ ] Sigue las convenciones de nomenclatura
- [ ] Código en inglés, documentación en español
- [ ] No incluye `console.log` de debugging
- [ ] Aplica principios SOLID

### Diagramas

- [ ] Formato SVG, PlantUML o Mermaid
- [ ] Legibles y profesionales
- [ ] Incluidos en la carpeta `0-assets/`

### Archivos

- [ ] No incluye carpetas `node_modules/`
- [ ] No incluye archivos `.env`
- [ ] No incluye carpetas `solution/`
- [ ] Sigue la estructura de carpetas del proyecto

### Commits

- [ ] Mensajes descriptivos siguiendo Conventional Commits
- [ ] Un commit por cambio lógico
- [ ] Commits firmados (opcional pero recomendado)

---

## 🎓 Contribuciones Educativas

Este es un proyecto educativo, por lo tanto:

### Para Estudiantes

Si eres estudiante del bootcamp:

- ✅ Reporta errores que encuentres
- ✅ Sugiere mejoras en explicaciones
- ✅ Comparte recursos que te hayan ayudado
- ❌ NO subas tus soluciones de proyectos (aprendizaje activo)

### Para Instructores/Mentores

Si eres instructor o tienes experiencia:

- ✅ Mejora explicaciones complejas
- ✅ Agrega casos de estudio reales
- ✅ Propón ejercicios adicionales
- ✅ Comparte experiencias de la industria
- ✅ Revisa PRs de otros contribuidores

### Para la Comunidad

- ✅ Traducciones a otros idiomas
- ✅ Ejemplos en otros contextos
- ✅ Recursos complementarios
- ✅ Mejoras en accesibilidad

---

## 🔍 Proceso de Revisión

### Qué Esperamos

Los maintainers revisarán:

1. **Relevancia educativa**: ¿Mejora el aprendizaje?
2. **Calidad técnica**: ¿Es correcto el contenido?
3. **Claridad**: ¿Es fácil de entender?
4. **Consistencia**: ¿Sigue las guías del proyecto?

### Tiempos de Revisión

- Issues: Revisión inicial en 48-72 horas
- Pull Requests: Revisión completa en 3-5 días
- Urgentes (errores críticos): 24 horas

### Feedback

- Sé paciente - todos somos voluntarios
- El feedback constructivo es para mejorar
- Puedes hacer cambios basados en comentarios
- Celebramos todas las contribuciones, grandes o pequeñas

---

## 🙏 Reconocimientos

Todas las contribuciones se reconocen en:

- Historial de commits
- Release notes
- Sección de agradecimientos (próximamente)

---

## 💬 ¿Necesitas Ayuda?

- 📖 Lee la [documentación](README.md)
- 💬 Abre una [Discussion](https://github.com/ergrato-dev/bc-arquitectura-software/discussions)
- 📧 Contacta a los maintainers vía Issues
- 📹 Consulta videos en bc-channel-epti

---

## 📜 Licencia

Al contribuir, aceptas que tus contribuciones se licencien bajo la [Licencia MIT](LICENSE) del proyecto.

---

**¡Gracias por contribuir al Bootcamp de Arquitectura de Software!**

Tu aporte ayuda a formar mejores arquitectos de software en la comunidad del SENA.

🎓 **Juntos construimos conocimiento** 🚀
