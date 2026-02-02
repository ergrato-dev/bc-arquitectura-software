# Semana 1: Fundamentos y Contexto - De las Metodologías a la Arquitectura

Bienvenido a la primera semana de tu viaje en la arquitectura de software. Durante las próximas seis horas estableceremos los cimientos conceptuales que te acompañarán durante todo el bootcamp y tu carrera profesional. Esta semana es fundamental porque aprenderás no solo qué es la arquitectura de software, sino por qué importa profundamente en el éxito o fracaso de los proyectos.

## Objetivos de Aprendizaje

Al finalizar esta semana serás capaz de explicar con claridad qué es la arquitectura de software y cómo se diferencia del diseño de software usando ejemplos concretos. Comprenderás el impacto real que las decisiones arquitectónicas tienen en el éxito de los proyectos de software. Identificarás las principales metodologías de desarrollo y reconocerás en qué contextos cada una funciona mejor. Establecerás la conexión entre las metodologías de desarrollo y las decisiones arquitectónicas, entendiendo cómo se influyen mutuamente. Analizarás casos reales de arquitecturas exitosas extrayendo lecciones aplicables a tus propios proyectos. Definirás tu proyecto integrador que desarrollarás durante las próximas nueve semanas.

## Distribución del Tiempo

Esta semana está organizada en sesiones claras que maximizan tu aprendizaje sin abrumarte. La sesión presencial de cuatro horas se divide en cuatro bloques temáticos con propósitos específicos. El primer bloque de sesenta minutos te introduce a la arquitectura de software y su importancia. El segundo bloque de noventa minutos recorre las principales metodologías de desarrollo. El tercer bloque de treinta minutos conecta metodología con arquitectura de manera práctica. El cuarto bloque de sesenta minutos es un taller donde analizarás un caso real en equipo.

El trabajo autónomo de dos horas te permite profundizar mediante investigación personal. Dedicarás sesenta minutos a crear una tabla comparativa de metodologías basada en fuentes confiables. Otros sesenta minutos los invertirás definiendo el proyecto que desarrollarás durante todo el trimestre.

---

## Sesión Presencial (4 horas)

### Bloque 1: ¿Por qué importa la arquitectura de software? (60 minutos)

Comenzamos con una pregunta directa que probablemente te has hecho si has trabajado en proyectos de software. ¿Por qué algunos proyectos se vuelven imposibles de mantener después de seis meses mientras otros evolucionan limpiamente durante años? La respuesta está en la arquitectura, o más precisamente, en su ausencia o en su calidad.

#### Qué es la arquitectura de software

La arquitectura de software es el conjunto de decisiones estructurales significativas que defines sobre cómo organizarás tu sistema. No estamos hablando simplemente de elegir entre React o Vue, o entre Node.js o Python. Esas son decisiones técnicas importantes pero no necesariamente arquitectónicas. La arquitectura define aspectos mucho más fundamentales del sistema.

Cuando hablamos de arquitectura nos referimos a cómo los componentes principales del sistema se relacionan entre sí. Un componente podría ser un módulo, un servicio, una capa, o cualquier unidad organizacional significativa. También hablamos de cómo fluye la información a través del sistema, qué patrones de comunicación usas entre componentes y cómo se propagan los cambios. La arquitectura incluye los principios que guían el diseño, esos criterios fundamentales que usarás para tomar decisiones cuando te enfrentes a opciones técnicas difíciles.

Las decisiones arquitectónicas son aquellas que tienen un impacto amplio en todo el sistema y son costosas de revertir una vez implementadas. Si decides que tu aplicación usará una arquitectura de microservicios en lugar de un monolito, esa decisión afectará cómo cada desarrollador escribe código, cómo se despliegan las aplicaciones, cómo se manejan las transacciones distribuidas y muchos otros aspectos. Cambiar esa decisión más adelante requeriría potencialmente reescribir gran parte del sistema.

#### Para qué sirve la arquitectura

La arquitectura de software sirve como mapa y brújula para todos los involucrados en el proyecto. Para los desarrolladores, proporciona lineamientos claros sobre cómo estructurar su código y dónde ubicar nueva funcionalidad. Cuando un nuevo programador se une al equipo, la arquitectura le permite entender rápidamente la organización del sistema sin tener que leer miles de líneas de código línea por línea.

Para los líderes técnicos y arquitectos, la arquitectura facilita la toma de decisiones consistentes. Cuando surge una pregunta sobre cómo implementar una nueva característica, la arquitectura existente sugiere el camino que mantiene la coherencia del sistema. También permite identificar riesgos técnicos tempranamente, antes de que se conviertan en problemas costosos que requieren reescrituras masivas.

Para el negocio, una arquitectura bien diseñada significa que el sistema puede evolucionar a medida que cambian las necesidades del mercado. Si tu empresa decide expandirse a nuevos mercados geográficos, una buena arquitectura permitirá agregar soporte para múltiples idiomas y monedas sin tener que reescribir todo desde cero. Si el número de usuarios crece exponencialmente, la arquitectura debe permitir escalar el sistema agregando más recursos de manera predecible y controlada.

#### Cuál es su impacto

El impacto de tener una arquitectura bien pensada versus una arquitectura pobre es dramático y se manifiesta de múltiples formas tangibles. En términos de costos económicos, mantener un sistema con buena arquitectura es significativamente más barato a lo largo del tiempo. Cuando necesitas arreglar un bug o agregar una característica, sabes exactamente dónde hacerlo y puedes estar razonablemente seguro de que tus cambios no romperán otras partes del sistema de maneras inesperadas.

La velocidad de desarrollo también se ve profundamente afectada por la calidad arquitectónica. En sistemas con arquitectura pobre, cada nueva característica toma cada vez más tiempo de implementar porque los desarrolladores deben navegar por un código enmarañado donde todo depende de todo. Lo que debería tomar un día termina tomando una semana porque primero debes entender cómo funciona el sistema existente y luego encontrar una forma de encajar tu código sin romper nada. En contraste, una arquitectura limpia y bien modularizada permite que múltiples equipos trabajen en paralelo sin pisarse los pies unos a otros.

La calidad del producto final depende enormemente de las decisiones arquitectónicas iniciales. Un sistema bien arquitectado puede manejar errores graciosamente, degradando funcionalidad de manera controlada en lugar de colapsar completamente. Puede escalar para manejar más carga agregando recursos de forma predecible. Puede ser actualizado sin tiempo de inactividad, manteniendo a los usuarios contentos y productivos.

#### Arquitectura versus Diseño de Software

Esta distinción es crucial y muchos desarrolladores la confunden al principio de sus carreras. La arquitectura y el diseño de software operan en diferentes niveles de abstracción y tienen diferentes costos de cambio asociados.

La arquitectura son las decisiones de alto nivel que afectan todo el sistema y establecen el marco dentro del cual operará el diseño. Por ejemplo, decidir que construirás una arquitectura de microservicios donde cada servicio tiene su propia base de datos es una decisión arquitectónica. Decidir que usarás comunicación asíncrona basada en eventos entre servicios es arquitectónico. Decidir qué tecnologías fundamentales usarás, como Node.js para backend o PostgreSQL para persistencia, son decisiones arquitectónicas porque afectan todo el sistema.

