# Flexibilidad natural del diseño

## Conservar lo que HTML ya hace bien

Antes de añadir muchas consultas de medios, construye una base flexible. Visita esta [página sólo con HTML](https://codyloyd.github.io/responsive-html/) y reduce el navegador. El texto cambia de línea y los bloques se acomodan sin una regla especial para cada dispositivo. Buena parte de la adaptabilidad inicial se pierde cuando imponemos tamaños que el contenido no puede respetar.

Un sitio real necesita más que texto sin estilos, pero esa observación cambia la pregunta: en vez de arreglar cada tamaño después, intenta no romper la flexibilidad durante la construcción. Añade restricciones únicamente cuando respondan a una necesidad concreta y comprueba su efecto en contenido largo y pantallas estrechas.

## La etiqueta viewport

Los primeros navegadores móviles solían representar las páginas en un viewport amplio y reducirlas para que cupieran. Eso ayudaba con páginas hechas para escritorio, pero no es el comportamiento deseado para una interfaz adaptable. Incluye esta etiqueta en el `head` de una página HTML:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

`width=device-width` ajusta el viewport de distribución al ancho del dispositivo en píxeles CSS. `initial-scale=1` establece la escala inicial. No equivale a prohibir que la persona haga zoom. No añadas restricciones de escalado que impidan ampliar el texto. Si tu herramienta genera el documento, revisa el HTML resultante antes de duplicar la etiqueta.

## Anchos fijos

Una caja con `width: 600px` no cabe en una pantalla de 320 píxeles. En muchos casos, `max-width: 600px` expresa mejor la intención: puede alcanzar ese ancho, pero debe poder reducirse. Prueba el [ejemplo de ancho máximo](https://codepen.io/TheOdinProjectExamples/pen/GRMpreM) y cambia la regla en DevTools.

```css
.articulo { max-width: 40rem; margin-inline: auto; padding: 1rem; }
```

No es una prohibición de cualquier tamaño fijo. Un icono de 24 o 32 píxeles puede necesitar conservar su tamaño. Una barra lateral puede tener un ancho deliberado mientras la distribución tenga espacio; cuando ya no cabe, necesitas una estrategia para moverla, reducirla o transformarla. El hecho de que 250 píxeles sean razonables en escritorio no garantiza que una barra lateral de ese ancho deba permanecer junto al contenido en un teléfono.

## Alturas y contenido variable

Una altura fija es especialmente frágil con texto. Al reducir el ancho, las palabras ocupan más líneas. Al aumentar la fuente, crecen las líneas. Una tarjeta que encajaba con tres renglones puede desbordar con seis. El [ejemplo de altura fija](https://codepen.io/TheOdinProjectExamples/pen/qBjxVYg) muestra ese efecto.

Si necesitas una altura mínima visual, utiliza `min-height` y permite crecer. En muchos casos no necesitas declarar altura: relleno y márgenes ofrecen espacio alrededor del contenido sin limitarlo.

```css
.aviso { padding: 2rem; }
.portada { min-height: 18rem; padding: 2rem; }
```

También existen `min-width` y `max-height`, pero pueden imponer límites que requieran desplazamiento o una decisión de diseño. No cambies simplemente todos los `height` por `min-height` sin revisar la intención. Una imagen recortada o un visor desplazable tienen necesidades distintas de un párrafo.

## Flexbox y Grid

Flexbox se diseñó para distribuir elementos flexibles; `flex-wrap` permite nuevas líneas. Grid ofrece `minmax`, fracciones y repetición automática. Ninguno garantiza adaptabilidad si dentro colocas imágenes rígidas, mínimos demasiado grandes o texto sin posibilidad de partirse.

```css
.acciones { display: flex; flex-wrap: wrap; gap: .75rem; }
.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 1.5rem;
}
```

Los porcentajes tampoco resuelven todo: varias columnas porcentuales más huecos pueden sumar más de 100%, y un ancho porcentual de un padre ya estrecho puede dejar contenido ilegible. Siempre identifica la medida de referencia y la suma real de espacios.

## Actividad

Cuando encuentres desbordamiento, selecciona el elemento responsable en el inspector y compara su ancho con el del padre. Revisa también bordes, relleno y mínimos de contenido. Ocultar la barra horizontal del documento puede encubrir el fallo sin devolver acceso al contenido recortado.

1. Lee [usar la etiqueta viewport](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag) para comprender resolución y escala.
2. Lee [porcentajes en CSS](https://web.archive.org/web/20251116005914/https://codyloyd.com/2021/percentages/). Puedes dejar los detalles de consultas de medios para la siguiente lección.
3. Revisa un proyecto y localiza cada ancho y altura fija. Justifica los necesarios y sustituye los demás con reglas que expresen límites y espacio. Prueba los ejemplos con textos de dos y diez líneas.

## Comprobación

- ¿Qué es la adaptabilidad natural y cómo puedes perderla con CSS?
- ¿Cuándo conviene evitar anchos o alturas fijos?
- ¿En qué casos un tamaño fijo sigue siendo apropiado?
- ¿Cómo pueden interferir los porcentajes con la flexibilidad?
