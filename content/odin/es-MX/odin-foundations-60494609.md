# Herramientas de desarrollo para JavaScript

DevTools permite ejecutar expresiones, observar variables y detener un programa justo antes de una línea problemática. Ya usaste Elements y Styles; ahora aprenderás a conectar lo que muestra la página con el código que lo produce.

Abre Chrome > Más herramientas > Herramientas para desarrolladores, usa clic derecho > Inspeccionar o el atajo F12. Ctrl+Shift+C en Windows y Option+Cmd+C en macOS abren la selección de elementos. Los nombres y ubicaciones pueden cambiar entre versiones; busca la misma función aunque una captura antigua muestre otro botón.

## Depura en lugar de adivinar

Un **breakpoint** pausa la ejecución cuando llega a un punto elegido. En Sources abre tu archivo JavaScript y pulsa el número de línea. Ejecuta la acción que activa el código. Observa variables en Scope y la secuencia de llamadas en Call Stack. Usa los controles para avanzar una instrucción, entrar en una función, salir de ella o continuar.

```javascript
function total(price, quantity) {
  const result = price * quantity;
  return result;
}
console.log(total(15, 3));
```

Pausa en la multiplicación y comprueba que price vale 15 y quantity 3. Cambia una entrada para observar otro resultado. Un breakpoint condicional o uno ante excepciones puede ser más útil que detener cada repetición; conocerás los tipos en la lectura.

La consola sirve para expresiones rápidas y mensajes del programa. Sources muestra scripts cargados; Network permite comprobar si un recurso se descargó y Application reúne datos de almacenamiento. Recursos antiguos pueden llamar “Resources” a un panel que ahora está organizado de otra forma.

## Otras inspecciones útiles

Device Mode permite cambiar el viewport y simular tamaños o media queries; no reproduce por completo un dispositivo físico. En Elements puedes editar DOM, activar o desactivar clases, forzar pseudoestados como `:hover`, revisar propiedades calculadas en orden alfabético y modificar las dimensiones del modelo de caja. El panel Rendering permite emular el medio `print` para revisar estilos de impresión. Los cambios locales del inspector no actualizan por sí solos el código fuente.

## Actividad

1. Completa [depurar en Chrome](https://javascript.info/debugging-chrome).
2. En la [documentación de DevTools](https://developer.chrome.com/docs/devtools/) revisa [ver y cambiar CSS](https://developer.chrome.com/docs/devtools/css/), [referencia CSS](https://developer.chrome.com/docs/devtools/css/reference/), [ver y modificar DOM](https://developer.chrome.com/docs/devtools/dom/) y [tipos de breakpoints](https://developer.chrome.com/docs/devtools/javascript/breakpoints/).
3. Recorre el [panorama de la consola](https://developer.chrome.com/docs/devtools/console/). Practica evaluar una expresión, limpiar mensajes y volver a ejecutar una acción.
4. Usa [Device Mode](https://developer.chrome.com/docs/devtools/device-mode/) sobre tu página. Activa una clase, fuerza un estado y revisa impresión sin modificar los archivos originales.

## Comprobación

- ¿Cómo abres las herramientas y cambias el tamaño de pantalla simulado?
- ¿Qué es un breakpoint y [cómo se coloca en una línea](https://developer.chrome.com/docs/devtools/javascript/breakpoints/#loc)?
- ¿Dónde observas valores de variables y qué función llamó a la actual?
- ¿Qué cambios del inspector necesitas trasladar al editor para conservarlos?
