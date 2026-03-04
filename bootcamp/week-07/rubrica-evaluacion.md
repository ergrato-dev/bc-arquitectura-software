# 📊 Rúbrica de Evaluación — Semana 07: Arquitectura en la Nube

> **Sistema de evaluación**: Competencias laborales SENA
> **Criterio de aprobación**: Mínimo 70% en cada evidencia

---

## Distribución de Evaluación

| Evidencia       | Porcentaje | Descripción                                            |
| --------------- | ---------- | ------------------------------------------------------ |
| 🧠 Conocimiento | 30%        | Comprensión de modelos cloud, Docker y Serverless      |
| 💪 Desempeño    | 40%        | Dockerfile funcional, docker-compose, buenas prácticas |
| 📦 Producto     | 30%        | EduFlow containerizado y documentado                   |

---

## 🧠 Evidencia de Conocimiento (30%)

_Evalúa la comprensión conceptual de los fundamentos cloud y de contenedores._

### Criterio 1: Modelos de Servicio Cloud (IaaS / PaaS / SaaS)

| Nivel            | Porcentaje | Descripción                                                                                                                                                                                    |
| ---------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Excelente**    | 100%       | Diferencia con precisión IaaS, PaaS y SaaS. Relaciona cada modelo con proveedores reales (EC2=IaaS, Heroku=PaaS, Salesforce=SaaS). Justifica cuándo usar cada uno según una arquitectura dada. |
| **Bueno**        | 85%        | Diferencia los tres modelos correctamente y menciona al menos un ejemplo por modelo. Tiene alguna duda al justificar la selección.                                                             |
| **Aceptable**    | 70%        | Distingue IaaS de SaaS pero confunde PaaS. Puede mencionar algún proveedor pero sin precisión.                                                                                                 |
| **Insuficiente** | <70%       | No diferencia los modelos o los confunde sistemáticamente.                                                                                                                                     |

### Criterio 2: Fundamentos de Docker

| Nivel            | Porcentaje | Descripción                                                                                                                                                                        |
| ---------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Excelente**    | 100%       | Explica la diferencia entre imagen y contenedor, el rol del Docker daemon, el proceso de build por capas y la función de un registry. Describe correctamente el multi-stage build. |
| **Bueno**        | 85%        | Explica imagen vs contenedor y el proceso de build. Tiene conceptos básicos del multi-stage build.                                                                                 |
| **Aceptable**    | 70%        | Comprende qué es un contenedor pero confunde imagen con contenedor o no explica el build por capas.                                                                                |
| **Insuficiente** | <70%       | No comprende la diferencia fundamental entre imagen y contenedor.                                                                                                                  |

### Criterio 3: Modelo Serverless y FaaS

| Nivel            | Porcentaje | Descripción                                                                                                                                                                                  |
| ---------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Excelente**    | 100%       | Explica el modelo evento-respuesta de serverless, el problema del cold start, escenarios donde conviene (alta variabilidad, funciones cortas) y donde no conviene (larga ejecución, estado). |
| **Bueno**        | 85%        | Comprende el modelo serverless y puede mencionar casos de uso válidos. Conoce el concepto de cold start.                                                                                     |
| **Aceptable**    | 70%        | Comprende que serverless implica "no administrar servidores" pero no profundiza en trade-offs.                                                                                               |
| **Insuficiente** | <70%       | No comprende el modelo serverless o lo confunde con PaaS.                                                                                                                                    |

### Criterio 4: Principios 12-Factor App

| Nivel            | Porcentaje | Descripción                                                                                                                                                    |
| ---------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Excelente**    | 100%       | Enumera y explica al menos 8 de los 12 factores. Relaciona cada factor con una práctica de código concreta (ej: Factor III = env vars, no config hardcodeada). |
| **Bueno**        | 85%        | Explica al menos 5 factores con ejemplos concretos.                                                                                                            |
| **Aceptable**    | 70%        | Conoce la existencia de la metodología 12-factor y puede mencionar 3 factores correctamente.                                                                   |
| **Insuficiente** | <70%       | No conoce la metodología 12-factor app.                                                                                                                        |

