# Resolución de problemas

Resolver problemas es el trabajo central de programar. El lenguaje es una herramienta para expresar una solución que cumple una tarea y sus restricciones. Un ejercicio pequeño puede no necesitar gran rendimiento; una aplicación con millones de solicitudes sí. Entender esas restricciones forma parte de resolver, no es un paso posterior.

Es habitual reconocer sintaxis al leerla y quedarse en blanco ante un archivo vacío. La capacidad de diseñar una solución se desarrolla construyendo muchos programas, no sólo leyendo soluciones terminadas. Utilizaremos tres etapas: entender, planear y dividir para resolver.

## Entiende el problema

Reescribe el enunciado con tus palabras y explica qué significaría haberlo resuelto. Dibuja si ayuda. Busca ejemplos concretos de entrada y salida. Si no sabes cuál debería ser el resultado, todavía no podrás decidir si el programa es correcto.

## Planea

Antes de escribir código, responde: ¿habrá interfaz?, ¿qué podrá hacer la persona?, ¿de dónde vienen los datos?, ¿qué resultado se necesita?, ¿qué pasos conectan entrada y salida? Un **algoritmo** describe esos pasos. El **pseudocódigo** los expresa en lenguaje natural para concentrarte en la lógica antes de resolver la sintaxis.

```text
Pedir un número límite
Comenzar con un contador en uno
Mientras el contador no supere el límite:
  Mostrar el contador
  Aumentar el contador en uno
```

No hay una sintaxis única obligatoria para pseudocódigo, pero sí debe comunicar secuencia, decisiones y repetición con claridad.

## Divide y resuelve

Identifica subproblemas pequeños y empieza por uno que puedas comprobar. El plan inicial puede estar incompleto: resolver una parte suele revelar qué falta. Intentar mantener todos los detalles de un problema grande a la vez dificulta encontrar errores. La descomposición reduce esa carga y permite conservar avances comprobados.

## Ejemplo: FizzBuzz

