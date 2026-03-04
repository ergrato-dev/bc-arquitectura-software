# 💻 Práctica 02: Docker Compose — API + PostgreSQL + pgAdmin

> **Objetivo**: Orquestar una aplicación multi-servicio con Docker Compose. La API de EduFlow se conectará a PostgreSQL con health checks, volúmenes persistentes y red aislada.

**Tiempo estimado**: 40 minutos

**Prerrequisito**: [Práctica 01 — Dockerfile para EduFlow](01-practica-dockerfile.md)

---

## 🧰 Configuración Inicial

```bash
# En el directorio del proyecto (eduflow-docker/)
# Continúa desde la práctica anterior, ya tienes:
# ✅ Dockerfile
# ✅ .dockerignore
# ✅ server.js
# ✅ package.json

# Ahora añadir soporte para PostgreSQL
pnpm add pg
```

---

## Paso 1: Actualizar server.js con PostgreSQL

Modificamos la API para conectarse a la BD del contenedor:

```javascript
// server.js — con soporte para PostgreSQL
import express from "express";
import { Pool } from "pg";

// Configuración 12-factor: todo desde variables de entorno
const PORT = parseInt(process.env.PORT ?? "3000", 10);
const DATABASE_URL = process.env.DATABASE_URL;

// Inicializar pool fuera del handler (reutilización entre requests)
let pool = null;

const getPool = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }
  return pool;
};

const app = express();
app.use(express.json());

// ─────────────────────────────────────────────────────
// Health check con verificación de BD (readiness probe)
// ─────────────────────────────────────────────────────
app.get("/health", async (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    database: "unknown",
  };

  if (!DATABASE_URL) {
    // Sin BD configurada: solo verifica que el proceso vive
    return res.json(health);
  }

  try {
    const client = await getPool().connect();
    await client.query("SELECT 1");
    client.release();
    health.database = "ok";
    res.json(health);
  } catch (error) {
    health.status = "degraded";
    health.database = "error";
    res.status(503).json(health);
  }
});

// ─────────────────────────────────────────────────────
// Endpoints de cursos
// ─────────────────────────────────────────────────────
app.get("/api/courses", async (req, res) => {
  try {
    if (!DATABASE_URL) {
      // Modo sin BD para testing local rápido
      return res.json([{ id: "1", title: "Arquitectura de Software" }]);
    }

    const { rows } = await getPool().query(
      "SELECT id, title, description, active, created_at FROM courses ORDER BY created_at DESC",
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener cursos:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/api/courses/:id", async (req, res) => {
  try {
    const { rows } = await getPool().query(
      "SELECT * FROM courses WHERE id = $1",
      [req.params.id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post("/api/courses", async (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: "El título es requerido" });
  }

  try {
    const { rows } = await getPool().query(
      "INSERT INTO courses (title, description) VALUES ($1, $2) RETURNING *",
      [title, description ?? null],
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error al crear curso:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ─────────────────────────────────────────────────────
// Graceful shutdown (Factor IX)
// ─────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`🚀 EduFlow API corriendo en puerto ${PORT}`);
  console.log(
    `🗄️  Base de datos: ${DATABASE_URL ? "PostgreSQL" : "Modo sin BD"}`,
  );
});

const shutdown = async (signal) => {
  console.log(`🔄 ${signal}: cerrando servidor...`);
  server.close(async () => {
    if (pool) {
      await pool.end();
      console.log("✅ Pool de BD cerrado");
    }
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 15_000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
```

---

## Paso 2: Script de Migración

