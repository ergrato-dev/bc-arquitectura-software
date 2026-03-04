# 📹 Videografía — Seguridad en Arquitectura de Software

## 🎯 Canal YouTube: bc-channel-epti

### Serie Semana 08: Seguridad en la Arquitectura

---

## 📺 Videos de Teoría

### 1. **¿Por Qué la Seguridad es una Decisión Arquitectónica?**

- ⏱️ **Duración**: 15-20 minutos
- 🎯 **Temas**:
  - La Tríada CIA: Confidencialidad, Integridad, Disponibilidad
  - Secure by Design vs Security as an afterthought
  - Casos reales: Equifax 2017, LinkedIn 2012
  - Principio de mínimo privilegio
- 📝 **Incluye**: Demos en código Node.js
- 🔗 **Link**: `[Próximamente en bc-channel-epti]`

### 2. **JWT desde Cero: Autenticación sin Estado**

- ⏱️ **Duración**: 20-25 minutos
- 🎯 **Temas**:
  - Anatomía de un JWT (header.payload.signature)
  - Firmar y verificar con jsonwebtoken
  - AccessToken vs RefreshToken
  - Ataques comunes: alg:none, weak secret
- 💻 **Demo**: RegisterUseCase + LoginUseCase en hexagonal
- 🔗 **Link**: `[Próximamente en bc-channel-epti]`

### 3. **RBAC: Controla Quién Puede Hacer Qué**

- ⏱️ **Duración**: 15-20 minutos
- 🎯 **Temas**:
  - Users → Roles → Permissions → Resources
  - Diferencia entre autenticación y autorización
  - Middleware `authorize()` como fábrica
  - Ownership checks
- 💻 **Demo**: API con 3 roles y matriz de permisos
- 🔗 **Link**: `[Próximamente en bc-channel-epti]`

### 4. **OWASP Top 10 para Arquitectos de Software**

- ⏱️ **Duración**: 20-25 minutos
- 🎯 **Temas**:
  - Las 10 vulnerabilidades con código vulnerable vs seguro
  - Cómo cada vulnerabilidad se traduce en una decisión de diseño
  - Tabla de impacto: Crítico → Medio
- 💻 **Demo**: Cada una en ejemplos de Node.js
- 🔗 **Link**: `[Próximamente en bc-channel-epti]`

---

## 🛠️ Videos de Práctica

### 5. **Práctica: JWT Auth paso a paso en Node.js**

- ⏱️ **Duración**: 25-30 minutos
- 🎯 **Objetivo**: Implementar `PasswordService` + `TokenService` + `authenticate`
- 💻 **Código**: Desde cero, prueba del experimento con `experimento-jwt.js`
- 🔗 **Link**: `[Próximamente en bc-channel-epti]`

### 6. **Práctica: RBAC — Diseño e implementación**

- ⏱️ **Duración**: 25-30 minutos
- 🎯 **Objetivo**: Diseñar la matriz de roles → implementar `authorize` factory
- 💻 **Código**: Router protegido + tests de autorización sin BD
- 🔗 **Link**: `[Próximamente en bc-channel-epti]`

### 7. **Práctica: Hardening HTTP con Helmet, Rate Limit y Zod**

- ⏱️ **Duración**: 25-30 minutos
- 🎯 **Objetivo**: Verificar headers con `curl -I`, probar rate limiting con script
- 💻 **Código**: `createApp()` con todas las mitigaciones integradas
- 🔗 **Link**: `[Próximamente en bc-channel-epti]`

---

## 🌐 Videos de Referencia Recomendados (externos)

### 8. **Web Security in 2024 — Fireship**

- 🔗 [youtube.com/watch?v=boy5SL1-pSU](https://www.youtube.com/watch?v=boy5SL1-pSU)
- ⏱️ Duración: ~11 minutos
- 📖 Resumen visual rápido de las principales amenazas web

### 9. **Never Store Secrets in Code — Computerphile**

- 🔗 [youtube.com/watch?v=2uesh7ISmjs](https://www.youtube.com/watch?v=2uesh7ISmjs)
- ⏱️ Duración: ~14 minutos
- 📖 Por qué los secretos en código fuente son un riesgo enorme

### 10. **OAuth 2.0 and OpenID Connect (in plain English)**

- 🔗 [youtube.com/watch?v=996OiexHze0](https://www.youtube.com/watch?v=996OiexHze0)
- ⏱️ Duración: ~26 minutos
- 📖 La explicación más clara de OAuth 2.0 para desarrolladores

### 11. **bcrypt Explained — Computerphile**

- 🔗 [youtube.com/watch?v=O6cmuiTBZVs](https://www.youtube.com/watch?v=O6cmuiTBZVs)
- ⏱️ Duración: ~9 minutos
- 📖 Funcionamiento interno de bcrypt y por qué no usar MD5

---

## 📊 Playlist Sugerida para la Semana

| Orden | Video                      | Cuándo verlo              |
| ----- | -------------------------- | ------------------------- |
| 1     | CIA Triad (Teoría)         | Antes de clase presencial |
| 2     | JWT desde Cero             | Antes de práctica 01      |
| 3     | RBAC (Teoría)              | Antes de práctica 02      |
| 4     | OWASP Top 10               | Antes de práctica 03      |
| 5     | OAuth 2.0 in plain English | Hora autónoma             |
| 6     | bcrypt Explained           | Hora autónoma             |
