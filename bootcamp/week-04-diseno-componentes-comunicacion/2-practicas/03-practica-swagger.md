# 📚 Práctica 03: Documentación con OpenAPI/Swagger

## 📋 Información General

| Campo             | Valor                         |
| ----------------- | ----------------------------- |
| **Duración**      | 30 minutos                    |
| **Dificultad**    | ⭐⭐ Intermedio               |
| **Prerequisitos** | Práctica 02 (API REST)        |
| **Habilidades**   | OpenAPI 3.x, Swagger UI, YAML |

---

## 🎯 Objetivos de Aprendizaje

Al completar esta práctica serás capaz de:

- ✅ Escribir especificaciones OpenAPI 3.x
- ✅ Documentar endpoints, parámetros y respuestas
- ✅ Integrar Swagger UI en una aplicación Express
- ✅ Usar la documentación interactiva para probar la API

---

## 📖 Contexto

Continuamos con la API de cursos online. Ahora documentaremos la API usando OpenAPI 3.1 para que:

- Los desarrolladores frontend puedan entender la API
- Nuevos miembros del equipo puedan onboarding rápido
- Los consumidores externos tengan referencia clara
- Se pueda probar la API interactivamente

---

## 🚀 Parte 1: Escribir la Especificación OpenAPI (20 min)

### Tu Tarea

Crea el archivo `openapi.yaml` documentando la API de cursos.

