# Proyecto: árboles binarios de búsqueda

Al revisar el invariante, compara un nodo con todos los límites heredados de sus ancestros, no únicamente con sus hijos inmediatos. Un valor puede ser mayor que su padre y aun estar incorrectamente colocado dentro del subárbol izquierdo de un ancestro menor. El recorrido inorden estrictamente creciente ayuda a detectar ese problema global.

Construye un BST inicialmente balanceado a partir de números. Para cada nodo, todos los valores de su izquierda deben ser menores y todos los de su derecha mayores. No permitas duplicados. La raíz inicia el árbol; una hoja no tiene hijos. Balancear ayuda a mantener caminos cortos, pero inserciones posteriores pueden volver a desbalancearlo.

Lee sobre [construcción de un BST balanceado](https://www.geeksforgeeks.org/sorted-array-to-balanced-bst/) y mira la [explicación en video](https://youtu.be/VCTP81Ij-EM). Traduce la idea a pseudocódigo aunque el recurso use otro lenguaje.

## Construcción y búsqueda

1. Crea `Node` con `data`, `left` y `right`, usando `null` para hijos ausentes.
2. Crea `Tree` que recibe un arreglo y guarda `root` como resultado de `buildTree(array)`.
3. `buildTree` ordena números y elimina duplicados; elige el elemento medio como raíz y repite con ambas mitades. Devuelve el nodo de nivel cero, o null en vacío. Puede ser privado.
4. `includes(value)` recorre comparando con el nodo actual y devuelve true/false.
5. `insert(value)` agrega un nodo en la posición que conserva el invariante. Si el valor ya existe, no hace nada.
6. `deleteItem(value)` elimina un valor existente sin romper el orden; si no existe, no hace nada.

No implementes buscar, insertar o borrar mediante el arreglo original: después de construir, trabaja sobre nodos y enlaces. Los costos útiles del árbol dependen de recorrer su altura, no de rehacer una colección completa para cada operación. Puedes consultar [inserción](https://www.geeksforgeeks.org/insertion-in-binary-search-tree/?ref=lbp) y [eliminación](https://www.geeksforgeeks.org/binary-search-tree-set-2-delete/?ref=lbp).

Al borrar, distingue tres casos: una hoja se desconecta; un nodo con un hijo se sustituye por ese hijo; con dos hijos, puedes sustituir su dato por el sucesor inorden (mínimo de la rama derecha) y retirar después ese sucesor de su posición anterior. Trata también borrar la raíz, que puede cambiar la referencia `root`.

## Recorridos con callbacks

Implementa `levelOrderForEach(callback)` en amplitud. Usa una cola para los hijos pendientes; llama al callback con cada **valor**, no con el nodo completo. Prueba versión iterativa y, si deseas profundizar, recursiva. Si no proporcionas callback, lanza un Error.

Implementa `inOrderForEach`, `preOrderForEach` y `postOrderForEach`, también con callback obligatorio y valores como argumentos. Sus órdenes son izquierda/nodo/derecha, nodo/izquierda/derecha e izquierda/derecha/nodo respectivamente. En vacío no hay llamadas, pero el argumento sigue debiendo ser válido.

```js
const ordered = [];
tree.inOrderForEach((value) => ordered.push(value));
console.log(ordered);
```

Consulta [amplitud con cola](https://www.youtube.com/watch?v=86g8jAQug04) y [los tres recorridos de profundidad](https://www.youtube.com/watch?v=gm8DUJJhmY4).

## Altura, profundidad y balance

`height(value)` devuelve el número de aristas del camino más largo desde ese nodo a una hoja. Una hoja tiene altura cero. `depth(value)` cuenta aristas desde la raíz hasta el nodo; la raíz tiene profundidad cero. Ambos devuelven `undefined` si el valor no existe.

`isBalanced()` comprueba para **cada nodo** que la diferencia de alturas de sus subárboles no supera uno. Comparar únicamente los dos hijos de la raíz es insuficiente: una rama interna puede estar desbalanceada aunque las alturas globales coincidan. Puedes usar altura -1 para un subárbol vacío como convención interna coherente.

`rebalance()` obtiene los valores mediante un recorrido inorden y reconstruye el árbol con `buildTree`. Debe conservar todos los valores actuales, incluidas inserciones y exclusiones por borrado; no reutilices el arreglo inicial obsoleto.

## Ver el árbol

Puedes incorporar esta utilidad de Odin en el script de demostración, separada del contrato del árbol:

```js
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null || node === undefined) return;
  prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
};
```

## Demostración y aceptación

1. Construye un árbol con valores aleatorios menores que 100. Para pruebas reproducibles conserva además un arreglo fijo.
2. Confirma balance e imprime todos los valores en los cuatro órdenes.
3. Inserta varios valores mayores que 100 en orden hasta desbalancearlo y confirma el resultado.
4. Ejecuta rebalance, confirma balance y vuelve a mostrar los recorridos.

Las pruebas deben cubrir vacío, un nodo, duplicados, valor ausente y eliminación de hoja, nodo con un hijo, nodo con dos hijos y raíz. Para `[4,2,6,1,3,5,7]`, el inorden debe ser `[1,2,3,4,5,6,7]`, raíz de profundidad cero y hojas de altura cero. Después de cada cambio, verifica orden estricto del inorden y que no faltan valores. Llamar a un recorrido sin callback debe fallar con un mensaje claro. Entrega el script, las pruebas y una explicación de por qué el costo puede pasar de O(log n) a O(n) si el árbol se convierte en cadena.
