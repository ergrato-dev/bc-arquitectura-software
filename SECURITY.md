# 🔒 Política de Seguridad

## 🎯 Alcance

Este documento describe la política de seguridad para el **Bootcamp de Arquitectura de Software**. Aunque este es un proyecto educativo, tomamos la seguridad seriamente tanto en el material educativo como en los ejemplos de código que proporcionamos.

---

## 🛡️ Versiones Soportadas

| Versión              | Soporte          | Notas                                         |
| -------------------- | ---------------- | --------------------------------------------- |
| Main (actual)        | ✅ Soportada     | Rama principal activa                         |
| Versiones anteriores | ❌ No soportadas | Solo la última versión recibe actualizaciones |

**Nota**: Como proyecto educativo en desarrollo activo, solo mantenemos la rama `main`.

---

## 🚨 Reportar una Vulnerabilidad

### Tipos de Vulnerabilidades

Nos interesa conocer sobre:

#### En el Material Educativo

- ❌ Ejemplos de código con vulnerabilidades de seguridad
- ❌ Prácticas inseguras enseñadas como correctas
- ❌ Información sensible expuesta en ejemplos
- ❌ Dependencias con vulnerabilidades conocidas

#### En la Infraestructura

- ❌ Problemas de seguridad en el repositorio
- ❌ Acceso no autorizado a recursos
- ❌ Exposición de credenciales o secretos

#### Fuera de Alcance

- ✅ Proyectos personales de estudiantes (no somos responsables)
- ✅ Forks del repositorio (responsabilidad del fork)
- ✅ Implementaciones en producción del material (uso es bajo responsabilidad del usuario)

### Cómo Reportar

#### Para Vulnerabilidades de Seguridad Críticas

**NO abras un Issue público.**

En su lugar:

1. **GitHub Security Advisories** (Preferido):
   - Ve a la pestaña "Security" del repositorio
   - Haz clic en "Report a vulnerability"
   - Completa el formulario con los detalles

2. **Email Privado**:
   - Envía un email a los mantenedores
   - Asunto: `[SECURITY] Descripción breve`
   - Incluye todos los detalles que puedas

#### Para Problemas de Seguridad No Críticos

Para problemas menores o dudas sobre seguridad en ejemplos:

- Abre un Issue normal
- Usa la etiqueta `security`
- Describe el problema claramente

### Información a Incluir

Al reportar una vulnerabilidad, incluye:

```markdown
## Descripción

[Descripción clara del problema de seguridad]

## Tipo de Vulnerabilidad

- [ ] Inyección (SQL, XSS, etc.)
- [ ] Autenticación/Autorización
- [ ] Exposición de datos sensibles
- [ ] Configuración insegura
- [ ] Dependencia vulnerable
- [ ] Otro: ****\_****

## Ubicación

- Archivo: [ruta/al/archivo.js]
- Líneas: [10-25]
- Semana: [week-XX]

## Impacto

[Qué tan grave es y qué podría pasar]

## Pasos para Reproducir

1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

## Comportamiento Esperado

[Qué debería pasar en su lugar]

## Evidencia

[Screenshots, logs, o código que demuestre el problema]

## Sugerencia de Corrección

[Si tienes una idea de cómo corregirlo]

## Contexto Adicional

[Cualquier otra información relevante]
```

---

## ⏱️ Proceso de Respuesta

### Tiempos Estimados

| Gravedad   | Respuesta Inicial | Resolución Objetivo |
| ---------- | ----------------- | ------------------- |
| 🔴 Crítica | 24 horas          | 7 días              |
| 🟠 Alta    | 48 horas          | 14 días             |
| 🟡 Media   | 72 horas          | 30 días             |
| 🟢 Baja    | 1 semana          | Próxima release     |

**Nota**: Como proyecto mantenido por voluntarios, estos son objetivos, no garantías.

### Clasificación de Gravedad

#### 🔴 Crítica

- Exposición de credenciales reales
- Vulnerabilidad explotable remotamente
- Pérdida de datos sensibles
- Compromiso del repositorio

#### 🟠 Alta

- Vulnerabilidad en ejemplo de código que enseña práctica insegura
- Dependencia con CVE crítico
- XSS o inyección SQL en ejemplos

#### 🟡 Media

- Configuración insegura en ejemplos
- Falta de validación en código de muestra
- Dependencia con CVE no crítico

#### 🟢 Baja

- Mejoras generales de seguridad
- Advertencias de seguridad faltantes
- Documentación de seguridad incompleta

