# Alineación en flexbox

No siempre quieres que los hijos crezcan para llenar el contenedor. A veces tienen un tamaño concreto y quieres distribuir el espacio restante entre ellos. La alineación se configura principalmente en el contenedor.

Abre el [ejemplo de alineación](https://codepen.io/TheOdinProjectExamples/pen/MWoyBzR). Primero predice y prueba qué ocurre al añadir `flex: 1` a `.item`: los elementos crecen. Retíralo y usa `justify-content: space-between` en `.container`. Ahora conservan sus tamaños y el espacio sobrante se coloca entre ellos, como muestra esta [referencia visual](https://cdn.statically.io/gh/TheOdinProject/curriculum/495704c6eb6bf33bc927534f231533a82b27b2ac/html_css/v2/foundations/flexbox/imgs/07.png).

## Dos propiedades, dos ejes

`justify-content` distribuye sobre el **eje principal**. `align-items` alinea sobre el **transversal**. Para centrar en ambos:

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 240px;
  gap: 8px;
}
```

Debe existir espacio disponible para observar el centrado. Una caja con la misma altura que sus hijos no ofrece espacio vertical que repartir. Compara con el [resultado centrado](https://cdn.statically.io/gh/TheOdinProject/curriculum/495704c6eb6bf33bc927534f231533a82b27b2ac/html_css/v2/foundations/flexbox/imgs/08.png).

En una fila normal, justify-content actúa horizontalmente y align-items verticalmente. En columna se invierten esas orientaciones visuales; las propiedades no cambiaron de responsabilidad. `space-between` deja espacio sólo entre elementos, mientras `space-around` asigna espacio alrededor de cada uno: los extremos suelen tener la mitad del espacio interior porque dos espacios contiguos se suman.

## Separación con gap

`gap: 8px` añade una separación entre elementos flex sin crear por sí mismo un margen exterior en los bordes del contenedor. Es útil para no tener que quitar el margen al primer o último hijo. Si además distribuyes espacio con `space-between`, la separación visible puede ser mayor que gap. Experimenta con el [ejemplo de gap](https://codepen.io/TheOdinProjectExamples/pen/qBjZyea).

## Actividad

1. Recorre la [guía interactiva de Josh Comeau](https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/) manipulando los ejemplos.
2. Revisa partes 1–3 y 5 de la [guía de CSS-Tricks](https://css-tricks.com/snippets/css/a-guide-to-flexbox/); deja las media queries para más adelante y guarda la referencia.
3. Completa [Flexbox Froggy](https://flexboxfroggy.com/).
4. En [foundations/flex](https://github.com/TheOdinProject/css-exercises/tree/main/foundations/flex), realiza en orden `01-flex-center`, `02-flex-header`, `03-flex-header-2`, `04-flex-information`, `05-flex-modal`, `06-flex-layout` y `07-flex-layout-2`. Lee cada README y usa DevTools cuando el resultado no coincida. Consulta `solution` después de intentar y explica cualquier diferencia.

## Comprobación

- ¿Qué diferencia hay entre justify-content y align-items?
- ¿Cómo centras por completo una caja dentro de un contenedor flex?
- ¿Qué cambia entre space-between y space-around?
- ¿Qué pasa al cambiar flex-direction a column?

Consulta también [alinear elementos flex en MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Aligning_Items_in_a_Flex_Container).

## Comprueba que exista espacio para distribuir

Si todos los elementos crecen hasta ocupar el ancho, justify-content puede parecer que no hace nada porque ya no queda espacio libre. Desactiva temporalmente el crecimiento y observa otra vez. De manera parecida, align-items center necesita una diferencia de tamaños sobre el eje transversal para producir un desplazamiento visible.

Prueba tres cajas pequeñas dentro de un contenedor alto y ancho. Aplica center en ambos ejes, cambia a space-between sólo en el principal y finalmente cambia direction a column. Predice cada resultado con flechas. Este ejercicio distingue las propiedades de alineación de los hábitos de pensar siempre en horizontal y vertical.

Agrega gap después y revisa el espacio en los extremos. Gap separa elementos, pero no crea padding alrededor del grupo. Si quieres que las cajas no toquen el borde del contenedor, añade padding a éste. Esa separación entre espacios interiores del contenedor y espacios entre hijos será útil en encabezados, modales y tarjetas.

Al completar los ejercicios, explica qué contenedor controla cada grupo y por qué elegiste margen, padding o gap para cada separación. Una captura correcta sin esa explicación no demuestra todavía que puedas reproducir el diseño.
