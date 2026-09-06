# Constructores de objetos y prototipos

Escribir un literal para cada jugador funciona con dos personas, pero no con miles. Un constructor describe cómo crear instancias con la misma forma. La herencia por prototipos permite que esas instancias compartan comportamiento sin copiar cada método.

## Construir una instancia

```js
function Player(name, marker) {
  if (!new.target) throw new Error("Usa new para crear Player");
  this.name = name;
  this.marker = marker;
}
const player1 = new Player("Ana", "X");
const player2 = new Player("Luis", "O");
console.log(player1.name); // Ana
```

`new` crea un objeto, lo enlaza al objeto `Player.prototype`, ejecuta la función con `this` apuntando a esa nueva instancia y devuelve normalmente la instancia. Llamar `Player(...)` sin `new` es una llamada normal y no realiza ese trabajo. La comprobación `new.target` produce un error en el lugar correcto, en vez de dejar un fallo confuso para después.

Puedes asignar un método dentro del constructor, como `this.sayName = function () { return this.name; }`. Funciona, pero cada instancia recibe otra función. Si todas hacen lo mismo, conviene compartirla mediante el prototipo.

## Práctica inicial: Book

Escribe un constructor `Book(title, author, pages, read)` y un método `info()` que devuelva los datos. Debe ser posible ejecutar lo siguiente:

```js
const theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", 295, false);
console.log(theHobbit.info());
// The Hobbit por J.R.R. Tolkien, 295 páginas, pendiente de leer
```

Devuelve el texto desde `info` en vez de imprimirlo directamente. Una función que devuelve un valor puede usarse en consola, en un elemento del DOM o en una prueba. Una función que solamente imprime deja esa decisión atrapada dentro del método.

## Qué es un prototipo

Un objeto tiene un enlace interno `[[Prototype]]` a otro objeto o a `null`. Si JavaScript no encuentra una propiedad en el objeto, sigue ese enlace y busca en el prototipo. Continúa hasta encontrarla o llegar a `null`; si no existe en ningún punto, la lectura devuelve `undefined`.

```js
Player.prototype.sayHello = function () {
  return `Hola, soy ${this.name}`;
};
console.log(Object.getPrototypeOf(player1) === Player.prototype); // true
console.log(Object.getPrototypeOf(player2) === Player.prototype); // true
console.log(player1.sayHello()); // Hola, soy Ana
console.log(player1.sayHello === player2.sayHello); // true
```

`Player.prototype` es una propiedad de la función constructora que señala el objeto que compartirán sus nuevas instancias. No es la manera de consultar el prototipo de `player1`: para eso usa `Object.getPrototypeOf(player1)`. Confundir ambos conceptos es una fuente frecuente de errores.

La función compartida sigue recibiendo el `this` de la llamada concreta: compartir `sayHello` no significa compartir el nombre de los jugadores. Cada instancia conserva sus propios datos.

```js
console.log(Object.getPrototypeOf(Player.prototype) === Object.prototype);
console.log(Object.hasOwn(player1, "name")); // true
console.log(Object.hasOwn(player1, "valueOf")); // false
console.log(Object.hasOwn(Object.prototype, "valueOf")); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null
```

`valueOf()` está disponible aunque no lo hayamos declarado: se encuentra más arriba. La cadena es `player1 → Player.prototype → Object.prototype → null`. No todos los objetos tienen necesariamente `Object.prototype` en su cadena: `Object.create(null)` es una excepción útil. Un objeto solo tiene un prototipo directo, aunque pueda heredar a través de varios niveles.

En material antiguo encontrarás `__proto__`. Evita usar ese acceso histórico y utiliza las operaciones explícitas `Object.getPrototypeOf` y, cuando corresponda, `Object.setPrototypeOf`.

## Compartir comportamiento entre tipos

Supón que todas las personas pueden decir su nombre y que los jugadores además tienen una marca:

```js
function Person(name) { this.name = name; }
Person.prototype.sayName = function () { return `Soy ${this.name}`; };

function Player(name, marker) {
  if (!new.target) throw new Error("Usa new");
  this.name = name;
  this.marker = marker;
}
Player.prototype.getMarker = function () { return this.marker; };
Object.setPrototypeOf(Player.prototype, Person.prototype);

const ana = new Player("Ana", "X");
console.log(ana.sayName()); // Soy Ana
console.log(ana.getMarker()); // X
```

Establece esa relación antes de crear instancias. Cambiar cadenas de prototipos durante la ejecución puede perjudicar optimizaciones del motor y vuelve más difícil razonar sobre los objetos existentes.

No escribas `Player.prototype = Person.prototype`. Esa asignación hace que ambos nombres apunten al mismo objeto: agregar un método a jugadores también lo agregaría a personas. Si un tipo `Enemy` comparte ese mismo objeto y reemplaza `sayName`, también cambiaría el saludo de los jugadores. Enlazar dos objetos es distinto de hacer que ambos nombres sean el mismo objeto.

## El contexto de this

En `ana.sayName()`, el receptor es `ana`. En `new Player(...)`, `this` es la instancia que se está creando. Una llamada independiente no conserva automáticamente el receptor original:

```js
const saludar = ana.sayName.bind(ana);
console.log(saludar()); // Soy Ana
```

