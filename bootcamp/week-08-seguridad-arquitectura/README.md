# 📅 Semana 08: Seguridad en la Arquitectura

> **Tema Central**: Seguridad by Design — Proteger sistemas desde el diseño, no como parche final

---

## 🎯 Objetivos de Aprendizaje

Al finalizar esta semana, serás capaz de:

- ✅ Aplicar la triada CIA (Confidencialidad, Integridad, Disponibilidad) como lente de diseño arquitectónico
- ✅ Distinguir autenticación de autorización y elegir el mecanismo correcto según el contexto
- ✅ Implementar autenticación basada en JWT en una API Node.js con buenas prácticas
- ✅ Diseñar un sistema de autorización con RBAC (Role-Based Access Control)
- ✅ Identificar y mitigar las vulnerabilidades del OWASP Top 10 relevantes para la arquitectura
- ✅ Aplicar principios de Secure by Default y Least Privilege en el diseño de componentes
- ✅ Agregar una capa de seguridad completa al proyecto EduFlow ya containerizado

---

## 📚 Contenido Teórico (4 horas presenciales)

1. **[Fundamentos de Seguridad: CIA Triad y Principios](1-teoria/01-seguridad-fundamentos-cia.md)** (45 min)
   - Confidencialidad, Integridad y Disponibilidad como base del diseño
   - Principios: Least Privilege, Defense in Depth, Fail Securely
   - Superficies de ataque y cómo minimizarlas
   - Seguridad vs usabilidad: el equilibrio arquitectónico

2. **[Autenticación y Autorización: OAuth 2.0 y JWT](1-teoria/02-autenticacion-autorizacion.md)** (90 min)
   - Autenticación vs autorización: la confusión más cara del desarrollo
   - JWT: estructura, firma, verificación y vulnerabilidades comunes
   - OAuth 2.0: flujos, roles y cuándo usar cada grant type
   - RBAC: permisos basados en roles para APIs
   - Almacenamiento seguro de contraseñas con bcrypt

3. **[OWASP Top 10 para Arquitectos](1-teoria/03-owasp-top10-arquitectos.md)** (60 min)
   - Las 10 vulnerabilidades más críticas desde la perspectiva arquitectónica
   - Injection, Broken Access Control, Cryptographic Failures
   - Security Misconfiguration y Vulnerable Components
   - Cómo el diseño arquitectónico previene (o causa) cada vulnerabilidad

4. **[Implementación Segura en Node.js](1-teoria/04-seguridad-nodejs-implementacion.md)** (45 min)
   - Headers de seguridad con Helmet.js
   - Rate limiting y protección contra fuerza bruta
   - Validación y sanitización de entradas
   - Variables de entorno seguras y gestión de secretos

---

## 🎨 Material Visual

Los siguientes diagramas están vinculados en los archivos de teoría:

1. **[01-cia-triad.svg](0-assets/01-cia-triad.svg)** — Triada CIA y su relación con el sistema
2. **[02-jwt-estructura.svg](0-assets/02-jwt-estructura.svg)** — Anatomía de un JWT: header, payload, signature
3. **[03-oauth-flujo.svg](0-assets/03-oauth-flujo.svg)** — Flujo Authorization Code con PKCE
4. **[04-rbac-modelo.svg](0-assets/04-rbac-modelo.svg)** — Usuarios → Roles → Permisos → Recursos
5. **[05-owasp-top10.svg](0-assets/05-owasp-top10.svg)** — Top 10 OWASP 2021 para arquitectos

---

## 💻 Prácticas (2 horas autónomas)

1. **[JWT: Autenticación en Node.js](2-practicas/01-practica-jwt-autenticacion.md)** (40 min)
   - Implementar login con generación de JWT
   - Middleware de verificación de token
   - Refresh tokens y expiración segura

2. **[RBAC: Autorización por Roles](2-practicas/02-practica-rbac-autorizacion.md)** (40 min)
   - Diseñar modelo de roles y permisos
   - Middleware de autorización reutilizable
   - Proteger endpoints según rol del usuario

3. **[Hardening OWASP en Express.js](2-practicas/03-practica-hardening-owasp.md)** (40 min)
   - Helmet.js, rate limiting, CORS seguro
   - Validación de entradas con Joi/Zod
   - Auditar dependencias con `pnpm audit`

---

## 🎯 Reto de la Semana

**[Reto: EduFlow Secure — Autenticación y autorización completa](reto-semana-08.md)**

> EduFlow ya está containerizado. Ahora el equipo necesita que solo los usuarios autenticados puedan usar la API, y que cada rol (estudiante, instructor, admin) tenga acceso solo a lo que corresponde.

---

## 🚀 Proyecto Integrador

**[Proyecto: EduFlow Secure — Capa de Seguridad Completa](3-proyecto/proyecto-semana-08.md)**

Agregar autenticación JWT + autorización RBAC a la API hexagonal containerizada de EduFlow.

---

## 📦 Recursos

- **[E-books gratuitos](4-recursos/ebooks-free/README.md)** — OWASP Testing Guide, Web Application Hacker's Handbook
- **[Videografía](4-recursos/videografia/README.md)** — Tutoriales JWT, OAuth, OWASP
- **[Webgrafía](4-recursos/webgrafia/README.md)** — OWASP.org, JWT.io, Auth0 Docs

---

## 📖 Glosario

**[Términos clave de Seguridad en Arquitectura](5-glosario/README.md)** — CIA, JWT, OAuth, RBAC, XSS, CSRF, OWASP y más.

---

## 🗓️ Distribución de Horas

| Actividad                    | Tipo       | Duración    |
| ---------------------------- | ---------- | ----------- |
| Fundamentos CIA Triad        | Presencial | 45 min      |
| Autenticación y Autorización | Presencial | 90 min      |
| OWASP Top 10                 | Presencial | 60 min      |
| Seguridad en Node.js         | Presencial | 45 min      |
| **Total presencial**         |            | **4 horas** |
| Práctica JWT                 | Autónomo   | 40 min      |
| Práctica RBAC                | Autónomo   | 40 min      |
| Práctica Hardening           | Autónomo   | 40 min      |
| **Total autónomo**           |            | **2 horas** |
| **TOTAL SEMANA**             |            | **6 horas** |

---

## 🔗 Navegación del Bootcamp

| Semana                              | Tema                                          |
| ----------------------------------- | --------------------------------------------- |
| [← Semana 07](../week-07-arquitectura-nube/README.md) | Arquitectura en la Nube                       |
| **Semana 08**                       | **Seguridad en la Arquitectura** ← Estás aquí |
| [→ Semana 09](../week-09-proyecto-integrador-final/README.md) | Proyecto Integrador Final                     |

---

_Bootcamp de Arquitectura de Software — SENA · bc-channel-epti_
