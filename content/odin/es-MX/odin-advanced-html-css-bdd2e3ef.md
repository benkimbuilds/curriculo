# Transformaciones

## Transformar sin redistribuir

`transform` modifica cómo se dibuja una caja sin cambiar su espacio en el flujo normal. Puedes moverla, girarla, inclinarla o escalarla; los elementos vecinos no se redistribuyen alrededor de su nueva apariencia. Por eso es útil para pequeños efectos visuales, pero no reemplaza Grid, Flexbox o márgenes cuando necesitas cambiar la distribución real.

La propiedad acepta una o más [funciones de transformación](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/transform-function). No se aplica de la misma manera a todos los elementos: un elemento en línea no reemplazado, como un `span` normal, no es transformable hasta cambiar, por ejemplo, a `inline-block`. Elementos reemplazados como imágenes contienen recursos externos; `col` y `colgroup` también tienen restricciones. Si no observas un efecto, revisa el tipo de caja antes de añadir más reglas.

## Cuatro operaciones bidimensionales

`rotate()` gira con un ángulo, como `15deg` o `.25turn`. `scale()` cambia proporciones: uno conserva el tamaño, dos lo duplica y `.5` lo reduce a la mitad. Puedes controlar ejes con `scaleX()` y `scaleY()`. `skew()`, `skewX()` y `skewY()` inclinan los ejes usando ángulos. `translate()` desplaza; sus variantes por eje son `translateX()` y `translateY()`.

```css
.giro { transform: rotate(15deg); }
.escala { transform: scale(1.2, .8); }
.inclinada { transform: skewX(12deg); }
.movida { transform: translate(2rem, -1rem); }
```

Cada regla anterior corresponde a un elemento distinto. Escribir varias declaraciones `transform` sobre el mismo elemento no las acumula: la declaración ganadora sustituye a las demás. Observa y modifica las demostraciones originales de [giro](https://codepen.io/TheOdinProjectExamples/pen/GRMgKeE), [escala](https://codepen.io/TheOdinProjectExamples/pen/XWeJrGL), [inclinación](https://codepen.io/TheOdinProjectExamples/pen/mdBybgm) y [traslación](https://codepen.io/TheOdinProjectExamples/pen/PoJwYrO).

## Encadenar y ordenar

Para combinar operaciones, escríbelas en una misma declaración separadas por espacios. El orden cambia el resultado porque cada operación modifica el sistema de coordenadas de la composición.

```css
.roja { transform: rotate(45deg) translateX(200%); }
.azul { transform: translateX(200%) rotate(45deg); }
```

Si ambas cajas parten del mismo punto, la roja termina desplazada sobre un eje girado y la azul se desplaza horizontalmente y queda girada. El porcentaje de traslación se refiere a la caja transformada, no al ancho del padre. Predice y después abre el [ejemplo de encadenamiento](https://codepen.io/TheOdinProjectExamples/pen/XWeJWWr). Mueve el origen con `transform-origin` para investigar por qué un giro alrededor del centro difiere de uno alrededor de una esquina.

## Profundidad y perspectiva

En tres dimensiones aparecen los ejes X, Y y Z. `rotateX()`, `rotateY()` y `rotateZ()` giran alrededor de cada eje; `rotate3d()` recibe un vector de eje y un ángulo. `translateZ()` y `translate3d()` desplazan en profundidad; `scaleZ()` y `scale3d()` escalan también ese eje.

Una transformación sobre Z puede resultar imperceptible sin perspectiva. `perspective()` representa la distancia del observador al plano Z=0. Un valor menor exagera la sensación de profundidad. En los ejemplos, colócala a la izquierda de la transformación que quieres proyectar; cambiar su orden cambia la composición.

```css
.tarjeta { transform: perspective(700px) rotateY(25deg) translateZ(30px); }
```

Experimenta con [giros 3D](https://codepen.io/TheOdinProjectExamples/pen/PoJwozR) y [traslación Z](https://codepen.io/TheOdinProjectExamples/pen/MWEYWpN). Compara los cubos de MDN para [`scaleZ`](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scaleZ()) y [`scale3d`](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale3d()). No necesitas dominar geometría 3D para terminar el curso; reconoce cuándo estas funciones aportan algo útil.

`matrix()` y `matrix3d()` expresan combinaciones como matrices. Suelen aparecer en valores calculados o generados por herramientas, pero rara vez conviene escribirlas a mano porque esconden la intención de operaciones como girar o trasladar.

## Rendimiento

El navegador calcula estilos, distribución, pintura y composición. Transformaciones y opacidad a menudo pueden resolverse en composición sin recalcular toda la distribución, lo que las hace buenas candidatas para movimiento. Eso depende de la página y sus capas: no es una garantía automática de velocidad. Lee [la cadena de renderizado](https://developers.google.com/web/fundamentals/performance/rendering/#the_pixel_pipeline) y consulta esta [tabla histórica de disparadores CSS](https://web.archive.org/web/20220727225220/https://csstriggers.com/). Una [GPU](https://en.wikipedia.org/wiki/Graphics_processing_unit) puede acelerar composición; no necesitas conocer su funcionamiento interno para medir el resultado.

## Comparar operaciones en una misma caja

Usa una caja cuadrada con borde y coloca otra caja después en el flujo normal. Aplica `scale(2)` a la primera. Verás que su dibujo puede cubrir parte de la segunda, pero el espacio reservado no se duplica. Quita la escala y cambia realmente su ancho: ahora los vecinos sí responden a la geometría de distribución. Esta comparación explica por qué una transformación sirve para un efecto visual, pero no para hacer espacio a texto adicional.

Con `translateX(100%)`, desplaza la caja una distancia equivalente a su propia anchura de referencia. Cambia el ancho del padre sin cambiar el de la caja y observa la diferencia respecto a un porcentaje aplicado a `left`. Cuando una animación parece moverse demasiado, revisar cuál es la referencia del porcentaje suele ser más útil que ajustar números sin explicación.

En las operaciones tridimensionales, imagina tres ejes que atraviesan el elemento. Girar sobre X inclina su parte superior e inferior hacia o lejos del observador; girar sobre Y hace algo parecido con los lados; girar sobre Z se parece a una rotación plana. El efecto de perspectiva permite percibir que unas partes parecen más cercanas que otras. Prueba dos distancias de perspectiva y compara cuánto se exagera esa diferencia.

No necesitas escribir matrices para demostrar comprensión. Si DevTools muestra una matriz como valor calculado, recuerda que el navegador puede representar internamente una secuencia legible mediante esa forma matemática. Conserva en tu hoja las funciones que comunican la intención. Cuando combines transformaciones, cambia una sola operación o su orden y predice la nueva posición antes de mirar el resultado. Ese hábito hace visible qué parte de la composición produce cada efecto.

## Actividad

1. Prueba [`rotate3d` en MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate3d()) y lee la [explicación de QHMIT](https://www.qhmit.com/css/functions/css_rotate3d_function.cfm).
2. Estudia [perspectiva en CSS](https://3dtransforms.desandro.com/perspective).
3. Reproduce la [demostración translate3d](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate3d()).
4. Completa [The World of CSS Transforms](https://www.joshwcomeau.com/css/transforms/) y anota un caso donde cambiar el orden altera la posición final.

## Comprobación

- ¿Cuáles son las cuatro operaciones principales?
- ¿Cuál mueve por X, Y o Z y cuál cambia el tamaño?
- ¿Para qué sirve perspectiva en una escena tridimensional?
- ¿Por qué una transformación no debe usarse para reservar espacio entre párrafos?
