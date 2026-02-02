# 📝 Práctica 02: Comparación de Metodologías

## 🎯 Objetivo

Aplicar criterios de selección de metodologías de desarrollo para diferentes contextos de proyectos reales.

## ⏱️ Duración

45 minutos

---

## 📋 Escenarios de Proyectos

### Escenario 1: Startup Fintech 🚀

**Contexto:**

- **Empresa**: Startup colombiana de pagos digitales
- **Equipo**: 8 personas (4 developers, 1 designer, 1 product owner, 1 QA, 1 CEO)
- **Financiamiento**: Ronda semilla de $500K USD
- **Timeline**: 6 meses para MVP, buscar product-market fit
- **Mercado**: Altamente competitivo, necesitan iterar rápido
- **Regulación**: Superintendencia Financiera (requisitos de seguridad)

**Requisitos técnicos**:

- Aplicación móvil (iOS + Android)
- Backend de procesamiento de pagos
- Integración con bancos colombianos (PSE, ACH)
- Dashboard administrativo

**Restricciones**:

- Presupuesto limitado
- Necesitan lanzar antes que competencia
- Requisitos cambiarán según feedback de usuarios
- Deben cumplir normas PCI-DSS

---

### Escenario 2: Sistema Gubernamental 🏛️

**Contexto:**

- **Entidad**: Ministerio de Salud - Colombia
- **Proyecto**: Sistema de historia clínica electrónica nacional
- **Equipo**: 50+ personas distribuidas (contractors + equipo interno)
- **Presupuesto**: $5 millones USD (licitación pública)
- **Timeline**: 24 meses de desarrollo + 6 meses de despliegue
- **Alcance**: 1,200 hospitales públicos en todo el país
- **Regulación**: Ley 1581 (protección de datos), Resolución 839 de 2017

**Requisitos técnicos**:

- Sistema web centralizado
- Almacenamiento de 50 millones de historias clínicas
- Disponibilidad 99.9%
- Respaldo y recuperación ante desastres
- Interoperabilidad con sistemas existentes

**Restricciones**:

- Contrato de precio fijo
- Requisitos completamente definidos desde el inicio
- Auditorías de seguridad obligatorias
- Documentación exhaustiva requerida
- Cambios requieren aprobación de comité técnico

---

### Escenario 3: Aplicación Móvil de Delivery 📱

**Contexto:**

- **Empresa**: Rappi, Uber Eats, o similar
- **Proyecto**: Nueva funcionalidad de "pedidos grupales"
- **Equipo**: Squad de 6 personas (3 mobile devs, 2 backend, 1 designer)
- **Timeline**: 4 sprints de 2 semanas (8 semanas total)
- **Usuarios**: 5 millones activos mensuales
- **Objetivo**: Aumentar ticket promedio en 30%

**Requisitos técnicos**:

- Feature en app existente (iOS + Android)
- Integración con sistema de pagos actual
- Notificaciones push en tiempo real
- Sincronización multi-usuario
- A/B testing para validar impacto

**Restricciones**:

- No puede afectar funcionalidades existentes
- Deploy gradual (feature flags)
- Métricas de éxito definidas desde inicio
- Necesitan validar hipótesis rápido

---

## 📝 Actividades

### Actividad 1: Análisis Individual (15 min)

Para **cada escenario**, completa la siguiente tabla:

| Aspecto                     | Escenario 1 (Fintech) | Escenario 2 (Gobierno) | Escenario 3 (Delivery) |
| --------------------------- | --------------------- | ---------------------- | ---------------------- |
| **Metodología recomendada** |                       |                        |                        |
| **Justificación**           |                       |                        |                        |
| **Riesgos principales**     |                       |                        |                        |
| **Estrategia de testing**   |                       |                        |                        |
| **Frecuencia de deploy**    |                       |                        |                        |
| **Tipo de arquitectura**    |                       |                        |                        |

**Guía de metodologías**:

- Cascada / Waterfall
- Scrum
- Kanban
- Extreme Programming (XP)
- Híbrido (especificar)

---

### Actividad 2: Comparación en Parejas (15 min)

Compara tus respuestas con un compañero:

1. **¿En qué coincidieron?** ¿Por qué?

2. **¿En qué difieren?** ¿Cuál argumento es más sólido?

3. **¿Identificaron los mismos riesgos?**

4. **Para el Escenario 2 (Gobierno):**
   - ¿Es posible usar metodología ágil en proyectos gubernamentales?
   - ¿Qué adaptaciones serían necesarias?

---

### Actividad 3: Debate Grupal (15 min)

**Tema de debate**: "¿Las metodologías ágiles son apropiadas para proyectos gubernamentales?"

**Posiciones**:

- **Grupo A**: Defiende que SÍ es posible (SAFe, Water-Scrum-Fall)
- **Grupo B**: Defiende que NO es viable (requisitos de documentación, contratos fijos)

**Moderador**: Instructor

**Formato**:

1. Cada grupo presenta argumentos (3 min)
2. Contraargumentos (2 min por grupo)
3. Casos reales de éxito/fracaso (2 min)
4. Conclusión: ¿Existe un punto medio? (3 min)

---

## 💡 Soluciones Sugeridas

### Escenario 1: Fintech Startup

**Metodología recomendada**: **Scrum + DevOps**

**Justificación**:

- ✅ Sprints de 2 semanas permiten iterar rápido
- ✅ Product Owner puede priorizar según feedback de mercado
- ✅ DevOps (CI/CD) permite deploys frecuentes y seguros
- ✅ Retrospectivas ayudan a mejorar continuamente

