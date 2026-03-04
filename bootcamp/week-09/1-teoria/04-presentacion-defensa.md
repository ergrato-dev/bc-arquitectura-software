# 🎤 Guía de Presentación y Defensa Técnica

> **Duración**: 60 minutos
> **Tipo**: Presencial
> **Semana**: 09

---

## 🎯 Objetivos

Al finalizar este módulo, podrás:

- Estructurar una presentación de arquitectura de 7 minutos efectiva
- Preparar y ejecutar una demo en vivo sin stress
- Anticipar y responder preguntas técnicas con confianza
- Dar y recibir retroalimentación técnica constructiva entre pares

---

## 🎬 La Estructura de una Presentación de Arquitectura

Una presentación de 7 minutos tiene un formato probado. Cada bloque tiene un propósito específico:

```
┌──────────────────────────────────────────────────────────────────────┐
│  BLOQUE 1 — Contexto (1 min)                                         │
│  "¿Qué problema resuelve tu sistema y para quién?"                   │
│  → Dame en 60 segundos por qué este sistema existe                  │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│  BLOQUE 2 — Arquitectura (2 min)                                     │
│  "¿Cómo está construido? Muéstrame los diagramas C4"                 │
│  → C4 L1 (contexto) y C4 L2 (contenedores) en pantalla             │
│  → Explica la decisión arquitectónica principal (ADR-001)           │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│  BLOQUE 3 — Demo en Vivo (3 min)                                     │
│  "Muéstrame que funciona"                                            │
│  → Terminal o cliente HTTP visible en pantalla                      │
│  → Flujo completo: register → login → operación → RBAC denied      │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│  BLOQUE 4 — Trade-offs y Aprendizajes (1 min)                        │
│  "¿Qué cambiarías y qué aprendiste?"                                 │
│  → 1 trade-off aceptado y por qué                                   │
│  → 1 cosa que harías diferente si empezaraas desde cero             │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🖥️ La Demo en Vivo

### Antes de la Presentación

```bash
# Checklist de pre-presentación (hacer la noche anterior)
# 1. Levantar el sistema
docker compose up -d

# 2. Verificar que todo funciona
curl http://localhost:3000/health
# { "status": "ok", "timestamp": "..." }

# 3. Preparar los comandos en un archivo o terminal limpia
# NO busques comandos en vivo — córtalos de un script preparado

# 4. Limpiar la base de datos de prueba
docker exec -it [tu-db-container] psql -U [user] -c "DELETE FROM users;"
```

### El Guión de la Demo (5 pasos exactos)

```bash
# PASO 1: Mostrar que el sistema corre
curl http://localhost:3000/health
# "Aquí ven que el sistema está vivo y responde en menos de 50ms"

# PASO 2: Registrar un usuario
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@demo.com", "password": "Demo1234!", "role": "student"}'
# "El password nunca se guarda en texto plano — bcrypt con 12 rounds"

# PASO 3: Login → JWT
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@demo.com", "password": "Demo1234!"}' | jq -r '.accessToken')
echo $TOKEN
# "Este JWT tiene 3 partes: header.payload.signature"

# PASO 4: Operación protegida del dominio
curl http://localhost:3000/[tu-recurso] \
  -H "Authorization: Bearer $TOKEN"
# "Solo usuarios autenticados pueden ver esto"

# PASO 5: Demostrar RBAC
curl -X DELETE http://localhost:3000/[tu-recurso-admin]/1 \
  -H "Authorization: Bearer $TOKEN"
# "403 Forbidden — el student no puede hacer esto"
# "Aquí está el RBAC funcionando"
```

### Si la Demo Falla

> 🧘 La demo falla en el 30% de las presentaciones técnicas. Los seniors lo saben. Cómo reaccionas define tu madurez.

**Si hay un error inesperado:**

```
"Aquí tenemos un comportamiento interesante — vamos a diagnosticarlo"
[Mira el error, explica qué lo podría causar]
"Probablemente sea [X]. En producción lo resolvería así: [Y]"
[Si puedes, corrígelo; si no, continúa con la explicación verbal]
```

**Lo que NO debes decir:**

- "Esto funcionaba en casa" → No aporta confianza
- "No entiendo por qué esto pasa" → Sí debes entenderlo; es tu sistema
- Silencio largo nervioso → Peor que un error explicado

---

## 🎙️ Anticipar Preguntas Difíciles

Las preguntas técnicas en defensas arquitectónicas siguen patrones. Aquí están con las respuestas marco:

### "¿Por qué elegiste [tecnología/patrón X]?"

**Marco de respuesta:**

```
"Elegí X porque en mi contexto tenía tres restricciones:
[Restricción 1], [Restricción 2] y [Restricción 3].

Consideré las alternativas [Y] y [Z]:
- Y resolvía [Restricción 1] pero no [Restricción 2] porque [razón]
- Z era más compleja de implementar dado [restricción de equipo/tiempo]

