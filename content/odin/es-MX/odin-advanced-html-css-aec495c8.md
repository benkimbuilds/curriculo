# Transiciones

## De un estado a otro

Una transición interpola un cambio de valor a lo largo del tiempo. Por ejemplo, un botón puede pasar suavemente de un fondo claro a uno oscuro cuando recibe foco o el puntero. Necesitas un estado inicial, otro final y una propiedad que admita la transición apropiada. Observa el [ejemplo original](https://codepen.io/TheOdinProjectExamples/pen/eYGmYRm).

```css
button {
  background-color: white;
  color: black;
  transition-property: background-color, color;
  transition-duration: .2s;
  transition-timing-function: ease-out;
  transition-delay: 0s;
}
button:hover, button:focus-visible { background-color: black; color: white; }
```

`transition-property` indica qué cambia. `transition-duration` establece cuánto tarda. `transition-timing-function` define cómo evoluciona la velocidad: `ease-out` desacelera al final; `linear` mantiene un ritmo constante. `transition-delay` indica la espera previa. El atajo reúne estos valores; si aparecen dos tiempos, el primero es duración y el segundo retraso.

```css
button { transition: background-color .2s ease-out, color .2s ease-out; }
```

Colocar la transición en la regla base permite que se aplique tanto al entrar como al salir del estado. También puedes activarla al añadir o quitar una clase con JavaScript. Evita `transition: all` por comodidad: cuando después cambies tamaños o posición podrías animar propiedades que no pretendías.

## Propiedades animables y rendimiento

No todas las propiedades se interpolan de la misma manera. Algunas admiten valores intermedios continuos y otras cambios discretos; consulta [propiedades animadas](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties) antes de asumir un comportamiento. Para movimiento frecuente, `transform` y `opacity` suelen facilitar composición sin trabajo repetido de distribución. Cambiar `width`, por ejemplo, puede recalcular la geometría de elementos vecinos; cambiar color puede requerir pintura.

Los contextos de apilamiento agrupan cómo se superponen elementos sobre el eje Z. `z-index` se compara dentro del contexto correspondiente, no universalmente contra todos los elementos de la página. Transformaciones, opacidad y otras propiedades pueden crear nuevos contextos. Eso afecta tanto a superposición como a decisiones internas de capas; un contexto no implica por sí solo que toda la página se repinte. Mide el comportamiento real con las herramientas del navegador.

```css
.icono { transition: transform .2s ease-out; }
button:hover .icono { transform: translateX(.15rem); }
@media (prefers-reduced-motion: reduce) {
  .icono { transition: none; }
  button:hover .icono { transform: none; }
}
```

La respuesta visual debe ayudar a comprender una acción, no impedirla ni obligar a esperar. Conserva foco visible y respeta preferencias de movimiento reducido.

## Actividad

Para distinguir retraso de duración, configura primero una transición de un segundo sin espera. Después añade un retraso de un cuarto de segundo y repite la interacción. El tiempo total hasta llegar al estado final aumenta, pero el tramo que interpola sigue durando un segundo. Si el botón parece responder tarde, quizá el problema sea el retraso, no la curva temporal.

Compara también una transición declarada sólo en `:hover` con otra declarada en el estado base. En la primera, al retirar el puntero puede desaparecer la configuración de transición y producirse un regreso brusco. En la segunda, el navegador conserva la regla para ambos sentidos. Finalmente, activa y desactiva rápidamente el estado para observar interrupciones; una interfaz real recibe acciones antes de que termine cada efecto y debe seguir siendo comprensible.

1. Lee [usar transiciones CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions), incluidos los enlaces de [definir transiciones](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions#defining_transitions), y reproduce sus ejemplos.
2. Lee [contextos de apilamiento](https://www.joshwcomeau.com/css/stacking-contexts/). Si te resulta útil, explora la extensión [CSS Stacking Context Inspector](https://chromewebstore.google.com/detail/apjeljpachdcjkgnamgppgfkmddadcki?utm_source=item-share-cb), revisando sus permisos antes de instalarla.
3. Compara color y transformación en la [tabla de disparadores CSS](https://web.archive.org/web/20220727225220/https://csstriggers.com/). Es una referencia histórica; confirma tus resultados en el navegador actual.
4. Completa la [guía interactiva de transiciones](https://www.joshwcomeau.com/animation/css-transitions/) y estudia cómo [detectar repintados](https://dzhavat.github.io/2021/02/18/debugging-layout-repaint-issues-triggered-by-css-transition.html).

## Comprobación

- ¿Todas las propiedades se pueden animar de forma continua?
- ¿Cómo se corresponden las cuatro propiedades largas con [`transition`](https://developer.mozilla.org/en-US/docs/Web/CSS/transition)?
- ¿Qué es un contexto de apilamiento y por qué un `z-index` enorme puede no resolver un solapamiento?
- ¿Por qué debes observar repintados y no asumir que cualquier animación CSS es barata?
