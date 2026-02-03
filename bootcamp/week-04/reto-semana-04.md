# 🎯 Reto Semana 04: API para Sistema de Gestión TaskFlow

## 🏢 Contexto del Reto

**TaskFlow** es una startup que necesita desarrollar su API para un sistema de gestión de tareas colaborativo. El equipo anterior dejó un prototipo básico, pero no cumple con estándares profesionales.

Tu misión es diseñar e implementar una API RESTful profesional que:

- Siga las mejores prácticas de diseño REST
- Tenga documentación completa con OpenAPI/Swagger
- Sea escalable y mantenible
- Permita comunicación tanto síncrona como asíncrona

---

## 📋 Requisitos del Sistema

### Entidades del Dominio

```
┌─────────────────────────────────────────────────────────────┐
│                    DOMINIO TASKFLOW                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────┐      ┌──────────┐      ┌──────────┐        │
│   │   User   │──────│  Project │──────│   Task   │        │
│   └──────────┘      └──────────┘      └──────────┘        │
│   - id              - id              - id                 │
│   - name            - name            - title              │
│   - email           - description     - description        │
│   - role            - owner (User)    - status             │
│                     - createdAt       - priority           │
│                                       - assignee (User)    │
│                                       - project (Project)  │
│                                       - dueDate            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Funcionalidades Requeridas

| Recurso      | Operaciones    | Descripción                     |
| ------------ | -------------- | ------------------------------- |
| **Users**    | CRUD           | Gestión de usuarios del sistema |
| **Projects** | CRUD           | Proyectos que agrupan tareas    |
| **Tasks**    | CRUD + Filtros | Tareas con asignación y estados |

---

## 🛠️ Código Inicial (El Problema)

El equipo anterior dejó este código monolítico sin estructura:

```javascript
// ❌ CÓDIGO PROBLEMÁTICO - server-legacy.js
// Todo está mezclado en un solo archivo sin estructura

import express from 'express';
const app = express();
app.use(express.json());

// Base de datos en memoria (todo mezclado)
let data = {
  users: [
    { id: 1, name: 'Ana García', email: 'ana@taskflow.com', role: 'admin' },
  ],
  projects: [
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Rediseño del sitio web',
      ownerId: 1,
    },
  ],
  tasks: [
    {
      id: 1,
      title: 'Crear mockups',
      description: 'Diseñar mockups en Figma',
      status: 'pending',
      priority: 'high',
      assigneeId: 1,
      projectId: 1,
    },
  ],
};

// ❌ Endpoints mal diseñados
app.get('/getUsers', (req, res) => {
  res.send(data.users);
});

app.get('/getUser', (req, res) => {
  const user = data.users.find((u) => u.id == req.query.id);
  res.send(user || 'No encontrado');
});

app.post('/createUser', (req, res) => {
  const newUser = { id: Date.now(), ...req.body };
  data.users.push(newUser);
  res.send('Usuario creado');
});

app.post('/deleteUser', (req, res) => {
  data.users = data.users.filter((u) => u.id != req.body.id);
  res.send('Eliminado');
});

// ❌ Tareas sin validación ni estructura
app.get('/getTasks', (req, res) => {
  res.send(data.tasks);
});

app.post('/addTask', (req, res) => {
  data.tasks.push({ id: Date.now(), ...req.body });
  res.send('OK');
});

app.post('/changeTaskStatus', (req, res) => {
  const task = data.tasks.find((t) => t.id == req.body.taskId);
  if (task) {
    task.status = req.body.newStatus;
    res.send('Actualizado');
  } else {
    res.send('No existe');
  }
});

// ❌ Sin manejo de errores, sin documentación
app.listen(3000, () => console.log('Server running'));
```

### Problemas Identificados

| Problema                     | Impacto                                      |
| ---------------------------- | -------------------------------------------- |
| Verbos HTTP incorrectos      | `/getUsers` debería ser `GET /users`         |
| POST para eliminar           | `/deleteUser` debería usar DELETE            |
| Parámetros en query para IDs | Debería usar path params `/users/:id`        |
| Respuestas inconsistentes    | `'OK'`, `'Eliminado'`, objetos - sin formato |
| Sin códigos de estado        | Todo retorna 200 incluso en errores          |
| Sin validación               | Acepta cualquier dato sin validar            |
| Sin documentación            | Imposible saber qué endpoints existen        |
| Sin estructura               | Todo en un archivo, sin separación           |

---

## 🎯 Tu Misión

### Fase 1: Diseño de Componentes (30 min)

Crea un **diagrama de componentes** que muestre:

```
┌─────────────────────────────────────────────────────────────┐
│                    API TASKFLOW                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │               CAPA DE PRESENTACIÓN                   │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐      │   │
│  │  │   Routes   │ │ Middleware │ │ Validators │      │   │
│  │  └────────────┘ └────────────┘ └────────────┘      │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │               CAPA DE NEGOCIO                        │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐      │   │
│  │  │UserService │ │ProjectSvc  │ │ TaskService│      │   │
│  │  └────────────┘ └────────────┘ └────────────┘      │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │               CAPA DE DATOS                          │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐      │   │
│  │  │ UserRepo   │ │ProjectRepo │ │ TaskRepo   │      │   │
│  │  └────────────┘ └────────────┘ └────────────┘      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Entregable**: `docs/diagrama-componentes.svg`

