# 📊 Rúbrica de Evaluación — Semana 08: Seguridad en la Arquitectura

> **Sistema de evaluación**: Competencias laborales SENA
> **Criterio de aprobación**: Mínimo 70% en cada evidencia

---

## Distribución de Evaluación

| Evidencia       | Porcentaje | Descripción                                                       |
| --------------- | ---------- | ----------------------------------------------------------------- |
| 🧠 Conocimiento | 30%        | CIA Triad, JWT, OAuth 2.0, OWASP Top 10 y principios de seguridad |
| 💪 Desempeño    | 40%        | JWT funcional, RBAC implementado, hardening aplicado              |
| 📦 Producto     | 30%        | EduFlow con capa de seguridad completa y documentada              |

---

## 🧠 Evidencia de Conocimiento (30%)

_Evalúa la comprensión conceptual de los fundamentos de seguridad en arquitectura._

### Criterio 1: CIA Triad y Principios de Seguridad

| Nivel            | Porcentaje | Descripción                                                                                                                                                                                                         |
| ---------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Excelente**    | 100%       | Define con precisión Confidencialidad, Integridad y Disponibilidad. Aplica Least Privilege, Defense in Depth y Fail Securely a decisiones arquitectónicas concretas. Identifica superficies de ataque en un diseño. |
| **Bueno**        | 85%        | Define correctamente CIA y menciona al menos dos principios de seguridad con ejemplos. Puede identificar superficies de ataque básicas.                                                                             |
| **Aceptable**    | 70%        | Define CIA pero con imprecisiones. Conoce la existencia de principios de seguridad pero no los aplica con fluidez.                                                                                                  |
| **Insuficiente** | <70%       | No puede definir los tres componentes de CIA o los confunde sistemáticamente.                                                                                                                                       |

### Criterio 2: JWT y Mecanismos de Autenticación

| Nivel            | Porcentaje | Descripción                                                                                                                                                                                                 |
| ---------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Excelente**    | 100%       | Explica la estructura de un JWT (header.payload.signature), el proceso de firma y verificación, las vulnerabilidades del algoritmo `none` y `alg:HS256 vs RS256`. Diferencia autenticación de autorización. |
| **Bueno**        | 85%        | Explica la estructura JWT y el flujo de autenticación. Diferencia autenticación de autorización. Conoce al menos una vulnerabilidad JWT común.                                                              |
| **Aceptable**    | 70%        | Comprende que JWT es un token de autenticación y puede describir su estructura básica. Confunde algún concepto entre autenticación y autorización.                                                          |
| **Insuficiente** | <70%       | No puede explicar qué es un JWT ni diferenciarlo de una sesión de servidor.                                                                                                                                 |

### Criterio 3: OAuth 2.0 y Flujos de Autorización

| Nivel            | Porcentaje | Descripción                                                                                                                                                                                      |
| ---------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Excelente**    | 100%       | Describe los roles de OAuth 2.0 (Resource Owner, Client, Authorization Server, Resource Server). Explica el flujo Authorization Code con PKCE y justifica cuándo usarlo sobre otros grant types. |
| **Bueno**        | 85%        | Describe los roles de OAuth 2.0 y el flujo Authorization Code. Conoce la existencia de PKCE y otros grant types.                                                                                 |
| **Aceptable**    | 70%        | Comprende que OAuth 2.0 es un protocolo de autorización delegada. Puede describir el flujo general aunque con imprecisiones en los roles.                                                        |
| **Insuficiente** | <70%       | Confunde OAuth 2.0 con autenticación o no puede describir ningún flujo.                                                                                                                          |

### Criterio 4: OWASP Top 10 para Arquitectos

| Nivel            | Porcentaje | Descripción                                                                                                                                                                                                      |
| ---------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Excelente**    | 100%       | Enumera al menos 7 de las 10 vulnerabilidades OWASP 2021. Para cada una, explica cómo el diseño arquitectónico la previene o la causa. Puede analizar una arquitectura dada e identificar riesgos por categoría. |
| **Bueno**        | 85%        | Enumera al menos 5 vulnerabilidades OWASP con su descripción y una medida preventiva arquitectónica por cada una.                                                                                                |
| **Aceptable**    | 70%        | Conoce el OWASP Top 10 y puede mencionar 3 categorías con ejemplos básicos.                                                                                                                                      |
| **Insuficiente** | <70%       | No conoce OWASP o no puede relacionar ninguna vulnerabilidad con el diseño de software.                                                                                                                          |

