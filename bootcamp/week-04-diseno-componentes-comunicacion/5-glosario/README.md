# 📖 Glosario - Semana 04: Diseño de Componentes y Comunicación

## A

### API (Application Programming Interface)

Conjunto de definiciones y protocolos que permiten la comunicación entre diferentes sistemas de software. Define cómo los componentes deben interactuar.

### Acoplamiento

Grado de interdependencia entre módulos o componentes. Un **bajo acoplamiento** es deseable porque permite modificar componentes sin afectar otros.

### Asíncrono

Estilo de comunicación donde el emisor no espera respuesta inmediata. El mensaje se envía y el proceso continúa sin bloquearse.

---

## C

### Cohesión

Medida de cuán relacionadas están las responsabilidades dentro de un módulo. **Alta cohesión** significa que el módulo tiene una responsabilidad bien definida.

### Componente

Unidad de software modular, reemplazable y desplegable que encapsula su implementación y expone interfaces bien definidas.

### Contrato

Acuerdo formal que define cómo interactúan dos componentes: qué métodos están disponibles, qué parámetros aceptan y qué retornan.

### CRUD

Acrónimo de Create, Read, Update, Delete. Las cuatro operaciones básicas de persistencia de datos.

---

## E

### Endpoint

URL específica de una API que acepta requests y retorna responses. Ejemplo: `GET /api/v1/users`.

### Event-Driven

Arquitectura donde los componentes se comunican mediante eventos. Un componente emite eventos y otros los consumen.

---

## G

### GraphQL

Lenguaje de consulta para APIs que permite al cliente especificar exactamente qué datos necesita en una sola solicitud.

---

## H

### HTTP (HyperText Transfer Protocol)

Protocolo de comunicación usado en la web. Define métodos (GET, POST, PUT, DELETE) y códigos de estado (200, 404, 500).

### HTTP Status Code

Código numérico que indica el resultado de una solicitud HTTP:

- **2xx**: Éxito (200 OK, 201 Created, 204 No Content)
- **4xx**: Error del cliente (400 Bad Request, 404 Not Found)
- **5xx**: Error del servidor (500 Internal Server Error)

---

## I

### Idempotente

Operación que produce el mismo resultado sin importar cuántas veces se ejecute. GET, PUT y DELETE son idempotentes; POST no lo es.

### Interfaz

Contrato que define los métodos públicos de un componente. Especifica **qué** hace el componente, no **cómo** lo hace.

### Inyección de Dependencias

Patrón donde las dependencias de un componente se proporcionan externamente en lugar de ser creadas internamente.

---

## J

### JSON (JavaScript Object Notation)

Formato ligero de intercambio de datos. Es el formato estándar para las respuestas de APIs REST.

---

## M

### Middleware

Software que actúa como intermediario entre diferentes componentes o capas de una aplicación.

### Mock

Objeto simulado que imita el comportamiento de un componente real. Usado en testing para aislar el código bajo prueba.

### Mutation

En GraphQL, operación que modifica datos en el servidor (equivalente a POST, PUT, DELETE en REST).

---

## O

### OpenAPI

Especificación estándar para describir APIs RESTful. Permite generar documentación, clientes y validación automática.

### Over-fetching

Problema donde la API retorna más datos de los necesarios. GraphQL lo resuelve permitiendo consultas específicas.

---

## P

### Payload

Datos contenidos en el cuerpo de una solicitud o respuesta HTTP.

### Pub/Sub (Publish/Subscribe)

Patrón de mensajería donde los publicadores envían mensajes a canales y los suscriptores reciben mensajes de esos canales.

---

## Q

### Query

En GraphQL, operación de solo lectura que obtiene datos del servidor (equivalente a GET en REST).

### Query Parameters

Parámetros opcionales en la URL después del signo `?`. Usados para filtrar, paginar u ordenar. Ejemplo: `/users?page=1&limit=10`.

---

## R

### REST (Representational State Transfer)

Estilo arquitectónico para diseñar APIs web basado en recursos, métodos HTTP estándar y comunicación sin estado.

### Recurso

En REST, cualquier entidad que puede ser nombrada y accedida. Se identifica por una URL (ej: `/users`, `/products/123`).

### Repository Pattern

Patrón que abstrae el acceso a datos, proporcionando una interfaz similar a una colección para acceder al dominio.

### Resolver

En GraphQL, función que obtiene los datos para un campo específico del schema.

---

## S

### Schema

Definición de la estructura de datos. En OpenAPI define los modelos; en GraphQL define tipos, queries y mutations.

### Síncrono

Comunicación donde el emisor envía una solicitud y espera (bloqueado) hasta recibir la respuesta.

### Swagger

Conjunto de herramientas para diseñar, construir, documentar y consumir APIs REST. Swagger UI genera documentación interactiva.

---

## U

### Under-fetching

Problema donde una solicitud no retorna suficientes datos, requiriendo múltiples requests. GraphQL lo resuelve con consultas anidadas.

### URI (Uniform Resource Identifier)

Cadena que identifica un recurso. En REST, cada recurso tiene una URI única.

---

## V

### Versionado

Práctica de mantener múltiples versiones de una API. Común usar prefijos como `/api/v1/`, `/api/v2/`.

---

## Y

### YAML

Formato de serialización de datos legible por humanos. Usado para escribir especificaciones OpenAPI.

---

## Referencias

- [OpenAPI Specification](https://spec.openapis.org/oas/v3.1.0)
- [GraphQL Specification](https://spec.graphql.org/)
- [MDN Web Docs - HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- [REST API Tutorial](https://restfulapi.net/)
