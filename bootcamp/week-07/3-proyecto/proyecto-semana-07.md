# 🚀 Proyecto Integrador — Semana 07: Tu Dominio en la Nube

> **Tu proyecto pasa a la nube**: Toma la API REST de **tu proyecto personal** desarrollada en semanas anteriores y conviértela en una aplicación cloud-ready con Docker, variables de entorno correctas y documentación de despliegue completa.

> ⚠️ **Política anticopia**: Cada aprendiz trabaja con su dominio asignado en semana 01. Los nombres de la base de datos, servicios, imágenes y variables de entorno deben corresponder a **tu dominio**. El reto de la semana (EduFlow) es el ejemplo didáctico, no el entregable.

---

## 🎯 Objetivo del Proyecto

Demostrar que puedes aplicar los principios de **Cloud Native / 12-Factor App** y las herramientas de contenedores (**Docker + Compose**) para hacer que una aplicación sea portable, reproducible y lista para producción.

**Al finalizar tendrás:**

- Una imagen Docker optimizada (multi-stage) del API de EduFlow
- Un `docker-compose.yml` completo (API + PostgreSQL + pgAdmin)
- Documentación de despliegue en README
- Configuración separada para desarrollo y producción

---

## 📋 Descripción del Reto

Es momento de llevar **tu proyecto personal** a la nube. El primer paso es **contenerizar la aplicación** para que cualquier desarrollador pueda levantarla con un solo comando desde un sistema limpio.

Tu misión: entregar el repositorio `[tu-dominio]-cloud` con la infraestructura completa. Reemplaza `[tu-dominio]` con el nombre kebab-case de tu dominio asignado (ej: `biblioteca-cloud`, `gimnasio-cloud`, `veterinaria-cloud`).

---

## 🏗️ Arquitectura Objetivo

```
[tu-dominio]-cloud/           ← renombra con tu dominio (ej: biblioteca-cloud)
├── Dockerfile                 # Build multi-stage optimizado
├── docker-compose.yml         # Desarrollo local
├── docker-compose.prod.yml    # Producción (anula compose.yml)
├── .env.example              # Plantilla de variables de entorno
├── .dockerignore             # Excluir node_modules, .env, etc.
├── README.md                 # Guía de despliegue
├── package.json              # type: module, pnpm
└── src/
    ├── app.js                # Setup Express (SIN listen)
    ├── server.js             # Entry point (solo llama a app.listen)
    ├── config.js             # Configuración desde process.env
    ├── routes/
    │   └── [entidad-principal].js    ← tu entidad principal
    ├── services/
    │   └── [entidad-principal]-service.js
    └── db/
        ├── pool.js           # Pool de conexión PostgreSQL
        └── migrations.js     # Migraciones al arrancar
```

**Antes de escribir archivos**, define los nombres concretos de tu dominio:

| Placeholder            | Tu valor                        | Ejemplo                     |
| ---------------------- | ------------------------------- | --------------------------- |
| `[tu-dominio]`         | Nombre kebab-case de tu negocio | `biblioteca`, `veterinaria` |
| `[entidad-principal]`  | Tabla/recurso principal         | `books`, `patients`         |
| `[entidad-secundaria]` | Segunda tabla                   | `loans`, `appointments`     |

---

## 📝 Entregables

### 1. Dockerfile Multi-Stage (obligatorio)

El multi-stage debe:

- Usar `node:20-alpine` como base
- Stage `deps`: instalar solo dependencias de producción
- Stage `final`: copiar desde `deps`, correr como usuario `node` (no root)
- Incluir `HEALTHCHECK` con `curl --fail http://localhost:PORT/health`
- El tamaño de la imagen final debe ser inferior a 150 MB

```dockerfile
# Dockerfile
FROM node:20-alpine AS deps

# Instalar pnpm via corepack (incluido en Node.js 20)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar manifests PRIMERO (aprovechar caché de capas)
COPY package.json pnpm-lock.yaml* ./

# Instalar solo producción
RUN pnpm install --frozen-lockfile --prod

# ---- Stage final ----
FROM node:20-alpine AS final

WORKDIR /app

# Copiar dependencias instaladas
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY src/ ./src/
COPY package.json ./

# Metadatos de la imagen
LABEL org.opencontainers.image.title="[Tu Dominio] API"
LABEL org.opencontainers.image.description="API REST de [descripción breve de tu dominio]"

# Exponer puerto (documentación — no abre el puerto, lo hace -p o Compose)
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Correr como usuario no-root
USER node

# Comando de arranque
CMD ["node", "src/server.js"]
```

