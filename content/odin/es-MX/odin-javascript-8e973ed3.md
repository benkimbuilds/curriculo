# Estructuras de datos y algoritmos comunes

Una estructura de datos organiza información para facilitar determinadas operaciones. Un arreglo puede ser suficiente para recorrer una lista, pero buscar repetidamente un elemento entre millones de registros puede exigir otra organización. Elegir estructura implica intercambiar costos de creación, inserción, búsqueda, eliminación y memoria.

Ya construiste merge sort: un algoritmo expresa cómo resolver un problema. La estructura organiza los datos sobre los que actúa. Para elegir ambos, empieza por la operación dominante: ¿recorres en orden, buscas por clave, insertas al principio o exploras relaciones?

## Pilas y colas

Una pila sigue LIFO: el último elemento agregado es el primero en salir. Es útil para llamadas pendientes, deshacer operaciones o recorrer primero la rama más reciente. `push` agrega y `pop` retira del extremo superior.

Una cola sigue FIFO: el primero que entra es el primero que sale. `enqueue` agrega al final y `dequeue` retira del inicio. Modela trabajo pendiente por orden de llegada y exploración por niveles.

```js
const stack = [];
stack.push("A", "B");
console.log(stack.pop()); // B

const queue = ["A", "B"];
let nextIndex = 0;
console.log(queue[nextIndex++]); // A
console.log(queue[nextIndex++]); // B
```

El ejemplo de cola con índice evita desplazar todos los elementos en cada extracción. En una cola de larga duración también necesitarías gestionar el espacio consumido por elementos ya procesados. La interfaz conceptual no exige una implementación particular.

## Nodos, listas y árboles

Un nodo reúne un valor y referencias a otros nodos. En una lista enlazada cada nodo apunta al siguiente. En un árbol binario cada nodo tiene como máximo dos hijos; raíz es el nodo inicial y hoja uno sin hijos.

Un árbol binario de búsqueda agrega una regla: todos los valores del subárbol izquierdo son menores que el nodo, y los del derecho mayores, según el contrato elegido para duplicados. Esa condición permite descartar una rama al buscar. Un árbol desbalanceado puede convertirse en una cadena: no confundas “árbol” con garantía automática de O(log n).

La búsqueda binaria en un arreglo ordenado y la búsqueda en un BST aprovechan comparaciones para descartar regiones. En ambas debes preservar la propiedad que hace válido descartar: orden en el arreglo e invariante de búsqueda en el árbol.

## Recorridos BFS y DFS

En amplitud (*breadth-first search*, BFS) procesas primero la raíz, después todos sus hijos, después los nietos. Una cola guarda los nodos por visitar. En profundidad (*depth-first search*, DFS) continúas por una rama antes de regresar; utiliza una pila explícita o la pila de llamadas con recursión.

Para el árbol con raíz 4, hijos 2 y 6, e hijos de éstos 1,3 y 5,7:

- BFS produce 4,2,6,1,3,5,7.
- DFS preorden visita nodo, izquierda, derecha: 4,2,1,3,6,5,7.
- DFS inorden visita izquierda, nodo, derecha: 1,2,3,4,5,6,7.
- DFS postorden visita izquierda, derecha, nodo: 1,3,2,5,7,6,4.

El inorden de un BST devuelve valores ordenados. El postorden permite procesar hijos antes del padre. En grafos con ciclos necesitas además registrar visitados para evitar repetir indefinidamente; esa precaución aparecerá en el proyecto del caballo.

## Tareas

1. Revisa la [introducción a estructuras de datos](https://en.wikipedia.org/wiki/Data_structure) y los primeros diez minutos de [por qué estudiar algoritmos](https://www.youtube.com/watch?v=u2TwK3fED8A).
2. Mira [búsqueda binaria de CS50](https://www.youtube.com/watch?v=DSffdCT5Cx4) y [construir un BST](https://www.youtube.com/watch?v=FvdPo8PBQtc).
3. Estudia [pilas y colas](https://www.youtube.com/watch?v=6QS_Cup1YoI), [recorridos de árboles](https://www.youtube.com/watch?v=9RHO6jU--GU), [amplitud](https://www.youtube.com/watch?v=86g8jAQug04) y [profundidad](https://www.youtube.com/watch?v=gm8DUJJhmY4).
4. Dibuja el árbol del ejemplo y simula su cola y su pila después de cada visita. No memorices solamente la lista final.

## Comprobación

- ¿Qué diferencia LIFO de FIFO y qué hacen enqueue/dequeue?
- ¿Qué guarda un nodo de una lista enlazada?
- ¿Qué condición permite descartar media búsqueda?
- ¿Qué estructura conserva nodos pendientes en BFS y en DFS?
- ¿Qué operación de tu aplicación podría beneficiarse de organizar los datos de otra manera?
