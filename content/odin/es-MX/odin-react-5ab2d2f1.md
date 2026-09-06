# Cómo manejar efectos secundarios

Un efecto sincroniza un componente con un sistema externo: una conexión, un temporizador, una API del navegador o una suscripción. No es una forma general de ejecutar lógica después de cambiar estado. Antes de agregarlo pregunta: «¿Qué sistema externo necesita sincronizarse?».

## Un reloj que se acelera

Si colocas `setInterval` directamente en el cuerpo de `Clock`, cada render crea otro intervalo. Cada intervalo actualiza estado, provoca render y crea más intervalos. Moverlo a `useEffect` sin dependencias tampoco basta: se iniciaría después de cada commit.

```jsx
import { useEffect, useState } from "react";

export default function Clock() {
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setCounter(count => count + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  return <p>Han pasado {counter} segundos.</p>;
}
```

El setup crea el intervalo; el retorno entrega una función de limpieza. El actualizador funcional utiliza el conteo pendiente, por lo que el efecto no necesita capturar `counter`. El arreglo vacío indica que no hay valores reactivos externos al efecto que deban resintonizarlo.

## Dependencias y limpieza

Sin segundo argumento, el efecto se ejecuta después de cada commit. Con `[]`, se configura al montar. Con `[roomId]`, se configura al montar y cuando cambia `roomId`. Antes de configurar de nuevo, React ejecuta la limpieza anterior; también limpia al desmontar. Las dependencias describen los valores reactivos utilizados, no una lista arbitraria de ocasiones en que quieres ejecutarlo. Atiende al linter en vez de silenciarlo.

En desarrollo, [StrictMode](https://react.dev/reference/react/StrictMode#strictmode) ejecuta un ciclo adicional de setup y limpieza para detectar errores. Sin `clearInterval`, puede quedar un temporizador huérfano que duplica los cambios. No elimines StrictMode para ocultarlo. En React, actualizar estado no desmonta normalmente todo el componente: crea otro render; el montaje y la limpieza son conceptos distintos.

## Cuándo no usar un efecto

Si un resultado deriva del estado, calcúlalo directamente: `const sum = number1 + number2`. Guardar `sum` en otro estado y actualizarlo con un efecto agrega un render y la posibilidad de contradicción.

Si el trabajo responde a un clic o a escribir, colócalo en el manejador. Un input controlado usa `onChange`, no `document.getElementById(...).addEventListener` dentro de un efecto:

```jsx
const [input, setInput] = useState("");
return <input value={input} onChange={event => setInput(event.target.value)} />;
```

Para reiniciar todo un subárbol al cambiar de entidad, considera una key que represente esa entidad. Para compartir un valor entre hermanos, eleva el estado a su ancestro común y pásalo por props; no mantengas dos copias sincronizadas mediante efectos. Los efectos son una salida hacia sistemas externos, no un sustituto del flujo de datos.

## Observar una limpieza correcta

Traza el reloj desde su primer montaje. El setup guarda el identificador devuelto por `setInterval`. Cada tick usa un actualizador puro para aumentar la cuenta. Ese cambio produce otro render, pero como las dependencias no cambiaron, el efecto no crea otro intervalo. Al ocultar el reloj, la limpieza recibe por closure el identificador creado en aquel setup y lo cancela. Volver a mostrar el componente crea una instancia nueva y otro intervalo independiente.

Si el intervalo dependiera de una prop `delay`, el arreglo de dependencias incluiría ese valor. Cuando cambie, React limpiaría el intervalo anterior antes de crear el nuevo con la duración actual. No necesitas un efecto diferente para desmontar ni una variable global compartida entre relojes. Cada setup debe poder liberar los recursos que creó sin afectar otra instancia.

También hay diferencia entre configurar y ejecutar inmediatamente la limpieza. Devuelve `() => clearInterval(interval)`; escribir `return clearInterval(interval)` la ejecuta durante setup y devuelve su resultado, no una función que React pueda llamar después. Este error puede dejar un reloj que nunca avanza aunque parezca tener una línea de cleanup.

## Separar eventos de sincronización

Un envío de formulario debe responder al evento de enviar. Si lo programas en un efecto que observa varios campos, cualquier modificación puede iniciar otra petición sin que la persona haya confirmado. En cambio, una conexión a una sala visible puede necesitar mantenerse sincronizada mientras esa sala se muestra. Preguntar qué causa la operación —una acción concreta o la presencia de una relación externa— ayuda a elegir el lugar correcto.

Elevar estado tampoco requiere que toda la aplicación lo posea. Si dos hermanos comparten una selección, usa su ancestro común más cercano. Pasar selección y callback por props mantiene explícita la relación. Solo considera Context si los niveles intermedios vuelven incómodo ese transporte; un efecto que copia selección de un hermano a otro introduce un orden temporal innecesario y permite que se desincronicen.

## Actividades

1. Estudia [Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects) y sigue cada ciclo de conexión/desconexión.
2. Trabaja los ejemplos de [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).
3. Consulta el ejemplo de [bucles infinitos de useEffect](https://dmitripavlutin.com/react-useeffect-infinite-loop), luego corrige un efecto que depende de un objeto nuevo en cada render sin desactivar el linter.
4. Monta y desmonta el reloj varias veces y comprueba que solo existe el temporizador activo.

## Comprueba lo aprendido

- ¿Qué constituye un efecto y qué devuelve su callback?
- ¿Cómo difieren dependencias omitidas, vacías y pobladas?
- ¿Cuándo se ejecuta la limpieza y qué revela StrictMode?
- ¿Cuándo conviene derivar un valor, manejar un evento o elevar estado en vez de usar un efecto?
