# Posicionamiento CSS

## Flujo normal y posición relativa

La mayor parte de una página debe distribuirse mediante el flujo normal, Flexbox y Grid. `position` resuelve casos específicos, como una etiqueta sobre una imagen o un encabezado que permanece visible durante el desplazamiento.

El valor predeterminado es `static`: el elemento participa en el flujo y los desplazamientos `top`, `right`, `bottom` y `left` no lo mueven. Con `relative`, el elemento conserva su lugar en el flujo, pero esos desplazamientos cambian dónde se pinta respecto a su posición normal. Los vecinos no se mueven para rellenar el espacio que deja visualmente.

## Posición absoluta

`absolute` saca al elemento del flujo normal. Sus vecinos se distribuyen como si no estuviera allí. Se posiciona respecto a su bloque contenedor; en el caso habitual, éste es el ancestro más cercano con una posición distinta de `static`. Por eso se suele emparejar un padre `relative` con un hijo `absolute`.

```css
.foto { position: relative; }
.foto img { display: block; width: 100%; }
.foto .credito {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: white;
  padding: .5rem;
}
```

Esto permite superponer una leyenda o un icono sin alterar el tamaño de la imagen. Prueba el [ejemplo de posición absoluta](https://codepen.io/TheOdinProjectExamples/pen/poWyWeJ). Quita `position: relative` del padre y observa qué ancestro se convierte en referencia. No construyas toda una página con coordenadas absolutas: al cambiar la longitud del texto o la pantalla, esas coordenadas suelen producir solapamientos.

## Posiciones fija y pegajosa

`fixed` también sale del flujo y normalmente se referencia al viewport. Una barra `position: fixed; top: 0` permanece allí al desplazarse. Debes reservar espacio para que no tape el contenido; ciertos ancestros transformados pueden modificar su bloque contenedor.

`sticky` mantiene su espacio en el flujo. Al cruzar un umbral, por ejemplo `top: 0`, se mantiene pegado dentro de los límites de su contenedor y del área de desplazamiento correspondiente. Es apropiado para encabezados de secciones. No es simplemente un `fixed` con otro nombre: deja de acompañar al usuario al terminar su contenedor. Experimenta con este [ejemplo sticky](https://codepen.io/theanam/pen/MPLBYy).

```css
.encabezado-seccion { position: sticky; top: 0; background: white; }
```

Si no funciona, revisa si declaraste un umbral, si existe suficiente recorrido vertical y si un ancestro con `overflow` crea otra área de desplazamiento.

## Actividad

Comprueba cada modo desplazando la página completa, no sólo mirando una captura estática.

1. Mira [Learn CSS Position](https://www.youtube.com/watch?v=jx5jmI0UlXU) de Web Dev Simplified; pausa para reproducir cada modo.
2. Lee [position en MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/position), incluidos los bloques contenedores y ejemplos.
3. Compara la explicación de [posiciones absoluta, relativa y fija](https://css-tricks.com/absolute-relative-fixed-positioining-how-do-they-differ/).
4. Lee [fixed frente a sticky](https://www.kevinpowell.co/article/positition-fixed-vs-sticky/) de Kevin Powell. Construye una página larga con dos secciones y verifica qué ocurre cuando termina el padre del encabezado sticky.

## Comprobación

- ¿Qué espacio conserva `relative` y qué pierde `absolute`?
- ¿Qué usos concretos justifican posición absoluta?
- ¿Qué diferencia a `fixed` de `sticky` al desplazarte y al terminar un contenedor?
