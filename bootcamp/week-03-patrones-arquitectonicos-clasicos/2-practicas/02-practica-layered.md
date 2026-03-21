# 🏗️ Práctica 02: Implementación de Layered Architecture

## 📋 Información General

| Campo              | Detalle                                    |
| ------------------ | ------------------------------------------ |
| **Duración**       | 45 minutos                                 |
| **Nivel**          | Intermedio                                 |
| **Prerrequisitos** | Teoría semana 03, JavaScript ES2023 básico |
| **Entregable**     | Proyecto con 3 capas funcionando           |

---

## 🎯 Objetivos de Aprendizaje

Al finalizar esta práctica serás capaz de:

- ✅ Implementar una arquitectura en 3 capas con JavaScript ES2023
- ✅ Separar responsabilidades entre Presentación, Negocio y Datos
- ✅ Aplicar el principio de dependencia unidireccional
- ✅ Entender los beneficios prácticos de la separación en capas

---

## 📖 Contexto

Vamos a construir una aplicación de **gestión de tareas** (Todo App) usando Layered Architecture. Esta es la arquitectura más común para aplicaciones web tradicionales y te servirá como base para entender patrones más complejos.

### Estructura de Capas

```
┌─────────────────────────────────────────┐
│         CAPA DE PRESENTACIÓN            │
│   (API REST - Recibe peticiones HTTP)   │
└────────────────────┬────────────────────┘
                     │ Llama a
                     ▼
┌─────────────────────────────────────────┐
│         CAPA DE NEGOCIO                 │
│   (Validaciones, reglas, lógica)        │
└────────────────────┬────────────────────┘
                     │ Usa
                     ▼
┌─────────────────────────────────────────┐
│         CAPA DE DATOS                   │
│   (Acceso a base de datos/storage)      │
└─────────────────────────────────────────┘
```

---

## 🛠️ Preparación del Proyecto

### Paso 1: Crear estructura de carpetas

```bash
mkdir -p todo-layered/{presentation,business,data}
cd todo-layered
pnpm init
```

### Paso 2: Estructura final esperada

```
todo-layered/
├── package.json
├── index.js              # Punto de entrada
├── presentation/
│   └── todo-controller.js
├── business/
│   └── todo-service.js
└── data/
    └── todo-repository.js
```

---

## 📝 Implementación Paso a Paso

### Paso 1: Capa de Datos (todo-repository.js)

Esta capa es responsable de **almacenar y recuperar datos**. No sabe nada sobre reglas de negocio ni sobre HTTP.

```javascript
// data/todo-repository.js

/**
 * Repositorio de tareas - Capa de Datos
 *
 * Responsabilidades:
 * - Almacenar tareas
 * - Buscar tareas
 * - Actualizar tareas
 * - Eliminar tareas
 *
 * NO debe contener:
 * - Validaciones de negocio
 * - Lógica de presentación
 * - Manejo de HTTP
 */

// Simulamos una base de datos en memoria
const database = new Map();
let nextId = 1;

/**
 * Crea una nueva tarea en la base de datos
 * @param {Object} todoData - Datos de la tarea
 * @returns {Object} Tarea creada con ID
 */
const create = (todoData) => {
  const todo = {
    id: nextId++,
    ...todoData,
    createdAt: new Date().toISOString(),
  };
  database.set(todo.id, todo);
  return { ...todo };
};

/**
 * Obtiene todas las tareas
 * @returns {Array} Lista de tareas
 */
const findAll = () => {
  return [...database.values()];
};

/**
 * Busca una tarea por ID
 * @param {number} id - ID de la tarea
 * @returns {Object|null} Tarea encontrada o null
 */
const findById = (id) => {
  const todo = database.get(id);
  return todo ? { ...todo } : null;
};

/**
 * Actualiza una tarea existente
 * @param {number} id - ID de la tarea
 * @param {Object} updates - Datos a actualizar
 * @returns {Object|null} Tarea actualizada o null
 */
const update = (id, updates) => {
  const existing = database.get(id);
  if (!existing) return null;

  const updated = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  database.set(id, updated);
  return { ...updated };
};

/**
 * Elimina una tarea
 * @param {number} id - ID de la tarea
 * @returns {boolean} true si se eliminó, false si no existía
 */
const remove = (id) => {
  return database.delete(id);
};

/**
 * Busca tareas por estado
 * @param {boolean} completed - Estado de completado
 * @returns {Array} Lista de tareas filtradas
 */
const findByStatus = (completed) => {
  return [...database.values()].filter((todo) => todo.completed === completed);
};

export { create, findAll, findById, update, remove, findByStatus };
```

### 📝 Ejercicio 2.1: Analiza la Capa de Datos

