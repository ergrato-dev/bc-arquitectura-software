# 📖 Glosario de Seguridad en Arquitectura de Software

> Términos clave de la Semana 08 ordenados alfabéticamente.

---

## A

**Access Token**
JWT de vida corta (típicamente 15 minutos) que se incluye en el header `Authorization: Bearer` de cada petición HTTP. Autoriza al portador a acceder a recursos protegidos. No debe confundirse con el Refresh Token.

**Aggregate (DDD)**
Cluster de objetos de dominio tratado como una unidad. En seguridad, el aggregate encapsula las reglas de negocio sin depender de cómo se implementa la autenticación (que vive en la capa de infraestructura).

**Algoritmo HS256**
Algoritmo de firma HMAC-SHA256 para JWT. Usa una clave simétrica (el mismo secreto firma y verifica). Para producción con múltiples servicios se prefiere RS256 (clave asimétrica).

**Autenticación (AuthN)**
Proceso de verificar _quién eres_. En APIs REST se implementa habitualmente con JWT. "¿Quién dice ser este token?"

**Autorización (AuthZ)**
Proceso de verificar _qué puedes hacer_. Ocurre después de la autenticación. "¿Tiene este usuario permiso para esta acción?"

---

## B

**bcrypt**
Función de hash de contraseñas diseñada específicamente para ser lenta y resistir ataques de fuerza bruta. Incluye salt automático y un factor de costo (rondas) ajustable. Nunca uses MD5 o SHA1 para contraseñas.

**Bearer Token**
Esquema de autenticación HTTP donde el token se envía en el header `Authorization: Bearer <token>`. Quien tenga el token tiene acceso, de ahí "bearer" (portador).

**Broken Access Control (A01)**
La vulnerabilidad #1 del OWASP Top 10 2021. Ocurre cuando un usuario puede acceder a recursos o realizar acciones para los que no tiene permiso. Mitigación: RBAC correctamente implementado.

---

## C

**CIA Triad**
Los tres pilares de la seguridad de la información:

- **C**onfidentiality (Confidencialidad): solo usuarios autorizados pueden leer los datos
- **I**ntegrity (Integridad): los datos no han sido alterados
- **A**vailability (Disponibilidad): el sistema responde cuando se necesita

**Claims**
Declaraciones dentro del payload de un JWT. Ejemplos: `sub` (sujeto), `iat` (emitido en), `exp` (expira en), `role` (rol personalizado).

**Content Security Policy (CSP)**
Header HTTP que restringe qué recursos puede cargar el navegador y desde dónde. Uno de los headers que configura Helmet.js. Mitiga ataques XSS.

**CORS (Cross-Origin Resource Sharing)**
Mecanismo HTTP que controla qué orígenes externos pueden hacer peticiones a tu API. Configuración insegura (Access-Control-Allow-Origin: \*) expone la API a peticiones desde cualquier dominio.

**Cryptographic Failures (A02)**
Vulnerabilidad OWASP que cubre datos sensibles sin cifrar o con algoritmos obsoletos. Incluye contraseñas en texto plano, uso de MD5/SHA1 y transmisión sin HTTPS.

---

## D

**Defense in Depth**
Principio de seguridad que propone múltiples capas de defensa. Si una falla, las demás siguen protegiendo. En una API: validación de entrada + autenticación + autorización + rate limiting + logging.

---

## E

**ENV (Variables de Entorno)**
Mecanismo para separar la configuración del código fuente. Los secretos (JWT_SECRET, DATABASE_URL) nunca deben estar hardcodeados en el código. Se gestionan con archivo `.env` (no trackeado en git) y `.env.example` (plantilla pública).

---

## F

**Fail Securely**
Principio que indica que cuando ocurre un error, el sistema debe fallar en un estado seguro, no inseguro. Ejemplo: si el JWT no puede verificarse, retornar 401, no continuar la ejecución.

---

## H

**Hardening**
Proceso de endurecer la configuración de un sistema para reducir su superficie de ataque. En Node.js incluye: Helmet, rate limiting, CORS restrictivo, validación de entrada y gestión segura de secretos.

**Helmet.js**
Middleware de Express que configura ~12 headers HTTP de seguridad en una sola línea: `app.use(helmet())`. Entre ellos: X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security.

**HMAC (Hash-based Message Authentication Code)**
Construcción criptográfica que usa una clave secreta y una función hash para crear un código de autenticación. La firma de los JWT HS256 usa HMAC-SHA256.

---

## I

**Injection (A03)**
Vulnerabilidad OWASP que ocurre cuando datos no validados son interpretados como comandos. Tipos: SQL injection, NoSQL injection, OS command injection. Mitigación: parámetros preparados + validación con Zod.

---

