# Introducción al estado

El estado es la memoria de un componente. Una variable local común vuelve a calcularse cuando se ejecuta la función; React conserva el estado entre renderizados y ofrece una función para solicitar que cambie. Un menú abierto, el texto de un formulario o una selección de color son ejemplos.

Antes de continuar, lee [What is State?](https://academind.com/tutorials/what-is-state). Después clona el [repositorio de ejemplos de React de Odin](https://github.com/TheOdinProject/react-examples), entra a `state/`, instala dependencias con `npm install` y arranca con `npm run dev`. El ejemplo cambia el fondo con botones.

## useState

```jsx
import { useState } from "react";

const COLORS = ["white", "lavender", "lightblue"];

export default function ColorPicker() {
  const [backgroundColor, setBackgroundColor] = useState(COLORS[0]);
  const [changes, setChanges] = useState(0);

  function choose(color) {
    if (color === backgroundColor) return;
    setBackgroundColor(color);
    setChanges(previous => previous + 1);
  }

  return (
    <section style={{ backgroundColor }}>
      <p>Cambios de color: {changes}</p>
      {COLORS.map(color => <button key={color} onClick={() => choose(color)}>{color}</button>)}
    </section>
  );
}
```

`useState(initialValue)` devuelve un arreglo con dos valores: el estado de este render y una función para solicitar su actualización. La desestructuración les da nombres. React utiliza el valor inicial al montar esa instancia; en renderizados posteriores devuelve el estado que conserva. Para estados independientes puedes llamar `useState` más de una vez.

## Renderizar y confirmar

Al llamar a `setBackgroundColor`, React programa otra ejecución del componente. La nueva ejecución devuelve una descripción con el color actualizado. React compara esa descripción con la anterior y confirma los cambios necesarios en el DOM. Ejecutar la función de nuevo no significa reemplazar todos los nodos DOM ni borrar su estado.

Esto se suele describir mediante un árbol virtual y reconciliación. Lo importante para escribir componentes es mantener puro el render: con las mismas entradas, producir la misma descripción, sin iniciar temporizadores o peticiones en el cuerpo de la función. Los eventos expresan acciones del usuario y los efectos, que estudiarás después, sincronizan sistemas externos.

## Reglas de hooks

Los hooks se reconocen por el prefijo `use`. Llama `useState` al nivel superior de un componente de función o de otro hook. No lo coloques en loops, condiciones, manejadores ni después de un retorno condicional. React necesita un orden estable de llamadas para asociarlas con la memoria correcta.

En un archivo interactivo de Next.js agrega `"use client"` al inicio. Esto establece dónde comienza el código que usa hooks del navegador; no cambia las reglas de React.

## Seguir el ejemplo de colores

Durante el primer render React asocia cada llamada a `useState` con una posición en la instancia del componente. El valor inicial del color es el primero del arreglo y el contador empieza en cero. La función devuelve un árbol con botones cuyos callbacks capturan los datos de esa ejecución. Al pulsar otro color, el manejador solicita actualizar color y conteo. React puede agrupar esas solicitudes en un solo render, donde ambas llamadas devuelven sus valores nuevos.

Las variables locales, como una función declarada dentro del componente, se vuelven a crear al ejecutarlo. La memoria de `useState` no vive simplemente en esa variable local: React la conserva y la entrega de nuevo. Por eso cambiar `let backgroundColor` a mano no tendría el mismo efecto. No informa a React que debe producir otra descripción de interfaz y tampoco conserva un modelo fiable entre ejecuciones.

Distingue además render de commit. React puede evaluar componentes para decidir una actualización y después aplicar cambios concretos al DOM. No debes depender de que cada ejecución produzca necesariamente una modificación visible. Mantener puro el cuerpo del componente permite que React realice esas comprobaciones sin duplicar operaciones externas.

## Actividad

1. Lee [State: A Component's Memory](https://react.dev/learn/state-a-components-memory) y [Render and Commit](https://react.dev/learn/render-and-commit).
2. Revisa la explicación complementaria de [reconciliación](https://www.geeksforgeeks.org/reactjs-reconciliation/).
3. Agrega al ejemplo de Odin el número de cambios de fondo. Decide si pulsar el color actual cuenta como cambio y deja explícita esa regla.
4. Coloca un log en el manejador y otro durante render; explica su orden sin modificar el estado durante render.

## Comprueba lo aprendido

- ¿Qué recuerda el estado y qué devuelve `useState`?
- ¿Qué sucede desde un evento hasta que cambia el DOM?
- ¿Por qué el valor inicial no reinicia el componente en cada render?
- ¿Qué reglas debes seguir al llamar hooks?
