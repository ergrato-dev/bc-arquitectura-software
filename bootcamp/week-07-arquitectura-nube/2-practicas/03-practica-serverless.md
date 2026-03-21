# 💻 Práctica 03: Funciones Serverless con Node.js

> **Objetivo**: Comprender el modelo serverless construyendo funciones puras (handlers) que pueden deployarse a AWS Lambda, Vercel o ejecutarse localmente. Comparar el ciclo de vida con un servidor HTTP tradicional.

**Tiempo estimado**: 40 minutos

---

## 🧰 Configuración Inicial

```bash
# Crear directorio para esta práctica
mkdir eduflow-serverless && cd eduflow-serverless

# Inicializar proyecto
pnpm init

# Configurar como módulo ES
# Editar package.json para agregar "type":"module"
```

```json
// package.json
{
  "name": "eduflow-serverless",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server-local.js",
    "test": "node --test tests/"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

---

## Concepto Clave: La Diferencia Fundamental

### Servidor HTTP Tradicional (Express)

```javascript
// server-traditional.js — ciclo de vida de un servidor tradicional
import express from "express";

const app = express();
app.use(express.json());

// El servidor se inicia UNA vez y vive indefinidamente
// Cada request es manejado por el mismo proceso en memoria

// Esto se ejecuta al iniciar (una sola vez):
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
console.log("🗄️  Pool de BD inicializado");

// Este handler se ejecuta en CADA request:
app.get("/api/courses", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM courses");
  res.json(rows);
});

// El proceso queda bloqueando aquí, esperando requests
app.listen(3000, () => {
  console.log("🚀 Servidor listo. Esperando requests...");
});

// Ciclo de vida:
// Inicio → [request 1] → [request 2] → ... → [request N] → Fin (manual)
```

### Función Serverless (FaaS)

```javascript
// handler.js — ciclo de vida de una función serverless

// Este código se ejecuta al "enfriar" el container (cold start)
// Puede reutilizarse si el container está "caliente"
console.log("⚙️  Inicializando módulo (puede ser cold start)");
let requestCount = 0; // persiste entre invocaciones en mismo container caliente

// Esta función se ejecuta en CADA invocación del evento
// No hay servidor que "espera" — solo existe mientras ejecuta
export const handler = async (event, context) => {
  requestCount++;

  // "event" contiene toda la información del request
  const { httpMethod, path, queryStringParameters, body } = event;

  console.log(`Invocación #${requestCount}: ${httpMethod} ${path}`);

  // La función retorna la respuesta completa (no usa res.json())
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Hola desde serverless",
      method: httpMethod,
      path,
      invocation: requestCount,
    }),
  };
};

// Ciclo de vida:
// Evento → handler() → retorna respuesta → (puede terminar o quedarse caliente)
```

---

## Parte 1: Handlers Serverless para EduFlow

### Handler de Cursos

```javascript
// src/handlers/courses.js
// Función serverless para manejar operaciones de cursos

// Simular "base de datos" en memoria para esta práctica
// En producción: usar DynamoDB, RDS, o Firestore
const courses = [
  {
    id: "1",
    title: "Arquitectura de Software",
    description: "Fundamentos y patrones",
    active: true,
    createdAt: new Date("2025-01-01").toISOString(),
  },
  {
    id: "2",
    title: "Docker y Cloud Native",
    description: "12-factor app, contenedores",
    active: true,
    createdAt: new Date("2025-01-15").toISOString(),
  },
];

// Utilidad para construir respuestas HTTP estandarizadas
const createResponse = (statusCode, body, headers = {}) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // CORS básico
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    ...headers,
  },
  body: JSON.stringify(body),
});

// Utilidad para extraer y validar el body
const parseBody = (event) => {
  if (!event.body) return {};
  try {
    return typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  } catch {
    return null;
  }
};

// Handler principal: decide qué operación ejecutar según el evento
export const handler = async (event) => {
  const { httpMethod, pathParameters, queryStringParameters } = event;

  // Pre-flight CORS
  if (httpMethod === "OPTIONS") {
    return createResponse(204, {});
  }

  try {
    // GET /courses — listar todos
    if (httpMethod === "GET" && !pathParameters?.id) {
      return handleListCourses(queryStringParameters);
    }

    // GET /courses/{id} — obtener uno
    if (httpMethod === "GET" && pathParameters?.id) {
      return handleGetCourse(pathParameters.id);
    }

    // POST /courses — crear
    if (httpMethod === "POST") {
      return handleCreateCourse(event);
    }

    return createResponse(405, { error: "Método no permitido" });
  } catch (error) {
    console.error("Error en handler de cursos:", error);
    return createResponse(500, { error: "Error interno del servidor" });
  }
};

