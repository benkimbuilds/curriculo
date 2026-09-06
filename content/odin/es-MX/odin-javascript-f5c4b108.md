# ECMAScript y compatibilidad

Recuerda también que ECMAScript especifica el lenguaje, mientras muchas APIs que utilizas, como document y los eventos del navegador, pertenecen al entorno web. Una edición nueva del lenguaje y una API nueva del navegador tienen procesos y tablas de soporte diferentes.

JavaScript implementa el estándar ECMAScript, publicado por Ecma International y desarrollado mediante TC39. ES6 es el nombre de la edición de 2015, también llamada ES2015. Incluyó `let`, `const`, clases, módulos y muchas otras características que ya utilizas; no es un lenguaje separado que debas aprender desde cero.

Después de esa edición, el proceso pasó a versiones anuales con adiciones más pequeñas. Por eso puedes encontrar ES7 como nombre informal de ES2016, o referencias a ES2017 y posteriores. No confundas el nombre de una edición con el soporte real en cada navegador o versión de Node.

## Un estándar no actualiza todos los navegadores

Una característica puede aprobarse antes de que los motores la implementen. Además, tus usuarios pueden usar navegadores que no se actualizan al mismo ritmo que el tuyo. Una sintaxis no reconocida puede impedir analizar un archivo completo; un método inexistente puede fallar cuando se ejecuta esa operación.

Consulta las tablas de compatibilidad de la documentación antes de adoptar una característica nueva para un público concreto. Define qué entornos necesitas soportar. “Funciona en mi computadora” no establece ese contrato.

## Transpilación con Babel

[Babel](https://babeljs.io/) transforma sintaxis moderna a otra que comprendan los entornos seleccionados. Por ejemplo, puede convertir una función flecha en una función compatible conservando su semántica. Las herramientas de construcción aplican estas transformaciones según sus objetivos de compatibilidad.

Transformar sintaxis y proporcionar APIs son problemas diferentes. Convertir una flecha no agrega automáticamente un método que no existe en el navegador. Para algunas APIs necesitas un polyfill o una alternativa. Tampoco Babel vuelve posible cualquier función del navegador en todos los entornos.

```js
const double = (value) => value * 2;
// Una transformación puede producir una función equivalente:
function doubleCompatible(value) { return value * 2; }
```

Este ejemplo ilustra la idea; no describe toda la salida de Babel ni elimina diferencias de `this` de manera general. Utiliza herramientas, no sustituciones manuales a ciegas.

## Tareas

1. Recorre las [características de ES2015](https://github.com/lukehoban/es6features). Identifica cinco que ya utilizas y anota una desconocida para regresar después; no necesitas dominarlas todas ahora.
2. Consulta la [historia de versiones ECMAScript](https://en.wikipedia.org/wiki/ECMAScript_version_history#14th_Edition_%E2%80%93_ECMAScript_2023) para reconocer el patrón anual.
3. Elige una API de tu proyecto, abre su documentación y localiza la tabla de compatibilidad. Explica cómo verificarías una versión de navegador requerida por una escuela o empresa.

## Comprobación

- ¿Por qué ES6 y ES2015 nombran la misma edición?
- ¿Qué riesgo tiene usar una característica recién incorporada al estándar?
- ¿Qué resuelve Babel y qué diferencia una transformación de sintaxis de un polyfill?
