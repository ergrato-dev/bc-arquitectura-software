# 🌐 Práctica 02: Diseño de API REST

## 📋 Información General

| Campo             | Valor                         |
| ----------------- | ----------------------------- |
| **Duración**      | 60 minutos                    |
| **Dificultad**    | ⭐⭐⭐ Intermedio-Avanzado    |
| **Prerequisitos** | Teoría de APIs RESTful        |
| **Habilidades**   | Diseño REST, Express.js, HTTP |

---

## 🎯 Objetivos de Aprendizaje

Al completar esta práctica serás capaz de:

- ✅ Diseñar endpoints RESTful siguiendo convenciones
- ✅ Implementar una API REST completa con Express
- ✅ Manejar correctamente status codes HTTP
- ✅ Implementar paginación, filtrado y ordenamiento
- ✅ Estructurar respuestas JSON consistentes

---

## 📖 Contexto del Ejercicio

Diseñarás la API REST para una **plataforma de cursos online** tipo Udemy/Platzi. El MVP incluye gestión de cursos, lecciones y estudiantes.

### Entidades del Dominio

```
Course (Curso)
├── id
├── title
├── description
├── price
├── instructor_id
├── category
├── level (beginner, intermediate, advanced)
├── published
├── created_at
└── lessons[]

Lesson (Lección)
├── id
├── course_id
├── title
├── video_url
├── duration_minutes
├── order
└── content

Enrollment (Inscripción)
├── id
├── student_id
├── course_id
├── enrolled_at
├── progress_percent
└── completed_at
```

---

## 🚀 Parte 1: Diseño de Endpoints (15 min)

### Tu Tarea

Diseña los endpoints REST para las siguientes operaciones:

| Operación                       | Tu Diseño             |
| ------------------------------- | --------------------- |
| Listar todos los cursos         | `_____ /api/v1/_____` |
| Obtener un curso                | `_____ /api/v1/_____` |
| Crear un curso                  | `_____ /api/v1/_____` |
| Actualizar un curso             | `_____ /api/v1/_____` |
| Eliminar un curso               | `_____ /api/v1/_____` |
| Listar lecciones de un curso    | `_____ /api/v1/_____` |
| Inscribir estudiante en curso   | `_____ /api/v1/_____` |
| Obtener progreso del estudiante | `_____ /api/v1/_____` |

### ✅ Solución Esperada

```
GET    /api/v1/courses           - Listar cursos
GET    /api/v1/courses/:id       - Obtener curso
POST   /api/v1/courses           - Crear curso
PUT    /api/v1/courses/:id       - Actualizar curso completo
PATCH  /api/v1/courses/:id       - Actualizar parcialmente
DELETE /api/v1/courses/:id       - Eliminar curso

GET    /api/v1/courses/:id/lessons    - Lecciones del curso
POST   /api/v1/courses/:id/lessons    - Agregar lección
GET    /api/v1/courses/:id/lessons/:lessonId - Obtener lección

POST   /api/v1/courses/:id/enrollments - Inscribirse
GET    /api/v1/students/:id/enrollments - Mis inscripciones
GET    /api/v1/enrollments/:id/progress - Ver progreso
PATCH  /api/v1/enrollments/:id/progress - Actualizar progreso
```

---

## 💻 Parte 2: Implementación con Express (45 min)

### Estructura del Proyecto

```
api-courses/
├── package.json
├── src/
│   ├── index.js
│   ├── config/
│   │   └── database.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── course.routes.js
│   │   └── enrollment.routes.js
│   ├── controllers/
│   │   ├── course.controller.js
│   │   └── enrollment.controller.js
│   ├── services/
│   │   ├── course.service.js
│   │   └── enrollment.service.js
│   ├── repositories/
│   │   └── course.repository.js
│   ├── middleware/
│   │   ├── error-handler.js
│   │   └── validate-request.js
│   └── utils/
│       ├── http-response.js
│       └── api-error.js
└── tests/
```

### Paso 1: Utilidades de Respuesta HTTP

