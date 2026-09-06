# Complejidad temporal

Además de funcionar y ser legible, un programa necesita realizar una cantidad razonable de trabajo. La complejidad temporal describe cómo crece ese trabajo al crecer la entrada. No es un cronómetro: una medición depende del equipo, carga, motor y datos; el análisis compara una tendencia bajo un modelo de operaciones.

## Contar y generalizar

```js
function oddNumbers(maxNumber) {
  let currentNumber = 1;
  while (currentNumber < maxNumber) {
    if (currentNumber % 2 !== 0) console.log(currentNumber);
    currentNumber += 1;
  }
}
```

Para 10, el ejemplo de Odin cuenta 34 pasos según su convención: asignación inicial, comparaciones, incrementos, cinco impresiones y comparación final. Ese conteo ilustra el proceso, pero no es una equivalencia exacta entre instrucciones y tiempo de CPU. Si el límite pasa a ser n, el trabajo crece proporcionalmente a n. Esa relación es lo que buscamos.

## O, Ω y Θ

Big O expresa una cota superior asintótica; Ω, una inferior; Θ, una cota ajustada que cumple ambas. No significan por sí mismos peor, mejor y promedio. Puedes analizar el peor caso de una búsqueda y darle una cota Θ(n), o el mejor caso y darle Θ(1). El caso analizado y el tipo de cota son dos decisiones diferentes.

En conversaciones de programación, “es O(n)” suele referirse al crecimiento del peor caso o de un caso esperado especificado. Decláralo cuando importe. Esta adaptación corrige la simplificación del original que identifica Θ con promedio: para una búsqueda lineal, el promedio depende también de una distribución de entradas.

## Familias frecuentes

| Crecimiento | Ejemplo y efecto |
| --- | --- |
| O(1) | Consultar una posición de arreglo bajo el modelo habitual; trabajo acotado independientemente de n. |
| O(log n) | Búsqueda binaria; cada paso descarta aproximadamente la mitad. |
| O(n) | Recorrer todos los elementos una vez. |
| O(n log n) | Merge sort: trabajo lineal por nivel y cantidad logarítmica de niveles. |
| O(n²) | Comparar todos los pares con dos recorridos completos anidados. |
| O(n³) | Examinar todas las ternas con tres recorridos de tamaño n. |
| O(2ⁿ) | Explorar todas las combinaciones de incluir/excluir n elementos. |
| O(n!) | Enumerar todas las permutaciones de n elementos distintos. |

Dos bucles consecutivos de tamaño n son O(n), no O(n²). Dos bucles anidados no implican automáticamente n² si sus límites son constantes o dependen de otra variable. Identifica qué cantidad controla cada uno.

## Búsqueda binaria paso a paso

En `[1,2,3,4,5,6,7,8,9,10]`, busca 7. El índice medio entre 0 y 9 es 4 y contiene 5. Como 7 es mayor, conserva índices 5 a 9. El nuevo medio es 7 y contiene 8; conserva 5 a 6. Repite hasta hallar 7 o agotar el intervalo. El arreglo debe estar ordenado; no incluyas gratis el costo de ordenarlo si tu aplicación todavía no lo tiene.

```js
function binarySearch(values, target) {
  let low = 0;
  let high = values.length - 1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (values[middle] === target) return middle;
    if (values[middle] < target) low = middle + 1;
    else high = middle - 1;
  }
  return -1;
}
```

Duplicar una entrada ordenada agrega aproximadamente una comparación en el peor caso. En contraste, duplicar n en un trabajo cuadrático multiplica aproximadamente por cuatro y en uno cúbico por ocho. Con 2ⁿ basta agregar un elemento para duplicar; 10! ya vale 3,628,800.

## Constantes y decisiones reales

Si incrementas `currentNumber` de dos en dos empezando en 1, visitas aproximadamente la mitad de valores. Ambas versiones siguen siendo O(n): ignorar constantes permite comparar crecimiento, pero no afirma que sus tiempos reales sean iguales. Dos algoritmos de la misma clase pueden tener costos, memoria y legibilidad diferentes.

Un algoritmo de 10n operaciones puede perder frente a n² para entradas pequeñas y ganar para grandes. No optimices a costa de claridad basándote solo en una etiqueta. Primero verifica comportamiento, luego analiza y mide en el contexto real si el rendimiento importa. También cuenta el costo de operaciones auxiliares como copiar, ordenar o buscar dentro del bucle.

## Desarrollar el análisis, sin confundirlo con un cronómetro

El mismo programa puede tardar distinto en dos ejecuciones porque comparte CPU y memoria con otros procesos, porque el motor optimiza código o porque ciertos datos ya están en caché. Eso no hace inútiles las mediciones: sirven para responder cómo se comporta una aplicación concreta. Pero para razonar sobre crecimiento, conviene un modelo que no dependa de una computadora particular.

