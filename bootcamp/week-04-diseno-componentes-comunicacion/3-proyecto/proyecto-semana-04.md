# 🚀 Proyecto Semana 04: API de Gestión con Documentación OpenAPI

## 📋 Información del Proyecto

| Campo          | Valor                                     |
| -------------- | ----------------------------------------- |
| **Duración**   | 2 horas (presencial) + 2 horas (autónomo) |
| **Evaluación** | 30% del total de la semana                |
| **Modalidad**  | Individual                                |
| **Entrega**    | Repositorio GitHub + Demo funcional       |

---

## 🎯 Objetivo General

Diseñar e implementar una **API REST completa** con documentación OpenAPI/Swagger para un dominio de negocio asignado, aplicando los principios de diseño de componentes, comunicación síncrona y buenas prácticas de APIs RESTful.

---

## � Tu Dominio Asignado

Continuarás trabajando con el **dominio de negocio único** que te fue asignado en la semana 01 mediante sorteo. Esta semana diseñarás e implementarás la API REST de ese dominio.

> ⚠️ **Política anticopia**: Cada aprendiz tiene un dominio diferente. Todos los entregables deben reflejar las entidades, reglas de negocio y lógica propia de **tu** dominio asignado. No usar dominios de otros compañeros ni ejemplos del reto (EduFlow) como entrega.

### Recuerda de tu Análisis Inicial (Semana 01)

Con base en tu documento `README.md` de la semana 01, identifica:

- **Entidad principal**: el recurso central de tu dominio (ej: el recurso que tiene CRUD completo)
- **Entidades secundarias**: recursos relacionados (mínimo 1 adicional)
- **Actores del sistema**: quiénes consumen la API (rol 1, rol 2…)
- **Operaciones críticas**: las 5-7 acciones que el sistema debe soportar

**Plantilla de referencia antes de implementar:**

| Elemento            | Tu Dominio                       |
| ------------------- | -------------------------------- |
| Entidad principal   | `[NombreEntidad]`                |
| Entidad secundaria  | `[NombreEntidad2]`               |
| Campos clave        | id, [campo1], [campo2], [campo3] |
| Operación principal | Ej: gestionar [recursos]         |

---

## 📦 Entregables Obligatorios

### 1. Diagrama de Componentes (20%)

Crear un diagrama SVG/PNG que muestre:

- [ ] Componentes principales del sistema
- [ ] Interfaces públicas de cada componente
- [ ] Dependencias entre componentes
- [ ] Flujo de comunicación

**Formato requerido**: Archivo `docs/diagrama-componentes.svg`

### 2. Especificación OpenAPI (30%)

Crear el archivo `openapi.yaml` con:

- [ ] Información del API (título, versión, descripción)
- [ ] Al menos **2 recursos** principales documentados
- [ ] **CRUD completo** para el recurso principal
- [ ] Parámetros de query para paginación y filtros
- [ ] Schemas reutilizables en `components`
- [ ] Respuestas de error documentadas (400, 404, 500)
- [ ] Ejemplos realistas en las respuestas

### 3. API REST Funcional (35%)

Implementar con Express.js:

- [ ] Estructura de carpetas (routes, controllers, services, repositories)
- [ ] CRUD completo para al menos 1 recurso
- [ ] Respuestas JSON consistentes
- [ ] Manejo de errores centralizado
- [ ] Al menos 1 endpoint con filtros/paginación
- [ ] Swagger UI integrado y accesible

### 4. Colección de Pruebas (15%)

Crear archivo `tests/api.http` o colección Postman con:

- [ ] Pruebas para cada endpoint implementado
- [ ] Casos de éxito y error
- [ ] Variables de entorno para URL base

---

## 🏗️ Estructura del Proyecto