## J

**JWT (JSON Web Token)**
Estándar abierto (RFC 7519) para transmitir información de forma segura entre dos partes. Compuesto por tres partes codificadas en base64url separadas por puntos: `header.payload.signature`. La firma garantiza integridad pero el payload **no está cifrado** — no guardar secretos en él.

---

## L

**Least Privilege (Mínimo Privilegio)**
Principio que establece que cada componente o usuario debe tener solo los permisos mínimos necesarios para su función. Reduce el impacto si una cuenta o componente es comprometido.

---

## M

**Middleware**
Función en Express que se ejecuta en el pipeline de una petición HTTP antes del handler final. Los middlewares de seguridad (`authenticate`, `authorize`, `validate`) son el mecanismo central para implementar la capa de seguridad.

---

## O

**OAuth 2.0**
Framework de autorización (RFC 6749) que permite que una aplicación (Client) acceda a recursos en nombre de un usuario (Resource Owner) sin exponer sus credenciales. Flujos principales: Authorization Code + PKCE (recomendado para web/móvil).

**OWASP (Open Worldwide Application Security Project)**
Organización sin fines de lucro que produce guías, herramientas y estándares de seguridad de software. Su publicación más conocida es el OWASP Top 10.

**OWASP Top 10**
Lista de las 10 vulnerabilidades más críticas en aplicaciones web, actualizada periódicamente. La versión 2021 incluye: Broken Access Control, Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration, Vulnerable Components, Authentication Failures, Data/Software Integrity Failures, Logging Failures, SSRF.

---

## P

**PKCE (Proof Key for Code Exchange)**
Extensión de OAuth 2.0 (RFC 7636) que previene el robo del authorization code. El cliente genera un `code_verifier` aleatorio y envía su hash (`code_challenge`) en el request inicial. El servidor verifica que el verifier coincide al canjear el código.

**Port (Hexagonal Architecture)**
Interfaz que define la forma de comunicación entre el dominio y el mundo exterior. Los `TokenService` y `PasswordService` son adaptadores que implementan puertos secundarios.

---

## R

**Rate Limiting**
Técnica para limitar el número de peticiones que un cliente puede hacer en un período de tiempo. Esencial en endpoints de autenticación para prevenir ataques de fuerza bruta. Implementado con `express-rate-limit` en Node.js.

**RBAC (Role-Based Access Control)**
Modelo de autorización donde los permisos se asignan a roles, y los roles se asignan a usuarios. Los permisos de un usuario se resuelven como la unión de los permisos de sus roles. Alternativas: ABAC (basado en atributos), ACL (listas de acceso).

**Refresh Token**
Token de vida larga (días o semanas) que se usa exclusivamente para obtener nuevos access tokens sin que el usuario tenga que hacer login de nuevo. Debe almacenarse de forma segura (httpOnly cookie o BD) y cada refresh token debe tener un solo uso.

---

## S

**Salt**
Valor aleatorio único que se agrega a la contraseña antes de hashearla. Evita que dos usuarios con la misma contraseña tengan el mismo hash y hace inútiles las tablas rainbow. bcrypt incluye el salt automáticamente en el hash resultante.

**Secure by Default**
Principio que establece que la configuración predeterminada de un sistema debe ser la más segura posible, sin requerir acción explícita del desarrollador. Helmet.js es un ejemplo: agrega todos los headers de seguridad por defecto.

**SSRF (Server-Side Request Forgery — A10)**
Vulnerabilidad donde el servidor hace peticiones HTTP a URLs controladas por el atacante, potencialmente accediendo a servicios internos o metadatos de cloud (ej: `http://169.254.169.254` en AWS).

**Strict-Transport-Security (HSTS)**
Header HTTP que fuerza al navegador a usar HTTPS para todas las peticiones a ese dominio, evitando ataques de downgrade. Configurado por Helmet.

---

## T

**Threat Modeling**
Proceso de identificar sistemáticamente las amenazas a un sistema, su probabilidad e impacto, y definir contramedidas. Herramientas: STRIDE, OWASP Threat Dragon.

**TLS (Transport Layer Security)**
Protocolo criptográfico que provee comunicación segura sobre la red (HTTPS = HTTP + TLS). En producción, toda la API debe servirse sobre TLS 1.2 o superior.

---

## X

**XSS (Cross-Site Scripting)**
Ataque donde se inyecta código JavaScript malicioso en una página web que luego se ejecuta en el browser de la víctima. Mitigado con Content-Security-Policy y escape de output.

---

## Z

**Zod**
Librería de validación de schemas con TypeScript-first. Permite definir el formato esperado de los datos de entrada y validarlos de forma segura antes de procesarlos, bloqueando datos malformados o intentos de inyección.