El diseño de software son las decisiones dentro de cada componente sobre cómo implementar funcionalidad específica. Por ejemplo, dentro de un microservicio particular, decidir usar el patrón Repository para abstraer el acceso a datos es diseño. Decidir qué estructura de clases usarás para modelar tu dominio es diseño. Decidir qué algoritmo específico implementarás para resolver un problema es diseño.

La diferencia clave está en el costo de cambio. Las decisiones de diseño son relativamente baratas de cambiar porque afectan partes localizadas del sistema. Si decides que el patrón Repository no funciona bien para tu caso, puedes cambiarlo sin afectar otros servicios. Las decisiones arquitectónicas son costosas de cambiar porque tienen efectos sistémicos. Si decides que microservicios no funcionan y quieres volver a un monolito, estás mirando potencialmente meses de trabajo de reescritura.

#### El rol del arquitecto de software

En equipos modernos, el arquitecto de software no es un personaje aislado en una torre de marfil que lanza diagramas UML a los desarrolladores desde la distancia. El arquitecto moderno es un líder técnico que colabora constantemente con el equipo de desarrollo.

El arquitecto toma las decisiones técnicas más importantes del proyecto pero lo hace en conjunto con el equipo, no de manera autoritaria. Traduce los requisitos del negocio en estructuras técnicas viables que el equipo pueda implementar. Define los estándares de codificación y las mejores prácticas que seguirá el equipo para mantener consistencia. Evalúa y selecciona las tecnologías y frameworks que se utilizarán basándose en criterios objetivos.

Quizás lo más importante es que el arquitecto documenta las decisiones arquitectónicas y sus justificaciones para que el conocimiento no se pierda cuando las personas cambien de equipo. También realiza revisiones técnicas regulares para asegurar que la implementación respeta la arquitectura definida sin volverse un cuello de botella que frene al equipo.

#### Ejemplo práctico de impacto arquitectónico

Nada ilustra mejor el impacto de la arquitectura que ver código real. Vamos a examinar dos formas radicalmente diferentes de implementar la misma funcionalidad, un sistema de procesamiento de pedidos en e-commerce.
```javascript
// Enfoque sin arquitectura clara: Todo mezclado y acoplado
// Este código "funciona" pero es imposible de mantener, probar o evolucionar

async function createOrder(req, res) {
  // Validación, lógica de negocio, acceso a datos y llamadas externas
  // todo revuelto en una sola función
  
  if (!req.body.items || req.body.items.length === 0) {
    return res.status(400).json({ error: 'No items in order' });
  }
  
  // Cálculo de total mezclado con todo lo demás
  let total = 0;
  for (const item of req.body.items) {
    total += item.price * item.quantity;
  }
  
  // Acceso directo a la base de datos desde el controlador
  const db = await getDatabase();
  const order = await db.orders.insert({
    userId: req.user.id,
    items: req.body.items,
    total: total,
    status: 'pending'
  });
  
  // Procesamiento de pago mezclado directamente aquí
  const stripe = require('stripe')(process.env.STRIPE_KEY);
  try {
    const charge = await stripe.charges.create({
      amount: total * 100,
      currency: 'usd',
      customer: req.user.stripeId
    });
    
    await db.orders.update(order.id, { 
      status: 'paid',
      paymentId: charge.id 
    });
    
    res.json({ success: true, orderId: order.id });
    
  } catch (error) {
    await db.orders.update(order.id, { status: 'failed' });
    res.status(500).json({ error: 'Payment failed' });
  }
}
```

Este primer enfoque funciona técnicamente. Puedes desplegar este código y procesar pedidos. Pero piensa en las consecuencias de esta estructura cuando el proyecto crece. Si mañana quieres cambiar de Stripe a otro procesador de pagos, tienes que modificar este controlador y probablemente muchos otros lugares donde hayas copiado lógica similar. Si quieres agregar validaciones más complejas para los pedidos, este archivo crecerá hasta convertirse en un monstruo de mil líneas. Si necesitas procesar pagos desde otro lugar de tu aplicación, tendrás que duplicar este código o crear dependencias complicadas entre controladores.

Además, probar este código es extremadamente difícil. Necesitas una base de datos real funcionando para cualquier prueba. Necesitas credenciales válidas de Stripe incluso para tests unitarios simples. No puedes probar la lógica de cálculo de totales sin toda la maquinaria de HTTP, base de datos y Stripe funcionando.

Ahora veamos el mismo problema resuelto con una arquitectura clara que separa responsabilidades siguiendo principios sólidos.
```javascript
// Enfoque con arquitectura clara: Separación de responsabilidades

// Capa de Dominio: Lógica de negocio pura sin dependencias externas
class Order {
  constructor(userId, items) {
    this.userId = userId;
    this.items = items;
    this.status = 'pending';
    this.createdAt = new Date();
  }
  
  // La lógica de cálculo está encapsulada donde corresponde
  calculateTotal() {
    return this.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  }
  
  // Las validaciones de negocio viven en la entidad de dominio
  validate() {
    if (!this.items || this.items.length === 0) {
      throw new Error('Order must have at least one item');
    }
    
    for (const item of this.items) {
      if (item.price <= 0 || item.quantity <= 0) {
        throw new Error('Invalid item price or quantity');
      }
    }
  }
  
  // Métodos que representan transiciones de estado del dominio
  markAsPaid(paymentId) {
    this.status = 'paid';
    this.paymentId = paymentId;
  }
  
  markAsFailed() {
    this.status = 'failed';
  }
}

// Capa de Aplicación: Orquesta el flujo usando servicios
class OrderService {
  constructor(orderRepository, paymentGateway) {
    // Inyección de dependencias: no conocemos implementaciones concretas
    this.orderRepository = orderRepository;
    this.paymentGateway = paymentGateway;
  }
  
  async createOrder(userId, items) {
    // Crear la entidad de dominio
    const order = new Order(userId, items);
    
    // Validar usando reglas de negocio del dominio
    order.validate();
    
    try {
      // Persistir el pedido usando la abstracción del repository
      const savedOrder = await this.orderRepository.save(order);
      
      // Procesar pago a través de la abstracción del gateway
      const payment = await this.paymentGateway.charge({
        amount: order.calculateTotal(),
        currency: 'usd',
        customerId: userId
      });
      
      // Actualizar el estado del pedido
      savedOrder.markAsPaid(payment.id);
      await this.orderRepository.update(savedOrder);
      
      return savedOrder;
      
    } catch (error) {
      if (order.id) {
        order.markAsFailed();
        await this.orderRepository.update(order);
      }
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }
}

// Capa de Infraestructura: Implementación concreta de Stripe
class StripePaymentGateway {
  constructor(apiKey) {
    this.stripe = require('stripe')(apiKey);
  }
  
  async charge({ amount, currency, customerId }) {
    // Esta clase es la ÚNICA que conoce detalles de Stripe
    const charge = await this.stripe.charges.create({
      amount: amount * 100, // Stripe usa centavos
      currency: currency,
      customer: customerId
    });
    
    return {
      id: charge.id,
      amount: charge.amount / 100,
      status: charge.status
    };
  }
}

// Capa de Presentación: Controlador delgado que solo maneja HTTP
class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }
  
  async createOrder(req, res) {
    try {
      // El controlador solo traduce entre HTTP y el servicio
      const order = await this.orderService.createOrder(
        req.user.id,
        req.body.items
      );
      
      res.status(201).json({
        success: true,
        orderId: order.id,
        total: order.calculateTotal()
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}
```