X era la opción que mejor equilibraba [atributo de calidad] en este contexto."
```

---

### "¿Cómo escalarías a 100,000 usuarios?"

**Marco de respuesta:**

```
"La arquitectura actual escala verticalmente hasta [estimado].

Para 100,000 usuarios concurrentes necesitaría:
1. Múltiples instancias de la API detrás de un load balancer
   (JSON Web Tokens ya son stateless — facilita esto)
2. Connection pooling en PostgreSQL
3. Cache para lecturas frecuentes (Redis)
4. CDN para assets estáticos

El cuello de botella más probable sería [X] porque [razón]."
```

---

### "¿Qué cambiarías si hicieras tu arquitectura de nuevo?"

**Marco de respuesta:**

```
"Si empezara de cero, [X] lo haría diferente:

Durante el desarrollo noté que [observación honesta].
Esto me generó [consecuencia] que tuve que resolver con [solución].

Si lo hiciera de nuevo, [alternativa] porque [razón técnica].

Aprendí que [lección] — que es probablemente el conocimiento más valioso
que me llevo del proyecto."
```

> 💡 Esta es la pregunta que más distingue un buen arquitecto de uno mediocre.
> La madurez técnica se mide por la honestidad sobre las limitaciones propias.

---

### "¿Qué pasa si la base de datos cae?"

**Marco de respuesta:**

```
"Actualmente el sistema tiene un punto único de falla en PostgreSQL.

El patrón de mitigación en producción sería:
1. Réplica de lectura (alta disponibilidad)
2. Circuit Breaker pattern para degradar gracefully
3. Health check en Docker → restart automático

Para el tipo de sistema que construí [tipo], [nivel de disponibilidad]
es aceptable dado [contexto] — este es un trade-off documentado en mi ADR-[N]."
```

---

## 🤝 Retroalimentación Técnica entre Pares (Peer Review)

### Cómo Dar Retroalimentación Constructiva

El framework **SBI** (Situation-Behavior-Impact) adaptado a arquitectura:

```
Situation (Situación):
"En la presentación de [nombre], cuando mostraste [aspecto concreto]..."

Behavior (Comportamiento / Observación):
"Noté que [descripción objetiva de la decisión técnica]..."

Impact (Impacto técnico):
"Esto podría [consecuencia positiva o área de mejora]
porque [razón técnica específica]."

Sugerencia (opcional):
"Una alternativa sería [propuesta] que resolvería [aspecto]
aunque sacrificaría [trade-off]."
```

**Ejemplo:**

> "En la presentación de María, cuando mostraste la estructura de carpetas, noté que el controlador importa directamente el repositorio de PostgreSQL sin un puerto intermedio. Esto podría dificultar el testing unitario del controlador porque requeriría levantar una BD real. Una alternativa sería definir un puerto `IProductRepository` e inyectarlo — aunque añadiría un archivo más a la estructura."

### Cómo Recibir Retroalimentación

Los developers técnicos maduros reciben crítica técnica así:

```
✅ "Gracias, no había considerado ese aspecto"
✅ "Tienes razón, ese trade-off no está bien justificado en mi ADR"
✅ "Eso es válido — lo implementé así porque [razón], pero tu propuesta
   también resolvería el problema de forma más robusta"

❌ "Pero eso funciona igual"
❌ Silencio defensivo
❌ "No importa porque [excusa]"
```

---

## 📋 Lista de Verificación Final

### 48 horas antes de la presentación

- [ ] El sistema levanta con `docker compose up` en frío (sin cache)
- [ ] Los 5 endpoints de la demo funcionan
- [ ] Los diagramas C4 L1 y L2 están en el repositorio
- [ ] 3 ADRs están escritos y en el repositorio
- [ ] El README tiene instrucciones de instalación completas
- [ ] `.env.example` tiene todas las variables sin valores reales
- [ ] `pnpm test` pasa (todos los tests en verde)
- [ ] Puedes explicar cada decisión técnica en 60 segundos

### 10 minutos antes de presentar

- [ ] Sistema corriendo: `docker compose ps` muestra todos los contenedores Up
- [ ] Terminal limpia con comandos preparados
- [ ] Pantalla compartida configurada y probada
- [ ] Cronómetro listo (7 minutos es estricto)

---

## 💬 Apertura y Cierre Recomendados

### Apertura (los primeros 30 segundos importan)

```
"Hola, soy [Nombre]. Construí [nombre del sistema], una plataforma de
[breve descripción del dominio] para [actor principal].

El problema que resuelve es [problema real] — esto es importante porque
[consecuencia del problema sin resolver].

En los próximos 7 minutos les voy a mostrar cómo está construido,
por qué tomé las decisiones que tomé, y una demo en vivo."
```

### Cierre (los últimos 20 segundos)

```
"El sistema implementa arquitectura hexagonal con JWT + RBAC y
corre containerizado en Docker.

Las dos cosas más importantes que aprendí en este proyecto son:
[aprendizaje 1] y [aprendizaje 2].

Estoy abierto a preguntas."
```

---

_Semana 09 · Proyecto Integrador Final · Bootcamp de Arquitectura de Software_
