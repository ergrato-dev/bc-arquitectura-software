# 💻 Práctica 03 — Patrones de Comportamiento en Acción

## 🎯 Objetivos

- Implementar **Observer** para un sistema de eventos de dominio
- Implementar **Strategy** para un motor de reglas de negocio
- Combinar Observer + Strategy en un sistema cohesivo

## ⏱️ Duración estimada: 40 minutos

---

## 🏋️ Ejercicio 1 — Observer: Gestión de Eventos de Estudiantes (20 min)

### El Escenario

**EduFlow** necesita que cuando un estudiante complete una tarea, múltiples sistemas reaccionen automáticamente:
- 🏆 Sistema de **logros** verifica si ganó una medalla
- 📊 Motor de **analytics** registra la actividad
- 📩 Sistema de **notificaciones** envía feedback
- 👩‍🏫 Panel del **instructor** actualiza el progreso

Sin Observer, el servicio de tareas tendría que conocer y llamar a los 4 sistemas. Con Observer, solo emite un evento.

### Implementación

```javascript
// src/observer/event-bus.js
// EventBus genérico — puede usarse en toda la aplicación

class EventBus {
  static #instance = null;   // También demuestra Singleton
  #handlers = new Map();

  static getInstance() {
    if (!EventBus.#instance) {
      EventBus.#instance = new EventBus();
    }
    return EventBus.#instance;
  }

  /**
   * Suscribirse a un evento
   * @param {string} event - Nombre del evento (ej: 'task.completed')
   * @param {Function} handler - Manejador del evento
   * @returns {Function} Función para cancelar la suscripción
   */
  on(event, handler) {
    if (!this.#handlers.has(event)) {
      this.#handlers.set(event, new Set());
    }
    this.#handlers.get(event).add(handler);

    // Retornar función de cleanup (patrón moderno)
    return () => this.off(event, handler);
  }

  /**
   * Desuscribirse
   */
  off(event, handler) {
    this.#handlers.get(event)?.delete(handler);
  }

  /**
   * Emitir un evento de forma asíncrona
   * @param {string} event
   * @param {Object} payload
   */
  async emit(event, payload) {
    const handlers = this.#handlers.get(event);
    if (!handlers || handlers.size === 0) return;

    // Ejecutar todos los handlers — fallos aislados
    const results = await Promise.allSettled(
      [...handlers].map(handler => Promise.resolve(handler(payload)))
    );

    // Log de handlers fallidos (no interrumpe el flujo)
    results.forEach((result, i) => {
      if (result.status === 'rejected') {
        console.error(`[EventBus] Handler ${i + 1} para "${event}" falló:`, result.reason);
      }
    });
  }

  getRegisteredEvents() {
    return [...this.#handlers.keys()];
  }
}

export { EventBus };
```

```javascript
// src/observer/achievement-handler.js
// Observer: Sistema de logros

const ACHIEVEMENTS = {
  FIRST_TASK: { id: 'first_task', name: '¡Primera Tarea!', xp: 50 },
  SPEED_DEMON: { id: 'speed_demon', name: 'Velocidad Relámpago', xp: 100 },
  PERFECT_SCORE: { id: 'perfect_score', name: 'Puntaje Perfecto', xp: 200 },
};

const achievementHandler = async ({ studentId, task, completedAt, grade }) => {
  const unlocked = [];

  if (grade === 100) {
    unlocked.push(ACHIEVEMENTS.PERFECT_SCORE);
  }

  const timeTaken = completedAt - new Date(task.createdAt);
  if (timeTaken < 3600000) { // menos de 1 hora
    unlocked.push(ACHIEVEMENTS.SPEED_DEMON);
  }

  if (unlocked.length > 0) {
    console.log(`🏆 [Logros] Estudiante ${studentId} desbloqueó:`,
      unlocked.map(a => `"${a.name}" (+${a.xp} XP)`).join(', ')
    );
  } else {
    console.log(`🏆 [Logros] Verificando logros para ${studentId}... ninguno nuevo.`);
  }

  return unlocked;
};

export { achievementHandler };
```

```javascript
// src/observer/analytics-handler.js
// Observer: Motor de analytics

const analyticsHandler = async ({ studentId, task, grade, completedAt }) => {
  const event = {
    type: 'task_completed',
    studentId,
    taskId: task.id,
    grade,
    timestamp: completedAt,
    weekNumber: task.weekNumber,
  };
  console.log(`📊 [Analytics] Registrando evento:`, JSON.stringify(event));
  // En producción enviaría a Google Analytics, Mixpanel, etc.
};

export { analyticsHandler };
```

