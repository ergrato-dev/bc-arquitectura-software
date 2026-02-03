# 🔍 Práctica 01: Análisis de Arquitecturas Reales

## 📋 Información General

| Campo              | Detalle                                     |
| ------------------ | ------------------------------------------- |
| **Duración**       | 45 minutos                                  |
| **Nivel**          | Intermedio                                  |
| **Prerrequisitos** | Teoría semana 03 (patrones arquitectónicos) |
| **Entregable**     | Documento de análisis completado            |

---

## 🎯 Objetivos de Aprendizaje

Al finalizar esta práctica serás capaz de:

- ✅ Identificar patrones arquitectónicos en sistemas del mundo real
- ✅ Analizar las razones detrás de las decisiones arquitectónicas
- ✅ Relacionar requisitos de negocio con patrones seleccionados
- ✅ Documentar hallazgos de forma estructurada

---

## 📖 Introducción

Los patrones arquitectónicos no existen solo en los libros. Las empresas tecnológicas más exitosas del mundo los utilizan diariamente para resolver problemas reales de escalabilidad, mantenimiento y rendimiento.

En esta práctica, analizaremos arquitecturas de empresas como **Netflix**, **Slack** y **Uber** para entender cómo aplican los patrones que estudiamos en la teoría.

> 💡 **Tip**: Cuando analices una arquitectura, pregúntate: "¿Qué problema específico resuelve esta decisión?"

---

## 🏢 Caso 1: Netflix

### Contexto del Negocio

- **Usuarios**: +230 millones de suscriptores globales
- **Contenido**: Miles de películas y series
- **Reto principal**: Streaming de video a escala masiva con alta disponibilidad

### Arquitectura Observada

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTES                                  │
│   (Smart TV, Móvil, Web, Consolas de videojuegos)               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY                                 │
│              (Zuul - Enrutamiento y filtros)                    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  Servicio de  │   │  Servicio de  │   │  Servicio de  │
│   Usuarios    │   │   Catálogo    │   │   Streaming   │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   PostgreSQL  │   │  Cassandra    │   │     CDN       │
└───────────────┘   └───────────────┘   └───────────────┘
```

### 📝 Ejercicio 1.1: Identificar Patrones

Completa la siguiente tabla identificando los patrones presentes:

| Componente               | Patrón Identificado          | Justificación                |
| ------------------------ | ---------------------------- | ---------------------------- |
| API Gateway              | **\*\*\*\***\_\_**\*\*\*\*** | **\*\*\*\***\_\_**\*\*\*\*** |
| Servicios independientes | **\*\*\*\***\_\_**\*\*\*\*** | **\*\*\*\***\_\_**\*\*\*\*** |
| CDN para streaming       | **\*\*\*\***\_\_**\*\*\*\*** | **\*\*\*\***\_\_**\*\*\*\*** |

### 📝 Ejercicio 1.2: Preguntas de Análisis

Responde las siguientes preguntas:

1. **¿Por qué Netflix no usa un monolito?**

   _Tu respuesta:_

   ```



   ```

2. **¿Qué pasaría si el servicio de usuarios falla?**

   _Tu respuesta:_

   ```



   ```

3. **¿Cómo beneficia el CDN al patrón Cliente-Servidor?**

   _Tu respuesta:_

   ```



   ```

---

## 💬 Caso 2: Slack

### Contexto del Negocio

- **Usuarios**: +20 millones de usuarios activos diarios
- **Mensajes**: Millones de mensajes en tiempo real
- **Reto principal**: Comunicación instantánea sin pérdida de mensajes

### Arquitectura Observada

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENTES SLACK                               │
│              (Desktop, Web, Móvil)                               │
└───────────────────────────┬─────────────────────────────────────┘
                            │ WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   GATEWAY DE TIEMPO REAL                         │
│                  (Conexiones persistentes)                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MESSAGE BROKER                              │
│                (Cola de mensajes - Kafka)                        │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   Evento:       │   Evento:       │   Evento:                   │
│ message:sent    │ user:typing     │ channel:updated             │
└────────┬────────┴────────┬────────┴────────┬────────────────────┘
         │                 │                 │
         ▼                 ▼                 ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  Persistencia │  │  Notificador  │  │   Indexador   │
│   de Mensajes │  │     Push      │  │   (Búsqueda)  │
└───────────────┘  └───────────────┘  └───────────────┘
```

### 📝 Ejercicio 2.1: Identificar Patrón Principal

**¿Qué patrón arquitectónico domina en Slack?**

- [ ] Layered Architecture
- [ ] Cliente-Servidor tradicional
- [ ] Event-Driven Architecture
- [ ] MVC

**Justifica tu respuesta:**

```




```

### 📝 Ejercicio 2.2: Flujo de un Mensaje

Describe paso a paso qué sucede cuando un usuario envía un mensaje:

| Paso | Componente       | Acción                          |
| ---- | ---------------- | ------------------------------- |
| 1    | Cliente          | Usuario escribe y envía mensaje |
| 2    | \***\*\_\_\*\*** | \***\*\_\_\*\***                |
| 3    | \***\*\_\_\*\*** | \***\*\_\_\*\***                |
| 4    | \***\*\_\_\*\*** | \***\*\_\_\*\***                |
| 5    | \***\*\_\_\*\*** | \***\*\_\_\*\***                |

