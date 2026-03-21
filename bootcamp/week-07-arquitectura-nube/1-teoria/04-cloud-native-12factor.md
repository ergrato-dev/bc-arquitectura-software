# 🌿 Arquitectura Cloud Native y 12-Factor App

> _"Una aplicación cloud native no es la que está en la nube — es la que fue diseñada para aprovecharla desde el primer día."_

---

## 🎯 ¿Qué es Cloud Native?

### ¿Qué es?

Cloud Native es un enfoque de diseño donde las aplicaciones son construidas **para explotar las capacidades de la nube**: elasticidad, distribución geográfica, auto-reparación y despliegue continuo.

No es suficiente meter una app legacy en un contenedor. Una app cloud native está diseñada para:

- Escalar horizontalmente (más instancias, no más grandes)
- Fallar de forma resiliente y recuperarse sola
- Actualizarse sin downtime
- Configurarse desde el entorno, no desde archivos embebidos

### ¿Para qué sirve?

- **Operaciones sin fricciones**: deploy diario sin miedo a romper producción
- **Alta disponibilidad**: si una instancia falla, las demás absorben el tráfico
- **Escalabilidad reactiva**: más carga = más instancias, automáticamente
- **Portabilidad**: corre igual en AWS, GCP, Azure o tu laptop

### ¿Qué impacto tiene?

**Si diseñas cloud native:**

- ✅ Deploy en minutos, no en horas
- ✅ Rollback automático si algo falla
- ✅ Costo proporcional al uso real

**Si llevas código legacy a la nube sin rediseño:**

- ❌ App que falla cuando hay dos instancias (estado en memoria)
- ❌ Configuración hardcodeada que rompe en nuevos entornos
- ❌ Matar clientes durante deploys (downtime)

---

## 📋 Las 12 Reglas del 12-Factor App

La metodología **12-Factor App** fue creada por Adam Wiggins (Heroku) para documentar las mejores prácticas de aplicaciones SaaS robustas y portables.

<!-- Diagrama: 0-assets/05-12-factor-app.svg -->

![12 Factor App](../0-assets/05-12-factor-app.svg)

---

### Factor I: Codebase (Base de Código)

> Una sola base de código controlada en versión, muchos deploys.

```
✅ Un repositorio Git → múltiples ambientes (dev, staging, prod)
❌ "El código de producción está en otro servidor y tiene cambios manuales"
```

```bash
# Un repo, múltiples configuraciones por ambiente
# La diferencia entre ambientes viene de VARIABLES DE ENTORNO, no del código

git remote -v
origin    https://github.com/org/eduflow-api.git  # único repo
# El mismo código corre en dev, staging y prod
```

---

### Factor II: Dependencies (Dependencias)

> Declarar y aislar dependencias explícitamente.

```javascript
// ✅ Bien: dependencias declaradas en package.json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0"
  }
}

// pnpm install garantiza las mismas versiones en todos los entornos
// gracias al pnpm-lock.yaml

// ❌ Mal: asumir que una librería está instalada globalmente en el servidor
import { Imagick } from 'imagick'; // "lo instalé a mano en el servidor"
```

---

### Factor III: Config (Configuración)

> Almacenar la configuración en el entorno, no en el código.

```javascript
// ✅ Bien: configuración desde variables de entorno
const config = {
  port: parseInt(process.env.PORT ?? "3000", 10),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV ?? "development",
};

// Validación al arrancar (fail fast)
const required = ["DATABASE_URL", "JWT_SECRET"];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Variable de entorno requerida: ${key}`);
    process.exit(1); // fallar temprano, no en medio de una request
  }
}

// ❌ Mal: configuración hardcodeada o en archivos commiteados
const DB_URL = "postgresql://admin:s3cr3t@prod-server:5432/eduflow";
```

```bash
# .env.example — siempre en el repo
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/eduflow
JWT_SECRET=change-me-in-production

# .env — NUNCA en el repo (en .gitignore)
# Contiene los valores reales del entorno
```

---

### Factor IV: Backing Services (Servicios de Apoyo)

> Tratar los servicios de apoyo como recursos adjuntos.

```javascript
// Un backing service es cualquier servicio que la app consume por red:
// bases de datos, caches, brokers de mensajes, APIs externas

// ✅ Bien: BD configurada como URL intercambiable
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// Puedo cambiar de localhost a RDS solo cambiando DATABASE_URL

// ✅ Bien: Redis como recurso adjunto
const redis = new Redis(process.env.REDIS_URL);