```
proyecto-semana-04/
├── README.md                    # Documentación del proyecto
├── package.json
├── openapi.yaml                 # Especificación OpenAPI
├── docs/
│   └── diagrama-componentes.svg
├── src/
│   ├── index.js                 # Entry point
│   ├── swagger.js               # Configuración Swagger UI
│   ├── routes/
│   │   └── *.routes.js
│   ├── controllers/
│   │   └── *.controller.js
│   ├── services/
│   │   └── *.service.js
│   ├── repositories/
│   │   └── *.repository.js
│   ├── middleware/
│   │   └── error-handler.js
│   └── utils/
│       ├── http-response.js
│       └── api-error.js
└── tests/
    └── api.http
```

---

## 📝 Especificaciones Técnicas

### Requisitos de la API

```javascript
// Formato de respuesta exitosa
{
  "success": true,
  "data": { /* datos */ },
  "timestamp": "2024-02-15T10:30:00.000Z"
}

// Formato con paginación
{
  "success": true,
  "data": [ /* items */ ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "timestamp": "..."
}

// Formato de error
{
  "success": false,
  "error": {
    "message": "Descripción del error",
    "details": { /* opcional */ },
    "statusCode": 400
  },
  "timestamp": "..."
}
```

### HTTP Status Codes Requeridos

| Código | Uso                          |
| ------ | ---------------------------- |
| `200`  | Éxito en GET, PUT, PATCH     |
| `201`  | Recurso creado (POST)        |
| `204`  | Eliminación exitosa (DELETE) |
| `400`  | Error de validación          |
| `404`  | Recurso no encontrado        |
| `409`  | Conflicto (ej: duplicado)    |
| `500`  | Error interno del servidor   |

### Convenciones de Endpoints

```
GET    /api/v1/{recursos}           # Listar (con paginación)
GET    /api/v1/{recursos}/:id       # Obtener uno
POST   /api/v1/{recursos}           # Crear
PUT    /api/v1/{recursos}/:id       # Actualizar completo
PATCH  /api/v1/{recursos}/:id       # Actualizar parcial
DELETE /api/v1/{recursos}/:id       # Eliminar

# Sub-recursos
GET    /api/v1/{recursos}/:id/{sub-recursos}
POST   /api/v1/{recursos}/:id/{sub-recursos}
```

---

## 📊 Rúbrica de Evaluación

### Diagrama de Componentes (20 puntos)

| Criterio                             | Puntos |
| ------------------------------------ | ------ |
| Componentes claramente identificados | 5      |
| Interfaces bien definidas            | 5      |
| Dependencias correctamente mostradas | 5      |
| Formato profesional (SVG/PNG)        | 5      |

### Especificación OpenAPI (30 puntos)

| Criterio                             | Puntos |
| ------------------------------------ | ------ |
| Estructura correcta OpenAPI 3.x      | 5      |
| Endpoints documentados completamente | 10     |
| Schemas reutilizables                | 5      |
| Ejemplos realistas                   | 5      |
| Respuestas de error                  | 5      |

### API REST Funcional (35 puntos)

| Criterio                   | Puntos |
| -------------------------- | ------ |
| CRUD completo funcionando  | 10     |
| Respuestas consistentes    | 5      |
| Manejo de errores          | 5      |
| Paginación/filtros         | 5      |
| Swagger UI integrado       | 5      |
| Código limpio y organizado | 5      |

### Colección de Pruebas (15 puntos)

| Criterio               | Puntos |
| ---------------------- | ------ |
| Cobertura de endpoints | 5      |
| Casos de éxito         | 5      |
| Casos de error         | 5      |

---

## 🚦 Fases del Proyecto

### Fase 1: Diseño (30 min)

1. Seleccionar dominio de negocio
2. Definir entidades y relaciones
3. Diseñar endpoints (tabla de rutas)
4. Crear diagrama de componentes

### Fase 2: Especificación OpenAPI (45 min)

1. Crear estructura base del archivo YAML
2. Documentar endpoints principales
3. Definir schemas reutilizables
4. Agregar ejemplos

### Fase 3: Implementación (60 min)

