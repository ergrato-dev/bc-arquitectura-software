# 🎯 Reto Semana 07: EduFlow Cloud — "En mi máquina funciona"

> _"El primer paso hacia la nube no es mover código — es empaquetar correctamente lo que ya tienes."_

---

## 📖 Contexto

El equipo de **EduFlow** ha avanzado significativamente:

- **Semana 04**: API REST con Express.js
- **Semana 05**: Patrones de diseño GoF aplicados
- **Semana 06**: Arquitectura Hexagonal — dominio desacoplado de infraestructura

Ahora el CTO tiene una queja recurrente del equipo de operaciones:

> _"Cada vez que un desarrollador nuevo entra al proyecto, tarda dos días configurando el entorno. El frontend dice que la API les funciona en Windows pero no en su Mac. Y el equipo de testing tiene una versión diferente de PostgreSQL."_
>
> — Carlos Mendoza, CTO EduFlow

**El clásico problema**: funciona en mi máquina ✅, falla en producción ❌.

---

## 🚩 El Problema

El código actual de EduFlow vive en un repositorio pero **no tiene instrucciones de despliegue estandarizadas**. Cada vez que alguien quiere ejecutar el proyecto:

1. Instala Node.js (¿qué versión?)
2. Instala PostgreSQL (¿qué versión?)
3. Configura variables de entorno manualmente
4. Ejecuta migraciones (¿cómo?)
5. Arranca el servidor (¿qué puerto?)

Esto genera inconsistencias, errores difíciles de reproducir y fricción en el equipo.

---

## 🎯 Tu Misión

Containerizar EduFlow completo con Docker y Docker Compose para que **cualquier persona** pueda levantar el stack completo con un solo comando:

```bash
docker compose up
```

### Código Base para Containerizar

```javascript
// server.js — EduFlow API actual (resultado de semana 06)
// Arquitectura hexagonal: Express solo en la capa de infraestructura

import express from "express";
import { CourseRouter } from "./src/infrastructure/http/course-router.js";
import { EnrollmentRouter } from "./src/infrastructure/http/enrollment-router.js";
import { PostgresCourseRepository } from "./src/infrastructure/persistence/postgres-course-repository.js";
import { PostgresEnrollmentRepository } from "./src/infrastructure/persistence/postgres-enrollment-repository.js";
import { CourseApplicationService } from "./src/application/course-application-service.js";
import { EnrollmentApplicationService } from "./src/application/enrollment-application-service.js";

// Configuración desde variables de entorno (12-factor app: factor III)
const PORT = process.env.PORT ?? 3000;
const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  console.error("❌ DATABASE_URL no definida");
  process.exit(1);
}

// Composición de dependencias en el punto de entrada
const courseRepo = new PostgresCourseRepository(DB_URL);
const enrollmentRepo = new PostgresEnrollmentRepository(DB_URL);
const courseService = new CourseApplicationService(courseRepo);
const enrollmentService = new EnrollmentApplicationService(
  enrollmentRepo,
  courseRepo,
);

const app = express();
app.use(express.json());

// Health check — requerido para orquestadores
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/courses", CourseRouter(courseService));
app.use("/api/enrollments", EnrollmentRouter(enrollmentService));

app.listen(PORT, () => {
  console.log(`🚀 EduFlow API corriendo en puerto ${PORT}`);
});
```

```json
// package.json actual
{
  "name": "eduflow-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js",
    "migrate": "node scripts/migrate.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0"
  }
}
```

---

## 📋 Requisitos del Reto

### 🔴 Obligatorios

- [ ] **Dockerfile válido** para la API de EduFlow
  - Imagen base: `node:20-alpine`
  - Usuario no-root (no ejecutar como `root`)
  - `.dockerignore` que excluya `node_modules`, `.env`, logs
  - `HEALTHCHECK` configurado
  - Puerto expuesto con `EXPOSE`

- [ ] **`docker-compose.yml`** con al menos 2 servicios:
  - `api` — la aplicación EduFlow
  - `db` — PostgreSQL 15
  - Variables de entorno desde un archivo `.env`
  - Volumen persistente para la base de datos
  - Health check que `api` espere a que `db` esté lista (`depends_on` con condición)

- [ ] **Archivo `.env.example`** con todas las variables necesarias documentadas (sin valores reales)

- [ ] **`docker compose up`** levanta el stack completo sin errores

### 🟡 Opcionales (para nota extra)

- [ ] **Multi-stage build** en el Dockerfile (deps → production)
- [ ] **pgAdmin** como tercer servicio en docker-compose
- [ ] **`docker-compose.prod.yml`** con configuración para producción (sin bind mounts, imagen final optimizada)
- [ ] Variables de entorno separadas para `dev` y `prod`

---

## 📁 Estructura de Entregables Esperada

```
eduflow-docker/
├── Dockerfile                  # Imagen multi-stage para la API
├── .dockerignore               # Archivos a excluir del contexto
├── docker-compose.yml          # Stack completo: api + db
├── .env.example                # Variables requeridas (sin secrets reales)
├── .env                        # ⚠️ NO pushear al repo
├── package.json
├── server.js
└── src/
    └── ... (estructura hexagonal semana 06)
```

---

## ✅ Criterios de Éxito

```bash
# El evaluador ejecutará estos comandos en su máquina (sin ninguna config previa)

git clone <tu-repo>
cd eduflow-docker
cp .env.example .env         # Solo ajustar passwords si se desea
docker compose up --build

# Resultado esperado:
# ✅ db: PostgreSQL 15 corriendo en puerto 5432
# ✅ api: EduFlow corriendo en puerto 3000
# ✅ GET http://localhost:3000/health → {"status":"ok",...}
# ✅ POST http://localhost:3000/api/courses → crea un curso
# ✅ Los datos persisten tras docker compose down && docker compose up
```

---

## 🧠 Preguntas para Reflexionar

Al finalizar el reto, responde brevemente en tu README:

1. ¿Por qué usamos `node:20-alpine` y no `node:20`? ¿Qué diferencia de tamaño hay?
2. ¿Qué problema resuelve el multi-stage build en producción?
3. ¿Por qué el archivo `.env` NO debe subirse al repositorio?
4. ¿Qué ventaja tiene usar `HEALTHCHECK` en el Dockerfile?
5. ¿En qué modelo de servicio cloud desplegarías este stack? ¿IaaS, PaaS o SaaS?

---

## 📅 Entrega

| Elemento        | Descripción                                           |
| --------------- | ----------------------------------------------------- |
| **Repositorio** | GitHub público con el código                          |
| **README**      | Instrucciones para ejecutar con Docker                |
| **Evidencia**   | Captura de pantalla del `docker compose up` corriendo |
| **Reflexiones** | 5 respuestas en el README                             |

---

## 🔗 Recursos de Apoyo

- [Teoria 02: Docker y Contenedores](1-teoria/02-docker-contenedores.md)
- [Practica 01: Dockerfile para Node.js](2-practicas/01-practica-dockerfile.md)
- [Practica 02: Docker Compose multi-servicio](2-practicas/02-practica-docker-compose.md)
- [Documentación oficial Docker](https://docs.docker.com/)
