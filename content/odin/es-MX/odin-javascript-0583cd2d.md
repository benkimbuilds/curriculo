# Clases

La palabra `class` ofrece otra sintaxis para crear objetos y compartir métodos. JavaScript sigue utilizando prototipos: declarar una clase no cambia su modelo de herencia por el de otro lenguaje. Sin embargo, hay diferencias reales frente a una función constructora: las clases exigen `new`, su cuerpo usa modo estricto y sus métodos del prototipo no son enumerables.

## Sintaxis y accesores

```js
class Book {
  #read;
  constructor(title, author, pages, read = false) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.#read = read;
  }
  get read() { return this.#read; }
  set read(value) {
    if (typeof value !== "boolean") throw new TypeError("Usa un booleano");
    this.#read = value;
  }
  toggleRead() { this.#read = !this.#read; }
  info() { return `${this.title}: ${this.pages} páginas`; }
  static isValidPages(value) { return Number.isInteger(value) && value > 0; }
}
const book = new Book("El principito", "Antoine de Saint-Exupéry", 96);
book.read = true;
console.log(book.read); // true
console.log(Book.isValidPages(96)); // true
```

`constructor` inicializa cada instancia. `info` y `toggleRead` se comparten mediante `Book.prototype`. El getter se utiliza como propiedad, sin paréntesis; el setter intercepta una asignación. Esto permite validar o calcular valores sin obligar a quienes llaman a usar un método distinto. Evita asignar `this.read` desde el setter `read`, porque lo llamaría recursivamente: necesitas otro campo para almacenar el dato.

El prefijo `#` declara privacidad real. Acceder directamente a `book.#read` fuera de la clase es un error de sintaxis; no es como una propiedad `_read` que solo expresa una convención. Puedes definir métodos privados con el mismo prefijo. Una subclase tampoco puede leer directamente campos privados de su clase padre.

Un método estático pertenece a la clase: llamas `Book.isValidPages`, no `book.isValidPages`. Es útil para operaciones que no requieren una instancia concreta, igual que `String.fromCharCode` pertenece a `String` mientras `texto.slice` opera sobre un texto.

## Herencia

```js
class DigitalBook extends Book {
  constructor(title, author, pages, format) {
    super(title, author, pages);
    this.format = format;
  }
  info() { return `${super.info()} (${this.format})`; }
}
```

`extends` establece la relación de prototipos. `super(...)` inicializa la parte del padre y debe ejecutarse antes de utilizar `this` en un constructor derivado. `super.info()` permite reutilizar el método del padre al especializar una operación. No agregues herencia a la biblioteca solo por poder hacerlo: una jerarquía debe expresar una relación útil.

## Tareas

1. Lee [getters y setters](https://javascript.info/property-accessors), omitiendo por ahora descriptores, y la [introducción a clases](https://javascript.info/class).
2. Consulta [clases en MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), especialmente [extends](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends), [campos privados](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields) y [static](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static).
3. En una rama nueva del proyecto Biblioteca, sustituye el constructor por una clase. Conserva todos los comportamientos y prueba agregar, borrar y alternar lectura antes y después.
4. Compara `Object.getPrototypeOf(book)` con `Book.prototype` y comprueba que dos instancias comparten `info`.

## Comprobación

- ¿Qué cambia y qué permanece igual al pasar de constructor a clase?
- ¿Cómo se invocan un getter, un setter y un método normal?
- ¿Cuándo usarías un miembro estático y quién puede acceder a un campo privado?
- ¿Por qué una clase sigue formando parte de una cadena de prototipos?
