# ¿Qué es JSX?

JSX es una extensión de sintaxis que permite escribir una descripción parecida a HTML dentro de JavaScript. No es HTML dentro de una cadena ni una nueva versión del DOM. Las herramientas lo transforman en llamadas que crean elementos de React: objetos que describen lo que quieres mostrar. Puedes usar React sin JSX mediante [createElement](https://react.dev/reference/react/createElement), pero JSX suele hacer más legible una interfaz. Consulta también la referencia de [Fragment](https://react.dev/reference/react/Fragment) cuando necesites agrupar sin agregar nodos.

La lógica de presentación y el marcado están relacionados: una condición determina qué mensaje se ve y un arreglo determina cuántas tarjetas aparecen. Reunirlos en un componente permite separar responsabilidades por piezas de interfaz, en lugar de separar únicamente por lenguaje de archivo.

## Las tres reglas

1. Devuelve una sola raíz. Para varios hermanos, envuélvelos en un elemento o en un fragmento `<>...</>`. El fragmento agrupa sin agregar una caja al DOM.
2. Cierra todas las etiquetas. Un input se escribe `<input />`; un elemento con contenido necesita cierre explícito, como `<li>Elemento</li>`.
3. Usa los nombres de propiedades de React. Por ejemplo `className`, `htmlFor`, `strokeWidth` y `onClick`. Los atributos `aria-*` y `data-*` conservan sus guiones.

Estas reglas producen JavaScript válido y objetos con las propiedades esperadas por React. No todos los nombres HTML se transforman de la misma manera; consulta la referencia cuando tengas dudas.

## Convertir marcado paso a paso

El siguiente bloque es HTML de partida, no JSX listo para devolver:

```html
<h1>Prueba</h1>
<svg><circle cx="25" cy="75" r="20" stroke="green" stroke-width="2" /></svg>
<form><input type="text"></form>
```

Primero envuelve los tres hermanos. Luego cierra el input. Finalmente cambia `stroke-width`. Resolver un error puede revelar el siguiente; no significa que la primera corrección lo haya creado.

```jsx
function Example() {
  const title = "Prueba";
  const color = "green";

  return (
    <>
      <h1>{title}</h1>
      <svg>
        <circle cx="25" cy="75" r="20" stroke={color} strokeWidth="2" />
      </svg>
      <form><input type="text" /></form>
    </>
  );
}
```

Las llaves abren un espacio para expresiones de JavaScript: una variable, una suma, una llamada o un ternario. No puedes insertar directamente una sentencia `if` donde se espera una expresión; realiza la decisión antes del `return` o usa una expresión apropiada. Para texto fijo, escribe texto entre etiquetas o un atributo entre comillas.

Un estilo inline recibe un objeto: `style={{ color: "green", fontSize: 20 }}`. La primera pareja de llaves introduce JavaScript; la segunda crea el objeto. No es una sintaxis especial de «dobles llaves». Tampoco devuelve automáticamente contenido visible un objeto arbitrario; muestra una propiedad suya.

## Leer los errores en orden

Una raíz duplicada impide interpretar toda la expresión. Al envolver los hermanos puedes revelar el siguiente problema, como una etiqueta abierta. Después de corregir la estructura, todavía puede existir una advertencia de propiedad DOM en la consola. Revisa ambos lugares: que la página aparezca no garantiza que desaparecieron todas las advertencias. Esta secuencia te permite aprender qué clase de regla incumpliste en lugar de cambiar varios detalles al azar.

## Actividades

1. Escribe el ejemplo original en tu laboratorio o en [react.new](https://react.new/) y corrige cada error por separado, revisando también la consola.
2. Lee [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx) y resuelve sus ejercicios finales.
3. Lee [JavaScript in JSX with Curly Braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces); cambia una cadena, un atributo y un objeto de estilo.
4. Cambia el fragmento por un `div` e inspecciona la diferencia en el DOM y el diseño.

## Comprueba lo aprendido

- ¿Qué representa un elemento de JSX después de transformarse?
- ¿Qué ventajas aporta reunir marcado y lógica de presentación?
- ¿Cuáles son las tres reglas y las excepciones para atributos ARIA?
- ¿Cómo referencias un valor dinámico y cómo distingues una expresión de una sentencia?