// La app no sabe si PostgreSQL está en localhost, en RDS o en otro contenedor
// Solo sabe la URL de conexión
```

---

### Factor V: Build, Release, Run

> Separar estrictamente las fases de build, release y ejecución.

```
Build:   npm run build / docker build
         → Produce el artefacto (imagen Docker)
         → Inmutable, con un hash único

Release: docker tag + configurar env vars
         → Combina el artefacto con la configuración del ambiente
         → Tiene un ID de release único

Run:     docker run / docker compose up
         → Ejecuta la release en el ambiente
```

```bash
# Pipeline típico de CI/CD que sigue este patrón:

# 1. Build (en CI, ej GitHub Actions)
docker build -t eduflow-api:abc123 .   # tag con commit SHA

# 2. Release (combinar imagen + config del ambiente)
docker tag eduflow-api:abc123 registry.io/eduflow-api:v1.5.2
docker push registry.io/eduflow-api:v1.5.2
# Las env vars las inyecta el orquestador (ECS, K8s, Compose)

# 3. Run (en el servidor/cluster)
docker compose up -d                   # inyecta .env automáticamente
```

---

### Factor VI: Processes (Procesos)

> Ejecutar la app como uno o más procesos sin estado.

```javascript
// ✅ Bien: sin estado en memoria entre requests
// El estado vive en el backing service (BD, Redis)

export const createSession = async (userId) => {
  const token = generateJWT(userId, process.env.JWT_SECRET);
  // Guardar sesión en Redis, no en memoria del proceso
  await redis.setex(`session:${token}`, 3600, userId);
  return token;
};

// ❌ Mal: estado en memoria (falla con múltiples instancias)
const activeSessions = new Map(); // si hay 3 instancias, hay 3 Maps separados

export const createSession = (userId) => {
  const token = generateJWT(userId);
  activeSessions.set(token, userId); // solo existe en ESTA instancia
  return token;
};
// Request 1 crea sesión en instancia A
// Request 2 va a instancia B → no encuentra la sesión → fallo
```

---

### Factor VII: Port Binding (Enlace de Puertos)

> Exportar servicios a través de port binding.

```javascript
// ✅ Bien: la app es autosuficiente, no depende de un web server externo
import express from "express";

const app = express();
// ... routes

// La app escucha en el puerto que le asigna el entorno
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`🚀 EduFlow API en puerto ${PORT}`);
});

// ❌ Mal: asumir que siempre es el puerto 3000
app.listen(3000);
// Falla si el orquestador asigna otro puerto
```

---

### Factor VIII: Concurrency (Concurrencia)

> Escalar mediante el modelo de procesos.

```
Escala vertical (scale up): máquina más grande
→ Límite físico, costoso, no siempre posible

Escala horizontal (scale out): más instancias del mismo proceso
→ Ilimitado, económico, cloud native

Docker Compose:
  docker compose up --scale api=3  # 3 instancias de la API
  # El load balancer distribuye el tráfico automáticamente

Kubernetes:
  kubectl scale deployment eduflow-api --replicas=5
```

---

### Factor IX: Disposability (Desechabilidad)

> Maximizar robustez con arranque rápido y cierre elegante.

```javascript
// Arranque rápido: la app debe estar lista en segundos
// Cierre elegante: terminar requests en curso antes de morir

const server = app.listen(PORT, () => {
  console.log(`🚀 EduFlow API lista en ${PORT}`);
});

// Graceful shutdown — Factor IX
const shutdown = async (signal) => {
  console.log(`🔄 Señal ${signal}: cerrando servidor...`);

  // 1. Dejar de aceptar nuevas conexiones
  server.close(async () => {
    // 2. Terminar requests en curso (hasta 30s)
    console.log("✅ Requests activos terminados");

    // 3. Cerrar conexiones a backing services
    await pool.end();
    console.log("✅ Pool de BD cerrado");

    process.exit(0);
  });

  // Forzar salida si tarda demasiado
  setTimeout(() => process.exit(1), 30_000);
};

process.on("SIGTERM", () => shutdown("SIGTERM")); // Docker: docker stop
process.on("SIGINT", () => shutdown("SIGINT")); // Dev: Ctrl+C
```

---

### Factor X: Dev/Prod Parity (Paridad Dev/Prod)

> Mantener dev, staging y producción lo más similares posible.

```yaml
# docker-compose.yml para desarrollo
# PostgreSQL 15-alpine, igual que producción

services:
  db:
    image: postgres:15-alpine # misma versión que en producción
    # ✅ Bien: misma BD en dev y prod

  # ❌ Mal: usar SQLite en dev, PostgreSQL en prod
  # (comportamientos de SQL diferentes, bugs invisibles en dev)
