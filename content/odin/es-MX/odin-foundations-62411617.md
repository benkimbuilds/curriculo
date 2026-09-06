# Introducción a CSS

HTML define estructura; CSS añade presentación mediante reglas. Crea `index.html` y `styles.css` en una misma carpeta y conecta la hoja desde `head`:

```html
<link rel="stylesheet" href="styles.css">
```

`link` es vacío; `rel` expresa la relación y `href` la ubicación. Una hoja externa permite compartir estilos entre páginas y modificarlos en un lugar. El nombre no tiene que ser `styles`, pero la extensión sí debe ser `.css`.

## Reglas y selectores

Una regla tiene un selector y declaraciones entre llaves. Cada declaración une una propiedad con su valor mediante dos puntos y termina en punto y coma. Mira el [diagrama de sintaxis original](https://cdn.statically.io/gh/TheOdinProject/curriculum/05ce472eabf8e04eeb2cc9139e66db884074fd7d/foundations/html_css/css-foundations/imgs/00.jpg).

```css
p {
  color: purple;
  background-color: white;
}
```

El selector universal `*` selecciona todos los elementos. Un selector de tipo, como `div`, selecciona todos los elementos de ese tipo. `div` es un contenedor genérico útil para agrupar, pero no reemplaza elementos semánticos cuando existe uno adecuado.

Una clase se escribe en HTML como `class="alert-text"` y se selecciona con `.alert-text`. Puede repetirse en varios elementos. Un elemento puede tener varias clases separadas por espacios, como `class="alert-text severe-alert"`; usa guiones para nombres de varias palabras. Un ID se escribe `id="title"` y se selecciona con `#title`; debe ser único en el documento. Para estilos reutilizables prefiere clases. Evita nombres que comiencen por dígitos: requieren escapes especiales en CSS. Mayúsculas y minúsculas importan.

```css
.read, .unread { color: white; background-color: black; }
.subsection.header { color: red; }
.subsection#preview { color: blue; }
.ancestor .contents { color: green; }
```

Una **coma** agrupa alternativas que comparten declaraciones. Sin espacio, `.subsection.header` exige ambas clases en el mismo elemento. Con espacio, `.ancestor .contents` selecciona elementos `contents` que estén dentro de un ancestro `ancestor`, sin importar cuántos niveles haya. No selecciona un `contents` fuera de ese ancestro. Encadenar `div` y `p` como `divp` buscaría un tipo llamado `divp`, no ambos elementos. Evita combinaciones innecesariamente largas: dificultan leer y mantener reglas.

## Propiedades iniciales

`color` cambia el texto; `background-color` cambia el fondo. Aceptan nombres, hexadecimal, RGB y HSL. Por ejemplo `#1100ff`, `rgb(100, 0, 127)` y `hsl(15, 82%, 56%)` son formas válidas. Consulta [valores y canal alfa](https://www.w3schools.com/cssref/css_colors_legal.asp) para transparencia. Cada propiedad tiene un valor inicial, pero estilos del navegador y herencia pueden cambiar lo que observas.

`font-family` recibe una lista de preferencias: `"Times New Roman", serif`. Los nombres con espacios usan comillas; las familias genéricas como `serif` no. Si falta la primera fuente, el navegador prueba la siguiente. `font-size: 22px` no lleva espacio entre número y unidad. `font-weight` expresa grosor; `700` suele equivaler a `bold`, pero depende de qué pesos incluya la fuente. `text-align: center` alinea texto dentro de la caja, no necesariamente la caja misma.

```css
img {
  width: 500px;
  height: auto;
}
```

Una imagen de 1000 × 500 pasa a 500 × 250 con esta regla. `auto` conserva proporción. Mantén en HTML los atributos de dimensiones reales para reservar espacio durante la carga; CSS puede definir cómo se muestra después.

## Tres formas de añadir estilos

La forma **externa** que ya usaste separa y comparte estilos. La forma **interna** coloca las mismas reglas dentro de un elemento `style` en `head`, útil para una página aislada pero menos cómoda para compartir. La forma **en línea** utiliza el atributo `style` directamente y no lleva selector:

```html
<p style="color: white; background-color: black;">Aviso</p>
```

En línea puedes repetir muchas declaraciones y ensuciar el documento. Además sus declaraciones normales tienen prioridad sobre reglas normales de hojas del autor. Usaremos principalmente hojas externas; la cascada tiene más criterios que conocerás después.

## Actividad

1. Lee el README del [repositorio de ejercicios CSS](https://github.com/TheOdinProject/css-exercises).
2. En [foundations/intro-to-css](https://github.com/TheOdinProject/css-exercises/tree/main/foundations/intro-to-css), completa en orden `01-css-methods`, `02-class-id-selectors`, `03-grouping-selectors`, `04-chaining-selectors` y `05-descendant-combinator`. Lee cada README antes de editar y consulta `solution` sólo después de tu intento.
3. Prueba cada selector de esta lección con elementos que coincidan y otros que no. Predice el resultado antes de recargar.

## Comprobación

- ¿Cómo se escriben selectores de clase y de ID?
- ¿Cómo aplicas una regla a dos selectores?
- ¿Qué selecciona `#title.primary` y qué cambia si añades un espacio?
- ¿Qué expresa el combinador descendiente?
- ¿Cuáles son las tres formas de añadir CSS y qué ventajas tienen?

## Sigue un selector hasta sus coincidencias

Para practicar el selector universal, crea varios tipos de elementos: un encabezado, un párrafo, un enlace y un contenedor. Aplica color púrpura con el asterisco y observa qué reciben. Después reemplaza el selector por p. El cambio debe afectar directamente sólo a los párrafos, aunque algunas propiedades puedan heredarse a sus hijos. La herencia se estudia en la siguiente lección; aquí comienza por reconocer qué elementos selecciona la regla.

Prueba luego tres div y un párrafo como en el ejemplo original. Una regla div selecciona los tres div sin importar el texto que contienen; no selecciona el párrafo porque su tipo es otro. CSS no compara automáticamente el contenido visible con el nombre del selector. Si quieres identificar un grupo que incluye tipos distintos, añade una clase compartida.

Una clase se escribe sin punto en HTML y con punto en el selector CSS. Confundir esos dos lugares es un error frecuente. class="alert-text" se combina con .alert-text; escribir class=".alert-text" crea un nombre diferente que no coincide con el selector sencillo esperado. Lo mismo ocurre con un ID: el atributo contiene title y el selector usa #title. El signo pertenece a la sintaxis de selección, no al nombre habitual del atributo.

Añade una misma clase a dos párrafos y un div. Comprueba que todos reciben la regla. Después añade una segunda clase sólo a uno de ellos. Las clases se separan con espacios porque son varios nombres, no un único nombre compuesto. Si quieres que una clase se llame alerta-importante, usa guion; escribir alerta importante expresa dos clases independientes.

## Agrupar no es encadenar

Supón que read y unread comparten texto blanco sobre fondo negro, pero difieren en otros detalles. Puedes escribir esas declaraciones dos veces y obtener el resultado correcto. Sin embargo, cuando quieras cambiar el fondo tendrás que recordar ambos lugares. Agrupar .read y .unread con una coma permite modificar la parte compartida una sola vez y conservar reglas separadas para las diferencias.

Ahora considera subsection y header. Si escribes .subsection.header sin espacio, pides un elemento que tenga las dos clases. Un elemento que sólo tenga subsection no cumple; otro que sólo tenga header tampoco. Si escribes .subsection, .header con coma, pides cualquiera de los dos grupos y seleccionas ambos. El significado cambia por un carácter, así que lee el selector como una condición antes de probarlo.

Puedes encadenar una clase y un ID. Un elemento con class subsection e id preview cumple .subsection#preview. Aunque sea válido, no necesitas combinar siempre todos los atributos disponibles. Elige el selector más sencillo que exprese el grupo correcto. Aumentar especificidad sin motivo puede complicar modificaciones futuras.

Un selector de tipo identifica qué clase de elemento es: p, div o h1. Un elemento no puede ser simultáneamente dos tipos distintos. Unir div y p sin separación crea divp como un nombre de tipo distinto. Si quieres seleccionar ambos usa coma; si quieres párrafos dentro de un div usa una relación de descendencia. Esa distinción evita inventar selectores que parecen razonables pero no encuentran nada.

## Lee una relación descendiente

Imagina un contenedor ancestor con dos elementos contents anidados a distinta profundidad y otro contents fuera. La regla .ancestor .contents encuentra ambos contenidos interiores, porque el primero tiene ancestor como padre y el segundo como un ancestro más lejano. El tercero no coincide. El espacio no exige que el padre sea inmediato: expresa que existe un ancestro que cumple la parte izquierda.

Puedes añadir más niveles, como .one .two .three .four, pero cada requisito liga la regla a una estructura más específica. Si reorganizas contenedores, podrías romper estilos aunque las clases del elemento final no cambien. No construyas cadenas largas sólo para evitar nombrar claramente el componente que quieres modificar. Durante la práctica, dibuja el árbol y marca las coincidencias antes de ejecutar.

## Experimenta con propiedades por separado

Comienza cambiando color y background-color en un único párrafo. El primero modifica los caracteres; el segundo pinta el área de fondo de su caja. Si el texto desaparece porque ambos colores son iguales, la regla puede estar funcionando exactamente como la escribiste. Selecciona una combinación con contraste suficiente para seguir leyendo mientras experimentas.

Un color hexadecimal representa componentes mediante dígitos; RGB expresa rojo, verde y azul; HSL expresa tono, saturación y luminosidad. Un canal alfa controla opacidad del color. No tienes que convertir mentalmente entre todas las representaciones, pero sí reconocer que dos formas distintas pueden representar el mismo resultado. Usa las herramientas del navegador para variar un componente y observarlo.

Prueba una lista de fuentes que comience con una que no está instalada y termine con una familia genérica. El navegador no produce necesariamente un error visible: elige la siguiente disponible. Por eso una página puede verse distinta en otra computadora aunque su CSS se haya descargado correctamente. Usa comillas para nombres con espacios y deja sin comillas las palabras genéricas como serif o sans-serif.

Cambia font-size manteniendo el valor y la unidad juntos. Una declaración mal escrita puede ignorarse mientras el resto de la regla continúa funcionando. Después cambia font-weight entre normal, bold y valores numéricos. Si la fuente no incluye todos los pesos, los resultados disponibles pueden no diferir como esperabas. La propiedad expresa una petición que el navegador resuelve con los recursos existentes.

text-align centra contenido en línea dentro de un elemento. Si el propio elemento ocupa todo el ancho, el texto parece centrarse en la página, pero eso no significa que hayas cambiado la posición o tamaño de la caja. Añade un borde temporal para distinguir ambas cosas. Más adelante el modelo de caja y flexbox darán herramientas para posicionar los elementos mismos.

## Comprueba la proporción de una imagen

Toma una imagen rectangular y fija sólo su ancho con altura automática. Observa que el alto cambia proporcionalmente. Si fijas ancho y alto incompatibles, puede deformarse. La recomendación de conservar dimensiones en HTML y usar CSS para presentación no es una contradicción: la información del recurso ayuda a reservar espacio y CSS puede adaptar cómo se muestra.

No uses una imagen gigante sólo porque CSS la muestra pequeña: el navegador todavía descarga el archivo original. Esa optimización se estudiará después, pero ya puedes reconocer la diferencia entre tamaño del archivo y dimensiones visibles. Para esta lección la meta es controlar proporción sin estirar el contenido.

## Compara las tres ubicaciones de CSS

Escribe primero una regla externa y comprueba que se carga. Luego prueba la misma regla dentro de style en head, sin mantener dos versiones contradictorias durante la comparación. En ambos casos usas selectores, llaves y declaraciones. Con el atributo style, en cambio, escribes sólo declaraciones porque el elemento ya está determinado por la etiqueta donde aparece.

Una regla interna puede ser suficiente para un experimento aislado, pero repetirla en cada receta duplica mantenimiento. Una hoja externa compartida permite mejorar todo el sitio desde un lugar. Los estilos en línea pueden ser útiles para un caso puntual, pero repetirlos en muchos elementos hace el documento largo y vuelve más difícil cambiar una decisión común. Elige la forma externa para los proyectos del curso y aprende a reconocer las otras cuando leas código ajeno.