```javascript
// src/observer/notification-handler.js
// Observer: Notificaciones automáticas

const notificationHandler = async ({ studentId, task, grade }) => {
  const message = grade >= 70
    ? `✅ ¡Aprobaste la tarea "${task.title}" con ${grade}/100! Sigue así.`
    : `⚠️ Tu tarea "${task.title}" obtuvo ${grade}/100. Revisa la retroalimentación.`;
  
  console.log(`📩 [Notificaciones] Para estudiante ${studentId}: ${message}`);
};

export { notificationHandler };
```

```javascript
// src/observer/task-service.js
// El servicio que emite eventos — no sabe nada de logros, analytics ni notificaciones
import { EventBus } from './event-bus.js';

class TaskService {
  #eventBus;
  #tasks = new Map();

  constructor() {
    this.#eventBus = EventBus.getInstance();
  }

  createTask(task) {
    const fullTask = { ...task, createdAt: new Date(), status: 'pending' };
    this.#tasks.set(task.id, fullTask);
    return fullTask;
  }

  async completeTask(taskId, studentId, grade) {
    const task = this.#tasks.get(taskId);
    if (!task) throw new Error(`Tarea ${taskId} no encontrada`);

    task.status = 'completed';
    const completedAt = new Date();
    task.completedAt = completedAt;
    task.grade = grade;

    // Solo emite el evento — los observers hacen el resto
    await this.#eventBus.emit('task.completed', {
      studentId,
      task,
      grade,
      completedAt,
    });

    return task;
  }
}

export { TaskService };
```

```javascript
// src/observer/demo.js
import { EventBus } from './event-bus.js';
import { TaskService } from './task-service.js';
import { achievementHandler } from './achievement-handler.js';
import { analyticsHandler } from './analytics-handler.js';
import { notificationHandler } from './notification-handler.js';

// Configurar el EventBus — registrar observers
const bus = EventBus.getInstance();
bus.on('task.completed', achievementHandler);
bus.on('task.completed', analyticsHandler);
bus.on('task.completed', notificationHandler);

// Instructor panel observer (inline — el más simple)
const instructorUnsubscribe = bus.on('task.completed', ({ studentId, task, grade }) => {
  console.log(`👩‍🏫 [Instructor] Progreso actualizado: ${studentId} completó "${task.title}" (${grade}/100)`);
});

// Simular flujo completo
const taskService = new TaskService();

const task = taskService.createTask({
  id: 'task_w05',
  title: 'Implementar Patrones de Diseño',
  weekNumber: 5,
});

console.log('=== Estudiante completa la tarea ===\n');
await taskService.completeTask('task_w05', 'est_001', 95);

console.log('\n=== Desuscribir al instructor y completar otra tarea ===');
instructorUnsubscribe(); // El instructor ya no recibe notificaciones
```

---

## 🏋️ Ejercicio 2 — Strategy: Motor de Validación de Entregas (20 min)

### El Escenario

EduFlow necesita validar las entregas de los estudiantes. Las reglas varían según el tipo de tarea: código fuente, documentos PDF, presentaciones. Cada tipo tiene criterios distintos.

```javascript
// src/strategy/submission-validator.js

// Contrato base
class SubmissionValidator {
  /**
   * @param {Object} submission - La entrega del estudiante
   * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
   */
  validate(submission) {
    throw new Error('validate() debe ser implementado');
  }
}

// Estrategia: Validar entrega de código
class CodeSubmissionValidator extends SubmissionValidator {
  validate({ files, repositoryUrl, readme }) {
    const errors = [];
    const warnings = [];

    if (!repositoryUrl) {
      errors.push('Falta la URL del repositorio GitHub');
    } else if (!repositoryUrl.includes('github.com')) {
      errors.push('La URL debe ser un repositorio válido de GitHub');
    }

    if (!readme) {
      errors.push('Falta el archivo README.md');
    }

    if (!files || files.length === 0) {
      errors.push('No se encontraron archivos de código');
    } else {
      const hasPackageJson = files.some(f => f.name === 'package.json');
      if (!hasPackageJson) warnings.push('Se recomienda incluir package.json');

      const jsFiles = files.filter(f => f.name.endsWith('.js'));
      if (jsFiles.length === 0) {
        errors.push('No se encontraron archivos JavaScript');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      type: 'code',
    };
  }
}

// Estrategia: Validar documento PDF
class DocumentSubmissionValidator extends SubmissionValidator {
  #maxSizeMB;

  constructor(maxSizeMB = 10) {
    super();
    this.#maxSizeMB = maxSizeMB;
  }

  validate({ file, pageCount }) {
    const errors = [];
    const warnings = [];

    if (!file) {
      errors.push('No se adjuntó ningún archivo');
    } else {
      if (!file.name.endsWith('.pdf')) {
        errors.push('El archivo debe estar en formato PDF');
      }
      const fileSizeMB = file.sizeBytes / (1024 * 1024);
      if (fileSizeMB > this.#maxSizeMB) {
        errors.push(`El archivo excede el límite de ${this.#maxSizeMB} MB`);
      }
    }

    if (pageCount && pageCount < 3) {
      warnings.push('El documento tiene menos de 3 páginas. Considera ampliarlo.');
    }
    if (pageCount && pageCount > 30) {
      warnings.push('El documento es muy extenso. Considera una versión ejecutiva.');
    }

    return { valid: errors.length === 0, errors, warnings, type: 'document' };
  }
}

