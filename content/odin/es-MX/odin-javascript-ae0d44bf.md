# JSON

JSON es un formato de texto para intercambiar datos. Se parece a los literales de JavaScript, pero tiene reglas propias. Lo encontrarás al consumir APIs y guardar estructuras en almacenamiento local. No es un objeto vivo: primero recibes o guardas texto y después lo conviertes.

```json
{
  "title": "Leer sobre módulos",
  "done": false,
  "tags": ["javascript", "práctica"],
  "dueDate": null
}
```

Las claves y cadenas usan comillas dobles. Se permiten objetos, arreglos, números, cadenas, booleanos y `null`. No se permiten comentarios, comas finales, `undefined`, funciones ni sintaxis de clases. Una fecha suele viajar como cadena: JSON no tiene un tipo fecha propio.

## Convertir en ambas direcciones

```js
const task = { title: "Leer", done: false };
const text = JSON.stringify(task);
console.log(typeof text); // string
const restored = JSON.parse(text);
console.log(restored.title); // Leer
console.log(restored === task); // false
```

`JSON.stringify` produce texto y `JSON.parse` interpreta texto válido. El nuevo objeto no es la instancia original: no conserva su identidad, prototipo personalizado ni métodos. Si guardas objetos de una clase, deberás reconstruirlos o utilizar funciones que operen sobre datos simples.

Un documento incorrecto produce un error al analizarlo. Maneja ese caso en el límite donde entran los datos, y valida además su forma: ser JSON válido no garantiza tener los campos que tu programa necesita.

```js
function readTask(text) {
  const value = JSON.parse(text);
  if (!value || typeof value.title !== "string" || typeof value.done !== "boolean") {
    throw new TypeError("La tarea debe tener title y done");
  }
  return value;
}
```

## Tareas

1. Lee la [introducción a JSON de MDN](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON) y las referencias de [parse](https://www.w3schools.com/js/js_json_parse.asp) y [stringify](https://www.w3schools.com/js/js_json_stringify.asp).
2. Escribe un arreglo de dos libros como JSON y conviértelo a objetos. Vuelve a convertirlo a texto después de cambiar un estado de lectura.
3. Introduce una coma final y observa el error. Puedes revisar datos ficticios con un [validador JSON](https://jsonformatter.curiousconcept.com/); nunca pegues secretos o datos personales en servicios de terceros.

## Comprobación

- ¿Qué es JSON y en qué difiere de un literal JavaScript?
- ¿Qué función convierte texto en datos y cuál hace el proceso inverso?
- ¿Por qué un método de `Book` no reaparece automáticamente después de guardar y recuperar un libro?
