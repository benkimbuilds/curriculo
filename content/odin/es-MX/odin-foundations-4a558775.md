# El modelo de caja

Colocar elementos exige entender qué espacio ocupa cada uno. Para el diseño, los elementos generan cajas rectangulares, incluso cuando su apariencia tiene esquinas redondas. Las cajas pueden contener otras cajas y distribuirse de varias formas. Saltarse este modelo para llegar rápido a JavaScript hace más difíciles los diseños posteriores.

Prueba temporalmente en DevTools:

```css
* { outline: 2px solid red; }
```

`outline` permite ver límites sin añadir espacio al cálculo como sí lo hace un borde. Observa los diagramas de [cajas anidadas](https://cdn.statically.io/gh/TheOdinProject/curriculum/c547923a86efaccb0fc71adf70fda2ea340b4cb1/foundations/html_css/css_foundations/the_box_model/imgs/boxes.png), [una página delineada](https://cdn.statically.io/gh/TheOdinProject/curriculum/c547923a86efaccb0fc71adf70fda2ea340b4cb1/foundations/html_css/css_foundations/the_box_model/imgs/odin-lined.png) y [las partes de la caja](https://cdn.statically.io/gh/TheOdinProject/curriculum/c547923a86efaccb0fc71adf70fda2ea340b4cb1/foundations/html_css/css_foundations/the_box_model/imgs/box-model.png).

## De adentro hacia afuera

El contenido está rodeado por **padding**, espacio interior antes del borde. **Border** es el borde y ocupa grosor. **Margin** es espacio exterior entre la caja y otras cajas. Para alejar texto de una línea que lo encierra, usa padding; para separar dos componentes, puede corresponder margin o, en ciertos diseños, gap.

```css
.card {
  width: 300px;
  padding: 20px;
  border: 2px solid black;
  margin: 24px;
}
```

Con `box-sizing: content-box`, el ancho declarado corresponde al contenido. La caja con borde mide 344px: 300 + 40 de padding + 4 de borde. El margen no forma parte de esos 344px. Con `box-sizing: border-box`, los 300px incluyen contenido, padding y borde; el área de contenido se reduce. Puedes aplicar el modelo alternativo con `* { box-sizing: border-box; }`; al estudiar pseudoelementos podrás incluirlos también.

## Márgenes y centrado

Los márgenes pueden ser negativos y hacer que cajas se acerquen o se superpongan; el padding no acepta valores negativos. En flujo normal algunos márgenes verticales se colapsan: dos márgenes adyacentes positivos pueden producir el mayor de los dos, no su suma. No asumas que todos los contextos funcionan así; flex y grid tienen reglas diferentes.

Un bloque con ancho menor que su contenedor puede centrarse con márgenes horizontales automáticos: `width: 300px; margin: 0 auto;`. Esto no es lo mismo que `text-align: center`, que alinea contenido en línea dentro de una caja.

## Actividad

1. Mira [el modelo de caja en ocho minutos](https://www.youtube.com/watch?v=rIO5326FgPE) y la explicación de [box-sizing: border-box](https://www.youtube.com/watch?v=HdZHcFWcAd8).
2. Lee [el modelo de caja en MDN](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model) y modifica los ejemplos. Todavía no necesitas memorizar todos los tipos internos y externos de display.
3. Lee la [referencia de margin](https://css-tricks.com/almanac/properties/m/margin/), especialmente `auto` y colapso de márgenes.
4. Construye dos tarjetas, predice sus dimensiones y compruébalas en DevTools. Cambia sólo `box-sizing` y vuelve a medir.

## Comprobación

- ¿Cuál es el orden contenido, padding, borde y margen?
- ¿Qué cambia entre content-box y border-box?
- ¿Qué usarías para separar contenido del borde, separar dos cajas o provocar superposición?
- ¿Cómo aplicas el modelo alternativo a todos los elementos?
- ¿Qué necesita un bloque para centrarse con `margin: auto`?
## Profundiza con el ejemplo

Una comprobación útil es fijar un borde visible y cambiar sólo padding. El contenido se separa del borde y puede cambiar el tamaño exterior según box-sizing. Luego restablece padding y cambia sólo margin: la separación ocurre fuera del borde. Mantener una variable por experimento permite atribuir el resultado a una propiedad concreta. El inspector muestra las cuatro capas y sus valores, así que úsalo para verificar la suma en vez de estimarla por apariencia. No confundas el contorno de depuración con el borde real de la caja.
