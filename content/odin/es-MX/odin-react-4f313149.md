# Componentes basados en clases

Los hooks permitieron usar estado en funciones y hoy son la opción habitual. Aun así, encontrarás componentes de clase en proyectos existentes. Aprender a leerlos permite mantener ese código y reconocer cómo expresa props, estado y eventos. No necesitas migrar todas las clases para entenderlas.

## Estructura de una clase

Una clase React extiende `Component`. Si defines un constructor, llama `super(props)` antes de usar `this`. Las props están en `this.props`, el estado en `this.state` y el JSX se devuelve desde `render()`.

```jsx
import { Component } from "react";

export default class ClassInput extends Component {
  constructor(props) {
    super(props);
    this.state = { todos: [], inputVal: "" };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    this.setState({ inputVal: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const text = this.state.inputVal.trim();
    if (!text) return;
    const todo = { id: crypto.randomUUID(), text };
    this.setState(previous => ({
      todos: [...previous.todos, todo],
      inputVal: "",
    }));
  }

  render() {
    return (
      <section>
        <h2>{this.props.name}</h2>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="task-entry">Tarea</label>
          <input id="task-entry" value={this.state.inputVal} onChange={this.handleInputChange} />
          <button>Agregar</button>
        </form>
        <ul>{this.state.todos.map(todo => <li key={todo.id}>{todo.text}</li>)}</ul>
      </section>
    );
  }
}
```

`setState` de una clase mezcla superficialmente las propiedades devueltas con el estado anterior. A diferencia del setter de `useState`, actualizar `inputVal` no reemplaza todo el objeto. Las colecciones internas todavía deben actualizarse sin mutaciones.

## El contexto de this

Un método pasado como callback no conserva automáticamente la instancia de su clase. `bind(this)` en el constructor crea una función vinculada a ella. La alternativa es un campo con función flecha, por ejemplo `handleInputChange = event => { ... }`, que captura `this` léxicamente. Evita vincular métodos una y otra vez dentro de `render`.

El constructor puede omitirse cuando no necesitas esa inicialización; campos de clase también permiten definir estado. Lo esencial es reconocer qué pertenece a la instancia y no llamar hooks dentro de la clase. Para entender la herencia consulta [super en MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super).

## Comparar la versión funcional y la clase

En el repositorio de ejemplo encontrarás dos implementaciones de la misma entrada de tareas. Lee primero la funcional y enumera sus responsabilidades: conservar texto, agregar un elemento, limpiar el campo y renderizar la colección. Después busca esas mismas responsabilidades en la clase. La lógica de negocio no cambia por usar otra sintaxis; cambia cómo accedes a memoria y métodos de la instancia.

En una función, `props.name` proviene del parámetro. En una clase, `this.props.name` proviene de la instancia inicializada por React. El método `render` puede leer ambos tipos de datos, pero no debe actualizarlos mientras calcula la interfaz. En la clase, `this.state` agrupa el estado en un objeto; `this.setState` solicita la actualización y acepta un objeto parcial o una función basada en el estado pendiente.

El constructor del ejemplo tiene dos responsabilidades: inicializar estado y vincular manejadores. `super(props)` llama al constructor de la clase base para que la instancia tenga la configuración esperada. No es una invocación de render ni una forma de enviar props a los hijos. Los hijos reciben sus props cuando aparecen en el JSX devuelto, igual que con componentes de función.

Para observar el problema de `this`, elimina temporalmente un `bind` y ejecuta el evento. Si el método intenta leer `this.state` o llamar `this.setState`, puede fallar porque fue invocado como callback sin el receptor original. Restaura el enlace o convierte el manejador en un campo con función flecha. No cambies toda la clase por una función solo para evitar comprender la causa: poder leer este patrón es el objetivo del ejercicio.

En la lista original se utiliza el texto de la tarea como key. Al permitir dos tareas con el mismo texto, esa elección deja de ser única. El ejemplo adaptado agrega IDs persistentes y los ejercicios de edición y eliminación deben utilizarlos. Esta mejora conserva el aprendizaje de clases y evita enseñar accidentalmente que una etiqueta editable siempre sirve como identidad.

## Actividades

1. Clona [react-examples](https://github.com/TheOdinProject/react-examples), entra en `class-components/`, ejecuta `npm install` y `npm run dev`. Compara `FunctionalInput.jsx` con `ClassInput.jsx`.
2. Agrega un botón para eliminar cada tarea por su ID. Usa `filter`, sin modificar el arreglo previo.
3. Crea una clase `Count` que reciba y muestre el número actual de tareas; móntala dentro de `ClassInput`.
4. Agrega editar por fila: sustituye temporalmente el texto por un input y cambia el botón a «Guardar». Conserva las otras tareas intactas.

## Comprueba lo aprendido

- ¿Dónde están las props y cómo se devuelve JSX en una clase?
- ¿Cómo se inicializa y actualiza el estado sin mutarlo?
- ¿Qué diferencia hay entre `setState` de clase y el setter de `useState`?
- ¿Por qué un método puede perder `this` y cómo lo solucionas?
