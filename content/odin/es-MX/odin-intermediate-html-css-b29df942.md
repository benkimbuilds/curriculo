# Más estilos de texto

## Fuentes del sistema

`font-family` indica una lista de opciones, no una garantía de que la primera esté instalada. Si seleccionas una fuente disponible sólo en tu computadora, otras personas verán una alternativa. Termina la lista con una familia genérica y procura que la alternativa conserve una lectura razonable.

Una [pila de fuentes del sistema](https://css-tricks.com/snippets/css/system-font-stack/) aprovecha la tipografía de la interfaz del dispositivo, sin descargar archivos:

```css
body {
  font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
```

El navegador recorre la lista hasta encontrar una opción disponible. Es una solución útil para un estilo neutral, buen rendimiento y compatibilidad entre Windows y macOS.

## Fuentes web

Para mostrar una fuente que no está instalada debes descargarla desde un servicio o alojarla junto con tu sitio. En ambos casos, conserva una alternativa: una conexión puede fallar y un servicio externo puede cambiar. Además, las fuentes consumen tiempo y datos; evita cargar familias y pesos que no usas.

Bibliotecas como [Font Library](https://fontlibrary.org/), [Bunny Fonts](https://fonts.bunny.net/) y [Google Fonts](https://fonts.google.com/) proporcionan archivos o fragmentos de integración. Un enlace puede ir en el documento:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
      rel="stylesheet">
```

Otra opción es `@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');` al principio de una hoja CSS. Revisa el efecto de cada método en la descarga antes de elegirlo. También considera la privacidad: solicitar una fuente a otro servidor transmite datos de la conexión. La fuente original recoge [un caso judicial sobre Google Fonts](https://thehackernews.com/2022/01/german-court-rules-websites-embedding.html); no lo interpretes como asesoría legal universal. Autoalojar una fuente con licencia adecuada evita depender de esa solicitud externa.

```css
@font-face {
  font-family: "Fuente del curso";
  src: url("../fonts/curso.woff2") format("woff2");
  font-display: swap;
}
h1 { font-family: "Fuente del curso", sans-serif; }
```

`@font-face` asigna un nombre a un archivo. Después lo usas como cualquier familia. Consulta [formatos de fuentes](https://fileinfo.com/filetypes/font) y [compatibilidad de fuentes web](https://www.w3schools.com/css/css3_fonts.asp). Comprueba que los archivos incluyan acentos, ñ, signos de apertura y los pesos usados en tu interfaz.

## Apariencia y significado

`font-style: italic` inclina una fuente por motivos visuales. `em` comunica énfasis semántico. No son intercambiables: “Yo nunca dije que **él** lo tomó” destaca algo distinto de “Yo **nunca** dije que él lo tomó”. Utiliza [el elemento de énfasis](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/em) cuando el énfasis cambie la lectura; utiliza CSS cuando todos los títulos deban verse en cursiva por diseño.

```html
<p>Yo <em>nunca</em> dije eso.</p>
```

```css
.titulo-editorial { font-style: italic; }
```

`letter-spacing` modifica el espacio entre caracteres. Puede ajustar una cabecera, pero un valor exagerado dificulta la lectura. Cambia valores en el [ejemplo de espaciado](https://codepen.io/TheOdinProjectExamples/pen/MWomjGr). `line-height` controla la altura de las líneas; un valor sin unidad, como `1.5`, suele conservar una relación clara con la fuente heredada. Experimenta con el [ejemplo de altura de línea](https://codepen.io/TheOdinProjectExamples/pen/vYZmXzY) usando párrafos largos.

[`text-transform`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform) presenta texto en mayúsculas, minúsculas o con iniciales capitalizadas sin reescribir el contenido. No conviertas cada palabra del español a mayúscula inicial sólo porque exista `capitalize`. [`text-shadow`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow) añade sombras al texto; úsalo con cuidado para no reducir contraste o nitidez.

## Texto truncado

Los puntos suspensivos requieren que exista desbordamiento y que el texto no salte de línea:

```css
.nombre-corto {
  max-width: 18rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

`text-overflow` por sí solo no limita la caja ni impide saltos. Revisa el [ejemplo de truncado](https://css-tricks.com/snippets/css/truncate-string-with-ellipsis/). Antes de ocultar texto, decide cómo accederá la persona al contenido completo. No trunques instrucciones esenciales o errores de formulario.

## Leer la tipografía como sistema

Para evaluar una fuente, no mires sólo una palabra de muestra. Escribe un título largo, un párrafo con acentos, una lista y un botón. Las fuentes tienen métricas diferentes: dos familias a `16px` pueden parecer de tamaños distintos y producir saltos de línea en lugares diferentes. Cambiar una fuente después de terminar el diseño puede hacer crecer encabezados, mover tarjetas o recortar controles con altura fija. Por eso la alternativa y la fuente principal deben probarse con el mismo contenido real.

La altura de línea merece una prueba separada. En un párrafo, más espacio entre renglones puede facilitar seguir la lectura, mientras que en un título de dos líneas un valor demasiado grande puede romper su unidad visual. No resuelvas esa diferencia reduciendo el tamaño de todos los textos: asigna estilos según su función. Las unidades sin dimensión para `line-height` permiten que el valor se multiplique por la fuente del elemento que lo hereda, en lugar de heredar una altura absoluta que puede resultar demasiado pequeña.

Al probar una fuente alojada por ti, revisa la pestaña Network. Una URL relativa se resuelve desde el archivo CSS, no necesariamente desde la página HTML. Si tu CSS está en una subcarpeta, `../fonts/...` y `./fonts/...` apuntan a lugares distintos. Un nombre de archivo incorrecto puede pasar inadvertido porque la alternativa sigue mostrando texto. Comprueba la respuesta y la fuente realmente utilizada en DevTools; ver letras en pantalla no demuestra que el recurso elegido haya cargado.

Finalmente, revisa el comportamiento de `text-transform` sin confundir presentación con contenido. Si alguien copia el título o usa una tecnología que accede al texto original, necesitas que éste siga escrito correctamente. El CSS transforma la apariencia; no es una herramienta para corregir datos mal capitalizados que llegan de otra fuente.

## Actividad

1. Lee [fuentes web en MDN](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Web_fonts) y completa sus ejercicios.
2. Estudia [buenas prácticas de fuentes](https://web.dev/articles/font-best-practices): observa la descarga, el texto de reserva y los cambios de distribución mientras carga la fuente.
3. Lee [tipografía en web.dev](https://web.dev/learn/design/typography). Ajusta un artículo con encabezado, párrafos y enlaces; prueba zoom, texto largo y una pantalla angosta.
4. Bloquea temporalmente la descarga de tu fuente desde DevTools. Verifica que la alternativa siga siendo legible y que los botones no recorten etiquetas.

## Comprobación

- ¿Cuáles son las dos maneras de incorporar una fuente no instalada?
- ¿Qué ofrece una pila del sistema?
- ¿Qué diferencia hay entre `letter-spacing` y `line-height`?
- ¿Por qué `em` no equivale simplemente a texto en cursiva?