### Pasos del Proceso

1. **Recepción**: Confirmamos haber recibido el reporte
2. **Evaluación**: Verificamos y clasificamos la vulnerabilidad
3. **Planificación**: Determinamos cómo y cuándo corregir
4. **Desarrollo**: Creamos y probamos la corrección
5. **Revisión**: Revisamos la corrección internamente
6. **Despliegue**: Aplicamos la corrección a `main`
7. **Divulgación**: Publicamos el advisory (si aplica)
8. **Notificación**: Informamos al reportante

---

## 🔐 Mejores Prácticas de Seguridad

### Para Estudiantes

Al trabajar con el material del bootcamp:

✅ **HAZ**:

- Usa `.env` para credenciales en tus proyectos
- Nunca subas `.env` a Git
- Usa secretos simulados en ejemplos
- Valida todos los inputs del usuario
- Sanitiza datos antes de mostrarlos
- Usa HTTPS para APIs en producción
- Mantén dependencias actualizadas
- Implementa autenticación apropiada

❌ **NO HAGAS**:

- Usar contraseñas reales en código
- Exponer API keys en repositorios
- Ignorar advertencias de seguridad
- Copiar código sin entenderlo
- Deshabilitar características de seguridad
- Confiar ciegamente en inputs

### Para Contribuidores

Al agregar contenido:

✅ **Asegúrate de**:

- Usar credenciales ficticias en ejemplos
- Comentar riesgos de seguridad
- Incluir validación en ejemplos
- Mencionar OWASP Top 10 cuando sea relevante
- Enseñar security by design
- Documentar por qué algo es seguro/inseguro

❌ **Evita**:

- Incluir secretos reales
- Mostrar código vulnerable sin advertencia
- Enseñar prácticas inseguras
- Usar dependencias desactualizadas
- Ignorar validación de inputs

---

## 📚 Recursos de Seguridad

### Para Aprender

- 🔗 [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- 🔗 [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- 🔗 [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- 🔗 [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- 🔗 [Snyk Learn](https://learn.snyk.io/)

### Herramientas Recomendadas

- 🛠️ **npm audit**: Escanea dependencias vulnerables

  ```bash
  pnpm audit
  ```

- 🛠️ **ESLint Security Plugin**: Detecta patrones inseguros

  ```bash
  pnpm add -D eslint-plugin-security
  ```

- 🛠️ **Git Secrets**: Previene commits de secretos
  ```bash
  git secrets --scan
  ```

---

## 🎓 Seguridad en Arquitectura (Contenido del Bootcamp)

La **Semana 8** del bootcamp cubre específicamente:

- Principios de Security by Design
- Autenticación y Autorización (OAuth, JWT)
- Cifrado de datos
- Protección contra OWASP Top 10
- Seguridad en arquitecturas cloud
- Secure SDLC

Si encuentras que el material necesita mejoras, ¡contribuye!

---

## 📝 Divulgación Responsable

### Nuestra Política

- ✅ Te acreditaremos en el advisory (si lo deseas)
- ✅ Te mantendremos informado del progreso
- ✅ No tomaremos acciones legales contra reportes de buena fe
- ✅ Trabajaremos contigo para entender el problema

### Pedimos que

- ⏳ Nos des tiempo razonable para corregir antes de divulgar públicamente
- 🤝 No explotes la vulnerabilidad
- 🔒 Mantengas confidencial la información hasta que se corrija
- 📧 Te comuniques de forma profesional

---

## 🏆 Reconocimientos

Agradecemos a quienes han reportado vulnerabilidades:

<!-- Lista de personas que han reportado vulnerabilidades -->

- Actualmente: Ninguna vulnerabilidad reportada

**¿Quieres aparecer aquí?** Ayúdanos a mantener el proyecto seguro.

---

## 📞 Contacto

Para preguntas sobre esta política:

- 📧 Abre un Issue con la etiqueta `security`
- 🔒 Para temas sensibles, usa GitHub Security Advisories
- 📖 Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para más información

---

## 🔄 Actualizaciones de esta Política

Esta política puede actualizarse periódicamente. Los cambios significativos se anunciarán en:

- Release notes
- README principal
- Comunicación directa a contribuidores activos

---

**La seguridad es responsabilidad de todos. Gracias por ayudarnos a mantener este proyecto seguro para la comunidad educativa.**

🎓 **SENA - Bootcamp de Arquitectura de Software** 🚀

_Última actualización: Febrero 2026_
_Versión: 1.0_
