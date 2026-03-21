# 💻 Práctica 01: Dockerfile para EduFlow API

> **Objetivo**: Construir una imagen Docker optimizada para la API de EduFlow usando Node.js 20 Alpine con multi-stage build, usuario no-root y health check.

**Tiempo estimado**: 40 minutos

---

## 🧰 Prerrequisitos

```bash
# Verificar que Docker está instalado
docker --version   # >= 24.0
docker info        # El daemon debe estar corriendo

# Directorio de trabajo
mkdir eduflow-docker && cd eduflow-docker
```

---

## 📁 Estructura Inicial del Proyecto

Partimos del resultado de la semana 06 (arquitectura hexagonal). Crea la siguiente estructura:

```
eduflow-docker/
├── src/
│   ├── domain/
│   │   └── course.js
│   ├── application/
│   │   └── course-application-service.js
│   └── infrastructure/
│       ├── http/
│       │   └── course-router.js
│       └── persistence/
│           └── in-memory-course-repository.js
├── server.js
└── package.json
```

```javascript
// server.js — EduFlow API simplificada para esta práctica
import express from "express";
import { Pool } from "pg";

const PORT = process.env.PORT ?? 3000;
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();
app.use(express.json());

// Health check — requerido por Docker HEALTHCHECK
app.get("/health", async (req, res) => {
  try {
    // Solo verifica que el proceso responde (liveness)
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? "1.0.0",
    });
  } catch (error) {
    res.status(503).json({ status: "error", message: error.message });
  }
});

// Endpoint simple de cursos (en-memoria para esta práctica)
const courses = [
  { id: "1", title: "Arquitectura de Software", active: true },
  { id: "2", title: "Docker y Cloud Native", active: true },
];

app.get("/api/courses", (req, res) => {
  res.json(courses);
});

app.post("/api/courses", (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "El título es requerido" });
  }
  const course = { id: String(courses.length + 1), title, active: true };
  courses.push(course);
  res.status(201).json(course);
});

// Graceful shutdown — Factor IX del 12-Factor App
const server = app.listen(PORT, () => {
  console.log(`🚀 EduFlow API corriendo en puerto ${PORT}`);
});

const shutdown = (signal) => {
  console.log(`🔄 Señal ${signal}: cerrando servidor...`);
  server.close(() => {
    console.log("✅ Servidor cerrado");
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
```

```json
// package.json
{
  "name": "eduflow-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

---

## Paso 1: Crear el .dockerignore

**Siempre antes del Dockerfile** — define qué NO enviar al daemon Docker.

```bash
cat > .dockerignore << 'EOF'
# Dependencias — las instalamos dentro del contenedor
node_modules/
.pnpm-store/

# Variables de entorno con secretos
.env
.env.*
!.env.example

# Archivos de desarrollo
*.log
*.md
.git/
.gitignore

# Testing y CI
__tests__/
*.test.js
*.spec.js
coverage/
.nyc_output/

# SO y editores
.DS_Store
Thumbs.db
.vscode/
.idea/

# Docker (no necesario dentro de la imagen)
Dockerfile
docker-compose*.yml
EOF
```

Verificar el contexto que se enviaría:

```bash
# Ver qué incluye y excluye el contexto de build
docker build --no-cache --progress=plain . 2>&1 | head -30
```

---

## Paso 2: Dockerfile — Versión Básica

Empezamos con la versión más simple para entender el flujo:

```dockerfile
# Dockerfile.basic — para aprendizaje (NO recomendado para producción)

# Imagen base con Node.js 20 en Alpine Linux (~45MB base)
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias PRIMERO
# (optimiza cache: solo re-instala si cambia package.json)
COPY package.json pnpm-lock.yaml ./

# Instalar pnpm y dependencias
RUN npm install -g pnpm@8 && pnpm install --frozen-lockfile --prod

# Copiar el resto del código fuente
COPY . .

# Puerto que expone la aplicación
EXPOSE 3000

# Health check básico
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Comando de inicio
CMD ["node", "server.js"]
```

Construir y probar:

```bash
docker build -f Dockerfile.basic -t eduflow:basic .
docker images eduflow  # ver el tamaño de la imagen

docker run --rm -p 3000:3000 --name eduflow-test eduflow:basic
curl http://localhost:3000/health

# Detener
docker stop eduflow-test
```

---

## Paso 3: Dockerfile Optimizado (Multi-stage)

Ahora la versión de producción:

```dockerfile
# Dockerfile — versión optimizada multi-stage

# ═══════════════════════════════════════════════════
# STAGE 1: Instalar dependencias
# Solo se reconstruye cuando cambia package.json
# ═══════════════════════════════════════════════════
FROM node:20-alpine AS deps

# Instalar pnpm
RUN npm install -g pnpm@8

WORKDIR /app

# Copiar solo manifiestos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar SOLO producción (sin devDependencies)
RUN pnpm install --frozen-lockfile --prod

# ═══════════════════════════════════════════════════
# STAGE 2: Imagen de producción
# Parte desde imagen limpia, copia solo lo necesario
# ═══════════════════════════════════════════════════
FROM node:20-alpine AS production

