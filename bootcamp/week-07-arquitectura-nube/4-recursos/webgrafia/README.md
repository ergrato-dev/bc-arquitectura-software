# 🌐 Webgrafía — Semana 07: Arquitectura en la Nube

> Referencias web esenciales para la semana de Cloud Native y Contenedores.

---

## 📚 Documentación Oficial (Primera Fuente)

### Docker

| Recurso                        | URL                                                      | Descripción                          |
| ------------------------------ | -------------------------------------------------------- | ------------------------------------ |
| Docker Docs — Get Started      | https://docs.docker.com/get-started/                     | Tutorial oficial paso a paso         |
| Dockerfile Reference           | https://docs.docker.com/reference/dockerfile/            | Referencia completa de instrucciones |
| Docker Compose Specification   | https://docs.docker.com/compose/compose-file/            | Todas las opciones de compose.yml    |
| Docker Hub                     | https://hub.docker.com/                                  | Registry público de imágenes         |
| Docker Security Best Practices | https://docs.docker.com/develop/security-best-practices/ | Prácticas de seguridad oficiales     |

### Cloud Providers — Capa Gratuita

| Proveedor         | URL                               | Límites Gratuitos                                   |
| ----------------- | --------------------------------- | --------------------------------------------------- |
| AWS Free Tier     | https://aws.amazon.com/free/      | EC2 t2.micro, Lambda 1M req/mes, RDS db.t3.micro    |
| Google Cloud Free | https://cloud.google.com/free     | Compute Engine f1-micro, Cloud Run, BigQuery        |
| Azure Free        | https://azure.microsoft.com/free/ | App Service, Azure Functions, SQL Database          |
| Vercel            | https://vercel.com/pricing        | Serverless Functions, Edge Network (siempre gratis) |
| Railway           | https://railway.app/              | Postgres, Redis, deploy Node.js (tier free)         |

---

## 📖 Metodologías y Estándares

| Recurso                             | URL                                                                             | Por qué leerlo                             |
| ----------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------ |
| **The Twelve-Factor App**           | https://12factor.net/                                                           | Metodología canónica para SaaS cloud-ready |
| **The Twelve-Factor App (Español)** | https://12factor.net/es/                                                        | Misma metodología en español               |
| **CNCF Cloud Native Definition**    | https://github.com/cncf/toc/blob/main/DEFINITION.md                             | Definición oficial de Cloud Native         |
| **OpenContainers Spec**             | https://opencontainers.org/                                                     | Estándar abierto de containers             |
| **OWASP Container Security**        | https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html | Seguridad en containers                    |

---

## 🔧 Herramientas Online

| Herramienta                      | URL                                  | Para qué sirve                                  |
| -------------------------------- | ------------------------------------ | ----------------------------------------------- |
| **Dockerfile Linter (Hadolint)** | https://hadolint.github.io/hadolint/ | Analiza tu Dockerfile online                    |
| **Docker Image Sizer**           | https://hub.docker.com/              | Ver tamaño de imágenes antes de hacer pull      |
| **Play with Docker**             | https://labs.play-with-docker.com/   | Terminal Docker en navegador (gratis)           |
| **Dive**                         | https://github.com/wagoodman/dive    | Herramienta para inspeccionar capas de imágenes |
| **Composerize**                  | https://www.composerize.com/         | Convierte docker run a docker-compose.yml       |

---

## 📰 Blogs y Artículos de Referencia

| Autor/Blog                                                     | Descripción                                    |
| -------------------------------------------------------------- | ---------------------------------------------- |
| **Docker Blog** — docker.com/blog                              | Novedades, tutoriales y casos de uso           |
| **AWS Architecture Blog** — aws.amazon.com/blogs/architecture/ | Patrones de arquitectura en AWS                |
| **Martín Fowler** — martinfowler.com                           | Artículos sobre microservicios, cloud patterns |
| **The New Stack** — thenewstack.io                             | Noticias y análisis sobre cloud native         |
| **Dev.to** — dev.to/t/docker                                   | Artículos comunitarios sobre Docker            |

---

## 🛡️ Seguridad en Cloud — Recursos Adicionales

| Recurso                 | URL                                                         | Descripción                             |
| ----------------------- | ----------------------------------------------------------- | --------------------------------------- |
| CIS Docker Benchmark    | https://www.cisecurity.org/benchmark/docker                 | Estándar de hardening para Docker       |
| Snyk Container Security | https://snyk.io/product/container-vulnerability-management/ | Scanner de vulnerabilidades en imágenes |
| AWS Security Hub        | https://aws.amazon.com/security-hub/                        | Monitoreo de seguridad en AWS           |

---

## 🔗 Node.js en Cloud

| Recurso                       | URL                                                                   | Descripción                      |
| ----------------------------- | --------------------------------------------------------------------- | -------------------------------- |
| Node.js Docker Best Practices | https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md | Guía oficial del equipo Node.js  |
| Vercel Node.js Runtime        | https://vercel.com/docs/functions/runtimes/node-js                    | Serverless con Node.js en Vercel |
| AWS Lambda Node.js            | https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html       | Lambda con Node.js oficial       |

---

## 💡 Tip de Búsqueda

Para encontrar soluciones específicas de configuración Docker, busca en este orden:

1. **docs.docker.com** — si es una opción de Docker
2. **Stack Overflow** — si es un error específico
3. **GitHub Issues** del proyecto — si es un bug conocido
4. **Docker Community Forums** — forum.docker.com