```yaml
# openapi.yaml
openapi: 3.1.0

info:
  title: Courses API
  description: |
    API REST para plataforma de cursos online.

    ## Características
    - Gestión completa de cursos (CRUD)
    - Sistema de lecciones
    - Inscripciones de estudiantes
    - Paginación y filtros avanzados
  version: 1.0.0
  contact:
    name: API Support
    email: api@courses.example.com
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: http://localhost:3000/api/v1
    description: Development server
  - url: https://api.courses.example.com/v1
    description: Production server

tags:
  - name: Courses
    description: Operaciones con cursos
  - name: Lessons
    description: Gestión de lecciones
  - name: Health
    description: Estado del servicio

paths:
  /health:
    get:
      tags:
        - Health
      summary: Health check
      description: Verifica el estado del servicio
      operationId: healthCheck
      responses:
        '200':
          description: Servicio funcionando correctamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: ok
                  timestamp:
                    type: string
                    format: date-time

  /courses:
    get:
      tags:
        - Courses
      summary: Listar cursos
      description: |
        Retorna una lista paginada de cursos publicados.
        Soporta filtros por categoría, nivel y rango de precios.
      operationId: getCourses
      parameters:
        - name: page
          in: query
          description: Número de página (comienza en 1)
          schema:
            type: integer
            minimum: 1
            default: 1
          example: 1
        - name: limit
          in: query
          description: Cantidad de items por página (máximo 100)
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 10
          example: 10
        - name: category
          in: query
          description: Filtrar por categoría
          schema:
            type: string
            enum: [programming, design, marketing, business]
          example: programming
        - name: level
          in: query
          description: Filtrar por nivel de dificultad
          schema:
            $ref: '#/components/schemas/CourseLevel'
        - name: minPrice
          in: query
          description: Precio mínimo
          schema:
            type: number
            format: float
            minimum: 0
          example: 0
        - name: maxPrice
          in: query
          description: Precio máximo
          schema:
            type: number
            format: float
          example: 100
        - name: sortBy
          in: query
          description: Campo para ordenar
          schema:
            type: string
            enum: [createdAt, price, title]
            default: createdAt
        - name: order
          in: query
          description: Dirección del ordenamiento
          schema:
            type: string
            enum: [asc, desc]
            default: desc
      responses:
        '200':
          description: Lista de cursos obtenida exitosamente
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedCoursesResponse'
              example:
                success: true
                data:
                  - id: '1'
                    title: 'JavaScript Moderno ES2023'
                    description: 'Aprende las últimas características'
                    price: 49.99
                    category: programming
                    level: intermediate
                    published: true
                    lessonsCount: 15
                meta:
                  pagination:
                    page: 1
                    limit: 10
                    total: 25
                    totalPages: 3
                    hasNext: true
                    hasPrev: false
                timestamp: '2024-02-15T10:30:00.000Z'
        '400':
          $ref: '#/components/responses/BadRequest'

    post:
      tags:
        - Courses
      summary: Crear curso
      description: |
        Crea un nuevo curso en estado borrador (no publicado).
        El curso necesita al menos 3 lecciones para poder publicarse.
      operationId: createCourse
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateCourseRequest'
            example:
              title: 'Node.js Avanzado'
              description: 'Aprende Node.js a profundidad'
              price: 59.99
              instructorId: 'instructor-1'
              category: programming
              level: advanced
      responses:
        '201':
          description: Curso creado exitosamente
          headers:
            Location:
              description: URL del nuevo recurso
              schema:
                type: string
                example: /api/v1/courses/3
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CourseResponse'
        '400':
          $ref: '#/components/responses/BadRequest'

  /courses/{id}:
    parameters:
      - name: id
        in: path
        required: true
        description: ID único del curso
        schema:
          type: string
        example: '1'

    get:
      tags:
        - Courses
      summary: Obtener curso
      description: Retorna los detalles completos de un curso incluyendo sus lecciones
      operationId: getCourseById
      responses:
        '200':
          description: Curso encontrado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CourseDetailResponse'
        '404':
          $ref: '#/components/responses/NotFound'

    put:
      tags:
        - Courses
      summary: Actualizar curso
      description: Actualiza todos los campos de un curso
      operationId: updateCourse
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateCourseRequest'
      responses:
        '200':
          description: Curso actualizado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CourseResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '404':
          $ref: '#/components/responses/NotFound'

    delete:
      tags:
        - Courses
      summary: Eliminar curso
      description: |
        Elimina un curso. 
        **Nota**: No se puede eliminar un curso publicado.
        Primero debe despublicarse.
      operationId: deleteCourse
      responses:
        '204':
          description: Curso eliminado exitosamente
        '404':
          $ref: '#/components/responses/NotFound'
        '409':
          description: Conflicto - No se puede eliminar un curso publicado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  message: 'Cannot delete a published course. Unpublish it first.'
                  statusCode: 409
                timestamp: '2024-02-15T10:30:00.000Z'

  /courses/{id}/publish:
    post:
      tags:
        - Courses
      summary: Publicar curso
      description: |
        Cambia el estado del curso a publicado.
        **Requisito**: El curso debe tener al menos 3 lecciones.
      operationId: publishCourse
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Curso publicado exitosamente
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CourseResponse'
        '400':
          description: No cumple requisitos para publicar
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  message: 'Course needs at least 3 lessons to be published'
                  details:
                    currentLessons: 2
                  statusCode: 400
        '404':
          $ref: '#/components/responses/NotFound'

  /courses/{id}/lessons:
    parameters:
      - name: id
        in: path
        required: true
        description: ID del curso
        schema:
          type: string

    get:
      tags:
        - Lessons
      summary: Listar lecciones
      description: Retorna todas las lecciones de un curso ordenadas
      operationId: getCourseLessons
      responses:
        '200':
          description: Lista de lecciones
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LessonsResponse'
        '404':
          $ref: '#/components/responses/NotFound'

    post:
      tags:
        - Lessons
      summary: Agregar lección
      description: Agrega una nueva lección al curso
      operationId: addLesson
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateLessonRequest'
            example:
              title: 'Event Loop Explicado'
              videoUrl: 'https://example.com/video1'
              durationMinutes: 25
              content: 'En esta lección aprenderás...'
      responses:
        '201':
          description: Lección creada
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LessonResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '404':
          $ref: '#/components/responses/NotFound'

components:
  schemas:
    # === Enums ===
    CourseLevel:
      type: string
      enum: [beginner, intermediate, advanced]
      description: Nivel de dificultad del curso

    CourseCategory:
      type: string
      enum: [programming, design, marketing, business]
      description: Categoría del curso

    # === Base Schemas ===
    Course:
      type: object
      properties:
        id:
          type: string
          description: ID único del curso
        title:
          type: string
          minLength: 5
          maxLength: 200
          description: Título del curso
        description:
          type: string
          description: Descripción detallada
        price:
          type: number
          format: float
          minimum: 0
          description: Precio en USD
        instructorId:
          type: string
          description: ID del instructor
        category:
          $ref: '#/components/schemas/CourseCategory'
        level:
          $ref: '#/components/schemas/CourseLevel'
        published:
          type: boolean
          description: Si el curso está publicado
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    Lesson:
      type: object
      properties:
        id:
          type: string
        title:
          type: string
        videoUrl:
          type: string
          format: uri
        durationMinutes:
          type: integer
          minimum: 1
        order:
          type: integer
          minimum: 1
        content:
          type: string

    # === Request Schemas ===
    CreateCourseRequest:
      type: object
      required:
        - title
        - description
        - price
        - instructorId
        - category
        - level
      properties:
        title:
          type: string
          minLength: 5
          maxLength: 200
        description:
          type: string
        price:
          type: number
          format: float
          minimum: 0
        instructorId:
          type: string
        category:
          $ref: '#/components/schemas/CourseCategory'
        level:
          $ref: '#/components/schemas/CourseLevel'

    UpdateCourseRequest:
      type: object
      properties:
        title:
          type: string
          minLength: 5
          maxLength: 200
        description:
          type: string
        price:
          type: number
          format: float
          minimum: 0
        category:
          $ref: '#/components/schemas/CourseCategory'
        level:
          $ref: '#/components/schemas/CourseLevel'

    CreateLessonRequest:
      type: object
      required:
        - title
        - videoUrl
        - durationMinutes
      properties:
        title:
          type: string
          minLength: 3
          maxLength: 200
        videoUrl:
          type: string
          format: uri
        durationMinutes:
          type: integer
          minimum: 1
        content:
          type: string

    # === Response Schemas ===
    SuccessResponse:
      type: object
      properties:
        success:
          type: boolean
          example: true
        timestamp:
          type: string
          format: date-time

    ErrorResponse:
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
            details:
              type: object
            statusCode:
              type: integer
        timestamp:
          type: string
          format: date-time

    CourseResponse:
      allOf:
        - $ref: '#/components/schemas/SuccessResponse'
        - type: object
          properties:
            data:
              $ref: '#/components/schemas/Course'

    CourseDetailResponse:
      allOf:
        - $ref: '#/components/schemas/SuccessResponse'
        - type: object
          properties:
            data:
              allOf:
                - $ref: '#/components/schemas/Course'
                - type: object
                  properties:
                    lessons:
                      type: array
                      items:
                        $ref: '#/components/schemas/Lesson'

    PaginatedCoursesResponse:
      allOf:
        - $ref: '#/components/schemas/SuccessResponse'
        - type: object
          properties:
            data:
              type: array
              items:
                $ref: '#/components/schemas/Course'
            meta:
              type: object
              properties:
                pagination:
                  type: object
                  properties:
                    page:
                      type: integer
                    limit:
                      type: integer
                    total:
                      type: integer
                    totalPages:
                      type: integer
                    hasNext:
                      type: boolean
                    hasPrev:
                      type: boolean

    LessonResponse:
      allOf:
        - $ref: '#/components/schemas/SuccessResponse'
        - type: object
          properties:
            data:
              $ref: '#/components/schemas/Lesson'

    LessonsResponse:
      allOf:
        - $ref: '#/components/schemas/SuccessResponse'
        - type: object
          properties:
            data:
              type: array
              items:
                $ref: '#/components/schemas/Lesson'

  responses:
    BadRequest:
      description: Solicitud inválida
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error:
              message: 'Validation failed'
              details:
                - field: 'title'
                  message: 'Title is required'
              statusCode: 400
            timestamp: '2024-02-15T10:30:00.000Z'

    NotFound:
      description: Recurso no encontrado
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error:
              message: 'Course not found'
              statusCode: 404
            timestamp: '2024-02-15T10:30:00.000Z'

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: Token JWT de autenticación
```

