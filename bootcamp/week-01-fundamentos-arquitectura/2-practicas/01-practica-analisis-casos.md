# 📝 Práctica 01: Análisis de Casos Reales

## 🎯 Objetivo

Analizar casos reales de éxitos y fracasos arquitectónicos para extraer lecciones aplicables a tus proyectos.

## ⏱️ Duración

60 minutos

---

## 📚 Casos de Estudio

### Caso 1: Healthcare.gov (2013) - Fracaso Arquitectónico ❌

**Contexto**: Lanzamiento del portal de salud del gobierno de EE.UU.

**Datos clave**:

- Presupuesto: $800 millones
- Fecha de lanzamiento: 1 de octubre de 2013
- Resultado: Solo 6 personas lograron registrarse el primer día
- Costo de reparación: $1.7 mil millones adicionales

**Problemas arquitectónicos identificados**:

1. **Arquitectura monolítica incapaz de escalar**
   - Sistema diseñado para 50,000 usuarios concurrentes
   - Recibieron 250,000 en las primeras horas

2. **Integración deficiente entre componentes**
   - 55 contractors trabajando en paralelo sin coordinación
   - Componentes desarrollados independientemente sin API clara

3. **Sin pruebas de carga adecuadas**
   - Nunca probaron el sistema completo antes del lanzamiento
   - Testing solo en componentes aislados

4. **Base de datos centralizada**
   - Un solo punto de falla (SPOF - Single Point of Failure)
   - Oracle RAC no configurado para alta disponibilidad

---

### Caso 2: Knight Capital Group (2012) - Error Catastrófico ❌

**Contexto**: Empresa de trading algorítmico con sistemas automatizados.

**Datos clave**:

- Fecha: 1 de agosto de 2012
- Pérdida: $440 millones en 45 minutos
- Causa: Bug en deployment de nuevo software

**Problemas arquitectónicos**:

1. **Falta de circuit breakers**
   - Sistema no podía detenerse automáticamente ante comportamiento anómalo
   - Ejecutó millones de operaciones incorrectas

2. **Sin rollback automatizado**
   - Deploy manual sin capacidad de reversa
   - Código antiguo interactuaba con código nuevo incorrectamente

3. **Testing insuficiente en producción**
   - Feature flags no implementadas
   - Sin canary deployments

---

### Caso 3: Netflix (2008-2016) - Evolución Exitosa ✅

**Contexto**: Migración de DVD rental a streaming global.

**Datos clave**:

- 2008: Monolito en data center propio
- 2016: 700+ microservicios en AWS
- Resultado: 200M+ usuarios, 99.99% uptime

**Decisiones arquitectónicas exitosas**:

1. **Migración gradual a microservicios**
   - No reescribieron todo de golpe
   - Strangler Fig Pattern: reemplazar gradualmente

2. **Cloud Native desde el diseño**
   - Asumieron que los servidores fallarán
   - Diseñaron para resilencia (Chaos Monkey)

3. **API Gateway centralizado**
   - Punto de entrada único
   - Versionado de APIs

4. **Event-Driven Architecture**
   - Servicios desacoplados vía eventos
   - Escalabilidad independiente

---

## 📝 Actividades

### Actividad 1: Análisis Individual (20 min)

Para cada caso, responde:

1. **¿Cuáles fueron las decisiones arquitectónicas clave?**

2. **¿Qué consecuencias tuvieron esas decisiones?**

3. **¿Qué habrías hecho diferente?**

4. **¿Qué lecciones extraes para tu proyecto?**

---

### Actividad 2: Discusión en Equipos (20 min)

Forma equipos de 3-4 personas y discutan:

1. **¿Healthcare.gov era evitable?**
   - ¿Qué señales de alerta existían?
   - ¿Qué arquitectura habrían propuesto?

2. **Knight Capital: Preveniendo el desastre**
   - ¿Qué prácticas de deployment habrían evitado la pérdida?
   - ¿Qué elementos arquitectónicos de seguridad faltaban?

3. **Netflix: Replicando el éxito**
   - ¿Qué principios arquitectónicos de Netflix son aplicables a proyectos pequeños?
   - ¿Cuándo NO usar microservicios?

---

### Actividad 3: Presentación Grupal (20 min)

Cada equipo presenta (5 min):

1. Lección clave extraída de los casos
2. Cómo aplicarían esa lección en un proyecto real
3. Un anti-patrón a evitar

---

## ✅ Criterios de Evaluación

| Criterio                                    | Puntos |
| ------------------------------------------- | ------ |
| Identificación de problemas arquitectónicos | 25%    |
| Propuestas de solución fundamentadas        | 35%    |
| Aplicación de lecciones a contexto propio   | 25%    |
| Participación y claridad en presentación    | 15%    |

---

## 📚 Recursos Adicionales

- [The $300M Button](https://www.uie.com/brainsparks/2009/07/08/the-300-million-button/) - Caso de estudio UX/arquitectura
- [AWS: How Netflix Uses AWS](https://aws.amazon.com/solutions/case-studies/netflix/) - Arquitectura en detalle
- [Postmortem Culture](https://sre.google/sre-book/postmortem-culture/) - Cómo aprender de fallos

---

**Bootcamp de Arquitectura de Software**
_SENA - Week 01 - Práctica 01_
