# Selectores avanzados

## Seleccionar relaciones

Las clases, los identificadores y los nombres de elemento son herramientas básicas. A veces necesitas seleccionar por relación, posición, estado o atributo, especialmente si no puedes cambiar el HTML. Los combinadores relacionan selectores sin añadir por sí mismos especificidad.

```html
<main>
  <div class="grupo uno"><p>Primero</p></div>
  <div class="grupo dos"><p>Segundo</p></div>
  <div class="grupo tres"><p>Tercero</p></div>
</main>
```

`main p` encuentra cualquier párrafo descendiente, aunque haya varios niveles. `main > div` sólo encuentra hijos directos. `.uno + div` selecciona el `div` inmediatamente posterior a `.uno`, siempre que compartan padre. `.uno ~ div` selecciona todos los `div` hermanos posteriores. Ninguno selecciona automáticamente al padre ni a hermanos anteriores.

```css
main > div { padding: 1rem; }
.uno + div { border-top: 1px solid; }
.uno ~ div { margin-top: 1rem; }
main > div > p { margin: 0; }
```

Estos selectores dependen del árbol del documento, no de la sangría escrita en el archivo. Consulta [combinadores en MDN](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Combinators) y repasa [Introducción a CSS](https://www.theodinproject.com/lessons/foundations-intro-to-css) si el selector descendiente aún te resulta confuso.

## Pseudoclases: estado y estructura

Una pseudoclase usa `:` y selecciona elementos existentes que cumplen una condición. Una clase, pseudoclase o selector de atributo normalmente contribuye al mismo nivel de especificidad. Un pseudoelemento usa `::` y representa una parte del elemento o contenido generado; normalmente contribuye como un selector de tipo. Consulta [la diferencia en MDN](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements) y [el cálculo de especificidad](https://css-tricks.com/specifics-on-css-specificity/#aa-calculating-css-specificity-value).

Las pseudoclases de interacción ofrecen respuesta visual:

- [`:focus`](https://css-tricks.com/almanac/pseudo-selectors/f/focus/) identifica el elemento que tiene el foco, por ejemplo después de usar Tab.
- [`:hover`](https://css-tricks.com/almanac/pseudo-selectors/h/hover/) identifica el elemento bajo el puntero. No es una interacción universal en pantallas táctiles.
- [`:active`](https://css-tricks.com/almanac/pseudo-selectors/a/active/) aparece durante la activación, como al mantener presionado un botón.
- [`:link`](https://css-tricks.com/almanac/pseudo-selectors/l/link/) y [`:visited`](https://css-tricks.com/almanac/pseudo-selectors/v/visited/) distinguen enlaces no visitados y visitados. Por privacidad, el navegador restringe qué estilos de enlaces visitados permite observar o cambiar.

```css
a { text-decoration: underline; }
a:link { color: #164b8c; }
a:visited { color: #663c82; }
button:hover { background: #dfeaf4; }
button:active { transform: translateY(1px); }
button:focus-visible { outline: 3px solid #1466b8; outline-offset: 3px; }
```

Las pseudoclases estructurales dependen de la posición en el DOM. [`:root`](https://css-tricks.com/almanac/pseudo-selectors/r/root/) representa la raíz, normalmente `html`, pero [tiene mayor especificidad](https://stackoverflow.com/questions/15899615/whats-the-difference-between-css3s-root-pseudo-class-and-html). Es un lugar habitual para propiedades personalizadas globales.

[` :first-child`](https://css-tricks.com/almanac/pseudo-selectors/f/first-child/) y [`:last-child`](https://css-tricks.com/almanac/pseudo-selectors/l/last-child/) seleccionan al primer o último hijo de su padre. `p:first-child` no significa “el primer párrafo”: el párrafo debe ser también el primer hijo. [`:only-child`](https://css-tricks.com/almanac/pseudo-selectors/o/only-child/) coincide cuando no hay hermanos. [`:empty`](https://css-tricks.com/almanac/pseudo-selectors/e/empty/) comprueba la ausencia de contenido hijo; presta atención a nodos de texto, incluidos espacios, al probarlo.

[` :nth-child()`](https://css-tricks.com/almanac/pseudo-selectors/n/nth-child/) utiliza posiciones que empiezan en uno. `li:nth-child(2)` selecciona un `li` que ocupa la segunda posición entre todos sus hermanos. `li:nth-child(odd)` y `li:nth-child(2n + 1)` seleccionan posiciones impares; `even` y `2n`, pares. `.fila:nth-child(3n)` no cuenta sólo las clases `.fila`: primero comprueba la posición y después si el elemento tiene esa clase.

## Pseudoelementos

[`::marker`](https://css-tricks.com/almanac/pseudo-selectors/m/marker/) permite presentar viñetas o números. [`::first-letter`](https://css-tricks.com/almanac/pseudo-selectors/f/first-letter/) y [`::first-line`](https://css-tricks.com/almanac/pseudo-selectors/f/first-line/) permiten estilizar partes del texto sin envolverlas en etiquetas. [`::selection`](https://css-tricks.com/almanac/pseudo-selectors/s/selection/) cambia la apariencia del texto seleccionado.

[`::before` y `::after`](https://css-tricks.com/almanac/pseudo-selectors/b/after-and-before/) generan contenido decorativo alrededor del contenido del elemento. Necesitan `content`; no son una buena ubicación para instrucciones esenciales.

```css
.destacado::before { content: "★ "; color: #8b5a00; }
.destacado::after { content: " ★"; color: #8b5a00; }
li::marker { color: #164b8c; }
```

Consulta el catálogo de [pseudoclases](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) y [pseudoelementos](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements) cuando necesites una condición nueva.

## Atributos completos y parciales

Un atributo es información de una etiqueta, como `src`, `href` o `type`. `[src]` comprueba su presencia; `img[src]` añade una condición de tipo de elemento; `input[type="text"]` exige un valor exacto. No necesitas añadir una clase sólo para seleccionar controles de un tipo.

```css
[src] { /* Cualquier elemento con src */ }
input[type="text"] { border: 1px solid #777; }
[class^="thunder"] { /* class comienza con thunder */ }
img[src$=".jpg"] { /* src termina exactamente en .jpg */ }
[for*="correo"] { /* for contiene correo */ }
```

`^=` compara el principio, `$=` el final y `*=` una subcadena en cualquier posición. Son comparaciones del valor completo del atributo: si cambias el orden de clases o añades parámetros al final de una URL, el resultado puede cambiar. Su notación recuerda a las [expresiones regulares](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions), pero no es un motor de expresiones regulares. La [referencia de atributos](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) también explica palabras separadas y comparación sin distinguir mayúsculas.

## Seguir una selección paso a paso

Para razonar sobre un selector compuesto, empieza por el elemento que debe coincidir y después verifica sus relaciones. En `main > div > p`, buscas un párrafo cuyo padre inmediato es un `div` y cuyo abuelo inmediato es `main`. Si insertas una envoltura entre el `div` y el párrafo, deja de coincidir. En `main p`, esa envoltura no rompe la condición, porque sólo exige algún ancestro `main`. Ninguno de los dos es universalmente mejor: el primero expresa una estructura precisa y el segundo tolera más niveles.

Haz lo mismo con hermanos. En `.uno + div + div`, el `div` final debe estar inmediatamente después de otro `div`, y éste inmediatamente después de `.uno`. El selector puede representar el tercer elemento de la muestra, pero no significa “el tercer hijo” en cualquier documento. Inserta un `p` entre los dos últimos y observa cómo cambia el resultado. Con `.uno ~ div`, ese párrafo intermedio no impide seleccionar un `div` posterior, porque la relación ya no exige adyacencia.

Las condiciones pueden combinarse: `button:hover:focus` exige que el mismo botón esté bajo el puntero y tenga foco. `.lista > li:nth-child(odd)` restringe las posiciones impares a hijos directos de esa lista. Cuando una regla no se aplica, verifica cada parte por separado en DevTools. Si el selector sí coincide pero la propiedad aparece tachada, el problema ya no es selección sino cascada o validez de la declaración.

Los selectores por subcadena requieren especial cuidado con clases. El atributo `class` es una cadena que contiene nombres separados por espacios. `[class^="thunder"]` sólo coincide cuando la cadena completa empieza así; `.thunder` busca una clase exacta independientemente de su posición entre otras. Si lo que quieres es una clase concreta, usa el selector de clase. Reserva los operadores de cadena para una condición que realmente dependa del formato de todo el atributo.

Por último, recuerda que los pseudoelementos decorativos no añaden nodos HTML que puedas encontrar con `querySelector`. Su apariencia procede del estilo. Esto los hace útiles para un marcador visual, pero no para insertar la única copia de un precio, una advertencia o un enlace. El contenido esencial y las acciones deben existir en el documento para poder comprenderse y operarse de manera consistente.

## Actividad

1. Completa [CSS Diner](https://flukeout.github.io/). Lee la explicación de cada nivel, incluso si adivinas la respuesta.
2. Lee [selectores complejos de Shay Howe](https://learn.shayhowe.com/advanced-html-css/complex-selectors/). Algunos ejemplos antiguos usan un solo `:` para pseudoelementos; escribe `::` en tu código nuevo.
3. Resuelve la [evaluación de selectores de MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Basic_selectors/Selectors_Tasks).
4. Prueba los ejemplos anteriores añadiendo un encabezado antes de la lista. Explica por qué una condición de `nth-child` puede cambiar sin modificar la clase del elemento.

## Comprobación

- ¿Qué diferencia hay entre hijo directo y descendiente?
- ¿Cómo distingues sintácticamente pseudoclases y pseudoelementos? ¿Qué representan?
- ¿Qué dos expresiones seleccionan posiciones impares?
- ¿Qué seleccionan `div:first-child` y `div:last-child`?
- ¿Qué estados corresponden a pasar el puntero, activar y enfocar?
- ¿Cómo seleccionas campos de texto y atributos `class` que comienzan con `thunder`?
