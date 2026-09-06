# Auditoría de accesibilidad

## Comprobar la implementación

Añadir etiquetas, roles o estilos no demuestra que funcionen correctamente. Una auditoría busca errores concretos y verifica la experiencia resultante. Combina inspección, herramientas automáticas, pruebas manuales y, cuando sea posible, retroalimentación de personas que utilizan tecnologías de asistencia.

DevTools permite revisar contraste, nombre accesible, función, estados y árbol de accesibilidad. Es una comprobación rápida útil después de modificar un componente. Selecciona un botón y pregunta si su nombre describe la acción; selecciona una entrada y comprueba si su etiqueta y ayuda están asociadas.

## Herramientas automáticas

[axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd?hl=en-US) es una extensión que clasifica problemas por gravedad y señala verificaciones manuales pendientes. Lee la explicación de cada hallazgo antes de cambiar atributos: eliminar un aviso con una etiqueta incorrecta no arregla la experiencia.

[Lighthouse](https://developers.google.com/web/tools/lighthouse) está disponible en Chrome DevTools y también puede ejecutarse desde línea de comandos. Además de accesibilidad, revisa categorías como rendimiento, buenas prácticas y SEO. Las categorías y auditorías pueden cambiar entre versiones. Una puntuación alta sólo refleja las comprobaciones ejecutadas; no certifica que una persona pueda terminar todos los procesos.

[WAVE de WebAIM](https://wave.webaim.org/) permite introducir una URL y ver marcas sobre la página. También tiene extensiones y opciones de API. Sus iconos distinguen errores, alertas y problemas de contraste. La superposición puede alterar visualmente la página, así que separa ese efecto de un error que ya existía en el diseño.

Estas herramientas encuentran parte de los problemas, como una entrada sin nombre. No pueden decidir siempre si el nombre elegido es correcto, si un texto alternativo comunica la información adecuada o si el orden de una interacción resulta comprensible. Eso requiere juicio y pruebas manuales.

## Actividad

1. Lee la [referencia de accesibilidad de Chrome](https://developer.chrome.com/docs/devtools/accessibility/reference/#tab), empezando por el panel Accessibility. Explora también sus [funciones del panel](https://developer.chrome.com/docs/devtools/accessibility/reference/#pane).
2. Revisa cómo [simular deficiencias visuales](https://developer.chrome.com/blog/new-in-devtools-83/#vision-deficiencies). La simulación es una herramienta para detectar problemas, no una reproducción completa de la experiencia de otra persona.
3. Aprende a [abrir Issues](https://developer.chrome.com/docs/devtools/issues/#open) y distingue los avisos relacionados con accesibilidad de otros errores.
4. Recorre las [funciones del inspector de Firefox](https://firefox-source-docs.mozilla.org/devtools-user/accessibility_inspector/index.html#features-of-the-accessibility-panel). Las etiquetas o valores pueden variar entre herramientas aunque describan conceptos parecidos.
5. Audita una página propia con una herramienta, registra hallazgos y corrige los relacionados con las lecciones anteriores. Después repite la auditoría y completa la tarea principal con teclado y lector de pantalla.

## Registro de resultados

Anota la página, estado de la interfaz, herramienta, problema, corrección y prueba posterior. Auditar sólo un menú cerrado no verifica el menú abierto. Si no puedes comprobar una parte, márcala como pendiente en vez de declararla resuelta. La retroalimentación de usuarios afectados puede revelar barreras que tus herramientas no detectan.

## Comprobación

- ¿Qué características de accesibilidad puedes inspeccionar en DevTools?
- ¿Qué auditoría viene integrada en Chrome?
- ¿Por qué un resultado automático sin errores no equivale a una experiencia completamente verificada?