### 2. Docker Compose de Desarrollo

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-[tu-dominio]}
      POSTGRES_USER: ${POSTGRES_USER:-[tu-dominio]}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-secret}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "pg_isready -U ${POSTGRES_USER:-[tu-dominio]} -d ${POSTGRES_DB:-[tu-dominio]}",
        ]
      interval: 10s
      timeout: 5s
      retries: 5

  migrate:
    build: .
    command: node src/db/migrations.js
    environment:
      DATABASE_URL: postgres://${POSTGRES_USER:-[tu-dominio]}:${POSTGRES_PASSWORD:-secret}@db:5432/${POSTGRES_DB:-[tu-dominio]}
      NODE_ENV: development
    depends_on:
      db:
        condition: service_healthy

  api:
    build: .
    ports:
      - "${PORT:-3000}:3000"
    environment:
      PORT: 3000
      NODE_ENV: development
      DATABASE_URL: postgres://${POSTGRES_USER:-[tu-dominio]}:${POSTGRES_PASSWORD:-secret}@db:5432/${POSTGRES_DB:-[tu-dominio]}
    depends_on:
      db:
        condition: service_healthy
      migrate:
        condition: service_completed_successfully
    # Hot-reload en desarrollo: montar código como volumen
    volumes:
      - ./src:/app/src:ro

  pgadmin:
    image: dpage/pgadmin4:latest
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_EMAIL:-admin@[tu-dominio].local}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD:-admin}
    ports:
      - "5050:80"
    depends_on:
      - db

volumes:
  pgdata:
```

### 3. Docker Compose de Producción

```yaml
# docker-compose.prod.yml
# Usar con: docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

services:
  api:
    # En producción: deshabilitar hot-reload, imagen pre-construida
    volumes: []
    environment:
      NODE_ENV: production
      PORT: 3000
    deploy:
      replicas: 2
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3

  # No incluir pgAdmin en producción
  pgadmin:
    profiles:
      - tools # Solo se inicia con --profile tools

  db:
    deploy:
      restart_policy:
        condition: on-failure
```

### 4. Aplicación Código Fuente

```javascript
// src/config.js — 12-Factor: III. Config
// Toda la configuración viene de variables de entorno

const required = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variable de entorno requerida no definida: ${name}`);
  }
  return value;
};

export const config = {
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  // En producción DATABASE_URL es requerida; en testing puede faltar
  databaseUrl:
    process.env.NODE_ENV === "production"
      ? required("DATABASE_URL")
      : process.env.DATABASE_URL,
};

export const isDevelopment = config.nodeEnv === "development";
export const isProduction = config.nodeEnv === "production";
```

```javascript
// src/db/pool.js — Pool de conexión con manejo de errores
import pg from "pg";
import { config } from "../config.js";

const { Pool } = pg;

let pool = null;

export const getPool = () => {
  if (!config.databaseUrl) return null;

  if (!pool) {
    pool = new Pool({
      connectionString: config.databaseUrl,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 2_000,
    });

    pool.on("error", (err) => {
      console.error("Error inesperado en cliente PostgreSQL:", err);
    });
  }
  return pool;
};

export const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};
```