---

### Fase 2: Diseño de API REST (30 min)

Diseña los endpoints siguiendo REST:

#### Endpoints de Users

| Método | Endpoint            | Descripción        | Request Body             | Response           |
| ------ | ------------------- | ------------------ | ------------------------ | ------------------ |
| GET    | `/api/v1/users`     | Listar usuarios    | -                        | `200: [User]`      |
| GET    | `/api/v1/users/:id` | Obtener usuario    | -                        | `200: User`, `404` |
| POST   | `/api/v1/users`     | Crear usuario      | `{name, email, role}`    | `201: User`        |
| PUT    | `/api/v1/users/:id` | Actualizar usuario | `{name?, email?, role?}` | `200: User`, `404` |
| DELETE | `/api/v1/users/:id` | Eliminar usuario   | -                        | `204`, `404`       |

#### Endpoints de Projects

| Método | Endpoint                     | Descripción         | Request Body                   | Response              |
| ------ | ---------------------------- | ------------------- | ------------------------------ | --------------------- |
| GET    | `/api/v1/projects`           | Listar proyectos    | -                              | `200: [Project]`      |
| GET    | `/api/v1/projects/:id`       | Obtener proyecto    | -                              | `200: Project`, `404` |
| POST   | `/api/v1/projects`           | Crear proyecto      | `{name, description, ownerId}` | `201: Project`        |
| PUT    | `/api/v1/projects/:id`       | Actualizar proyecto | `{name?, description?}`        | `200: Project`        |
| DELETE | `/api/v1/projects/:id`       | Eliminar proyecto   | -                              | `204`, `404`          |
| GET    | `/api/v1/projects/:id/tasks` | Tareas del proyecto | -                              | `200: [Task]`         |

#### Endpoints de Tasks

| Método | Endpoint                   | Descripción      | Request Body                | Response           |
| ------ | -------------------------- | ---------------- | --------------------------- | ------------------ |
| GET    | `/api/v1/tasks`            | Listar tareas    | Query: `?status=&priority=` | `200: [Task]`      |
| GET    | `/api/v1/tasks/:id`        | Obtener tarea    | -                           | `200: Task`, `404` |
| POST   | `/api/v1/tasks`            | Crear tarea      | `{title, projectId, ...}`   | `201: Task`        |
| PUT    | `/api/v1/tasks/:id`        | Actualizar tarea | `{title?, status?, ...}`    | `200: Task`        |
| PATCH  | `/api/v1/tasks/:id/status` | Cambiar estado   | `{status}`                  | `200: Task`        |
| DELETE | `/api/v1/tasks/:id`        | Eliminar tarea   | -                           | `204`, `404`       |

**Entregable**: Documentado en `docs/openapi.yaml`

---

### Fase 3: Implementación (60 min)

#### Estructura de Carpetas Requerida

```
taskflow-api/
├── package.json
├── src/
│   ├── index.js                 # Punto de entrada
│   ├── app.js                   # Configuración de Express
│   ├── routes/
│   │   ├── index.js             # Router principal
│   │   ├── user-routes.js
│   │   ├── project-routes.js
│   │   └── task-routes.js
│   ├── controllers/
│   │   ├── user-controller.js
│   │   ├── project-controller.js
│   │   └── task-controller.js
│   ├── services/
│   │   ├── user-service.js
│   │   ├── project-service.js
│   │   └── task-service.js
│   ├── repositories/
│   │   ├── user-repository.js
│   │   ├── project-repository.js
│   │   └── task-repository.js
│   ├── models/
│   │   ├── user.js
│   │   ├── project.js
│   │   └── task.js
│   ├── middleware/
│   │   ├── error-handler.js
│   │   └── validator.js
│   └── utils/
│       └── response.js          # Helper para respuestas
├── docs/
│   ├── openapi.yaml
│   └── diagrama-componentes.svg
└── README.md
```

#### Código de Referencia

**src/index.js**

