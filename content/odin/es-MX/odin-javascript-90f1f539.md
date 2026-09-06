# Proyecto: HashMap

Implementa una tabla hash con claves de texto, buckets y resolución de colisiones. No delegues almacenamiento a un `Map` nativo: el propósito es construir su mecanismo. Puedes reutilizar una lista enlazada por bucket o una estructura de encadenamiento equivalente que permita almacenar varias parejas.

## Límites del arreglo

JavaScript permite asignar un índice mayor que la longitud inicial de un arreglo. En este ejercicio eso escondería un error de distribución, así que valida cada acceso a buckets:

```js
if (index < 0 || index >= buckets.length) {
  throw new Error("Índice fuera de los buckets disponibles");
}
```

La clase o fábrica `HashMap` comienza con `capacity = 16` y factor de carga `0.75`. Distingue capacidad, número de entradas y carga actual. Un bucket con tres entradas cuenta tres claves, no un solo elemento para el cálculo de carga.

## Interfaz obligatoria

1. `hash(key)` acepta una cadena y devuelve el índice correspondiente a la capacidad actual. Puedes usar el algoritmo de 31 de la lección anterior. Aplica `% capacity` en cada iteración para no acumular enteros inexactos con claves largas.
2. `set(key, value)` inserta una clave nueva o reemplaza el valor de la misma clave. Colisión significa claves diferentes con el mismo índice; no debes reemplazar una por la otra. Cuando una nueva entrada supera el umbral, duplica capacidad y redistribuye todas las parejas.
3. `get(key)` devuelve su valor, o `null` si la clave no existe.
4. `has(key)` devuelve un booleano. No lo implementes como `Boolean(get(key))`, porque cero, false o cadena vacía pueden ser valores válidos.
5. `remove(key)` elimina la entrada exacta y devuelve true; si no existe, devuelve false.
6. `length()` devuelve cantidad de claves almacenadas.
7. `clear()` elimina todas las entradas. Documenta si conserva o reinicia capacidad.
8. `keys()` devuelve un arreglo con todas las claves.
9. `values()` devuelve todos los valores, incluso cuando se repiten para claves diferentes.
10. `entries()` devuelve parejas como `[["firstKey", "firstValue"], ["secondKey", "secondValue"]]`.

El orden de esas listas no tiene que coincidir con el de inserción. Para probarlas, compara conjuntos o versiones ordenadas por clave, sin exigir un orden accidental de buckets.

## Crecimiento y colisiones

Busca la clave antes de aumentar el contador: una actualización mantiene el tamaño. Durante el rehash, reinserta todas las entradas usando la nueva capacidad y evita duplicar el contador o disparar otro crecimiento innecesario. Después de eliminar un nodo de una cadena, sus vecinos deben seguir conectados; prueba cabeza, medio y final del mismo bucket.

La función hash no sustituye la comparación de claves. Aunque dos entradas compartan índice, `get` y `remove` deben distinguirlas. Conserva también la clave original en cada nodo; almacenar solamente el hash hace imposible resolver esa ambigüedad.

## Demostración requerida

Conserva una demostración explícita de colisiones encontrando dos claves que tu función envíe al mismo índice. No basta con insertar muchos valores y asumir que alguna colisión ocurrió. Registra ambas claves, su índice, los valores recuperados y el resultado después de eliminar una. Esa evidencia comprueba el mecanismo que distingue una tabla correcta de un arreglo que sobrescribe entradas.

```js
const test = new HashMap();
test.set("apple", "red");
test.set("banana", "yellow");
test.set("carrot", "orange");
test.set("dog", "brown");
test.set("elephant", "gray");
test.set("frog", "green");
test.set("grape", "purple");
test.set("hat", "black");
test.set("ice cream", "white");
test.set("jacket", "blue");
test.set("kite", "pink");
test.set("lion", "golden");
```

Ahora la longitud debe ser 12 y la capacidad 16. Actualiza algunos valores: ninguno debe aumentar esas cantidades. Inserta `test.set("moon", "silver")`; la longitud pasa a 13 y la capacidad a 32. Comprueba que todas las claves anteriores siguen recuperables y que sus valores actualizados no se perdieron. Vuelve a actualizar y verifica todos los métodos después del crecimiento.

## Criterios de aceptación

- El escenario de doce entradas, actualizaciones y decimotercera inserción respeta exactamente las cantidades indicadas.
- Dos claves que colisionan conservan ambos valores; eliminar una no elimina la otra.
- Clave ausente produce `null` en get, false en has/remove, y no altera length.
- Valores `0`, `false`, `""` y `null` pueden almacenarse y se distinguen de pertenencia mediante has.
- Una clave larga siempre produce un índice dentro de la capacidad.
- `clear` deja longitud cero y colecciones vacías; la tabla puede reutilizarse.

Como extensión, implementa `HashSet` con claves sin valores. Entrega código, pruebas y una explicación del costo de crecer. No uses esta función hash para contraseñas: consulta la distinción de seguridad de la lección anterior.