Contar operaciones proporciona ese modelo. Primero decide qué operación será representativa: comparaciones, visitas a elementos o una combinación sencilla de pasos. Después observa cuántas veces ocurre en función del tamaño de entrada. No presupongas que imprimir en consola cuesta lo mismo que sumar un número en la realidad; el conteo abstrae detalles para estudiar la tendencia.

En el ejemplo de impares, asignar el primer valor ocurre una vez. Comparar el límite e incrementar ocurren una vez por iteración. La impresión ocurre solo cuando el número es impar. Hay también una última comparación que termina el ciclo. Si omites un paso constante, puedes cambiar el conteo exacto sin cambiar la clase asintótica; si omites una búsqueda de tamaño n dentro del ciclo, puedes cambiar por completo el análisis.

## Qué significa que una entrada crezca

Para oddNumbers, el parámetro máximo determina cuántos enteros inspeccionamos. Para buscar en un arreglo, n suele significar longitud del arreglo. Para comparar dos arreglos diferentes, pueden ser necesarias dos variables, n y m. Un doble bucle que compara cada elemento de una colección con todos los de la otra realiza n por m comparaciones; llamarlo n² solo tiene sentido si ambas longitudes crecen juntas bajo esa suposición.

También importa qué consideras tamaño de una clave. Leer una propiedad por índice puede modelarse como constante; calcular un hash recorriendo un texto depende de cuántos caracteres contiene. En una tabla hash se suele analizar cantidad de entradas suponiendo claves de tamaño acotado, pero esa convención debe quedar clara cuando las claves pueden ser enormes.

## Constante no significa instantáneo

Una operación O(1) mantiene una cota de trabajo que no crece con n. Podría realizar varias instrucciones o utilizar un costo fijo significativo. Consultar un elemento por índice y ejecutar cien operaciones fijas son ambas constantes respecto de la longitud de una colección externa, aunque sus tiempos concretos sean distintos.

Por esa razón, las etiquetas asintóticas no ordenan todos los programas para todos los tamaños. Ayudan a predecir qué pasa cuando la entrada crece mucho, no a elegir siempre al ganador para una lista de tres elementos. Lee la etiqueta junto con constantes, entorno, claridad y necesidades reales.

## Por qué aparece un logaritmo

En la búsqueda binaria, después de cada comparación descartas aproximadamente la mitad de lo que queda. Con 32 candidatos, las cantidades pueden reducirse a 16, 8, 4, 2 y 1. Con 64 agregas una reducción al comienzo. Duplicar el tamaño no duplica las comparaciones: añade aproximadamente una.

La base del logaritmo no cambia la clase Big O porque cambiar de base introduce un factor constante. En la intuición de esta búsqueda usamos base dos porque dividimos en mitades. La idea que debes reconocer en otro algoritmo es una reducción proporcional repetida, no la presencia literal de una llamada a Math.log en el código.

Los límites inclusivos del ejemplo también importan para corrección. Si el medio es menor que el objetivo, low pasa a middle más uno; de lo contrario high pasa a middle menos uno. Mantener el mismo middle dentro del intervalo puede impedir que la búsqueda disminuya y generar un ciclo infinito con ciertas entradas. Un algoritmo no es O(log n) si su implementación ni siquiera termina en todos los casos válidos.

## Lineal y dos recorridos

Recorrer n elementos para sumar y después recorrerlos otra vez para mostrar algo realiza una cantidad proporcional a dos n. Al quitar el factor constante, queda O(n). No debes multiplicar los tamaños de bucles consecutivos como si estuvieran anidados.

Si dentro de cada una de las n iteraciones recorres de nuevo los n elementos, sí aparecen aproximadamente n² pasos. Si el segundo recorrido empieza después de la posición actual, el total puede ser n más n menos uno y así sucesivamente; sigue creciendo cuadráticamente aunque sea aproximadamente la mitad de todos los pares. Cambiar una constante no elimina el crecimiento dominante.

Un bucle dentro de otro puede también tener costo lineal si el interno recorre siempre una cantidad fija, por ejemplo las siete categorías de una interfaz que no crecen con los registros. Inspecciona límites y dependencias en vez de clasificar por la apariencia de la sangría.

## N log n en merge sort

Merge sort divide en mitades durante una cantidad logarítmica de niveles. En un nivel concreto, las fusiones procesan en conjunto todos los n elementos, aunque estén repartidos entre varias sublistas. Multiplicar trabajo lineal por número logarítmico de niveles da n log n.

No significa que cualquier algoritmo con una división y un bucle sea automáticamente n log n. Debes sumar el trabajo de todas las ramas y niveles. Una implementación que hace operaciones extra costosas durante la fusión puede perder el costo que esperabas. Por ejemplo, desplazar repetidamente arreglos grandes merece revisar el costo real de esas operaciones bajo el modelo utilizado.

## Cuadrático, cúbico y el efecto de duplicar