La diferencia entre estos dos enfoques es abismal. En el segundo enfoque, cada componente tiene una responsabilidad clara y bien definida. La clase Order contiene solo lógica de negocio pura sin saber nada sobre bases de datos, APIs de pago o protocolos HTTP. El OrderService orquesta el flujo completo pero trabaja con abstracciones, no con implementaciones concretas de Stripe o PostgreSQL.

Si mañana quieres cambiar de Stripe a PayPal, solo creas una nueva clase PayPalPaymentGateway que implemente la misma interfaz y cambias la configuración de inyección de dependencias. El código de negocio permanece completamente intacto. Si necesitas procesar pagos desde otro lugar de tu aplicación, reutilizas el OrderService sin duplicar código.

Esta separación también hace que el código sea infinitamente más testeable. Puedes probar la lógica de Order sin ninguna dependencia externa, solo JavaScript puro. Puedes probar OrderService usando implementaciones falsas de repository y gateway que no necesitan base de datos ni credenciales de API reales. Cada capa puede evolucionar independientemente mientras respete los contratos definidos entre capas.

Esta es arquitectura en acción, no teoría abstracta. Las decisiones de cómo organizar tu código en capas, cómo gestionar dependencias y cómo aislar lógica de negocio de detalles de infraestructura son decisiones arquitectónicas que impactan todo tu proyecto.

### Bloque 2: Panorama de las Metodologías de Desarrollo (90 minutos)

Las metodologías de desarrollo son marcos de trabajo que definen cómo planificas, ejecutas y entregas software. La metodología que elijas influirá profundamente en cuándo y cómo tomas decisiones arquitectónicas. No hay una metodología universalmente mejor, cada una brilla en ciertos contextos y sufre en otros.

#### RUP: El Proceso Unificado Racional

RUP representa el enfoque tradicional y estructurado del desarrollo de software. Surgió cuando la industria buscaba traer disciplina ingenieril al desarrollo, tratando de emular cómo otras ingenierías construyen sistemas complejos como puentes o aviones.

RUP organiza el desarrollo en cuatro fases secuenciales que se complementan entre sí. La fase de Inicio es donde defines el alcance del proyecto y determinas si vale la pena construirlo. Aquí identificas quiénes usarán el sistema y qué necesitan hacer con él de manera general. Creas un caso de negocio que justifica la inversión económica y técnica. La pregunta fundamental que respondes en esta fase es si el proyecto tiene sentido desde perspectivas de negocio, técnica y financiera.

La fase de Elaboración es donde ocurre la magia arquitectónica en RUP. Esta fase reconoce que los mayores riesgos de un proyecto suelen ser técnicos y arquitectónicos, no de requisitos. Por eso, RUP dedica tiempo significativo a diseñar la arquitectura antes de comprometerse con desarrollo masivo. Durante la Elaboración, defines la arquitectura base del sistema y la validas construyendo prototipos de las partes más riesgosas o inciertas. Al finalizar esta fase, deberías tener una arquitectura estable y confianza razonable en que es viable técnicamente.

La fase de Construcción desarrolla todas las funcionalidades restantes basándose en la arquitectura ya validada. Como la arquitectura está establecida, el desarrollo puede proceder en paralelo con múltiples equipos trabajando en diferentes componentes sin pisarse los pies constantemente. La fase de Transición finalmente despliega el sistema a producción, capacita usuarios finales y proporciona soporte inicial durante la operación.

RUP funciona bien para proyectos grandes y complejos donde múltiples equipos deben coordinarse durante períodos extensos. Es apropiado cuando los requisitos son relativamente estables y no se esperan cambios dramáticos durante el desarrollo. Funciona excelentemente cuando trabajas con clientes o stakeholders que necesitan certeza razonable sobre cronogramas y presupuestos antes de aprobar inversiones millonarias.

Sin embargo, RUP tiene desventajas significativas en otros contextos. Para proyectos pequeños con equipos de tres o cuatro personas, el overhead de documentación y procesos formales de RUP puede consumir más tiempo que el desarrollo real del software. Si estás en un dominio donde los requisitos cambian constantemente porque estás explorando un mercado nuevo, la arquitectura rígida definida extensamente en Elaboración puede convertirse en una camisa de fuerza que impide adaptación rápida.

#### SCRUM: Agilidad en la Gestión

SCRUM representa el enfoque ágil de gestión de proyectos. Es importante entender que SCRUM no es una metodología completa de desarrollo de software sino un framework de gestión que puedes combinar con prácticas técnicas de otras metodologías como XP.

SCRUM organiza el trabajo en iteraciones de tiempo fijo llamadas Sprints, típicamente de dos a cuatro semanas. La idea fundamental es simple pero poderosa. En lugar de planificar todo el proyecto por adelantado en un plan maestro detallado de seis meses, planificas solo el próximo Sprint basándote en lo que has aprendido hasta ahora. Al final de cada Sprint, entregas software potencialmente desplegable a producción, obtienes retroalimentación real de usuarios o stakeholders y ajustas tus planes para el siguiente Sprint.

El Product Backlog es una lista priorizada de todo lo que se desea eventualmente en el producto. El Product Owner, quien representa a los stakeholders y clientes, mantiene este backlog ordenado de tal manera que los items más valiosos o urgentes desde la perspectiva del negocio están al principio de la lista. Durante la Sprint Planning al inicio de cada Sprint, el equipo selecciona los items más prioritarios del Product Backlog que creen realistamente poder completar durante las próximas dos o cuatro semanas.

Cada mañana en SCRUM, el equipo tiene una reunión de pie de quince minutos llamada Daily Stand-up donde cada persona responde tres preguntas simples. Qué hice ayer para ayudar al equipo a cumplir el objetivo del Sprint. Qué haré hoy para avanzar hacia ese objetivo. Qué impedimentos me están bloqueando. Esta sincronización diaria permite detectar problemas rápidamente. Si dos desarrolladores están modificando el mismo componente y causando conflictos, lo descubren en el stand-up del día siguiente, no dos semanas después.

Al final de cada Sprint ocurre la Sprint Review donde el equipo demuestra el software funcionando a stakeholders y usuarios. Esta es tu oportunidad de validar que estás construyendo lo correcto antes de invertir más tiempo. Si implementaste una característica que pensabas era útil pero los usuarios no la entienden o no la necesitan, lo descubres inmediatamente y puedes pivotar.

