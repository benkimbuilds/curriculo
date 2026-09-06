# Refs y memoización

React administra el DOM a partir de props y estado, pero algunas operaciones requieren acceso directo: enfocar un input, medir un elemento o desplazar una lista. Las refs permiten ese acceso y conservar valores que no participan en el render. La memoización resuelve otro problema: evitar trabajo costoso cuando sus entradas no cambian.

## useRef y acceso al DOM

```jsx
import { useRef, useEffect } from "react";

export default function FocusExample() {
  const buttonRef = useRef(null);
  useEffect(() => {
    buttonRef.current?.focus();
  }, []);
  return <button ref={buttonRef}>Continuar</button>;
}
```

`useRef(null)` devuelve un objeto estable con `current`. React asigna allí el nodo después de incorporarlo al DOM y antes del efecto. Al retirarlo, limpia la referencia. El valor inicial no se reaplica en cada render.

Cambiar `ref.current` no solicita un render. Por eso una ref puede guardar un identificador de intervalo o un valor auxiliar, pero no debe reemplazar el estado que la persona necesita ver actualizado. Tampoco leas o escribas refs arbitrariamente durante render.

Usa refs para operaciones no destructivas. Cambiar `textContent` de un botón que React controla puede desincronizar la descripción de React y el DOM. Si quieres cambiar su texto durante dos segundos, usa estado y un temporizador con limpieza. Una ref es más precisa que un `querySelector` global y permanece vinculada a la instancia correcta, pero no autoriza a saltarte el modelo declarativo.

## Medir antes de optimizar

