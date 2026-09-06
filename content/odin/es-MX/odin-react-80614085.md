# Profundizar en el estado

Un buen modelo de estado evita contradicciones. No almacenes un total que puedes calcular a partir de los productos, ni el nombre completo si ya tienes nombre y apellido. Cada valor adicional exige mantener sincronizadas más cosas. Guarda los hechos mínimos y calcula sus consecuencias durante render.

## Inmutabilidad

Los objetos y arreglos de estado deben tratarse como inmutables. `person.age += 1; setPerson(person)` modifica el objeto anterior y entrega la misma referencia. React compara con [Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is), por lo que puede omitir la actualización; además, has alterado una instantánea que otro código podría estar usando.

```jsx
const [person, setPerson] = useState({ name: "Ana", age: 30 });

function increaseAge() {
  setPerson(previous => ({ ...previous, age: previous.age + 1 }));
}
```

El spread copia un nivel, no un árbol completo. Si cambias `person.address.city`, debes crear también un objeto nuevo para `address`. En arreglos usa `map` para reemplazar, `filter` para quitar y una copia o `concat` para agregar. No uses `push` sobre el arreglo guardado.

## El estado es una instantánea

```jsx
function increaseAge() {
  console.log(person.age);
  setPerson({ ...person, age: person.age + 1 });
  console.log(person.age);
}
```

Ambos logs muestran la edad del mismo render. El setter solicita otro render; no cambia la variable local que ya capturó el manejador. El nuevo valor estará disponible en la siguiente ejecución. React puede agrupar varias actualizaciones para evitar renderizados innecesarios.

Si llamas dos veces `setPerson({ ...person, age: person.age + 1 })`, solicitas dos reemplazos calculados desde la misma instantánea: la edad sube uno. Con dos actualizadores, cada uno recibe el resultado pendiente del anterior y sube dos:

```jsx
setPerson(previous => ({ ...previous, age: previous.age + 1 }));
setPerson(previous => ({ ...previous, age: previous.age + 1 }));
```

Los actualizadores deben ser puros. No envíes peticiones ni generes efectos externos dentro de ellos. Llamar incondicionalmente al setter en el cuerpo del componente crea un ciclo: render, actualización, render, actualización.

## Inputs controlados

```jsx
function PersonForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const fullName = `${firstName} ${lastName}`.trim();
  return (
    <>
      <label>Nombre<input value={firstName} onChange={e => setFirstName(e.target.value)} /></label>
      <label>Apellido<input value={lastName} onChange={e => setLastName(e.target.value)} /></label>
      <h1>{fullName || "Tu nombre aparecerá aquí"}</h1>
    </>
  );
}
```

Importa `useState`. El input recibe su valor desde React y devuelve cambios mediante `onChange`; por eso es controlado. Sirve para validación inmediata y vistas previas. Un input también puede dejar que el DOM conserve su valor, pero no cambies arbitrariamente entre controlado y no controlado. Inicializar texto con `""` evita pasar de `undefined` a cadena.

## Predecir la cola de actualizaciones

Escribe la edad inicial en papel, por ejemplo cien. El primer reemplazo calcula ciento uno a partir de la instantánea actual. El segundo reemplazo también calcula ciento uno. React recibe dos instrucciones para reemplazar por el mismo resultado, no una instrucción de sumar sobre el resultado anterior. Con actualizadores, la primera función recibe cien y devuelve ciento uno; la segunda recibe ese resultado pendiente y devuelve ciento dos. La diferencia no es un retraso arbitrario: son dos clases de instrucciones.

Esto explica por qué no conviene describir el setter como si fuera una asignación normal que tarda. El código del manejador pertenece a un render concreto. Incluso un callback diferido puede conservar esa instantánea en su closure. Cuando una operación necesita basarse en el estado más reciente de la cola, un actualizador expresa esa necesidad. Cuando quieres reemplazar un campo por lo que escribió el usuario, pasar el valor del evento directamente suele ser correcto.

No debes contar renders para decidir si dos cambios ocurrieron. React agrupa actualizaciones cuando puede y StrictMode puede ejecutar comprobaciones adicionales durante desarrollo. Verifica el resultado del usuario y razona sobre las transiciones; usa logs como herramienta de observación, no como un contrato de rendimiento estable.

## Elegir la estructura del formulario

Nombre y apellido pueden vivir en dos estados o en un solo objeto. Un objeto facilita pasar la información junta; dos estados hacen explícita su independencia. En ambos casos, el nombre completo se deriva. Si guardas además `fullName`, cada evento debe recordar actualizarlo y una nueva ruta de edición puede olvidarlo. El dato duplicado se convierte entonces en una fuente de contradicción.

Al actualizar un objeto con el nombre, conserva las demás propiedades. Un setter de hook reemplaza el valor entero; `setPerson({ name })` no mezcla automáticamente edad y apellido. Para campos anidados, copiar solo el objeto exterior no basta si luego modificas el interior compartido. Dibuja las referencias anteriores y nuevas para comprobar que ningún objeto de la instantánea anterior se altera.

Los inputs controlados proporcionan una única fuente de verdad para vista previa y validación. El evento informa qué texto quedó en el campo; el estado decide qué valor vuelve a mostrarse. Si agregas una transformación, por ejemplo convertir todo a mayúsculas, esa regla afectará lo que la persona ve en cada pulsación. Elige transformaciones conscientes y no borres datos inválidos antes de que pueda corregirlos. Un input no controlado sigue siendo válido para otros casos; lo estudiarás con refs y formularios que leen datos al enviar.

## Actividades

1. Lee [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot), [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure) y [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components).
2. Modifica `Person` con dos campos separados para nombre y apellido; actualiza el encabezado en cada pulsación sin guardar un tercer estado.
3. Compara dos reemplazos con dos actualizadores y registra los valores observados.

## Comprueba lo aprendido

- ¿Qué valores conviene derivar en lugar de guardar?
- ¿Por qué hay que crear un objeto nuevo y copiar cada nivel modificado?
- ¿Qué significa instantánea y cómo afecta a dos setters consecutivos?
- ¿Cuándo usarías un actualizador y cuándo un valor directo?
- ¿Qué hace que un input sea controlado?
