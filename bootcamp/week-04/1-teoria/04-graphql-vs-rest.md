# ⚡ GraphQL vs REST: Cuándo Usar Cada Uno

## 🎯 ¿Qué es GraphQL?

### Definición

**GraphQL** es un lenguaje de consulta para APIs y un runtime para ejecutar esas consultas. Fue desarrollado por Facebook en 2012 y liberado como open source en 2015.

> 💡 _"GraphQL te permite pedir exactamente los datos que necesitas, ni más ni menos, en una sola solicitud."_

### Diferencia Fundamental

![GraphQL vs REST](../0-assets/04-graphql-vs-rest.svg)

**REST**: Múltiples endpoints con datos fijos por cada uno.

**GraphQL**: Un único endpoint (`/graphql`) donde el cliente especifica exactamente qué datos necesita.

---

## 🔍 Anatomía de GraphQL

### Schema (Definición de Tipos)

```graphql
# Definición del schema GraphQL
type User {
  id: ID!
  name: String!
  email: String!
  role: Role!
  posts: [Post!]!
  friends: [User!]!
  createdAt: String!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
  publishedAt: String
}

type Comment {
  id: ID!
  text: String!
  author: User!
}

enum Role {
  ADMIN
  USER
  GUEST
}

# Queries (lectura)
type Query {
  user(id: ID!): User
  users(limit: Int, offset: Int): [User!]!
  post(id: ID!): Post
  posts(authorId: ID): [Post!]!
}

# Mutations (escritura)
type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User
  deleteUser(id: ID!): Boolean!
  createPost(input: CreatePostInput!): Post!
}

# Inputs
input CreateUserInput {
  name: String!
  email: String!
  role: Role = USER
}

input UpdateUserInput {
  name: String
  email: String
  role: Role
}

input CreatePostInput {
  title: String!
  content: String!
  authorId: ID!
}
```

### Query (Consulta)

```graphql
# Cliente pide exactamente lo que necesita
query GetUserWithPosts {
  user(id: "123") {
    name
    email
    posts {
      title
      publishedAt
      comments {
        text
        author {
          name
        }
      }
    }
  }
}
```

### Mutation (Modificación)

```graphql
mutation CreateNewUser {
  createUser(
    input: { name: "Ana García", email: "ana@example.com", role: ADMIN }
  ) {
    id
    name
    email
  }
}
```

### Respuesta

```json
{
  "data": {
    "user": {
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "posts": [
        {
          "title": "Mi primer post",
          "publishedAt": "2026-01-15",
          "comments": [
            {
              "text": "¡Excelente artículo!",
              "author": {
                "name": "María López"
              }
            }
          ]
        }
      ]
    }
  }
}
```

---

## ⚖️ Comparación Detallada

### Diagrama Comparativo

![GraphQL vs REST](../0-assets/04-graphql-vs-rest.svg)

### Tabla Comparativa

| Aspecto                  | REST                           | GraphQL                    |
| ------------------------ | ------------------------------ | -------------------------- |
| **Endpoints**            | Múltiples (`/users`, `/posts`) | Uno (`/graphql`)           |
| **Datos retornados**     | Fijos por endpoint             | Cliente decide             |
| **Over-fetching**        | ❌ Común                       | ✅ No existe               |
| **Under-fetching**       | ❌ Común (N+1 requests)        | ✅ Una sola request        |
| **Versionado**           | `/v1/users`, `/v2/users`       | Deprecación de campos      |
| **Caching**              | ✅ Nativo HTTP                 | ❌ Requiere trabajo extra  |
| **Curva de aprendizaje** | ✅ Baja                        | 🔶 Media                   |
| **Herramientas**         | Amplio ecosistema              | Ecosistema creciente       |
| **Upload de archivos**   | ✅ Nativo                      | 🔶 Requiere spec adicional |

---

## 🚫 Problemas que Resuelve GraphQL

### 1. Over-fetching (Datos de más)

