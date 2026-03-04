# 🎤 Práctica 02 — Preparación de la Presentación Final

> **Duración**: 60 minutos
> **Tipo**: Autónomo
> **Semana**: 09

---

## 🎯 Objetivos

- Estructurar el guión de la presentación final (7 minutos)
- Preparar y probar la demo en vivo de los 5 endpoints críticos
- Completar la lista de verificación de entregables del bootcamp
- Realizar un ensayo cronometrado de la presentación

---

## Paso 1 — Verificar que el Sistema Funciona en Frío (15 min)

```bash
# Simula las condiciones de presentación:
# 1. Apaga el sistema
docker compose down

# 2. Elimina contenedores e imágenes cacheadas (realmente en frío)
docker compose down -v  # también elimina volúmenes
docker image prune -f   # limpia imágenes sin usar

# 3. Vuelve a levantar desde cero
docker compose up --build

# 4. Espera a que los contenedores estén listos
docker compose ps
# Todos deben aparecer como "Up" o "Running"

# 5. Ejecuta los tests completos
pnpm test

# Si algún test falla o el sistema no levanta, resuelve el problema AHORA,
# no el día de la presentación
```

---

## Paso 2 — Preparar el Script de Demo (10 min)

Crea el archivo `scripts/demo-presentacion.sh`:

```bash
#!/bin/bash
# scripts/demo-presentacion.sh
# Demo de presentación — Ejecutar en orden durante la presentación

BASE_URL="http://localhost:3000"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔷 [TU DOMINIO] — Demo de Presentación"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# PASO 1: Health check
echo ""
echo "1️⃣  HEALTH CHECK"
curl -s "$BASE_URL/health" | jq .

# PASO 2: Registro de usuario
echo ""
echo "2️⃣  REGISTRO DE USUARIO (contraseña hasheada con bcrypt)"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@[tu-dominio].com",
    "password": "Demo1234!",
    "role": "[ROL_PRINCIPAL_DE_TU_DOMINIO]"
  }')
echo $REGISTER_RESPONSE | jq .

# PASO 3: Login → JWT
echo ""
echo "3️⃣  LOGIN → JWT ACCESS TOKEN"
TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@[tu-dominio].com",
    "password": "Demo1234!"
  }' | jq -r '.accessToken')
echo "Token: ${TOKEN:0:50}..."

# PASO 4: Operación autenticada del dominio
echo ""
echo "4️⃣  OPERACIÓN PROTEGIDA (requiere autenticación)"
curl -s "$BASE_URL/[tu-recurso-principal]" \
  -H "Authorization: Bearer $TOKEN" | jq .

# PASO 5: RBAC — acceso denegado
echo ""
echo "5️⃣  RBAC EN ACCIÓN (rol [ROL_BAJO] intentando acción de [ROL_ALTO])"
curl -s -X POST "$BASE_URL/[tu-recurso-admin]" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "test-rbac"}' | jq .
# Esperado: 403 Forbidden

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Demo completada"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

```bash
# Hacer el script ejecutable
chmod +x scripts/demo-presentacion.sh

# Probar el script AHORA
./scripts/demo-presentacion.sh
```

---

## Paso 3 — Escribir el Guión (10 min)

Completa este guión con los detalles de tu dominio:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE 1 — CONTEXTO (1 minuto)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Construí [nombre de tu sistema], una [descripción en una oración]
para [actor principal].

El problema que resuelve es [problema del negocio].
Sin este sistema, [consecuencia del problema sin resolver].

Los usuarios del sistema son [actores: ROL_1], [ROL_2] y [ROL_3 si aplica]."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE 2 — ARQUITECTURA (2 minutos)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Muestra el diagrama C4 L2 en pantalla]

"El sistema está construido con [tecnología principal] siguiendo
[patrón arquitectónico].

La decisión más importante fue [ADR-001 en una oración].
Elegí esto sobre [alternativa] porque [razón técnica de 15 segundos].

El sistema corre en Docker con [número de contenedores] contenedores:
[describe brevemente cada uno]."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE 3 — DEMO EN VIVO (3 minutos)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Ejecuta ./scripts/demo-presentacion.sh en vivo]

Al mostrar cada paso, di:
  PASO 1: "Aquí vemos que el sistema responde..."
  PASO 2: "El password NUNCA se guarda en texto plano — bcrypt..."
  PASO 3: "Este JWT tiene header, payload y firma..."
  PASO 4: "Sin el token, la API rechazaría este request..."
  PASO 5: "Aquí está el RBAC: [ROL] no puede hacer [acción]..."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOQUE 4 — TRADE-OFFS Y APRENDIZAJES (1 minuto)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"El trade-off más relevante que acepté fue [trade-off de tu ADR].
Acepté [costo] a cambio de [beneficio] porque [razón].

Si empezara desde cero, [decisión que cambiarías] porque [razón honesta].

El aprendizaje más importante del bootcamp para mí fue [reflexión genuina]."
```