---

## 💪 Evidencia de Desempeño (40%)

_Evalúa la aplicación práctica de técnicas de containerización._

### Criterio 1: Dockerfile Funcional para Node.js

| Nivel            | Porcentaje | Descripción                                                                                                                                                                                                                        |
| ---------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Excelente**    | 100%       | Dockerfile con multi-stage build (deps separadas de producción), `node:20-alpine` como imagen base, usuario no-root, `.dockerignore` completo, `HEALTHCHECK` definido, `EXPOSE` configurado. El build genera una imagen funcional. |
| **Bueno**        | 85%        | Dockerfile funcional con imagen alpine, usuario no-root y `.dockerignore`. Falta multi-stage o healthcheck pero la imagen buildea y corre correctamente.                                                                           |
| **Aceptable**    | 70%        | Dockerfile funcional que construye y corre la aplicación. Usa imagen no-alpine o corre como root pero la app funciona.                                                                                                             |
| **Insuficiente** | <70%       | Dockerfile no buildea, produce errores de construcción o la app no inicia.                                                                                                                                                         |

### Criterio 2: Docker Compose Multi-servicio

| Nivel            | Porcentaje | Descripción                                                                                                                                                                                                                                         |
| ---------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Excelente**    | 100%       | `docker-compose.yml` con api + db + health checks. `depends_on` con condición `service_healthy`. Variables de entorno desde `.env`. Volumen nombrado para PostgreSQL. Red personalizada. `docker compose up` levanta el stack completo sin errores. |
| **Bueno**        | 85%        | Docker Compose funcional con api + db. Variables de entorno correctas. Falta health check en `depends_on` (usa solo `depends_on: db`) pero el stack arranca.                                                                                        |
| **Aceptable**    | 70%        | Docker Compose con dos servicios que arrancan. Puede tener hardcoding de credenciales o falta de volumen persistente.                                                                                                                               |
| **Insuficiente** | <70%       | Docker Compose no levanta el stack o solo corre un servicio.                                                                                                                                                                                        |

### Criterio 3: Gestión de Variables de Entorno y Secretos

| Nivel            | Porcentaje | Descripción                                                                                                                                                                                                                  |
| ---------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Excelente**    | 100%       | Todas las configuraciones (puerto, URL de BD, credenciales) vienen de variables de entorno. `.env.example` documentado con descripción de cada variable. `.env` en `.gitignore` y `.dockerignore`. Sin valores hardcodeados. |
| **Bueno**        | 85%        | Variables de entorno usadas correctamente. `.env.example` existe. Puede faltar alguna variable no crítica.                                                                                                                   |
| **Aceptable**    | 70%        | La mayoría de configuraciones vienen de env vars. Puede tener algún valor hardcodeado no crítico.                                                                                                                            |
| **Insuficiente** | <70%       | Credenciales o configuraciones hardcodeadas en el código o en el Dockerfile.                                                                                                                                                 |

### Criterio 4: Health Check y Resiliencia

| Nivel            | Porcentaje | Descripción                                                                                                                                                                            |
| ---------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Excelente**    | 100%       | Endpoint `/health` implementado en la API retornando JSON con status. `HEALTHCHECK` en Dockerfile apuntando a este endpoint. `depends_on` con `condition: service_healthy` para la BD. |
| **Bueno**        | 85%        | Endpoint `/health` funcional. HEALTHCHECK en Dockerfile o en docker-compose (no necesariamente ambos).                                                                                 |
| **Aceptable**    | 70%        | Endpoint `/health` implementado pero sin HEALTHCHECK configurado en Docker.                                                                                                            |
| **Insuficiente** | <70%       | No hay endpoint de health ni healthcheck configurado.                                                                                                                                  |

---

## 📦 Evidencia de Producto (30%)

