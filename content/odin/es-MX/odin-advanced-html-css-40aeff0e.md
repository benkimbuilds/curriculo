# WAI-ARIA

## Completar la semántica cuando HTML no basta

WAI-ARIA significa *Web Accessibility Initiative — Accessible Rich Internet Applications*. Es una especificación que permite comunicar funciones, estados y relaciones a tecnologías de asistencia cuando HTML nativo no expresa suficientemente una interfaz. No es un reemplazo general de HTML: funciona mejor al cubrir una necesidad concreta que realmente falta.

ARIA modifica información semántica. No modifica la apariencia, no implementa comportamiento, no añade capacidad de recibir foco y no añade eventos de teclado. Escribir `role="button"` sobre un `div` no hace que Enter o Espacio lo activen. Si el control puede construirse con `button`, normalmente debes empezar por ese elemento.

## Cinco reglas de uso

1. Prefiere elementos y atributos HTML nativos cuando ofrecen lo que necesitas.
2. No cambies la semántica nativa sin una necesidad real: convertir un encabezado en botón mediante un rol puede quitar su función estructural.
3. Todo control interactivo que uses con ARIA debe poder operarse por teclado.
4. No coloques `role="presentation"` ni `aria-hidden="true"` sobre controles enfocables.
5. Todo elemento interactivo necesita un nombre accesible.

ARIA incorrecto puede empeorar una interfaz. Un estado `aria-expanded="true"` que no corresponde a un panel abierto comunica información falsa. Un botón sin nombre sigue siendo ambiguo aunque incluya muchos atributos. Comprueba cada atributo en el árbol de accesibilidad y en la interacción real.

## El árbol de accesibilidad

El DOM representa los nodos del documento. El árbol de accesibilidad extrae información relevante para tecnologías de asistencia: función, nombre, descripción, estados y relaciones. No tiene que incluir cada envoltura visual del DOM. HTML proporciona gran parte de esa información; ARIA puede modificarla.

El **nombre accesible** identifica el elemento y lo distingue de otros: el texto de un botón, una etiqueta de entrada o el `alt` de una imagen pueden aportarlo. La **descripción** añade información complementaria, como instrucciones o restricciones. Confundirlos puede producir nombres larguísimos o controles cuyo propósito nunca se anuncia claramente.

Los atributos que referencian otro elemento necesitan identificadores únicos. Evitar selectores CSS por `id` no implica evitar identificadores cuando una relación semántica los requiere. La relación funciona de manera parecida al `for` de una etiqueta, aunque no necesariamente añade el mismo comportamiento.

## `aria-label`: un nombre explícito

`aria-label` proporciona una cadena como nombre accesible y puede reemplazar un nombre nativo. Es útil cuando un botón sólo contiene un icono:

```html
<button type="button" aria-label="Cerrar menú">×</button>
```

El nombre pasa de una equis poco informativa a “Cerrar menú”. No lo añadas por rutina a un botón que ya tiene texto correcto: podrías hacer que lo visible y lo anunciado difieran. Esa discrepancia también dificulta controlarlo por voz usando el texto que la persona ve.

Un uso habitual es distinguir regiones:

```html
<nav aria-label="Principal">...</nav>
<nav aria-label="Lecciones">...</nav>
```

