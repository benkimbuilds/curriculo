# Proyecto: listas enlazadas

Una lista enlazada guarda nodos conectados en secuencia. Cada nodo contiene un valor y una referencia al siguiente; el último apunta a `null`. `head` identifica el inicio y `tail` el final. Insertar después de un nodo conocido puede requerir solo cambiar enlaces, pero encontrar primero ese nodo puede requerir recorrer la lista.

```text
[cabeza] -> [nodo] -> [cola] -> null
```

JavaScript ofrece arreglos dinámicos y métodos de inserción, así que no necesitas una lista enlazada para superar un tamaño fijo en tus proyectos habituales. Sin embargo, las operaciones de arreglos no son todas de costo constante, y construir una lista te prepara para árboles y grafos. Este proyecto es una implementación educativa, no una obligación de sustituir colecciones nativas.

## Tipos y contrato

Crea `Node` como clase o fábrica con `value` y `nextNode`, ambos `null` por defecto. Crea `LinkedList` para representar la lista completa. Mantén el nodo inicial internamente para evitar confundir la propiedad con el método público `head()`.

Implementa todas estas operaciones, respetando el contrato de la versión de Odin utilizada:

1. `append(value)` agrega un nodo al final.
2. `prepend(value)` agrega al principio.
3. `size()` devuelve el total de nodos.
4. `head()` devuelve el **valor** del primero, o `undefined` si está vacía.
5. `tail()` devuelve el **valor** del último, o `undefined` si está vacía.
6. `at(index)` devuelve el valor en esa posición, o `undefined` si no existe.
7. `pop()` elimina el nodo de la **cabeza** y devuelve su valor; en vacío devuelve `undefined`. No copies aquí el comportamiento de `Array.pop`, que retira el extremo final: el contrato del ejercicio es distinto.
8. `contains(value)` devuelve un booleano.
9. `findIndex(value)` devuelve la primera posición coincidente, o `-1` si no existe.
10. `toString()` devuelve `""` en vacío y, en una lista poblada, el formato `( value ) -> ( value ) -> null`.

No implementes la lista guardando todos los datos en un arreglo y delegando sus operaciones. Debes practicar nodos y enlaces. Puedes recorrerlos con un cursor local que avanza con `cursor = cursor.nextNode`. Al llegar a `null`, termina.

## Extensiones opcionales

`insertAt(index, ...values)` inserta varios nodos conservando su orden. Permite índices desde cero hasta el tamaño actual, inclusive; fuera de ese intervalo lanza `RangeError`. `removeAt(index)` retira una posición existente y lanza `RangeError` si es negativa o mayor o igual que el tamaño.

```text
Antes: ( 1 ) -> ( 2 ) -> ( 3 ) -> null
insertAt(1, 10, 11)
Después: ( 1 ) -> ( 10 ) -> ( 11 ) -> ( 2 ) -> ( 3 ) -> null
```

Antes de reasignar enlaces, dibuja qué referencia debes conservar. Si cambias `nextNode` antes de guardar el resto de la cadena, puedes perder acceso a nodos que debían permanecer. Revisa especialmente insertar o eliminar cabeza y cola, y pasar de una lista de un nodo a vacío.

## Prueba de demostración

En `main.js`, importa tu implementación y ejecuta:

```js
const list = new LinkedList();
for (const animal of ["dog", "cat", "parrot", "hamster", "snake", "turtle"]) {
  list.append(animal);
}
console.log(list.toString());
// ( dog ) -> ( cat ) -> ( parrot ) -> ( hamster ) -> ( snake ) -> ( turtle ) -> null
```

## Criterios de aceptación

- En vacío, tamaño cero, `head/tail/at/pop` devuelven `undefined`, `findIndex` devuelve `-1` y `toString` devuelve cadena vacía.
- Tras agregar A y B, `head()` es A, `tail()` es B y `pop()` devuelve A, dejando B.
- Agregar al inicio y final conserva el orden; buscar un valor repetido devuelve la primera coincidencia.
- Después de vaciar la lista se puede volver a agregar y recorrer sin ciclos.
- Si implementas extras, insertar varios valores conserva orden y los índices fuera de rango lanzan el error acordado.

Consulta [listas en lenguaje sencillo](https://www.youtube.com/watch?v=oiW79L8VYXk), [qué es una lista enlazada](https://dev.to/vaidehijoshi/whats-a-linked-list-anyway), los [diagramas de CMU](https://web.archive.org/web/20200217010131/http://www.cs.cmu.edu/~adamchik/15-121/lectures/Linked%20Lists/linked%20lists.html) y [cuándo son necesarias](https://dev.to/karimdevelops/are-linked-lists-necessary-2ckl). Entrega pruebas ejecutables, demo y una explicación de costos de búsqueda e inserción.