// Estrategia: Validar video
class VideoSubmissionValidator extends SubmissionValidator {
  validate({ videoUrl, durationMinutes }) {
    const errors = [];
    const warnings = [];

    if (!videoUrl) {
      errors.push('Falta el enlace al video');
    } else {
      const validPlatforms = ['youtube.com', 'youtu.be', 'vimeo.com', 'loom.com'];
      const isValidPlatform = validPlatforms.some(p => videoUrl.includes(p));
      if (!isValidPlatform) {
        errors.push('El video debe estar en YouTube, Vimeo o Loom');
      }
    }

    if (durationMinutes) {
      if (durationMinutes < 3) errors.push('El video debe tener al menos 3 minutos');
      if (durationMinutes > 20) warnings.push('El video supera los 20 minutos recomendados');
    }

    return { valid: errors.length === 0, errors, warnings, type: 'video' };
  }
}

// El Contexto — usa la estrategia que le corresponda
class SubmissionChecker {
  #validator;

  constructor(validator) {
    this.#validator = validator;
  }

  setValidator(validator) {
    this.#validator = validator;
  }

  check(submission) {
    const result = this.#validator.validate(submission);
    
    if (!result.valid) {
      console.log(`❌ Entrega inválida (${result.type}):`);
      result.errors.forEach(e => console.log(`   • ${e}`));
    } else {
      console.log(`✅ Entrega válida (${result.type})`);
    }

    if (result.warnings.length > 0) {
      console.log('⚠️  Advertencias:');
      result.warnings.forEach(w => console.log(`   • ${w}`));
    }

    return result;
  }
}

export {
  SubmissionChecker,
  CodeSubmissionValidator,
  DocumentSubmissionValidator,
  VideoSubmissionValidator,
};
```

```javascript
// src/strategy/demo.js
import {
  SubmissionChecker,
  CodeSubmissionValidator,
  DocumentSubmissionValidator,
  VideoSubmissionValidator,
} from './submission-validator.js';

const checker = new SubmissionChecker(new CodeSubmissionValidator());

console.log('=== Semana 05 — Entrega de Código ===');
checker.check({
  repositoryUrl: 'https://github.com/estudiante/shopflow-patterns',
  readme: true,
  files: [
    { name: 'package.json' },
    { name: 'src/index.js' },
    { name: 'src/patterns/observer.js' },
  ],
});

console.log('\n=== Semana 03 — Entrega de Documento ===');
checker.setStrategy(new DocumentSubmissionValidator(5));
checker.check({
  file: { name: 'informe-arquitectura.pdf', sizeBytes: 2 * 1024 * 1024 },
  pageCount: 8,
});

console.log('\n=== Video de Presentación ===');
checker.setStrategy(new VideoSubmissionValidator());
checker.check({
  videoUrl: 'https://www.youtube.com/watch?v=abc123',
  durationMinutes: 12,
});
```

---

## 🤔 Reflexión Final: Observer vs Strategy

| Característica | Observer | Strategy |
|---------------|----------|----------|
| **¿Qué varía?** | Los receptores de un evento | El algoritmo ejecutado |
| **¿Cuántos "respondedores"?** | Muchos (n suscriptores) | Uno (la estrategia activa) |
| **¿El emisor conoce los receptores?** | No | No (solo la interfaz) |
| **¿Se puede cambiar en runtime?** | Suscribir/desuscribir | Cambiar estrategia activa |
| **Ejemplo real** | Node.js EventEmitter | Passport.js strategies |

---

## 🏆 Desafío Combinado

Agrega un observer al `EventBus` que use la estrategia correcta según el tipo de tarea:

```javascript
// Cuando se emite 'task.submitted', el handler debe:
// 1. Identificar el tipo de tarea (code, document, video)
// 2. Seleccionar la Strategy correspondiente
// 3. Validar la entrega
// 4. Si es inválida, emitir 'task.submission.rejected'
// 5. Si es válida, emitir 'task.submission.accepted'
```

Esta combinación Observer + Strategy es la base de muchos motores de reglas de negocio en producción.

---

_Bootcamp de Arquitectura de Software · SENA · bc-channel-epti_
