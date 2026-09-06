# Unidades CSS

## Unidades absolutas y relativas

Las unidades expresan cómo debe calcularse un tamaño. Una unidad absoluta, como `px`, no depende del tamaño tipográfico de otro elemento. Un píxel CSS es una unidad lógica, no necesariamente un único píxel físico de la pantalla. Otras unidades absolutas, como `cm` o `in`, tienen más sentido en impresión que en el diseño habitual de una página.

Las unidades relativas dependen de otra medida. Antes de elegir una, pregunta qué relación quieres expresar: ¿este espacio debe crecer con el texto?, ¿esta caja debe ocupar la mitad de su contenedor?, ¿este bloque debe medir una parte de la pantalla? La respuesta es más útil que una regla rígida de “siempre usa una unidad”.

## `em` y `rem`

`1em` equivale al tamaño de fuente del propio elemento cuando se usa, por ejemplo, en su relleno o ancho. Al declarar `font-size`, la referencia es el tamaño heredado. Si un elemento tiene `font-size: 16px`, `width: 4em` equivale a 64 píxeles CSS. Si cambias su tipografía, también cambia ese ancho.

`1rem` equivale al tamaño de fuente del elemento raíz, normalmente `html`. Facilita una escala consistente porque no debes seguir cada anidamiento. Por eso suele ser una buena primera elección para tipografía y espacios generales. `em` sigue siendo útil cuando quieres que el relleno de un botón crezca con el texto particular de ese botón.

```css
body { font-size: 1rem; }
.tarjeta { padding: 1.5rem; }
.boton { font-size: 1.25rem; padding: .6em 1em; }
```

No fijes innecesariamente la fuente raíz en píxeles. Muchos usuarios cambian su tamaño predeterminado para leer mejor. Usar tamaños relativos permite respetar esa preferencia; siempre comprueba también zoom y ajustes de texto, porque una caja de altura fija puede recortar incluso una fuente relativa.

## Porcentajes y unidades de viewport

`50%` suele expresar una proporción respecto a la medida correspondiente del contenedor; su referencia exacta depende de la propiedad. `50vw`, en cambio, representa la mitad del ancho del viewport. `1vw` es 1% de su ancho y `1vh`, 1% de su alto. Pueden servir para portadas que ocupan gran parte de la pantalla o interfaces altas, pero no deberían obligar a recortar contenido cuando éste crece.

```css
.columna { width: 50%; }
.portada { min-height: 80vh; }
.separador { border-top: 1px solid #777; }
```

El borde de un píxel puede ser deliberadamente constante. La columna cambia con su contenedor y la portada con la pantalla. Hay muchas más [unidades de longitud](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length): consúltalas cuando una relación concreta lo exija, sin memorizarlas.

## Actividad

1. Lee [valores y unidades CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units) de MDN y reproduce los ejemplos.
2. Estudia [CSS units](https://web.archive.org/web/20251130034321/https://codyloyd.com/2021/css-units/) para comparar `em`, `rem` y `px` en situaciones concretas.
3. Experimenta con [Fun with Viewport Units](https://css-tricks.com/fun-viewport-units/).
4. Construye dos cajas: una de `50%` y otra de `50vw`. Reduce sólo el ancho del padre. Después cambia la fuente raíz y compara rellenos en `em`, `rem` y `px`.

## Comprobación

- ¿Por qué `em` y `rem` pueden respetar preferencias tipográficas mejor que un tamaño fijo?
- ¿En qué situación usarías `vh` o `vw`?
- ¿Cuándo elegirías `px` deliberadamente?
- ¿Por qué dos elementos con `2em` pueden tener tamaños distintos?
