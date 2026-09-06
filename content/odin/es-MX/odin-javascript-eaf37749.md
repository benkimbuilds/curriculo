# Proyecto: recursión, Fibonacci y merge sort

Antes de optimizar, comprueba que cada llamada recibe una entrada menor y que ninguna mitad se pierde al combinar. Un resultado ordenado pero más corto que el original sigue siendo incorrecto: orden y conservación de elementos son propiedades distintas que deben verificarse.

Implementa dos problemas clásicos para practicar casos base, reducción y combinación. No necesitas interfaz gráfica: ejecuta tus archivos con `node archivo.js` y añade pruebas. Configura ESM en el manifiesto si utilizas importaciones.

## Parte 1: Fibonacci

La secuencia comienza con 0 y 1; cada siguiente número es la suma de los dos anteriores. Los primeros ocho valores son `[0, 1, 1, 2, 3, 5, 8, 13]`.

1. Escribe `fibs(n)` con iteración. Debe devolver un arreglo con los primeros `n` valores, no solamente el valor en la posición n.
2. Escribe `fibsRec(n)` resolviendo el mismo contrato con recursión.
3. Prueba longitudes 0, 1, 2 y 8. Decide y documenta cómo rechazar números negativos o no enteros.
4. Añade temporalmente un mensaje al inicio de la función recursiva y llama con 8. Observa cuántas llamadas realiza tu versión. Una implementación que construye el prefijo una vez suele hacer unas siete u ocho; una que recalcula ramas puede hacer muchas más. El número de impresiones no sustituye comprobar el resultado.

Consulta [Fibonacci recursivo de Khan Academy](https://www.youtube.com/watch?v=zg-ddPbzcKM) si te cuesta identificar el subproblema. No copies un algoritmo que devuelve un solo término cuando tu contrato pide una secuencia.

## Parte 2: merge sort

Merge sort divide un arreglo en mitades, ordena cada mitad recursivamente y fusiona ambas manteniendo el orden. Cero o un elemento ya están ordenados. Para fusionar, compara el siguiente elemento disponible de cada mitad y toma el menor; cuando una se termina, agrega el resto de la otra.

```text
[3, 1, 2, 0]
  divide en [3, 1] y [2, 0]
  ordena a [1, 3] y [0, 2]
  fusiona: 0, después 1, después 2, después 3
```

1. Crea otro archivo con `mergeSort(array)` que devuelva el arreglo ordenado usando esta estrategia recursiva.
2. Implementa la fusión por separado si facilita razonar, pero comprueba el contrato público completo.
3. Usa índices para recorrer mitades si quieres evitar el costo de quitar repetidamente su primer elemento. Conserva elementos duplicados: ordenar no equivale a eliminar repetidos.
4. Documenta si tu función conserva el arreglo original; para esta práctica procura devolver uno nuevo.

Casos obligatorios:

```js
mergeSort([]); // []
mergeSort([73]); // [73]
mergeSort([1, 2, 3, 4, 5]); // [1, 2, 3, 4, 5]
mergeSort([3, 2, 1, 13, 8, 5, 0, 1]); // [0, 1, 1, 2, 3, 5, 8, 13]
mergeSort([105, 79, 100, 110]); // [79, 100, 105, 110]
```

## Recursos y entrega

Mira [merge sort de CS50](https://youtu.be/Ns7tGNbtvV4), el [segmento de la clase de CS50](https://www.youtube.com/live/iCx3zwK8Ms8?si=t7z6bEv_ZXIJDoHU&t=6550) hasta 2:04:05 y las explicaciones de [fusión](https://youtu.be/6pV2IF0fgKY) y [merge sort](https://youtu.be/mB5HXBb_HY8). El [visualizador](https://www.hackerearth.com/practice/algorithms/sorting/merge-sort/visualize/) es opcional.

Entrega repositorio, comando de pruebas y un dibujo de llamadas para una entrada pequeña. La aceptación requiere que ambas versiones de Fibonacci coincidan, todos los casos de ordenamiento pasen, se conserven duplicados y puedas señalar el caso base y la reducción en ambas soluciones. No utilices `Array.sort` para esconder el algoritmo que debes implementar.
