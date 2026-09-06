# Colocar elementos en Grid

## Pistas, líneas, celdas y áreas

Una cuadrícula de tres columnas y tres filas tiene tres pistas en cada dirección, cuatro líneas por dirección y nueve celdas. Una pista es una fila o columna; una celda es la intersección de una fila con una columna. Un área agrupa una o más celdas en un rectángulo.

```css
.tablero {
  display: grid;
  grid-template: repeat(3, 100px) / repeat(3, 100px);
}
```

En escritura horizontal de izquierda a derecha, las líneas de columna se numeran desde la izquierda y las de fila desde arriba, empezando en uno. La dirección de escritura influye en esa referencia. DevTools también muestra números negativos, contados desde el final de la cuadrícula explícita; `-1` identifica su última línea. Activa los números en la superposición Grid y observa el [ejemplo de tres por tres](https://codepen.io/TheOdinProjectExamples/pen/poWvJXQ).

## Inicio y final

Las propiedades `grid-column-start`, `grid-column-end`, `grid-row-start` y `grid-row-end` indican líneas, no números de celdas. Un elemento que empieza en la línea uno y termina en la tres ocupa dos pistas.

```css
.sala {
  grid-column-start: 1;
  grid-column-end: 6;
  grid-row-start: 1;
  grid-row-end: 3;
}
```

En una cuadrícula de cinco columnas, esa sala ocupa todo el ancho y dos filas. Para practicar, crea un plano de departamento con cinco pistas por dirección. El [primer plano vacío](https://codepen.io/TheOdinProjectExamples/pen/rNGaOxB) usa `inline-grid` para que el contenedor no se comporte como una caja de bloque que ocupa todo el ancho. El [segundo ejemplo](https://codepen.io/TheOdinProjectExamples/pen/poWvjgY) añade habitaciones y amplía la sala. Activa las reglas de filas comentadas y compara el área antes y después.

## Atajos

`grid-column` agrupa inicio y final de columna, separados por `/`; `grid-row` hace lo mismo con filas. `span` expresa cuántas pistas ocupar a partir de una posición.

```css
.cocina { grid-column: 1 / 3; grid-row: 3 / 5; }
.recamara { grid-column: 3 / span 3; grid-row: 3 / 5; }
```

`grid-area` también puede agrupar las cuatro líneas, en este orden: inicio de fila, inicio de columna, final de fila, final de columna. No sigue el orden de margen o relleno.

```css
.sala { grid-area: 1 / 1 / 3 / 6; }
```

Explora el [plano completo](https://codepen.io/TheOdinProjectExamples/pen/jOGEbrX). Cambia el baño, la recámara y el clóset para colocar el baño junto a la cocina sin solapamientos. Usa la superposición de líneas si pierdes la referencia. `auto` permite dejar parte de la colocación al algoritmo.

## Áreas con nombre

La misma propiedad `grid-area` puede asignar un nombre. Después `grid-template-areas`, en el contenedor, dibuja una distribución con palabras:

```css
.pagina {
  display: grid;
  grid-template-columns: 12rem 1fr;
  grid-template-areas:
    "cabecera cabecera"
    "menu contenido"
    ". pie";
}
.cabecera { grid-area: cabecera; }
.menu { grid-area: menu; }
.contenido { grid-area: contenido; }
.pie { grid-area: pie; }
```

Cada cadena representa una fila; cada palabra, una celda. Repetir un nombre crea un área rectangular. Todas las filas deben tener el mismo número de celdas, y un nombre no puede formar una L o dos regiones separadas. Un punto representa una celda vacía.

Compara el [plano con áreas](https://codepen.io/TheOdinProjectExamples/pen/dyVPYpv) y el [plano con espacios vacíos](https://codepen.io/TheOdinProjectExamples/pen/ZEXYbpg). La colocación visual no cambia el orden del documento para lectura y teclado: conserva un HTML lógico y evita que el foco salte de forma inesperada.

## Leer coordenadas en el plano

Antes de mover habitaciones, activa las líneas de la cuadrícula de tres por tres. Localiza la celda superior izquierda: queda entre las líneas uno y dos de columna y entre las líneas uno y dos de fila. Después localiza la celda central de la última fila: queda entre las líneas dos y tres de columna y entre las líneas tres y cuatro de fila. Escribe estas referencias sin mirar el CSS y luego compruébalas. Así evitas confundir “tercera fila” con “tercera línea”.

Cada pista necesita dos bordes de referencia, pero las pistas vecinas comparten una línea. Por eso tres columnas producen cuatro líneas, no seis. Si un elemento ocupa desde la primera línea hasta la cuarta, cubre tres pistas. El número final no es una celda adicional incluida: marca el límite donde termina. Esta diferencia explica muchos errores de una columna de más o de menos.

## Ampliar y reorganizar habitaciones

En el plano de cinco por cinco, coloca primero la sala a lo ancho de las cinco columnas y sólo una fila de alto. Comprueba que su final de columna es seis. Después amplíala a dos filas cambiando únicamente la línea final de fila a tres. Observa cómo los elementos no colocados explícitamente buscan espacio disponible. No necesitas moverlos con coordenadas de píxeles: siguen perteneciendo al sistema de pistas.

Añade cocina, baño, recámara y clóset. Para cada habitación escribe primero sus límites en papel o en notas. Coloca una por vez y revisa la superposición antes de seguir. Si dos regiones se dibujan encima, ambas pueden estar ocupando el mismo espacio explícito; Grid permite superposición y no interpreta automáticamente que dos “habitaciones” deberían ser exclusivas. En este ejercicio eres responsable de que no se crucen.

La tarea de acercar cocina y baño exige preservar el resto del plano. Cambia las líneas del baño y de las habitaciones que comparten el espacio, sin alterar el tamaño total de la cuadrícula. Comprueba que no quedaron celdas vacías involuntarias. Una solución distinta a la referencia puede ser válida si respeta las relaciones y puedes explicar sus coordenadas.

## Cambiar la representación, no el resultado

Cuando el plano funcione con líneas, reescribe una habitación con `grid-column` y `grid-row`. No cambies sus números. Verifica que la apariencia permanezca igual y que puedas volver a expandir el atajo a cuatro propiedades. Después utiliza `grid-area` numérico para esa misma habitación, recordando que alterna fila y columna. Si el resultado cambia al abreviar, la causa probable es un orden incorrecto, no una limitación de Grid.

Ahora asigna nombres a todas las habitaciones y dibuja la plantilla con cadenas. Lee cada cadena como una fila del plano. Repite el nombre de la sala en todas las celdas que ocupa. Si necesitas una zona libre para un aparato, utiliza puntos. No inventes un nombre de habitación sólo para representar vacío: el punto comunica explícitamente que no hay un área asignada allí.

Las áreas con nombre facilitan ver el plano en el CSS, pero tienen restricciones. Un mismo nombre debe formar un rectángulo continuo. Si intentas dibujar una L, la declaración de plantilla puede resultar inválida. Comprueba en DevTools si la regla se aplicó antes de intentar arreglar la apariencia con márgenes. Para una forma visual irregular puedes combinar elementos o decoración, pero la colocación de cada área Grid sigue siendo rectangular.

Finalmente, compara la lectura del documento antes y después de reorganizar. Un plano decorativo de habitaciones no tiene las mismas necesidades que una lista de acciones de una aplicación. En la interfaz real, no uses la libertad visual de Grid para cambiar una secuencia que el teclado y el lector de pantalla todavía recorren en otro orden. Colocación visual y estructura semántica deben respaldar la misma tarea.

## Actividad

1. Lee [colocación basada en líneas de MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Line-based_Placement_with_CSS_Grid).
2. Completa los niveles 1–17 de [Grid Garden](https://cssgridgarden.com/).
3. Resuelve `01-basic-holy-grail` en [positioning-grid](https://github.com/TheOdinProject/css-exercises/tree/main/intermediate-html-css/positioning-grid). Lee su README y usa la documentación necesaria, sin mirar la solución antes de intentarlo.
4. Explica una de tus colocaciones en términos de líneas y otra en términos de áreas. Revisa el orden al quitar CSS.

## Comprobación

- ¿Qué diferencia una pista de una línea? ¿Cuál es la unidad mínima de una cuadrícula?
- ¿Qué valores reciben `grid-column-start` y `grid-column-end`?
- ¿Qué atajo reúne las cuatro líneas y en qué orden?
- ¿Qué propiedad del contenedor describe visualmente áreas con nombres?
