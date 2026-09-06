# Validación de formularios

## Restricciones que ayudan a completar la tarea

Validar significa comprobar que un dato cumple reglas concretas y explicar cómo corregirlo si no las cumple. Un formulario útil comunica sus requisitos antes del error y conserva lo que la persona ya escribió. HTML incluye muchas restricciones sin JavaScript; más adelante añadirás reglas entre campos y validación del servidor.

## Campos obligatorios

`required` evita el envío normal de un control vacío. Indica también el requisito en su etiqueta, por ejemplo “Correo (obligatorio)”. Si utilizas un asterisco, explica su significado. No dependas exclusivamente de un borde rojo.

```html
<label for="correo">Correo (obligatorio)</label>
<input id="correo" name="correo" type="email" required>
```

Prueba el [ejemplo de required](https://codepen.io/TheOdinProjectExamples/pen/vYeZGzB) enviando vacío y luego con un correo ficticio. El mensaje y la presentación dependen del navegador.

## Longitud de texto

`minlength` y `maxlength` establecen límites de longitud en controles compatibles. `minlength` no equivale a `required`: un campo opcional vacío puede seguir siendo válido. Consulta [los detalles de minlength](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/minlength), incluida la validación tras cambios del usuario. No supongas que asignar un valor con código se comporta exactamente como teclearlo.

```html
<label for="descripcion">Descripción (entre 20 y 300 caracteres)</label>
<textarea id="descripcion" name="descripcion"
          required minlength="20" maxlength="300" rows="5"></textarea>
```

Experimenta por separado con [mínimo](https://codepen.io/TheOdinProjectExamples/pen/WNZOwgp), [máximo](https://codepen.io/TheOdinProjectExamples/pen/zYEzqJJ) y [restricciones combinadas](https://codepen.io/TheOdinProjectExamples/pen/vYeZGVY). El navegador puede impedir escribir más allá del máximo. Prueba también pegar texto largo y dejar vacío: son casos distintos.

## Rangos numéricos, fechas y horas

`min` y `max` restringen valores, no número de caracteres. Funcionan en controles numéricos, fechas y otros tipos compatibles; consulta [los elementos y sintaxis admitidos](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/max#syntax).

```html
<label for="lugares">Lugares solicitados (1 a 6)</label>
<input id="lugares" name="lugares" type="number" min="1" max="6" step="1" required>
```

Aquí `step="1"` expresa cantidades enteras. Un valor de cero viola el mínimo y siete viola el máximo. Reproduce los ejemplos de [mínimo numérico](https://codepen.io/TheOdinProjectExamples/pen/poWwyxd) y [máximo numérico](https://codepen.io/TheOdinProjectExamples/pen/XWegdxB), usando también los valores exactos del límite.

## Patrones

`pattern` acepta una [expresión regular](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) en ciertos tipos de `input`. Sirve para formatos concretos, pero no debe convertirse en una barrera arbitraria. Los nombres humanos, por ejemplo, pueden incluir acentos, guiones y múltiples palabras; no los limites a letras inglesas por comodidad.

```html
<label for="postal">Código postal</label>
<p id="postal-ayuda">Escribe cinco dígitos; conserva los ceros iniciales.</p>
<input id="postal" name="postal" type="text" inputmode="numeric"
       pattern="[0-9]{5}" placeholder="01234" aria-describedby="postal-ayuda">
```

Se usa texto porque un código postal no es una cantidad. El ejemplo original admite el [formato postal estadounidense](https://codepen.io/TheOdinProjectExamples/pen/YzrQqRK); compáralo con esta adaptación de cinco dígitos y no apliques una regla regional a un formulario mundial. El [ejemplo con placeholder](https://codepen.io/TheOdinProjectExamples/pen/LYzLNXv) añade una muestra, pero conserva instrucciones visibles, porque la muestra desaparece al escribir.

La sintaxis de una expresión puede variar entre atributos HTML, cadenas JavaScript y literales de expresión regular. Consulta y prueba una regla apropiada; no copies una expresión compleja que no puedas comprobar con casos válidos e inválidos.

`type="email"` y `type="url"` ya incluyen validación sintáctica. Revisa el [ejemplo de tipos incorporados](https://codepen.io/TheOdinProjectExamples/pen/eYGRZbK). Un correo con formato válido no demuestra propiedad del buzón; una URL válida no demuestra que sea segura, exista o use necesariamente HTTP. Si tu aplicación sólo acepta HTTPS, debe imponer además esa política en el servidor.

## Mostrar estados en el momento adecuado

`:valid` y `:invalid` reflejan validez, pero pueden marcar campos antes de que una persona intente llenarlos. `:user-valid` y `:user-invalid` esperan interacción relevante según el navegador. Eso permite un estado neutral inicial.

```css
input { border: 1px solid #777; }
input:user-invalid { border-color: #a52721; }
input:user-valid { border-color: #246b43; }
input:focus-visible { outline: 3px solid #165c9c; outline-offset: 2px; }
```

Prueba el [ejemplo de estilos de validación](https://codepen.io/TheOdinProjectExamples/pen/dyVRMwx): escribe mal un correo, sal del campo, corrígelo y observa los cambios. El color complementa mensajes explícitos, no los reemplaza. Un foco visible tampoco debe desaparecer cuando existe un error.

## Lo que HTML no resuelve

Comprobar que dos contraseñas coinciden requiere comparar campos. Saber si un nombre de usuario ya existe requiere consultar el servidor. Personalizar el contenido y presentación de los mensajes puede requerir JavaScript. Más adelante estudiarás esas herramientas; no necesitas implementarlas todavía.

La validación del navegador mejora la experiencia, pero puede eludirse modificando HTML o enviando solicitudes directamente. El servidor debe validar siempre los datos recibidos. Nunca interpretes una demostración que bloquea “Enviar” como protección completa del sistema.

## Construir casos de prueba útiles

Para una restricción de longitud, escribe primero exactamente el mínimo permitido. Después elimina un carácter y vuelve a intentar el envío. Repite alrededor del máximo. Así compruebas los límites, no sólo un ejemplo que casualmente funciona. Si el campo es opcional, prueba vacío aparte: un valor ausente y uno demasiado corto son situaciones diferentes. Si el requisito real es que siempre exista contenido, agrega `required` en lugar de asumir que el mínimo ya lo hizo.

Para un rango numérico, distingue el número de su representación textual. La cantidad doce tiene dos dígitos, pero un máximo de seis la rechaza por su valor, no por su longitud. Un código postal de cinco dígitos puede empezar con cero y no se somete a operaciones aritméticas: validarlo como número puede perder parte de su representación. El tipo de control debe responder al significado del dato antes de elegir la restricción.

Los patrones también deben probar casos que parezcan cercanos. Para cinco dígitos, comprueba cuatro, cinco, seis, letras mezcladas y un valor con cero inicial. Si aceptas espacios por comodidad, debes decidir explícitamente si los normalizas o los rechazas. No añadas reglas cada vez más complejas para cubrir formatos que el producto no ha definido. En formularios internacionales, un patrón postal o telefónico demasiado estrecho puede excluir entradas válidas de otras regiones.

## Observar el momento del error

Una página recién abierta no debería parecer llena de errores antes de que la persona actúe. Compara `:invalid` con `:user-invalid` en un campo obligatorio vacío. Luego escribe un valor incorrecto y cambia el foco. El navegador decide cuándo la interacción es suficiente para activar las pseudoclases de usuario; comprueba ese comportamiento en los navegadores de tu público y conserva las restricciones aunque el efecto visual varíe.

Cuando corriges un valor, observa si desaparece el error correspondiente sin borrar otros campos. Si hay varios errores, la persona necesita distinguir cuál corresponde a qué entrada. El mensaje nativo ofrece una base, pero no resuelve por sí mismo todas las decisiones de redacción o presentación. En el futuro, la validación personalizada deberá mantener esas asociaciones y evitar mensajes que contradigan la regla real.

Prueba también enviar mediante Enter desde un campo, no sólo pulsando el botón con el ratón. Un formulario debe conservar sus restricciones en ambos recorridos. Al documentar la prueba, registra el valor ficticio introducido, la restricción esperada y la respuesta observada. No uses información personal real para demostrar que una regla acepta correos o contraseñas.

## Actividad

1. Sigue la [guía de validación de MDN](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation); deja para después la sección con JavaScript.
2. Lee la [guía de formularios y restricciones de SitePoint](https://www.sitepoint.com/html-forms-constraint-validation-complete-guide/), omitiendo por ahora la API JavaScript y el validador personalizado.
3. Revisa [buenas y malas prácticas de experiencia de validación](https://threadreaderapp.com/thread/1400388896136040454.html).
4. Añade restricciones al formulario del taller. Prepara una tabla de pruebas: vacío, mínimo, máximo, justo fuera de cada límite y formato incorrecto. Registra el resultado sin enviar datos reales.

## Comprobación

Conserva una captura del error y otra del mismo campo corregido para demostrar la recuperación.

- ¿Qué garantiza `required` y qué no implica `minlength`?
- ¿Cómo diferencias límites de longitud y de valor?
- ¿Cuándo es apropiado un patrón y cómo comunicas su formato?
- ¿Qué selectores estilizan controles después de interacción?
- ¿Por qué sigue siendo necesaria la validación del servidor?