`bind` produce una función con el contexto fijado. Una función flecha usa el `this` del entorno donde se creó; no adquiere uno nuevo por aparecer como propiedad. Examina estas diferencias especialmente al pasar métodos como callbacks.

## Una lectura detallada de la creación

Piensa en una instancia como un objeto específico, no como la función que describe cómo construirlo. Player es la receta ejecutable; player1 y player2 son resultados diferentes. Al asignar this.name durante una construcción, la propiedad se crea en ese resultado concreto. Si cambias el nombre de player1, no cambias automáticamente player2, aunque ambos hayan sido construidos con Player.

Un constructor sigue siendo una función de JavaScript. Su nombre con mayúscula comunica una convención a quien programa, pero no convierte cada llamada en construcción. Esa es la razón de new: expresa qué mecanismo se utilizará. La protección new.target evita que un descuido continúe como una llamada ordinaria con un this inesperado. Puedes comprobar el error deliberadamente en el laboratorio y después utilizar la forma correcta.

Hay un detalle que conviene conocer sin intentar aprovecharlo todavía: un constructor puede devolver explícitamente otro objeto. En ese caso la operación new puede producir ese otro resultado en lugar de la instancia preparada. Nuestros constructores no necesitan hacerlo. Mantener una inicialización directa, sin retornos extraños, hace su contrato más fácil de entender.

## Dónde se encuentra realmente un método

Cuando escribes player1.sayHello(), parece que sayHello vive dentro de player1. Sin embargo, acceder no equivale a poseer. El método puede estar en un objeto compartido más arriba. Esa diferencia explica tanto el ahorro de memoria como algunos comportamientos sorprendentes al editar prototipos.

Consulta primero las propiedades propias de player1 y después las de Player.prototype. Encontrarás los datos en la primera colección y el método compartido en la segunda. Object.hasOwn permite formular esa pregunta sin depender de que el objeto tenga un método hasOwnProperty intacto. En muchos objetos también verás hasOwnProperty como método heredado de Object.prototype; la existencia de ese mismo método es otro ejemplo de la cadena en acción.

Si agregas una propiedad sayHello directamente a player1, la búsqueda la encuentra antes que al método del prototipo. Esto se llama ocultamiento o shadowing: player2 sigue usando el método compartido, mientras player1 encuentra el suyo. Borrar la propiedad propia hace visible otra vez la heredada; no has eliminado el método del prototipo. Comprueba esta secuencia para distinguir modificar una instancia de modificar comportamiento compartido.

## Cadena de búsqueda y terminación

Para una propiedad ausente, el motor no adivina entre todas las funciones del programa. Inspecciona el objeto receptor, después su prototipo directo, después el prototipo de ese prototipo. Una cadena solo puede seguir un enlace directo a la vez. Cuando alcanza null, no existe otro lugar donde buscar.

Así, valueOf se encuentra en Object.prototype aunque no lo hayas escrito. sayHello se encuentra antes, en Player.prototype. name se encuentra inmediatamente en player1. Diferentes propiedades de una misma expresión pueden resolverse en niveles distintos. Dibujar esos niveles y señalar dónde termina cada búsqueda suele aclarar más que memorizar definiciones aisladas.

## Heredar sin compartir identidad

En el ejemplo Person y Player, quieres que el prototipo del jugador tenga acceso al saludo de Person, pero conserve su propia identidad para métodos específicos como getMarker. Si haces que ambas propiedades prototype apunten al mismo objeto, desaparece esa separación. Un cambio destinado solamente a jugadores modifica también a personas y enemigos que comparten esa referencia.

Enlazar prototipos conserva los objetos distintos. Una especialización puede definir su propia versión de sayName, ocultando la versión heredada solo en su rama. Otras ramas siguen encontrando el saludo original. Esa es la diferencia que debes demostrar con un Player y un Enemy: editar el saludo del enemigo no debe cambiar el del jugador.

Antes de introducir una jerarquía, verifica que de verdad necesites esa relación. La herencia es una herramienta de reutilización, no un requisito para cada constructor. Muchas aplicaciones pequeñas funcionan mejor con objetos independientes y funciones que reciben datos. Las fábricas y la composición de la siguiente lección ofrecen otras maneras de compartir capacidades.

## Tareas

1. Completa `Book` y crea dos libros. Mueve `info()` al prototipo y verifica que ambos comparten el método, pero no el estado `read`.
2. Lee [prototipos e herencia](https://www.digitalocean.com/community/tutorials/understanding-prototypes-and-inheritance-in-javascript) y [herencia de prototipos](https://javascript.info/prototype-inheritance); realiza los ejercicios de esta última lectura. Sus ejemplos con `__proto__` ilustran la idea, no la API recomendada para tu proyecto.
3. Lee [el contexto de this](https://www.javascripttutorial.net/javascript-this/) y prueba una llamada como método, una llamada independiente y una llamada con `bind`.
4. Dibuja la cadena de `ana` y consulta cada enlace con `Object.getPrototypeOf`.

## Comprobación

- ¿Qué operaciones realiza `new` y qué problema detecta `new.target`?
- ¿Qué diferencia hay entre una propiedad propia y una heredada?
- ¿Por qué compartir un método en el prototipo ahorra funciones por instancia?
- ¿Por qué asignar un prototipo al otro altera tipos que debían ser independientes?
- ¿Qué resultado obtienes al buscar una propiedad que no existe en toda la cadena?