const handleListCourses = (queryParams) => {
  let result = [...courses];

  // Filtro por estado activo
  if (queryParams?.active !== undefined) {
    const active = queryParams.active === "true";
    result = result.filter((c) => c.active === active);
  }

  return createResponse(200, {
    courses: result,
    total: result.length,
  });
};

const handleGetCourse = (id) => {
  const course = courses.find((c) => c.id === id);
  if (!course) {
    return createResponse(404, { error: "Curso no encontrado" });
  }
  return createResponse(200, course);
};

const handleCreateCourse = (event) => {
  const body = parseBody(event);

  if (body === null) {
    return createResponse(400, { error: "Body JSON inválido" });
  }

  const { title, description } = body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return createResponse(400, {
      error: "El título es requerido y debe ser un string no vacío",
    });
  }

  const course = {
    id: String(Date.now()), // En producción: uuid o ID de la BD
    title: title.trim(),
    description: description?.trim() ?? null,
    active: true,
    createdAt: new Date().toISOString(),
  };

  courses.push(course);

  return createResponse(201, course);
};
```

---

## Parte 2: Tests Unitarios del Handler

Una ventaja clave de los handlers serverless: son funciones puras, fáciles de testear sin HTTP.

```javascript
// tests/courses-handler.test.js
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { handler } from "../src/handlers/courses.js";

// Utilidad: crear eventos Lambda de prueba
const createEvent = (httpMethod, path, options = {}) => ({
  httpMethod,
  path,
  pathParameters: options.pathParameters ?? null,
  queryStringParameters: options.queryStringParameters ?? null,
  body: options.body ? JSON.stringify(options.body) : null,
  headers: options.headers ?? {},
});

describe("Courses Handler", () => {
  it("GET /courses - retorna lista de cursos", async () => {
    const event = createEvent("GET", "/courses");
    const response = await handler(event);

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.ok(Array.isArray(body.courses), "courses debe ser array");
    assert.ok(body.courses.length > 0, "debe retornar al menos un curso");
    assert.ok(typeof body.total === "number", "total debe ser number");
  });

  it("GET /courses/{id} - retorna un curso existente", async () => {
    const event = createEvent("GET", "/courses/1", {
      pathParameters: { id: "1" },
    });
    const response = await handler(event);

    assert.equal(response.statusCode, 200);
    const course = JSON.parse(response.body);
    assert.equal(course.id, "1");
    assert.ok(course.title, "debe tener título");
  });

  it("GET /courses/{id} - retorna 404 para curso inexistente", async () => {
    const event = createEvent("GET", "/courses/no-existe", {
      pathParameters: { id: "no-existe" },
    });
    const response = await handler(event);

    assert.equal(response.statusCode, 404);
    const body = JSON.parse(response.body);
    assert.ok(body.error, "debe incluir mensaje de error");
  });

  it("POST /courses - crea un nuevo curso válido", async () => {
    const event = createEvent("POST", "/courses", {
      body: { title: "Nuevo Curso", description: "Descripción de prueba" },
    });
    const response = await handler(event);

    assert.equal(response.statusCode, 201);
    const course = JSON.parse(response.body);
    assert.equal(course.title, "Nuevo Curso");
    assert.ok(course.id, "debe tener id asignado");
    assert.ok(course.createdAt, "debe tener timestamp");
  });

  it("POST /courses - rechaza curso sin título", async () => {
    const event = createEvent("POST", "/courses", {
      body: { description: "Sin título" },
    });
    const response = await handler(event);

    assert.equal(response.statusCode, 400);
    const body = JSON.parse(response.body);
    assert.ok(body.error, "debe incluir mensaje de error de validación");
  });

  it("POST /courses - rechaza título vacío", async () => {
    const event = createEvent("POST", "/courses", {
      body: { title: "   " },
    });
    const response = await handler(event);

    assert.equal(response.statusCode, 400);
  });

  it("Método no soportado retorna 405", async () => {
    const event = createEvent("DELETE", "/courses");
    const response = await handler(event);

    assert.equal(response.statusCode, 405);
  });
});
```

Ejecutar tests:

```bash
pnpm test