Finalmente, la Sprint Retrospective permite al equipo reflexionar sobre su proceso y mejorar continuamente. Quizás descubres que pasas demasiado tiempo en code reviews porque no hay estándares de codificación claros. La retrospectiva es donde decides establecer esos estándares. O quizás notas que los bugs de integración son frecuentes. La retrospectiva es donde decides implementar pruebas de integración automatizadas.

SCRUM funciona excelentemente cuando necesitas flexibilidad ante cambios frecuentes de requisitos porque el mercado está evolucionando rápidamente. Es ideal cuando puedes tener retroalimentación continua del cliente porque construyes para ellos y quieres asegurar que entregas valor real. Funciona bien con equipos pequeños a medianos que pueden auto-organizarse efectivamente.

#### XP: Programación Extrema

Mientras SCRUM se enfoca en cómo gestionar el trabajo, Programación Extrema o XP se enfoca en cómo escribir código de manera excelente. XP surgió de la observación de que ciertas prácticas de ingeniería de software funcionan muy bien, entonces ¿por qué no llevarlas al extremo?

La práctica más transformadora de XP es Test-Driven Development o TDD. La idea parece contraintuitiva al principio. Antes de escribir cualquier código de producción, escribes una prueba que falla porque el código aún no existe. Luego escribes el código mínimo necesario para que esa prueba pase. Finalmente, refactorizas el código para mejorar su diseño manteniendo las pruebas verdes.

Esta práctica tiene un impacto profundo en tu arquitectura porque el código que emerge de TDD tiende naturalmente hacia diseños más modulares y testeables. Cuando escribes las pruebas primero, te obligas a pensar en cómo se usará tu código antes de implementarlo. Esto resulta en interfaces más limpias y componentes más desacoplados porque código fuertemente acoplado es extremadamente difícil de probar.

La Integración Continua obliga a integrar tu código al repositorio principal múltiples veces al día, ejecutando todas las pruebas automáticamente cada vez. Para que esto funcione, tu arquitectura debe soportar builds rápidos y pruebas automatizadas completas. Si tus pruebas tardan horas en ejecutarse, la integración continua se vuelve impráctica. Esto empuja naturalmente hacia arquitecturas más modulares donde puedes probar componentes aisladamente.

El Refactoring Continuo mejora constantemente la estructura interna del código sin cambiar su comportamiento externo. Con una suite completa de pruebas automatizadas, puedes refactorizar con confianza porque las pruebas detectarán si accidentalmente rompes algo. Esta práctica permite que la arquitectura evolucione limpiamente conforme aprendes más sobre el dominio del problema. No necesitas sobre-ingenieriar desde el principio anticipando cada posible requisito futuro porque sabes que puedes evolucionar el diseño limpiamente más adelante.

#### RAD: Desarrollo Rápido de Aplicaciones

RAD o Rapid Application Development prioriza la velocidad de entrega sobre otros aspectos. La filosofía de RAD es que frecuentemente es mejor tener algo funcionando rápido que puedas mejorar iterativamente, que pasar meses perfeccionando algo que quizás ya no sea relevante cuando lo termines porque el mercado cambió.

RAD usa prototipos funcionales extensivamente. En lugar de escribir especificaciones detalladas de cincuenta páginas, construyes un prototipo que los usuarios pueden tocar, usar e interactuar. Su retroalimentación inmediata y concreta guía el desarrollo real mucho mejor que especificaciones abstractas. Este enfoque funciona particularmente bien para interfaces de usuario y flujos de trabajo donde es muy difícil especificar por adelantado exactamente cómo debe verse y comportarse el sistema.

Desde una perspectiva arquitectónica, RAD a menudo acepta ciertos compromisos técnicos a cambio de velocidad de entrega. Podrías usar herramientas de desarrollo rápido o plataformas low-code que generan mucho código automáticamente aunque no sea el más elegante. Podrías reutilizar componentes existentes aunque no sean perfectos para tu caso de uso específico. Podrías posponer optimizaciones de rendimiento hasta que sean absolutamente necesarias en lugar de optimizar prematuramente.

RAD funciona bien cuando el tiempo al mercado es absolutamente crítico y llegar primero con algo bueno vale más que llegar tarde con algo perfecto. Es apropiado cuando trabajas con usuarios que pueden proporcionar retroalimentación continua y están dispuestos a iterar contigo. No funciona bien para sistemas con requisitos de rendimiento o seguridad extremadamente exigentes donde no puedes comprometer calidad técnica, ni en dominios altamente regulados que demandan documentación exhaustiva y procesos auditables.

#### Comparando las Metodologías

Para elegir la metodología apropiada debes considerar múltiples factores del contexto de tu proyecto. El tamaño del proyecto y del equipo influye significativamente. Un proyecto pequeño de tres personas construyendo una aplicación durante tres meses no necesita la ceremonia de RUP. El tiempo que pasarías creando documentación formal y diagramas UML superaría el tiempo de desarrollo real. Para ese contexto, SCRUM con prácticas de XP funcionaría perfectamente. Pero un proyecto de cien personas construyendo un sistema empresarial crítico durante dos años necesita la estructura que RUP proporciona. Sin roles claros, fases definidas y arquitectura establecida temprano, el caos reinaría.

La estabilidad de requisitos es otro factor crucial. Si estás construyendo un sistema donde los requisitos están muy claros porque estás reemplazando un sistema heredado con funcionalidad equivalente bien documentada, RUP te permite planificar exhaustivamente y ejecutar eficientemente. Por otro lado, si estás explorando un nuevo mercado o construyendo un producto innovador donde descubrirás qué necesitan los usuarios solo después de que empiecen a usarlo, necesitas la agilidad de SCRUM que te permite pivotar rápidamente basándote en aprendizajes reales.

El nivel de riesgo técnico también importa profundamente. Si estás construyendo algo en un dominio donde tienes mucha experiencia con tecnologías probadas, puedes permitir que la arquitectura emerja gradualmente al estilo XP. Pero si estás trabajando con tecnologías nuevas para tu organización o requisitos de escala sin precedentes, necesitas validar la arquitectura temprano como hace RUP durante la fase de Elaboración. No quieres descubrir seis meses después de desarrollo intenso que tu arquitectura fundamentalmente no puede escalar a los niveles que el negocio requiere.

### Bloque 3: Metodología y Arquitectura Trabajando Juntas (30 minutos)

La metodología que eliges y la arquitectura que diseñas no son decisiones independientes. Se influyen profundamente entre sí de maneras que puedes aprovechar estratégicamente o que pueden causarte dolor significativo si las ignoras.