---

## Paso 4 — Ensayo Cronometrado (15 min)

```bash
# Usa un cronómetro real (teléfono o terminal)
echo "Ensayo iniciado. Tienes 7 minutos."; sleep 420; echo "¡Tiempo!"
```

Durante el ensayo:

- 📱 Grábate o pide a alguien que te escuche
- ⏱️ Respeta estrictamente los tiempos de cada bloque
- 🖥️ Practica con la pantalla compartida activada
- 💻 Ejecuta el script de demo real

Después del ensayo, evalúa:

```
¿Terminé en menos de 7 minutos?  → Si no, ¿qué recorto?
¿El demo funcionó sin errores?   → Si no, ¿qué necesito arreglar?
¿Pude explicar cada paso?        → Si no, ¿qué necesito practicar?
¿Mencioné el trade-off?          → Fundamental para la nota
```

---

## Paso 5 — Lista de Verificación Final del Bootcamp (10 min)

Recorre esta lista y marca cada ítem antes de ir a la presentación:

### Repositorio GitHub

- [ ] Repositorio público (o compartido con el instructor)
- [ ] `README.md` con: descripción, instalación, uso, tecnologías
- [ ] `.env.example` con todas las variables (sin valores reales)
- [ ] `.gitignore` incluye `.env`, `node_modules/`, `dist/`
- [ ] Historial de commits hace visible el progreso semanal
- [ ] `pnpm test` pasa en el repositorio clonado en frío

### Documentación

- [ ] `docs/adr/ADR-001-[nombre].md` completo
- [ ] `docs/adr/ADR-002-autenticacion.md` completo
- [ ] `docs/adr/ADR-003-[nombre].md` completo
- [ ] Diagramas C4 L1 y L2 en el README
- [ ] Colección Postman/Insomnia o equivalente (archivo `.json` o `.yaml`)

### Sistema Funcional

- [ ] `docker compose up` levanta sin errores
- [ ] `POST /auth/register` crea usuario con password hasheado
- [ ] `POST /auth/login` retorna JWT
- [ ] Endpoint protegido rechaza requests sin token (401)
- [ ] Endpoint restringido por rol rechaza rol incorrecto (403)
- [ ] Al menos 1 endpoint CRUD del dominio funcional y protegido

### Seguridad

- [ ] No hay secretos hardcodeados en el código
- [ ] Helmet.js está configurado (`X-Content-Type-Options`, `X-Frame-Options`, etc.)
- [ ] Rate limiting activo en `/auth/login`
- [ ] CORS configurado (no `*` sin justificación)
- [ ] Zod valida al menos los endpoints de autenticación

### Presentación

- [ ] Guión escrito y ensayado
- [ ] Script de demo funciona sin errores
- [ ] Cronómetro: ensayo en ≤7 minutos
- [ ] Preparado para 3 preguntas técnicas
- [ ] Retroalimentación para al menos un compañero preparada

---

## Paso 6 — Preparar Retroalimentación para un Compañero

Antes de la sesión, prepara mentalmente cómo darías retroalimentación usando el framework SBI:

```markdown
Template de retroalimentación:

**Fortaleza arquitectónica observada:**
"En el sistema de [nombre], [decisión técnica concreta] demuestra
[atributo de calidad] porque [razón técnica]."

**Área de mejora posible:**
"Un aspecto que podría fortalecerse es [decisión específica].
Actualmente [descripción del estado actual].
Una alternativa sería [propuesta] que resolvería [problema]
aunque implicaría [trade-off de la propuesta]."
```

---

## ✅ Verifica tu Entorno el Día de la Presentación

```bash
# Mínimo 30 minutos ANTES de presentar:

# 1. El sistema está corriendo
docker compose ps

# 2. Los tests pasan
pnpm test

# 3. El script de demo funciona
./scripts/demo-presentacion.sh

# 4. Tienes el repositorio en GitHub
git push origin main

# 5. La pantalla compartida está configurada y probada
```

---

_Semana 09 · Proyecto Integrador Final · Bootcamp de Arquitectura de Software_
