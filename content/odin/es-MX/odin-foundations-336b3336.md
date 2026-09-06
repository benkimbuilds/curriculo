# Bucles y arreglos

Si necesitas guardar nombres de todo un grupo, una variable por estudiante se vuelve difícil de mantener. Un **arreglo** reúne valores en una colección ordenada. Si necesitas repetir una operación, un **bucle** expresa esa repetición sin copiar instrucciones. Juntos permiten trabajar con cantidades de datos que cambian.

## Repetición controlada

Un bucle requiere un estado inicial, una condición para continuar y algún avance que permita terminar. `for` concentra esos componentes; `while` repite mientras una condición sea verdadera. `break` sale del bucle y `continue` omite el resto de la iteración actual, pero no termina todo el recorrido. Una condición que nunca cambia puede producir un bucle infinito y congelar la página.

Lee [Looping Code de MDN](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Looping_code) y completa sus ejercicios finales. Después lee [while y for](https://javascript.info/while-for) y realiza también sus tareas. Algunos ejemplos contienen arreglos: por ahora piensa en una lista ordenada de valores.

## Colecciones

```javascript
const students = ["Ana", "Luis", "Sol"];
console.log(students[0]);
students[1] = "Leo";
students.push("Mar");
console.log(students.length);
```

Los índices empiezan en cero; el último índice es length menos uno. Una constante puede referir a un arreglo cuyo contenido cambia, aunque no puedas reasignar el nombre a otro arreglo. Métodos como push y pop agregan o quitan al final; shift y unshift trabajan al inicio. Otros métodos devuelven colecciones nuevas. Antes de usarlos verifica si mutan el original.

Mira el [curso breve de arreglos](https://www.youtube.com/watch?v=7W4pQQ20nJg), lee [introducción a arreglos](https://javascript.info/array) y [métodos](https://javascript.info/array-methods). En esta primera lectura no necesitas resolver todas sus tareas; se asignan algunas específicas más abajo. Guarda la [referencia de Array de MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

## Un problema con tres partes

`sumOfTripledEvens(array)` recibe números, elige los pares, los multiplica por tres y suma esos resultados. Escribe primero pseudocódigo: recorrer, comprobar paridad, transformar y acumular.

```javascript
function sumOfTripledEvens(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] % 2 === 0) {
      const tripleEvenNumber = array[i] * 3;
      sum += tripleEvenNumber;
    }
  }
  return sum;
}
```

`array[i] % 2 === 0` decide si participa; la multiplicación transforma; `sum +=` acumula. Separar esos propósitos facilita ver cómo los expresan otros métodos.

## map: transforma

Un **callback** es una función que pasas como argumento a otra. `map` llama al callback para cada elemento y coloca su retorno en un arreglo nuevo.

```javascript
function addOne(num) { return num + 1; }
const arr = [1, 2, 3, 4, 5];
const mappedArr = arr.map(addOne);
console.log(mappedArr); // [2, 3, 4, 5, 6]
console.log(arr); // [1, 2, 3, 4, 5]
```

También puedes escribir `arr.map((num) => num + 1)` si la función sólo sirve aquí. Pasas la función, no el resultado de llamarla antes. map devuelve tantos elementos como la colección recorrida; no es la herramienta para descartar valores. En este ejemplo no cambia el original, aunque un callback que mutara objetos podría afectar datos compartidos.

## filter: selecciona

`filter` también ejecuta un callback, pero interpreta su resultado como una decisión: si es verdadero, conserva el elemento original; si no, lo excluye del arreglo nuevo.

```javascript
function isOdd(num) { return num % 2 !== 0; }
const oddNums = arr.filter(isOdd);
console.log(oddNums); // [1, 3, 5]
```

La función no devuelve el número transformado, sino una condición. Para el 2 devuelve false y no lo incluye; para el 3 devuelve true y conserva el 3. El arreglo original sigue igual.

## reduce: acumula

`reduce` combina elementos en un resultado. El callback recibe el acumulador actual y el elemento actual; su retorno será el acumulador en el siguiente paso. Un segundo argumento al método define el acumulador inicial.

```javascript
const product = arr.reduce((total, currentItem) => {
  return total * currentItem;
}, 1);
console.log(product); // 120
```

Empezamos en 1 porque es el valor neutro de la multiplicación; empezar en cero daría siempre cero. Para sumar normalmente empiezas en cero, o en 10 si quieres sumar también diez. Si omites el valor inicial, reduce usa el primer elemento y empieza el recorrido efectivo en el segundo. En un arreglo vacío eso lanza error, por lo que dar un valor inicial explícito hace más claro el caso vacío.

El [diagrama de sándwiches](https://cdn.statically.io/gh/TheOdinProject/curriculum/335ab97a10d66d0f07e81d01fc6b1c63d31dc5ae/foundations/javascript_basics/loops_and_arrays/imgs/00.jpg) resume seleccionar, transformar y combinar. Ahora reescribe sumOfTripledEvens con filter, map y reduce antes de revisar esta solución:

```javascript
function sumOfTripledEvens(array) {
  return array
    .filter((num) => num % 2 === 0)
    .map((num) => num * 3)
    .reduce((sum, num) => sum + num, 0);
}
```

La base cero añadida permite devolver cero cuando no hay pares o la entrada está vacía. Compara ambas versiones con `[1, 2, 3, 4]`, `[1, 3]` y `[]`. Elegir métodos o un bucle depende de claridad y control necesario, no de que una forma sea siempre superior.

## Pruebas automatizadas

TDD consiste en escribir primero una prueba que describe el comportamiento, verla fallar y después implementar lo necesario para que pase. Una prueba de suma puede parecer sencilla, pero un detector de victoria de gato necesitaría muchas partidas manuales si no pudieras probar directamente tableros concretos. Las pruebas permiten repetir esos casos tras cada cambio. Más adelante escribirás las tuyas; ahora resolverás ejercicios que ya las incluyen.

## Actividad

1. En las [tareas de métodos de arreglos](https://javascript.info/array-methods#tasks), completa sólo: convertir `border-left-width` a `borderLeftWidth`, filtrar un rango, filtrar un rango en el lugar, ordenar de mayor a menor, copiar y ordenar, mezclar un arreglo y obtener miembros únicos.
2. En [foundations/loops_and_arrays](https://github.com/TheOdinProject/javascript-exercises/tree/main/foundations/loops_and_arrays), lee los README y completa en orden `01_repeatString`, `02_reverseString`, `03_removeFromArray`, `04_sumAll`, `05_leapYears` y `06_tempConversion`. Revisa la [guía del repositorio](https://github.com/TheOdinProject/javascript-exercises#how-to-use-these-exercises) si olvidaste ejecutar pruebas. Consulta soluciones después de intentar.

## Comprobación

- ¿Para qué sirven bucles y arreglos?
- ¿Qué diferencia hay entre break y continue?
- ¿Cómo accedes y cambias un elemento de un arreglo?
- ¿Qué hacen map, filter y reduce y qué devuelve cada uno?
- ¿Qué ventaja aportan pruebas automáticas frente a repetir todo manualmente?

## Recorre con índices y límites

En un arreglo de tres nombres, los índices válidos son cero, uno y dos. Un for que use i menor que length visita esos tres lugares. Si usas menor o igual, intentarás leer una posición adicional y obtendrás undefined. Ese valor puede producir un error más adelante, por lo que conviene comprobar límites con arreglos pequeños y vacíos.

Modificar un arreglo durante su recorrido requiere atención. Si eliminas un elemento, los siguientes índices pueden desplazarse. La tarea de filtrar en el lugar justamente te hará pensar en esa diferencia respecto a devolver un arreglo nuevo. No asumas que un método que suena parecido tiene las mismas consecuencias; revisa si cambia longitud, orden o referencias.

## Sigue los callbacks uno por uno

Para map con addOne, imagina cinco llamadas: addOne recibe primero uno, después dos y así sucesivamente. Cada retorno ocupa la posición correspondiente del arreglo nuevo. No hay una única llamada que reciba toda la colección como num. El método se encarga del recorrido y tú proporcionas qué hacer con un elemento.

Para filter, el callback responde una pregunta. En el ejemplo de impares, uno produce verdadero, dos falso y tres verdadero. El resultado contiene los elementos originales que pasaron, no los booleanos. Si tu resultado acaba siendo una lista de true y false, probablemente usaste map cuando querías filtrar. Si retornas el número mismo en lugar de una condición, el cero será falsy y puedes introducir un error difícil de notar.

Para reduce, escribe una tabla con acumulador y elemento actual. En el producto, empieza en uno, multiplícalo por uno, después por dos, por tres y así hasta llegar a 120. El retorno del callback alimenta el paso siguiente. Si olvidas return en una función con llaves, el siguiente acumulador puede ser undefined y el resto del cálculo dejará de tener sentido.

## Comprueba la cadena completa

En sumOfTripledEvens, prueba cada etapa por separado antes de encadenar. Para uno, dos, tres y cuatro, filter debe entregar dos y cuatro; map debe entregar seis y doce; reduce debe entregar dieciocho. Mostrar esos resultados intermedios permite identificar dónde se perdió un valor sin reescribir toda la expresión.

Una entrada vacía y una entrada sin pares son importantes porque producen una colección vacía antes de reduce. El valor inicial cero evita que ese caso lance una excepción. Esta corrección no necesita una rama especial si el contrato de la función dice que sumar ningún valor produce cero.

## Lee las pruebas como un contrato

En los ejercicios del repositorio, observa qué argumentos utiliza cada prueba y qué resultado espera. Una prueba fallida puede indicar que interpretaste mal un límite, no que la herramienta esté rota. No cambies expectativas para hacerlas coincidir con tu implementación: primero comprende el comportamiento solicitado.

Una suite no demuestra que un programa sea perfecto, pero conserva ejemplos repetibles. Al corregir una función, ejecutar todos sus casos ayuda a detectar regresiones que no recordarías probar manualmente. Esa ventaja se vuelve mayor cuando varias funciones interactúan y el recorrido de interfaz completo sería lento de repetir.

Al terminar cada ejercicio, revisa si tu solución modifica la entrada y si ese comportamiento coincide con lo que exige el enunciado.
