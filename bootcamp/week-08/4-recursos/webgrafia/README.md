# 🌐 Webgrafía — Seguridad en Arquitectura de Software

## 📚 Recursos Oficiales

### 1. **OWASP.org**

- 🔗 **URL**: https://owasp.org
- 📖 **Descripción**: La referencia mundial en seguridad de aplicaciones web. Libre y de código abierto.
- 🎯 **Páginas clave**:
  - [Top 10 2021](https://owasp.org/Top10/)
  - [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
  - [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

### 2. **MDN Web Security**

- 🔗 **URL**: https://developer.mozilla.org/en-US/docs/Web/Security
- 📖 **Descripción**: Documentación de Mozilla sobre seguridad web: CSP, CORS, cookies seguras, HTTPS.
- ⭐ **Nivel**: Principiante-Intermedio
- 🌍 **Idioma**: Español/Inglés

### 3. **Node.js Security Best Practices**

- 🔗 **URL**: https://nodejs.org/en/docs/guides/security
- 📖 **Descripción**: Guía oficial del equipo de Node.js con recomendaciones de seguridad específicas para el ecosistema Node/npm.
- ⭐ **Nivel**: Intermedio

---

## 🔑 JWT y Autenticación

### 4. **JWT.io**

- 🔗 **URL**: https://jwt.io
- 📖 **Descripción**: Debugger interactivo para JWT + documentación de la especificación. Permite decodificar y verificar tokens en tiempo real.
- 🎯 **Usos**: Debug de tokens durante el desarrollo, entender el payload

### 5. **OWASP Authentication Cheat Sheet**

- 🔗 **URL**: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- 📖 **Descripción**: Checklist completo para implementar autenticación segura: contraseñas, MFA, bloqueo de cuenta, mensajes de error.
- ⭐ **Nivel**: Intermedio

### 6. **OWASP JSON Web Token Cheat Sheet**

- 🔗 **URL**: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
- 📖 **Descripción**: Ataques específicos contra JWT (alg:none, weak key, kid injection) y cómo prevenirlos.
- ⭐ **Nivel**: Intermedio-Avanzado

---

## 🛡️ Librerías del Stack

### 7. **Helmet.js**

- 🔗 **URL**: https://helmetjs.github.io/
- 📖 **Descripción**: Documentación de todos los headers que configura Helmet y su propósito de seguridad.
- 🎯 **Ver**: Lista de headers en la sección "How it works"

### 8. **express-rate-limit**

- 🔗 **URL**: https://www.npmjs.com/package/express-rate-limit
- 📖 **Descripción**: Documentación con todas las opciones de configuración del rate limiter.
- 🎯 **Ver**: `keyGenerator` para personalizar la clave de limitación

### 9. **bcrypt npm**

- 🔗 **URL**: https://www.npmjs.com/package/bcrypt
- 📖 **Descripción**: Documentación de la librería bcrypt: API de hash y compare, explicación de rondas y costo.

### 10. **Zod**

- 🔗 **URL**: https://zod.dev
- 📖 **Descripción**: Documentación completa de Zod: validación de schemas, transformaciones, mensajes de error personalizados.
- 🎯 **Ver**: Sección "Basic Usage" y "Error Handling"

---

## 🎓 Tutoriales y Artículos

### 11. **How bcrypt Works — Auth0 Blog**

- 🔗 **URL**: https://auth0.com/blog/hashing-in-action-understanding-bcrypt/
- 📖 **Descripción**: Explicación profunda de cómo funciona bcrypt internamente y por qué resiste ataques de fuerza bruta.
- ⭐ **Nivel**: Intermedio

### 12. **Understanding JWT — Fireship**

- 🔗 **URL**: https://www.youtube.com/watch?v=UBUNrFtufWo
- 📖 **Descripción**: Video corto (100s) sobre la esencia de JWT. Excelente introducción visual.

### 13. **OAuth 2.0 & PKCE — Aaron Parecki**

- 🔗 **URL**: https://www.oauth.com/oauth2-servers/pkce/
- 📖 **Descripción**: Explicación detallada del flujo PKCE: cuándo es necesario y cómo implementarlo.
- ⭐ **Nivel**: Intermedio

### 14. **CORS in Depth — Mozilla Hacks**

- 🔗 **URL**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- 📖 **Descripción**: Explicación completa de CORS: preflight, credenciales, headers permitidos.
- ⭐ **Nivel**: Principiante-Intermedio

---

## 🔧 Herramientas Online

| Herramienta            | URL                                          | Para qué                            |
| ---------------------- | -------------------------------------------- | ----------------------------------- |
| JWT Debugger           | https://jwt.io                               | Decodificar y verificar tokens      |
| OWASP Threat Dragon    | https://owasp.org/www-project-threat-dragon/ | Modelado de amenazas                |
| Security Headers       | https://securityheaders.com                  | Verificar headers de una URL real   |
| Have I Been Pwned      | https://haveibeenpwned.com                   | Comprobar si email fue comprometido |
| Observatory by Mozilla | https://observatory.mozilla.org              | Auditar seguridad HTTP de una web   |