```

```javascript
// ❌ El antipatrón más común: adapters diferentes por ambiente
const getRepository = () => {
  if (process.env.NODE_ENV === "test") {
    return new InMemoryRepository(); // diferente de producción
  }
  return new PostgresRepository(); // el real
};
// Resultado: tests que pasan, producción que falla
```

---

### Factor XI: Logs (Registros)

> Tratar los logs como flujos de eventos.

```javascript
// ✅ Bien: escribir logs a stdout — el entorno decide qué hacer con ellos
console.log(
  JSON.stringify({
    timestamp: new Date().toISOString(),
    level: "info",
    message: "Curso creado",
    courseId: course.id,
    userId: req.user.id,
  }),
);

// ❌ Mal: escribir a archivos de log dentro del contenedor
const fs = await import("fs");
fs.appendFileSync("/var/log/eduflow.log", `${new Date()}: curso creado\n`);
// Los archivos se pierden cuando el contenedor muere
// No escala horizontalmente
```

```bash
# El entorno captura stdout y lo envía donde corresponda:
docker compose logs -f api              # ver logs localmente
# En producción: CloudWatch, Datadog, Elasticsearch, Loki
```

---

### Factor XII: Admin Processes (Procesos Administrativos)

> Ejecutar tareas administrativas como procesos puntuales.

```javascript
// scripts/migrate.js — ejecutar once, no parte del servidor
// ✅ Bien: migración separada del proceso principal

import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const migrations = [
  `CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id),
    student_id UUID NOT NULL,
    enrolled_at TIMESTAMPTZ DEFAULT NOW()
  )`,
];

for (const migration of migrations) {
  await pool.query(migration);
  console.log("✅ Migración aplicada");
}

await pool.end();
console.log("🎉 Migraciones completadas");
```

```bash
# Ejecutar migración en el contenedor de producción
docker compose exec api node scripts/migrate.js

# En Kubernetes:
kubectl exec deploy/eduflow-api -- node scripts/migrate.js

# En Lambda/Serverless:
# Función Lambda separada que solo corre migraciones
```

---

## 🏥 Health Checks en Producción

Los orquestadores (Docker, Kubernetes, ECS) necesitan saber si tu app está sana:

```javascript
// src/infrastructure/http/health-router.js

import { Router } from "express";

export const createHealthRouter = (pool) => {
  const router = Router();

  // Liveness: ¿sigue vivo el proceso?
  router.get("/health/live", (req, res) => {
    res.json({ status: "alive", timestamp: new Date().toISOString() });
  });

  // Readiness: ¿puede aceptar tráfico? (incluye deps)
  router.get("/health/ready", async (req, res) => {
    try {
      // Verificar conexión a la BD
      await pool.query("SELECT 1");

      res.json({
        status: "ready",
        database: "ok",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // 503 = no listo (K8s no enviará tráfico hasta que sea 200)
      res.status(503).json({
        status: "not_ready",
        database: "error",
        error: error.message,
      });
    }
  });

  return router;
};
```

```yaml
# docker-compose.yml — usando el health endpoint
services:
  api:
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/health/ready"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 15s # tiempo de gracia al arrancar
```

---

## 📊 Resumen: ¿Mi Aplicación es Cloud Native?

```javascript
// Lista de verificación rápida

const cloudNativeChecklist = {
  // Factor III: Config
  noHardcodedConfig: !codigo.includes("postgresql://admin:s3cr3t"),

  // Factor VI: Processes
  stateless: !usaMemoriaEntreRequests,

  // Factor IX: Disposability
  gracefulShutdown: escuchaSignterm,

  // Health checks
  healthEndpoint: tieneEndpointHealth,

  // Factor XI: Logs
  logsAStdout: !escribeAArchivos,

  // Factor X: Dev/Prod parity
  mismaBdEnTodosLosAmbientes: !usaSqliteEnDev,
};

const isCloudNative = Object.values(cloudNativeChecklist).every(Boolean);
console.log(`¿Cloud Native? ${isCloudNative ? "✅" : "❌ Pendiente"}`);
```

---

## 🔗 Navegación

| ← Anterior                                      | Semana Siguiente →                                              |
| ----------------------------------------------- | --------------------------------------------------------------- |
| [03 — Serverless y FaaS](03-serverless-faas.md) | [Semana 08: Seguridad en Arquitectura](../../week-08-seguridad-arquitectura/README.md) |
