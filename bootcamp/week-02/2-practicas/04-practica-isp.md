# 💪 Práctica 04: Aplicando Interface Segregation Principle (ISP)

## 🎯 Objetivo

Aprender a crear interfaces específicas y cohesivas en lugar de interfaces grandes y genéricas que fuercen a las clases a implementar métodos que no necesitan.

---

## 📋 Caso de Estudio: Sistema de Dispositivos IoT

Trabajas en **SmartHome**, una plataforma IoT. Diferentes dispositivos (bombillos, termostatos, cámaras) tienen capacidades distintas, pero la interfaz actual los trata igual.

---

## ❌ Código con Violación de ISP

```javascript
/**
 * ❌ VIOLACIÓN DE ISP
 * Interfaz muy amplia que no todos los dispositivos necesitan
 */

class SmartDevice {
  turnOn() {
    throw new Error('Implementar turnOn()');
  }

  turnOff() {
    throw new Error('Implementar turnOff()');
  }

  setBrightness(level) {
    throw new Error('Implementar setBrightness()');
  }

  setTemperature(degrees) {
    throw new Error('Implementar setTemperature()');
  }

  recordVideo() {
    throw new Error('Implementar recordVideo()');
  }

  capturePhoto() {
    throw new Error('Implementar capturePhoto()');
  }
}

// ⚠️ Bombillo forzado a implementar métodos que no usa
class SmartBulb extends SmartDevice {
  turnOn() {
    console.log('💡 Bombillo encendido');
  }

  turnOff() {
    console.log('💡 Bombillo apagado');
  }

  setBrightness(level) {
    console.log(`💡 Brillo al ${level}%`);
  }

  // ❌ No tiene sentido para un bombillo
  setTemperature(degrees) {
    throw new Error('Bombillo no controla temperatura');
  }

  recordVideo() {
    throw new Error('Bombillo no graba video');
  }

  capturePhoto() {
    throw new Error('Bombillo no toma fotos');
  }
}

// ⚠️ Termostato forzado a implementar métodos innecesarios
class SmartThermostat extends SmartDevice {
  turnOn() {
    console.log('🌡️ Termostato activado');
  }

  turnOff() {
    console.log('🌡️ Termostato desactivado');
  }

  setTemperature(degrees) {
    console.log(`🌡️ Temperatura: ${degrees}°C`);
  }

  // ❌ Termostato no tiene brillo
  setBrightness(level) {
    throw new Error('Termostato no tiene brillo');
  }

  recordVideo() {
    throw new Error('Termostato no graba video');
  }

  capturePhoto() {
    throw new Error('Termostato no toma fotos');
  }
}
```

---

## ✅ Solución: Aplicando ISP

### Paso 1: Segregar en Interfaces Específicas

```javascript
/**
 * ✅ Interfaces segregadas y cohesivas
 */

// Interfaz: Dispositivos que se encienden/apagan
class Switchable {
  turnOn() {
    throw new Error('Implementar turnOn()');
  }

  turnOff() {
    throw new Error('Implementar turnOff()');
  }
}

// Interfaz: Dispositivos con brillo ajustable
class Dimmable {
  setBrightness(level) {
    throw new Error('Implementar setBrightness()');
  }
}

// Interfaz: Dispositivos con control de temperatura
class TemperatureControllable {
  setTemperature(degrees) {
    throw new Error('Implementar setTemperature()');
  }

  getTemperature() {
    throw new Error('Implementar getTemperature()');
  }
}

// Interfaz: Dispositivos con cámara
class Camera {
  capturePhoto() {
    throw new Error('Implementar capturePhoto()');
  }

  recordVideo() {
    throw new Error('Implementar recordVideo()');
  }

  stopRecording() {
    throw new Error('Implementar stopRecording()');
  }
}
```

---

### Paso 2: Implementar Solo las Interfaces Necesarias

```javascript
// ✅ Bombillo: Solo Switchable y Dimmable
class SmartBulb {
  #isOn = false;
  #brightness = 100;

  // De Switchable
  turnOn() {
    this.#isOn = true;
    console.log('💡 Bombillo encendido');
  }

  turnOff() {
    this.#isOn = false;
    console.log('💡 Bombillo apagado');
  }

  // De Dimmable
  setBrightness(level) {
    this.#brightness = Math.max(0, Math.min(100, level));
    console.log(`💡 Brillo: ${this.#brightness}%`);
  }

  getStatus() {
    return {
      on: this.#isOn,
      brightness: this.#brightness,
    };
  }
}

// ✅ Termostato: Solo Switchable y TemperatureControllable
class SmartThermostat {
  #isOn = false;
  #temperature = 20;

  // De Switchable
  turnOn() {
    this.#isOn = true;
    console.log('🌡️ Termostato activado');
  }

  turnOff() {
    this.#isOn = false;
    console.log('🌡️ Termostato desactivado');
  }

