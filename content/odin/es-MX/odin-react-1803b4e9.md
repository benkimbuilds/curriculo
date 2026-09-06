# Introducción a las pruebas de React

Las pruebas de lógica no garantizan que una persona pueda usar la interfaz. Tu motor de Batalla Naval puede ser correcto mientras un botón no permite colocar barcos. Las pruebas de UI comprueban contenido e interacciones observables y detectan regresiones cuando reorganizas componentes o estado.

## Preparar el entorno

En el laboratorio Vite usa Vitest como ejecutor y React Testing Library para renderizar y consultar componentes. Sigue la [guía de configuración Vitest y RTL](https://www.robinwieruch.de/vitest-react-testing-library/). Necesitarás `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom` y `@testing-library/user-event` como dependencias de desarrollo.

`jsdom` simula el DOM en memoria, pero no realiza el diseño visual de un navegador real. [RTL](https://testing-library.com/docs/react-testing-library/intro/) ofrece `render` y `screen`; [jest-dom](https://github.com/testing-library/jest-dom) agrega matchers como `toBeInTheDocument`; user-event simula secuencias de interacción. Las pruebas visuales o de navegación real siguen necesitando un navegador. El curso anterior utiliza [Jest](https://jestjs.io/); aquí el cambio a Vitest aprovecha la integración con Vite sin cambiar el propósito de las pruebas.

Si no habilitas globals, importa `describe`, `it`, `expect` y `afterEach` desde Vitest. El linter no reconoce automáticamente globals por habilitarlos solamente en Vitest. Configura `environment: "jsdom"` y un archivo de setup. Con imports explícitos puedes garantizar limpieza así:

```js
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(cleanup);
```

## Consultar la interfaz

```jsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  it("cambia el encabezado después del clic", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole("heading", { name: "Monos magníficos" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cambiar animal" }));
    expect(screen.getByRole("heading", { name: "Rinocerontes radicales" })).toBeInTheDocument();
  });
});
```

Para que el ejemplo pase, implementa `App` con un estado inicial de «Monos magníficos» y un botón «Cambiar animal» que lo actualice. La prueba organiza datos, ejecuta una acción y verifica el resultado. Cada prueba renderiza su instancia; la limpieza evita contaminar la siguiente.

`getBy...` falla si no encuentra el elemento esperado inmediatamente. `queryBy...` devuelve `null` cuando no existe, útil para comprobar ausencia. `findBy...` devuelve una promesa y espera una aparición asíncrona. Prefiere `getByRole` con nombre accesible, o labels para formularios. `data-testid` es una salida cuando no hay una consulta semántica apropiada, no la primera opción. `screen` evita tener que desestructurar cada método desde `render`.

## Snapshots

`const { container } = render(<App />); expect(container).toMatchSnapshot()` guarda una representación del DOM para comparaciones futuras. Es rápido y puede detectar cambios inesperados, pero no demuestra que un botón funcione. Un snapshot puede capturar un bug y pasar siempre, o fallar por un cambio inocuo de puntuación. Revisa el diff antes de actualizarlo y conserva pruebas explícitas para conductas relevantes.

## Construir primero el caso mínimo

Antes de probar una interacción, empieza con un componente que solo devuelva un encabezado, por ejemplo «Nuestra primera prueba». Renderízalo y búscalo con `screen.getByRole("heading", { name: "Nuestra primera prueba" })`. Si eso falla, todavía no investigues actualizaciones de estado: verifica que la prueba importe el archivo correcto, que el entorno sea jsdom y que el componente devuelva realmente ese texto. Separar problemas de configuración de problemas de comportamiento ahorra cambios innecesarios.

El método `render` monta el componente dentro de un contenedor de prueba. Devuelve utilidades como `container`, pero las consultas también están disponibles en `screen`, vinculado al documento de prueba. Usar `screen` evita volver a editar una desestructuración cada vez que agregas una consulta. `container` sigue siendo útil para necesidades específicas, como el ejemplo de snapshot, aunque no debes depender de selectores estructurales cuando existe una consulta por propósito.

La opción `name` hace una consulta más precisa. Si una pantalla contiene dos encabezados, buscar únicamente por rol ya no identifica uno de manera única. El nombre accesible se calcula a partir del contenido y atributos apropiados; no necesariamente coincide con un ID de implementación. Encontrar el botón «Guardar» describe qué control buscaría una persona. Encontrar `.button:nth-child(2)` describe una disposición interna que puede cambiar sin alterar la tarea.

Las expresiones regulares permiten comparaciones flexibles, pero demasiado amplias pueden seleccionar el elemento equivocado. `/guardar/i` ignora mayúsculas y puede coincidir con «Guardar borrador» y «Guardar cambios». Cuando esa distinción importa, usa un nombre exacto. Si esperas varios resultados, utiliza una consulta plural y comprueba la cantidad intencionalmente; no sustituyas una consulta singular fallida por `getAllBy` solo para hacer desaparecer el error.

## Interacción, aislamiento y señales de fallo

`userEvent.setup()` crea una instancia que coordina acciones como escribir y pulsar. `await user.click` no es decoración: la interacción puede implicar eventos y actualizaciones que debes dejar terminar antes de afirmar el resultado. Un test sin espera puede leer la interfaz demasiado pronto o terminar antes de que ocurra un fallo. Para resultados de una carga posterior, utiliza una consulta asíncrona como `findByRole`, no una pausa fija de varios segundos.

Después de cada prueba, desmonta componentes. De otro modo, un encabezado encontrado podría pertenecer al test anterior y producir un falso éxito, o podrían aparecer dos botones iguales y producir un fallo confuso. La limpieza del DOM y el reinicio de mocks son responsabilidades relacionadas pero distintas: quitar nodos no borra automáticamente todos los registros de llamadas de un mock compartido. Datos locales por prueba suelen hacer ambos problemas más fáciles de evitar.

Una prueba puede tener un falso positivo cuando pasa aunque el comportamiento esté roto. Por ejemplo, afirmar solo que existe el botón no verifica que cambie el encabezado. También puede producir un falso negativo cuando falla por un cambio sin impacto, como reemplazar un contenedor decorativo que nadie utiliza para interactuar. El objetivo no es eliminar cualquier fallo, sino conectar las afirmaciones con requisitos observables.

## Leer un snapshot como revisión de código

La primera ejecución de `toMatchSnapshot` guarda el árbol serializado. Las siguientes comparan contra ese archivo. Si cambias el texto del encabezado, la comparación falla aunque el botón siga funcionando; si el botón ya estaba desconectado cuando guardaste el snapshot, conservará ese defecto sin denunciarlo. Esas dos situaciones explican sus limitaciones mejor que decidir que los snapshots son siempre buenos o malos.

Antes de actualizar uno, revisa qué cambió y por qué. Un archivo enorme puede resultar difícil de revisar y fomentar aprobaciones automáticas. Prefiere una salida acotada cuando el valor de conservar su estructura sea claro, y acompáñala con pruebas de las interacciones que importan. Ejecutar una prueba que deliberadamente rompes y luego reparas ayuda a confirmar que realmente detecta el requisito previsto.

## Actividades y recursos

1. Revisa [queries y prioridad](https://testing-library.com/docs/queries/about/), la [cheatsheet](https://testing-library.com/docs/dom-testing-library/cheatsheet/) y la [referencia de render](https://testing-library.com/docs/react-testing-library/api/#render).
2. Lee [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details) y reescribe una prueba que inspeccione estado interno como una interacción observable.
3. Practica la [API de user-event](https://testing-library.com/docs/user-event/intro), incluyendo `await user.type` y `await user.click`. Consulta [test IDs](https://testing-library.com/docs/queries/bytestid/) solo si hace falta.
4. Compara la [guía de snapshots de Vitest](https://vitest.dev/guide/snapshot.html), [pros y contras](https://tsh.io/blog/pros-and-cons-of-jest-snapshot-tests/) y [beneficios y limitaciones](https://www.sitepen.com/blog/snapshot-testing-benefits-and-drawbacks). Los ejemplos antiguos con Jest o Enzyme requieren adaptar APIs, no cambiar el objetivo de la prueba.

## Comprueba lo aprendido

- ¿Qué detecta una prueba de UI que una prueba de lógica no detecta?
- ¿Qué aporta cada paquete y qué no simula jsdom?
- ¿Qué consulta usarías para presencia, ausencia y aparición asíncrona?
- ¿Por qué se espera una interacción de user-event?
- ¿Qué garantiza un snapshot y qué falsa confianza puede producir?