Responde las siguientes preguntas:

1. **¿Esta capa sabe algo sobre HTTP o endpoints?**

   ```

   ```

2. **¿Qué pasaría si cambiamos de "memoria" a PostgreSQL?**

   ```

   ```

3. **¿Por qué retornamos `{ ...todo }` en lugar de `todo` directamente?**

   ```

   ```

---

### Paso 2: Capa de Negocio (todo-service.js)

Esta capa contiene **validaciones y reglas de negocio**. Usa la capa de datos pero no sabe nada sobre HTTP.

```javascript
// business/todo-service.js

/**
 * Servicio de tareas - Capa de Negocio
 *
 * Responsabilidades:
 * - Validar datos de entrada
 * - Aplicar reglas de negocio
 * - Coordinar operaciones
 *
 * NO debe contener:
 * - Acceso directo a base de datos
 * - Manejo de HTTP o respuestas
 */

import * as todoRepository from '../data/todo-repository.js';

// Constantes de negocio
const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;

/**
 * Errores personalizados de negocio
 */
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * Valida los datos de una tarea
 * @param {Object} data - Datos a validar
 * @throws {ValidationError} Si los datos son inválidos
 */
const validateTodoData = (data) => {
  if (!data.title || typeof data.title !== 'string') {
    throw new ValidationError('El título es requerido y debe ser texto');
  }

  if (data.title.trim().length === 0) {
    throw new ValidationError('El título no puede estar vacío');
  }

  if (data.title.length > MAX_TITLE_LENGTH) {
    throw new ValidationError(
      `El título no puede exceder ${MAX_TITLE_LENGTH} caracteres`,
    );
  }

  if (data.description && data.description.length > MAX_DESCRIPTION_LENGTH) {
    throw new ValidationError(
      `La descripción no puede exceder ${MAX_DESCRIPTION_LENGTH} caracteres`,
    );
  }
};

/**
 * Crea una nueva tarea con validaciones
 * @param {Object} todoData - Datos de la tarea
 * @returns {Object} Tarea creada
 */
const createTodo = (todoData) => {
  validateTodoData(todoData);

  const newTodo = {
    title: todoData.title.trim(),
    description: todoData.description?.trim() ?? '',
    completed: false,
    priority: todoData.priority ?? 'medium',
  };

  return todoRepository.create(newTodo);
};

/**
 * Obtiene todas las tareas, opcionalmente filtradas
 * @param {Object} filters - Filtros opcionales
 * @returns {Array} Lista de tareas
 */
const getAllTodos = (filters = {}) => {
  if (typeof filters.completed === 'boolean') {
    return todoRepository.findByStatus(filters.completed);
  }
  return todoRepository.findAll();
};

/**
 * Obtiene una tarea por ID
 * @param {number} id - ID de la tarea
 * @returns {Object} Tarea encontrada
 * @throws {NotFoundError} Si no existe
 */
const getTodoById = (id) => {
  const todo = todoRepository.findById(id);
  if (!todo) {
    throw new NotFoundError(`Tarea con ID ${id} no encontrada`);
  }
  return todo;
};

/**
 * Actualiza una tarea existente
 * @param {number} id - ID de la tarea
 * @param {Object} updates - Datos a actualizar
 * @returns {Object} Tarea actualizada
 */
const updateTodo = (id, updates) => {
  // Verificar que existe
  getTodoById(id);

  // Validar nuevos datos si hay título
  if (updates.title !== undefined) {
    validateTodoData({ title: updates.title });
    updates.title = updates.title.trim();
  }

  if (updates.description !== undefined) {
    updates.description = updates.description.trim();
  }

  return todoRepository.update(id, updates);
};

/**
 * Marca una tarea como completada
 * @param {number} id - ID de la tarea
 * @returns {Object} Tarea actualizada
 */
const completeTodo = (id) => {
  return updateTodo(id, { completed: true });
};

/**
 * Elimina una tarea
 * @param {number} id - ID de la tarea
 */
const deleteTodo = (id) => {
  // Verificar que existe antes de eliminar
  getTodoById(id);
  todoRepository.remove(id);
};

/**
 * Obtiene estadísticas de tareas
 * @returns {Object} Estadísticas
 */
const getStatistics = () => {
  const all = todoRepository.findAll();
  const completed = all.filter((t) => t.completed);

  return {
    total: all.length,
    completed: completed.length,
    pending: all.length - completed.length,
    completionRate:
      all.length > 0 ? Math.round((completed.length / all.length) * 100) : 0,
  };
};

export {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  completeTodo,
  deleteTodo,
  getStatistics,
  ValidationError,
  NotFoundError,
};
```

