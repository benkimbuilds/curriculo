# Variables y operadores

JavaScript permite expresar lógica y hacer que una página responda. Durante la mayor parte de Fundamentos lo ejecutarás en el navegador; no cambies a Node salvo que el ejercicio lo indique, porque algunas APIs sólo existen en uno de los entornos.

En un documento HTML completo coloca antes de cerrar `body`:

```html
<script>
  console.log("¡Hola, mundo!");
</script>
```

Guarda, abre la página e inspecciona la pestaña **Console**. `console.log` muestra información ahí, no en el contenido visible de la página. También puedes crear `javascript.js` y cargarlo mediante `<script src="javascript.js"></script>`. La extensión es `.js`, aunque el nombre puede ser otro. [Live Preview de VS Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server) puede actualizar al guardar; es opcional.

## Variables

Una variable da nombre a un valor. Mira la [ilustración original](https://cdn.statically.io/gh/TheOdinProject/curriculum/d39eaf2ca95e80705f703bb218216c10508f5047/foundations/javascript_basics/fundamentals-1/imgs/00.png), recordando que es una analogía, no una caja física.

```javascript
let firstName = "John";
let lastName = "Doe";
console.log(firstName);
console.log(lastName);
let age = 11;
console.log(age);
age = 54;
console.log(age);
```

`let` declara una vez; una asignación posterior cambia el valor sin volver a declarar. `const` impide reasignar el vínculo: `const pi = 3.14; pi = 10;` produce un error y no continúa normalmente a la siguiente instrucción. Más adelante verás que esto no hace inmutable todo objeto guardado en una constante. `var` es la forma histórica y tiene reglas de alcance distintas; usa `let` y `const` en código nuevo, pero aprende a reconocerla.

Los nombres distinguen mayúsculas, no pueden comenzar por número y no deben ser palabras reservadas. Prefiere nombres que expliquen qué representa el dato, como `totalPrice`.

## Operaciones

JavaScript respeta precedencia: paréntesis, potencias, multiplicación y división, suma y resta. `(3 + 2) - 76 * (1 + 1)` da -147. `**` representa potencia y `%` el resto de una división; `10 % 3` da 1. No es un operador de porcentaje.

El operador `+` también concatena cadenas: `"10" + 2` da `"102"`, mientras `+"10" + 2` convierte primero y da 12. No supongas que todo dato que parece número ya lo es. `++` y `--` incrementan o decrementan. Como expresión, `x++` devuelve el valor previo y `++x` el nuevo; cuando se usan como una instrucción aislada ambos modifican x en uno.

## Actividad

1. Muestra `23 + 97` y confirma 120; suma después seis números distintos.
2. Evalúa `(4 + 6 + 9) / 77` y compara con aproximadamente 0.24675.
3. Declara `let a = 10`, muéstrala, reasígnala y vuelve a mostrarla. Declara `let b = 7 * a` y explica por qué usa el valor nuevo.
4. Declara constantes `max = 57`, `actual = max - 13` y `percentage = actual / max`; debe resultar aproximadamente 0.7719.
5. Lee [qué es JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_is_JavaScript), [variables](https://javascript.info/variables), [matemáticas en JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Math) y [operadores](https://javascript.info/operators). Escribe los ejemplos y completa las tareas de la última lectura.

## Comprobación

- ¿Qué tres palabras declaran variables y cuál evitamos en código nuevo?
- ¿Qué reglas siguen los nombres?
- ¿Qué ocurre al sumar cadenas y números? ¿Qué hace el más unario?
- ¿Cómo funcionan resto, incremento, decremento y precedencia?
- ¿Qué diferencia hay entre incremento prefijo y posfijo?
- ¿Cómo abres la consola y muestras un resultado?

## Sigue el valor en el tiempo

En el ejemplo de age, la primera llamada a console.log ocurre antes de la reasignación. Por eso muestra 11. La segunda ocurre después y muestra 54. Cambiar una variable no modifica retroactivamente resultados anteriores del programa. Lee el script de arriba hacia abajo y anota el valor después de cada instrucción para distinguir estado actual de historial de ejecución.

Declarar y asignar tampoco son la misma acción. let introduce el nombre en su alcance; el signo igual asigna un valor. Cuando actualizas age, no repites let porque no intentas crear otra declaración con el mismo nombre. Si declaras dos veces el mismo nombre con let en un mismo alcance, puedes obtener un error distinto al de reasignar una constante.

Con const, intenta reasignar pi y observa dónde se detiene el script. Si hay un console.log después del error, puede no ejecutarse. Esta observación explica por qué un error temprano puede hacer parecer que muchas líneas posteriores fallaron a la vez. Revisa primero la primera excepción antes de investigar cada salida ausente por separado.

## Prueba operaciones con una predicción

Antes de ejecutar una expresión, calcula una respuesta aproximada. Para (4 + 6 + 9) / 77, el numerador es 19, así que el resultado debe ser menor que uno. Esa estimación detecta errores de paréntesis o precedencia incluso si no recuerdas todos los decimales. La computadora realiza las operaciones especificadas, no las que pretendías escribir.

En la secuencia de max, actual y percentage, cada constante utiliza valores definidos previamente. No son fórmulas que se recalculan solas si otra variable cambia después: al ejecutar la asignación se obtiene un resultado concreto. Más adelante estudiarás estructuras reactivas en interfaces, pero una variable ordinaria no crea por sí misma esa relación automática.

Prueba incremento prefijo y posfijo guardando su resultado en otra variable. Compara el valor devuelto y el valor final del contador. Después repite las operaciones como instrucciones aisladas y observa que ambas terminan aumentando el contador. La diferencia importa cuando el resultado forma parte de otra expresión.

Por último, mezcla deliberadamente números y cadenas en un archivo de práctica. Predice el resultado de sumar dos números, dos cadenas y una cadena con un número. Usa typeof cuando necesites verificar qué produjo la operación. Esta experiencia prepara las entradas de formularios y prompt, donde el aspecto visual de un número no garantiza su tipo.

Anota las unidades de los números cuando representen cantidades reales. Un precio, una duración y un porcentaje pueden compartir tipo number sin ser intercambiables en un cálculo.