**Arquitectura sugerida**:

- Monolito modular inicialmente (más rápido de desarrollar)
- Backend: Node.js + PostgreSQL
- Mobile: React Native (código compartido iOS/Android)
- CI/CD desde día 1

**Estrategia de testing**:

- TDD para lógica de negocio crítica (pagos)
- E2E testing automatizado
- Penetration testing trimestral (PCI-DSS)

**Frecuencia de deploy**:

- Backend: Diario (con feature flags)
- Mobile: Semanal (review stores)

---

### Escenario 2: Sistema Gubernamental

**Metodología recomendada**: **Híbrido (Water-Scrum-Fall)**

**Justificación**:

- ✅ Fase inicial Waterfall para requisitos y arquitectura (cumplir licitación)
- ✅ Desarrollo iterativo con Scrum (equipos de delivery)
- ✅ Deploy tradicional (ambiente de staging, aprobaciones)

**Arquitectura sugerida**:

- Arquitectura en 3 capas (Presentación, Lógica, Datos)
- Backend: Java Spring Boot (estabilidad, soporte empresarial)
- Frontend: React (componentización, mantenibilidad)
- Base de datos: PostgreSQL con replicación

**Estrategia de testing**:

- Pruebas de aceptación con usuarios (hospitales piloto)
- Pruebas de carga (1M+ usuarios concurrentes)
- Auditorías de seguridad externas
- Documentación de casos de prueba

**Frecuencia de deploy**:

- Mensual en producción (ventanas de mantenimiento)
- Semanal en staging para validaciones

---

### Escenario 3: App de Delivery

**Metodología recomendada**: **Kanban + Continuous Delivery**

**Justificación**:

- ✅ Kanban permite flujo continuo (no hay "sprints")
- ✅ Métricas claras de éxito (cycle time, throughput)
- ✅ A/B testing requiere deploys frecuentes
- ✅ Feature flags para rollout gradual

**Arquitectura sugerida**:

- Microservicio nuevo para pedidos grupales
- Event-driven (Kafka/RabbitMQ) para notificaciones
- Mobile: Feature module independiente
- API Gateway para enrutamiento

**Estrategia de testing**:

- Canary deployments (1% → 10% → 50% → 100%)
- Feature toggles por país/ciudad
- Monitoreo en tiempo real (Datadog, Sentry)
- Rollback automático si métricas caen

**Frecuencia de deploy**:

- Backend: Varias veces al día
- Mobile: Diario (pero feature oculta detrás de flag)

---

## 🎯 Criterios de Selección de Metodología

### Matriz de Decisión

| Factor                         | Cascada         | Scrum        | Kanban             | XP          |
| ------------------------------ | --------------- | ------------ | ------------------ | ----------- |
| **Requisitos estables**        | ✅ Ideal        | ❌ No ideal  | ⚠️ Depende         | ❌ No ideal |
| **Equipo co-localizado**       | ⚠️ Depende      | ✅ Ideal     | ✅ Ideal           | ✅ Crítico  |
| **Proyecto grande (50+ devs)** | ✅ Funciona     | ⚠️ SAFe      | ✅ Con límites WIP | ❌ Difícil  |
| **Cliente disponible**         | ❌ No necesario | ✅ Crítico   | ✅ Importante      | ✅ Crítico  |
| **Regulación estricta**        | ✅ Ideal        | ⚠️ Adaptable | ⚠️ Adaptable       | ❌ Difícil  |
| **Innovación/Exploración**     | ❌ Mal          | ✅ Ideal     | ✅ Ideal           | ✅ Ideal    |

**Leyenda**:

- ✅ Ideal / Recomendado
- ⚠️ Posible con adaptaciones
- ❌ No recomendado

---

## ✅ Criterios de Evaluación

| Criterio                                | Puntos |
| --------------------------------------- | ------ |
| Justificación metodología por escenario | 35%    |
| Identificación de riesgos específicos   | 25%    |
| Propuesta arquitectónica coherente      | 25%    |
| Participación en debate                 | 15%    |

---

## 🤔 Preguntas de Reflexión

1. **¿Existe una metodología perfecta?** ¿Por qué o por qué no?

2. **¿Cómo influye el tamaño del equipo en la metodología?**
   - Equipo de 5 vs equipo de 50

3. **¿Qué pesa más: la metodología o la cultura del equipo?**

4. **¿Puede un proyecto cambiar de metodología a mitad de camino?**
   - ¿Cuándo sería apropiado?
   - ¿Qué riesgos implica?

---

## 📚 Recursos Adicionales

- [State of Agile Report 2024](https://stateofagile.com/) - Estadísticas de adopción
- [SAFe Framework](https://scaledagileframework.com/) - Ágil escalado
- [Agile in Government](https://18f.gsa.gov/guides/) - Gobierno de EE.UU.
- [Spotify Engineering Culture](https://engineering.atspotify.com/category/agile/) - Caso real

---

## 💼 Para tu Proyecto Integrador

Aplica lo aprendido:

1. **Define la metodología** que usarás en tu proyecto
2. **Justifica** por qué es apropiada para tu contexto
3. **Identifica riesgos** y cómo los mitigarás
4. **Documenta** en tu ADR (Architecture Decision Record)

---

**Bootcamp de Arquitectura de Software**
_SENA - Week 01 - Práctica 02_
