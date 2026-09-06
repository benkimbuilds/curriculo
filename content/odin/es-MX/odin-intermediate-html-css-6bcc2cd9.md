# Frameworks y preprocesadores CSS

## Por qué conocerlos

En un empleo puedes encontrar herramientas que reducen repetición y organizan estilos. Conocer sus categorías te ayuda a entender un proyecto, pero no sustituye dominar CSS. Durante estos ejercicios continúa escribiendo CSS directamente: aprender cascada, tamaños y distribución facilita cambiar de herramienta después y depurar cuando una abstracción deja de ayudar.

## Frameworks

Un framework CSS ofrece convenciones y estilos reutilizables. [Bootstrap](https://getbootstrap.com/) incluye componentes comunes y patrones de interacción. [Tailwind](https://tailwindcss.com/) utiliza clases de utilidad que normalmente representan decisiones individuales de estilo. [Bulma](https://bulma.io/) y [Foundation](https://get.foundation) son otros ejemplos.

En un enfoque por componentes, una clase como `.btn` puede aplicar borde, fondo, tipografía y relleno. En uno de utilidades, varias clases expresan esas decisiones por separado. En ambos casos necesitas conocer la estructura esperada y qué reglas termina recibiendo el navegador.

```css
/* Una abstracción propia, escrita aquí con CSS normal. */
.boton {
  display: inline-block;
  padding: .75rem 1rem;
  border: 1px solid currentColor;
  border-radius: .5rem;
  font: inherit;
}
```

Un framework puede acelerar un prototipo y dar consistencia, pero también introducir estilos o dependencias que luego cuesten quitar. Muchos sitios se parecen cuando conservan exactamente los valores iniciales. Sobrescribirlos sin entender especificidad suele producir reglas cada vez más fuertes y difíciles de mantener. Antes de adoptar una herramienta, pregunta si sus convenciones coinciden con el diseño y qué trabajo implica mantenerla.

## Preprocesadores

Un preprocesador transforma un lenguaje extendido en CSS que entiende el navegador. Puede ofrecer bucles, condiciones, funciones reutilizables y organización entre archivos. [Sass](https://sass-lang.com/), [Less](https://lesscss.org/) y [Stylus](https://stylus-lang.com/) son ejemplos. El navegador no interpreta directamente su sintaxis de origen: necesitas ejecutar el compilador y servir el resultado.

```scss
$separacion: 1rem;
.lista {
  padding: $separacion;
  li { margin-block: $separacion; }
}
```

Ese ejemplo usa sintaxis Sass; no lo pegues directamente en una hoja CSS esperando que `$separacion` funcione. CSS moderno ya ofrece propiedades personalizadas y [anidamiento nativo](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting). No son idénticos a las variables y transformaciones de un compilador: las propiedades personalizadas participan en cascada e herencia durante la ejecución. Evalúa qué capacidad adicional necesitas antes de añadir una etapa de compilación.

## Leer lo que recibe el navegador

Si inspeccionas un proyecto con framework, DevTools seguirá mostrando CSS. Localiza una clase del botón y observa sus declaraciones. Cambia temporalmente un valor para comprobar si comprendes el resultado. Aprender el nombre de una clase sin entender su efecto puede permitir copiar una interfaz, pero no resolver un desbordamiento, una herencia inesperada o un estado que no tiene suficiente contraste.

Con un preprocesador, conserva la distinción entre fuente y resultado. Editar el CSS generado puede parecer una solución rápida, pero la próxima compilación puede sobrescribir el cambio. Debes encontrar el archivo de origen y ejecutar el proceso correspondiente. Ese proceso añade una responsabilidad al proyecto: documentar cómo generar la salida y comprobar que el entorno de publicación utiliza el mismo procedimiento.

Antes de elegir, considera también al equipo. Una herramienta puede ser habitual en una empresa y razonable por consistencia, aunque no la hubieras elegido para una página pequeña. Conocer las categorías permite hacer preguntas concretas sobre mantenimiento y requisitos, en lugar de asumir que toda herramienta popular es necesaria para cualquier sitio.

## Actividad

1. Lee [qué es un framework CSS](https://medium.com/html-all-the-things/what-is-a-css-framework-f758ef0b1a11). Compara una biblioteca por componentes y una de utilidades.
2. Recorre la [comparación de Sass, Less y Stylus](https://www.lambdatest.com/blog/css-preprocessors-sass-vs-less-vs-stylus-with-examples/). Localiza código fuente y CSS generado.
3. Lee [desventajas de los preprocesadores](https://adamsilver.io/blog/the-disadvantages-of-css-preprocessors/). Ten en cuenta que CSS añadió propiedades personalizadas y anidamiento después de algunas comparaciones históricas.
4. Explica cómo resolverías un problema de tu proyecto con CSS normal y qué cambiaría al adoptar una herramienta. No instales una dependencia sólo para completar esta lección.

## Comprobación

- ¿Qué entrega un framework CSS y qué convenciones necesitas aprender?
- ¿Qué entrada y salida tiene un preprocesador?
- ¿Por qué aprender CSS primero ayuda a depurar ambas herramientas?