```javascript
// src/utils/http-response.js

/**
 * Formatea respuestas HTTP consistentes
 * Principio: Respuestas predecibles para los consumidores
 */

export const httpResponse = {
  /**
   * Respuesta exitosa
   * @param {Object} res - Express response
   * @param {*} data - Datos a enviar
   * @param {number} statusCode - Código HTTP (200, 201, etc.)
   * @param {Object} meta - Metadatos (paginación, etc.)
   */
  success: (res, data, statusCode = 200, meta = null) => {
    const response = {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };

    if (meta) {
      response.meta = meta;
    }

    return res.status(statusCode).json(response);
  },

  /**
   * Respuesta de creación exitosa
   */
  created: (res, data, location = null) => {
    if (location) {
      res.setHeader('Location', location);
    }
    return httpResponse.success(res, data, 201);
  },

  /**
   * Respuesta sin contenido (DELETE exitoso)
   */
  noContent: (res) => {
    return res.status(204).send();
  },

  /**
   * Respuesta con paginación
   */
  paginated: (res, { items, page, limit, total }) => {
    const totalPages = Math.ceil(total / limit);

    return httpResponse.success(res, items, 200, {
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  },
};
```

```javascript
// src/utils/api-error.js

/**
 * Errores personalizados para la API
 */
export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }

  static badRequest(message, details) {
    return new ApiError(400, message, details);
  }

  static notFound(resource = 'Resource') {
    return new ApiError(404, `${resource} not found`);
  }

  static conflict(message) {
    return new ApiError(409, message);
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message);
  }
}
```

### Paso 2: Middleware de Manejo de Errores

```javascript
// src/middleware/error-handler.js

/**
 * Middleware centralizado para manejo de errores
 * Convierte errores en respuestas HTTP apropiadas
 */
export const errorHandler = (err, req, res, next) => {
  // Log del error (en producción usar servicio de logging)
  console.error(`[ERROR] ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Si es un error operacional (esperado)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        details: err.details,
        statusCode: err.statusCode,
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Error de validación de Express-validator
  if (err.array && typeof err.array === 'function') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: err.array(),
        statusCode: 400,
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Error inesperado (bug)
  return res.status(500).json({
    success: false,
    error: {
      message: 'Something went wrong',
      statusCode: 500,
    },
    timestamp: new Date().toISOString(),
  });
};
```

### Paso 3: Repository Pattern

```javascript
// src/repositories/course.repository.js

/**
 * Repository de cursos
 * Encapsula el acceso a datos
 *
 * Nota: En producción usaría PostgreSQL/MongoDB
 * Aquí simulamos con datos en memoria para la práctica
 */

// Datos de ejemplo
const courses = [
  {
    id: '1',
    title: 'JavaScript Moderno ES2023',
    description: 'Aprende las últimas características de JavaScript',
    price: 49.99,
    instructorId: 'instructor-1',
    category: 'programming',
    level: 'intermediate',
    published: true,
    createdAt: new Date('2024-01-15'),
    lessons: [
      { id: '1', title: 'Introducción', order: 1, durationMinutes: 15 },
      { id: '2', title: 'Let, Const y Var', order: 2, durationMinutes: 20 },
    ],
  },
  {
    id: '2',
    title: 'Arquitectura de Software',
    description: 'Patrones y principios de diseño',
    price: 79.99,
    instructorId: 'instructor-2',
    category: 'programming',
    level: 'advanced',
    published: true,
    createdAt: new Date('2024-02-01'),
    lessons: [],
  },
];

let nextId = 3;

export class CourseRepository {
  /**
   * Busca cursos con filtros y paginación
   */
  async findAll({
    page = 1,
    limit = 10,
    category,
    level,
    minPrice,
    maxPrice,
    sortBy = 'createdAt',
    order = 'desc',
  } = {}) {
    let filtered = [...courses];

    // Aplicar filtros
    if (category) {
      filtered = filtered.filter((c) => c.category === category);
    }
    if (level) {
      filtered = filtered.filter((c) => c.level === level);
    }
    if (minPrice !== undefined) {
      filtered = filtered.filter((c) => c.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      filtered = filtered.filter((c) => c.price <= maxPrice);
    }

    // Solo cursos publicados
    filtered = filtered.filter((c) => c.published);

    // Ordenar
    filtered.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return order === 'desc' ? -comparison : comparison;
    });

    // Paginación
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);

    return { items, total, page, limit };
  }

  async findById(id) {
    return courses.find((c) => c.id === id) ?? null;
  }

  async create(data) {
    const newCourse = {
      id: String(nextId++),
      ...data,
      published: false,
      createdAt: new Date(),
      lessons: [],
    };
    courses.push(newCourse);
    return newCourse;
  }

  async update(id, data) {
    const index = courses.findIndex((c) => c.id === id);
    if (index === -1) return null;

    courses[index] = { ...courses[index], ...data, updatedAt: new Date() };
    return courses[index];
  }

  async delete(id) {
    const index = courses.findIndex((c) => c.id === id);
    if (index === -1) return false;
    courses.splice(index, 1);
    return true;
  }

  async addLesson(courseId, lessonData) {
    const course = await this.findById(courseId);
    if (!course) return null;

    const lesson = {
      id: String(Date.now()),
      ...lessonData,
      order: course.lessons.length + 1,
    };
    course.lessons.push(lesson);
    return lesson;
  }
}
```

### Paso 4: Service Layer

```javascript
// src/services/course.service.js
import { ApiError } from '../utils/api-error.js';

