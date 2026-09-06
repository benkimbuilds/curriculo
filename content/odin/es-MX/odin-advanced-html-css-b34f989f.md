# Imágenes adaptables

## Conservar la proporción

La proporción relaciona ancho y alto de una imagen. Si reduces sólo el ancho y conservas una altura incompatible, la imagen se deforma. La solución habitual para una imagen que debe mostrarse completa es limitar el ancho y dejar la altura automática:

```css
img { max-width: 100%; height: auto; }
```

Puedes conservar atributos HTML `width` y `height` que describan sus dimensiones intrínsecas; ayudan al navegador a reservar la proporción. La regla CSS anterior adapta la caja sin obligar al contenido a mantener una altura visual fija.

## Cubrir o contener

Para fondos decorativos, `background-size` controla cómo se escala la imagen y `background-position`, qué zona queda visible. `cover` llena el contenedor preservando proporción y recortando lo que sobra. `contain` muestra la imagen completa, pero puede dejar espacio libre. `center` mantiene el centro como referencia del recorte. Estas propiedades no cambian directamente el contenido de un elemento `img`.

Prueba el [ejemplo de fondo adaptable](https://codepen.io/TheOdinProjectExamples/pen/powxJXV). Cambia la proporción del contenedor para ver qué parte desaparece al cubrirlo.

Para un `img`, utiliza `object-fit`. Su valor predeterminado, `fill`, puede deformar la imagen si fuerzas ancho y alto incompatibles. `cover` y `contain` preservan proporción con las mismas decisiones de recorte o espacio libre; `object-position` controla el punto de interés.

```css
.retrato { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; object-position: center 25%; }
```

Observa el [ejemplo object-fit](https://codepen.io/TheOdinProjectExamples/pen/NWgOGGX) al cambiar el ancho. Si el recorte elimina a la persona o un dato importante, no basta con decir que la imagen “cabe”.

## Archivos diferentes según necesidad

`srcset` ofrece versiones de la misma imagen para que el navegador elija un recurso adecuado según tamaño de representación y densidad. `sizes` describe cuánto espacio ocupará en la distribución cuando usas descriptores de ancho.

```html
<img src="equipo-800.jpg"
     srcset="equipo-400.jpg 400w, equipo-800.jpg 800w, equipo-1600.jpg 1600w"
     sizes="(min-width: 60rem) 50vw, 100vw"
     alt="Equipo presentando su proyecto">
```

Si necesitas cambiar el encuadre, no sólo la resolución, `picture` permite elegir fuentes según condiciones. Por ejemplo, una composición horizontal puede sustituirse por un recorte vertical en pantallas estrechas. El elemento `img` permanece como respaldo y proporciona el texto alternativo. Reducir visualmente una fotografía enorme con CSS no reduce los bytes descargados; elegir recursos adecuados también mejora la experiencia en conexiones limitadas.

## Actividad

Prueba el archivo seleccionado con caché desactivada durante la inspección y registra el ancho representado. El navegador puede conservar un recurso ya descargado más grande; cambiar el tamaño de la ventana no implica que siempre descargue uno menor de inmediato.

1. Revisa [`background-size`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size), [`background-position`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position) y [`object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit), manipulando sus demos.
2. Sigue [imágenes adaptables en MDN](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images), incluida la explicación de [por qué hacen falta](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#why_responsive_images).
3. Lee la [guía de sintaxis adaptable](https://css-tricks.com/a-guide-to-the-responsive-images-syntax-in-html/). Implementa un `srcset` y un caso de dirección artística con `picture`; inspecciona en Network cuál archivo descargó el navegador.

## Comprobación

- ¿Qué diferencia `object-fit` de `background-size`?
- ¿Cómo mantienes proporción al limitar tamaño o forzar una caja?
- ¿Por qué servir archivos distintos y cuándo usar `srcset` frente a `picture`?
