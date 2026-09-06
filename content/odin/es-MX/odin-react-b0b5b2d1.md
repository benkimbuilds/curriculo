# Componentes de React

Un componente es una pieza de interfaz que puedes combinar con otras y reutilizar. Un sitio puede dividirse en `App`, una barra de navegación, el artículo principal y un formulario de boletín. La división depende de responsabilidades y datos, no de un número arbitrario de líneas.

## Crear y montar un componente

Los componentes de función son funciones de JavaScript que devuelven elementos de React, generalmente escritos con JSX. Usa el proyecto preparado en la lección anterior y crea `Greeting.jsx`:

```jsx
function Greeting() {
  return <h1>Bienvenida al taller</h1>;
}

export default Greeting;
```

El nombre empieza con mayúscula. JSX interpreta `Greeting` como componente y `h1` como etiqueta HTML. Escribir `greeting` no invoca automáticamente tu función. Los nombres en PascalCase hacen visible esa diferencia.

Un archivo separado ayuda a reutilizar el componente, pero guardarlo no basta para mostrarlo. Debes exportarlo, importarlo y colocarlo en un árbol que React renderice:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Greeting from "./Greeting.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode><Greeting /></StrictMode>
);
```

En el laboratorio Vite ese código pertenece a `main.jsx`. En Next.js, importa `Greeting` dentro de una página y devuélvelo desde su componente; el framework realiza el montaje. El JSX moderno no requiere `import React` solamente por escribir etiquetas, aunque sí debes importar APIs como `useState` cuando las utilices.

## Exportaciones

Una exportación predeterminada permite escoger el nombre local del import. Una exportación nombrada exige usar el nombre exportado entre llaves, salvo que lo renombres con `as`:

```jsx
// FavoriteFood.jsx
export function FavoriteFood() {
  return <p>Mi comida favorita son los tacos de frijol.</p>;
}

// App.jsx
import Greeting from "./Greeting.jsx";
import { FavoriteFood } from "./FavoriteFood.jsx";

export default function App() {
  return <main><Greeting /><FavoriteFood /></main>;
}
```

Un componente no necesita estado para ser útil. Esta separación permite cambiar el saludo sin alterar el contenido de comida. Tampoco conviene declarar una nueva función de componente dentro de otra en cada render: define componentes a nivel de módulo para conservar una identidad estable.

## Seguir el árbol de componentes

Piensa en `App` como el punto donde se combinan responsabilidades. Puede devolver navegación, artículo y formulario como hijos. El formulario a su vez puede incluir una etiqueta y un input. No todos esos elementos necesitan ser componentes propios: extrae una pieza cuando tenga una responsabilidad coherente, una interfaz de props clara o una reutilización real. Cuando un componente resulta independiente, puedes cambiar su implementación sin obligar al resto de la página a conocer esos detalles.

Compara crear una función con utilizarla. Declarar `Greeting` establece una receta; escribir `<Greeting />` la incorpora al árbol que React evaluará. No llames componentes directamente como funciones para saltarte ese árbol. React necesita controlar sus instancias y, posteriormente, sus hooks. También revisa la extensión del archivo: la herramienta debe interpretar JSX. Si copias un componente a un archivo configurado como JavaScript sin transformación adecuada, el problema puede ser del entorno, no del HTML ni de la función.

## Actividad

1. Escribe tu propio saludo y muéstralo desde `App`.
2. Agrega componentes para una comida y una actividad favorita; utiliza una exportación predeterminada y otra nombrada.
3. Cambia temporalmente una mayúscula por minúscula y observa la consola. Restaura después el nombre correcto.
4. Consulta la [referencia de export de MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export#description) si los imports fallan. Explica si el problema es la ruta, el tipo de exportación o el nombre.

## Comprueba lo aprendido

- ¿Qué recibe y devuelve un componente de función?
- ¿Cómo distingue JSX un componente de una etiqueta HTML?
- ¿Por qué exportar un componente no lo muestra automáticamente?
- ¿Cómo cambia el import entre una exportación predeterminada y una nombrada?
