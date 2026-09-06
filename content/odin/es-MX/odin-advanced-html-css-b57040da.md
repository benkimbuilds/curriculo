# Animaciones con fotogramas clave

## Elegir animación o transición

Una transición responde al cambio entre estados. Una animación con `@keyframes` define una secuencia temporal, puede empezar al aplicarse la regla, repetir ciclos y cambiar de dirección. Si sólo cambias el color de un botón al enfocarlo, una transición es suficiente. Si necesitas varios puntos intermedios o una repetición controlada, una animación expresa mejor la secuencia.

No uses movimiento continuo sólo porque sea posible. Puede distraer, consumir recursos o producir malestar. Debe existir una razón para el efecto y una alternativa cuando se prefiera movimiento reducido.

## Configurar una secuencia

```css
.circulo {
  animation-name: cambiar-color;
  animation-duration: 2s;
  animation-iteration-count: 2;
  animation-direction: alternate;
}
@keyframes cambiar-color {
  from { background-color: #a32c27; }
  to { background-color: #276342; }
}
```

`animation-name` enlaza con el nombre de `@keyframes`. `animation-duration` mide un ciclo. `animation-iteration-count` establece cuántos ciclos ocurren, o `infinite` para repetir indefinidamente. `animation-direction: alternate` recorre uno hacia adelante y el siguiente hacia atrás. En el ejemplo, tarda dos segundos en pasar al verde y otros dos en volver al rojo. Ida y vuelta son dos iteraciones, no una.

Observa la [demostración con propiedades largas](https://codepen.io/TheOdinProjectExamples/pen/jOGENZz). Cambia `infinite` por un número para poder identificar cuándo termina. Después prueba `normal`, `reverse`, `alternate` y `alternate-reverse` y describe el primer ciclo.

## Puntos intermedios

`from` equivale a `0%` y `to`, a `100%`. Los puntos intermedios siempre se expresan como porcentajes de la duración del ciclo. En una animación de dos segundos, `50%` ocurre al segundo.

```css
.circulo {
  background: #a32c27;
  animation: cambiar-color 2s ease-in-out 2 alternate;
}
@keyframes cambiar-color {
  0% { background-color: #a32c27; transform: scale(1); }
  50% { background-color: #275ca3; transform: scale(1.2); }
  100% { background-color: #276342; transform: scale(1); }
}
```

El atajo combina nombre, duración, curva temporal, cantidad y dirección. También existen retraso, modo de relleno y estado de reproducción. `animation-fill-mode` controla si se aplican estilos de los fotogramas fuera del intervalo activo; no cambia permanentemente tu hoja de estilos. `animation-play-state: paused` permite pausar una secuencia. Consulta la [referencia animation](https://developer.mozilla.org/en-US/docs/Web/CSS/animation) para el orden y valores completos.

Compara el [ejemplo abreviado con punto intermedio](https://codepen.io/TheOdinProjectExamples/pen/zYExOLQ). Cambia un porcentaje sin alterar duración y observa que no todos los segmentos consumen el mismo tiempo.

```css
@media (prefers-reduced-motion: reduce) {
  .circulo { animation: none; }
}
```

Asegúrate de que el estado sin animación sea visible y comprensible. No uses una animación para hacer aparecer información que nunca existe si el movimiento se desactiva.

## Leer la línea temporal

Para seguir el ejemplo sin perderte en efectos, elimina primero el cambio de escala y deja sólo color. Pon una duración de cuatro segundos y una sola iteración. El estado de `0%` aparece al comenzar, el de `50%` corresponde a dos segundos y el de `100%` al final de los cuatro. Cambia el punto intermedio a `25%`: el primer cambio ahora ocupa un segundo y el resto de la secuencia, tres. Los porcentajes describen posiciones temporales, no porcentajes del tamaño del elemento.

Añade después `alternate` y dos iteraciones. El segundo ciclo recorre la misma secuencia en sentido contrario. La duración declarada sigue correspondiendo a cada ciclo; no se divide automáticamente entre ambos. Si cambias la cantidad a tres, el tercero vuelve a avanzar. Escribe la secuencia esperada de colores antes de ejecutarla para comprobar que no estás contando ida y vuelta como una sola iteración.

Ahora incorpora la escala únicamente en el punto intermedio y observa cómo el navegador interpola entre estados. Definir explícitamente la escala de los extremos puede hacer más clara tu intención y evitar que dependas sin darte cuenta de otro valor de la regla base. Si cambias una propiedad que no admite la interpolación esperada, consulta su comportamiento antes de concluir que `@keyframes` está roto.

El nombre de la animación es un identificador elegido por ti. Debe coincidir exactamente entre la regla del elemento y `@keyframes`; un error tipográfico puede dejar una animación configurada sin secuencia correspondiente. Para depurar, verifica primero nombre y duración, luego cantidad y dirección, y por último los fotogramas. Esa secuencia permite aislar una causa sin reescribir toda la animación.

## Actividad

1. Programa junto con [usar animaciones CSS en MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations), especialmente [definir la secuencia](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations#defining_the_animation_sequence_using_keyframes).
2. Lee la [referencia @keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes).
3. Completa la [guía interactiva de fotogramas clave](https://www.joshwcomeau.com/animation/keyframe-animations/).
4. Resuelve, en orden, `01-button-hover`, `02-pop-up` y `03-dropdown-menu` del [directorio de ejercicios de animación](https://github.com/TheOdinProject/css-exercises/tree/main/advanced-html-css/animation). Sigue cada README y prueba teclado además del puntero.

## Comprobación

Comprueba tus respuestas con una animación de duración conocida y una cantidad finita de ciclos.

- ¿Cómo escribes una animación con propiedades largas y con el atajo?
- ¿Cómo agregas un fotograma intermedio y cómo calculas cuándo ocurre?
- ¿Cuándo escogerías una transición y cuándo una animación?