Cuando adoptas una arquitectura monolítica donde todo el código vive en una sola aplicación grande, ciertas metodologías funcionan mejor que otras. El desarrollo monolítico se alinea naturalmente con equipos que trabajan juntos estrechamente en una base de código compartida. Puedes usar SCRUM efectivamente con un monolito bien estructurado donde el equipo completo trabaja en el mismo sprint hacia objetivos compartidos. Sin embargo, escalar más allá de cierto tamaño de equipo se vuelve problemático. Cuando tienes veinte desarrolladores todos modificando el mismo monolito, los conflictos de merge se multiplican exponencialmente, los builds se vuelven lentos y coordinar quién trabaja en qué se complica significativamente.

La arquitectura de microservicios surgió en parte precisamente para permitir que múltiples equipos trabajen independientemente con máxima autonomía. Cada equipo posee uno o más servicios completos desde el código hasta la base de datos y el despliegue, y puede desplegar independientemente de otros equipos sin coordinación centralizada. Esta arquitectura se alinea perfectamente con metodologías ágiles donde cada equipo opera como un mini-startup autónomo. Spotify, Netflix y Amazon adoptaron microservicios precisamente para permitir que cientos de ingenieros innovaran en paralelo sin necesitar coordinación central pesada que frenaría la velocidad.

En RUP, la arquitectura se define extensivamente durante la fase de Elaboración con tiempo significativo dedicado a diseñar, documentar y validar antes de comprometer recursos masivos a construcción. Se crean múltiples vistas arquitectónicas usando UML mostrando la vista lógica, la vista de procesos, la vista física y la vista de desarrollo. Se documentan decisiones arquitectónicas formalmente explicando por qué se eligió cada opción. Se valida la arquitectura construyendo prototipos arquitectónicos que prueban los aspectos más riesgosos.

Las ventajas de este enfoque son que los riesgos arquitectónicos se identifican y mitigan tempranamente antes de invertir millones. Toda la organización tiene claridad cristalina sobre la estructura del sistema antes de comenzar construcción masiva. Es más fácil estimar esfuerzos de desarrollo con confianza cuando la arquitectura está bien definida. Se facilita el trabajo en equipos grandes distribuidos geográficamente porque todos trabajan según un plan arquitectónico común.

Los desafíos son que requiere invertir tiempo significativo antes de mostrar valor tangible a stakeholders o usuarios. Cambios arquitectónicos posteriores son extremadamente costosos porque mucho código ya está escrito según la arquitectura inicial. Puede resultar en sobre-ingeniería si la arquitectura contempla muchos requisitos que nunca realmente se materializan.

En metodologías ágiles como SCRUM y XP, solo defines arquitectura suficiente para comenzar el desarrollo del primer Sprint. Las decisiones arquitectónicas se toman "just in time" cuando son absolutamente necesarias, no antes. La arquitectura emerge y se refina iterativamente conforme aprendes más sobre el dominio del problema. Se prefiere código funcionando y validado sobre documentación arquitectónica exhaustiva que nadie leerá.

Los principios arquitectónicos ágiles incluyen YAGNI que significa You Aren't Gonna Need It, evitando construir funcionalidad o estructura arquitectónica para requisitos futuros hipotéticos que quizás nunca lleguen. Se implementa solo lo que se necesita ahora para el Sprint actual. El Diseño Simple mantiene la arquitectura tan simple como sea posible para cumplir los requisitos actuales, agregando complejidad solo cuando es absolutamente necesaria y justificada. El Refactoring Continuo permite que la arquitectura evolucione limpiamente sin acumular deuda técnica que eventualmente colapse el sistema.

El enfoque moderno tiende hacia arquitectura evolutiva que combina lo mejor de ambos mundos tradicional y ágil. Ciertas decisiones arquitectónicas fundamentales se toman temprano porque son muy costosas de cambiar después, como el estilo arquitectónico principal de monolito versus microservicios versus serverless. Las tecnologías fundamentales como lenguajes de programación, frameworks principales y bases de datos se deciden temprano. Los mecanismos de comunicación entre componentes principales se establecen desde el inicio. Las estrategias de seguridad y autenticación son decisiones tempranas porque afectan todo.

Sin embargo, otros aspectos pueden y deben evolucionar iterativamente conforme aprendes más. Los patrones de diseño específicos dentro de componentes individuales pueden refinarse Sprint a Sprint. La granularidad exacta de servicios en arquitecturas de microservicios puede ajustarse según aprendes sobre límites de dominio reales. Las optimizaciones de rendimiento se hacen cuando son necesarias, no prematuramente. Los detalles de integración con sistemas externos específicos pueden definirse cuando realmente integras, no meses antes.

### Bloque 4: Taller Práctico - Caso Netflix (60 minutos)

Ahora aplicaremos todo lo aprendido analizando un caso real de una empresa que todos conocen. Netflix transformó completamente su arquitectura y metodología para poder escalar su negocio de millones de suscriptores a más de doscientos millones globalmente. Este caso demuestra vívidamente cómo las decisiones de arquitectura y metodología impactan el éxito del negocio.

#### Contexto del Caso

En 2008 Netflix era principalmente un servicio de renta de DVDs por correo con un sistema monolítico construido en los primeros años de la empresa. Este sistema funcionaba perfectamente bien para gestionar el inventario de DVDs, las colas de usuarios y el envío por correo. Sin embargo, cuando Netflix decidió pivotear estratégicamente hacia streaming de video bajo demanda, su arquitectura existente no podía manejar los requisitos radicalmente diferentes.

El streaming requiere servir video a millones de usuarios concurrentes simultáneamente, cada uno con diferentes dispositivos, diferentes anchos de banda y diferentes preferencias de contenido. El sistema monolítico de Netflix comenzó a tener problemas serios de escalabilidad. Las caídas del servicio se volvieron frecuentes y prolongadas. La capacidad de innovar y agregar nuevas características se ralentizó dramáticamente porque todo el código estaba entrelazado en el monolito.

#### Decisiones Arquitectónicas Tomadas

Netflix tomó la decisión estratégica de migrar gradualmente de su monolito a una arquitectura de microservicios durante varios años. Esta no fue una migración de big bang donde reescriben todo de una vez. Fue una transformación gradual y controlada donde extraían funcionalidad del monolito servicio por servicio mientras mantenían el sistema funcionando en producción.

Crearon cientos de microservicios pequeños y enfocados, cada uno responsable de una capacidad de negocio específica. Un servicio maneja recomendaciones de contenido. Otro servicio gestiona perfiles de usuario. Otro servicio maneja la reproducción de video adaptándose al ancho de banda disponible. Cada servicio tiene su propio equipo, su propia base de datos y su propio ciclo de despliegue independiente.

Esta arquitectura de microservicios resolvió sus problemas de escalabilidad porque ahora podían escalar servicios individuales independientemente según la demanda real. Durante la noche cuando todos en Estados Unidos están viendo Netflix, escalan los servicios de streaming masivamente. Durante el día cuando menos personas ven contenido, reducen esos recursos. El servicio de recomendaciones puede escalar independientemente del servicio de facturación porque tienen patrones de uso completamente diferentes.

#### Decisiones Metodológicas Asociadas

