# Organizar código con objetos

Un objeto reúne propiedades relacionadas bajo un nombre. En Fundamentos lo utilizaste para guardar datos; ahora lo usarás también para agrupar comportamiento. Esta combinación es una base de la programación orientada a objetos: distintos objetos colaboran mediante operaciones con nombres claros.

## Repaso de propiedades

La sintaxis literal permite declarar un objeto directamente. La notación de punto es cómoda cuando conoces una clave válida como identificador; los corchetes permiten claves con espacios o calculadas a partir de una variable.

```js
const ficha = {
  titulo: "Aprender JavaScript",
  paginas: 77,
  "nota personal": "Repasar objetos",
};
console.log(ficha.titulo);
console.log(ficha["nota personal"]);
const clave = "paginas";
console.log(ficha[clave]); // 77
console.log(ficha.clave); // undefined: busca literalmente "clave"
```

No puedes escribir `ficha."nota personal"`. Tampoco sustituye JavaScript automáticamente una variable dentro de la notación de punto. Elegir una notación no cambia el objeto: cambia cómo expresas la clave que quieres consultar.

## Objetos como estructuras de datos

Imagina un juego de gato. Con variables independientes tendrías `jugadorUnoNombre`, `jugadorUnoMarca`, `jugadorDosNombre` y `jugadorDosMarca`. Un objeto por jugador hace explícita la relación entre sus datos:

```js
const jugadorUno = { nombre: "Ana", marca: "X" };
const jugadorDos = { nombre: "Luis", marca: "O" };

function anunciarGanador(jugador) {
  return `${jugador.nombre} (${jugador.marca}) ganó`;
}
console.log(anunciarGanador(jugadorUno));
```

Ahora `nombre` puede reutilizarse sin colisiones porque cada objeto establece su contexto. La función recibe un jugador completo, no una colección de argumentos cuya relación debe recordar quien la llama. Si agregas un color al jugador, no necesitas agregar otro argumento para que la función pueda consultarlo.

En una tienda, la misma idea representa cada producto con nombre, precio y descripción. Cuando haya cientos de productos, podrás guardarlos en un arreglo y procesarlos con las mismas funciones en lugar de crear cientos de variables independientes.

## Objetos como unidades de comportamiento

Un método es una función almacenada como propiedad de un objeto. Puedes escribirlo con una expresión de función o con la sintaxis abreviada. En una llamada como `auto.aplicarDescuento(10)`, `this` dentro del método se refiere a `auto`.

```js
const auto = {
  marca: "Volkswagen",
  modelo: "Golf",
  color: "azul",
  precio: 40000,
  aplicarDescuento: function (porcentaje) {
    const multiplicador = 1 - porcentaje / 100;
    this.precio *= multiplicador;
  },
  resumen() {
    return `${this.marca} ${this.modelo}, ${this.color}: ${this.precio}`;
  },
};
auto.aplicarDescuento(10);
console.log(auto.precio); // 36000
console.log(auto.resumen());
```

La operación tiene un nombre y utiliza el estado del objeto sobre el que se llama. Así no repites la fórmula del descuento en cada parte de la aplicación. `this` depende de la forma de invocación: separar un método del objeto y ejecutarlo como función independiente puede perder ese contexto. Las funciones flecha no crean su propio `this`; no reemplaces estos métodos por flechas esperando el mismo resultado.

## También sirven para conceptos abstractos

Un juego no es un objeto físico, pero tiene estado y operaciones. Para piedra, papel o tijeras puedes definir puntajes, una operación para jugar, otra para consultar quién va ganando y otra para reiniciar. El método que juega una ronda debe actualizar el puntaje; el que consulta al ganador solamente debe leerlo.

```js
const juego = {
  puntosJugador: 0,
  puntosComputadora: 0,
  registrarRonda(ganador) {
    if (ganador === "jugador") this.puntosJugador += 1;
    if (ganador === "computadora") this.puntosComputadora += 1;
  },
  ganadorActual() {
    if (this.puntosJugador === this.puntosComputadora) return "empate";
    return this.puntosJugador > this.puntosComputadora
      ? "jugador" : "computadora";
  },
  reiniciar() {
    this.puntosJugador = 0;
    this.puntosComputadora = 0;
  },
};
juego.registrarRonda("jugador");
juego.registrarRonda("computadora");
juego.registrarRonda("jugador");
console.log(juego.ganadorActual()); // jugador
juego.reiniciar();
console.log(juego.ganadorActual()); // empate
```

