# Inspecciona HTML y CSS

El inspector permite ver la estructura que el navegador construyó y las reglas que aplica. Es una herramienta de trabajo, no sólo un recurso para emergencias. Antes de añadir reglas para corregir un diseño, observa qué elemento ocupa el espacio y qué valores tiene.

Abre DevTools con clic derecho > **Inspeccionar** o con F12, según tu teclado. En macOS puedes usar el menú de Chrome o Cmd+Option+I. Concéntrate ahora en **Elements** y **Styles**; no necesitas dominar todos los paneles de inmediato.

## Selecciona un elemento

En Elements puedes expandir nodos del árbol y seleccionar uno. También puedes activar el selector visual y pulsar el elemento dentro de la página. Esta [captura del icono](https://cdn.statically.io/gh/TheOdinProject/curriculum/e7ab90e044fba9f8ef9b5915c62221e2822b102b/foundations/html_css/css-foundations/inspecting-html-and-css/imgs/00.jpg) lo identifica.

Styles muestra declaraciones aplicadas y otras que perdieron en la cascada, normalmente tachadas. Visita el [inicio de Odin](https://www.theodinproject.com/home), selecciona un encabezado y observa sus reglas. La [captura de una declaración sobrescrita](https://cdn.statically.io/gh/TheOdinProject/curriculum/e7ab90e044fba9f8ef9b5915c62221e2822b102b/foundations/html_css/css-foundations/inspecting-html-and-css/imgs/01.jpg) muestra el aspecto; la página actual puede haber cambiado. No necesitas entender todavía `var()` para reconocer qué declaración gana.

## Prueba cambios

Pulsa un valor en Styles, modifícalo y observa el resultado inmediato. Puedes desactivar una declaración con su casilla o agregar una nueva. Elements también permite editar texto o estructura temporalmente. Esto cambia tu copia de la página en el navegador, no los archivos del servidor ni los de VS Code.

Cuando una prueba funcione, traslada el cambio al archivo correcto, guarda y recarga. Si sólo lo cambiaste en DevTools, se perderá al recargar. El árbol DOM puede diferir del texto fuente si el navegador reparó HTML inválido; por eso sigue siendo útil validar el documento original.

## Actividad

Sigue estas partes de la [documentación de Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools):

1. [Descripción general](https://developer.chrome.com/docs/devtools/overview/): reconoce qué herramientas existen, sin seguir todavía todos los enlaces.
2. [Cómo abrir DevTools](https://developer.chrome.com/docs/devtools/open/).
3. [Ver y cambiar el DOM](https://developer.chrome.com/docs/devtools/dom/): omite por ahora las partes que usan la consola JavaScript.
4. [Ver y cambiar CSS](https://developer.chrome.com/docs/devtools/css): realiza las instrucciones interactivas.

En tu recetario, cambia temporalmente un color, desactiva una declaración y recarga. Explica qué cambios persistieron y por qué.

## Comprobación

- ¿Cómo seleccionas un elemento específico?
- ¿Qué significa una declaración tachada?
- ¿Cómo pruebas un valor en tiempo real y cómo lo haces permanente?