### 📝 Ejercicio 2.3: Ventajas del Event-Driven

Lista 3 ventajas que obtiene Slack al usar Event-Driven:

1. ***
2. ***
3. ***

---

## 🚗 Caso 3: Uber

### Contexto del Negocio

- **Operaciones**: +100 ciudades en el mundo
- **Viajes**: Millones de viajes diarios
- **Reto principal**: Conectar conductores y pasajeros en tiempo real

### Arquitectura Simplificada

```
┌─────────────────┐         ┌─────────────────┐
│   App Pasajero  │         │  App Conductor  │
└────────┬────────┘         └────────┬────────┘
         │                           │
         └───────────┬───────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │     API Gateway       │
         └───────────┬───────────┘
                     │
     ┌───────────────┼───────────────┐
     ▼               ▼               ▼
┌─────────┐   ┌───────────┐   ┌───────────┐
│ Servicio│   │  Servicio │   │ Servicio  │
│ Usuarios│   │  Matching │   │   Pagos   │
└────┬────┘   └─────┬─────┘   └─────┬─────┘
     │              │               │
     │              ▼               │
     │    ┌─────────────────┐      │
     │    │  Event Stream   │      │
     │    │ (Ubicaciones    │      │
     │    │  en tiempo real)│      │
     │    └─────────────────┘      │
     │                             │
     ▼                             ▼
┌─────────────────────────────────────┐
│           Base de Datos             │
└─────────────────────────────────────┘
```

### 📝 Ejercicio 3.1: Patrones Combinados

Uber combina múltiples patrones. Identifica al menos 2:

| Patrón               | Dónde se aplica      | Para qué sirve       |
| -------------------- | -------------------- | -------------------- |
| \***\*\_\_\_\_\*\*** | \***\*\_\_\_\_\*\*** | \***\*\_\_\_\_\*\*** |
| \***\*\_\_\_\_\*\*** | \***\*\_\_\_\_\*\*** | \***\*\_\_\_\_\*\*** |

### 📝 Ejercicio 3.2: Comparación

¿En qué se parece y diferencia la arquitectura de Uber con la de Slack?

**Similitudes:**

```



```

**Diferencias:**

```



```

---

## 🎯 Ejercicio Final: Tu Análisis

### Elige una aplicación que uses diariamente y analízala:

**Aplicación elegida:** ****\*\*****\_\_\_****\*\*****

**Funcionalidad principal:** ****\*\*****\_\_\_****\*\*****

### Diagrama de arquitectura probable:

```
(Dibuja aquí tu diagrama de la arquitectura que crees que tiene)










```

### Patrones identificados:

| Patrón               | Evidencia/Razón      |
| -------------------- | -------------------- |
| \***\*\_\_\_\_\*\*** | \***\*\_\_\_\_\*\*** |
| \***\*\_\_\_\_\*\*** | \***\*\_\_\_\_\*\*** |
| \***\*\_\_\_\_\*\*** | \***\*\_\_\_\_\*\*** |

### Reflexión final:

¿Qué patrón usarías si tuvieras que construir esta aplicación desde cero? ¿Por qué?

```




```

---

## ✅ Checklist de Entrega

- [ ] Completé el análisis de Netflix (Ejercicios 1.1 y 1.2)
- [ ] Completé el análisis de Slack (Ejercicios 2.1, 2.2 y 2.3)
- [ ] Completé el análisis de Uber (Ejercicios 3.1 y 3.2)
- [ ] Realicé el ejercicio final con una aplicación de mi elección
- [ ] Puedo explicar por qué cada empresa eligió su patrón

---

## 📚 Recursos Adicionales

- [Netflix Tech Blog](https://netflixtechblog.com/)
- [Slack Engineering](https://slack.engineering/)
- [Uber Engineering](https://eng.uber.com/)

---

## 🔑 Claves de Respuesta (Solo para Instructores)

<details>
<summary>Ver respuestas sugeridas</summary>

### Ejercicio 1.1 - Netflix

| Componente               | Patrón                       | Justificación                        |
| ------------------------ | ---------------------------- | ------------------------------------ |
| API Gateway              | API Gateway Pattern          | Punto único de entrada, enrutamiento |
| Servicios independientes | Microservicios               | Escalado independiente               |
| CDN                      | Cliente-Servidor distribuido | Acercar contenido al usuario         |

### Ejercicio 2.1 - Slack

**Respuesta correcta:** Event-Driven Architecture

**Justificación:** Los mensajes se manejan como eventos que fluyen a través de un message broker (Kafka), permitiendo que múltiples consumidores procesen el mismo evento de forma independiente.

</details>

---

**¡Felicidades! 🎉** Has completado el análisis de arquitecturas reales. Ahora entiendes cómo las grandes empresas aplican los patrones que estamos estudiando.

---

[⬅️ Volver a Teoría](../1-teoria/) | [➡️ Siguiente Práctica](02-practica-layered.md)
