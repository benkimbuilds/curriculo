# Pasar datos entre componentes

Las props son las entradas de un componente. El padre decide sus valores y el hijo los recibe como un objeto. El flujo de datos va del padre al hijo; un hijo no modifica directamente las props del padre ni las de un hermano. Para solicitar un cambio puede llamar a una función que el padre le entregó.

## De duplicación a variaciones

Si todos los botones muestran «Continuar», un componente sin parámetros basta. En cuanto necesitas texto, color o tamaño diferentes, crear `Button2`, `Button3` y sucesivos duplica estructura. Una sola función parametrizada permite expresar esas variantes:

```jsx
function Button(props) {
  const style = { color: props.color, fontSize: props.fontSize + "px" };
  return <button style={style}>{props.text}</button>;
}

export default function App() {
  return (
    <>
      <Button text="Continuar" color="blue" fontSize={12} />
      <Button text="Cancelar" color="red" fontSize={12} />
      <Button text="Leer más" color="blue" fontSize={20} />
    </>
  );
}
```

El componente recibe `props` como parámetro. Los valores se establecen donde se usa y los estilos se calculan a partir de ellos. Las comillas indican cadenas; las llaves permiten pasar un número o una expresión.

## Desestructuración y valores predeterminados

Puedes extraer las propiedades en el parámetro de la función mediante [desestructuración](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). Agregar valores predeterminados evita repetir las opciones más comunes:

```jsx
function Button({ text = "Continuar", color = "blue", fontSize = 12, onClick }) {
  return (
    <button onClick={onClick} style={{ color, fontSize }}>
      {text}
    </button>
  );
}
```

Ahora `<Button />` usa los valores predeterminados y `<Button color="red" />` cambia solamente el color. Un valor predeterminado se usa cuando falta la prop o vale `undefined`, no cuando vale `null`. React moderno ya no aplica `Component.defaultProps` a componentes de función; ese patrón aparece en código antiguo y sigue siendo relevante al leer clases. Usa parámetros predeterminados aquí.

## Funciones como props

```jsx
export default function App() {
  function visit(url) {
    window.location.href = url;
  }
  return (
    <Button
      text="Visitar Odin"
      onClick={() => visit("https://www.theodinproject.com")}
    />
  );
}
```

El padre define el comportamiento, entrega una referencia y el hijo la conecta al evento. `onClick={visit(url)}` ejecutaría la función durante render; la función flecha pospone la llamada hasta el clic. Si no necesitas argumentos, `onClick={handleClick}` basta. Otra posibilidad es una función curried que devuelva el manejador; consulta [currying](https://javascript.info/currying-partials) cuando el patrón básico ya te resulte claro.

Este ejemplo de eventos funciona en el laboratorio React. En Next.js, estado y manejadores del navegador deben estar dentro de una frontera Client Component: agrega `"use client"` al archivo de entrada interactivo. No pases funciones ordinarias desde un Server Component como si fueran datos serializables.

## Seguir el callback sin invertir los datos

Aunque un hijo llama una función definida por el padre, las props no cambian de dirección. El padre sigue entregando datos y comportamiento; el hijo anuncia una intención a través de ese comportamiento. Cuando el padre cambia su estado, vuelve a entregar props nuevas. Esta distinción evita que dos componentes intenten modificar la misma variable a escondidas.

En el ejemplo del botón, el nombre `onClick` es una prop que elegimos para nuestra interfaz. También podría llamarse `handleClick`; dentro del componente la conectaríamos al `onClick` real del elemento HTML. El nombre de una prop personalizada no agrega comportamiento por sí mismo. Si recibes la función pero nunca la conectas al evento, el botón se verá bien y no hará nada. Usa un log temporal para comprobar que la llamada ocurre una sola vez y con el argumento esperado.

Los estilos del ejemplo también muestran una decisión de datos. `fontSize={12}` entrega un número, mientras `fontSize="12"` entrega texto. Puedes concatenar explícitamente `"px"` como hace la primera versión o aprovechar que React interpreta ciertas propiedades numéricas de estilo como píxeles. No todas las propiedades funcionan igual: valores como `opacity` son números sin unidad. Mantén el contrato de props claro para evitar conversiones accidentales.

Finalmente, desestructurar no crea una copia profunda ni autoriza a modificar objetos recibidos. Si recibes un objeto de configuración, trátalo como solo lectura. Los valores predeterminados evitan repetición útil, pero no deberían inventar información obligatoria: un botón sin propósito conocido merece un contrato claro, no un texto genérico que oculte que el padre olvidó proporcionarlo.

## Actividad y comprobación

1. Lee [Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component) y cambia sus ejemplos.
2. Crea tres variantes con un solo componente, después omite props y prueba `undefined` y `null`.
3. Agrega un callback que reciba un identificador; comprueba que no se ejecuta al cargar.

- ¿En qué dirección circulan las props?
- ¿Cómo un callback permite solicitar una acción al padre sin mutar sus datos?
- ¿Qué resuelven la desestructuración y los parámetros predeterminados?
- ¿Por qué una llamada con paréntesis no equivale a pasar una referencia?
