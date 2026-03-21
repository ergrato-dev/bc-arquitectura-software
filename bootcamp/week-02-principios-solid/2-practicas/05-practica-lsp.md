# 💪 Práctica 05: Aplicando Liskov Substitution Principle (LSP)

## 🎯 Objetivo

Aprender a diseñar jerarquías de herencia donde los subtipos puedan sustituir a sus tipos base sin romper el comportamiento esperado del programa.

---

## 📋 Caso de Estudio: Sistema de Formas Geométricas

Estás desarrollando una librería de geometría. La herencia incorrecta puede violar LSP y causar comportamientos inesperados.

---

## ❌ Código con Violación de LSP

```javascript
/**
 * ❌ VIOLACIÓN CLÁSICA DE LSP
 * Cuadrado hereda de Rectángulo (problema matemático famoso)
 */

class Rectangle {
  #width;
  #height;

  constructor(width, height) {
    this.#width = width;
    this.#height = height;
  }

  setWidth(width) {
    this.#width = width;
  }

  setHeight(height) {
    this.#height = height;
  }

  getArea() {
    return this.#width * this.#height;
  }
}

// ⚠️ Cuadrado viola LSP
class Square extends Rectangle {
  setWidth(width) {
    super.setWidth(width);
    super.setHeight(width); // ❌ Cambia también la altura
  }

  setHeight(height) {
    super.setWidth(height); // ❌ Cambia también el ancho
    super.setHeight(height);
  }
}

// Cliente que espera comportamiento de Rectángulo
function resizeRectangle(rectangle) {
  rectangle.setWidth(5);
  rectangle.setHeight(4);

  const expectedArea = 5 * 4; // 20
  const actualArea = rectangle.getArea();

  console.log(`Área esperada: ${expectedArea}`);
  console.log(`Área real: ${actualArea}`);
  console.log(`¿Correcto? ${expectedArea === actualArea}`);
}

// Test con Rectángulo: ✅ Funciona
const rect = new Rectangle(2, 3);
resizeRectangle(rect); // Área = 20 ✅

// Test con Cuadrado: ❌ FALLA (viola LSP)
const square = new Square(2, 2);
resizeRectangle(square); // Área = 16 ❌ (esperaba 20)

// ⚠️ El cuadrado NO puede sustituir al rectángulo sin romper el programa
```

---

## ✅ Solución 1: Eliminar la Herencia Problemática

```javascript
/**
 * ✅ SOLUCIÓN 1: Composición sobre Herencia
 * Cuadrado y Rectángulo son independientes
 */

class Rectangle {
  #width;
  #height;

  constructor(width, height) {
    this.#width = width;
    this.#height = height;
  }

  setWidth(width) {
    this.#width = width;
  }

  setHeight(height) {
    this.#height = height;
  }

  getArea() {
    return this.#width * this.#height;
  }

  getPerimeter() {
    return 2 * (this.#width + this.#height);
  }
}

class Square {
  #side;

  constructor(side) {
    this.#side = side;
  }

  setSide(side) {
    this.#side = side;
  }

  getArea() {
    return this.#side * this.#side;
  }

  getPerimeter() {
    return 4 * this.#side;
  }
}

// ✅ Ahora cada clase es independiente
const rect = new Rectangle(5, 4);
console.log('Rectángulo:', rect.getArea()); // 20

const square = new Square(4);
console.log('Cuadrado:', square.getArea()); // 16
```

---

## ✅ Solución 2: Abstracción Común

```javascript
/**
 * ✅ SOLUCIÓN 2: Usar abstracción base común
 */

// Abstracción base
class Shape {
  getArea() {
    throw new Error('Implementar getArea()');
  }

  getPerimeter() {
    throw new Error('Implementar getPerimeter()');
  }
}

// Rectángulo inmutable (cumple LSP)
class ImmutableRectangle extends Shape {
  #width;
  #height;

  constructor(width, height) {
    super();
    this.#width = width;
    this.#height = height;
  }

  getArea() {
    return this.#width * this.#height;
  }

  getPerimeter() {
    return 2 * (this.#width + this.#height);
  }

  // ✅ Retorna nuevo objeto en lugar de mutar
  resize(width, height) {
    return new ImmutableRectangle(width, height);
  }
}

// Cuadrado inmutable (cumple LSP)
class ImmutableSquare extends Shape {
  #side;

  constructor(side) {
    super();
    this.#side = side;
  }

  getArea() {
    return this.#side * this.#side;
  }

  getPerimeter() {
    return 4 * this.#side;
  }

  resize(side) {
    return new ImmutableSquare(side);
  }
}

// ✅ Cliente trabaja con Shape
function printShapeInfo(shape) {
  console.log(`Área: ${shape.getArea()}`);
  console.log(`Perímetro: ${shape.getPerimeter()}`);
}

const rect = new ImmutableRectangle(5, 4);
const square = new ImmutableSquare(4);

printShapeInfo(rect); // ✅ Funciona
printShapeInfo(square); // ✅ Funciona
```

---

## 🧪 Ejemplo 2: Aves que Vuelan

```javascript
// ❌ VIOLACIÓN: No todas las aves vuelan
class Bird {
  fly() {
    console.log('🦅 Volando...');
  }
}

class Penguin extends Bird {
  fly() {
    throw new Error('¡Los pingüinos no vuelan!'); // ❌ Viola LSP
  }
}

// ✅ SOLUCIÓN: Segregar capacidades
class Bird {
  eat() {
    console.log('🍽️ Comiendo...');
  }
}

class FlyingBird extends Bird {
  fly() {
    console.log('🦅 Volando...');
  }
}

class Sparrow extends FlyingBird {
  // ✅ Hereda fly() correctamente
}

class Penguin extends Bird {
  swim() {
    console.log('🐧 Nadando...');
  }
}

// Cliente
function makeBirdFly(bird) {
  if (bird instanceof FlyingBird) {
    bird.fly();
  } else {
    console.log('Esta ave no vuela');
  }
}
```

---

## 🎯 Reglas para Cumplir LSP

### ✅ Hacer:

1. **Precondiciones**: No pueden ser más fuertes en subtipos
2. **Postcondiciones**: No pueden ser más débiles en subtipos
3. **Invariantes**: Deben mantenerse en subtipos
4. **Tipos de retorno**: Deben ser compatibles
5. **Excepciones**: No lanzar excepciones nuevas inesperadas

### ❌ Evitar:

1. Subtipos que lanzan excepciones no previstas
2. Subtipos que requieren más parámetros
3. Subtipos con comportamiento diferente al esperado
4. Sobrescribir métodos con implementación vacía

---

## 🏆 Conclusión

**LSP = Los subtipos deben comportarse como sus tipos base**

- Si el cliente espera un `Rectángulo`, debe funcionar igual con cualquier subtipo
- Si necesitas cambiar el comportamiento esperado, no uses herencia
- Preferir composición sobre herencia cuando hay dudas

**Pregunta clave**: ¿Puedo reemplazar el tipo base por el subtipo sin sorpresas? Si no → Viola LSP

---

**Bootcamp de Arquitectura de Software - Semana 02**
_SENA - Tecnología en Análisis y Desarrollo de Software_
