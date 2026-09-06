# Navegación con teclado

## Poder enfocar y poder activar

Algunas personas no utilizan ratón por limitaciones de movimiento; otras prefieren el teclado o alternan ambas formas. También existen tecnologías, como control por voz, que pueden producir acciones equivalentes a entradas de teclado. Una interfaz debe permitir completar sus tareas sin depender de apuntar con precisión.

Todo control interactivo necesita dos capacidades: recibir foco y responder a las teclas apropiadas. Un `div` con un manejador de clic no recibe automáticamente ninguna de ellas. Añadir `tabindex="0"` permite enfocarlo, pero todavía no implementa activación, semántica ni estados.

```html
<div tabindex="0" class="accion">Guardar</div>
```

Podrías añadir eventos de clic y teclado manualmente. Entonces tendrías que considerar Enter, Espacio, evitar desplazamiento accidental, mantener estados y comunicar que se trata de un botón. Esa reconstrucción es innecesaria cuando HTML ya ofrece el control correcto:

```html
<button type="button" id="guardar">Guardar</button>
```

```javascript
document.querySelector('#guardar').addEventListener('click', () => {
  document.querySelector('#estado').textContent = 'Guardado';
});
```

Un botón nativo produce la activación adecuada mediante Enter o Espacio y participa en el recorrido de foco. Un enlace con `href` tiene su propia interacción de teclado. Utiliza el elemento que corresponde a la acción y comprueba su comportamiento, en lugar de reconstruir todos los controles sobre contenedores genéricos.

## Foco visible

El foco indica qué elemento recibirá la siguiente acción de teclado. Los navegadores lo muestran normalmente con un contorno. Eliminarlo sin reemplazo deja al usuario en una situación parecida a mover un ratón con el cursor invisible: tendría que contar pulsaciones e imaginar dónde está.

No utilices una regla global que quite `outline` y `border` de cualquier elemento enfocado. Puedes conservar el estilo nativo o diseñar uno claro y contrastado:

```css
:focus-visible {
  outline: 3px solid #155ea5;
  outline-offset: 3px;
}
```

Prueba ese indicador sobre fondos claros y oscuros. Comprueba que un contenedor con `overflow: hidden` no lo recorte y que una barra fija no tape el elemento enfocado. Un cambio sutil de color puede ser insuficiente para localizarlo en una página larga.

## Orden de tabulación

Tab recorre los controles en su orden secuencial; Shift+Tab vuelve hacia atrás. Habitualmente ese orden sigue el HTML. `tabindex="0"` incorpora un elemento al orden normal. `tabindex="-1"` lo excluye de ese recorrido, aunque JavaScript todavía puede enfocarlo con `focus()`. Los valores positivos crean prioridades difíciles de mantener y suelen producir saltos inesperados: organiza el documento en el orden correcto en lugar de corregirlo con números.

CSS puede cambiar la colocación visual sin cambiar el orden del teclado. Si reordenas tarjetas con `order` o colocación Grid, verifica que la secuencia siga siendo lógica. Una persona que ve el foco espera que el siguiente control esté cerca según la distribución; un salto a la otra esquina puede confundirla.

## Contenido oculto

Un menú cerrado o un panel todavía no disponible no debería recibir foco invisible. Moverlo fuera de pantalla o darle `opacity: 0` no necesariamente lo retira del recorrido ni del árbol de accesibilidad. Una persona podría entrar en controles que no ve y perder la referencia de su posición.

Asignar `tabindex="-1"` a cada hijo evita parte del problema de teclado, pero no lo oculta a otras formas de navegación de tecnologías de asistencia. Cuando el contenido deba estar completamente ausente mientras está cerrado, utiliza `hidden`, `display: none` o, cuando corresponda conservar el espacio, `visibility: hidden`. Al abrirlo, restaura la presentación y sus controles.

```html
<button type="button" aria-expanded="false" aria-controls="ayuda">Mostrar ayuda</button>
<section id="ayuda" hidden>
  <h2>Ayuda para el registro</h2>
  <a href="/preguntas">Leer preguntas frecuentes</a>
</section>
```

El código que abre este panel debe actualizar tanto `hidden` como `aria-expanded`. Si cierras un panel mientras el foco está dentro, decide dónde devolverlo, normalmente al control que lo abrió. No ocultes el botón de apertura junto con el panel.

## Actividad

Repite el recorrido desde la parte superior después de cada corrección. Una solución local puede cambiar qué controles reciben foco a continuación. Si utilizas un enlace para saltar al contenido, comprueba que se vuelve visible al enfocarlo y que su destino permite continuar desde el lugar correcto, sin regresar inmediatamente al menú.

1. Mira [qué es el foco](https://www.youtube.com/watch?v=EFv9ubbZLKw&list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g&index=3) y [controlarlo con tabindex](https://www.youtube.com/watch?v=Pe0Ce1WtnUM&list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g&index=4).
2. Lee [enlaces para saltar navegación](https://webaim.org/techniques/skipnav/). Añade uno que permita llegar al contenido principal sin recorrer cada enlace del menú.
3. Recorre un proyecto completo con Tab, Shift+Tab, Enter y Espacio. Abre y cierra sus paneles; registra controles inaccesibles, foco invisible o saltos confusos.

## Comprobación

- ¿Qué dos capacidades debe tener un control para usuarios de teclado?
- ¿Qué son los estilos de foco y por qué no debes eliminarlos?
- ¿Qué determina el orden de tabulación?
- ¿Cómo ocultas contenido que no debe anunciarse ni recibir foco mientras está cerrado?
