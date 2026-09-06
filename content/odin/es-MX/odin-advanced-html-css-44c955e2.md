# HTML semántico

## Significado y contexto

`div` y `span` son contenedores genéricos útiles para distribuir o agrupar contenido. No describen por sí mismos una acción, una lista o una región. Cuando exista un elemento que exprese la intención, utilizarlo permite al navegador y a las tecnologías de asistencia ofrecer contexto y comportamiento adecuados.

Algunos elementos, como `p`, indican estructura textual. Otros, como `button`, comunican además una función interactiva. Un lector de pantalla puede anunciar “Piedra, botón”, mientras un `div` con el mismo texto puede anunciarse simplemente como “Piedra”. Que se vea como botón no hace que el árbol de accesibilidad lo represente como tal.

```html
<!-- Apariencia posible de botón, pero sin función semántica nativa. -->
<div class="piedra">Piedra</div>

<!-- Acción expresada mediante un control nativo. -->
<button type="button" class="piedra">Piedra</button>
```

El botón ofrece foco y activación con teclado. Si reconstruyes esas funciones sobre un contenedor, necesitas implementar todas correctamente y seguir comunicando su función. Empezar con HTML nativo reduce ese trabajo. Esto no prohíbe `div`: sigue siendo apropiado para una envoltura de distribución que no necesita otro significado.

## Elegir por intención

Para una acción en la página, utiliza `button`. Para navegar a otro recurso, utiliza `a` con `href`. No elijas según si quieres un rectángulo o texto subrayado: CSS define la presentación. Los datos tabulares corresponden a `table` y sus encabezados; las listas, a `ul`, `ol` o `dl` y sus elementos asociados. La semántica permite anunciar cantidad de elementos, entradas y salidas de listas o relaciones entre celdas.

Cada entrada necesita una etiqueta. Puedes asociarla explícitamente por identificador o envolver el control:

```html
<label for="nombre">Nombre</label>
<input id="nombre" name="nombre" type="text">

<label>Correo <input name="correo" type="email"></label>
```

El `for` debe coincidir con un `id` único. Al activar la etiqueta, se enfoca el control; esto aumenta el área útil para personas que tienen dificultades de precisión. La etiqueta también proporciona su nombre al lector de pantalla.

Usa el tipo de entrada adecuado: texto para nombres, `email` para correo y `tel` para teléfono. Algunos dispositivos muestran un teclado más útil al conocer el tipo. Un teléfono no debería convertirse en `number` sólo porque incluye dígitos: puede contener prefijos, espacios y ceros iniciales.

## Encabezados y regiones

`h1` a `h6` indican niveles de encabezado. Elige el nivel según la estructura, no según el tamaño predeterminado. Un lector de pantalla puede recorrer encabezados para encontrar rápidamente una sección. Si sustituyes todos por párrafos grandes, esa navegación desaparece aunque visualmente parezcan títulos.

Siete elementos nativos pueden definir regiones reconocibles: `aside`, `footer`, `form`, `header`, `main`, `nav` y `section`. Su exposición como regiones depende del contexto. Por ejemplo, una `section` o un `form` suelen necesitar un nombre accesible para funcionar como landmark, y un `header` dentro de un artículo no equivale al encabezado global. No añadas regiones indiscriminadamente: demasiadas regiones sin nombres claros pueden dificultar la navegación.

```html
<header><nav aria-label="Principal">...</nav></header>
<main>
  <h1>Proyectos del curso</h1>
  <section aria-labelledby="recientes">
    <h2 id="recientes">Entregas recientes</h2>
    <ul><li>Catálogo de libros</li><li>Panel de tareas</li></ul>
  </section>
</main>
<footer>Información del curso</footer>
```

Observa el [esquema de una lección de Odin](https://cdn.statically.io/gh/TheOdinProject/curriculum/b71f39e8c0934cc6cc80daaae9ed375f00753b09/advanced_html_css/accessibility/semantic_html/imgs/semantic_html_example.png). Encabezados y regiones permiten saltar a la parte relevante sin escuchar toda la página. Inspecciona después una página real: no te limites a adivinar regiones por colores o bordes.

## Revisar estructura sin depender de apariencia

Abre una página y escribe una lista únicamente con sus encabezados, conservando niveles. Esa lista debe resumir la organización del documento. Si encuentras un `h4` elegido sólo porque se veía pequeño, revisa qué sección representa y dale el nivel correspondiente; luego ajusta su tamaño con CSS. Separar estructura y apariencia permite cambiar el diseño sin perder la navegación semántica.

Haz una segunda lista de regiones. Una navegación principal y otra de lecciones pueden ser útiles si tienen nombres distintos. Varias secciones genéricas llamadas “Contenido” aportan menos. El objetivo no es maximizar el número de landmarks, sino ofrecer puntos de orientación que correspondan a partes reales de la página.

En una tabla, escucha una celda después de navegar horizontal y verticalmente. El lector puede anunciar los encabezados correspondientes si la estructura está correctamente asociada. Una colección de `div` visualmente alineados no proporciona esa relación automáticamente. Del mismo modo, una lista semántica permite conocer cuántos elementos contiene y cuándo termina. Estas capacidades muestran que la elección de etiqueta afecta a la forma de explorar contenido, no sólo a una descripción abstracta del código.

## Actividad

1. Prueba un lector de pantalla. En Windows, incluso si programas con WSL2, puedes usar [NVDA](https://www.nvaccess.org/download/). En macOS utiliza [VoiceOver](https://support.apple.com/en-gb/guide/voiceover/welcome/mac). También existen [Orca para Linux](https://gnome.pages.gitlab.gnome.org/orca/help/) y [ChromeVox](https://support.google.com/chromebook/answer/7031755). Lee primero cómo iniciar y detener la herramienta para explorar con comodidad.
2. Compara tu control `div` con un botón. Escucha su nombre y función, y prueba la activación con teclado.
3. Lee [cómo navegan tablas los lectores de pantalla](https://tink.uk/how-screen-readers-navigate-data-tables/) y mira la [demostración de una tabla accesible](https://youtu.be/ACmYzyN0b3U?si=o5PptrjVGJGj2OT7&t=83).
4. Mira [por qué importan encabezados y regiones](https://www.youtube.com/watch?v=vAAzdi1xuUY&list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g&index=19). Recorre una página propia por encabezados y anota los que no describen bien su contenido.

## Comprobación

Utiliza el árbol de accesibilidad para verificar el rol y nombre calculados de cada ejemplo.

- ¿Por qué HTML semántico aporta algo que CSS no puede comunicar por sí solo?
- ¿Qué siete elementos pueden definir regiones y qué condiciones debes revisar?
- ¿Cuándo corresponde un botón y cuándo un enlace?
