# Introducción al diseño adaptable

## Qué significa responsive

El diseño web adaptable, o *responsive design*, reúne técnicas para que una página responda al espacio disponible y siga siendo útil en distintos tamaños de pantalla. Estas lecciones se enfocan en cómo implementar esa respuesta, no en enseñar por completo composición visual, identidad o investigación de experiencia de usuario.

Una página de texto sencillo suele adaptarse naturalmente: sus líneas se ajustan al ancho. Los problemas aparecen cuando añadimos imágenes demasiado grandes, columnas rígidas, alturas que recortan texto o controles que no caben. Por eso ya tienes parte de las herramientas: Flexbox, Grid, tamaños relativos y límites flexibles.

Hay dos estrategias que se complementan. La primera conserva una distribución flexible dentro de un rango: las tarjetas crecen o cambian de fila. La segunda cambia la distribución al llegar a una condición: una barra lateral puede pasar arriba del contenido. En proyectos reales normalmente necesitarás ambas.

## Tamaños que debes probar

Un ancho de 320 píxeles CSS es un punto de partida útil para pruebas estrechas, pero no garantiza compatibilidad con cualquier dispositivo o configuración. El zoom y los ajustes de texto también reducen espacio efectivo. En el extremo contrario, una pantalla muy ancha no debería producir líneas de texto interminables.

```css
.contenido {
  width: min(100% - 2rem, 72rem);
  margin-inline: auto;
}
```

El contenido conserva margen en pantallas pequeñas y deja de crecer en grandes. Revisa todos los anchos intermedios: que funcione exactamente a 390 y 1440 no demuestra que funcione a 850.

## Actividad

1. Sigue la [guía para simular pantallas móviles en Chrome](https://developer.chrome.com/docs/devtools/device-mode/).
2. Abre un proyecto anterior y reduce lentamente su ancho. Anota el primer elemento que desborda o pierde legibilidad.
3. Repite con zoom y texto más largo. Distingue qué puede arreglarse con flexibilidad natural y qué necesita cambiar de distribución.

## Comprobación

Comprueba también orientación horizontal: el ancho aumenta, pero queda menos altura visible para navegación y formularios.

- ¿Qué es diseño adaptable y qué dos estrategias principales lo implementan?
- ¿Por qué probar sólo un teléfono y una pantalla de escritorio deja casos sin verificar?