/**
 * Servicio de cursos
 * Contiene la lógica de negocio
 */
export class CourseService {
  #repository;

  constructor(repository) {
    this.#repository = repository;
  }

  async getCourses(queryParams) {
    const {
      page = '1',
      limit = '10',
      category,
      level,
      minPrice,
      maxPrice,
      sortBy,
      order,
    } = queryParams;

    // Validar y parsear parámetros
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

    return this.#repository.findAll({
      page: parsedPage,
      limit: parsedLimit,
      category,
      level,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sortBy,
      order,
    });
  }

  async getCourseById(id) {
    const course = await this.#repository.findById(id);

    if (!course) {
      throw ApiError.notFound('Course');
    }

    return course;
  }

  async createCourse(data) {
    // Validaciones de negocio
    if (data.price < 0) {
      throw ApiError.badRequest('Price must be positive');
    }

    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validLevels.includes(data.level)) {
      throw ApiError.badRequest('Invalid level', { validLevels });
    }

    return this.#repository.create(data);
  }

  async updateCourse(id, data) {
    // Verificar que existe
    await this.getCourseById(id);

    // Validaciones
    if (data.price !== undefined && data.price < 0) {
      throw ApiError.badRequest('Price must be positive');
    }

    return this.#repository.update(id, data);
  }

  async deleteCourse(id) {
    const course = await this.getCourseById(id);

    // Regla de negocio: no eliminar cursos publicados
    if (course.published) {
      throw ApiError.conflict(
        'Cannot delete a published course. Unpublish it first.',
      );
    }

    await this.#repository.delete(id);
  }

  async publishCourse(id) {
    const course = await this.getCourseById(id);

    // Regla: necesita al menos 3 lecciones para publicar
    if (course.lessons.length < 3) {
      throw ApiError.badRequest(
        'Course needs at least 3 lessons to be published',
        { currentLessons: course.lessons.length },
      );
    }

    return this.#repository.update(id, { published: true });
  }

  async addLesson(courseId, lessonData) {
    // Verificar que el curso existe
    await this.getCourseById(courseId);

    return this.#repository.addLesson(courseId, lessonData);
  }
}
```

### Paso 5: Controller

```javascript
// src/controllers/course.controller.js
import { httpResponse } from '../utils/http-response.js';

/**
 * Controller de cursos
 * Responsabilidad: Manejar HTTP request/response
 * Delega lógica de negocio al Service
 */
export class CourseController {
  #service;

  constructor(service) {
    this.#service = service;
  }