Con tres elementos, comparar todos los pares ordenados produce nueve combinaciones; con cuatro, dieciséis; con diez, cien. Si duplicas n de cinco a diez, el trabajo pasa de veinticinco a cien: cuatro veces. En un recorrido de todas las ternas, el crecimiento es cúbico: de cinco a diez pasa de ciento veinticinco a mil, ocho veces.

Estos crecimientos pueden ser aceptables para entradas pequeñas o problemas que realmente requieren enumerar esas combinaciones. El objetivo no es prohibir cualquier doble bucle. Es reconocer cuánto trabajo exige el contrato y si existe una estrategia que evite comparaciones innecesarias, como indexar primero una colección para consultas repetidas.

## Exponencial y factorial no son el mismo patrón

Si cada elemento puede incluirse o excluirse y enumeras todos los subconjuntos, hay dos elevado a n posibilidades. Con diez elementos son 1024; cada elemento adicional duplica esa cantidad. Una solución recursiva con dos llamadas no es necesariamente exactamente dos elevado a n: importa cuánto reduce el problema y cuántas llamadas distintas se realizan.

Enumerar todas las permutaciones de n elementos distintos produce n factorial posibilidades: n opciones iniciales, n menos una para el siguiente lugar y así hasta uno. Para cuatro elementos son 24; para diez son millones. Este crecimiento se vuelve enorme rápidamente, por lo que antes de generar combinaciones debes comprobar si el usuario realmente necesita todas o solo una respuesta óptima o válida.

## Casos y cotas, aplicados a una búsqueda

En una búsqueda lineal que termina cuando encuentra el objetivo, el mejor caso ocurre si está al principio: una comparación. El peor ocurre si está al final o ausente: inspeccionas todos los elementos. Para describir promedio necesitas una hipótesis, por ejemplo que cada posición sea igualmente probable y que el objetivo exista. Sin esa distribución, decir promedio puede ocultar una suposición no compartida.

Puedes dar una cota O(n) al peor caso y también una cota ajustada Θ(n). El mejor caso tiene Θ(1). Omega expresa una cota inferior, no una orden de buscar exclusivamente el mejor caso. La notación y el caso son ejes separados. Esta precisión evita interpretar que un mismo algoritmo tenga una única etiqueta universal independiente de qué estás midiendo.

Un recorrido que siempre visita todos los elementos tiene crecimiento lineal tanto en su mejor como en su peor caso bajo el modelo habitual. Eso permite afirmar una cota ajustada para ese trabajo sin invocar un promedio. No confundas “ajustada” con un número exacto de nanosegundos o instrucciones: sigue siendo una afirmación asintótica.

## Cuando dos soluciones comparten clase

La segunda versión de impares puede avanzar de dos en dos y evitar valores pares. Ambas son lineales, pero una hace menos iteraciones. Ese cambio conserva el propósito y puede simplificar la explicación. Una optimización más complicada que ahorra una operación diminuta pero vuelve el código incomprensible quizá no compense.

También puede existir una solución con mejor clase que requiera preparar un índice, ordenar o usar más memoria. Incluye ese costo inicial cuando compares una consulta aislada; si harás miles de consultas sobre los mismos datos, puede amortizarse. Explica el escenario completo y no solamente la operación que favorece tu propuesta.

Finalmente, comprueba corrección antes de celebrar rapidez. Omitir elementos, terminar prematuramente o perder duplicados puede reducir trabajo y producir un resultado incorrecto. Las pruebas establecen el contrato; el análisis explica cómo crece el costo de cumplirlo; las mediciones ayudan a decidir si esa diferencia importa en la aplicación real.

## Tareas y comprobación final

Al presentar tu análisis, escribe qué representa n, qué operación cuentas y cuál caso estudias. Si utilizas dos entradas independientes, nombra ambas. Incluye cualquier preparación, como ordenar antes de buscar, y explica si se hace una vez o por cada consulta. Esa declaración permite que otra persona reproduzca y revise tu razonamiento.

1. Lee [Big O en JavaScript](https://www.doabledanny.com/big-o-notation-in-javascript), consulta la [hoja de complejidades](https://www.bigocheatsheet.com/) y sigue la [guía de análisis paso a paso](https://www.sahinarslan.tech/posts/step-by-step-big-o-complexity-analysis-guide-using-javascript); la sección de espacio viene después.
2. Cuenta comparaciones de búsqueda lineal y binaria para una entrada de 8 y otra de 16. Prueba objetivo inicial, final y ausente.
3. Explica por qué merge sort conserva O(n log n) y qué costo añade fusionar mediante operaciones que desplazan un arreglo.

- ¿Qué mide Big O y por qué no equivale a milisegundos?
- ¿Cómo se distingue peor caso de cota superior?
- ¿Por qué Θ no significa promedio?
- ¿Por qué quitar constantes no implica que dos implementaciones sean igual de rápidas?