---

## 💻 Parte 2: Integrar Swagger UI (10 min)

### Paso 1: Instalar Dependencias

```bash
pnpm add swagger-ui-express yamljs
```

### Paso 2: Configurar en Express

```javascript
// src/swagger.js
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cargar especificación OpenAPI
const swaggerDocument = YAML.load(path.join(__dirname, '..', 'openapi.yaml'));

// Opciones de personalización
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Courses API - Documentación',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
  },
};

export const setupSwagger = (app) => {
  // Servir documentación en /api-docs
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, swaggerOptions),
  );

  // Endpoint para obtener el spec en JSON
  app.get('/api-docs.json', (req, res) => {
    res.json(swaggerDocument);
  });

  console.log('📚 Swagger UI disponible en: http://localhost:3000/api-docs');
};
```

### Paso 3: Integrar en la Aplicación

```javascript
// src/index.js
import express from 'express';
import { createRoutes } from './routes/index.js';
import { errorHandler } from './middleware/error-handler.js';
import { setupSwagger } from './swagger.js';

const app = express();

// Middleware
app.use(express.json());

// Swagger UI
setupSwagger(app);

// Rutas API
app.use('/api/v1', createRoutes());

// Manejador de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API: http://localhost:${PORT}/api/v1`);
  console.log(`📚 Docs: http://localhost:${PORT}/api-docs`);
});
```

---

## 🧪 Verificación

1. **Iniciar el servidor**:

   ```bash
   pnpm dev
   ```

2. **Abrir Swagger UI**:
   Navegar a `http://localhost:3000/api-docs`

