# Proyecto: calculadora

Construye una calculadora en pantalla con HTML, CSS y JavaScript. Este proyecto reúne funciones, estado, eventos y actualización del DOM. Habrá decisiones que no sean inmediatas: usa casos concretos para entender qué debe ocurrir después de cada tecla y construye por etapas.

## Restricción: operaciones propias

No uses [eval](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) ni `new Function()` para ejecutar una cadena como código. Debes implementar la selección de operaciones con tus funciones. Lee [por qué evitar eval directo](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_direct_eval!) y las [diferencias y riesgos de eval y Function](https://stackoverflow.com/questions/4599857/are-eval-and-new-function-the-same-thing). Además del riesgo, delegar toda la evaluación quitaría la práctica central.

## Paso 1: aritmética comprobable

Crea funciones add, subtract, multiply y divide. Pruébalas en consola con dos números antes de construir botones. Una operación consta de primer número, operador y segundo número, como 3, `+`, 5. Crea variables para representar esas partes.

Escribe `operate(operator, firstNumber, secondNumber)`, que elija la función adecuada y devuelva el resultado. Decide qué ocurre con un operador desconocido y comprueba que las entradas sean números al calcular; las teclas de pantalla suelen aportar texto y `"3" + "5"` no da 8.

## Paso 2: interfaz

Crea botones para cada dígito, los cuatro operadores, `=` y **Limpiar**. Incluye una pantalla que inicialmente pueda mostrar números provisionales para comprobar el diseño. No conectes toda la lógica de golpe: primero comprueba que una tecla actualice el número que se está escribiendo y la pantalla muestre ese mismo valor.

## Paso 3: conecta estado y resultado

Al introducir el primer número y un operador, conserva ambos. Los siguientes dígitos deben construir el segundo número. Cuando se pulse igual, llama a operate con las tres partes y muestra el resultado. La parte más difícil es decidir cuándo una tecla continúa un número y cuándo empieza otro; dibuja esa secuencia antes de modificar varias variables al azar.

Una función para actualizar pantalla puede usarse desde distintas acciones. No uses el texto visible como único registro de todo el estado si necesitas distinguir «resultado recién calculado» de «número en edición».

## Casos obligatorios

La calculadora procesa **un par de números a la vez**, no expresiones con precedencia algebraica completa. Debe comportarse así:

1. Pulsa `12`, `+`, `7`.
2. Al pulsar `-`, calcula 12 + 7 y muestra 19.
3. Pulsa `1` y `=`.
4. Usa 19 como primer número y muestra 18.

Compara esa secuencia en esta [calculadora básica](https://www.calculatorsoup.com/calculators/math/basic.php). Que el resultado intermedio aparezca al elegir el siguiente operador forma parte del requisito.

También debes cubrir:

- Redondear resultados con muchos decimales para que no desborden la pantalla. Decide un límite legible y evita que la representación introduzca cadenas donde esperas números.
- Pulsar `=` antes de tener ambos números y un operador no debe romper el programa ni calcular con datos inexistentes.
- **Limpiar** borra todos los datos de la operación, no sólo el texto. Después de limpiar debe comportarse como una calculadora recién abierta.
- Dividir entre cero muestra un mensaje de error comprensible y permite continuar o reiniciar; no debe bloquear controles ni dejar un estado imposible.
- Operadores consecutivos no calculan sin segundo número. `2`, `+`, `+` no debe producir 4. Conserva únicamente el último operador elegido hasta recibir el segundo número.
- Tras mostrar un resultado, pulsar un dígito debe comenzar un cálculo nuevo; no debe concatenarlo al resultado anterior. Por ejemplo, después de mostrar 18, pulsar 4 debe mostrar 4, no 184.

Haz una tabla de secuencias, resultado esperado y observado. Incluye cero, números de varias cifras, resultados negativos, divisiones decimales, limpiar a mitad de operación y limpiar después de un error. Repite la tabla cada vez que reorganices la lógica.

## Ampliaciones opcionales

1. Añade un botón decimal. Impide más de un separador por número, como `12.3.56.5`; desactívalo o ignóralo cuando ya exista uno y vuelve a permitirlo al empezar el siguiente número.
2. Añade retroceso para borrar la última entrada sin reiniciar toda la operación. Define su comportamiento ante un resultado ya calculado.
3. Añade teclado reutilizando las mismas acciones que los botones para que ambas interfaces se comporten igual.

## Entrega

Crea [commits con propósito](https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/commit-messages), publica el repositorio y una versión utilizable. Documenta restricciones, pruebas y cualquier ampliación realizada. La aceptación requiere operaciones básicas, estado coherente y todos los casos obligatorios anteriores, además de ausencia de eval y Function para evaluar expresiones.
