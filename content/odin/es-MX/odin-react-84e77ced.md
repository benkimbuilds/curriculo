# Keys e identidad en React

Cuando React vuelve a renderizar, compara la nueva descripción de interfaz con la anterior para decidir qué cambios aplicar al DOM. Las keys ayudan a identificar elementos entre renderizados. No son un mecanismo general para impedir que una función se ejecute: indican qué instancia corresponde a qué dato y qué estado debe conservarse.

En JSX escrito de forma estática, la posición y el tipo suelen bastar para identificar componentes. Una lista dinámica puede insertar, eliminar o reordenar elementos. React necesita información adicional para saber que la tarea «alimentar al gato» sigue siendo la misma aunque ahora aparezca primero.

## Elegir una key

```jsx
const initialTodos = [
  { id: "patio", task: "Cuidar el patio" },
  { id: "odin", task: "Trabajar en el proyecto" },
  { id: "gato", task: "Alimentar al gato" },
];

function TodoList() {
  return <ul>{initialTodos.map(todo => <li key={todo.id}>{todo.task}</li>)}</ul>;
}
```

Usa un identificador de la base de datos o genera uno al crear el registro, por ejemplo con [crypto.randomUUID()](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) en el evento de agregar una tarea. Consérvalo junto al dato. La key debe ser única entre hermanos, no en toda la aplicación. Si `map` devuelve un componente, la key va en ese componente superior.

`key` es información interna de React. El componente no la recibe en `props`; si necesita el identificador para eliminar o editar, pásalo también como `id`.

## Dos errores frecuentes

El índice representa la posición, no la identidad. Puede funcionar en una colección realmente fija, como los doce meses, pero cuando se elimina o reordena una fila puede asociar el estado de un input con otro registro. Una prueba útil es editar una fila y después insertar una nueva al inicio.

Una key aleatoria generada al renderizar es peor: cambia en cada render y React interpreta que todas las instancias son nuevas. Esto puede perder foco, texto y estado.

```jsx
// Incorrecto: crea una identidad nueva cada vez que se renderiza.
todos.map(todo => <li key={crypto.randomUUID()}>{todo.task}</li>);

// Correcto: usa la identidad guardada en los datos.
todos.map(todo => <li key={todo.id}>{todo.task}</li>);
```

## Reiniciar estado deliberadamente

También puedes cambiar una key para pedir una instancia nueva de un componente:

```jsx
function GamePage() {
  const [round, setRound] = useState(0);
  return <Game key={round} resetGame={() => setRound(value => value + 1)} />;
}
```

Importa `useState` desde React. Mientras `round` no cambia, `Game` conserva su estado durante actualizaciones. Al incrementarlo, React desmonta el juego anterior y monta otro con estado inicial, sin recargar la página ni reiniciar hermanos. Es útil cuando deseas reiniciar todo el subárbol; no lo uses para ocultar un modelo de estado incorrecto.

## Un experimento de identidad de filas

Construye tres filas, cada una con el nombre de una tarea y un input donde puedas escribir una nota local. Usa primero el índice como key. Escribe una nota en la segunda fila y elimina la primera. Los datos de la segunda tarea ahora ocupan la primera posición, mientras React puede conservar el input que asociaba con esa posición. El resultado permite ver el problema: el estado local está siguiendo la posición y no el registro.

Ahora repite el experimento con el ID guardado en cada tarea. Al desaparecer una tarea, su instancia desaparece; las demás conservan su identidad aunque cambien de posición. La nota permanece con el registro correcto. Lo mismo importa al ordenar alfabéticamente, insertar al principio o recibir otra ordenación desde una API. No hace falta un error en consola para que una key incorrecta produzca un defecto visible.

Compara ese caso con los meses del año. Si la colección es fija y no tiene edición, inserción ni reordenamiento, un índice puede parecer suficiente. Sin embargo, una necesidad futura como mostrar solo algunos meses rompe el supuesto. Por eso conviene elegir una propiedad estable del dato cuando existe. La regla no consiste en que todo índice sea sintácticamente inválido; consiste en que expresa una identidad por posición que muchas aplicaciones no pueden garantizar.

Generar IDs también tiene un momento correcto. Puedes hacerlo al inicializar datos de ejemplo una sola vez o al manejar la creación de un registro. No lo hagas dentro del callback de `map` durante render. En aplicaciones renderizadas en servidor, tampoco generes identidades aleatorias nuevas de forma independiente en servidor y navegador para el mismo contenido: conserva IDs en los datos que cruzan esa frontera.

En el reinicio de un juego, cambiar la key es intencional. Imagina que `Game` tiene puntuación, selección, temporizador y componentes hijos con su propio estado. Reiniciar manualmente solo la puntuación puede dejar otros valores viejos. Una key nueva comunica que toda la instancia anterior terminó. Pero si solo quieres cambiar el marcador conservando una conversación hermana, coloca la key en el juego, no en un ancestro que también envuelva la conversación. La ubicación del límite decide qué memoria se conserva y cuál se descarta.

## Actividades y comprobación

1. Lee la [sección oficial de keys](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key).
2. Mira la [demostración del índice como key](https://youtu.be/xlPxnc5uUPQ) y reproduce el fallo con inputs editables.
3. Corrige la lista usando IDs persistentes; luego agrega un reinicio por key a un contador hijo.

- ¿Por qué una lista dinámica necesita keys explícitas?
- ¿Dónde se asigna una key y por qué no aparece en las props?
- ¿Cuándo puede fallar una key basada en índice o azar?
- ¿Qué ocurre con el estado cuando cambias deliberadamente la key?
