# Trabaja con texto en HTML

Escribir dos bloques separados por una línea vacía en el archivo no crea necesariamente dos párrafos visibles. En el flujo normal, el navegador colapsa espacios y saltos de línea. Compara el [ejemplo sin párrafos](https://codepen.io/TheOdinProjectExamples/pen/xxrKqeV) con el [ejemplo que usa párrafos](https://codepen.io/TheOdinProjectExamples/pen/mdwbmdp). Para expresar dos párrafos, usa dos elementos `p`.

## Encabezados e importancia

Hay seis niveles de encabezado, `h1` a `h6`. El número expresa jerarquía, no un tamaño que debas elegir por apariencia. Usa `h1` para el asunto general de la página, `h2` para secciones y `h3` para subsecciones. Mira el [ejemplo de niveles](https://codepen.io/TheOdinProjectExamples/pen/LYLPLbg).

`strong` comunica importancia y suele mostrarse en negritas; `em` comunica énfasis y suele mostrarse en cursivas. Su significado puede ser usado por tecnologías de asistencia, aunque la forma exacta de anunciarlo depende de ellas. Para cambiar sólo la apariencia utilizarás CSS. Consulta los ejemplos de [strong aislado](https://codepen.io/TheOdinProjectExamples/pen/qBjWXrB), [strong dentro de un párrafo](https://codepen.io/TheOdinProjectExamples/pen/wvewqJr), [em aislado](https://codepen.io/TheOdinProjectExamples/pen/wvewqpp) y [em dentro de un párrafo](https://codepen.io/TheOdinProjectExamples/pen/VwWZzyj).

```html
<body>
  <h1>Aprender en comunidad</h1>
  <p>Hoy escribí mi <strong>primer documento HTML</strong>.</p>
  <h2>Una dificultad</h2>
  <p>Tuve que <em>guardar el archivo</em> antes de actualizar.</p>
  <!-- Este comentario explica una decisión para quien lea el código. -->
</body>
```

## Relaciones e indentación

Un elemento que contiene a otro es su padre; el contenido es su hijo. Dos elementos con el mismo padre son hermanos. En el ejemplo, `body` es padre de los encabezados y párrafos; `strong` es hijo del primer párrafo, no hermano de éste. Los ejemplos de [padre e hijo](https://codepen.io/TheOdinProjectExamples/pen/oNwjEvO) y [hermanos](https://codepen.io/TheOdinProjectExamples/pen/ZEybrYx) ayudan a ver la diferencia.

Indenta cada nivel de forma consistente —dos espacios en estos ejemplos— para que las relaciones sean legibles. La indentación no crea la relación; las etiquetas sí. Cierra primero el elemento más interior y después el exterior.

Los comentarios se escriben entre `<!--` y `-->`. No aparecen como texto visible, pero cualquiera puede verlos al consultar el código: no guardes secretos allí. Revisa el [ejemplo de comentarios](https://codepen.io/TheOdinProjectExamples/pen/abwoyBg). VS Code suele alternar comentarios con Ctrl+/ o Cmd+/; en un teclado distinto consulta el comando desde la paleta.

## Actividad

1. Mira [Párrafos y encabezados](https://www.youtube.com/watch?v=yqcd-XkxZNM&t=35s) y [negritas y cursivas](https://www.youtube.com/watch?v=gW6cBZLUk6M&t=5s), de Kevin Powell.
2. Construye una página de artículo con título, subsecciones, varios párrafos y usos justificados de `strong` y `em`.
3. Si necesitas texto provisional, usa [Lorem Ipsum](https://en.wikipedia.org/wiki/Lorem_ipsum); VS Code lo genera escribiendo `lorem` y aceptando la sugerencia. Sustitúyelo cuando necesites comprobar el contenido real.

## Comprobación

- ¿Cómo creas párrafos y encabezados, y cuántos niveles existen?
- ¿Cuándo corresponden `strong` y `em`?
- ¿Qué diferencia hay entre padre, hijo y hermano?
- ¿Cómo escribes un comentario y quién puede verlo?
## Profundiza con el ejemplo

## Reconstruye los ejemplos de texto

Empieza con dos frases separadas por varias líneas vacías dentro de body, sin elementos p. Guarda y abre: en el flujo normal verás que el espacio del código no se convierte en la separación visual que imaginabas. Después envuelve cada frase en su propio párrafo. El contenido es el mismo, pero ahora el documento expresa dos unidades distintas. No añadas muchos br para simular párrafos; el elemento correcto comunica la estructura además del salto visible.

Repite el experimento con encabezados. Escribe h1, h2 y h3 con textos que indiquen asunto, sección y subsección. Imagina que el artículo crece y necesita otra sección del mismo nivel: corresponde otro h2, no continuar automáticamente con h4. El número no cuenta cuántos encabezados hay, sino la profundidad de cada uno en el esquema.

Coloca strong primero como contenido independiente y después dentro de un párrafo. En ambos casos marca importancia, pero dentro de la frase permite enfatizar sólo la parte relevante. Haz lo mismo con em. Una frase como «Debes guardar antes de cerrar» podría marcar guardar como énfasis si quieres contrastarlo con otra acción; una advertencia importante puede usar strong. No apliques ambos a cada palabra: si todo tiene énfasis, la distinción pierde utilidad.

## Lee las relaciones del árbol

Escribe dos párrafos como hijos de body. Ahora son hermanos. Dentro del primero coloca strong; ese strong es hijo del párrafo y descendiente de body. No es hermano del segundo párrafo porque no comparten el mismo padre inmediato. Esta diferencia resultará necesaria cuando escribas selectores CSS o recorras el DOM con JavaScript.

Puedes pensar en las etiquetas como límites de grupos. Si abres p, después em y finalmente strong, tienes que cerrar strong antes de em y em antes de p. Cruzar los cierres crea un documento mal anidado. La indentación ayuda a observar esos grupos, pero un archivo perfectamente indentado también puede tener un cierre incorrecto; revisa ambas cosas.

Dos espacios por nivel son la convención de los ejemplos. En tu proyecto puedes usar la convención acordada, siempre de forma consistente. Si al mover un fragmento la indentación parece saltar varios niveles, verifica si falta o sobra un contenedor. El formato puede servir como pista para detectar errores de estructura.

## Comentarios y texto provisional

Añade un comentario que explique una decisión no evidente, por ejemplo que una sección está reservada para proyectos futuros. Comprueba que no se muestra como texto en la página y después búscalo al ver el código fuente. Esa segunda observación demuestra por qué un comentario no protege información privada. Es documentación para quien lee el archivo, no un lugar oculto.

Para la página de artículo puedes generar Lorem Ipsum mientras decides estructura, pero no lo uses para evaluar si tu redacción real cabe o se entiende. Una frase corta de relleno puede ocultar problemas que aparecerán con títulos largos. Antes de dar por terminada la práctica, sustituye al menos una sección por texto propio y comprueba que la jerarquía siga teniendo sentido.

Antes de terminar, lee el artículo sin mirar los estilos predeterminados. Explica dónde empieza cada sección y qué relación tiene con la anterior. Si necesitas decir «éste es un título porque se ve grande», vuelve al marcado y justifica su nivel por el contenido, no por su tamaño.

Comprueba también que cada etiqueta de cierre corresponda al elemento que abriste y que los grupos no se crucen.