### 📝 Ejercicio 2.2: Analiza la Capa de Negocio

1. **¿Por qué las validaciones están aquí y no en la capa de datos?**

   ```

   ```

2. **¿Qué ventaja tiene tener errores personalizados (ValidationError, NotFoundError)?**

   ```

   ```

3. **¿Esta capa sabe cómo se almacenan los datos (memoria, PostgreSQL, archivo)?**

   ```

   ```

---

### Paso 3: Capa de Presentación (todo-controller.js)

Esta capa maneja **HTTP, peticiones y respuestas**. Convierte errores de negocio en códigos HTTP apropiados.

```javascript
// presentation/todo-controller.js

/**
 * Controlador de tareas - Capa de Presentación
 *
 * Responsabilidades:
 * - Recibir peticiones HTTP
 * - Extraer datos del request
 * - Llamar a servicios de negocio
 * - Formatear respuestas HTTP
 * - Manejar errores y convertirlos a códigos HTTP
 *
 * NO debe contener:
 * - Lógica de negocio
 * - Acceso a base de datos
 */

import * as todoService from '../business/todo-service.js';

const { ValidationError, NotFoundError } = todoService;

/**
 * Envía una respuesta JSON exitosa
 */
const sendSuccess = (res, data, statusCode = 200) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true, data }));
};

/**
 * Envía una respuesta de error
 */
const sendError = (res, message, statusCode = 500) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: false, error: message }));
};

/**
 * Parsea el body de una petición
 */
const parseBody = async (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('JSON inválido'));
      }
    });
    req.on('error', reject);
  });
};

/**
 * Maneja errores y los convierte a respuestas HTTP apropiadas
 */
const handleError = (res, error) => {
  console.error('Error:', error.message);

  if (error instanceof ValidationError) {
    return sendError(res, error.message, 400); // Bad Request
  }

  if (error instanceof NotFoundError) {
    return sendError(res, error.message, 404); // Not Found
  }

  if (error.message === 'JSON inválido') {
    return sendError(res, 'El cuerpo de la petición debe ser JSON válido', 400);
  }

  // Error interno del servidor
  return sendError(res, 'Error interno del servidor', 500);
};

/**
 * GET /todos - Obtiene todas las tareas
 */
const handleGetAll = (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const completedParam = url.searchParams.get('completed');

    const filters = {};
    if (completedParam !== null) {
      filters.completed = completedParam === 'true';
    }

    const todos = todoService.getAllTodos(filters);
    sendSuccess(res, todos);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * GET /todos/:id - Obtiene una tarea por ID
 */
const handleGetById = (req, res, id) => {
  try {
    const todo = todoService.getTodoById(id);
    sendSuccess(res, todo);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * POST /todos - Crea una nueva tarea
 */
const handleCreate = async (req, res) => {
  try {
    const data = await parseBody(req);
    const todo = todoService.createTodo(data);
    sendSuccess(res, todo, 201); // Created
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * PUT /todos/:id - Actualiza una tarea
 */
const handleUpdate = async (req, res, id) => {
  try {
    const data = await parseBody(req);
    const todo = todoService.updateTodo(id, data);
    sendSuccess(res, todo);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * PATCH /todos/:id/complete - Marca tarea como completada
 */
const handleComplete = (req, res, id) => {
  try {
    const todo = todoService.completeTodo(id);
    sendSuccess(res, todo);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * DELETE /todos/:id - Elimina una tarea
 */
const handleDelete = (req, res, id) => {
  try {
    todoService.deleteTodo(id);
    sendSuccess(res, { message: 'Tarea eliminada correctamente' });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * GET /todos/stats - Obtiene estadísticas
 */
const handleStats = (req, res) => {
  try {
    const stats = todoService.getStatistics();
    sendSuccess(res, stats);
  } catch (error) {
    handleError(res, error);
  }
};

export {
  handleGetAll,
  handleGetById,
  handleCreate,
  handleUpdate,
  handleComplete,
  handleDelete,
  handleStats,
};
```

### 📝 Ejercicio 2.3: Analiza la Capa de Presentación

1. **¿Por qué convertimos ValidationError a código 400 y NotFoundError a 404?**

   ```

   ```

2. **¿Esta capa sabe qué reglas de validación existen?**

   ```

   ```

3. **¿Qué pasaría si quisiéramos agregar una interfaz CLI además de HTTP?**

   ```

   ```

---

### Paso 4: Punto de Entrada (index.js)