Puedes pensar en estos objetos como pequeñas máquinas: sus propiedades describen lo que tienen o muestran y sus métodos son operaciones que puedes solicitar. Un inventario contiene productos y permite agregarlos; un controlador de pantalla conserva referencias a elementos y los actualiza; un gestor de eventos conserva funciones y las ejecuta cuando corresponde.

No todas sus propiedades deberían manipularse desde cualquier parte. Una propiedad llamada `_puntaje` expresa una convención de privacidad, pero sigue siendo pública. Más adelante aprenderás cierres y campos privados, que sí restringen el acceso. El guion bajo por sí solo no aplica ninguna protección.

## Del nombre de una variable al contexto de un objeto

Cuando una aplicación tiene pocos valores, es tentador guardar todo en variables separadas. El problema aparece cuando agregas otro jugador, otra propiedad o una operación que necesita todos sus datos. Cada función tendría que aceptar muchos argumentos y recordar que pertenecen a la misma persona. Un objeto expresa esa relación de forma que tanto JavaScript como quien lee el programa pueden utilizarla.

Por ejemplo, para felicitar al ganador necesitas nombre y marca. Si recibes dos parámetros independientes, una llamada podría combinar por error el nombre de Ana con la marca de Luis. Recibir un objeto jugador no elimina todas las posibilidades de equivocarte, pero mantiene juntos los valores que describen la misma entidad. Cuando después agregas una foto o una puntuación, puedes pasarlas como parte de ese mismo objeto.

La organización también permite pensar en colecciones. Un inventario no necesita propiedades llamadas productoUnoPrecio y productoDosPrecio: puede contener un arreglo de objetos producto, cada uno con precio. Entonces una misma operación recorre todos los productos. Todavía debes decidir nombres y estructura coherentes; usar objetos no compensa que cada producto guarde un precio en una propiedad diferente.

## Del dato a la operación

Para decidir qué métodos necesita un objeto, pregunta qué cambios son significativos para aquello que representa. Un auto puede recibir un descuento, pero “cambiar el texto azul del botón” corresponde a una interfaz, no al auto. Un juego puede registrar una ronda y calcular al ganador, mientras que pedir el clic o dibujar un aviso corresponde al controlador de pantalla.

Agrupar código no significa ocultar efectos sorprendentes. El nombre resumen sugiere una consulta, así que no debería aplicar un descuento antes de devolver el texto. El nombre reiniciar sí sugiere cambiar estado. Mantener esa diferencia ayuda a utilizar un objeto sin inspeccionar cada línea de sus métodos antes de cada llamada.

Un objeto de inventario puede tener un arreglo interno y métodos para agregar o retirar productos. Un objeto de eventos puede conservar una lista de funciones y ejecutarlas cuando alguien solicite emitir un evento. Un objeto de vista puede guardar referencias a botones y etiquetas, registrar callbacks y modificar textContent. Los tres son objetos válidos aunque no representen cosas físicas.

No necesitas encontrar la organización perfecta al primer intento. Empieza por identificar qué valores cambian juntos, quién es responsable de cambiarlos y qué información necesita el resto del programa. Los próximos proyectos darán práctica para refinar esas respuestas. Si un método empieza a requerir información de todas las partes del programa, puede ser una señal de que estás mezclando responsabilidades.

## Observar referencias

Cuando pasas un objeto a una función, se pasa el valor de su referencia. La función puede utilizar esa referencia para cambiar propiedades visibles para el llamador. Por eso pasar el jugador completo resulta cómodo, pero también exige un contrato: anunciarGanador debería leerlo, no cambiar su nombre. Prueba comparar dos literales con propiedades iguales y luego dos variables que apuntan al mismo objeto; entender esa diferencia será importante cuando modifiques tu biblioteca.

## Trabajo y comprobación

La lección original no exige un proyecto nuevo. Usa estos ejemplos para consolidar el modelo mental:

1. Agrega una descripción a ambos jugadores y úsala desde `anunciarGanador` sin cambiar su lista de parámetros.
2. Ejecuta dos descuentos consecutivos sobre `auto` y explica por qué ambos se aplican al precio actual.
3. Describe qué datos y operaciones tendría un inventario; evita agregar detalles del DOM a los objetos producto.

- ¿Cuáles son las dos formas principales en que los objetos organizan código?
- ¿Qué distingue una propiedad de datos de un método?
- ¿A qué se refiere `this` en `auto.resumen()` y por qué una flecha cambia la situación?

Puedes repasar [objetos básicos de Odin](https://www.theodinproject.com/lessons/foundations-object-basics) antes de continuar con constructores.
