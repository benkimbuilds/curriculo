# Introducción a flexbox

Flexbox organiza elementos en filas o columnas y distribuye espacio entre ellos. Es una herramienta habitual para navegación, grupos de tarjetas y componentes, y evita depender de trucos antiguos para alinear cajas. No es una propiedad aislada: algunas reglas pertenecen al contenedor y otras a sus elementos.

## Contenedor y elementos flex

```html
<div class="flex-container">
  <div>Uno</div>
  <div>Dos</div>
  <div>Tres</div>
</div>
```

```css
.flex-container { display: flex; }
.flex-container > div { flex: 1; }
```

Un **contenedor flex** tiene `display: flex`. Sus hijos directos se convierten en **elementos flex**. Los nietos no se convierten automáticamente en elementos de ese mismo contenedor. Con la dirección predeterminada y estos contenidos, las tres cajas se colocan en fila y comparten el espacio disponible.

Un elemento puede ser a la vez elemento flex de su padre y contenedor flex de sus propios hijos. Es así como construyes diseños anidados: cada contenedor controla un nivel de la estructura. Consulta los diagramas de [contenedor e hijos](https://cdn.statically.io/gh/TheOdinProject/curriculum/b2a53579fcbec1cfde47646cc5a2b109cd7772cc/foundations/html_css/flexbox/imgs/03.png), [contenedores anidados](https://cdn.statically.io/gh/TheOdinProject/curriculum/495704c6eb6bf33bc927534f231533a82b27b2ac/html_css/v2/foundations/flexbox/imgs/04.png) y [composición completa](https://cdn.statically.io/gh/TheOdinProject/curriculum/1c08f76bfc94871a3e01bcc2488c82519335b5cd/foundations/html_css/flexbox/imgs/05.png).

## Experimenta

Abre el [primer ejemplo interactivo](https://codepen.io/TheOdinProjectExamples/pen/QWgNxrp). Activa las declaraciones flex retirando los delimitadores `/*` y `*/` que las comentan. Los comentarios CSS desactivan lo que encierran; su sintaxis es distinta de los comentarios HTML.

Cambia el ancho del resultado, añade un cuarto hijo y observa cómo se reparte el espacio. Desactiva `flex: 1` y compara: activar flexbox no obliga por sí solo a que todos los hijos tengan igual ancho. Si el panel es pequeño, abre el ejemplo completo en CodePen.

Usa DevTools para seleccionar primero el contenedor y después un hijo. Confirma dónde está cada propiedad antes de cambiarla. Volverás a estos ejemplos cuando conozcas crecimiento, ejes y alineación; no se espera memorizar todo antes de practicar.

## Comprobación

- ¿Qué diferencia hay entre contenedor flex y elemento flex?
- ¿Cómo conviertes un elemento en elemento flex?
- ¿Puede una misma caja cumplir ambos papeles?
- ¿Por qué un nieto no recibe automáticamente el mismo tratamiento que un hijo directo?

El original no añade otra tarea en esta introducción: realiza los experimentos y continúa con crecimiento y reducción.

## Un mismo elemento, dos responsabilidades

Imagina una fila de tarjetas y, dentro de cada tarjeta, un título y una fila de botones. El contenedor exterior decide cómo distribuir tarjetas. Cada tarjeta puede usar a su vez display flex para organizar sus hijos. La propiedad del padre no alcanza directamente a los botones como si fueran parte de la misma fila exterior. Debes identificar qué contenedor controla cada relación.

Selecciona una tarjeta en DevTools y revisa tanto sus propiedades como elemento flex como las que tiene de contenedor. Algunas decisiones, como grow, indican cómo la tarjeta participa en la fila exterior. Otras, como direction, indican cómo sus hijos se organizan dentro. Colocar una propiedad en el nivel equivocado puede no producir el efecto esperado aunque su sintaxis sea válida.

## Cambia una cosa a la vez

En el ejemplo interactivo, activa primero display flex y observa el resultado sin crecimiento adicional. Después activa flex en los hijos. Añade un cuarto elemento y reduce el ancho del panel. Anota qué cambió en posición y qué cambió en tamaño. Esa distinción prepara las siguientes lecciones: distribuir elementos y distribuir espacio no son exactamente la misma operación.

Si una caja parece desaparecer, inspecciona su tamaño y contenido. Si todas las cajas se apilan pese a display flex, revisa si realmente son hijas directas del contenedor seleccionado o si hay un contenedor intermedio. Los ejemplos pequeños permiten ver esa relación sin el ruido de una página completa. Mantén esa costumbre cuando construyas proyectos más grandes.

Al terminar, elimina contornos y mensajes temporales de depuración que no pertenezcan al componente final, conservando las notas sobre lo observado.