Arquitectónicamente Netflix adoptó microservicios, pero esta decisión arquitectónica requería cambios metodológicos correspondientes. Adoptaron metodologías ágiles con equipos autónomos donde cada equipo posee servicios completos end-to-end. Un equipo no solo escribe código sino que también opera el servicio en producción, responde a incidentes y evoluciona el servicio según las necesidades del negocio.

Implementaron entrega continua con despliegues múltiples por día. Cada equipo puede desplegar su servicio independientemente sin esperar ventanas de mantenimiento coordinadas ni aprobaciones de comités centralizados. Desarrollaron herramientas internas sofisticadas como Spinnaker para despliegues seguros y Chaos Monkey para probar que su sistema es resiliente a fallos aleatorios de servicios individuales.

Esta combinación de arquitectura de microservicios con metodología ágil les permitió innovar extremadamente rápido. Pueden probar nuevas características con subconjuntos de usuarios, medir resultados reales y desplegar globalmente o revertir basándose en datos, todo en cuestión de días no meses.

#### Actividad Grupal

Formarán equipos de tres a cuatro personas para analizar este caso durante treinta minutos. Cada equipo debe responder estas preguntas de manera profunda y fundamentada.

Primera pregunta: ¿Qué problemas específicos resolvió la arquitectura de microservicios que el monolito no podía resolver? No respondan solo "escalabilidad". Profundicen en qué tipo de escalabilidad y por qué el monolito no podía lograrla. Piensen en aspectos técnicos como escalabilidad horizontal de servicios individuales, aislamiento de fallos donde un servicio caído no tumba todo el sistema y velocidad de desarrollo con equipos independientes.

Segunda pregunta: ¿Cómo las metodologías ágiles con equipos autónomos facilitaron la transformación arquitectónica? Consideren que migrar un monolito a microservicios mientras mantienes el servicio funcionando es extremadamente complejo. ¿Cómo los equipos autónomos que pueden desplegar independientemente hicieron esto más manejable? ¿Cómo la entrega continua les permitió hacer cambios incrementales pequeños en lugar de grandes lanzamientos riesgosos?

Tercera pregunta: ¿Qué desafíos nuevos creen que introdujeron los microservicios? La arquitectura de microservicios no es una solución mágica sin costos. Piensen en complejidad operacional de monitorear y debuggear cientos de servicios distribuidos. Piensen en consistencia de datos cuando cada servicio tiene su propia base de datos. Piensen en latencia de comunicación entre servicios versus llamadas locales en un monolito.

Cuarta pregunta: ¿Qué lecciones pueden aplicar a sus propios proyectos? No todos están construyendo Netflix con doscientos millones de usuarios. Pero hay principios generales aplicables. ¿En qué punto la complejidad de microservicios se justifica versus mantenerse en un monolito bien estructurado? ¿Cómo pueden adoptar prácticas de entrega continua incluso en un monolito? ¿Qué significa autonomía de equipo en el contexto de sus proyectos?

Los últimos treinta minutos cada grupo presentará sus conclusiones en cinco minutos seguidos de discusión con toda la clase. Preparen sus respuestas de manera que puedan compartir insights concretos no solo generalidades obvias.

---

## Trabajo Autónomo (2 horas)

El trabajo autónomo de esta semana tiene dos actividades diseñadas para profundizar tu comprensión mediante investigación personal y aplicación práctica a tu propio contexto.

### Actividad 1: Tabla Comparativa de Metodologías (60 minutos)

Vas a crear un documento markdown en tu repositorio bajo la ruta `semanas/semana-01/comparacion-metodologias.md` que contenga una tabla comparativa detallada de las cuatro metodologías principales que estudiamos: RUP, SCRUM, XP y RAD.

Tu tabla debe comparar estas metodologías según al menos estos cinco criterios. Primero, flexibilidad ante cambios: ¿qué tan bien maneja cada metodología cambios de requisitos tardíos durante el desarrollo? Segundo, cantidad y tipo de documentación: ¿cuánta documentación genera cada metodología y de qué naturaleza? Tercero, tiempo hasta primer entregable: ¿cuánto tiempo pasa típicamente antes de mostrar algo funcionando al cliente o stakeholders? Cuarto, tamaño de equipo ideal: ¿para qué tamaños de equipo funciona mejor cada metodología? Quinto, nivel de involucramiento del cliente: ¿cuánta participación activa del cliente requiere cada metodología?

Puedes agregar criterios adicionales que consideres relevantes como gestión de riesgos, predictibilidad de cronogramas, facilidad de aprendizaje para equipos nuevos o adaptabilidad a diferentes tipos de proyectos.

Además de la tabla comparativa, para cada metodología identifica dos ventajas principales y dos desventajas principales basándote en tu investigación. No copies textualmente de fuentes sino que sintetiza y explica con tus propias palabras demostrando comprensión real.

Incluye al menos dos fuentes confiables que consultaste durante tu investigación. Fuentes confiables incluyen documentación oficial de las metodologías, libros reconocidos de autores como Ken Schwaber para SCRUM o Kent Beck para XP, artículos de expertos reconocidos como Martin Fowler o Robert C. Martin, papers académicos de conferencias o journals respetados. Evita blogs personales de dudosa autoridad o contenido generado por IA sin validación.

Formatea tu documento usando markdown apropiadamente con encabezados, tablas y listas donde sean apropiados. Este documento será parte de tu portafolio así que cuida la calidad de presentación y redacción.

### Actividad 2: Definir tu Proyecto del Trimestre (60 minutos)

Define el proyecto de software que desarrollarás y evolucionarás durante las próximas nueve semanas aplicando incrementalmente los conceptos que aprenderás cada semana. Este proyecto es fundamental para tu aprendizaje porque la mejor manera de entender arquitectura es practicarla en un proyecto real donde tomas decisiones y vives sus consecuencias.

Tu proyecto puede ser algo real que hayas querido construir durante mucho tiempo. Puede ser un proyecto ficticio que te parezca interesante y retador. Puede estar basado en tu experiencia laboral si ya trabajas en desarrollo. Lo importante es que sea un proyecto de complejidad suficiente para aplicar conceptos arquitectónicos pero no tan grande que sea imposible de manejar en nueve semanas.

Crea un documento en `semanas/semana-01/mi-proyecto.md` que incluya los siguientes componentes claramente estructurados.

Primero, una descripción breve del proyecto en uno o dos párrafos explicando cuál es su propósito principal, qué problema resuelve o qué necesidad satisface. Identifica claramente quiénes son los usuarios objetivo de este sistema. Por ejemplo, si es una aplicación de gestión de tareas, ¿es para uso personal, para equipos pequeños o para organizaciones grandes? Cada contexto tiene implicaciones arquitectónicas diferentes.

Segundo, enumera entre tres y cinco funcionalidades clave que el sistema debe proveer. Sé específico pero no exhaustivo. Por ejemplo, en lugar de decir "gestión de usuarios" especifica "registro de usuarios con email, autenticación con JWT, perfiles personalizables". Estas funcionalidades te ayudarán a estimar la complejidad arquitectónica necesaria.

