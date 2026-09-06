# Introducción a React

React es una biblioteca de JavaScript para construir interfaces web y nativas. Una biblioteca reúne código reutilizable que resuelve problemas concretos; un framework además establece una estructura y controla partes del flujo de la aplicación. React ofrece primitivas para describir interfaces mediante componentes. Next.js utiliza React y agrega convenciones para rutas, ejecución en servidor y despliegue.

## Qué aporta React

Un componente reúne la descripción visual y la lógica de una parte de la interfaz. Puedes reutilizar una tarjeta de producto con distintos datos sin mantener copias independientes del mismo HTML. Cuando cambian esos datos o el estado, React calcula qué debe mostrarse. Esto facilita expresar interfaces complejas, aunque no reemplaza los conocimientos de HTML, CSS y JavaScript.

React tiene un ecosistema amplio y una comunidad que produce documentación, herramientas y bibliotecas. Es flexible: puedes elegir cómo organizar tus archivos, estilos o estado. Esa libertad también exige tomar decisiones. Reutilización no significa dividir cada etiqueta en un archivo, y usar React no hace automáticamente rápida una aplicación.

El ecosistema frontend cambia. Lo transferible es comprender componentes, flujo de datos y pruebas, en vez de perseguir cada herramienta nueva. Tu experiencia previa con JavaScript te permite separar los conceptos de React de los detalles de una configuración particular.

## Ejemplo para leer

```jsx
function Saludo({ nombre }) {
  return <h1>Hola, {nombre}</h1>;
}

export default function App() {
  return <Saludo nombre="Ana" />;
}
```

`Saludo` recibe datos y devuelve una descripción de interfaz. No busques todavía memorizar JSX; observa que una función representa una pieza reutilizable y que `App` la utiliza con un valor concreto.

## Actividades y recursos

1. Recorre la [introducción oficial de React](https://react.dev/) para identificar componentes e interactividad. Todavía no es necesario leer toda la referencia.
2. Consulta la [historia de React](https://blog.risingstack.com/the-history-of-react-js-on-a-timeline/) y distingue su origen de sus cambios posteriores.
3. Lee la explicación de [biblioteca y framework](https://www.freecodecamp.org/news/the-difference-between-a-framework-and-a-library-bd133054023f/) y clasifica React y Next.js con tus propias palabras.
4. Revisa las [ventajas de React](https://www.geeksforgeeks.org/reactjs/what-are-the-advantages-of-react-js/) y el artículo sobre [ciclos de frameworks](https://iamtapan.medium.com/this-is-how-long-the-life-cycle-of-a-javascript-framework-lasts-d21b29320512) como contexto histórico, no como promesas de rendimiento.

## Comprueba lo aprendido

- ¿Cuál es el propósito de React y qué responsabilidad agrega un framework?
- ¿Por qué los componentes reutilizables pueden reducir duplicación?
- ¿Qué beneficios dependen de tus decisiones de implementación?