```javascript
// src/db/migrations.js — Migraciones idempotentes
import { getPool } from "./pool.js";

const migrations = [
  {
    // Migración 1: Crea la tabla principal de TU dominio
    // Reemplaza el nombre y las columnas según tus entidades
    name: "001_create_[entidad-principal]",
    sql: `
      CREATE TABLE IF NOT EXISTS [entidad_principal] (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        -- Agrega aquí las columnas de tu entidad principal
        nombre     VARCHAR(200) NOT NULL,
        [campo_unico] VARCHAR(200) UNIQUE NOT NULL,
        activo     BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `,
  },
  {
    // Migración 2: Crea la segunda tabla de TU dominio
    name: "002_create_[entidad-secundaria]",
    sql: `
      CREATE TABLE IF NOT EXISTS [entidad_secundaria] (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        -- Agrega aquí las columnas de tu entidad secundaria
        [campo_principal] VARCHAR(200) NOT NULL,
        activo     BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `,
  },
  {
    // Migración 3: Tabla de relación entre tus entidades (si aplica)
    name: "003_create_[relacion]",
    sql: `
      CREATE TABLE IF NOT EXISTS [relacion] (
        id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        [entidad_principal_id] UUID NOT NULL REFERENCES [entidad_principal](id),
        [entidad_secundaria_id] UUID NOT NULL REFERENCES [entidad_secundaria](id),
        fecha                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE([entidad_principal_id], [entidad_secundaria_id])
      );
    `,
  },
];

const runMigrations = async () => {
  const pool = getPool();
  if (!pool) {
    console.log("⚠️  Sin base de datos configurada, saltando migraciones");
    return;
  }

  const client = await pool.connect();
  try {
    // Tabla de seguimiento de migraciones
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        name       VARCHAR(100) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    for (const migration of migrations) {
      // Idempotente: solo aplica si no ha corrido antes
      const { rows } = await client.query(
        "SELECT name FROM _migrations WHERE name = $1",
        [migration.name],
      );

      if (rows.length === 0) {
        await client.query(migration.sql);
        await client.query("INSERT INTO _migrations (name) VALUES ($1)", [
          migration.name,
        ]);
        console.log(`✅ Migración aplicada: ${migration.name}`);
      } else {
        console.log(`⏭️  Migración ya aplicada: ${migration.name}`);
      }
    }

    console.log("🗄️  Migraciones completadas");
  } finally {
    client.release();
  }
};

// Si se ejecuta directamente (node src/db/migrations.js)
runMigrations()
  .then(() => {
    console.log("✅ Script de migración finalizado");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error en migraciones:", err);
    process.exit(1);
  });
```

```javascript
// src/app.js — Setup Express SIN listen (12-Factor: separar build de run)
import express from "express";
// Importa los routers de TU dominio — reemplaza con tus nombres concretos
import { [entidadPrincipal]Router } from './routes/[entidad-principal].js';

export const createApp = () => {
  const app = express();
  app.use(express.json({ limit: "100kb" }));

  // Health check — debe responder ANTES de que la BD esté lista
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Readiness — la BD debe estar disponible
  app.get("/ready", async (_req, res) => {
    try {
      const { getPool } = await import("./db/pool.js");
      const pool = getPool();
      if (pool) {
        await pool.query("SELECT 1");
        res.json({ status: "ready" });
      } else {
        res.status(503).json({ status: "sin base de datos configurada" });
      }
    } catch {
      res.status(503).json({ status: "base de datos no disponible" });
    }
  });

  // Registra los routers de TU dominio
  // Ejemplo: app.use('/api/[entidad-principal]', [entidadPrincipal]Router);
  app.use("/api/[entidad-principal]", [entidadPrincipal]Router);

  return app;
};
```

```javascript
// src/server.js — Entry point: solo llama a listen
import { createApp } from "./app.js";
import { config } from "./config.js";
import { closePool } from "./db/pool.js";

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(
    JSON.stringify({
      event: "server_started",
      port: config.port,
      env: config.nodeEnv,
      timestamp: new Date().toISOString(),
    }),
  );
});

// Graceful shutdown — 12-Factor IX: Disposability
const shutdown = async (signal) => {
  console.log(`⚡ Señal ${signal} recibida. Cerrando servidor...`);

  server.close(async () => {
    await closePool();
    console.log("✅ Servidor cerrado correctamente");
    process.exit(0);
  });

  // Forzar cierre si tarda más de 10s
  setTimeout(() => {
    console.error("❌ Cierre forzado por timeout");
    process.exit(1);
  }, 10_000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
```

### 5. Archivo .env.example

```bash
# .env.example — copia a .env y rellena los valores reales
# NUNCA hagas commit del archivo .env original
# Reemplaza [tu-dominio] con el nombre kebab-case de tu dominio

# Base de datos — usa el nombre de TU dominio
POSTGRES_DB=[tu-dominio]
POSTGRES_USER=[tu-dominio]
POSTGRES_PASSWORD=CAMBIAR_ESTO

# API
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://[tu-dominio]:CAMBIAR_ESTO@localhost:5432/[tu-dominio]

# pgAdmin (solo desarrollo)
PGADMIN_EMAIL=admin@[tu-dominio].local
PGADMIN_PASSWORD=CAMBIAR_ESTO
```

### 6. README.md del Proyecto

````markdown
# [Tu Dominio] Cloud

API REST de [descripción de tu negocio]. Cloud native, containerizada con Docker.

## 🚀 Inicio Rápido (Desarrollo)

```bash
# 1. Clonar el repositorio
git clone <url>
cd [tu-dominio]-cloud

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales reales

# 3. Levantar todos los servicios
docker compose up --build

# 4. Verificar que funciona
curl http://localhost:3000/health
curl http://localhost:3000/api/[entidad-principal]
```
````

## 🛑 Detener Servicios

```bash
docker compose down          # Detener (conservar datos)
docker compose down -v       # Detener + borrar volúmenes (¡borra BD!)
```

## 🌐 URLs Disponibles

| Servicio         | URL                          |
| ---------------- | ---------------------------- |
| API [Tu Dominio] | http://localhost:3000        |
| API Health       | http://localhost:3000/health |
| pgAdmin          | http://localhost:5050        |

```

---

## 📊 Criterios de Evaluación

| Criterio | Descripción | Puntos |
|----------|-------------|--------|
| Dockerfile funcional | Build exitoso < 150MB, multi-stage, usuario node | 25 |
| Compose completo | 4 servicios con healthchecks y depends_on | 25 |
| 12-Factor compliance | Config desde env, logs en stdout, graceful shutdown | 25 |
| Documentación | README claro con pasos de despliegue | 15 |
| Código ES2023 | Módulos ESM, private fields donde aplique | 10 |

**Total**: 100 puntos | Mínimo para aprobar: 70 puntos

---

## 🔑 Criterios de Éxito Mínimos (Obligatorios)

1. `docker compose up --build` desde clon limpio levanta todos los servicios
2. `curl http://localhost:3000/health` retorna `{"status":"ok",...}`
3. `curl http://localhost:3000/api/courses` retorna JSON (con o sin BD)
4. La imagen del API pesa menos de 150MB (`docker images | grep eduflow`)
5. `.env` NO está en el repositorio (está en `.gitignore`)
6. `.env.example` SÍ está en el repositorio como plantilla

---

## 🔗 Navegación

← [Semana 07 — Inicio](../README.md) | [Práctica 03 — Serverless](../2-practicas/03-practica-serverless.md)
```
