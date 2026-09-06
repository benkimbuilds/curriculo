# Simular callbacks y componentes en pruebas

Un mock sustituye una dependencia para observar cómo interactúa con ella el código que pruebas. En React es frecuente recibir callbacks por props. El componente puede ignorar lo que hace el callback y aun así tener un contrato claro: llamarlo cuando corresponde, con los argumentos correctos, nunca durante render.

## Probar un callback

```jsx
export function CustomButton({ onClick }) {
  return <button onClick={onClick}>Continuar</button>;
}
```

```jsx
import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomButton } from "./CustomButton";

it("llama al callback solamente después de pulsar", async () => {
  const onClick = vi.fn();
  const user = userEvent.setup();
  render(<CustomButton onClick={onClick} />);
  expect(screen.getByRole("button", { name: "Continuar" })).toBeInTheDocument();
  expect(onClick).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: "Continuar" }));
  expect(onClick).toHaveBeenCalledTimes(1);
});
```

`vi.fn()` conserva información sobre llamadas. Puedes separar las tres comprobaciones en pruebas distintas: contenido, ausencia de llamada inicial y llamada después de clic. Crear cada mock dentro de su prueba reduce filtraciones y hace explícito el contexto. Si la preparación crece mucho, usa una función de setup o `beforeEach` para lo apropiado, pero mantén render y user-event dentro del flujo de cada prueba.

## Simular hijos

En una prueba de un padre complejo puedes sustituir un hijo para comprobar selección, orden o props sin ejecutar toda su implementación. No hagas esto automáticamente: demasiados mocks pueden hacer que una prueba pase aunque los componentes reales no funcionen juntos.

```jsx
vi.mock("./Submission", () => ({
  default: ({ submission, isDashboardView }) => (
    <article data-testid="submission">
      {submission.id}: {String(isDashboardView)}
    </article>
  ),
}));
```

La fábrica de un mock de módulo devuelve la forma de sus exportaciones. La etiqueta muestra solo lo necesario para observar el contrato del padre. RTL utiliza `data-testid` por defecto; algunos ejemplos antiguos configuran `data-test-id`, que no es equivalente sin configuración.

## Un caso real de Odin

Lee el componente histórico [submissions-list.jsx](https://github.com/TheOdinProject/theodinproject/blob/0886578d5b27a967e6bba2b31f212efe284d9413/app/javascript/components/project-submissions/components/submissions-list.jsx) y [sus pruebas](https://github.com/TheOdinProject/theodinproject/blob/0886578d5b27a967e6bba2b31f212efe284d9413/app/javascript/components/project-submissions/components/__tests__/submissions-list.test.jsx). Aunque el sitio dejó de usarlo, sigue siendo un ejemplo auditable.

Identifica tres decisiones: mostrar la entrega propia si existe; ordenar y mostrar entregas o indicar que todavía no hay ninguna; mostrar un párrafo adicional cuando existe `allSubmissionsPath`. El test sustituye `Submission` y una biblioteca de animación externa, prepara datos y callbacks, y verifica esas ramas. El contexto provee datos al componente; no necesitas comprender toda la aplicación Rails para leer esta prueba React. `jest.mock` corresponde aquí a `vi.mock`, conservando la diferencia en la forma de exportar módulos.

## Leer las pruebas históricas por decisiones

No necesitas conocer todos los imports para comprender qué garantiza una prueba. Empieza por las props de `SubmissionsList`: identifica datos, indicadores y callbacks. Luego recorre cada retorno condicional. Si hay entrega propia, debería existir una representación correspondiente; si no hay entregas públicas, debería aparecer el mensaje vacío; si existe una ruta hacia todas las entregas, debería mostrarse la información adicional. Esas decisiones producen una tabla de casos antes de elegir mocks.

La biblioteca de animación puede involucrar temporizadores o medidas del navegador que no forman parte de la decisión de ordenar entregas. Simularla permite concentrarse en esa decisión. El componente `Submission` también puede sustituirse por una representación pequeña que muestre ID y modo de vista. Así compruebas que el padre entrega los datos adecuados. Esa prueba no verifica el diseño ni la lógica interna de `Submission`; necesita pruebas propias o una integración con componentes reales.

En el archivo histórico verás suites agrupadas con `describe`. Una se concentra en si existe la entrega del usuario; otras en la colección y la ruta adicional. La agrupación sirve para organizar escenarios, no agrega aislamiento por sí misma. Los datos y mocks todavía necesitan preparación correcta. Si reutilizas un objeto mutable entre pruebas, una prueba puede cambiarlo y afectar la siguiente; usa objetos nuevos o copias explícitas.

El contexto que aparece en esas pruebas suministra un valor que el componente espera. Puedes pensar en él como otra entrada del escenario. Todavía no necesitas dominar toda la API para observar que, con una ruta definida, aparece una rama distinta. Al estudiar Context volverás a este ejemplo con una explicación más completa de proveedores y consumidores.

## Elegir qué observar en una llamada

`toHaveBeenCalled` confirma al menos una llamada, pero no su número ni sus argumentos. Si un clic debe agregar exactamente un producto, comprobar únicamente presencia no detecta que se agregó dos veces. Usa `toHaveBeenCalledTimes(1)` y, cuando sea parte del contrato, `toHaveBeenCalledWith(productId)`. No exijas argumentos accidentales que el componente no promete conservar.

La prueba de ausencia antes del clic detecta un error frecuente: pasar `onClick={handler()}` en lugar de una referencia. El callback se ejecuta durante render aunque el botón todavía no se haya utilizado. Combinar la afirmación de ausencia inicial con la llamada posterior convierte ese detalle de sintaxis en un comportamiento observable.

## Actividades

1. Antes de abrir las pruebas históricas, escribe los casos que esperarías para las tres ramas. Después compara.
2. Consulta [cómo simular componentes hijos](https://medium.com/@taylormclean15/jest-testing-mocking-child-components-to-make-your-unit-tests-more-concise-18691ef6a0c2); si el artículo requiere cuenta, el ejemplo y la [API de vi.mock](https://vitest.dev/api/vi.html#vi-mock) permiten completar la práctica.
3. Revisa [Testing React Apps](https://academind.com/tutorials/testing-react-apps), adaptando su user-event antiguo al actual asíncrono.
4. Organiza tus pruebas siguiendo [preparar, actuar y comprobar](http://wiki.c2.com/?ArrangeActAssert). Si repites preparación, consulta cómo [escribir una función de setup de user-event](https://testing-library.com/docs/user-event/intro/#writing-tests-with-userevent). Añade al menos una integración con los hijos reales.

## Comprueba lo aprendido

- ¿Cómo simulas un callback y compruebas tanto presencia como ausencia de llamadas?
- ¿Cómo conserva un mock de hijo las entradas relevantes para probar al padre?
- ¿Qué defecto podrías ocultar al simular demasiados componentes?