# Resultado esperado:
# ✔ GET /courses - retorna lista de cursos (Xms)
# ✔ GET /courses/{id} - retorna un curso existente
# ✔ GET /courses/{id} - retorna 404 para curso inexistente
# ✔ POST /courses - crea un nuevo curso válido
# ✔ POST /courses - rechaza curso sin título
# ✔ POST /courses - rechaza título vacío
# ✔ Método no soportado retorna 405
# ℹ tests 7, pass 7, fail 0
```

---

## Parte 3: Servidor Local que Simula el Entorno FaaS

```javascript
// server-local.js — simula el comportamiento de Lambda/API Gateway localmente
// Solo para desarrollo, no es parte del deploy real

import express from "express";
import { handler as coursesHandler } from "./src/handlers/courses.js";

const app = express();
app.use(express.json());

// Adaptador: convierte request Express → formato evento Lambda
const toEvent = (req) => ({
  httpMethod: req.method,
  path: req.path,
  pathParameters: Object.keys(req.params).length > 0 ? req.params : null,
  queryStringParameters: Object.keys(req.query).length > 0 ? req.query : null,
  headers: req.headers,
  body: req.body ? JSON.stringify(req.body) : null,
});

// Adaptador: convierte respuesta Lambda → respuesta Express
const sendLambdaResponse = (res, lambdaResponse) => {
  res
    .status(lambdaResponse.statusCode)
    .set(lambdaResponse.headers ?? {})
    .send(lambdaResponse.body);
};

// Ruteo con el mismo patrón que API Gateway
app.all("/courses", async (req, res) => {
  const event = toEvent(req);
  const response = await coursesHandler(event);
  sendLambdaResponse(res, response);
});

app.all("/courses/:id", async (req, res) => {
  const event = toEvent(req);
  const response = await coursesHandler(event);
  sendLambdaResponse(res, response);
});

// Middleware de logging (simula CloudWatch Logs)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        durationMs: Date.now() - start,
      }),
    );
  });
  next();
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`🔬 Simulador FaaS corriendo en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   GET  http://localhost:${PORT}/courses`);
  console.log(`   GET  http://localhost:${PORT}/courses/:id`);
  console.log(`   POST http://localhost:${PORT}/courses`);
});
```

Probar:

```bash
# Iniciar el simulador
pnpm start

# En otra terminal:
curl http://localhost:3001/courses
curl http://localhost:3001/courses/1
curl -X POST http://localhost:3001/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"Seguridad en Arquitectura"}'
```

---

## Parte 4: Reflexión — Comparativa Final

```javascript
// Tabla comparativa de ciclos de vida

const comparativa = {
  inicializacion: {
    servidor: 'Una vez al arrancar (process.on startup) → persiste`,
    serverless: 'Al primer request tras inactividad (cold start) → puede destruirse',
  },
  'pool-bd': {
    servidor: 'Inicializado una vez, reutilizado siempre',
    serverless: 'Inicializado fuera del handler → reutilizado si container caliente',
  },
  estado: {
    servidor: 'Puede mantener estado en memoria (cuidado: no escala)',
    serverless: 'Sin estado garantizado entre invocaciones de diferentes instancias',
  },
  escalabilidad: {
    servidor: 'Manual: escala vertical (más RAM) o horizontal (más instancias)',
    serverless: 'Automática: el proveedor lanza N instancias según demanda',
  },
  costo: {
    servidor: 'Fijo: pagas aunque no haya requests',
    serverless: 'Variable: pagas exactamente lo que ejecutas',
  },
  debugging: {
    servidor: 'Fácil: attach debugger, logs locales, estado inspectable',
    serverless: 'Difícil: logs en CloudWatch, cold starts, estado efímero',
  },
};
```

---

## ✅ Checklist de Validación

- [ ] `pnpm test` pasa los 7 tests sin errores
- [ ] `pnpm start` inicia el simulador FaaS en puerto 3001
- [ ] `GET /courses` retorna JSON con lista de cursos
- [ ] `POST /courses` sin título retorna 400 con mensaje de error
- [ ] `POST /courses` con título válido retorna 201 con el nuevo curso
- [ ] La función `handler` no usa `app.listen()` ni referencias a Express

---

## 💡 Para Reflexionar

1. ¿Por qué los handlers serverless son más fáciles de testear que los endpoints de Express?
2. ¿Qué problemas surgirían si guardas estado en variables del módulo en un handler serverless?
3. Si EduFlow procesa 10M requests/mes con un Lambda de 256MB y 100ms de duración promedio, ¿cuánto pagarías en AWS?
4. ¿Cuándo elegirías EduFlow como servicio Docker (Práctica 02) vs serverless?

---

## 🔗 Siguiente Paso

[Proyecto Integrador → EduFlow Cloud: Despliegue Completo](../3-proyecto/proyecto-semana-07.md)
