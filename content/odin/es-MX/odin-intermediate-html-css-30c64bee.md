# Gráficos SVG

## Qué aprenderás

Comprenderás qué son los gráficos vectoriales y XML, cuándo conviene usar SVG, cómo modificar sus formas y cómo incorporar un archivo en HTML.

## Vectores, píxeles y escala

SVG significa *Scalable Vector Graphics*: gráficos vectoriales escalables. Una fotografía rasterizada, como JPEG, describe una cuadrícula de píxeles. Al ampliarla, el programa tiene que inventar píxeles nuevos; el detalle original sigue limitado por la cuadrícula. Un gráfico vectorial describe formas y posiciones matemáticamente. Un círculo conserva su borde al aumentar el tamaño porque el navegador vuelve a dibujarlo, en lugar de ampliar píxeles.

Por eso SVG funciona bien para iconos, diagramas, gráficas, ilustraciones sencillas, patrones de fondo y filtros aplicados a otros elementos. Cambiar su tamaño no exige guardar otra cuadrícula más grande. Eso no significa que cualquier SVG sea pequeño: describir miles de detalles puede producir un archivo enorme. Para fotografías, texturas y otros detalles complejos suele convenir un formato rasterizado. Compara, por ejemplo, estas [texturas](https://unsplash.com/s/photos/grunge-texture).

SVG utiliza XML, un lenguaje de marcado parecido a HTML. XML también aparece en [API](https://en.wikipedia.org/wiki/API), [RSS](https://en.wikipedia.org/wiki/RSS) y [archivos de oficina](https://en.wikipedia.org/wiki/Office_Open_XML). A diferencia de un [archivo binario](https://en.wikipedia.org/wiki/Binary_file), puedes leer el SVG con un editor de texto:

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="0" y="0" width="100" height="50" fill="lightblue" />
  <circle class="punto" cx="50" cy="50" r="10" fill="navy" />
</svg>
```

## Anatomía y modificación

`xmlns` declara el espacio de nombres XML: en este caso, el lenguaje SVG. Es especialmente importante en archivos independientes. `viewBox="0 0 100 100"` define el origen y las dimensiones del sistema de coordenadas interno. No equivale al tamaño final en pantalla: define las coordenadas sobre las que se escalan las formas y la proporción de la imagen.

`rect`, `circle`, `path` y `text` son elementos gráficos. Un círculo usa `cx` y `cy` para su centro y `r` para su radio. Un rectángulo usa posición, ancho y alto. Los atributos `id` y `class` permiten seleccionar elementos, como en HTML; [`use`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use) permite reutilizar formas. Consulta la [lista de elementos SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Element) cuando necesites otra figura.

Muchas propiedades, como `fill` para el relleno y `stroke` para el contorno, pueden modificarse desde CSS. Esta [explicación de SVG y CSS](https://css-tricks.com/svg-properties-and-css/) muestra qué se puede controlar. Si el SVG forma parte del DOM, también puedes manipular sus elementos mediante la [API Element](https://developer.mozilla.org/en-US/docs/Web/API/Element).

No suele ser necesario escribir una ilustración completa a mano. Puedes exportarla de un editor vectorial o usar bibliotecas como [Material Icons](https://fonts.google.com/icons) y [Feather](https://feathericons.com/), respetando su licencia. Entender la estructura te permite ajustar color, dimensiones o una forma sin redibujar todo. Experimenta con el [ejemplo original editable](https://codepen.io/TheOdinProjectExamples/pen/NWaGdmL): modifica primero `viewBox`, luego radio y coordenadas, y explica las diferencias.

## Enlazado o integrado

Puedes enlazar un SVG como cualquier imagen:

```html
<img src="./grafica.svg" alt="Inscripciones por semana" />
```

También puedes utilizarlo en `background-image: url('./patron.svg')` cuando es decoración. El archivo se escala y puede almacenarse en caché por separado, pero su contenido interno no se convierte en elementos accesibles al CSS de la página.

La alternativa es pegar el elemento `svg` completo dentro del HTML. Así puedes cambiar sus formas con CSS o JavaScript y crear gráficos dinámicos. A cambio, aumentas el HTML, puedes dificultar su lectura y pierdes la caché independiente del archivo. Un SVG integrado muy grande también aumenta el contenido que debe descargarse antes de terminar de procesar el documento. Más adelante, herramientas de compilación y componentes ayudarán a organizarlo; por ahora, enlaza el archivo salvo que necesites controlar sus partes.

## Actividad

Antes de continuar, distingue la escala del sistema interno de la escala de presentación. Si cambias el ancho CSS del elemento de 100 a 300 píxeles, el navegador presenta el mismo dibujo a otro tamaño. Si cambias `viewBox` de `0 0 100 100` a `0 0 200 200`, ahora muestras una región interna mayor: las formas existentes ocupan una proporción menor. Si cambias sus dos primeros números, desplazas la región visible respecto de las coordenadas de las formas. Esos cambios no son equivalentes y pueden explicar por qué un icono parece tener espacio vacío aunque su caja CSS esté bien alineada.

Cuando recibas un SVG de una biblioteca, abre el archivo como texto antes de modificarlo. Localiza la raíz, su `viewBox` y las formas. Un archivo exportado puede contener grupos `g` con transformaciones y rutas `path` con listas largas de coordenadas. No necesitas descifrar cada punto para ajustar un relleno, pero evita eliminar atributos sin saber qué controlan. Conserva una copia original para comparar el resultado. Si la imagen desaparece después de una edición, revisa la sintaxis XML, cierres de etiquetas y región visible; no asumas inmediatamente que el problema es el tamaño de CSS.

1. Lee [Una introducción amigable a SVG](https://www.joshwcomeau.com/svg/friendly-introduction-to-svg/) de Josh Comeau y manipula las demostraciones de formas y escala. Detente al llegar a animaciones; se estudian después.
2. Guarda el ejemplo como archivo `.svg`, muéstralo con `img` e intégralo también directamente. Aplica `.punto { fill: tomato; }` y observa cuál de las versiones cambia.
3. Amplía ambas versiones. Después amplía una fotografía pequeña y compara los bordes. Elige un formato para un logotipo y otro para una fotografía, justificando cada decisión.

## Comprobación

- ¿Qué declara `xmlns` y qué establece `viewBox`?
- ¿Por qué una fotografía detallada no suele ser buena candidata para SVG?
- ¿Qué ganas y qué pierdes al integrar SVG directamente en HTML?
