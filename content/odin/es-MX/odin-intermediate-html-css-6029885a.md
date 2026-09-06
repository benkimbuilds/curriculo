# Fundamentos de formularios

## Formularios como interfaz de entrada

Los formularios conectan las decisiones de una persona con los datos de una aplicación. Elegir el control apropiado reduce trabajo y errores: no es igual escribir una fecha libremente que seleccionarla, ni escoger una opción entre tres que buscarla en un menú con cientos de elementos.

`form` agrupa controles y define cómo enviar sus datos. `action` indica el destino; `method`, el [método HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods). `get` suele usarse para consultar, como en un buscador, y coloca los datos en la URL. `post` envía datos en el cuerpo de la solicitud y suele usarse para crear o modificar información. POST no cifra datos por sí mismo: en producción necesitas HTTPS. Más adelante conectarás un servidor; ahora aprenderás a producir un envío comprensible.

```html
<form action="https://httpbin.org/post" method="post">
  <label for="nombre">Nombre</label>
  <input type="text" id="nombre" name="nombre" autocomplete="given-name">
  <button type="submit">Enviar prueba</button>
</form>
```

Usa únicamente información ficticia con servicios de demostración externos como [httpbin](http://httpbin.org/). No envíes contraseñas ni datos personales reales para practicar.

## Etiquetas, identificadores y nombres

`input` es un control versátil. Su atributo `type` define la clase de dato y parte de la interfaz. `type="text"` recibe texto de una línea. Un campo sin etiqueta obliga a adivinar qué introducir. `label` aporta un nombre visible y una asociación programática: su `for` debe coincidir exactamente con el `id` del control. Al pulsar la etiqueta se enfoca el campo, lo que amplía también el área de interacción.

`placeholder` muestra un ejemplo dentro del campo vacío, como `nombre@ejemplo.com`. Desaparece cuando escribes y suele tener poco contraste: úsalo para un ejemplo secundario, nunca como sustituto de la etiqueta ni para instrucciones que deban seguir visibles.

`name` identifica la clave enviada al servidor; `id` identifica el elemento dentro del documento. No cumplen la misma función. Un control sin `name` normalmente no participa en los datos enviados. Cambia y elimina nombres en el [ejemplo de envío](https://codepen.io/TheOdinProjectExamples/pen/dyVRMbq) y observa el objeto `form` de la respuesta.

```json
{ "nombre": "Persona de prueba", "edad": "33" }
```

Los valores enviados por un formulario suelen ser cadenas, incluso cuando parecen números. El servidor debe interpretarlos y validarlos. También puedes usar controles fuera de un `form`, por ejemplo para que JavaScript filtre una lista. Observa el [ejemplo de controles independientes](https://codepen.io/TheOdinProjectExamples/pen/PoJjNYr).

## Tipos frecuentes

`email` facilita un teclado móvil con `@` y comprueba un formato básico; no confirma que el buzón exista. `password` oculta visualmente los caracteres, pero no los cifra ni evita que el programa los reciba. `number` representa una cantidad y ofrece controles numéricos según el navegador. No lo uses para teléfonos, códigos postales o identificadores: esos datos pueden tener ceros iniciales y no se suman. `date` ofrece una entrada de fecha, a menudo con calendario; su presentación depende del navegador.

```html
<label for="correo">Correo</label>
<input id="correo" name="correo" type="email" autocomplete="email"
       placeholder="nombre@ejemplo.com">
<label for="clave">Contraseña de prueba</label>
<input id="clave" name="clave" type="password" autocomplete="new-password">
<label for="cantidad">Cantidad de lugares</label>
<input id="cantidad" name="cantidad" type="number" min="1" max="5">
<label for="fecha">Fecha de visita</label>
<input id="fecha" name="fecha" type="date">
```

`textarea` recibe varias líneas y sí tiene etiqueta de cierre. Su contenido inicial se coloca entre etiquetas, no en `value`. `rows` y `cols` sugieren dimensiones iniciales; CSS puede adaptarlas. No impidas ampliar el área si escribir más contenido lo requiere.

```html
<label for="comentario">Comentario</label>
<textarea id="comentario" name="comentario" rows="5" cols="40">Texto inicial</textarea>
```

## Seleccionar entre opciones

`select` contiene elementos `option`. El texto es lo que ve la persona; `value` es lo que se envía. Sin `value`, se usa el texto. `selected` indica la opción inicial. `optgroup` reúne opciones bajo una etiqueta, útil en listas extensas.

```html
<label for="taller">Taller</label>
<select id="taller" name="taller">
  <optgroup label="Interfaz">
    <option value="html" selected>HTML</option>
    <option value="css">CSS</option>
  </optgroup>
  <optgroup label="Programación">
    <option value="js">JavaScript</option>
  </optgroup>
</select>
```

Cuando hay pocas opciones y sólo una puede elegirse, los botones de radio permiten verlas todas. Deben compartir `name` para formar un grupo exclusivo y tener `id` distintos. `checked` indica una selección inicial; no lo confundas con `selected`, que corresponde a `option`.

```html
<fieldset>
  <legend>Turno de práctica</legend>
  <input type="radio" id="manana" name="turno" value="manana" checked>
  <label for="manana">Mañana</label>
  <input type="radio" id="tarde" name="turno" value="tarde">
  <label for="tarde">Tarde</label>
</fieldset>
```

Los controles `checkbox` son independientes: permiten elegir varias opciones o activar una decisión sí/no. Una casilla no marcada no suele enviar un par nombre/valor; el servidor debe considerar esa ausencia. Si varias casillas comparten nombre, puede haber varios valores para esa clave.

```html
<fieldset>
  <legend>Temas de interés</legend>
  <input type="checkbox" id="tema-html" name="temas" value="html">
  <label for="tema-html">HTML</label>
  <input type="checkbox" id="tema-css" name="temas" value="css">
  <label for="tema-css">CSS</label>
</fieldset>
<input type="checkbox" id="recordatorio" name="recordatorio" value="si">
<label for="recordatorio">Quiero un recordatorio del taller</label>
```

## Botones y agrupación

`button` admite texto y otros contenidos apropiados entre sus etiquetas. `type="submit"` envía el formulario y es el comportamiento habitual predeterminado dentro de él. `type="reset"` restaura los valores iniciales: no necesariamente deja todo vacío. Puede borrar trabajo accidentalmente, por lo que rara vez mejora un formulario real. `type="button"` no envía ni reinicia; sirve para acciones controladas con JavaScript.

```html
<button type="submit">Solicitar lugar</button>
<button type="button">Mostrar ayuda</button>
<button type="reset">Restaurar datos iniciales</button>
```

Declara el tipo explícitamente, especialmente en botones auxiliares. Un botón “Mostrar contraseña” sin tipo podría enviar el formulario por accidente.

`fieldset` agrupa controles relacionados y `legend`, situado al principio, nombra el grupo. Puedes separar datos de contacto de datos de entrega o agrupar radios bajo una pregunta. Esto ofrece una relación semántica, además del borde que algunos navegadores dibujan.

## Estilos y límites

Los controles tienen estilos nativos distintos según sistema y navegador. Los de texto suelen aceptar CSS de manera sencilla. Radios y casillas requieren más cuidado; [`accent-color`](https://developer.mozilla.org/en-US/docs/Web/CSS/accent-color) cambia su acento sin reconstruir su interacción. Si necesitas más, estudia esta [guía de casillas personalizadas](https://moderncss.dev/pure-css-custom-checkbox-style), conservando estados y foco.

Partes de calendarios y selectores pertenecen a la interfaz del navegador y no permiten el mismo control visual en todas las plataformas. Una reconstrucción con JavaScript añade trabajo de teclado, semántica y compatibilidad; no la hagas sólo para igualar un color.

```css
input, select, textarea, button { font: inherit; }
input:not([type="radio"]):not([type="checkbox"]), textarea, select {
  width: 100%; padding: .75rem; border: 1px solid #777;
}
input:focus-visible, textarea:focus-visible, select:focus-visible {
  outline: 3px solid #145b9e; outline-offset: 2px;
}
```

## Recorrer un envío completo

Piensa en el formulario como una colección de pares clave y valor, no como una imagen de campos. La etiqueta ayuda a la persona a saber qué escribir; el nombre ayuda al receptor a identificar ese dato. Escribe primero un valor ficticio en `nombre`, envía y localiza esa clave en la respuesta. Cambia sólo `name="nombre"` por `name="participante"`: la apariencia puede permanecer idéntica, pero la clave enviada cambia. Ahora elimina `name` y vuelve a enviar. El control sigue siendo visible y editable, pero su dato deja de aparecer. Esta prueba muestra por qué revisar una captura no basta para saber si el formulario está correctamente construido.

Haz una segunda prueba cambiando `id` sin actualizar el `for` de la etiqueta. El envío puede seguir incluyendo el dato porque `name` no cambió, pero la asociación de la etiqueta se rompe. Al pulsar “Nombre”, el campo ya no recibe foco. Corrige la asociación y verifica ambas cosas por separado: nombre de envío y nombre accesible. Si copias un grupo de campos para crear otro, asegúrate de no duplicar los identificadores.

El destino también tiene que expresar una URL adecuada. Una ruta relativa, como `/registro`, se resuelve respecto del sitio actual; una URL completa apunta a otro origen. En esta práctica se utiliza un servicio de demostración para observar datos, pero en un producto real debes saber quién recibirá la información. La ausencia de un servidor propio no te impide aprender la estructura del formulario; sí impide afirmar que el botón crea una cuenta real.

## Elegir controles por la decisión del usuario

Para una lista larga, un `select` ahorra espacio y utiliza interacción nativa. Para tres turnos de clase, radios visibles permiten comparar sin abrir un menú. La elección no depende sólo de cuál etiqueta HTML sea más corta. Considera cuántas opciones existen, si se deben comparar simultáneamente y si la persona puede elegir una o varias.

En un grupo de radio, todos los controles deben compartir el mismo `name`, pero cada opción necesita su propio `value`. Si accidentalmente asignas nombres distintos, será posible marcar varias opciones a la vez porque el navegador interpreta varios grupos. Si todos tienen el mismo valor, el servidor no podrá distinguir la opción elegida. Prueba ambos errores deliberadamente y después restablece nombres y valores correctos.

Las casillas no comparten exclusividad. Una persona puede marcar HTML y CSS porque cada selección agrega información independiente. Un único checkbox puede representar una preferencia opcional, como recibir un recordatorio. No selecciones una preferencia sensible por defecto sólo para demostrar `checked`: el atributo define el estado inicial y debe corresponder a una decisión de producto consciente. En la práctica, modifica `checked`, recarga y distingue el estado inicial de la selección que hiciste después en el navegador.

`selected` y `checked` pertenecen a controles diferentes. En un menú, `selected` vive en la opción. En una casilla o radio, `checked` vive en el propio `input`. Ambos pueden servir como valor inicial al reiniciar el formulario. Por eso `reset` no significa “vaciar”: devuelve el control al estado definido originalmente. Si una opción estaba marcada al cargar, volverá a estarlo después del reinicio.

## Organizar antes de decorar

Un formulario largo puede resultar abrumador incluso si cada campo está bien etiquetado. Agrupa datos relacionados y explica el propósito del grupo. Por ejemplo, un `fieldset` de contacto puede incluir nombre, correo y teléfono; otro de visita puede contener fecha, turno y cantidad de lugares. El `legend` debe aparecer al principio del grupo para introducir lo que sigue. No agrupes campos sólo porque caben en una fila: la relación debe ser comprensible también sin CSS.

Después ajusta espacios. Una etiqueta debe estar visualmente cerca de su control y claramente separada del siguiente grupo. Los controles de texto pueden compartir tipografía y ancho, mientras casillas y radios conservan una presentación más compacta. Una regla indiscriminada `input { width: 100%; }` puede agrandar también las casillas y producir un resultado inesperado. Selecciona los tipos correspondientes y prueba todos los controles después de cada regla global.

Finalmente, compara el formulario en Windows y macOS si tienes ambos disponibles. El calendario, flechas de selección y controles internos pueden verse diferentes sin estar rotos. Evalúa si la persona puede entender y completar la tarea. Reemplazar un control nativo por uno personalizado exige conservar su semántica, estados, teclado y manejo de errores; una diferencia estética menor no justifica perder esas capacidades.

## Actividad

1. Completa los [tutoriales introductorios de formularios de MDN](https://developer.mozilla.org/en-US/docs/Learn/Forms#introductory_tutorials), escribiendo cada ejemplo.
2. Recorre las [guías de controles](https://developer.mozilla.org/en-US/docs/Learn/Forms#the_different_form_controls).
3. Realiza los [tutoriales de estilos](https://developer.mozilla.org/en-US/docs/Learn/Forms#form_styling_tutorials). Puedes dejar para después los selectores personalizables más nuevos; comprueba su compatibilidad antes de depender de ellos.
4. Sigue la [guía de formularios de Interneting Is Hard](https://internetingishard.netlify.app/html-and-css/forms/index.html).
5. Construye un registro ficticio para un taller con texto, correo, fecha, select, radios, casillas y comentario. Envía datos ficticios al servicio de prueba y comprueba nombres, valores seleccionados y ausencias. Recorre todo con Tab y activa las etiquetas.

## Comprobación

- ¿Qué hacen `form`, `action` y `method`?
- ¿Qué es un control y qué papel tiene `name` al enviar?
- ¿Cuándo escogerías `select`, radios o casillas?
- ¿Cómo difieren los tres tipos de botón?
- ¿Qué dos dificultades aparecen al dar estilo a controles nativos?
