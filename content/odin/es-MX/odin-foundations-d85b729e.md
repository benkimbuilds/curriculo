# Fundamentos de objetos

Un objeto reúne propiedades con pares clave–valor. Permite representar una entidad que tiene varias características, como un estudiante con nombre y puntuación. Los arreglos también son objetos, pero organizan elementos en posiciones ordenadas; no sustituyen todos los usos de un objeto con propiedades nombradas.

```javascript
const student = { name: "Ana", score: 12 };
console.log(student.name);
const key = "score";
console.log(student[key]);
student.score = 13;
student.active = true;
delete student.active;
console.log("name" in student);
```

El punto usa un nombre de propiedad escrito directamente. Los corchetes permiten una expresión, como una variable, o claves con espacios. `student.key` buscaría literalmente una propiedad key, no el valor de la variable key. `in` comprueba existencia y `delete` elimina una propiedad. Un objeto también puede contener funciones llamadas métodos.

Lee [objetos en JavaScript.info](https://javascript.info/object), sin realizar todavía sus tareas finales, y sigue [objetos básicos en MDN](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics), omitiendo constructores por ahora.

## Primitivos y referencias

Repasa [tipos primitivos](https://www.theodinproject.com/lessons/foundations-data-types-and-conditionals). Si asignas un número a otra variable, ambas contienen ese valor y reasignar una no modifica la otra:

```javascript
let data = 42;
let dataCopy = data;
dataCopy = 43;
console.log(data, dataCopy); // 42, 43
```

Si asignas un objeto, se copia una referencia al mismo objeto:

```javascript
const obj = { data: 42 };
const objCopy = obj;
objCopy.data = 43;
console.log(obj.data, objCopy.data); // 43, 43
```

No se crearon dos objetos. Ambos nombres llegan a la misma entidad. Eso explica por qué `const element = document.querySelector("#container")` seguido de `element.style.backgroundColor = "red"` cambia el nodo visible: element refiere al mismo nodo que está en el DOM, no a una copia desconectada.

## Parámetros y mutación

```javascript
function increaseCounterObject(objectCounter) {
  objectCounter.counter += 1;
}
function increaseCounterPrimitive(primitiveCounter) {
  primitiveCounter += 1;
}
const object = { counter: 0 };
let primitive = 0;
increaseCounterObject(object);
increaseCounterPrimitive(primitive);
console.log(object.counter, primitive); // 1, 0
```

JavaScript pasa valores a las funciones. Para un objeto, ese valor es una referencia: el parámetro local apunta a la misma entidad y puede mutarla. Para el número, modificar el parámetro no modifica la variable exterior. Evita resumir esto como si el nombre de la variable exterior se pasara directamente a la función.

Reasignar una referencia y mutar un objeto son operaciones diferentes:

```javascript
let animal = { species: "dog" };
let dog = animal;
animal = { species: "cat" };
console.log(animal.species); // cat
console.log(dog.species); // dog
```

animal ahora apunta a otro objeto; dog todavía apunta al primero. Un const impide reasignar la referencia, pero permite cambiar propiedades del objeto, salvo que alguna restricción adicional lo impida. Esta distinción será importante al organizar estado de aplicaciones.

## Actividad

1. En las [tareas de métodos de arreglos](https://javascript.info/array-methods#tasks), realiza sólo `Map to names`, `Map to objects`, `Sort users by age`, `Get average age` y `Create keyed object from array`.
2. Crea una copia y clona [JavaScript30 de Wes Bos](https://github.com/wesbos/JavaScript30). Abre los archivos `index-START.html` y sigue [Array Cardio Day 1](https://www.youtube.com/watch?v=HB1ZC7czKRs) y [Array Cardio Day 2](https://www.youtube.com/watch?v=QNmRfyNg1lw).
3. En [foundations/object_basics](https://github.com/TheOdinProject/javascript-exercises/tree/main/foundations/object_basics), lee cada README y completa en orden `01_calculator`, `02_palindromes`, `03_fibonacci`, `04_getTheTitles` y `05_findTheOldest`. Consulta la [guía del repositorio](https://github.com/TheOdinProject/javascript-exercises#how-to-use-these-exercises) para ejecutar pruebas. Las soluciones son para comparar después de tu intento.

Si te sobrepasa una combinación de arreglos y objetos, separa una operación a la vez y vuelve a las lecturas. Puedes pedir orientación en el [Discord](https://discord.gg/fbFCkYabZB) sin entregar el problema entero a otra persona.

## Comprobación

- ¿Cómo difieren objetos y arreglos?
- ¿Cuándo usas punto y cuándo corchetes?
- ¿Qué ocurre al asignar o pasar a una función un primitivo frente a un objeto?
- ¿Qué distingue mutar una propiedad de reasignar una variable?
## Profundiza con el ejemplo

Para comprobar referencias, crea dos variables apuntando al mismo objeto y una tercera apuntando a otro con propiedades idénticas. Compara las referencias con igualdad estricta: las dos primeras coinciden; la tercera no, aunque sus datos se vean iguales. Igualdad de objetos no compara automáticamente todo su contenido. Anota esa diferencia antes de usar objetos en condiciones o pruebas.
