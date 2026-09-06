# Crecimiento y reducción en flexbox

`flex` es una abreviatura que configura tres propiedades de un **elemento flex**: `flex-grow`, `flex-shrink` y `flex-basis`, en ese orden. Una [propiedad abreviada](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties) escribe varios valores relacionados a la vez; cambiarla puede restablecer valores que no mencionaste explícitamente.

```css
.item { flex: 1 1 auto; }
/* crecimiento, reducción, tamaño base */
```

Mira el [diagrama del original](https://cdn.statically.io/gh/TheOdinProject/curriculum/0cc6b26bb0c4b94524369d327c97a8fb11e83b6b/foundations/html_css/flexbox/imgs/10.png). `flex: 1` se interpreta en navegadores como crecimiento 1, reducción 1 y base 0%; conceptualmente empieza con base cero en los ejemplos de filas con tamaño definido. No es idéntico a cambiar sólo `flex-grow`.

## Reparte espacio disponible

`flex-grow` es un factor que reparte espacio sobrante. Tres elementos con base cero y factor 1 pueden quedar iguales; si uno tiene factor 2 recibe dos partes del espacio y los otros una cada uno. No significa que cualquier elemento con factor 2 mida siempre exactamente el doble: contenido mínimo, base y bordes también influyen.

Prueba el [ejemplo de crecimiento](https://codepen.io/TheOdinProjectExamples/pen/YzQqvgK). Cambia un factor y observa qué parte se reparte. Si no hay espacio libre, aumentar grow no crea espacio nuevo.

## Cuando falta espacio

`flex-shrink` interviene cuando la suma de tamaños no cabe. Su valor inicial es 1. El reparto de reducción considera tanto el factor como el tamaño base; elementos con igual base se reducen por igual si sus factores también son iguales. `flex-shrink: 0` evita esa reducción y puede provocar desbordamiento si el contenedor es pequeño.

En el [ejemplo de reducción](https://codepen.io/TheOdinProjectExamples/pen/JjJXZVz), las cajas parten de 250px y la segunda no se encoge. Reduce el ancho del resultado y observa por qué declarar `width` no garantiza que un elemento flex conserve exactamente ese ancho.

## Tamaño base

`flex-basis` establece el punto de partida antes de repartir espacio. Su valor inicial es `auto`, que puede tomar el tamaño principal declarado —ancho en fila, alto en columna— y, si no existe, el contenido. Con base cero se ignora ese ancho como punto de partida para repartir espacio, aunque siguen existiendo restricciones de tamaño mínimo.

`flex: auto` equivale a `1 1 auto`: crece y se reduce partiendo del tamaño automático. No es el valor inicial de flex. `flex: 1` parte de cero en los ejemplos habituales; `flex-grow: 1` conserva el resto de valores. Esta diferencia explica muchos resultados inesperados al cambiar sólo una línea.

## Actividad

1. Lee [valores comunes de flex en W3C](https://www.w3.org/TR/css-flexbox-1/#flex-common).
2. Lee la [referencia de flex en MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex), especialmente la diferencia entre omitir valores y usar valores iniciales.
3. En tres cajas prueba `flex: 1`, `flex: auto` y `flex-shrink: 0`. Usa texto de distinta longitud y registra qué cambia al estrechar el contenedor.

## Comprobación

- ¿Qué tres valores configura `flex: 1 1 auto`?
- ¿A qué equivale `flex: auto`?
- ¿Por qué `width: 250px` no siempre termina en 250px?
- ¿Qué diferencia hay entre modificar grow y usar la abreviatura completa?

## Distingue factor y tamaño final

Un factor de crecimiento no es un porcentaje del ancho total. Describe cómo repartir el espacio libre después de considerar bases y restricciones. Si dos elementos parten de tamaños diferentes y ambos crecen con factor uno, pueden recibir cantidades iguales de espacio adicional y seguir terminando con tamaños diferentes. El caso de bases cero iguales hace más fácil observar proporciones, pero no representa todas las configuraciones.

La reducción tampoco significa restar siempre la misma cantidad absoluta a cada elemento. Un elemento con base mayor puede perder más espacio porque su factor se pondera por esa base. Si impides que uno se reduzca, los demás tendrán que absorber más reducción o el contenedor desbordará. No interpretes ese desbordamiento como un fallo del navegador: puede ser la consecuencia de restricciones incompatibles.

Antes de cambiar width para corregir un tamaño flex, inspecciona basis, grow, shrink y el tamaño mínimo del contenido. Una palabra larga que no puede partirse puede imponer un límite. Entender qué valor sirve como punto de partida evita luchar contra el algoritmo cambiando varias propiedades sin una hipótesis.

Compara todos estos valores en una ventana amplia y otra estrecha para observar tanto crecimiento como reducción del mismo conjunto de cajas.
