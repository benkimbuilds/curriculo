# Concentrar cambios de estado en un reducer

Un reducer es una función pura que recibe el estado anterior y una acción, y devuelve el siguiente estado. La acción describe lo que ocurrió mediante un `type` y los datos necesarios. No debe mutar el estado, ejecutar peticiones ni depender de resultados aleatorios.

```js
export function reducer(state, action) {
  switch (action.type) {
    case "incremented_count":
      return { count: state.count + 1 };
    case "decremented_count":
      return { count: state.count - 1 };
    case "set_count":
      return { count: action.value };
    default:
      throw new Error("Acción desconocida: " + action.type);
  }
}
```

Cada rama devuelve un objeto nuevo. Al concentrar transiciones puedes revisar todas las reglas del contador en un lugar y probarlas sin montar React. El caso por defecto hace visible una acción no implementada en lugar de fallar silenciosamente.

## Cuándo conviene

Si un componente solo abre y cierra un panel, `useState` suele ser suficiente. Si muchos manejadores actualizan varios campos relacionados y cuesta seguir las reglas, un reducer puede separarlas de la presentación. Las acciones también dan un vocabulario para rastrear bugs: «producto agregado» expresa mejor la intención que varias llamadas dispersas a setters.

No elijas reducers por apariencia profesional. Agregar acciones y un switch a un booleano sencillo puede hacerlo más difícil de leer. `useState` y `useReducer` son herramientas equivalentes para mantener estado local y pueden coexistir.

## useReducer y dispatch

```jsx
import { useReducer } from "react";
import { reducer } from "./reducer";

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <section>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: "incremented_count" })}>Aumentar</button>
      <button onClick={() => dispatch({ type: "decremented_count" })}>Disminuir</button>
      <button onClick={() => dispatch({ type: "set_count", value: 0 })}>Reiniciar</button>
    </section>
  );
}
```

`useReducer` recibe función e inicialización y devuelve estado y `dispatch`. Al despachar, React aplica el reducer para calcular el siguiente render. Como con `useState`, el valor local no cambia inmediatamente dentro del mismo manejador. React usa `Object.is` para comparar; devolver el mismo objeto mutado puede impedir la actualización esperada.

Para migrar desde `useState`, primero identifica eventos y las transiciones que producen. Después reemplaza setters por acciones, mueve reglas al reducer y finalmente conecta `useReducer`. Conserva los efectos externos en manejadores o efectos apropiados. Genera IDs antes de despachar y entrégalos en la acción para que el reducer sea determinista.

## Actividades

1. Completa [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer), incluidos sus retos.
2. Lee [useReducer](https://react.dev/reference/react/useReducer), especialmente resolución de problemas e inicialización.
3. Agrega pruebas directas al reducer para incrementar, disminuir, establecer y rechazar una acción desconocida.
4. Migra una parte del carrito y comprueba que las pruebas de interacción siguen pasando.

## Comprueba lo aprendido

- ¿Qué recibe y devuelve un reducer y por qué debe ser puro?
- ¿Qué describe una acción y qué trabajo hace `dispatch`?
- ¿Cuándo sería mejor conservar `useState`?
- ¿Cómo migras lógica existente sin cambiar su comportamiento?