```javascript
// ❌ REST: Obtienes TODO aunque solo necesites el nombre
// GET /api/users/1
// Response: { id, name, email, address, phone, avatar, createdAt, ... }

// ✅ GraphQL: Solo pides lo que necesitas
// query { user(id: "1") { name } }
// Response: { data: { user: { name: "Juan" } } }
```

### 2. Under-fetching (Datos de menos)

```javascript
// ❌ REST: Necesitas múltiples requests
// GET /api/users/1          → Usuario
// GET /api/users/1/posts    → Posts del usuario
// GET /api/posts/1/comments → Comentarios del primer post
// = 3 round trips al servidor

// ✅ GraphQL: Una sola request
query {
  user(id: "1") {
    name
    posts {
      title
      comments {
        text
      }
    }
  }
}
// = 1 round trip
```

### 3. Evolución del API sin versionado

```graphql
# En lugar de crear /v2/users, marcas campos como deprecated
type User {
  id: ID!
  name: String!
  fullName: String! # Nuevo campo
  username: String @deprecated(reason: "Usa 'name' en su lugar")
}
```

---

## 🔧 Implementación con Express y Apollo Server

### Servidor GraphQL Básico

```javascript
// src/index.js
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

// Type definitions (schema)
const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    createPost(title: String!, content: String!, authorId: ID!): Post!
  }
`;

// Datos de ejemplo
const users = [
  { id: '1', name: 'Ana García', email: 'ana@example.com' },
  { id: '2', name: 'Juan Pérez', email: 'juan@example.com' },
];

const posts = [
  { id: '1', title: 'Intro a GraphQL', content: '...', authorId: '1' },
  { id: '2', title: 'REST vs GraphQL', content: '...', authorId: '1' },
];

// Resolvers (lógica de resolución)
const resolvers = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find((u) => u.id === id),
    posts: () => posts,
    post: (_, { id }) => posts.find((p) => p.id === id),
  },

  Mutation: {
    createUser: (_, { name, email }) => {
      const newUser = { id: String(Date.now()), name, email };
      users.push(newUser);
      return newUser;
    },
    createPost: (_, { title, content, authorId }) => {
      const newPost = { id: String(Date.now()), title, content, authorId };
      posts.push(newPost);
      return newPost;
    },
  },

  // Resolvers para relaciones
  User: {
    posts: (parent) => posts.filter((p) => p.authorId === parent.id),
  },

  Post: {
    author: (parent) => users.find((u) => u.id === parent.authorId),
  },
};

// Crear servidor
const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

await server.start();

app.use('/graphql', express.json(), expressMiddleware(server));

app.listen(4000, () => {
  console.log('🚀 GraphQL server en http://localhost:4000/graphql');
});
```

### Consultas de Ejemplo

```graphql
# Obtener usuarios con sus posts
query {
  users {
    name
    email
    posts {
      title
    }
  }
}

# Obtener un post con su autor
query {
  post(id: "1") {
    title
    content
    author {
      name
      email
    }
  }
}

# Crear usuario
mutation {
  createUser(name: "María López", email: "maria@example.com") {
    id
    name
  }
}
```

---

## 🎯 ¿Cuándo Usar Cada Uno?

### ✅ Usa REST cuando:

| Escenario                          | Por qué REST                       |
| ---------------------------------- | ---------------------------------- |
| **APIs públicas simples**          | Más fácil de entender y documentar |
| **Caching importante**             | HTTP caching nativo                |
| **Operaciones CRUD simples**       | Mapeo natural a verbos HTTP        |
| **Equipo sin experiencia GraphQL** | Menor curva de aprendizaje         |
| **Microservicios internos**        | Overhead de GraphQL no justificado |
| **Upload de archivos**             | Soporte nativo en HTTP             |

### ✅ Usa GraphQL cuando:

| Escenario                             | Por qué GraphQL                            |
| ------------------------------------- | ------------------------------------------ |
| **Múltiples clientes**                | Mobile, web, TV con diferentes necesidades |
| **Datos relacionados complejos**      | Evita N+1 requests                         |
| **Ancho de banda limitado**           | Móviles con datos limitados                |
| **Iteración rápida**                  | Cambios sin crear nuevos endpoints         |
| **Agregación de múltiples fuentes**   | Gateway GraphQL                            |
| **APIs internas con frontend propio** | Control total del schema                   |

### 🔄 Usa ambos (híbrido) cuando:

```javascript
// REST para operaciones simples y archivos
app.post('/api/upload', uploadMiddleware, handleFileUpload);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// GraphQL para queries complejas
app.use('/graphql', expressMiddleware(apolloServer));
```

---

## ⚠️ Consideraciones de GraphQL

### Complejidad de Queries

```javascript
// ⚠️ Query malicioso que puede sobrecargar el servidor
query EvilQuery {
  users {
    posts {
      author {
        posts {
          author {
            posts {
              # ... y así infinitamente
            }
          }
        }
      }
    }
  }
}

