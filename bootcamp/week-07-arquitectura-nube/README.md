# 📅 Semana 07: Arquitectura en la Nube

> **Tema Central**: Cloud Native y Contenedores — Docker, Serverless y diseño de sistemas para la nube

---

## 🎯 Objetivos de Aprendizaje

Al finalizar esta semana, serás capaz de:

- ✅ Diferenciar los modelos de servicio cloud: IaaS, PaaS y SaaS, y seleccionar el correcto según el caso
- ✅ Comparar los tres grandes proveedores (AWS, Azure, GCP) y sus servicios equivalentes
- ✅ Construir imágenes Docker optimizadas para aplicaciones Node.js
- ✅ Orquestar aplicaciones multi-contenedor con Docker Compose
- ✅ Comprender el modelo Serverless y Functions as a Service (FaaS)
- ✅ Aplicar los principios de la metodología 12-Factor App
- ✅ Containerizar el proyecto EduFlow con configuración lista para producción

---

## 📚 Contenido Teórico (4 horas)

1. **[Cloud Computing: IaaS, PaaS y SaaS](1-teoria/01-cloud-computing-fundamentos.md)** (60 min)
   - Modelos de servicio cloud y casos de uso reales
   - AWS, Azure y GCP: servicios equivalentes
   - Cuándo usar cada modelo y cuánto cuesta no decidirlo bien

2. **[Docker y Contenedores](1-teoria/02-docker-contenedores.md)** (90 min)
   - Contenedor vs VM: la diferencia que cambia todo
   - Dockerfile: instrucciones, capas y cache
   - Docker Compose: aplicaciones multi-servicio
   - Buenas prácticas: imágenes pequeñas, usuarios no-root, multi-stage builds

3. **[Serverless y Functions as a Service](1-teoria/03-serverless-faas.md)** (45 min)
   - El modelo serverless: sin servidores que administrar
   - AWS Lambda, Google Cloud Functions, Vercel Edge Functions
   - Cuándo serverless es la respuesta (y cuándo no)

4. **[Arquitectura Cloud Native y 12-Factor App](1-teoria/04-cloud-native-12factor.md)** (45 min)
   - Aplicaciones diseñadas para la nube desde el inicio
   - Los 12 factores: guía de diseño para sistemas modernos
   - Health checks, readiness probes y graceful shutdown

---

## 🎨 Material Visual

Los siguientes diagramas están vinculados en los archivos de teoría:

1. **[01-cloud-modelos-servicio.svg](0-assets/01-cloud-modelos-servicio.svg)** — IaaS / PaaS / SaaS comparados
2. **[02-docker-arquitectura.svg](0-assets/02-docker-arquitectura.svg)** — Daemon, imágenes, contenedores, registry
3. **[03-contenedor-vs-vm.svg](0-assets/03-contenedor-vs-vm.svg)** — Comparativa de aislamiento
4. **[04-serverless-flujo.svg](0-assets/04-serverless-flujo.svg)** — Request → API Gateway → FaaS → Response
5. **[05-12-factor-app.svg](0-assets/05-12-factor-app.svg)** — Los 12 factores visualizados

---

## 💻 Prácticas (2 horas)

1. **[Dockerfile para EduFlow API](2-practicas/01-practica-dockerfile.md)** (40 min)
   - Imagen Node.js multi-stage optimizada
   - Usuario no-root, .dockerignore, variables de entorno
   - Build y run local

2. **[Docker Compose: API + PostgreSQL](2-practicas/02-practica-docker-compose.md)** (40 min)
   - Orquestar EduFlow API + PostgreSQL + pgAdmin
   - Variables de entorno con `.env`
   - Health checks y dependencias entre servicios

3. **[Funciones Serverless con Node.js](2-practicas/03-practica-serverless.md)** (40 min)
   - Implementar un endpoint como función pura (handler)
   - Simular el modelo event-driven localmente
   - Comparar ciclo de vida vs servidor HTTP tradicional

---

## 🎯 Reto de la Semana

**[Reto: EduFlow Cloud — Containerización completa](reto-semana-07.md)**

El equipo de EduFlow necesita que la plataforma corra en cualquier entorno sin el clásico _"en mi máquina funciona"_. Tu misión: containerizar la API, la base de datos y el gestor de migraciones con Docker Compose, lista para desplegarse en cualquier proveedor cloud.

---

## 📦 Proyecto Integrador

**[EduFlow Cloud: Despliegue Cloud Native](3-proyecto/proyecto-semana-07.md)**

Containeriza completamente EduFlow aplicando:

- Dockerfile multi-stage optimizado
- Docker Compose con API + PostgreSQL + health checks
- Variables de entorno separadas por ambiente (dev/prod)
- Principios 12-Factor App aplicados al código

---

## 🛠️ Prerrequisitos Técnicos

```bash
# Verificar instalaciones necesarias
docker --version          # >= 24.0
docker compose version    # >= 2.20
node --version            # >= 20.0 LTS
pnpm --version            # >= 8.0
```

---

## 📊 Evaluación

| Evidencia       | Peso | Descripción                                                |
| --------------- | ---- | ---------------------------------------------------------- |
| 🧠 Conocimiento | 30%  | IaaS/PaaS/SaaS, Docker conceptos, Serverless trade-offs    |
| 💪 Desempeño    | 40%  | Dockerfile funcional, docker-compose, variables de entorno |
| 📦 Producto     | 30%  | EduFlow containerizado corriendo con `docker compose up`   |

Ver criterios completos: **[Rúbrica de Evaluación](rubrica-evaluacion.md)**

---

## 📚 Recursos

- 📖 [E-books y lecturas](4-recursos/ebooks-free/README.md)
- 🎬 [Videos recomendados](4-recursos/videografia/README.md)
- 🌐 [Webgrafía](4-recursos/webgrafia/README.md)
- 📖 [Glosario](5-glosario/README.md)

---

## 🔗 Navegación del Bootcamp

| ← Anterior                                                | Semana Actual               | Siguiente →                                  |
| --------------------------------------------------------- | --------------------------- | -------------------------------------------- |
| [Semana 06: Arquitecturas Modernas](../week-06-arquitecturas-modernas/README.md) | **Semana 07: Cloud Native** | [Semana 08: Seguridad](../week-08-seguridad-arquitectura/README.md) |