```javascript
// index.js

/**
 * Punto de entrada de la aplicación
 * Configura el servidor HTTP y enruta las peticiones
 */

import { createServer } from 'node:http';
import * as todoController from './presentation/todo-controller.js';

const PORT = process.env.PORT ?? 3000;

/**
 * Router simple para manejar las rutas
 */
const router = async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;

  // CORS headers (para desarrollo)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Rutas
  if (path === '/todos' && method === 'GET') {
    return todoController.handleGetAll(req, res);
  }

  if (path === '/todos/stats' && method === 'GET') {
    return todoController.handleStats(req, res);
  }

  if (path === '/todos' && method === 'POST') {
    return todoController.handleCreate(req, res);
  }

  // Rutas con parámetros
  const todoMatch = path.match(/^\/todos\/(\d+)$/);
  if (todoMatch) {
    const id = parseInt(todoMatch[1], 10);

    if (method === 'GET') {
      return todoController.handleGetById(req, res, id);
    }
    if (method === 'PUT') {
      return todoController.handleUpdate(req, res, id);
    }
    if (method === 'DELETE') {
      return todoController.handleDelete(req, res, id);
    }
  }

  const completeMatch = path.match(/^\/todos\/(\d+)\/complete$/);
  if (completeMatch && method === 'PATCH') {
    const id = parseInt(completeMatch[1], 10);
    return todoController.handleComplete(req, res, id);
  }

  // Ruta no encontrada
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: false, error: 'Ruta no encontrada' }));
};

// Crear y arrancar servidor
const server = createServer(router);

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║     🚀 Todo API - Layered Architecture         ║
╠════════════════════════════════════════════════╣
║  Servidor corriendo en: http://localhost:${PORT}  ║
╠════════════════════════════════════════════════╣
║  Endpoints disponibles:                        ║
║  • GET    /todos          - Listar tareas      ║
║  • GET    /todos/:id      - Obtener tarea      ║
║  • POST   /todos          - Crear tarea        ║
║  • PUT    /todos/:id      - Actualizar tarea   ║
║  • PATCH  /todos/:id/complete - Completar      ║
║  • DELETE /todos/:id      - Eliminar tarea     ║
║  • GET    /todos/stats    - Estadísticas       ║
╚════════════════════════════════════════════════╝
  `);
});
```

---

## 🧪 Prueba tu Implementación

### Paso 5: Ejecutar y Probar

```bash
# Iniciar el servidor
node index.js
```

### Pruebas con curl:

```bash
# Crear una tarea
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Aprender Layered Architecture", "description": "Completar la práctica 02"}'

# Listar todas las tareas
curl http://localhost:3000/todos

# Obtener una tarea específica
curl http://localhost:3000/todos/1

# Marcar como completada
curl -X PATCH http://localhost:3000/todos/1/complete

# Ver estadísticas
curl http://localhost:3000/todos/stats

# Probar validación (título vacío)
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": ""}'
```

---

## 📝 Ejercicio Final: Reflexión

### Completa la siguiente tabla:

| Pregunta                                                          | Tu Respuesta |
| ----------------------------------------------------------------- | ------------ |
| ¿Qué capa modificarías para agregar una nueva validación?         |              |
| ¿Qué capa modificarías para cambiar de memoria a PostgreSQL?      |              |
| ¿Qué capa modificarías para agregar un nuevo endpoint?            |              |
| ¿Qué capa modificarías para cambiar el formato de respuesta JSON? |              |

### Diagrama de dependencias:

Dibuja las flechas de dependencia entre capas:

```
┌─────────────────┐
│  Presentación   │
└────────┬────────┘
         │ ???
         ▼
┌─────────────────┐
│    Negocio      │
└────────┬────────┘
         │ ???
         ▼
┌─────────────────┐
│     Datos       │
└─────────────────┘
```

**Pregunta:** ¿Puede la capa de Datos llamar a la capa de Negocio? ¿Por qué?

```



```

---

## ✅ Checklist de Entrega

- [ ] Implementé las 3 capas según las especificaciones
- [ ] El servidor arranca correctamente con `node index.js`
- [ ] Puedo crear, leer, actualizar y eliminar tareas
- [ ] Las validaciones funcionan (título requerido, longitud máxima)
- [ ] Los errores retornan códigos HTTP apropiados
- [ ] Completé los ejercicios de reflexión

---

## 🎁 Reto Bonus

Si terminaste antes, intenta:

1. **Agregar persistencia en archivo JSON** (solo modificando la capa de datos)
2. **Agregar un campo `dueDate`** con validación de fecha futura
3. **Agregar filtro por prioridad** en `GET /todos?priority=high`

---

**¡Excelente trabajo! 🎉** Has implementado tu primera aplicación con Layered Architecture.

---

[⬅️ Práctica Anterior](01-practica-analisis-arquitecturas.md) | [➡️ Siguiente Práctica](03-practica-seleccion.md)