_Evalúa el entregable final y su calidad de producción._

### Criterio 1: EduFlow Containerizado Funcional

| Nivel            | Porcentaje | Descripción                                                                                                                                                                                                                         |
| ---------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Excelente**    | 100%       | `docker compose up --build` desde un clon limpio del repositorio levanta el stack completo. La API responde en `/health`, `/api/courses` y `/api/enrollments`. Los datos persisten tras `docker compose down && docker compose up`. |
| **Bueno**        | 85%        | El stack levanta y la api responde. Puede haber algún endpoint que requiera pasos manuales adicionales (ej: correr migración).                                                                                                      |
| **Aceptable**    | 70%        | El stack levanta pero requiere pasos adicionales no documentados o algún endpoint falla.                                                                                                                                            |
| **Insuficiente** | <70%       | `docker compose up` falla o la API no responde con el stack levantado.                                                                                                                                                              |

### Criterio 2: Documentación del Proyecto

| Nivel            | Porcentaje | Descripción                                                                                                                                                                               |
| ---------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Excelente**    | 100%       | README con instrucciones de instalación (requisitos, clonar, copiar .env, levantar). Responde las 5 preguntas de reflexión del reto. Incluye comandos útiles (`logs`, `exec`, `down -v`). |
| **Bueno**        | 85%        | README con instrucciones para levantar el proyecto. Responde al menos 3 preguntas de reflexión.                                                                                           |
| **Aceptable**    | 70%        | README presente con instrucciones básicas. Responde 1-2 preguntas de reflexión.                                                                                                           |
| **Insuficiente** | <70%       | Sin README o instrucciones insuficientes para reproducir el entorno.                                                                                                                      |

### Criterio 3: Calidad del Código y Buenas Prácticas

| Nivel            | Porcentaje | Descripción                                                                                                                                                                                              |
| ---------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Excelente**    | 100%       | Estructura de archivos organizada. `.dockerignore` evita subir `node_modules`, `.env`, logs y archivos de desarrollo. Imagen Docker resultante pesa menos de 200MB. Sin warnings en `docker compose up`. |
| **Bueno**        | 85%        | Buena estructura. `.dockerignore` presente con los elementos principales. Imagen por debajo de 400MB.                                                                                                    |
| **Aceptable**    | 70%        | `.dockerignore` presente aunque incompleto. La imagen puede ser grande (sin alpine o sin multi-stage).                                                                                                   |
| **Insuficiente** | <70%       | Sin `.dockerignore`, `node_modules` incluidos en la imagen, o imagen mayor a 1GB.                                                                                                                        |

---

## 📊 Cálculo de Nota Final

```
Nota Final = (Conocimiento × 0.30) + (Desempeño × 0.40) + (Producto × 0.30)
```

### Ejemplo de Cálculo

| Evidencia    | Nota Obtenida | Peso | Contribución |
| ------------ | ------------- | ---- | ------------ |
| Conocimiento | 90%           | 30%  | 27 puntos    |
| Desempeño    | 85%           | 40%  | 34 puntos    |
| Producto     | 95%           | 30%  | 28.5 puntos  |
| **Total**    |               |      | **89.5/100** |

---

## ⚠️ Criterios de No Aprobación Inmediata

Las siguientes situaciones implican calificación **Insuficiente** sin importar el resto:

- ❌ Credenciales reales (contraseñas, API keys) hardcodeadas en el código o commiteadas al repo
- ❌ Código copiado de otra persona sin adaptación ni comprensión demostrada
- ❌ El entregable no es el trabajo propio del estudiante

---

## 🔗 Documentación de Referencia

- [README Semana 07](README.md)
- [Reto de la Semana](reto-semana-07.md)
- [Teoría: Docker y Contenedores](1-teoria/02-docker-contenedores.md)
- [Práctica: Dockerfile](2-practicas/01-practica-dockerfile.md)
- [Práctica: Docker Compose](2-practicas/02-practica-docker-compose.md)