  /**
   * GET /api/v1/courses
   * Lista cursos con filtros y paginación
   */
  getCourses = async (req, res, next) => {
    try {
      const result = await this.#service.getCourses(req.query);

      return httpResponse.paginated(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/courses/:id
   * Obtiene un curso por ID
   */
  getCourseById = async (req, res, next) => {
    try {
      const course = await this.#service.getCourseById(req.params.id);

      return httpResponse.success(res, course);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/courses
   * Crea un nuevo curso
   */
  createCourse = async (req, res, next) => {
    try {
      const course = await this.#service.createCourse(req.body);
      const location = `/api/v1/courses/${course.id}`;

      return httpResponse.created(res, course, location);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/courses/:id
   * Actualiza un curso completo
   */
  updateCourse = async (req, res, next) => {
    try {
      const course = await this.#service.updateCourse(req.params.id, req.body);

      return httpResponse.success(res, course);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/v1/courses/:id
   * Elimina un curso
   */
  deleteCourse = async (req, res, next) => {
    try {
      await this.#service.deleteCourse(req.params.id);

      return httpResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/courses/:id/publish
   * Publica un curso
   */
  publishCourse = async (req, res, next) => {
    try {
      const course = await this.#service.publishCourse(req.params.id);

      return httpResponse.success(res, course);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/courses/:id/lessons
   * Obtiene las lecciones de un curso
   */
  getCourseLessons = async (req, res, next) => {
    try {
      const course = await this.#service.getCourseById(req.params.id);

      return httpResponse.success(res, course.lessons);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/courses/:id/lessons
   * Agrega una lección a un curso
   */
  addLesson = async (req, res, next) => {
    try {
      const lesson = await this.#service.addLesson(req.params.id, req.body);

      return httpResponse.created(res, lesson);
    } catch (error) {
      next(error);
    }
  };
}
```

### Paso 6: Routes

```javascript
// src/routes/course.routes.js
import { Router } from 'express';

/**
 * Define las rutas de cursos
 * @param {CourseController} controller
 */
export const createCourseRoutes = (controller) => {
  const router = Router();

  // CRUD básico
  router.get('/', controller.getCourses);
  router.get('/:id', controller.getCourseById);
  router.post('/', controller.createCourse);
  router.put('/:id', controller.updateCourse);
  router.delete('/:id', controller.deleteCourse);

  // Acciones especiales
  router.post('/:id/publish', controller.publishCourse);

  // Sub-recursos: Lecciones
  router.get('/:id/lessons', controller.getCourseLessons);
  router.post('/:id/lessons', controller.addLesson);

  return router;
};
```

```javascript
// src/routes/index.js
import { Router } from 'express';
import { createCourseRoutes } from './course.routes.js';
import { CourseController } from '../controllers/course.controller.js';
import { CourseService } from '../services/course.service.js';
import { CourseRepository } from '../repositories/course.repository.js';

export const createRoutes = () => {
  const router = Router();

  // Inyección de dependencias
  const courseRepository = new CourseRepository();
  const courseService = new CourseService(courseRepository);
  const courseController = new CourseController(courseService);

  // Montar rutas
  router.use('/courses', createCourseRoutes(courseController));

  // Health check
  router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  return router;
};
```

### Paso 7: Aplicación Principal

```javascript
// src/index.js
import express from 'express';
import { createRoutes } from './routes/index.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();

// Middleware global
app.use(express.json());

// Log de requests (desarrollo)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rutas API v1
app.use('/api/v1', createRoutes());

// 404 para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      statusCode: 404,
    },
  });
});

// Manejador de errores (siempre al final)
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API running at http://localhost:${PORT}`);
  console.log(`📚 Courses endpoint: http://localhost:${PORT}/api/v1/courses`);
});
```

---

## 🧪 Testing con curl

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Listar cursos
curl http://localhost:3000/api/v1/courses

# Con paginación
curl "http://localhost:3000/api/v1/courses?page=1&limit=5"

# Con filtros
curl "http://localhost:3000/api/v1/courses?level=advanced&category=programming"

# Obtener curso
curl http://localhost:3000/api/v1/courses/1

# Crear curso
curl -X POST http://localhost:3000/api/v1/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Node.js Avanzado",
    "description": "Aprende Node.js a profundidad",
    "price": 59.99,
    "instructorId": "instructor-1",
    "category": "programming",
    "level": "advanced"
  }'

# Actualizar curso
curl -X PUT http://localhost:3000/api/v1/courses/3 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Node.js Avanzado - Actualizado",
    "price": 69.99
  }'

# Intentar eliminar curso publicado (debería fallar)
curl -X DELETE http://localhost:3000/api/v1/courses/1

# Agregar lección
curl -X POST http://localhost:3000/api/v1/courses/3/lessons \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Event Loop Explicado",
    "videoUrl": "https://example.com/video1",
    "durationMinutes": 25
  }'
```

---

## 📊 Respuestas Esperadas

### Éxito con datos

```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "JavaScript Moderno ES2023",
    "price": 49.99
  },
  "timestamp": "2024-02-15T10:30:00.000Z"
}
```

### Éxito con paginación

```json
{
  "success": true,
  "data": [
    { "id": "1", "title": "..." },
    { "id": "2", "title": "..." }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "timestamp": "2024-02-15T10:30:00.000Z"
}
```

### Error

```json
{
  "success": false,
  "error": {
    "message": "Course not found",
    "statusCode": 404
  },
  "timestamp": "2024-02-15T10:30:00.000Z"
}
```

---

## 🏆 Entregables

1. **API REST funcional** con todas las rutas implementadas
2. **Respuestas JSON consistentes** siguiendo el formato establecido
3. **Manejo de errores** con status codes apropiados
4. **Colección de Postman** o archivo con comandos curl de prueba

---

## 💡 Bonus: Validación de Requests

```javascript
// src/middleware/validate-request.js
import { body, validationResult } from 'express-validator';

export const validateCreateCourse = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be 5-200 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('level')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid level'),

  // Middleware que verifica errores
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array(),
          statusCode: 400,
        },
      });
    }
    next();
  },
];
```

---

**Tiempo estimado de completación:** 60 minutos
