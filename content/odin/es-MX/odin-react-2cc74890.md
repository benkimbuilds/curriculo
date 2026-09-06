# Métodos del ciclo de vida

Un componente se monta, se actualiza y finalmente se desmonta. Las clases tienen métodos para reaccionar a esas fases. Entenderlos te permite mantener código existente y comparar su modelo con efectos en componentes de función.

## Los métodos principales

`render()` es el único método de ciclo de vida obligatorio. Se ejecuta al montar y actualizar, y debe ser puro: no modifica estado, inicia peticiones ni manipula directamente el navegador. Describe qué mostrar a partir de props y estado.

`componentDidMount()` se ejecuta después de insertar el componente en el DOM. Puede iniciar una suscripción, una petición inicial o una operación que necesita el nodo montado.

`componentDidUpdate(prevProps, prevState)` se ejecuta después de una actualización. Compara valores anteriores y actuales antes de sincronizar algo. Actualizar estado incondicionalmente desde aquí produce otra actualización y puede crear un ciclo infinito.

`componentWillUnmount()` limpia recursos antes de retirar la instancia: intervalos, listeners, conexiones y solicitudes que ya no son necesarias.

```jsx
class Clock extends Component {
  state = { seconds: 0 };
  interval = null;

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(previous => ({ seconds: previous.seconds + 1 }));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return <p>{this.state.seconds} segundos</p>;
  }
}
```

Importa `Component` desde React. El intervalo comienza cuando la instancia aparece, y el desmontaje lo detiene. Para una conexión dependiente de `roomId`, el patrón sería conectar al montar, desconectar y reconectar cuando `prevProps.roomId !== this.props.roomId`, y desconectar al desmontar.

## Relación con useEffect

Un efecto puede reunir setup y cleanup que en una clase están repartidos. Con `[]`, el setup se relaciona con el montaje; con dependencias, también se sincroniza cuando cambian; sin arreglo, se configura después de cada commit. La limpieza se relaciona con desmontaje, pero además se ejecuta antes de configurar otra vez por cambios de dependencias. Por eso no es correcto considerar cada efecto una traducción exacta de un solo método.

```jsx
useEffect(() => {
  const connection = connect(roomId);
  return () => connection.disconnect();
}, [roomId]);
```

Aquí `connect` representa tu función de conexión externa. El efecto expresa la relación con `roomId`, mientras que la clase debe comparar explícitamente las props. En desarrollo, StrictMode puede comprobar setup y cleanup con un ciclo adicional; ambas versiones deben liberar correctamente sus recursos.

## Actividad

1. Recorre el [diagrama de ciclo de vida](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) y sigue montaje, actualización y desmontaje.
2. Lee la [referencia de Component](https://react.dev/reference/react/Component), desde el constructor hasta `componentWillUnmount`, prestando atención a APIs deprecadas.
3. Agrega un botón que muestre y oculte el reloj. Confirma que desmontar lo detiene y que volverlo a montar inicia una instancia nueva.

## Comprueba lo aprendido

- ¿Cuál es el único método requerido y por qué debe ser puro?
- ¿Dónde iniciarías una carga inicial o reaccionarías a props nuevas?
- ¿Cómo evitarías un ciclo en `componentDidUpdate`?
- ¿Qué recursos deben limpiarse al desmontar?
- ¿En qué se parece un efecto a estos métodos y dónde deja de ser una equivalencia exacta?