```javascript
// scripts/migrate.js — Factor XII: admin processes como scripts separados
import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL no definida");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

const migrations = [
  {
    name: "001_create_courses",
    sql: `
      CREATE TABLE IF NOT EXISTS courses (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title       VARCHAR(200) NOT NULL,
        description TEXT,
        active      BOOLEAN DEFAULT true,
        created_at  TIMESTAMPTZ DEFAULT NOW(),
        updated_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `,
  },
  {
    name: "002_create_enrollments",
    sql: `
      CREATE TABLE IF NOT EXISTS enrollments (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        student_id  UUID NOT NULL,
        enrolled_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(course_id, student_id)
      )
    `,
  },
  {
    name: "003_seed_sample_data",
    sql: `
      INSERT INTO courses (title, description)
      VALUES
        ('Arquitectura de Software', 'Fundamentos y patrones arquitectónicos'),
        ('Docker y Cloud Native', 'Contenedores, IaaS/PaaS/SaaS y 12-factor app'),
        ('Seguridad en Arquitectura', 'OWASP, autenticación y diseño seguro')
      ON CONFLICT DO NOTHING
    `,
  },
];

console.log("🔄 Iniciando migraciones...");

for (const migration of migrations) {
  try {
    await pool.query(migration.sql);
    console.log(`✅ Migración aplicada: ${migration.name}`);
  } catch (error) {
    console.error(`❌ Error en migración ${migration.name}:`, error.message);
    await pool.end();
    process.exit(1);
  }
}

await pool.end();
console.log("🎉 Todas las migraciones completadas");
```

---

## Paso 3: Variables de Entorno

```bash
# .env.example — documentar todas las variables (commiteado al repo)
cat > .env.example << 'EOF'
# Puerto de la API
PORT=3000

# Ambiente (development | staging | production)
NODE_ENV=development

# PostgreSQL
POSTGRES_DB=eduflow
POSTGRES_USER=eduflow
POSTGRES_PASSWORD=     # REQUERIDO — elegir contraseña segura

# URL de conexión a la BD (construida automáticamente en docker-compose)
# Solo necesaria para ejecución fuera de Docker
DATABASE_URL=postgresql://eduflow:CHANGE_ME@localhost:5432/eduflow

# pgAdmin (opcional, para herramienta de administración visual)
PGADMIN_EMAIL=admin@eduflow.local
PGADMIN_PASSWORD=      # REQUERIDO si usas pgAdmin
EOF
```

```bash
# .env — valores reales (NO commitear)
cp .env.example .env

# Editar con valores reales
nano .env
# O con tu editor preferido
```

```
# .env (después de editar)
PORT=3000
NODE_ENV=development
POSTGRES_DB=eduflow
POSTGRES_USER=eduflow
POSTGRES_PASSWORD=SuperSecret123!
DATABASE_URL=postgresql://eduflow:SuperSecret123!@localhost:5432/eduflow
PGADMIN_EMAIL=admin@eduflow.local
PGADMIN_PASSWORD=Admin123!
```

---

## Paso 4: docker-compose.yml Principal

```yaml
# docker-compose.yml

version: "3.8"

services:
  # ─────────────────────────────────────────────────────
  # Servicio 1: PostgreSQL 15
  # ─────────────────────────────────────────────────────
  db:
    image: postgres:15-alpine
    container_name: eduflow-db
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-eduflow}
      POSTGRES_USER: ${POSTGRES_USER:-eduflow}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?La contraseña de PostgreSQL es requerida}
    ports:
      - "5432:5432" # Exponer al host para conexión de herramientas externas
    volumes:
      - postgres_data:/var/lib/postgresql/data # Datos persistentes
    networks:
      - eduflow-net
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "pg_isready -U ${POSTGRES_USER:-eduflow} -d ${POSTGRES_DB:-eduflow}",
        ]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    restart: unless-stopped

  # ─────────────────────────────────────────────────────
  # Servicio 2: Migración (se ejecuta y termina)
  # ─────────────────────────────────────────────────────
  migrate:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: eduflow-migrate
    command: ["node", "scripts/migrate.js"]
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER:-eduflow}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB:-eduflow}
    networks:
      - eduflow-net
    depends_on:
      db:
        condition: service_healthy # Esperar a que PostgreSQL esté listo
    restart: "no" # Solo corre una vez

  # ─────────────────────────────────────────────────────
  # Servicio 3: API de EduFlow
  # ─────────────────────────────────────────────────────
  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: eduflow-api
    environment:
      NODE_ENV: ${NODE_ENV:-production}
      PORT: ${PORT:-3000}
      # "db" es el nombre del servicio → Docker lo resuelve automáticamente
      DATABASE_URL: postgresql://${POSTGRES_USER:-eduflow}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB:-eduflow}
    ports:
      - "${PORT:-3000}:3000"
    networks:
      - eduflow-net
    depends_on:
      db:
        condition: service_healthy
      migrate:
        condition: service_completed_successfully # Esperar que las migraciones terminen
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s
    restart: unless-stopped

  # ─────────────────────────────────────────────────────
  # Servicio 4: pgAdmin (herramienta visual para BD)
  # Opcional — comentar si no se necesita
  # ─────────────────────────────────────────────────────
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: eduflow-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_EMAIL:-admin@eduflow.local}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD:?Contraseña pgAdmin requerida}
      PGADMIN_CONFIG_SERVER_MODE: "False" # Modo de escritorio (sin login extra)
    ports:
      - "5050:80"
    networks:
      - eduflow-net
    depends_on:
      - db
    restart: unless-stopped
    volumes:
      - pgadmin_data:/var/lib/pgadmin

# ─────────────────────────────────────────────────────
# Volúmenes: datos que persisten entre reinicios
# ─────────────────────────────────────────────────────
volumes:
  postgres_data:
    name: eduflow_postgres_data
  pgadmin_data:
    name: eduflow_pgadmin_data

# ─────────────────────────────────────────────────────
# Red: aislamiento de comunicación interna
# ─────────────────────────────────────────────────────
networks:
  eduflow-net:
    name: eduflow_network
    driver: bridge
```

---

## Paso 5: Levantar el Stack

```bash
# Construir imágenes y levantar en background
docker compose up --build -d

# Verificar estado de los servicios
docker compose ps

# Resultado esperado:
# NAME              STATUS           PORTS
# eduflow-db        healthy          0.0.0.0:5432->5432/tcp
# eduflow-migrate   exited (0)       (migración completada exitosamente)
# eduflow-api       healthy          0.0.0.0:3000->3000/tcp
# eduflow-pgadmin   running          0.0.0.0:5050->80/tcp
```

---

## Paso 6: Verificar el Stack

```bash
# 1. Health check de la API
curl -s http://localhost:3000/health | python3 -m json.tool

# Resultado esperado:
# {
#   "status": "ok",
#   "timestamp": "...",
#   "version": "1.0.0",
#   "database": "ok"
# }

# 2. Ver cursos creados por la migración
curl -s http://localhost:3000/api/courses | python3 -m json.tool

# 3. Crear un nuevo curso
curl -s -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"Microservicios Avanzados","description":"Patterns y orquestación"}' \
  | python3 -m json.tool

# 4. Verificar que el curso se guardó
curl -s http://localhost:3000/api/courses | python3 -m json.tool
```

---

## Paso 7: Explorar con pgAdmin

1. Abrir: `http://localhost:5050`
2. Las credenciales están en tu `.env` (`PGADMIN_EMAIL` y `PGADMIN_PASSWORD`)
3. Agregar servidor:
   - Host: `db` (nombre del servicio, no `localhost`)
   - Puerto: `5432`
   - Base de datos: `eduflow`
   - Usuario: `eduflow`
   - Contraseña: la de tu `.env`

---

## Paso 8: Verificar Persistencia de Datos

```bash
# Crear datos
curl -s -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"Test de Persistencia","description":"Debe sobrevivir al reinicio"}'

# Detener servicios (sin borrar volúmenes)
docker compose down

# Verificar que el volumen persiste
docker volume ls | grep eduflow

# Volver a levantar
docker compose up -d

# Los datos deben seguir ahí
curl -s http://localhost:3000/api/courses | python3 -m json.tool

# ⚠️ Para borrar TODO incluyendo la BD (reset completo):
# docker compose down -v
```

---

## Paso 9: Comandos de Operación Diaria

```bash
# Ver logs en tiempo real de todos los servicios
docker compose logs -f

# Ver logs solo de la API
docker compose logs -f api

# Ver logs de las últimas 50 líneas
docker compose logs --tail=50 api

# Entrar al shell de un contenedor
docker compose exec api sh

# Ejecutar comando en la BD
docker compose exec db psql -U eduflow -d eduflow

# Reiniciar solo la API (sin reconstruir)
docker compose restart api

# Reiniciar y reconstruir la API
docker compose up -d --build api

# Ver uso de recursos
docker stats

# Limpiar contenedores e imágenes obsoletas (no borra volúmenes activos)
docker compose down
docker image prune -f
```

---

## 🧪 Ejercicios de Validación

### Ejercicio 1: Simular fallo de la BD

```bash
# Detener solo la BD
docker compose stop db

# Verificar el health de la API
curl -s http://localhost:3000/health
# Debe retornar: {"status":"degraded","database":"error"}

# Restaurar la BD
docker compose start db
docker compose logs -f db   # esperar "database system is ready"
curl -s http://localhost:3000/health
# Debe retornar: {"status":"ok","database":"ok"}
```

### Ejercicio 2: Escalar la API

```bash
# Levantar 3 instancias de la API (quita el 'ports' o usa el port range)
docker compose up -d --scale api=3 --no-deps api

# Ver las 3 instancias
docker compose ps

# ¿Qué problema surge? (pista: conflicto de puertos)
# ¿Cómo lo resolverías en producción? (pista: load balancer)
```

### Ejercicio 3: Variables de entorno en debug

```bash
# Ver las variables de entorno del contenedor api
docker compose exec api env | grep -E "PORT|NODE_ENV|DATABASE"

# Verificar que no hay credenciales en la imagen (importante!)
docker inspect eduflow-api | python3 -m json.tool | grep -A20 '"Env"'
```

---

## ✅ Checklist de Validación

- [ ] `docker compose up --build -d` finaliza sin errores
- [ ] `docker compose ps` muestra `db` y `api` como `healthy`
- [ ] `curl http://localhost:3000/health` retorna `{"database":"ok",...}`
- [ ] `curl http://localhost:3000/api/courses` muestra los cursos del seed
- [ ] Los datos persisten tras `docker compose down && docker compose up -d`
- [ ] `.env` está en `.gitignore` y `.dockerignore`
- [ ] Las credenciales no están hardcodeadas en ningún archivo source

---

## 🔗 Siguiente Práctica

[Práctica 03 → Funciones Serverless con Node.js](03-practica-serverless.md)
