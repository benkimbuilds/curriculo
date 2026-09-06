# Complejidad espacial

La complejidad espacial describe cómo crece la memoria necesaria al aumentar la entrada. Considera memoria de trabajo, no espacio del repositorio en disco. Un algoritmo puede ser rápido y aun así crear más datos de los que un dispositivo puede conservar.

Especifica qué estás contando. El espacio total incluye la representación de la entrada y el espacio adicional; el análisis de espacio auxiliar cuenta solamente memoria nueva necesaria durante la ejecución. Esa distinción permite comparar dos algoritmos que reciben el mismo arreglo pero crean cantidades diferentes de estructuras temporales.

## Constante y lineal

```js
function multiply(a, b) { return a * b; }

function sumWithCopy(values) {
  const copy = values.slice();
  let sum = 0;
  for (const value of copy) sum += value;
  return sum;
}

function sumWithoutCopy(values) {
  let sum = 0;
  for (const value of values) sum += value;
  return sum;
}
```

La multiplicación conserva una cantidad constante de valores bajo el modelo habitual de números JavaScript. `sumWithCopy` crea un arreglo de longitud n, por lo que usa O(n) espacio auxiliar; su contador es constante y no cambia esa clasificación. `sumWithoutCopy` recorre los mismos datos pero conserva solamente un acumulador y variables constantes: O(1) auxiliar. Si cuentas la entrada, ambos utilizan O(n) total.

Un objeto copiado con `{ ...obj }` también requiere espacio proporcional a sus propiedades. `Object.values(obj)` produce además un arreglo; los métodos convenientes no son necesariamente gratuitos. No confundas compartir una referencia con copiar toda una estructura. Las copias superficiales duplican la colección exterior, pero conservan referencias a los objetos internos.

## Mutación frente a resultado nuevo

```js
function squareInPlace(values) {
  for (let i = 0; i < values.length; i += 1) values[i] *= values[i];
  return values;
}
function squareNewArray(values) {
  return values.map((value) => value * value);
}
```

La primera usa O(1) auxiliar y modifica el argumento. La segunda usa O(n) para el nuevo arreglo y conserva la entrada. Ninguna gana automáticamente: si otra parte depende de los valores originales, la primera puede introducir un error. Declara si tu convención incluye la salida en el espacio auxiliar para que la comparación sea comprensible.

## Recursión y memoria viva

Las llamadas pendientes también ocupan espacio. Una recursión lineal puede necesitar O(n) marcos de pila aun sin crear arreglos; una división balanceada puede tener profundidad O(log n). Si además copias mitades o guardas todos los resultados, debes contar esas estructuras, no solo la profundidad. Importa la memoria máxima viva al mismo tiempo, no sumar ciegamente todas las asignaciones que ocurren durante toda la ejecución.

La memoización guarda respuestas para evitar repetir cálculo. Puede reducir tiempo a cambio de memoria. Un caché sin límite también puede crecer indefinidamente. Analiza los tamaños y el contrato antes de agregarlo como “optimización”.

## Memoria como recurso diferente del tiempo

Cuando una operación tarda más, a veces puedes esperar a que termine. Si intenta conservar más memoria de la disponible, esperar no crea por sí solo el espacio que falta. El sistema puede degradarse, cerrar el proceso o fallar una asignación. Por eso conocer el crecimiento espacial importa incluso si tus primeros proyectos manejan cantidades pequeñas.

La memoria principal contiene datos activos de la ejecución. Un algoritmo puede recibir una colección, crear copias temporales, mantener una pila de llamadas y producir otra colección de salida. Identifica cuáles existen simultáneamente y cuánto crecen. Una variable llamada items no ocupa “una unidad” solo porque tenga un nombre: puede apuntar a una estructura con millones de elementos.

## Aplicar las mismas notaciones a otra cantidad

Las familias O(1), O(log n), O(n), O(n log n), O(n²), O(n³), O(2ⁿ) y O(n!) también pueden describir espacio. La notación no está limitada al tiempo: debes indicar qué recurso estás acotando. En la práctica de este curso aparecen sobre todo constante, lineal y la memoria asociada a recursión y arreglos de trabajo.

