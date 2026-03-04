# 📖 Glosario — Semana 07: Arquitectura en la Nube

> Términos clave de Cloud Computing, Docker, Serverless y Cloud Native Architecture.

---

## A

**Alpine Linux**
Distribución Linux minimalista (~5MB) ampliamente usada como imagen base de Docker. Reduce el tamaño de las imágenes y la superficie de ataque de seguridad. Ejemplo: `node:20-alpine`.

**API Gateway**
Componente de infraestructura que recibe requests HTTP y los enruta hacia funciones serverless, microservicios u otros backends. En AWS se llama Amazon API Gateway. Gestiona autenticación, rate limiting y transformación de requests.

---

## B

**Base Image**
Imagen de Docker sobre la que se construye otra. Se especifica con la instrucción `FROM` en el Dockerfile. Ejemplo: `FROM node:20-alpine`.

**Build Context**
El directorio y sus archivos que Docker envía al daemon para construir una imagen. Se define al ejecutar `docker build`. Un `.dockerignore` reduce el contexto excluyendo archivos innecesarios.

---

## C

**Cold Start**
Latencia adicional que ocurre cuando una función serverless se invoca y el proveedor necesita inicializar un nuevo contenedor de ejecución. Típicamente 100ms - 3s. Se mitiga con provisioned concurrency o invocaciones periódicas (warm-up).

**Contenedor (Container)**
Instancia en ejecución de una imagen Docker. Es un proceso aislado que comparte el kernel del sistema operativo host pero tiene su propio sistema de archivos, red y variables de entorno. Analogy: un proceso con esteroides y aislamiento.

**Container Registry**
Repositorio centralizado para almacenar y distribuir imágenes Docker. Ejemplos: Docker Hub (público), Amazon ECR, GitHub Container Registry (ghcr.io), Google Artifact Registry.

**corepack**
Herramienta incluida en Node.js ≥16 que gestiona versiones de gestores de paquetes (pnpm, yarn). Se activa con `corepack enable`.

---

## D

**Docker**
Plataforma open source para construir, distribuir y ejecutar aplicaciones en contenedores. Incluye Docker CLI, Docker Daemon (motor), Docker Compose y Docker Hub.

**Docker Compose**
Herramienta para definir y ejecutar aplicaciones multi-contenedor con un archivo YAML (`docker-compose.yml` o `compose.yml`). Gestiona el ciclo de vida de múltiples servicios, redes y volúmenes con un solo comando.

**Docker Daemon**
Proceso en segundo plano (`dockerd`) que gestiona imágenes, contenedores, redes y volúmenes. Recibe instrucciones del Docker CLI y las ejecuta.

**Dockerfile**
Archivo de texto con instrucciones secuenciales para construir una imagen Docker. Cada instrucción crea una nueva capa en la imagen final.

**Docker Hub**
Registry público de Docker. Aloja imágenes oficiales (nginx, postgres, node) y permite publicar imágenes propias. URL: hub.docker.com.

**.dockerignore**
Archivo que excluye directorios y archivos del build context. Similar a `.gitignore`. Debe excluir siempre: `node_modules/`, `.env`, `.git/`, archivos de log.

---

## E

**Edge Function**
Función serverless que corre en nodos distribuidos geográficamente (CDN edge), muy cerca del usuario. Latencia mínima (<50ms). Ejemplos: Vercel Edge Functions, Cloudflare Workers.

**Environment Variable (Variable de Entorno)**
Variable de configuración inyectada al processo desde el entorno de ejecución, no "hardcodeada" en el código. Según 12-Factor (Factor III), **toda la configuración** debe venir de variables de entorno.

---

## F

**FaaS (Functions as a Service)**
Modelo de computación serverless donde la unidad de despliegue es una función individual. El proveedor gestiona completamente la infraestructura. Ejemplos: AWS Lambda, Google Cloud Functions, Azure Functions.

**FROM** (instrucción Dockerfile)
Primera instrucción de todo Dockerfile. Especifica la imagen base desde la que se construirá. Ejemplo: `FROM node:20-alpine`.

---

## G

**Graceful Shutdown**
Proceso de cierre ordenado de una aplicación al recibir señales del sistema operativo (SIGTERM, SIGINT). Incluye: terminar requests en curso, cerrar conexiones a BD, limpiar recursos. Requerido por 12-Factor Factor IX.

---

## H

**Handler**
Función principal de un componente serverless. Recibe un `event` (el request) y un `context` (metadata de la invocación) y retorna una respuesta. Ejemplo en AWS Lambda: `export const handler = async (event, context) => {...}`.

**Health Check**
Endpoint o comando que verifica si un servicio está funcionando correctamente. En Docker se configura con `HEALTHCHECK`. En Kubernetes se divide en liveness probe (¿está vivo?) y readiness probe (¿está listo para recibir tráfico?).

**Horizontal Scaling (Escalado Horizontal)**
Aumentar la capacidad agregando más instancias del mismo servicio (más pods/containers), en contraste con escalado vertical (más RAM/CPU a la misma instancia). Los containers facilitan el escalado horizontal.

---

## I