Tercero, identifica restricciones conocidas del proyecto. ¿Tienes restricciones de tiempo más allá del trimestre? ¿Tienes restricciones de presupuesto si piensas usar servicios en la nube de pago? ¿Hay restricciones tecnológicas como que debe funcionar en un dispositivo específico o integrarse con un sistema existente particular? ¿Hay restricciones de equipo como que trabajarás solo versus con otros colaboradores?

Cuarto, identifica riesgos percibidos en tres categorías. Riesgos técnicos como usar tecnologías que no conoces bien o requisitos de rendimiento que nunca has enfrentado. Riesgos de negocio como que quizás no haya usuarios reales interesados en tu solución. Riesgos de recursos como que quizás no tengas tiempo suficiente para implementar todo lo que imaginas. Identificar riesgos temprano te permite pensar en estrategias de mitigación.

Quinto, elige la metodología de desarrollo que consideras más apropiada para este proyecto específico. Puede ser una de las que estudiamos como RUP, SCRUM, XP o RAD, o puede ser una combinación híbrida. Lo importante es que justifiques tu elección en al menos un párrafo sólido explicando cómo las características de tu proyecto se alinean con las fortalezas de la metodología elegida. Por ejemplo, si eliges SCRUM, explica por qué la iteración corta y retroalimentación frecuente benefician tu proyecto específico.

Sexto, sin entrar todavía en detalles técnicos profundos que veremos en semanas posteriores, identifica tres decisiones arquitectónicas importantes que deberías tomar tempranamente. Estas decisiones son aquellas que serían muy costosas de cambiar después. Por ejemplo, ¿será una aplicación web que funciona en navegadores, una aplicación móvil nativa, o ambas? ¿Necesitarás trabajar offline o puedes asumir conectividad constante? ¿Cuántos usuarios concurrentes esperas aproximadamente y qué implicaciones tiene esto para tu arquitectura? ¿Qué tan críticos son el rendimiento y la disponibilidad para tu caso de uso?

Este proyecto evolucionará cada semana. En la Semana 2 aplicarás principios SOLID a tu código. En la Semana 3 elegirás patrones arquitectónicos apropiados. En la Semana 6 considerarás si microservicios tienen sentido o si un monolito bien estructurado es mejor. Para la Semana 9 tendrás un proyecto completo con arquitectura bien documentada que puedes mostrar con orgullo en tu portafolio profesional.

---

## Evaluación de la Semana 1

La evaluación de esta semana es formativa, diseñada para ayudarte a identificar áreas donde estás fuerte y áreas donde necesitas reforzar tu comprensión. Usa esta rúbrica como guía no solo para ser evaluado sino para autoevaluarte honestamente y dirigir tu estudio.

| Criterio | Excelente (90-100%) | Bueno (75-89%) | Aceptable (60-74%) | Necesita Mejorar (<60%) |
|----------|---------------------|----------------|-------------------|------------------------|
| **Comprensión de Arquitectura de Software** | Explica claramente arquitectura versus diseño con ejemplos propios originales que demuestran comprensión profunda. Articula el impacto específico de decisiones arquitectónicas en el éxito o fracaso de proyectos con casos concretos. Identifica correctamente qué decisiones son arquitectónicas versus de diseño en escenarios ambiguos. | Explica la diferencia entre arquitectura y diseño correctamente con ejemplos adecuados aunque no completamente originales. Identifica cómo la arquitectura afecta proyectos de manera general con algunos detalles específicos. Reconoce la mayoría de decisiones arquitectónicas en casos claros. | Diferencia arquitectura de diseño de forma básica con ejemplos simples o estándar. Menciona impacto general en proyectos sin profundizar en mecanismos específicos. Confunde ocasionalmente decisiones arquitectónicas con de diseño. | Confunde frecuentemente arquitectura con diseño mostrando comprensión superficial. No articula claramente el impacto de decisiones arquitectónicas. No puede identificar qué decisiones son arquitectónicas en casos prácticos. |
| **Conocimiento de Metodologías de Desarrollo** | Compara metodologías usando múltiples criterios relevantes con análisis profundo de ventajas y desventajas en diferentes contextos. Identifica con precisión cuándo aplicar cada metodología con justificación sólida basada en características del proyecto. Reconoce que no hay metodología universalmente mejor sino adecuación contextual. | Describe características principales de cada metodología correctamente con buen nivel de detalle. Sugiere contextos apropiados para cada metodología con justificación razonable. Compara metodologías usando criterios relevantes aunque el análisis podría ser más profundo. | Enumera características básicas de las metodologías sin profundizar significativamente. Menciona diferencias generales entre tradicionales y ágiles. Sugiere contextos apropiados de manera general sin justificación detallada. | Describe metodologías de manera superficial o con errores significativos. No identifica diferencias clave entre metodologías. No puede sugerir cuándo usar cada metodología o lo hace con justificación inadecuada. |
| **Análisis del Caso Netflix** | Identifica múltiples conexiones específicas entre decisiones arquitectónicas y metodológicas en el caso. Extrae lecciones aplicables concretas a otros contextos con razonamiento claro. Analiza tanto beneficios como desafíos de las decisiones tomadas demostrando pensamiento crítico. | Relaciona arquitectura de microservicios con metodología ágil en el caso correctamente. Identifica lecciones generales aplicables. Menciona algunos desafíos además de beneficios mostrando análisis balanceado. | Menciona aspectos básicos del caso sin profundizar en conexiones entre arquitectura y metodología. Extrae lecciones obvias sin razonamiento profundo. Se enfoca principalmente en aspectos positivos sin considerar desafíos. | No conecta arquitectura con metodología en el caso de manera clara. Análisis superficial sin insights significativos. Menciona solo hechos obvios sin reflexión crítica. |
| **Tabla Comparativa de Metodologías** | Tabla completa, precisa y bien fundamentada con información de fuentes confiables citadas apropiadamente. Análisis profundo de ventajas y desventajas con comprensión demostrada. Formato markdown limpio y profesional. Criterios de comparación relevantes y bien elegidos. | Tabla completa con información correcta y relevante. Ventajas y desventajas identificadas apropiadamente. Fuentes confiables incluidas. Formato markdown adecuado aunque podría mejorarse. | Tabla con información básica correcta pero no profunda. Ventajas y desventajas genéricas sin análisis detallado. Fuentes incluidas aunque podrían ser más autorizadas. Formato markdown funcional. | Tabla incompleta o con información incorrecta significativa. Ventajas y desventajas superficiales o poco relevantes. Sin fuentes o fuentes poco confiables. Formato markdown pobre o inconsistente. |
| **Definición de Proyecto Integrador** | Proyecto bien definido con alcance claro y realista para nueve semanas. Metodología elegida con justificación sólida alineada con características del proyecto. Decisiones arquitectónicas tempranas identificadas apropiadamente con razonamiento. Demuestra pensamiento estratégico sobre el proyecto. | Proyecto definido adecuadamente con propósito claro. Metodología apropiada para el contexto con justificación razonable. Decisiones arquitectónicas relevantes identificadas. Alcance parece manejable. | Proyecto definido de forma general con algunos detalles faltantes. Metodología mencionada sin justificación profunda. Decisiones arquitectónicas mencionadas aunque podrían ser más específicas. Alcance quizás ambicioso o impreciso. | Proyecto vago, poco realista o demasiado trivial para nueve semanas. Metodología elegida sin justificación clara o inadecuada para el proyecto. Decisiones arquitectónicas no identificadas o irrelevantes. Demuestra poca planificación estratégica. |
| **Participación y Comunicación** | Contribuye activamente en discusiones con ideas fundamentadas que agregan valor. Hace preguntas perspicaces que profundizan la comprensión grupal. Comunica conceptos claramente con ejemplos apropiados. Escucha activamente y construye sobre ideas de compañeros. | Participa regularmente con contribuciones relevantes al tema. Hace preguntas pertinentes. Se expresa con claridad en la mayoría de situaciones. Colabora apropiadamente en actividades grupales. | Participa ocasionalmente cuando se le solicita directamente. Comunicación básica de ideas sin profundidad significativa. Colabora de manera mínima en actividades grupales. | Participación mínima o nula en discusiones. Dificultad notable para comunicar ideas técnicas. No colabora efectivamente en actividades grupales. Actitud pasiva o desinteresada. |