1. Configurar proyecto Express
2. Implementar estructura de carpetas
3. Crear CRUD del recurso principal
4. Integrar Swagger UI

### Fase 4: Testing y Documentación (15 min)

1. Crear colección de pruebas
2. Probar todos los endpoints
3. Completar README del proyecto

---

## 💡 Ejemplo: API de Biblioteca

### Endpoints Sugeridos

```
# Libros
GET    /api/v1/books              # Listar libros
GET    /api/v1/books/:id          # Obtener libro
POST   /api/v1/books              # Crear libro
PUT    /api/v1/books/:id          # Actualizar libro
DELETE /api/v1/books/:id          # Eliminar libro

# Filtros de libros
GET    /api/v1/books?category=fiction&available=true&page=1&limit=10

# Préstamos
POST   /api/v1/books/:id/loans    # Crear préstamo
GET    /api/v1/users/:id/loans    # Préstamos del usuario
PATCH  /api/v1/loans/:id/return   # Devolver libro
```

### Fragmento OpenAPI

```yaml
paths:
  /books:
    get:
      summary: Listar libros
      parameters:
        - name: category
          in: query
          schema:
            type: string
        - name: available
          in: query
          schema:
            type: boolean
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
      responses:
        "200":
          description: Lista de libros
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/PaginatedBooksResponse"
```

---

## 📤 Instrucciones de Entrega

### 1. Preparar Repositorio

```bash
# Crear repositorio
git init proyecto-semana-04
cd proyecto-semana-04

# Configurar
git remote add origin <tu-repositorio>
```

### 2. Estructura de Commits

```bash
git commit -m "feat: setup inicial del proyecto"
git commit -m "feat: implementar CRUD de [recurso]"
git commit -m "docs: agregar especificación OpenAPI"
git commit -m "feat: integrar Swagger UI"
git commit -m "test: agregar colección de pruebas"
```

### 3. README del Proyecto

```markdown
# [Nombre del Proyecto]

## Dominio

[Biblioteca/Restaurante/Gimnasio/etc.]

## Cómo ejecutar

1. `pnpm install`
2. `pnpm dev`
3. Abrir http://localhost:3000/api-docs

## Endpoints implementados

| Método | Endpoint    | Descripción |
| ------ | ----------- | ----------- |
| GET    | /api/v1/... | ...         |
| POST   | /api/v1/... | ...         |

## Decisiones de diseño

- ...
```

### 4. Subir y Compartir

```bash
git push origin main
```

Compartir el enlace del repositorio en la plataforma del bootcamp.

---

## 🏆 Criterios de Éxito

✅ API funcional con Swagger UI accesible
✅ Especificación OpenAPI válida
✅ Diagrama de componentes profesional
✅ Código organizado siguiendo patrones
✅ Pruebas documentadas

---

## 📚 Recursos de Apoyo

- [01-diseno-componentes.md](../1-teoria/01-diseno-componentes.md)
- [03-apis-restful.md](../1-teoria/03-apis-restful.md)
- [05-documentacion-openapi.md](../1-teoria/05-documentacion-openapi.md)
- [Práctica 02: API REST](../2-practicas/02-practica-api-rest.md)
- [Práctica 03: Swagger](../2-practicas/03-practica-swagger.md)

---

## ❓ Preguntas Frecuentes

**¿Puedo usar TypeScript?**
Sí, pero asegúrate de que el proyecto compile y ejecute correctamente.

**¿Necesito base de datos real?**
No, puedes usar datos en memoria como se muestra en las prácticas.

**¿Puedo agregar más endpoints de los requeridos?**
¡Absolutamente! Se valorará positivamente.

**¿Qué pasa si no termino todo?**
Entrega lo que tengas funcionando. Es mejor un CRUD completo que 3 incompletos.

---

**¡Éxito con tu proyecto! 🎉**

_Semana 04 - Diseño de Componentes y Comunicación_