```javascript
// Punto de entrada de la aplicación
import app from './app.js';

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`🚀 TaskFlow API corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación en http://localhost:${PORT}/api-docs`);
});
```

**src/app.js**

```javascript
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();

// Middleware
app.use(express.json());

// Documentación Swagger
const swaggerDocument = YAML.load('./docs/openapi.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas
app.use('/api/v1', routes);

// Manejo de errores
app.use(errorHandler);

export default app;
```

**src/utils/response.js**

```javascript
// Helper para respuestas consistentes
export const successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

export const errorResponse = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
    },
  });
};

export const createdResponse = (res, data) => {
  return successResponse(res, data, 201);
};

export const noContentResponse = (res) => {
  return res.status(204).send();
};
```

**src/controllers/task-controller.js** (ejemplo)

```javascript
import * as taskService from '../services/task-service.js';
import {
  successResponse,
  createdResponse,
  noContentResponse,
  errorResponse,
} from '../utils/response.js';

export const getAllTasks = (req, res) => {
  const { status, priority, projectId } = req.query;
  const filters = { status, priority, projectId };

  const tasks = taskService.findAll(filters);
  return successResponse(res, tasks);
};

export const getTaskById = (req, res) => {
  const { id } = req.params;
  const task = taskService.findById(Number(id));

  if (!task) {
    return errorResponse(res, 'Tarea no encontrada', 404);
  }

  return successResponse(res, task);
};

export const createTask = (req, res) => {
  const taskData = req.body;

  // Validación básica
  if (!taskData.title || !taskData.projectId) {
    return errorResponse(res, 'Título y projectId son requeridos', 400);
  }

  const newTask = taskService.create(taskData);
  return createdResponse(res, newTask);
};

export const updateTask = (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedTask = taskService.update(Number(id), updates);

  if (!updatedTask) {
    return errorResponse(res, 'Tarea no encontrada', 404);
  }

  return successResponse(res, updatedTask);
};

export const updateTaskStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return errorResponse(
      res,
      `Estado inválido. Valores permitidos: ${validStatuses.join(', ')}`,
      400,
    );
  }

  const updatedTask = taskService.updateStatus(Number(id), status);

  if (!updatedTask) {
    return errorResponse(res, 'Tarea no encontrada', 404);
  }

  return successResponse(res, updatedTask);
};

export const deleteTask = (req, res) => {
  const { id } = req.params;
  const deleted = taskService.remove(Number(id));

  if (!deleted) {
    return errorResponse(res, 'Tarea no encontrada', 404);
  }

  return noContentResponse(res);
};
```

---

### Fase 4: Documentación OpenAPI (30 min)

**docs/openapi.yaml** (fragmento)

```yaml
openapi: 3.0.3
info:
  title: TaskFlow API
  description: API RESTful para gestión de tareas colaborativas
  version: 1.0.0
  contact:
    name: Soporte TaskFlow
    email: soporte@taskflow.com

servers:
  - url: http://localhost:3000/api/v1
    description: Servidor de desarrollo

tags:
  - name: Users
    description: Gestión de usuarios
  - name: Projects
    description: Gestión de proyectos
  - name: Tasks
    description: Gestión de tareas

paths:
  /tasks:
    get:
      tags:
        - Tasks
      summary: Listar todas las tareas
      description: Obtiene una lista de tareas con filtros opcionales
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [pending, in-progress, completed, cancelled]
          description: Filtrar por estado
        - name: priority
          in: query
          schema:
            type: string
            enum: [low, medium, high, critical]
          description: Filtrar por prioridad
        - name: projectId
          in: query
          schema:
            type: integer
          description: Filtrar por proyecto
      responses:
        '200':
          description: Lista de tareas
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Task'
    post:
      tags:
        - Tasks
      summary: Crear una nueva tarea
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TaskCreate'
      responses:
        '201':
          description: Tarea creada exitosamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    $ref: '#/components/schemas/Task'
        '400':
          description: Datos inválidos
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /tasks/{id}:
    get:
      tags:
        - Tasks
      summary: Obtener una tarea por ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Tarea encontrada
        '404':
          description: Tarea no encontrada

  /tasks/{id}/status:
    patch:
      tags:
        - Tasks
      summary: Actualizar estado de una tarea
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                status:
                  type: string
                  enum: [pending, in-progress, completed, cancelled]
              required:
                - status
      responses:
        '200':
          description: Estado actualizado
        '400':
          description: Estado inválido
        '404':
          description: Tarea no encontrada