Si una función conserva n elementos y tres variables adicionales, esos tres valores no cambian el orden de crecimiento. Igual que en tiempo, quitamos constantes para describir la tendencia. Eso no significa que cada objeto tenga el mismo tamaño exacto ni que tres copias de un arreglo consuman lo mismo que una: ambas cantidades pueden ser lineales y aun tener un impacto práctico diferente.

Una matriz con n filas de n valores requiere n² posiciones. Un arreglo con n referencias a la misma estructura no equivale a n copias profundas de esa estructura. Para analizar correctamente necesitas entender qué se asigna y qué solamente se referencia. No cuentes objetos compartidos varias veces como si fueran distintos, pero tampoco ignores colecciones nuevas creadas por un método.

## Comparar con una convención explícita

Supón que dos funciones reciben exactamente el mismo arreglo. Una acumula la suma y otra primero lo copia. Si incluyes la entrada, ambas tienen espacio total lineal; esa descripción es correcta pero oculta la diferencia que quieres estudiar. Al declarar que compararás espacio auxiliar, puedes expresar constante frente a lineal y explicar la ventaja de evitar la copia innecesaria.

Ninguna convención debería quedar implícita cuando puede cambiar la conclusión. En una entrevista o revisión, di si incluyes entrada, salida y pila. Una respuesta que solamente dice O(n) puede estar contando un conjunto de recursos distinto al de quien pregunta. Acordar el modelo vale más que discutir una etiqueta sin saber qué representa.

## El precio de conservar el original

La función que eleva al cuadrado en el mismo arreglo ahorra otra colección, pero altera datos que pueden utilizar otros consumidores. Si tu aplicación necesita tanto valores originales como transformados, esa mutación cambia el problema en vez de resolverlo con menos memoria. Conservar ambos requiere espacio por una razón funcional, no necesariamente por descuido.

También distingue copiar el arreglo exterior de copiar sus objetos. Map puede producir un arreglo nuevo cuyos elementos sean los mismos objetos; modificar uno de ellos sigue siendo visible desde el original. Si las operaciones trabajan sobre números primitivos, esa dificultad no aparece de la misma manera. Especifica el tipo de datos antes de atribuir garantías de independencia a una copia.

## Profundidad y estructuras recursivas

En sumTo(n), cada llamada espera el retorno de la siguiente y conserva su contexto. Aunque solo veas unas pocas variables dentro del cuerpo, existen varias ejecuciones pendientes. El espacio auxiliar crece con la profundidad. En una búsqueda binaria recursiva con índices, la profundidad crece logarítmicamente; si además haces copias completas en cada paso, debes contar esas copias.

Merge sort ilustra por qué no basta mirar una palabra clave. Una implementación típica usa arreglos de fusión y una pila de llamadas; su análisis debe considerar ambos. No asumas que toda recursión ocupa espacio exponencial ni que toda solución iterativa es constante: un bucle que agrega n resultados a una colección también usa espacio lineal.

## Una decisión razonada

Primero consigue corrección y una estructura legible. Después pregunta si se crean copias evitables o si una estructura distinta favorece la operación dominante. Consulta la hoja de complejidades como referencia, pero lee qué implementación y convenciones supone. Optimizar memoria sin un límite real puede añadir complejidad innecesaria; ignorarla frente a datos grandes puede impedir que el programa funcione.

## Tareas

1. Lee la discusión sobre [análisis espacial al pasar referencias](https://cs.stackexchange.com/questions/127933/analyzing-space-complexity-of-passing-data-to-function-by-reference) y [recursión y complejidad espacial](https://dev.to/elmarshall/recursion-and-space-complexity-13gc).
2. Revisa la columna de espacio en la [hoja Big O](https://www.bigocheatsheet.com/) y distingue estructuras de datos de operaciones sobre ellas.
3. Para las cuatro funciones de ejemplo, anota entrada, salida y temporales. Comprueba que mutación y memoria se explican por separado.
4. Revisa tu Fibonacci recursivo: dibuja qué llamadas y arreglos permanecen vivos en una entrada pequeña.

## Comprobación

- ¿Qué diferencia espacio total de auxiliar?
- ¿Por qué recorrer un arreglo no necesariamente requiere otro arreglo de igual tamaño?
- ¿Qué costo espacial puede estar oculto en recursión, `map`, `slice` y `Object.values`?
- ¿Por qué ahorrar memoria no justifica cambiar el contrato de mutación sin avisar?