El lector puede anunciar nombre y función de cada navegación. Consulta el contexto de la [lección semántica original](https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-semantic-html). No todos los elementos admiten nombre de autor: un `div` genérico no adquiere significado automáticamente por llevar `aria-label`. Esta [discusión sobre limitaciones de nombre](https://github.com/w3c/aria/issues/756) ayuda a entender por qué debes consultar el rol concreto.

No utilices `aria-label` para escribir una palabra “como suena” e intentar arreglar un pronunciador particular. Otras herramientas, incluidas líneas [braille](https://en.wikipedia.org/wiki/Braille), reciben ese texto y podrían mostrar algo sin sentido. Comunica el contenido correcto y configura el idioma apropiado.

## `aria-labelledby`: nombrar con texto existente

`aria-labelledby` referencia uno o más `id`, separados por espacios, para formar un nombre. Tiene prioridad sobre `aria-label` y sobre otros mecanismos de nombre cuando es aplicable. El orden de los identificadores determina el orden del texto combinado. Referencias repetidas no se concatenan indefinidamente.

```html
<h2 id="titulo-libros">Libros</h2>
<button id="ver-libros" type="button" aria-labelledby="titulo-libros ver-libros">
  Ver catálogo
</button>
```

El botón puede anunciarse como “Libros, Ver catálogo”. Referenciar su propio identificador permite conservar su texto y añadir contexto. Esto es útil cuando hay varios botones con el mismo texto dentro de secciones diferentes. Comprueba que el resultado siga siendo natural y breve; a veces un texto visible más específico sería más sencillo.

Los elementos referenciados pueden estar ocultos visualmente y aun así contribuir al nombre según el cálculo de nombre accesible. Esa capacidad no significa que convenga ocultar todas las etiquetas. Una etiqueta visible ayuda también a personas que no usan lector de pantalla.

Aunque `aria-labelledby` asocia texto, no reproduce el comportamiento de `label`. Si haces clic sobre un `label` correctamente asociado, el navegador enfoca la entrada. Si haces clic sobre un `div` referenciado por `aria-labelledby`, esa activación no ocurre automáticamente. Conserva etiquetas nativas para controles cuando sean apropiadas.

```html
<label for="nombre">Nombre</label>
<input id="nombre" name="nombre" type="text">
```

## `aria-describedby`: información complementaria

`aria-describedby` también acepta identificadores, pero modifica la descripción, no el nombre. Así el campo conserva un nombre breve y recibe instrucciones adicionales:

```html
<label for="clave">Contraseña</label>
<input id="clave" name="clave" type="password" aria-describedby="clave-ayuda">
<p id="clave-ayuda">Utiliza al menos diez caracteres.</p>
```

Al enfocar, una tecnología de asistencia puede anunciar el nombre, el tipo protegido y la instrucción. Puedes incluir un identificador de error cuando exista un error, manteniendo la ayuda relevante. El texto referenciado debe existir y sus identificadores deben seguir siendo únicos después de renderizar varios componentes.

## `aria-hidden`: ocultar del árbol, no de la pantalla

`aria-hidden="true"` excluye contenido del árbol de accesibilidad, pero no lo oculta visualmente ni impide foco por sí mismo. Es útil para un icono decorativo que acompaña un texto ya suficiente:

```html
<button type="button">
  <span aria-hidden="true">＋</span>
  Agregar libro
</button>
```

Sin esa exclusión, algunos iconos basados en texto pueden añadir palabras o símbolos repetidos al nombre. Con ella, el botón conserva “Agregar libro”. No ocultes el botón completo: seguiría siendo interactivo pero dejaría de anunciar información útil.

El atributo afecta al subárbol. Si un padre tiene `aria-hidden="true"`, poner `aria-hidden="false"` en un hijo no lo rescata. Revisa siempre dónde colocas el atributo. Para un menú cerrado que debe desaparecer también del teclado, normalmente necesitas `hidden` o una estrategia equivalente, no sólo ARIA.

## Actividad

Al inspeccionar una relación por identificadores, confirma que cada referencia existe en el documento final. Un componente reutilizado puede duplicar un `id` aunque cada archivo parezca correcto por separado. Comprueba el nombre calculado, no sólo el atributo escrito. Si el texto anunciado no coincide con tu intención, elimina temporalmente la referencia y compara qué nombre aporta HTML por sí mismo.

1. Lee las secciones 1–5 de [ARIA in HTML](https://www.w3.org/TR/html-aria/). Busca cómo se relacionan elementos nativos, roles permitidos y restricciones; no memorices cada combinación.
2. Lee sobre [regiones vivas](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions). Permiten anunciar actualizaciones dinámicas sin mover el foco; úsalas con moderación para no interrumpir cada cambio irrelevante.
3. Inspecciona un botón con icono, un campo con ayuda y dos navegaciones. Compara nombre y descripción antes y después de los atributos. Prueba que el teclado sigue funcionando: el árbol correcto no demuestra por sí solo comportamiento correcto.

## Comprobación

- ¿Qué necesidad cubre WAI-ARIA y qué cuatro cosas no implementa?
- ¿Cuáles son las cinco reglas de uso?
- ¿Qué relación existe entre DOM y árbol de accesibilidad?
- ¿Cómo difieren `aria-label`, `aria-labelledby` y `aria-describedby`?
- ¿Qué oculta `aria-hidden` y por qué no debe aplicarse a un control enfocable?
