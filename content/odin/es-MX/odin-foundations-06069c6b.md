# Tipos de datos y condicionales

JavaScript tiene ocho tipos: `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null` y `object`. Los siete primeros son primitivos; objetos incluyen estructuras como arreglos. `undefined` suele indicar que no se asignó un valor; `null` representa una ausencia explícita. La peculiaridad histórica `typeof null === "object"` no cambia que null sea un valor primitivo. Comienza con el [panorama de tipos](https://javascript.info/types).

## Cadenas y métodos

Una cadena representa texto. Comillas simples y dobles funcionan igual si las abres y cierras de forma consistente. Las comillas invertidas permiten interpolar expresiones con `${...}` y escribir varias líneas.

```javascript
const name = "Ana";
const greeting = `Hola, ${name}. Hoy es tu día ${2 + 1}.`;
console.log(greeting);
console.log("Ella dijo: \"hola\".");
console.log(name.toUpperCase());
```

Un método es una función asociada a un valor u objeto. `toUpperCase()` devuelve otra cadena; las cadenas no se modifican en su lugar. `slice(inicio, fin)` extrae desde inicio hasta antes de fin y admite índices negativos desde el final. `substring` trata índices negativos como cero e intercambia inicio y fin si hace falta: no son idénticos.

Lee y practica [cadenas en MDN](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Strings), omitiendo por ahora “Concatenation in context”, que usa DOM. Revisa [métodos de cadenas](https://www.w3schools.com/js/js_string_methods.asp) y guarda la [referencia completa de String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) sin intentar memorizarla.

## Decisiones

Los operadores `>`, `<`, `>=`, `<=`, `===` y `!==` comparan valores. `===` comprueba igualdad sin la conversión implícita de `==`; úsalo cuando no quieras que `"5"` se considere igual a `5`. Los operadores lógicos `&&` (y), `||` (o) y `!` (no) permiten combinar condiciones. `&&` y `||` pueden devolver operandos, no sólo booleanos, y dejan de evaluar cuando ya conocen el resultado.

```javascript
const score = 75;
if (score >= 80) {
  console.log("Objetivo alcanzado");
} else if (score >= 60) {
  console.log("Revisa los puntos pendientes");
} else {
  console.log("Vuelve a practicar");
}
const result = score >= 80 ? "completo" : "pendiente";
```

Una condición convierte su valor a booleano. Son falsy `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined` y `NaN`; entre los valores ordinarios, los demás son truthy. `"0"`, `[]` y `{}` son truthy. **Anidar** consiste en colocar una estructura dentro de otra, como otro if dentro de una rama. Evita niveles innecesarios cuando puedas expresar claramente las alternativas.

`switch` compara un valor con casos mediante igualdad estricta. Usa `break` para no continuar al caso siguiente accidentalmente y `default` como alternativa:

```javascript
switch (name) {
  case "Ana": console.log("Bienvenida, Ana"); break;
  default: console.log("Bienvenida");
}
```

## Lecturas y práctica obligatoria

1. Lee [comparaciones](https://javascript.info/comparison), [condicionales en MDN](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/conditionals), [if/else y sus tareas](https://javascript.info/ifelse), [operadores lógicos y sus tareas](https://javascript.info/logical-operators) y [switch](https://javascript.info/switch). Algunas tareas usan `alert` para mostrar valores; observa qué valor devuelven los operadores.
2. Sigue el [README de javascript-exercises](https://github.com/TheOdinProject/javascript-exercises#how-to-use-these-exercises) para crear tu copia, clonar e instalar las herramientas de prueba.
3. Completa, en [foundations/data_types_and_conditionals](https://github.com/TheOdinProject/javascript-exercises/tree/main/foundations/data_types_and_conditionals), `01_helloWorld`, `02_addNumbers`, `03_numberChecker`, `04_mathEquations` y `05_joinStrings`, en ese orden. Lee instrucciones y errores. `return` entrega el resultado de una función; lo estudiarás enseguida. Consulta soluciones sólo después de intentar.

## Comprobación

- Nombra los ocho tipos; ¿cuál no es primitivo y cómo difieren null y undefined?
- ¿Qué cambia entre los tres tipos de comillas? ¿Cómo interpolas y escapas caracteres?
- ¿Qué es concatenar y cómo difieren slice y substring?
- ¿Qué hacen operadores lógicos y comparaciones?
- ¿Qué son truthy y falsy? Enumera los falsy.
- Escribe la estructura de if/else, switch y ternario, y explica qué significa anidar.
## Profundiza con el ejemplo

Al comparar texto, recuerda que la igualdad estricta también distingue mayúsculas y espacios. Normalizar una entrada antes de decidir puede ser apropiado, pero hazlo deliberadamente. Una cadena vacía tras quitar espacios no es lo mismo que una respuesta válida. Practica primero con valores fijos y después con entradas para saber si el problema está en la comparación o en cómo recibiste el dato.