La nota final de la Semana 1 se calcula ponderando cada criterio de la siguiente manera. Comprensión de Arquitectura de Software vale veinte por ciento porque es el concepto fundamental de todo el bootcamp. Conocimiento de Metodologías de Desarrollo vale veinte por ciento porque establece el contexto para decisiones arquitectónicas. Análisis del Caso Netflix vale quince por ciento porque demuestra capacidad de extraer lecciones de casos reales. Tabla Comparativa vale veinte por ciento porque demuestra capacidad de investigar y sintetizar información. Definición de Proyecto Integrador vale quince por ciento porque establece la base para todo el trimestre. Participación y Comunicación vale diez por ciento porque el aprendizaje colaborativo es esencial en arquitectura de software.

---

## Material de Apoyo y Recursos

### Lecturas Obligatorias

Para complementar lo visto en clase esta semana, debes leer los siguientes materiales breves pero fundamentales.

El Manifiesto Ágil original disponible en agilemanifesto.org toma solo diez minutos leerlo completo incluyendo los doce principios. Este documento es fundamental para entender la filosofía que sustenta metodologías modernas como SCRUM y XP. No es una especificación técnica sino una declaración de valores que cambió cómo desarrollamos software.

El artículo "Who Needs an Architect?" de Martin Fowler disponible en su sitio web examina el rol del arquitecto de software en equipos modernos. Fowler distingue entre arquitectura irreversible que son las decisiones costosas de cambiar y arquitectura reversible que puede evolucionar. Esta distinción es crucial para arquitectura evolutiva.

El primer capítulo de "Software Architecture in Practice" de Bass, Clements y Kazman proporciona una definición rigurosa y académica de arquitectura de software. Este libro es uno de los textos fundamentales en el campo y vale la pena conocer su perspectiva formal.

### Lecturas Recomendadas (Opcionales)

Si quieres profundizar más allá de lo estrictamente necesario, estas lecturas adicionales son muy valiosas.

"The Mythical Man-Month" de Fred Brooks, particularmente el ensayo que da título al libro, explica por qué agregar más personas a un proyecto de software retrasado lo retrasa aún más. Aunque fue escrito en 1975, sus lecciones sobre comunicación en equipos y complejidad de proyectos son completamente relevantes hoy.

"The Architecture of Open Source Applications" disponible gratuitamente online analiza la arquitectura de proyectos open source famosos como NGINX, Firefox y PostgreSQL. Ver cómo arquitectos experimentados toman decisiones en proyectos reales es extremadamente educativo.

### Videos Recomendados

"Microservices" por Martin Fowler de aproximadamente veintiséis minutos es una excelente introducción al tema de microservicios, explicando qué son, cuándo tienen sentido y cuáles son sus trade-offs comparados con monolitos.

"Agile is Dead" por Dave Thomas, uno de los autores originales del Manifiesto Ágil, reflexiona sobre cómo las metodologías ágiles han sido mal interpretadas y comercializadas. Este video de cuarenta y cinco minutos te ayuda a entender el espíritu original del movimiento ágil más allá de las modas corporativas.

### Herramientas Introductorias

Esta semana no necesitas instalar muchas herramientas todavía, pero asegúrate de tener lo siguiente configurado para las próximas semanas.

Node.js versión LTS más reciente instalada en tu sistema. Verifica con `node --version` que tienes al menos la versión 20. 

pnpm instalado globalmente para gestión de paquetes. Nunca usaremos npm en este bootcamp porque pnpm es significativamente más rápido y eficiente. Instálalo con `npm install -g pnpm` si aún usas npm para esta última vez.

Git configurado correctamente con tu nombre y email. Verifica con `git config --global user.name` y `git config --global user.email`.

Una cuenta activa de GitHub donde alojarás tu repositorio `BC-ARQUITECTURA-SOFTWARE`.

Un editor de código moderno como Visual Studio Code con extensiones para JavaScript, markdown y Git.

---

## Reflexión Final de la Semana

Has completado exitosamente la primera semana de tu formación en Arquitectura de Software. En estas seis horas has establecido bases conceptuales sólidas que te acompañarán durante todo el bootcamp y tu carrera profesional posterior.

Ahora comprendes que la arquitectura de software no es un lujo para proyectos millonarios sino una necesidad estratégica para cualquier proyecto que aspire a evolucionar limpiamente en el tiempo. Has visto cómo las metodologías de desarrollo tradicionales y ágiles influyen profundamente en cuándo y cómo tomas decisiones arquitectónicas. Has analizado el caso real de Netflix donde decisiones arquitectónicas y metodológicas permitieron escalar de millones a cientos de millones de usuarios. Has comenzado a pensar como arquitecto considerando no solo el qué y el cómo sino especialmente el por qué de las decisiones técnicas.

Más importante aún, has definido tu proyecto integrador que será tu compañero de aprendizaje durante las próximas ocho semanas. Cada semana agregarás capas de conocimiento y sofisticación arquitectónica a tu proyecto hasta tener un portafolio que demuestre tangiblemente tus capacidades.

En la Semana 2 nos sumergiremos en los Principios SOLID, esos fundamentos sobre los cuales se construye código y arquitectura de calidad verdaderamente sostenible en el tiempo. Verás cómo aplicar estos principios impacta directamente la mantenibilidad y evolución de tu arquitectura.

Nos vemos en la Semana 2. Mientras tanto, completa tu trabajo autónomo con dedicación porque el aprendizaje real ocurre cuando aplicas los conceptos por tu cuenta, no solo cuando los escuchas en clase.

---

**Próxima semana**: [Semana 2 - Principios SOLID](../semana-02/README.md)

**Volver al inicio**: [Índice del Bootcamp](../../README.md)