El programa recibe un número y muestra del 1 hasta ese límite. Sustituye múltiplos de tres por `Fizz`, múltiplos de cinco por `Buzz` y múltiplos de ambos por `FizzBuzz`. La [descripción del juego](https://en.wikipedia.org/wiki/Fizz_buzz) da contexto.

La interfaz será la consola del navegador y una ventana `prompt`. Primero comprueba sólo la entrada:

```javascript
const answer = parseInt(prompt("¿Hasta qué número hacemos FizzBuzz?"), 10);
console.log(answer);
```

`prompt` entrega texto; `parseInt` interpreta un entero en base 10. Aún faltaría decidir cómo tratar cancelación o texto inválido; no confundas obtener una entrada con validarla.

Después recorre los números:

```javascript
for (let i = 1; i <= answer; i++) {
  console.log(i);
}
```

El [bucle for](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) inicializa i en 1, comprueba `i <= answer`, ejecuta el cuerpo y aumenta i. Con entrada 10 debe imprimir diez líneas, del 1 al 10. Aquí empezamos en 1 porque lo pide el problema, aunque muchos recorridos de arreglos empezarán en cero.

Añade una condición `i % 3 === 0`. El resto cero significa divisible por tres. Si se cumple, imprime Fizz; si no, el número. Para 10, las posiciones 3, 6 y 9 deben cambiar y las demás conservarse. Después incorpora un `else if (i % 5 === 0)` para Buzz: ahora también cambian 5 y 10.

Prueba con 15. Si compruebas primero sólo múltiplos de tres, 15 entrará ahí y nunca llegará al caso combinado. Por eso la condición más específica debe ir antes:

```javascript
for (let i = 1; i <= answer; i++) {
  if (i % 3 === 0 && i % 5 === 0) {
    console.log("FizzBuzz");
  } else if (i % 3 === 0) {
    console.log("Fizz");
  } else if (i % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(i);
  }
}
```

Para 20, el resultado debe ser `1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz, 16, 17, Fizz, 19, Buzz`, cada uno en su línea. Compara la ejecución con tu pseudocódigo y corrige también el plan si su orden de condiciones era ambiguo. El pseudocódigo es una herramienta para razonar, no una garantía automática de corrección.

## Actividad

1. Lee [How to Think Like a Programmer](https://www.freecodecamp.org/news/how-to-think-like-a-programmer-lessons-in-problem-solving-d1d8bf1de7d2/), de Richard Reis.
2. Mira [How to Begin Thinking Like a Programmer](https://www.youtube.com/watch?v=azcrPFhaY9k), de Coding Tech; reserva aproximadamente una hora.
3. Lee [qué es pseudocódigo y cómo escribirlo](https://www.builtin.com/data-science/pseudocode).
4. Reconstruye FizzBuzz por etapas sin copiar la solución final. Prueba 1, 3, 5, 15 y 20. Como ampliación, define qué respuesta corresponde a una entrada inválida antes de implementarla.

## Comprobación

- ¿Cuáles son las tres etapas y por qué debes entender antes de programar?
- ¿Qué preguntas resuelves durante la planeación?
- ¿Qué distingue algoritmo de pseudocódigo?
- ¿Por qué dividir el problema ayuda y por qué FizzBuzz necesita comprobar primero el caso combinado?

## Verifica cada subproblema de FizzBuzz

La primera comprobación no es que el programa entero produzca veinte líneas correctas, sino que la entrada llegue en la forma esperada. Ejecuta prompt con un número pequeño y muestra el resultado de parseInt. Si ves NaN, la conversión no obtuvo un entero interpretable. No sigas añadiendo condiciones hasta entender esa entrada: un bucle con una comparación contra NaN puede no ejecutarse y hacer parecer que la lógica interior está rota.

Después comprueba el recorrido sin sustituciones. Con entrada tres debes ver uno, dos y tres, no cero, uno y dos ni uno y dos solamente. El valor inicial y el operador de comparación determinan esos límites. Éste es un ejemplo de cómo un caso pequeño revela un error que puede pasar desapercibido entre muchas líneas.

Al introducir Fizz, mantén un caso que no sea múltiplo de tres para comprobar la rama alternativa. Si sólo pruebas con tres, una función que imprime Fizz para todo también parecería correcta. Probar significa seleccionar ejemplos que distingan comportamientos posibles, no ejecutar una sola entrada conveniente.

Cuando agregues Buzz, prueba cinco, seis y diez. El cinco debe usar Buzz, seis Fizz y diez Buzz. Después usa quince: es el primer caso que reúne ambas condiciones y obliga a considerar su relación. El problema no es que el resto esté mal, sino que una cadena if/else toma la primera rama verdadera y no continúa probando las siguientes. Por eso cambiar el orden resuelve la intención del enunciado.

## Haz que el plan muestre decisiones reales

Un pseudocódigo que sólo enumera «comprobar tres», «comprobar cinco» y «comprobar ambos» puede ocultar si las comprobaciones son independientes o excluyentes. Al traducirlo a código, esa ambigüedad produce resultados distintos. Reescribe el plan con «si», «en caso contrario» y el caso combinado primero. La planeación mejora a medida que pruebas; no necesitas defender la primera versión si descubriste un detalle.

Lo mismo sucede con un proyecto grande. Un plan puede indicar «guardar datos», pero al implementarlo aparecen preguntas: dónde se guardan, qué pasa si faltan, qué ocurre ante una respuesta inválida. Esas preguntas no invalidan la planeación; muestran el siguiente nivel de detalle. Resuelve una parte verificable y actualiza el plan con lo aprendido.

## Traslada el método a otra tarea

Elige una actividad cotidiana que tenga entrada, decisiones y resultado, como preparar una lista de compras a partir de recetas. Escríbela sin código. Identifica qué datos necesitas y cómo sabrás que la lista está completa. Después divide una operación pequeña, como sumar cantidades del mismo ingrediente. Esta práctica muestra que resolver problemas no empieza con una palabra reservada del lenguaje.

No necesitas una interfaz elaborada para comprobar una idea. FizzBuzz usa consola precisamente para aislar lógica y secuencia. Cuando luego añadas botones o formularios, conserva funciones que puedan probarse con entradas conocidas. Separar la decisión de cómo se muestra facilita investigar si un fallo pertenece a la lógica o a la interfaz.

Una buena explicación final describe la entrada, las decisiones y los casos que probaste. Incluye al menos un error que tuviste que corregir y qué observación te permitió localizarlo. Esa reflexión conserva el método que podrás transferir al siguiente problema.
