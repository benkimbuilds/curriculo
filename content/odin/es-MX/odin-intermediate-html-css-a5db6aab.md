# Más propiedades CSS

## Un catálogo para consultar

CSS tiene muchas propiedades, pero no necesitas recordarlas todas. Aprende qué problema resuelve cada una y consulta la sintaxis cuando la necesites. Esta lección reúne propiedades frecuentes para terminar la presentación de tus proyectos.

## Fondos

[`background`](https://developer.mozilla.org/en-US/docs/Web/CSS/background) agrupa varias propiedades: color, imagen, posición, tamaño, repetición, origen, recorte y comportamiento respecto al desplazamiento. Una imagen puede repetirse como mosaico, cubrir una caja o coexistir con otras capas. Las propiedades individuales suelen ser más claras cuando estás aprendiendo o cuando quieres cambiar sólo una parte:

```css
.portada {
  background-color: #edf3f7;
  background-image: url("./textura.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

La sintaxis formal del atajo parece complicada porque muchas partes son opcionales. No la memorices. Observa además que un nuevo `background` puede reiniciar valores que habías declarado por separado. Si la imagen es contenido informativo, utiliza HTML con texto alternativo; los fondos son apropiados para decoración.

## Bordes y esquinas

[`border`](https://developer.mozilla.org/en-US/docs/Web/CSS/border) combina grosor, estilo y color. [`border-radius`](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) redondea esquinas; puedes asignar radios distintos, aunque lo habitual es mantenerlos consistentes. Un elemento cuadrado con `border-radius: 50%` se ve circular. Si ancho y alto difieren, obtendrás una elipse.

```css
.tarjeta { border: 1px solid #bcc5cd; border-radius: .75rem; }
.avatar { width: 4rem; height: 4rem; border-radius: 50%; }
```

El borde no crea por sí mismo separación entre texto y línea. Para eso necesitas `padding`. Examina el modelo de caja para distinguir borde, espacio interno y margen exterior.

## Sombras

[`box-shadow`](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow) dibuja sombras alrededor de una caja. Sus valores controlan desplazamiento horizontal, vertical, desenfoque, expansión y color. Una sombra discreta puede distinguir una superficie elevada; una sombra oscura en todas las cajas puede producir ruido visual. No la confundas con `text-shadow`, que sigue los caracteres.

## Desbordamiento y transparencia

[`overflow`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow) decide qué ocurre cuando el contenido excede su caja. `auto` ofrece desplazamiento cuando hace falta; `hidden` lo recorta. Una tabla ancha puede necesitar un contenedor desplazable. Ocultar desbordamiento globalmente no repara un diseño: puede hacer desaparecer información.

[`opacity`](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity) controla la transparencia del elemento completo, incluidos sus descendientes. `0` lo vuelve invisible, pero no elimina automáticamente su espacio ni su interacción. Para transparentar sólo un fondo utiliza un color con canal alfa.

```css
.tabla-desplazable { overflow-x: auto; }
.tarjeta { box-shadow: 0 .25rem 1rem rgb(0 0 0 / .08); }
.decoracion { opacity: .4; }
```

## Actividad

Al combinar estas propiedades, revisa qué caja controla cada una. Un fondo puede extenderse bajo el borde, mientras que una sombra se dibuja por fuera sin reservar más espacio en el flujo. Si dos tarjetas casi se tocan, añadir sombra no sustituye la separación entre ellas. Ajusta primero distribución y relleno, y después los efectos visuales.

1. Abre las seis referencias enlazadas: fondo, borde, radio, sombra, desbordamiento y opacidad. Cambia un valor en cada ejemplo y predice el resultado antes de ejecutarlo.
2. Crea una tarjeta con una imagen, título y párrafo. Ajusta fondo, borde, relleno y sombra sin fijar su altura.
3. Agrega una palabra larga y una tabla ancha. Decide qué contenido debe ajustarse y qué contenido necesita desplazamiento.

## Comprobación

- ¿Qué propiedad vuelve transparente un elemento completo?
- ¿Cuál controla la repetición de una imagen de fondo?
- ¿Cómo agregas barras de desplazamiento cuando hacen falta?
- ¿Cómo diferencias una sombra de caja de una sombra de texto?
- ¿Qué condiciones necesitas para crear un círculo con `border-radius`?
