# Assets Week 03: Patrones Arquitectónicos Clásicos

Este directorio contiene los diagramas visuales de apoyo para la teoría de la semana 03.

## 📊 Diagramas Disponibles

### 1. `01-patron-vs-diseno.svg`

**Propósito**: Diferencia entre patrón arquitectónico y patrón de diseño
**Usado en**: [01-introduccion-patrones.md](../1-teoria/01-introduccion-patrones.md)

```mermaid
graph TB
    subgraph "PATRÓN ARQUITECTÓNICO"
        A[Sistema Completo]
        A --> B[Estructura General]
        A --> C[Componentes Principales]
        A --> D[Decisiones de Alto Nivel]
        style A fill:#e1f5ff
    end

    subgraph "PATRÓN DE DISEÑO"
        E[Módulo Específico]
        E --> F[Solución de Código]
        E --> G[Clases y Métodos]
        E --> H[Implementación]
        style E fill:#fff4e1
    end

    A -.-> E

    style A fill:#4a90e2
    style E fill:#f5a623
```

### 2. `02-layered-architecture.svg`

**Propósito**: Arquitectura en capas con 3 niveles
**Usado en**: [02-patron-capas.md](../1-teoria/02-patron-capas.md)

```mermaid
graph TB
    subgraph "ARQUITECTURA EN CAPAS"
        P[Capa de Presentación<br/>UI/API/CLI]
        N[Capa de Negocio<br/>Lógica y Validaciones]
        D[Capa de Datos<br/>BD/Repositorios]

        P -->|llama| N
        N -->|llama| D

        style P fill:#e8f5e9
        style N fill:#fff3e0
        style D fill:#e3f2fd
    end

    U[Usuario/Cliente] -->|interactúa| P
    D -->|accede| DB[(Base de Datos)]
```

### 3. `03-client-server.svg`

**Propósito**: Arquitectura Cliente-Servidor
**Usado en**: [03-cliente-servidor-eventos.md](../1-teoria/03-cliente-servidor-eventos.md)

```mermaid
graph LR
    subgraph Clientes
        C1[Cliente Web<br/>Navegador]
        C2[Cliente Móvil<br/>App iOS/Android]
        C3[Cliente CLI<br/>Terminal]
    end

    subgraph Servidor
        S[Servidor API<br/>Lógica + BD]
    end

    C1 -->|HTTP Request| S
    C2 -->|HTTP Request| S
    C3 -->|HTTP Request| S

    S -->|Response| C1
    S -->|Response| C2
    S -->|Response| C3

    S --> DB[(Base de Datos)]

    style C1 fill:#e1f5ff
    style C2 fill:#e1f5ff
    style C3 fill:#e1f5ff
    style S fill:#fff4e1
```

### 4. `04-event-driven.svg`

**Propósito**: Arquitectura basada en eventos
**Usado en**: [03-cliente-servidor-eventos.md](../1-teoria/03-cliente-servidor-eventos.md)

```mermaid
graph TB
    subgraph Productores
        P1[Servicio de Órdenes]
        P2[Servicio de Usuarios]
    end

    EB[Event Bus<br/>RabbitMQ/Kafka]

    subgraph Consumidores
        C1[Servicio de Pagos]
        C2[Servicio de Email]
        C3[Servicio de Analytics]
        C4[Servicio de Notificaciones]
    end

    P1 -->|emite eventos| EB
    P2 -->|emite eventos| EB

    EB -->|order:created| C1
    EB -->|order:created| C2
    EB -->|order:created| C3
    EB -->|user:registered| C4

    style P1 fill:#e8f5e9
    style P2 fill:#e8f5e9
    style EB fill:#fff3e0
    style C1 fill:#e3f2fd
    style C2 fill:#e3f2fd
    style C3 fill:#e3f2fd
    style C4 fill:#e3f2fd
```

### 5. `05-mvc-mvvm.svg`

**Propósito**: Comparación MVC vs MVVM
**Usado en**: [04-mvc-mvvm.md](../1-teoria/04-mvc-mvvm.md)

```mermaid
graph TB
    subgraph "MVC"
        U1[Usuario] -->|input| C1[Controller]
        C1 -->|actualiza| M1[Model]
        C1 -->|actualiza| V1[View]
        M1 -.->|notifica| V1
        V1 -->|muestra| U1

        style C1 fill:#fff3e0
        style M1 fill:#e8f5e9
        style V1 fill:#e3f2fd
    end

    subgraph "MVVM"
        U2[Usuario] -->|input| V2[View]
        V2 <-->|data binding| VM[ViewModel]
        VM -->|actualiza| M2[Model]
        M2 -.->|notifica| VM
        V2 -->|muestra| U2

        style V2 fill:#e3f2fd
        style VM fill:#fff3e0
        style M2 fill:#e8f5e9
    end
```

### 6. `06-matriz-seleccion.svg`

**Propósito**: Matriz de criterios para seleccionar patrón
**Usado en**: [05-seleccion-patron.md](../1-teoria/05-seleccion-patron.md)

```mermaid
graph TB
    subgraph "Criterios de Selección"
        RF[Requerimientos<br/>No Funcionales]
        RT[Restricciones<br/>Técnicas]
        RN[Restricciones<br/>de Negocio]
        CD[Contexto del<br/>Dominio]
    end

    subgraph "Factores"
        RF --> F1[Performance]
        RF --> F2[Escalabilidad]
        RF --> F3[Seguridad]

        RT --> F4[Stack Tecnológico]
        RT --> F5[Infraestructura]

        RN --> F6[Tiempo]
        RN --> F7[Presupuesto]
        RN --> F8[Tamaño Equipo]

        CD --> F9[Tipo de App]
        CD --> F10[Usuarios]
    end

    subgraph "Decisión"
        F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 --> D[Patrón<br/>Seleccionado]
    end

    style RF fill:#e8f5e9
    style RT fill:#fff3e0
    style RN fill:#e3f2fd
    style CD fill:#f3e5f5
    style D fill:#ffeb3b
```

---

## 🛠️ Generación de SVG

Los diagramas Mermaid pueden convertirse a SVG usando:

1. **Mermaid Live Editor**: https://mermaid.live/
2. **CLI**: `mmdc -i diagram.mmd -o output.svg`
3. **VS Code**: Extensión "Markdown Preview Mermaid Support"

## 📐 Especificaciones

- **Formato**: SVG (escalable)
- **Ancho recomendado**: 800-1200px
- **Colores**: Paleta consistente con branding bc-channel-epti
- **Fuente**: Sans-serif (Arial, Helvetica)

---

**Bootcamp de Arquitectura de Software - Semana 03**  
_SENA - Tecnología en Análisis y Desarrollo de Software_  
_bc-channel-epti_