// ✅ Solución: Limitar profundidad y complejidad
import depthLimit from 'graphql-depth-limit';
import { createComplexityLimitRule } from 'graphql-validation-complexity';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [
    depthLimit(5), // Máximo 5 niveles de anidamiento
    createComplexityLimitRule(1000) // Máximo 1000 puntos de complejidad
  ]
});
```

### N+1 Problem

```javascript
// ❌ Sin DataLoader: N+1 queries a la BD
// Query: { users { posts { title } } }
// 1 query para users
// N queries para posts (una por usuario)

// ✅ Con DataLoader: Batch queries
import DataLoader from 'dataloader';

const postLoader = new DataLoader(async (userIds) => {
  // Una sola query para todos los posts
  const posts = await db.posts.findMany({
    where: { authorId: { in: userIds } },
  });

  // Organizar por userId
  return userIds.map((id) => posts.filter((p) => p.authorId === id));
});

const resolvers = {
  User: {
    posts: (parent) => postLoader.load(parent.id),
  },
};
```

### Caching

```javascript
// REST: Cache HTTP nativo
// Cache-Control: max-age=3600

// GraphQL: Requiere estrategias adicionales
// 1. Persisted Queries
// 2. Response caching
// 3. CDN con GraphQL support (Apollo Router, GraphCDN)
```

---

## 💥 ¿Qué Impacto Tiene Elegir Correctamente?

### ✅ Si eliges bien:

| Beneficio          | Descripción                              |
| ------------------ | ---------------------------------------- |
| **Productividad**  | Desarrolladores trabajan más rápido      |
| **Performance**    | Menos datos transferidos, menos latencia |
| **Flexibilidad**   | Frontend itera sin cambios en backend    |
| **Mantenibilidad** | Menos endpoints/schemas que mantener     |

### ❌ Si eliges mal:

| Problema                      | Consecuencia                         |
| ----------------------------- | ------------------------------------ |
| **GraphQL para CRUD simple**  | Overhead innecesario                 |
| **REST para datos complejos** | Múltiples requests, over-fetching    |
| **Sin protección de queries** | Ataques de DoS con queries complejas |

---

## 🎯 Resumen

| Aspecto        | REST                       | GraphQL                            |
| -------------- | -------------------------- | ---------------------------------- |
| **Ideal para** | APIs públicas, CRUD simple | Apps complejas, múltiples clientes |
| **Fortaleza**  | Simplicidad, caching       | Flexibilidad, eficiencia de datos  |
| **Debilidad**  | Over/under-fetching        | Complejidad, caching difícil       |
| **Curva**      | Baja                       | Media                              |

---

## 📚 Referencias

- GraphQL Official: https://graphql.org/
- Apollo Server: https://www.apollographql.com/docs/apollo-server/
- How to GraphQL: https://www.howtographql.com/
- Principia GraphQL: https://principledgraphql.com/

---

[⬅️ Anterior: APIs RESTful](03-apis-restful.md) | [➡️ Siguiente: Documentación con OpenAPI](05-documentacion-openapi.md)
