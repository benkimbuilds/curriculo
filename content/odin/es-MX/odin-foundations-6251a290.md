# Elementos y etiquetas

HTML organiza contenido mediante elementos. La mayoría contiene una etiqueta de apertura, contenido y una etiqueta de cierre. No confundas una etiqueta aislada con el elemento completo.

```html
<p>Un párrafo de ejemplo.</p>
```

`<p>` abre el elemento; `Un párrafo de ejemplo.` es el contenido; `</p>` lo cierra. La barra antes del nombre indica cierre. El navegador usa esa estructura para interpretar el contenido. No muestra las etiquetas como parte del párrafo.

HTML ofrece una [lista definida de elementos](https://developer.mozilla.org/en-US/docs/Web/HTML/Element). Elige por significado: un título necesita un encabezado y una lista necesita elementos de lista. Usar la etiqueta correcta ayuda a navegadores, buscadores y tecnologías de asistencia a interpretar la página. A esta práctica la llamamos **HTML semántico**. Elegir una etiqueta porque «se ve grande» mezcla estructura y presentación; el tamaño lo controlará CSS.

## Elementos vacíos

Algunos elementos no contienen texto ni hijos y no tienen etiqueta de cierre. Son elementos vacíos, como `img`, `br` y `meta`. Una imagen recibe su ubicación mediante un atributo, en lugar de envolver el archivo entre apertura y cierre.

```html
<img src="foto.jpg" alt="Un árbol en el patio">
<br>
```

Verás a veces `img />` o `br />` en ejemplos antiguos o en otros lenguajes. En HTML la barra no convierte al elemento en autocerrado y no se necesita. Usa la forma HTML sin cierre. Más adelante JSX tendrá reglas de sintaxis diferentes; no las traslades automáticamente a archivos `.html`.

## Actividad

1. Mira [What is HTML?, de Kevin Powell](https://www.youtube.com/watch?v=X4sClFRMJ00).
2. Escribe un párrafo propio y señala las tres partes del elemento.
3. Consulta en MDN un elemento vacío y uno con contenido. Explica por qué no debes escribir una etiqueta de cierre para el vacío.

## Comprobación

- ¿Qué es una etiqueta HTML?
- ¿Cuáles son las tres partes habituales de un elemento?
- ¿Cómo se distingue un elemento vacío?
- ¿Qué significa elegir elementos de forma semántica?
## Profundiza con el ejemplo

Al leer una línea, identifica primero dónde comienza y termina cada elemento. Un cierre escrito con otro nombre puede hacer que el navegador repare el árbol de una forma inesperada. Esa reparación puede ocultar el error visualmente, pero seguirá afectando selectores, estructura y comportamiento posterior.