Usa [Profiler](https://react.dev/reference/react/Profiler) o el perfilador de [React Developer Tools](https://react.dev/learn/react-developer-tools) para observar duración y frecuencia de renderizados. Un cálculo corto de total suele ser suficientemente rápido. Agregar cachés tiene costo y puede complicar dependencias.

```jsx
const total = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
```

Si una colección grande hace costosa esa operación y otros cambios provocan renders sin cambiar productos, `useMemo` conserva el resultado:

```jsx
const total = useMemo(
  () => products.reduce((sum, product) => sum + product.price * product.quantity, 0),
  [products]
);
```

Importa `useMemo`. La función se ejecuta inicialmente y cuando cambia una dependencia. Debe ser pura, pues es cálculo de render, no un efecto. Las dependencias se comparan por identidad: un arreglo nuevo en cada render invalida la caché. La caché es una optimización, no almacenamiento del que dependa la corrección. Si desmontas y vuelves a montar el carrito, no cuentes con conservar esa memoización.

## Identidad de funciones y memo

Un padre que renderiza normalmente vuelve a renderizar sus hijos. [memo](https://react.dev/reference/react/memo) permite omitir trabajo de un hijo si sus props no cambiaron, pero una función definida en el padre es una nueva referencia cada vez. Memoizar solo esa función no basta si el hijo no puede omitir render; usar solo `memo` tampoco basta si las props cambian continuamente.

```jsx
import { memo, useCallback, useState } from "react";

const CounterButton = memo(function CounterButton({ onClick }) {
  return <button onClick={onClick}>Aumentar</button>;
});

export default function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => setCount(value => value + 1), []);
  return <><p>{count}</p><CounterButton onClick={handleClick} /></>;
}
```

`useCallback` conserva una referencia de función; no ejecuta la función al memoizarla. `useMemo(() => () => setCount(value => value + 1), [])` podría expresar lo mismo, pero `useCallback` comunica mejor la intención. El actualizador evita capturar `count`; si lees otra prop o estado, debe figurar en dependencias. Omitirla puede conservar un valor obsoleto.

`memo` no impide actualizaciones por estado propio o contexto. Un objeto `value={{...}}` de contexto también es una nueva referencia; a veces `useMemo` estabiliza ese valor, siempre incluyendo las dependencias correctas.

## React Compiler

React Compiler analiza código durante construcción y puede memoizar componentes y cálculos automáticamente. Debe estar instalado y habilitado; no supongas que todo proyecto lo usa. Entender memoización manual sigue siendo útil para código existente y para interpretar perfiles. Incluso con compilador, la corrección depende de pureza, identidad y dependencias adecuadas, no de una caché garantizada.

## Observar una referencia sin convertirla en estado

En el ejemplo de foco, `buttonRef.current` empieza en `null` porque todavía no existe un nodo asociado. React realiza esa asociación cuando confirma el elemento. Por eso acceder al nodo desde el efecto tiene sentido, mientras intentar enfocarlo durante la primera ejecución de la función puede encontrar `null`. El encadenamiento opcional evita llamar un método si el nodo ya no está disponible, pero no sustituye comprender el momento en que debe realizarse la operación.

Una ref también puede almacenar el ID de un temporizador. Ese identificador no necesita aparecer en pantalla, y cambiarlo no necesita otro render. El número de segundos sí aparece y debe vivir en estado. Este ejemplo distingue información de control de información de presentación. Si guardas el contador solo en una ref y esperas que el párrafo cambie, no ocurrirá hasta que otra causa provoque render; entonces podría parecer que la interfaz se actualiza de manera aleatoria.

No uses una ref para evitar una dependencia que realmente necesita sincronización. Guardar una prop en `current` y leerla desde un efecto sin dependencias puede esconder que la conexión externa nunca se reconfigura. Las refs son apropiadas cuando la mutabilidad y la ausencia de render forman parte de la intención, no cuando quieres silenciar una advertencia del linter sin explicar el comportamiento.

El ejemplo original también muestra cambiar el texto del botón directamente y restaurarlo con un timeout. Sirve como demostración de que una operación sobre el nodo no dispara render, pero advierte que no debe usarse para contenido administrado por React. Para practicarlo con seguridad conceptual, observa por qué cambiar un estado de etiqueta produce un flujo más predecible: React conoce el nuevo texto y cualquier siguiente render se basa en el mismo dato.

## Entender el costo de un cálculo

Un `reduce` visita cada producto, multiplica precio por cantidad y acumula. Su trabajo aumenta con el número de productos. En un carrito de cinco líneas probablemente cuesta menos que administrar una optimización; con una colección muy grande y renders frecuentes podría volverse relevante. El perfilador permite observar esa diferencia en lugar de inferir lentitud solo porque una operación se repite.

La situación de abrir y cerrar un panel necesita precisión. Si mantienes montado `Cart` y cambias una prop visual, puede volver a renderizar conservando su caché. Si lo eliminas del árbol al cerrar, pierde la instancia; al abrirlo nuevamente se calcula desde cero. `useMemo` conserva un resultado dentro de una instancia mientras React mantenga su caché, no establece un almacenamiento global entre montajes. Elegir dónde vive el componente es parte de la explicación del rendimiento.

Las dependencias de `useMemo` incluyen todos los valores reactivos utilizados por el cálculo. Si también conviertes moneda con una tasa recibida por props, `[products]` ya no es suficiente. Omitir la tasa podría mostrar un total obsoleto. Por otra parte, crear un objeto de configuración nuevo fuera del memo en cada render e incluirlo como dependencia puede invalidar la caché siempre. Primero busca una estructura clara de datos; no agregues más memos para resolver una cadena de identidades accidentales sin medirla.

## Tres escenarios del botón costoso

El repositorio de ejemplo introduce artificialmente trabajo pesado en un botón para que el perfilador muestre su costo. En el primer escenario, el padre define `handleClick` en cada ejecución y el hijo no usa `memo`. Cada actualización del contador vuelve a renderizar el hijo. En el segundo, envuelves al hijo con `memo`, pero mantienes un callback nuevo: la comparación de props encuentra una referencia distinta y no puede omitir ese trabajo.

En el tercero, `useCallback` conserva la referencia mientras sus dependencias no cambian y el hijo utiliza `memo`. Ahora una actualización del conteo del padre no necesita recalcular el botón si sus entradas siguen iguales. Este resultado depende de todas las props: si pasas además un objeto nuevo de estilos o un arreglo nuevo en cada render, otra prop puede invalidar la comparación. El mismo principio se aplica a objetos y arreglos, no solo a funciones.

El cuerpo lento es una herramienta didáctica, no una recomendación para tus componentes. Retíralo después de comparar escenarios. Tampoco concluyas que ningún hijo debe renderizar al cambiar el padre: React está diseñado para actualizar interfaces así, y muchos componentes son baratos. La optimización vale cuando reduce un costo medido sin introducir una dificultad mayor para mantener el código.

## Memoizar una función no ejecuta su acción

Una función es un valor de JavaScript. `useMemo(() => handleClick, dependencies)` devuelve ese valor sin llamar al manejador. `useMemo(() => handleClick(), dependencies)` ejecuta la acción durante el cálculo y almacena su resultado, que es algo completamente diferente. `useCallback(handleClick, dependencies)` expresa directamente que quieres conservar una función. La función todavía se ejecuta cuando la persona produce el evento correspondiente.

React Compiler puede automatizar parte de estas decisiones al analizar código que respeta las reglas de React. No convierte efectos impuros en código correcto ni garantiza que toda biblioteca externa sea compatible. Sigue siendo necesario entender qué hace tu componente y revisar el perfil antes y después de una optimización. Conocer las técnicas manuales te permite leer proyectos sin compilador y reconocer qué trabajo está intentando evitar la herramienta.

## Actividades

1. Ejecuta `memoization/` de [react-examples](https://github.com/TheOdinProject/react-examples). Compara hijo sin `memo`, hijo con `memo` y callback nuevo, y ambos con callback estable. Mide, no concluyas solamente por mirar el código.
2. Lee [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback).
3. Completa [useRef](https://react.dev/reference/react/useRef) y [Manipulating the DOM with Refs](https://react.dev/learn/manipulating-the-dom-with-refs).
4. Estudia [setInterval declarativo](https://overreacted.io/making-setinterval-declarative-with-react-hooks/) para otro uso de refs, y la [documentación de React Compiler](https://react.dev/learn/react-compiler) para instalación y configuración.

## Comprueba lo aprendido

- ¿Qué diferencia hay entre actualizar una ref y actualizar estado?
- ¿Por qué enfocar con una ref es distinto de reemplazar contenido controlado por React?
- ¿Qué almacenan `useMemo` y `useCallback`?
- ¿Cómo interactúan identidad de props y `memo`?
- ¿Qué evidencia justifica memoizar y qué puede hacer React Compiler automáticamente?
