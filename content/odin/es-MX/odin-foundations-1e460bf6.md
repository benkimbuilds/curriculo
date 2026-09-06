# Introducción a HTML y CSS

HTML y CSS son dos piezas básicas de la web. **HTML**, HyperText Markup Language, expresa estructura y contenido: párrafos, enlaces, listas, imágenes, formularios y botones. **CSS**, Cascading Style Sheets, expresa presentación: colores, fuentes, espacios y distribución. Trabajan juntos, pero responden preguntas diferentes: qué es una pieza de contenido y cómo debe verse.

Por ejemplo, HTML representa un botón y su texto. CSS puede darle fondo oscuro, texto blanco y espacio interior. JavaScript puede responder cuando alguien lo pulsa. No necesitas JavaScript para mostrar una página ni CSS para que un enlace funcione.

```html
<h1>Mi primer sitio</h1>
<p>Estoy aprendiendo a construir para la web.</p>
<button>Saludar</button>
```

En una hoja de estilos, una regla como ésta modifica la presentación del botón:

```css
button {
  color: white;
  background-color: darkblue;
}
```

HTML es un lenguaje de marcado y CSS de estilos. No son lenguajes de programación de propósito general como JavaScript, que permite expresar decisiones y operaciones. Esta distinción no los hace menos importantes: una aplicación puede fallar como experiencia aunque su lógica sea correcta si la estructura es confusa o el diseño impide usarla.

## Actividad

1. Mira [HTML, CSS y JavaScript explicados en cuatro minutos](https://www.youtube.com/watch?v=gT0Lh1eYk78).
2. En una página habitual identifica un título, un enlace y un botón. Describe primero su función y después su apariencia.
3. Revisa esta [comparación de las tres tecnologías](https://brytdesigns.com/html-css-javascript-whats-the-difference/) cuando necesites separar responsabilidades.

## Comprobación

- ¿Qué significan HTML y CSS?
- ¿Cuál usarías para colocar párrafos?
- ¿Cuál usarías para cambiar la fuente y el fondo de un botón?
- ¿Qué responsabilidad añade JavaScript?

Conserva esta separación de responsabilidades al construir tus primeras páginas: contenido, presentación y comportamiento pueden evolucionar por separado.
