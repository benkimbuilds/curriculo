# Técnicas de renderizado

Una interfaz normalmente representa colecciones y decisiones. JSX permite colocar arreglos de elementos dentro de las llaves; por eso `map` convierte datos en una lista sin escribir cada elemento a mano.

```jsx
function ListItem({ animal }) {
  return <li>{animal}</li>;
}

function List({ animals }) {
  return <ul>{animals.map(animal => <ListItem key={animal} animal={animal} />)}</ul>;
}

export default function App() {
  return <List animals={["León", "Vaca", "Serpiente", "Lagartija"]} />;
}
```

El padre pasa el arreglo a `List`, que entrega cada valor a `ListItem`. También podrías guardar el resultado de `map` en `const items` antes del `return`. No hay diferencia conceptual: ambos producen un arreglo de elementos. «Lista» incluye opciones de un select, tarjetas de un grid y cualquier colección, no solamente etiquetas `li`.

Cada elemento superior devuelto por `map` necesita una `key`. En este ejemplo los nombres son únicos; con datos reales utiliza un identificador estable. Estudiaremos sus reglas en la lección siguiente. En proyectos JavaScript antiguos, ESLint puede advertir `missing in props validation`: es una regla de tipos de props. En un laboratorio sin esa validación puedes configurar `"react/prop-types": "off"`; en TypeScript declara el contrato de props, no ocultes errores de tipos generales.

## Decisiones con JSX

Para mostrar solo animales que empiezan por L, [startsWith](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith) devuelve la condición booleana y un ternario puede devolver un elemento o `null`:

```jsx
animals.map(animal => animal.startsWith("L")
  ? <li key={animal}>{animal}</li>
  : null);
```

`null` no muestra nada. También es posible `animal.startsWith("L") && <li key={animal}>{animal}</li>` porque una condición falsa no genera contenido. Ten cuidado con números: `items.length && <List />` muestra `0` cuando el arreglo está vacío. Usa `items.length > 0 && <List />`.

Para varias situaciones, retornos tempranos suelen leerse mejor que ternarios anidados:

```jsx
function List({ animals }) {
  if (!animals) return <p>Cargando animales…</p>;
  if (animals.length === 0) return <p>No hay animales en la lista.</p>;
  return <ul>{animals.map(animal => <li key={animal}>{animal}</li>)}</ul>;
}
```

La ausencia de datos y una colección vacía no son lo mismo. El primer caso puede representar una carga pendiente; el segundo una respuesta válida sin resultados. En una aplicación real modela también el error de red. Prueba el componente con la prop omitida, `[]` y un arreglo poblado. `if`, `if/else` o `switch` pueden decidir antes del retorno; no se insertan como sentencias directamente entre llaves de JSX.

## Comparar alternativas con el mismo comportamiento

Para una condición sencilla, el ternario comunica dos opciones: mostrar el elemento o no mostrar nada. `&&` comunica una opción que solo existe cuando la condición es verdadera. Cuando aparecen carga, error, vacío y éxito, encadenar ternarios puede obligarte a seguir demasiados paréntesis. Los retornos tempranos permiten leer cada caso por separado y dejan al final la ruta de éxito.

Eso no significa que una forma sea universalmente mejor. Escribe las dos versiones y verifica las mismas entradas. Si cambias la estructura de control, deben seguir siendo iguales los textos visibles, el número de elementos y el tratamiento de ausencia. Una simplificación de sintaxis que convierte una carga pendiente en lista vacía cambia comportamiento, aunque ocupe menos líneas.

También puedes filtrar antes de transformar: `animals.filter(animal => animal.startsWith("L")).map(...)`. `filter` produce un arreglo de los datos que cumplen la condición, mientras `map` produce los elementos que se mostrarán. Esta separación es especialmente útil si necesitas mostrar el número de coincidencias o reutilizar los datos filtrados. Calcula ese resultado una vez durante render en vez de mantener otra copia de estado.

Observa la función pasada a `map`. Con un cuerpo entre llaves debes escribir `return`; con una expresión directa puedes usar retorno implícito. Olvidar el retorno produce un arreglo de valores `undefined` y React no muestra las filas. Es un error de JavaScript, no de keys ni de estilos. Inspecciona el arreglo resultante antes de buscar el problema en CSS.

Por último, no confundas una condición de JavaScript con texto literal. Escribir `animal.startsWith("L")` fuera de las llaves en el contenido JSX imprime caracteres; dentro de las llaves evalúa la expresión. Las llaves de un comentario JSX contienen un comentario de JavaScript, no una etiqueta especial. Tener claro qué parte es expresión y qué parte es marcado ayuda a leer ejemplos más extensos sin perder el flujo.

## Actividad

1. Completa los ejemplos y retos de [Conditional Rendering](https://react.dev/learn/conditional-rendering).
2. Trabaja [Rendering Lists](https://react.dev/learn/rendering-lists), incluyendo una combinación de `filter` y `map`. La sección de keys se profundiza después.
3. Implementa los estados pendiente, vacío y poblado; cambia la misma solución a ternario y compara legibilidad.

## Comprueba lo aprendido

- ¿Qué devuelve `map` y cómo muestra React ese resultado?
- ¿Qué alternativas tienes para mostrar JSX condicionalmente?
- ¿Por qué una colección vacía necesita un mensaje diferente de una carga pendiente?
- ¿Qué error produce colocar un número a la izquierda de `&&`?