  // De TemperatureControllable
  setTemperature(degrees) {
    this.#temperature = degrees;
    console.log(`🌡️ Temperatura: ${this.#temperature}°C`);
  }

  getTemperature() {
    return this.#temperature;
  }

  getStatus() {
    return {
      on: this.#isOn,
      temperature: this.#temperature,
    };
  }
}

// ✅ Cámara: Solo Switchable y Camera
class SmartCamera {
  #isOn = false;
  #isRecording = false;

  // De Switchable
  turnOn() {
    this.#isOn = true;
    console.log('📹 Cámara encendida');
  }

  turnOff() {
    this.#isOn = false;
    if (this.#isRecording) {
      this.stopRecording();
    }
    console.log('📹 Cámara apagada');
  }

  // De Camera
  capturePhoto() {
    if (!this.#isOn) {
      throw new Error('Cámara apagada');
    }
    console.log('📸 Foto capturada');
    return { type: 'photo', timestamp: new Date() };
  }

  recordVideo() {
    if (!this.#isOn) {
      throw new Error('Cámara apagada');
    }
    this.#isRecording = true;
    console.log('🎥 Grabando video...');
  }

  stopRecording() {
    this.#isRecording = false;
    console.log('⏹️ Grabación detenida');
  }

  getStatus() {
    return {
      on: this.#isOn,
      recording: this.#isRecording,
    };
  }
}

// ✅ Bombillo inteligente con color: Switchable + Dimmable + ColorControllable
class ColorSmartBulb extends SmartBulb {
  #color = '#FFFFFF';

  setColor(hexColor) {
    this.#color = hexColor;
    console.log(`🌈 Color: ${this.#color}`);
  }

  getColor() {
    return this.#color;
  }
}
```

---

### Paso 3: Controladores Específicos

```javascript
/**
 * ✅ Controladores que dependen solo de interfaces específicas
 */

class LightController {
  #devices = [];

  addDevice(device) {
    // Solo acepta Switchable y Dimmable
    if (
      typeof device.turnOn === 'function' &&
      typeof device.setBrightness === 'function'
    ) {
      this.#devices.push(device);
    } else {
      throw new Error('Dispositivo no es luz controlable');
    }
  }

  turnAllOn() {
    this.#devices.forEach((d) => d.turnOn());
  }

  setAllBrightness(level) {
    this.#devices.forEach((d) => d.setBrightness(level));
  }
}

class ClimateController {
  #devices = [];

  addDevice(device) {
    // Solo acepta TemperatureControllable
    if (typeof device.setTemperature === 'function') {
      this.#devices.push(device);
    } else {
      throw new Error('Dispositivo no controla temperatura');
    }
  }

  setAllTemperature(degrees) {
    this.#devices.forEach((d) => d.setTemperature(degrees));
  }
}

class SecurityController {
  #cameras = [];

  addCamera(camera) {
    // Solo acepta Camera
    if (typeof camera.recordVideo === 'function') {
      this.#cameras.push(camera);
    } else {
      throw new Error('No es una cámara');
    }
  }

  startAllRecording() {
    this.#cameras.forEach((c) => c.recordVideo());
  }

  stopAllRecording() {
    this.#cameras.forEach((c) => c.stopRecording());
  }
}
```

---

### Paso 4: Uso del Sistema

```javascript
// Crear dispositivos
const bulb = new SmartBulb();
const colorBulb = new ColorSmartBulb();
const thermostat = new SmartThermostat();
const camera = new SmartCamera();

// Control de luces
const lightCtrl = new LightController();
lightCtrl.addDevice(bulb);
lightCtrl.addDevice(colorBulb);
lightCtrl.turnAllOn();
lightCtrl.setAllBrightness(50);

// Control de clima
const climateCtrl = new ClimateController();
climateCtrl.addDevice(thermostat);
climateCtrl.setAllTemperature(22);

// Control de seguridad
const securityCtrl = new SecurityController();
securityCtrl.addCamera(camera);
camera.turnOn();
securityCtrl.startAllRecording();
```

---

## 🎯 Beneficios de Aplicar ISP

| Aspecto                   | Antes (Violación) | Después (ISP) |
| ------------------------- | ----------------- | ------------- |
| Métodos no usados         | Muchos            | Cero          |
| Cohesión                  | Baja              | Alta          |
| Flexibilidad              | Baja              | Alta          |
| Dependencias innecesarias | Muchas            | Ninguna       |

---

## 🏆 Conclusión

**ISP = Interfaces pequeñas y específicas**

- No fuerzar a implementar métodos innecesarios
- Clientes dependen solo de lo que usan
- Mayor flexibilidad y reutilización

---

**Bootcamp de Arquitectura de Software - Semana 02**
_SENA - Tecnología en Análisis y Desarrollo de Software_
