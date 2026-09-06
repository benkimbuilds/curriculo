# Estilizar aplicaciones React

Tus conocimientos de CSS siguen siendo válidos en React. El problema nuevo suele ser la escala: una clase global como `.title` puede afectar componentes que no deberían compartir estilo. Hay varias formas de administrar esa relación; cada una introduce costos y convenciones.

## CSS Modules

Un archivo `Card.module.css` exporta nombres de clases con alcance local. El proceso de construcción genera nombres únicos para evitar choques:

```css
/* Card.module.css */
.card { padding: 1.5rem; border: 1px solid #d6d6d6; }
.title { margin: 0 0 0.75rem; font-size: 1.25rem; }
```

```jsx
import styles from "./Card.module.css";

export default function Card({ title, children }) {
  return <article className={styles.card}><h2 className={styles.title}>{title}</h2>{children}</article>;
}
```

Otro componente puede usar su propia `.title` sin interferir. El CSS global sigue siendo útil para tipografía base, tokens o normalización. El alcance local no reemplaza la cascada ni impide herencia, así que continúa inspeccionando estilos computados cuando algo no coincide.

## Otras alternativas

CSS-in-JS permite describir estilos desde JavaScript y relacionarlos con props o estado. [styled-components](https://styled-components.com/) es un ejemplo. Algunas soluciones generan estilos en ejecución y otras en construcción; compara su compatibilidad con el entorno servidor antes de adoptarlas.

Los frameworks de utilidades, como [Tailwind CSS](https://tailwindcss.com), ofrecen clases pequeñas predefinidas para combinar directamente en JSX. Reducen CSS escrito a mano, pero agregan un vocabulario propio y no eliminan la necesidad de entender layout.

Las bibliotecas de componentes proporcionan piezas como diálogos, menús, calendarios y pestañas. [Material UI](https://mui.com/), [Radix](https://www.radix-ui.com/) y [Chakra UI](https://chakra-ui.com/) tienen distintos niveles de estilo y comportamiento incorporados. Sus garantías no sustituyen comprobar tu integración. Bibliotecas de íconos como [Lucide React](https://lucide.dev/guide/packages/lucide-react) entregan íconos como componentes; añade nombres accesibles donde un botón no tenga texto.

## Práctica del curso

Para estos proyectos usa CSS Modules y construye los estilos tú mismo; una biblioteca de íconos sí es apropiada. El propósito es consolidar CSS, no completar una interfaz pegando componentes ya terminados. Más adelante podrás comparar esas soluciones con experiencia real de lo que simplifican.

1. Lee la [documentación de CSS Modules](https://github.com/css-modules/css-modules) y el [tutorial para React](https://www.makeuseof.com/react-components-css-modules-style/). Crea dos tarjetas con clases de igual nombre y estilos distintos.
2. Compara [CSS y CSS-in-JS](https://blog.logrocket.com/css-vs-css-in-js/) y el [análisis de CSS-in-JS](https://css-tricks.com/a-thorough-analysis-of-css-in-js/).
3. Recorre la documentación de styled-components y explica qué problema resolvería frente a tu módulo CSS.

## Comprueba lo aprendido

- ¿Cómo se importa y utiliza una clase de CSS Modules?
- ¿Qué significa CSS-in-JS y qué cambia frente a un estilo inline?
- ¿Qué aporta una biblioteca de componentes frente a un framework de utilidades?