# Metadatos (buena práctica)
LABEL maintainer="bootcamp-sena"
LABEL version="1.0.0"
LABEL description="EduFlow API - Arquitectura de Software"

WORKDIR /app

# Crear usuario no-root para mayor seguridad
# Las imágenes base node ya incluyen el usuario "node"
USER node

# Cambiar propietario del directorio de trabajo
# (debe hacerse ANTES de copiar archivos)
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .

# Declarar el puerto (documentación y por convención)
EXPOSE 3000

# Health check usando wget (incluido en alpine)
HEALTHCHECK \
  --interval=30s \
  --timeout=5s \
  --start-period=15s \
  --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Variable de entorno por defecto
ENV NODE_ENV=production \
    PORT=3000

# Comando de inicio
CMD ["node", "server.js"]
```

---

## Paso 4: Construir y Comparar

```bash
# Construir la imagen optimizada
docker build -t eduflow:v1.0 .

# Comparar tamaños
docker images | grep eduflow

# Resultado típico:
# eduflow   basic    abc123   130MB   (sin multi-stage)
# eduflow   v1.0     def456   95MB    (con multi-stage)

# Inspeccionar las capas de la imagen
docker history eduflow:v1.0
```

---

## Paso 5: Ejecutar y Verificar

```bash
# Ejecutar con variables de entorno
docker run \
  --rm \
  --name eduflow-api \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  eduflow:v1.0

# En otra terminal: verificar el health check
curl -s http://localhost:3000/health | python3 -m json.tool

# Resultado esperado:
# {
#   "status": "ok",
#   "timestamp": "2025-01-15T10:30:00.000Z",
#   "version": "1.0.0"
# }

# Probar endpoint de cursos
curl http://localhost:3000/api/courses

# Crear un curso
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"Microservicios con Node.js"}'
```

---

## Paso 6: Verificar el Usuario No-root

```bash
# Ejecutar container y verificar con qué usuario corre
docker run --rm eduflow:v1.0 whoami
# Debe mostrar: node

# Verificar que no corre como root
docker run --rm eduflow:v1.0 id
# Debe mostrar: uid=1000(node) gid=1000(node) groups=1000(node)
```

---

## Paso 7: Entender el Cache de Docker

Experimenta con el orden de las instrucciones:

```bash
# Primera build (sin cache): instala todo, tarda más
docker build --no-cache -t eduflow:v1.0 .

# Ahora modifica server.js y vuelve a buildear
echo "// cambio menor" >> server.js
docker build -t eduflow:v1.0 .
# Observa: "CACHED" en las capas de node_modules → build mucho más rápido

# Ahora modifica package.json y vuelve a buildear
# Observa: las capas de deps se invalidan → reinstala pnpm y node_modules
```

---

## 🧪 Ejercicios de Validación

### Ejercicio 1: Inspección de la imagen

```bash
# Ver todas las capas y sus tamaños
docker history --no-trunc eduflow:v1.0

# Inspeccionar metadatos de la imagen
docker inspect eduflow:v1.0 | python3 -m json.tool | grep -A5 '"Config"'

# Ver el proceso de inicio
docker inspect eduflow:v1.0 | python3 -m json.tool | grep '"Cmd"'
```

### Ejercicio 2: Agregar variable de entorno

Modifica el `server.js` para aceptar `APP_VERSION` como variable de entorno:

```javascript
// En el endpoint /health, incluir la versión desde env
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    version: process.env.APP_VERSION ?? "unknown",
    timestamp: new Date().toISOString(),
  });
});
```

Buildea y ejecuta pasando la variable:

```bash
docker build -t eduflow:v1.1 .
docker run --rm -p 3000:3000 -e APP_VERSION=1.1.0 eduflow:v1.1
curl http://localhost:3000/health
```

### Ejercicio 3: Comparar Alpine vs Regular

```bash
# Imagen con node:20 (sin alpine)
FROM node:20 ...
# vs
# Imagen con node:20-alpine

# Comparar tamaños en disco
# node:20         ~1.1 GB
# node:20-alpine  ~180 MB
```

---

## ✅ Checklist de Validación

Antes de continuar a la Práctica 02, verifica:

- [ ] `docker build -t eduflow:v1.0 .` finaliza sin errores
- [ ] `curl http://localhost:3000/health` retorna `{"status":"ok",...}`
- [ ] `docker run --rm eduflow:v1.0 whoami` retorna `node` (no `root`)
- [ ] El tamaño de la imagen es < 200MB
- [ ] `.dockerignore` existe y excluye `node_modules`, `.env`
- [ ] Segunda build (sin cambios) usa cache y es más rápida

---

## 💡 Para Reflexionar

1. ¿Por qué copiar `package.json` antes que el código fuente?
2. ¿Qué diferencia hay entre `CMD` y `ENTRYPOINT`?
3. ¿Por qué `node:20-alpine` y no `node:20-slim`?
4. ¿Qué pasa si no defines `HEALTHCHECK` — puede Docker saber si la app está bien?

---

## 🔗 Siguiente Práctica

[Práctica 02 → Docker Compose: API + PostgreSQL + pgAdmin](02-practica-docker-compose.md)
