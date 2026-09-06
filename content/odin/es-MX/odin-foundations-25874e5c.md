# Bloques y elementos en línea

En el **flujo normal**, los elementos se distribuyen sin reglas especiales de posicionamiento. Un bloque suele empezar en una línea nueva y ocupar el ancho disponible; un elemento en línea participa dentro de una línea de texto. La propiedad `display` controla este comportamiento.

Encabezados, párrafos y `div` son bloques por defecto. Un enlace o `span` suele ser en línea: puede aparecer en medio de una frase sin romperla. Los elementos en línea no reemplazados no responden a `width` y `height` como un bloque, y sus espacios verticales pueden no separar líneas como esperas. No uses padding enorme en una palabra para intentar construir un diseño completo.

`inline-block` participa en línea, pero ofrece una caja a la que puedes dar dimensiones y espacio de forma similar a un bloque. Es útil, aunque para alinear conjuntos de componentes normalmente usarás flexbox después. Comprueba el estilo calculado de controles como `button`: su comportamiento puede depender de los estilos del navegador, así que la etiqueta por sí sola no reemplaza la inspección.

## Contenedores genéricos

Un `div` agrupa contenido en un bloque sin añadir un significado específico. Un `span` hace lo mismo dentro de una línea. Usa elementos semánticos cuando existan; usa contenedores genéricos cuando realmente necesites agrupar para estilos o comportamiento.

```html
<div class="card">
  <h2>Próxima sesión</h2>
  <p>Trae tu <span class="highlight">proyecto de recetas</span>.</p>
</div>
```

Consulta los ejemplos de [div](https://codepen.io/TheOdinProjectExamples/pen/KKXXbwR) y [span](https://codepen.io/TheOdinProjectExamples/pen/abLLPor). Cambiar `display` modifica la presentación, no transforma el significado semántico de la etiqueta.

## Actividad

1. Lee [flujo normal en MDN](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Normal_Flow) y la [lista de elementos block e inline](https://www.w3schools.com/html/html_blocks.asp).
2. Experimenta con [inline frente a inline-block](https://www.digitalocean.com/community/tutorials/css-display-inline-vs-inline-block).
3. Completa `01-margin-and-padding-1` y `02-margin-and-padding-2` de [foundations/block-and-inline](https://github.com/TheOdinProject/css-exercises/tree/main/foundations/block-and-inline), leyendo cada README antes de editar. Consulta soluciones al terminar tu intento.
4. Añade una hoja CSS externa a tu recetario. Practica colores, fondos, tipografía, márgenes y padding; no se espera aún un portafolio visual perfecto. Revisa [familias tipográficas](https://www.w3schools.com/Css/css_font.asp) y [fuentes comúnmente disponibles](https://www.w3schools.com/cssref/css_websafe_fonts.asp). Conserva una familia genérica de respaldo, porque la disponibilidad real varía por dispositivo.

## Comprobación

- ¿Qué diferencia un bloque de un elemento en línea?
- ¿Qué añade `inline-block`?
- ¿Cómo se comportan `h1`, `div` y `span` por defecto? ¿Cómo verificas `button`?
- ¿Cuándo conviene un contenedor genérico y cuándo un elemento semántico?

## Observa el flujo antes de cambiarlo

Crea dos párrafos seguidos y un enlace dentro del primero. Los párrafos aparecen uno debajo del otro; el enlace continúa dentro de la línea del texto. Si la línea no tiene espacio suficiente, el texto puede pasar a la siguiente, pero eso no convierte el enlace en un bloque. El flujo responde al contenido y al ancho disponible.

Añade un borde a cada elemento para distinguir el área que ocupa. Cambia temporalmente el enlace a display block y observa cómo rompe la línea. Después vuelve a inline y prueba inline-block con ancho y padding. La etiqueta sigue siendo un enlace y su destino no cambia; sólo cambió el modo en que su caja participa en el diseño.

Un span es útil para seleccionar una frase breve sin introducir una ruptura de línea por defecto. Si necesitas expresar importancia, strong puede ser el elemento semántico adecuado; si sólo necesitas una agrupación genérica para una clase, span no inventa un significado adicional. De forma similar, div agrupa cajas cuando no existe una región semántica más apropiada.

## Aplica al recetario

Enlaza la misma hoja externa desde el inicio y las recetas, ajustando la ruta según la carpeta. Si una página no recibe estilos, inspecciona el enlace a CSS antes de copiar reglas en línea. Usa una familia tipográfica con respaldo y prueba un tamaño legible para párrafos. Añade espacio interior donde el texto toca un borde y espacio exterior entre secciones.

No necesitas decidir una identidad visual definitiva. El ejercicio busca que puedas explicar qué propiedad produjo cada resultado y detectar cuándo un elemento en línea no responde como un bloque. Conserva una captura o una nota de un experimento que inicialmente te confundió y cómo lo resolviste.

Prueba también una frase larga para observar cómo cambia el flujo cuando el contenido ya no cabe en una sola línea.
