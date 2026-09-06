# Introducción a Grid

## De una dimensión a dos

Flexbox distribuye elementos a lo largo de un eje principal y los alinea en un eje transversal. Permite crecer, reducirse y cambiar de línea con `flex-wrap`. Si necesitas repasar, vuelve a [Flexbox](https://www.theodinproject.com/lessons/foundations-introduction-to-flexbox), sus [ejes](https://www.theodinproject.com/lessons/foundations-axes), [alineación](https://www.theodinproject.com/lessons/foundations-alignment) y [crecimiento y reducción](https://www.theodinproject.com/lessons/foundations-growing-and-shrinking).

Observa una [fila Flex](https://codepen.io/TheOdinProjectExamples/pen/XWeJbRy) y una [columna Flex](https://codepen.io/TheOdinProjectExamples/pen/MWEYwoX). En ambos casos hay un eje de distribución principal. Cuando una fila salta a otra, cada línea se distribuye de forma independiente. Por eso alinear columnas entre varias filas de tarjetas puede requerir más trabajo del esperado.

Compara el [ejercicio de tarjetas con Flexbox](https://github.com/TheOdinProject/css-exercises/tree/main/foundations/flex/07-flex-layout-2) y su [resultado](https://i.postimg.cc/vZ81HMkB/flex-exercise-desired-outcome.png) con esta [distribución bidimensional Grid](https://codepen.io/TheOdinProjectExamples/pen/KKXwpZR).

```css
.tarjetas {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
```

Grid define pistas de filas y columnas coordinadas. Si quieres tres columnas iguales repetidas en varias filas, puedes declararlas en el contenedor y colocar los hijos dentro. No necesitas calcular un ancho independiente para cada tarjeta ni agrupar cada fila manualmente.

## Una herramienta complementaria

La idea de una cuadrícula tiene antecedentes en periódicos y revistas. CSS Grid se desarrolló durante años antes de llegar ampliamente a los navegadores en 2017. Permite distribuir contenido en dos dimensiones, pero también funciona con una sola fila o columna. Una distribución inicialmente pequeña puede crecer con nuevas filas.

Grid y Flexbox comparten la idea de contenedor y elementos hijos, así como varias propiedades de alineación. Sus algoritmos no son iguales. Un artículo antiguo puede presentar `gap` como exclusivo de Grid, aunque también se usa con Flexbox. Distingue una limitación histórica de una diferencia conceptual.

Grid no reemplaza Flexbox: puedes usar una cuadrícula para las regiones de un panel y Flexbox para alinear los botones dentro de una tarjeta. Elegirás según la relación que quieras controlar, y practicarás ambas herramientas en el proyecto de panel administrativo.

## Práctica de exploración

Imagina seis tarjetas con títulos de distinta longitud. Con Flexbox puedes permitir que salten de línea y crezcan para ocupar el espacio restante. Si la última fila tiene sólo dos tarjetas, éstas pueden crecer más que las tres de la fila anterior. Ese comportamiento es útil cuando quieres distribuir libremente cada línea, pero no cuando esperas que todas las columnas formen una retícula compartida. Con Grid puedes declarar tres pistas comunes y dejar que cada tarjeta ocupe una celda; el ancho se decide por esas pistas, no por cuántos elementos quedaron en la última fila.

La diferencia tampoco significa que Grid ignore el contenido. El contenido participa en tamaños mínimos, pistas automáticas y alturas de fila. Por eso una cuadrícula no es simplemente una tabla rígida pintada detrás de las cajas. En las próximas lecciones separarás las decisiones explícitas del contenedor de las pistas que se crean automáticamente cuando llega más contenido.

Mientras comparas las demostraciones, identifica qué propiedades pertenecen al padre y cuáles a sus hijos. Si intentas modificar columnas sobre una tarjeta individual, probablemente estás actuando en el nivel equivocado. Una buena práctica es nombrar en voz alta “este contenedor distribuye estas tarjetas” antes de escribir la regla.

La lección original no añade una tarea independiente: las siguientes construyen esta base. Antes de continuar, cambia el número de tarjetas del ejemplo y observa que Grid mantiene sus columnas. Compara qué ocurre con una fila Flex que utiliza `flex-wrap`. Explica cuál se adapta mejor si necesitas columnas alineadas y cuál si sólo quieres que cada fila distribuya sus elementos libremente.

## Comprobación

- ¿Cómo permite `flex-wrap` presentar varias filas y qué no coordina entre ellas?
- ¿Qué problema de distribución motivó CSS Grid?
- ¿Qué herramienta facilita crear pistas de igual tamaño?
