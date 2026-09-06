# Proyecto: biblioteca

Convierte el constructor `Book` en una biblioteca que permita agregar, eliminar y marcar libros como leídos. El dato y su representación visual tienen responsabilidades diferentes: el arreglo es la fuente de verdad; las tarjetas o filas muestran ese estado.

## Preparación y modelo

Crea un repositorio con HTML, CSS y JavaScript. Comienza por el constructor, el arreglo y una función independiente que cree y agregue libros:

```js
const myLibrary = [];

function Book(title, author, pages, read) {
  if (!new.target) throw new Error("Usa new");
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary(title, author, pages, read) {
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
  return book;
}
```

`crypto.randomUUID()` proporciona una identidad estable. No uses la posición del arreglo como identidad permanente: después de borrar el primer libro, las posiciones de todos los siguientes cambian. Esta API necesita un contexto seguro, como HTTPS o localhost.

## Requisitos de construcción

1. Agrega algunos libros de prueba llamando a `addBookToLibrary`. Escribe una función que recorra el arreglo y dibuje todos los libros en tarjetas o una tabla. No guardes los datos únicamente en el HTML: debes poder reconstruir la pantalla a partir del arreglo.
2. Crea un botón “Nuevo libro” que muestre un formulario con título, autor, número de páginas y estado de lectura. Puede aparecer en un panel o en un [diálogo](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog).
3. Escucha el evento `submit` del formulario. Su comportamiento habitual intenta enviar datos y navegar; usa [preventDefault](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) para controlar este ejercicio en el navegador. Convierte el campo de páginas a número, crea el libro, actualiza la pantalla y limpia o cierra el formulario.
4. Agrega un botón de eliminar a cada libro. Asocia la tarjeta al modelo mediante un [atributo de datos](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Solve_HTML_problems/Use_data_attributes), por ejemplo `data-book-id`. Busca el libro por su ID antes de quitarlo del arreglo.
5. Agrega un botón para cambiar el estado leído/pendiente. Implementa esa operación en `Book.prototype`; el controlador del botón llama al método y vuelve a mostrar el estado.
6. Revisa etiquetas, foco y tamaños en una pantalla pequeña. Los botones deben tener nombres comprensibles y no depender solamente del color.

No se exige persistencia después de recargar la página. El proyecto de tareas incorporará almacenamiento. Primero consigue que el modelo y los controles sean correctos.

## Criterios de aceptación

- Agregar tres libros muestra tres registros con IDs distintos; pueden tener el mismo título sin confundirse.
- Eliminar el primero y después cambiar el estado del último modifica exactamente el libro seleccionado.
- Cambiar leído/pendiente dos veces devuelve el estado inicial y no modifica a otros libros.
- Cancelar el formulario no agrega un libro. Enviarlo con Enter realiza una sola alta y no recarga la página.
- Llamar a la función de renderizado dos veces no duplica tarjetas ni controles.
- `myLibrary` contiene objetos `Book` y el método de alternancia se encuentra en su prototipo.

## Entrega y reflexión

Publica el repositorio y una vista funcional. El README debe indicar cómo abrirlo, qué controles tiene y que los datos se reinician al recargar. Explica con un ejemplo por qué un ID es mejor que un índice para relacionar datos y pantalla. Incluye el resultado de las comprobaciones anteriores y una captura del formulario abierto.
