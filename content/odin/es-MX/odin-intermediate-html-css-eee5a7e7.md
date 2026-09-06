# Combinar Flexbox y Grid

## Elegir por el problema

Flexbox y Grid son herramientas complementarias. Una pregunta útil es si quieres definir primero el comportamiento del contenido o una estructura de filas y columnas. No es una regla absoluta, sino una forma de tomar una decisión que puedas explicar.

Si partes del contenido, Flexbox permite expresar cómo crece, se reduce, se alinea o salta cada elemento. El resultado depende del espacio y de las dimensiones del contenido. Una fila de botones con etiquetas variables suele encajar en este enfoque.

Si partes de una distribución, Grid permite definir pistas y colocar las partes en ellas. Un panel con barra lateral, encabezado y una zona de proyectos tiene relaciones bidimensionales explícitas que Grid hace fáciles de leer.

```css
.panel {
  display: grid;
  grid-template-columns: 14rem minmax(0, 1fr);
  gap: 2rem;
}
.acciones {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: .75rem;
}
```

El panel define la estructura; las acciones se acomodan según cuántas haya y cuánto mida su texto. Un elemento puede ser hijo Grid en la cuadrícula exterior y contenedor Flex para sus propios hijos. No hay conflicto porque las relaciones son diferentes.

## Evitar reglas demasiado rígidas

Grid también puede resolver una sola dimensión, como muestra este [ejemplo de una fila](https://codepen.io/TheOdinProjectExamples/pen/mdByJRV). Flexbox puede presentar varias filas. La pregunta es cuál hace más clara la intención y exige menos ajustes cuando cambia el contenido.

Si las columnas de varias filas deben coincidir, Grid suele facilitarlo. Si cada fila debe repartir libremente sus elementos según sus tamaños, Flexbox suele ser más directo. Si necesitas mover visualmente elementos, comprueba que el orden del documento y del teclado sigan siendo comprensibles: ninguna herramienta justifica ocultar un orden confuso.

Observa el [ejemplo que combina ambos](https://codepen.io/TheOdinProjectExamples/pen/vYeEOxN). Identifica el contenedor que controla el conjunto y los contenedores que controlan el contenido de cada pieza. Luego añade texto a una pieza y verifica qué algoritmo responde.

## Actividad

Una forma de desarrollar criterio es construir la misma región pequeña con ambas herramientas. Elige una fila de tres controles. Con Flexbox, describe su crecimiento, reducción y salto. Con Grid, define pistas y observa qué ocurre si el tercer control tiene una etiqueta muy larga. Después elimina uno de los controles. No busques declarar un ganador universal: identifica qué versión expresa mejor las reglas que realmente necesitas conservar.

En un proyecto grande tampoco debes imponer una herramienta a cada nivel por consistencia superficial. Una cuadrícula exterior puede permanecer estable mientras sus componentes internos tienen distribuciones distintas. La consistencia útil está en nombres, espacios y comportamiento, no en que todos los contenedores tengan exactamente el mismo valor de `display`.

1. Lee por qué [Grid no reemplaza Flexbox](https://css-tricks.com/css-grid-replace-flexbox/).
2. Mira los [casos reales de Kevin Powell](https://www.youtube.com/watch?v=3elGSZSWTbM).
3. Lee [cuándo usar cada herramienta y por qué](https://webdesign.tutsplus.com/flexbox-vs-css-grid-which-should-you-use--cms-30184a).
4. Construye una tarjeta con botones usando Flexbox y una galería de tarjetas usando Grid. Añade y elimina elementos; escribe qué cambió sin tocar CSS.

## Comprobación

- ¿Cuándo elegirías Flexbox sobre Grid?
- ¿Qué relación de distribución te llevaría a elegir Grid?
- ¿Cómo puede una tarjeta pertenecer a una cuadrícula y contener una fila flexible?