**IaaS (Infrastructure as a Service)**
Modelo cloud donde el proveedor ofrece infraestructura virtualizada (servidores, redes, almacenamiento). El cliente gestiona el sistema operativo y todo lo que corre sobre él. Ejemplo: AWS EC2, Google Compute Engine, Azure Virtual Machines.

**Imagen (Docker Image)**
Plantilla inmutable de solo-lectura que contiene el sistema de archivos, dependencias y configuración para crear contenedores. Se construye con `docker build`. Las imágenes son capas (layers) apiladas.

---

## L

**Layer (Capa)**
Cada instrucción en un Dockerfile genera una capa inmutable. Las capas se comparten entre imágenes para optimizar almacenamiento. Docker cachea capas durante el build para acelerar reconstrucciones.

**Liveness Probe**
Health check que responde "¿está el proceso vivo?". Si falla, Kubernetes reinicia el contenedor. Distinto de readiness probe (¿puede recibir tráfico?).

---

## M

**Microservice**
Servicio independiente, desplegable por separado, con una responsabilidad específica. Los contenedores Docker son la unidad de despliegue típica de microservicios.

**Multi-stage Build**
Técnica de Dockerfile que usa múltiples stages (`FROM ... AS nombre`) para separar el entorno de build del entorno de producción. Resultado: imágenes más pequeñas y seguras. El stage final solo incluye lo necesario para ejecutar.

---

## N

**Node.js 20 (LTS)**
Versión LTS (Long-Term Support) de Node.js al momento del bootcamp. Incluye mejoras en módulos ESM nativos, mejor soporte de TypeScript experimental, y `--test` integrado.

---

## O

**On-premise**
Infraestructura instalada y gestionada en las instalaciones físicas de la empresa, a diferencia de servicios en la nube. Mayor control pero mayor costo operativo y de escalabilidad.

**Orchestration (Orquestación)**
Gestión automatizada del ciclo de vida de contenedores: despliegue, escalado, networking, health checks. La herramienta más popular es Kubernetes (K8s). Docker Swarm es la alternativa nativa de Docker.

---

## P

**PaaS (Platform as a Service)**
Modelo cloud donde el proveedor gestiona la infraestructura y el sistema operativo. El cliente solo despliega el código. Ejemplo: Heroku, Railway, Google App Engine, AWS Elastic Beanstalk.

**Persistent Volume**
Almacenamiento que sobrevive al ciclo de vida de un contenedor. En Docker Compose se definen como `volumes:` en el archivo compose. En Kubernetes como `PersistentVolumeClaim`.

**Port Mapping**
Mapeo de puertos entre el host y el contenedor. Ejemplo: `-p 3000:3000` expone el puerto 3000 del contenedor al puerto 3000 del host.

---

## R

**Readiness Probe**
Health check que responde "¿está el servicio listo para recibir tráfico?". Permite que Kubernetes no enrute tráfico a un contenedor que aún está inicializando (por ejemplo, ejecutando migraciones).

**Registry**
Ver _Container Registry_.

---

## S

**SaaS (Software as a Service)**
Modelo cloud donde el usuario consume aplicaciones completas como servicio. No gestiona infraestructura, plataforma ni código. Ejemplos: Google Workspace, Salesforce, Slack, EduFlow (en producción).

**Serverless**
Modelo de computación donde el proveedor gestiona completamente los servidores. El desarrollador solo escribe y despliega código (funciones). No hay infraestructura que aprovisionar ni administrar. Escala automáticamente a cero cuando no hay tráfico.

**SIGTERM**
Señal del sistema operativo enviada a un proceso para pedirle que termine ordenadamente. En contenedores Docker, es la señal enviada por `docker stop`. Una aplicación bien diseñada captura esta señal para hacer graceful shutdown.

---

## T

**12-Factor App**
Metodología de Heroku (Adam Wiggins, 2011) con 12 principios para construir aplicaciones SaaS portables, escalables y mantenibles. Los factores clave para esta semana: III (Config), IV (Backing Services), VII (Port Binding), IX (Disposability), XI (Logs).

---

## V

**Vertical Scaling (Escalado Vertical)**
Aumentar la capacidad de una instancia existente (más RAM, más CPU). Tiene límites físicos y requiere downtime. Contraste con escalado horizontal.

**Volume (Docker Volume)**
Mecanismo de persistencia de datos en Docker. Los datos en un volumen sobreviven a la eliminación y recreación del contenedor. Tipos: named volumes (gestionados por Docker), bind mounts (directorio del host), tmpfs (en memoria).

---

## W

**Warm Container / Hot Container**
Contenedor serverless que ya está inicializado y disponible para recibir invocaciones. Evita el cold start. El proveedor mantiene contenedores calientes por un tiempo después de la última invocación.

---

## 🔗 Referencias

- [Glosario Docker Oficial](https://docs.docker.com/glossary/)
- [AWS Cloud Concepts Glossary](https://aws.amazon.com/glossary/)
- [CNCF Glossary](https://glossary.cncf.io/)

---

← [Semana 07 — Inicio](../README.md) | [Rúbrica de Evaluación](../rubrica-evaluacion.md)
