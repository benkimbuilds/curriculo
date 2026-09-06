# Ejes de flexbox

Todo contenedor flex tiene un **eje principal** y un **eje transversal**. `flex-direction` determina cuál es el principal. En la escritura horizontal de español, `row` normalmente coloca el eje principal de izquierda a derecha; `column` lo coloca de arriba hacia abajo. No memorices «flex siempre es horizontal»: la dirección puede cambiar.

```css
.flex-container {
  display: flex;
  flex-direction: column;
}
```

El valor predeterminado es `row`. En `column`, los hijos se distribuyen verticalmente. Las propiedades que actúan sobre el eje principal siguen actuando sobre ese eje, aunque ahora sea vertical. El idioma y el modo de escritura también pueden afectar dirección; por ahora trabaja con escritura horizontal, pero conserva el concepto de ejes.

## La base depende del eje

En una fila, `flex-basis` se relaciona con el ancho; en una columna, con el alto. Abre el [ejemplo de dirección](https://codepen.io/TheOdinProjectExamples/pen/BaZKPdw), activa `flex-direction: column` y compara `flex: 1 1 auto` con `flex: 1`.

Con base automática se toma en cuenta el alto declarado de los elementos. Con una base cero, los cálculos parten de otra situación; si los hijos están vacíos y el contenedor no tiene una altura definida que repartir, pueden colapsar en los escenarios del ejemplo. El caso exacto de `0%` frente a `0` también depende de si el tamaño del contenedor está definido, así que comprueba los valores calculados.

Puedes conservar el tamaño base mediante `flex: 1 1 auto`, cambiar sólo `flex-grow: 1` o definir una altura apropiada en el contenedor cuando realmente haga falta. No añadas alturas arbitrarias a toda la página para esconder un problema de comprensión.

## Actividad

1. Lee la [referencia de flex-direction](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/flex-direction) y prueba sus ejemplos.
2. Dibuja flechas principal y transversal sobre una fila de tres cajas. Cambia a columna y vuelve a dibujarlas.
3. Da dimensiones a los hijos, cambia su base y observa qué dimensión se usa. Repite con contenido dentro para diferenciar una caja vacía de una que tiene tamaño mínimo por su texto.

## Comprobación

- ¿Cómo organizas elementos verticalmente?
- ¿A qué dimensión se refiere la base en una columna y en una fila?
- ¿Por qué cambian esas respuestas si la propiedad se llama igual?
- ¿Qué revisarías si los hijos desaparecen al cambiar de fila a columna?
## Profundiza con el ejemplo

Cuando una alineación parezca cambiar sin motivo, dibuja primero ambos ejes. Después identifica si la propiedad se aplica al contenedor o al hijo. Esa revisión evita intentar corregir un problema de dirección cambiando márgenes al azar. Una fila y una columna pueden usar las mismas palabras de CSS y producir movimientos visuales distintos porque el sistema de referencia cambió.

Comprueba siempre el tamaño calculado del contenedor antes de interpretar cuánto espacio pueden repartir sus hijos.