components:
  schemas:
    Task:
      type: object
      properties:
        id:
          type: integer
          example: 1
        title:
          type: string
          example: 'Crear mockups'
        description:
          type: string
          example: 'Diseñar mockups en Figma'
        status:
          type: string
          enum: [pending, in-progress, completed, cancelled]
          example: 'pending'
        priority:
          type: string
          enum: [low, medium, high, critical]
          example: 'high'
        assigneeId:
          type: integer
          example: 1
        projectId:
          type: integer
          example: 1
        dueDate:
          type: string
          format: date
          example: '2026-02-15'
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    TaskCreate:
      type: object
      required:
        - title
        - projectId
      properties:
        title:
          type: string
        description:
          type: string
        priority:
          type: string
          enum: [low, medium, high, critical]
          default: medium
        assigneeId:
          type: integer
        projectId:
          type: integer
        dueDate:
          type: string
          format: date

    Error:
      type: object
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          properties:
            message:
              type: string
            statusCode:
              type: integer
```

---

## 🌟 Bonus: Comunicación Asíncrona

Implementa un sistema de eventos para notificaciones:

```javascript
// src/events/event-emitter.js
import { EventEmitter } from 'events';

class TaskEventEmitter extends EventEmitter {}

export const taskEvents = new TaskEventEmitter();

// Eventos disponibles
export const TASK_EVENTS = {
  CREATED: 'task:created',
  UPDATED: 'task:updated',
  STATUS_CHANGED: 'task:status-changed',
  ASSIGNED: 'task:assigned',
  DELETED: 'task:deleted',
};
```

```javascript
// src/services/task-service.js - con eventos
import { taskEvents, TASK_EVENTS } from '../events/event-emitter.js';

export const create = (taskData) => {
  const newTask = taskRepository.create(taskData);

  // Emitir evento de forma asíncrona
  taskEvents.emit(TASK_EVENTS.CREATED, newTask);

  return newTask;
};

export const updateStatus = (id, status) => {
  const task = taskRepository.updateStatus(id, status);

  if (task) {
    taskEvents.emit(TASK_EVENTS.STATUS_CHANGED, {
      task,
      previousStatus: task.status,
      newStatus: status,
    });
  }

  return task;
};
```

```javascript
// src/events/handlers/notification-handler.js
import { taskEvents, TASK_EVENTS } from '../event-emitter.js';

// Suscriptor para notificaciones
taskEvents.on(TASK_EVENTS.CREATED, (task) => {
  console.log(`📧 Notificación: Nueva tarea creada - "${task.title}"`);
  // Aquí iría la lógica de envío de email/push notification
});

taskEvents.on(TASK_EVENTS.STATUS_CHANGED, ({ task, newStatus }) => {
  console.log(`📧 Notificación: Tarea "${task.title}" cambió a ${newStatus}`);
});

taskEvents.on(TASK_EVENTS.ASSIGNED, ({ task, assignee }) => {
  console.log(
    `📧 Notificación: Tarea "${task.title}" asignada a ${assignee.name}`,
  );
});
```

---

## 📋 Criterios de Evaluación

| Criterio                                      | Puntos    |
| --------------------------------------------- | --------- |
| Diagrama de componentes completo              | 15        |
| Diseño REST correcto (verbos, rutas, códigos) | 20        |
| Implementación funcional                      | 25        |
| Estructura de carpetas (capas separadas)      | 15        |
| Documentación OpenAPI válida                  | 15        |
| Swagger UI operativo                          | 10        |
| **Bonus**: Sistema de eventos                 | +10       |
| **Total**                                     | 100 (+10) |

---

## 📚 Recursos de Apoyo

- **[Teoría: APIs RESTful](1-teoria/03-apis-restful.md)**
- **[Teoría: OpenAPI](1-teoria/05-documentacion-openapi.md)**
- **[Práctica: Implementación REST](2-practicas/02-practica-api-rest.md)**
- **[Swagger Editor Online](https://editor.swagger.io/)**

---

## 🚀 Cómo Entregar

1. Crea un repositorio o carpeta `taskflow-api`
2. Implementa la estructura completa
3. Asegúrate de que `pnpm start` inicie el servidor
4. Verifica que `/api-docs` muestre Swagger UI
5. Prueba todos los endpoints
6. Incluye README con instrucciones

---

## 💡 Tips para el Éxito

1. **Empieza por el diseño**: El diagrama y la especificación OpenAPI primero
2. **Valida OpenAPI**: Usa editor.swagger.io para verificar tu YAML
3. **Prueba incrementalmente**: No escribas todo el código de una vez
4. **Usa Postman o curl**: Para probar cada endpoint
5. **Revisa los códigos de estado**: Son tan importantes como los datos

---

> 💪 _"Una API bien diseñada es la diferencia entre un sistema que escala y uno que colapsa."_

---

[⬅️ Volver al README](README.md) | [➡️ Proyecto Integrador](3-proyecto/proyecto-semana-04.md)