---

## 💪 Evidencia de Desempeño (40%)

_Evalúa la aplicación práctica de seguridad en una API Node.js._

### Criterio 1: Implementación de JWT

| Nivel            | Porcentaje | Descripción                                                                                                                                                                                                                        |
| ---------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Excelente**    | 100%       | Endpoint `/auth/login` con bcrypt para verificación de contraseña, generación de access token (corta duración) y refresh token (larga duración). Middleware de verificación que rechaza tokens expirados, malformados o sin firma. |
| **Bueno**        | 85%        | Login funcional con bcrypt y JWT. Middleware de verificación operativo. Implementa access token con expiración. Falta refresh token pero el flujo de autenticación completo funciona.                                              |
| **Aceptable**    | 70%        | Login genera un JWT que el middleware verifica correctamente. Puede usar `md5` o sin bcrypt, o sin expiración en el token, pero el flujo básico funciona.                                                                          |
| **Insuficiente** | <70%       | El endpoint de login no genera JWT válido o el middleware no verifica el token correctamente.                                                                                                                                      |

### Criterio 2: RBAC — Autorización por Roles

| Nivel            | Porcentaje | Descripción                                                                                                                                                                                                           |
| ---------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Excelente**    | 100%       | Roles definidos (student, instructor, admin) con permisos granulares por recurso. Middleware `authorize(role)` reutilizable que rechaza acceso no autorizado con 403. Los roles están en el JWT payload y se validan. |
| **Bueno**        | 85%        | Roles implementados con middleware funcional. Endpoints protegidos según rol. Puede faltar granularidad en permisos pero la separación por rol funciona correctamente.                                                |
| **Aceptable**    | 70%        | Implementa verificación de rol básica (al menos admin vs usuario). El mecanismo funciona aunque no sea un RBAC completo.                                                                                              |
| **Insuficiente** | <70%       | No implementa autorización por rol o el sistema de permisos no funciona correctamente.                                                                                                                                |

### Criterio 3: Hardening y Buenas Prácticas

| Nivel            | Porcentaje | Descripción                                                                                                                                                                                                                                                 |
| ---------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Excelente**    | 100%       | Helmet.js configurado con políticas CSP. Rate limiting en endpoints de auth (máx 5 intentos/15min). CORS configurado con lista blanca de orígenes. Validación de entradas en todos los endpoints con Joi o Zod. `pnpm audit` sin vulnerabilidades críticas. |
| **Bueno**        | 85%        | Helmet.js y rate limiting aplicados. CORS configurado. Validación de entradas en al menos los endpoints de autenticación. Sin vulnerabilidades críticas en dependencias.                                                                                    |
| **Aceptable**    | 70%        | Al menos Helmet.js y CORS básico configurados. Alguna validación de entradas implementada.                                                                                                                                                                  |
| **Insuficiente** | <70%       | Sin headers de seguridad, sin validación de entradas o CORS con wildcard `*` en producción.                                                                                                                                                                 |

### Criterio 4: Gestión Segura de Secretos y Variables de Entorno

| Nivel            | Porcentaje | Descripción                                                                                                                                                                                                   |
| ---------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Excelente**    | 100%       | `JWT_SECRET` generado con `crypto.randomBytes(64)`, almacenado en `.env` (excluido de git). `.env.example` documentado sin valores reales. Secretos en Docker Compose mediante variables de entorno (no ARG). |
| **Bueno**        | 85%        | Secretos en `.env` excluido de `.gitignore`. JWT_SECRET como variable de entorno, no hardcodeado. `.env.example` presente.                                                                                    |
| **Aceptable**    | 70%        | Secretos en variables de entorno sin hardcoding evidente. Puede faltar `.env.example` o el `.gitignore` apropiado.                                                                                            |
| **Insuficiente** | <70%       | Secretos hardcodeados en el código fuente o comprometidos en el repositorio.                                                                                                                                  |