3. **Probar endpoints**:
   - Expandir un endpoint
   - Click en "Try it out"
   - Completar parámetros
   - Click en "Execute"
   - Verificar la respuesta

---

## 📊 Capturas Esperadas

### Vista General

- Lista de endpoints organizados por tags
- Información del API (título, versión, descripción)
- Selector de servidor (development/production)

### Vista de Endpoint

- Descripción del endpoint
- Parámetros con tipos y valores de ejemplo
- Respuestas posibles con esquemas JSON
- Botón "Try it out" para probar

### Respuesta Interactiva

- Código HTTP recibido
- Headers de la respuesta
- Body JSON formateado
- Tiempo de respuesta

---

## 🏆 Entregables

1. **Archivo `openapi.yaml`** completo con todos los endpoints
2. **Swagger UI integrado** y funcionando
3. **Capturas de pantalla** de la documentación

---

## 💡 Tips Adicionales

### Usar Referencias para Reutilizar

```yaml
# En lugar de repetir esquemas
responses:
  '404':
    $ref: '#/components/responses/NotFound'
```

### Documentar Ejemplos Realistas

```yaml
example:
  title: 'JavaScript Moderno ES2023'
  price: 49.99
  # Valores que tengan sentido
```

### Agrupar con Tags

```yaml
tags:
  - name: Courses
    description: Todo sobre cursos
paths:
  /courses:
    get:
      tags:
        - Courses # Agrupa visualmente
```

---

## 📚 Recursos Adicionales

- [OpenAPI Specification](https://spec.openapis.org/oas/v3.1.0)
- [Swagger Editor Online](https://editor.swagger.io/)
- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)

---

**Tiempo estimado de completación:** 30 minutos
