# Código asíncrono

Una solicitud de red puede tardar mucho más que una operación aritmética. El navegador necesita seguir respondiendo mientras espera. JavaScript coordina esas operaciones con callbacks, promesas y el ciclo de eventos. Asíncrono no significa que cada función ejecute JavaScript en otro hilo ni que el orden deje de importar.

## Callbacks

Un callback es una función que pasas a otra para que la invoque. Ya usaste callbacks en `addEventListener`, donde el navegador llama tu función cuando ocurre un evento. No todos son asíncronos: el callback de `map` normalmente se ejecuta durante la llamada a `map`.

```js
console.log("inicio");
setTimeout(() => console.log("temporizador"), 0);
console.log("fin");
// inicio, fin, temporizador
```

El tiempo cero no interrumpe la pila actual. El callback queda listo para una ejecución posterior. Encadenar varias operaciones dependientes con callbacks anidados puede dificultar seguir el orden y propagar errores: ese patrón se conoce como *callback hell*.

## Promesas

Una promesa representa el resultado eventual de una operación. Comienza pendiente y termina cumplida con un valor o rechazada con una razón. Una vez resuelta, no vuelve a cambiar de estado. No es el dato final en sí.

```js
function getData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ title: "Módulos" }), 200);
  });
}
const pending = getData();
pending.then((data) => console.log(data.title));
console.log("La interfaz puede seguir trabajando");
```

Intentar `getData().title` lee una propiedad de la promesa, no del resultado futuro. `.then` registra qué hacer cuando esté disponible y devuelve otra promesa. Si su callback devuelve un valor, ese valor continúa la cadena; si devuelve una promesa, la cadena espera su resultado; si lanza un error, la cadena se rechaza.

```js
getData()
  .then((data) => data.title.toUpperCase())
  .then((title) => console.log(title))
  .catch((error) => console.error("No pudimos cargar", error));
```

Olvidar `return` en un bloque con llaves puede hacer que el siguiente paso reciba `undefined`. Un `.catch` permite manejar rechazos anteriores. Si recuperas el error sin volver a lanzarlo, la cadena puede continuar como cumplida: decide si quieres recuperar o propagar.

## Ciclo de eventos

La pila ejecuta las llamadas actuales. El entorno se encarga de eventos y temporizadores. Los callbacks de promesas usan una cola de microtareas que se procesa al terminar la pila antes del siguiente turno de tareas como un temporizador. Prueba `Promise.resolve().then(() => console.log("promesa"))` entre los dos mensajes del primer ejemplo y predice el orden: inicio, fin, promesa, temporizador.

Las promesas organizan resultados únicos, especialmente una secuencia de solicitudes. Los eventos que ocurren repetidamente siguen encajando bien con callbacks y listeners. No necesitas transformar cada callback en promesa.

## Tareas

1. Lee [callbacks en Art of Node](https://github.com/maxogden/art-of-node#callbacks), [introducción a promesas](https://davidwalsh.name/promises) y [promesas básicas](https://javascript.info/promise-basics).
2. Mira [promesas en práctica](https://youtu.be/DHvZLI7Db8E), [qué es el event loop](https://www.youtube.com/watch?v=8aGhZQkoFbQ), su [visualización](https://www.youtube.com/watch?v=eiC58R16hb8) y la [visualización de promesas](https://www.youtube.com/watch?v=Xs1EMmBLpn4).
3. Modifica `getData` para rechazar deliberadamente y comprueba la ruta de error. Agrega una transformación y demuestra qué sucede si omites su retorno.

## Comprobación

- ¿Qué es un callback y por qué no siempre es asíncrono?
- ¿Qué representa una promesa y qué devuelve `.then`?
- ¿Cuándo una promesa simplifica una cadena de callbacks?
- ¿Por qué el temporizador con cero no se ejecuta antes de `console.log("fin")`?