---

## 📦 Evidencia de Producto (30%)

_Evalúa la entrega del proyecto EduFlow con capa de seguridad completa._

### Criterio 1: API Autenticada y Autorizada

| Nivel            | Porcentaje | Descripción                                                                                                                                                                                                                                 |
| ---------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Excelente**    | 100%       | Todos los endpoints protegidos requieren JWT válido. Roles student/instructor/admin con acceso diferenciado. Respuestas 401 (sin token), 403 (sin permiso) y 200/201 (autorizado) correctas. Flujo completo: registro → login → uso de API. |
| **Bueno**        | 85%        | Al menos 80% de endpoints protegidos con JWT. Al menos 2 roles diferenciados funcionando. Respuestas HTTP semánticamente correctas.                                                                                                         |
| **Aceptable**    | 70%        | Autenticación JWT funcional. Al menos un nivel de autorización (autenticado vs no autenticado). La API no acepta requests sin token válido.                                                                                                 |
| **Insuficiente** | <70%       | La API acepta requests sin autenticación o la autenticación no funciona consistentemente.                                                                                                                                                   |

### Criterio 2: Docker Compose con Seguridad

| Nivel            | Porcentaje | Descripción                                                                                                                                                                                  |
| ---------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Excelente**    | 100%       | `docker-compose.yml` actualizado con variables de entorno para JWT_SECRET, contraseña de BD desde `.env`. Sin secretos hardcodeados. `docker compose up` levanta el stack completo con auth. |
| **Bueno**        | 85%        | Docker Compose funcional con variables de entorno. La app arranca correctamente con autenticación. Puede tener algún secreto en el archivo compose pero no en el código fuente.              |
| **Aceptable**    | 70%        | Docker Compose arranca el stack. La autenticación funciona en el contenedor. Algún área de mejora en gestión de secretos.                                                                    |
| **Insuficiente** | <70%       | El stack no levanta o la autenticación no funciona en el entorno containerizado.                                                                                                             |

### Criterio 3: Documentación y Decisiones Arquitectónicas

| Nivel            | Porcentaje | Descripción                                                                                                                                                                                                                          |
| ---------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Excelente**    | 100%       | README actualizado con diagrama de flujo de autenticación. Sección de seguridad con decisiones justificadas (ej: por qué JWT sobre sesiones, por qué RBAC sobre ACL). Análisis OWASP de la aplicación con mitigaciones documentadas. |
| **Bueno**        | 85%        | README actualizado con instrucciones de autenticación. Decisiones arquitectónicas documentadas con justificación técnica.                                                                                                            |
| **Aceptable**    | 70%        | README menciona el sistema de autenticación. Hay alguna documentación de las decisiones tomadas.                                                                                                                                     |
| **Insuficiente** | <70%       | Sin documentación de la capa de seguridad implementada.                                                                                                                                                                              |

---

## 📝 Tabla Resumen de Calificación

| Evidencia             | Criterio            | Peso dentro de evidencia | Peso global |
| --------------------- | ------------------- | ------------------------ | ----------- |
| 🧠 Conocimiento (30%) | CIA Triad           | 25%                      | 7.5%        |
|                       | JWT y Autenticación | 25%                      | 7.5%        |
|                       | OAuth 2.0           | 25%                      | 7.5%        |
|                       | OWASP Top 10        | 25%                      | 7.5%        |
| 💪 Desempeño (40%)    | JWT Implementación  | 25%                      | 10%         |
|                       | RBAC Autorización   | 25%                      | 10%         |
|                       | Hardening           | 25%                      | 10%         |
|                       | Gestión de Secretos | 25%                      | 10%         |
| 📦 Producto (30%)     | API Autenticada     | 40%                      | 12%         |
|                       | Docker + Seguridad  | 30%                      | 9%          |
|                       | Documentación       | 30%                      | 9%          |
| **Total**             |                     |                          | **100%**    |

---

> **Recuerda**: La seguridad no es un feature adicional — es una propiedad arquitectónica que se diseña desde el inicio.

_Bootcamp de Arquitectura de Software — SENA · bc-channel-epti_
