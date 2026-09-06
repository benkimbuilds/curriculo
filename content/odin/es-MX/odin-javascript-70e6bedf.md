# Async y await

`async` y `await` permiten expresar operaciones basadas en promesas con una lectura parecida al código secuencial. No eliminan las promesas ni bloquean toda la aplicación. Una función `async` siempre devuelve una promesa; `await` pausa la continuación de esa función hasta que se resuelva el valor esperado.

## Dos formas del mismo flujo

```js
const server = {
  people: [{ name: "Odin", age: 20 }, { name: "Thor", age: 35 }, { name: "Freyja", age: 29 }],
  getPeople() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.people), 2000);
    });
  },
};
function getPersonWithThen(name) {
  return server.getPeople().then((people) => people.find((person) => person.name === name));
}
async function getPerson(name) {
  const people = await server.getPeople();
  return people.find((person) => person.name === name);
}
getPerson("Freyja").then(console.log);
```

Ambas funciones devuelven una promesa, no una persona de forma inmediata. `return person` dentro de la función async cumple esa promesa con la persona. Lanzar un error la rechaza. Puedes escribir funciones async declaradas, expresiones o flechas: `const load = async () => ...`.

## Errores

Puedes agregar `.catch` donde llamas a la función o usar `try/catch` dentro. Elige dónde existe información suficiente para recuperar el fallo. No conviertas un error en éxito vacío por accidente.

```js
async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
}

async function showImage(url) {
  const status = document.querySelector("#status");
  try {
    status.textContent = "Cargando…";
    const body = await getJson(url);
    const imageUrl = body.data?.images?.original?.url;
    if (typeof imageUrl !== "string") throw new Error("Falta la imagen");
    document.querySelector("#result").src = imageUrl;
    status.textContent = "Imagen lista";
  } catch (error) {
    status.textContent = "No se pudo cargar. Intenta otra vez.";
    console.error(error);
  }
}
```

Esta es la conversión del ejemplo de Giphy de la lección anterior: espera la respuesta, espera su JSON, extrae la URL y actualiza la imagen. Conserva las mismas reglas sobre claves y errores HTTP. Para probarlo sin una clave, llama `showImage("./giphy-example.json")` con el fixture anterior.

## Alcance y concurrencia

Dentro de una función normal no puedes utilizar `await`; marca esa función como async. El nivel superior admite await en módulos, pero no en scripts clásicos. Envolver el flujo en una función también te permite invocarlo desde un evento.

Un detalle frecuente: `forEach(async (...) => ...)` no espera las promesas devueltas por sus callbacks. Para operaciones dependientes usa un bucle `for...of` con await. Para operaciones independientes, usa `Promise.all(items.map(async (...) => ...))` y espera la promesa conjunta. Concurrencia no significa que sea correcto disparar miles de solicitudes al mismo tiempo; respeta límites.

```js
const names = ["Odin", "Thor"];
const people = await Promise.all(names.map((name) => getPerson(name)));
console.log(people.length); // 2, en un módulo
```

## Convertir sin cambiar el contrato

Para refactorizar una cadena, identifica cada frontera asíncrona por separado. En el ejemplo de imágenes, fetch produce una respuesta; json produce los datos; asignar src utiliza una propiedad de esos datos. Primero introduce una función async y conserva dentro la cadena existente. Después sustituye el primer then por await fetch, y finalmente sustituye el then de json por await response.json. Ese trabajo gradual permite comparar resultados después de cada cambio.

No basta con escribir async delante de una función que inicia una operación y olvida devolverla. El llamador necesita una promesa que represente la finalización del trabajo que le prometiste. Si disparas otra promesa sin esperarla ni devolverla, tu función puede terminar antes y dejar un rechazo sin gestionar.

## Elegir dónde recuperar un error

Un catch dentro de getPerson puede mostrar un mensaje, devolver un valor de recuperación o volver a lanzar el error. Cada opción cambia lo que recibe quien la llama. Si simplemente registras el error y no devuelves nada, la función termina cumplida con undefined. Eso puede ser correcto para una acción que solo informa al usuario, pero peligroso para una función cuyo consumidor espera siempre una persona.

Mantén las consultas separadas de la presentación cuando facilite expresar el contrato. getJson puede rechazar si falla la red; showImage puede traducir ese rechazo a un mensaje visible. Así las pruebas pueden comprobar errores de la consulta sin depender de elementos de la página. Para acciones de interfaz, finally puede restaurar un botón o indicador tanto en éxito como en fallo, sin ocultar cuál ocurrió.

## Tareas

1. Convierte la búsqueda de imágenes de `.then/.catch` a async/await manteniendo búsqueda, botón y mensajes.
2. Provoca el mismo error en ambas versiones y compara el resultado visible.
3. Lee [async/await](https://javascript.info/async-await), los [ejemplos adicionales](https://codeburst.io/javascript-es-2017-learn-async-await-by-example-48acc58bad65) y observa la explicación de [Wes Bos](https://www.youtube.com/watch?v=9YkUCxvaLEk).

## Comprobación

- ¿Qué devuelve una función async aunque su `return` contenga un número?
- ¿Qué pausa await y qué sigue ejecutándose mientras tanto?
- ¿Qué ocurre al lanzar un error y dónde puedes atraparlo?
- ¿Por qué `forEach` no espera sus callbacks async?
