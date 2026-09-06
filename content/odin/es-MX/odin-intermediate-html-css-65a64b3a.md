# Funciones CSS

## Argumentos y valores calculados

Una función CSS tiene un nombre y paréntesis con argumentos. El navegador interpreta esos argumentos y produce un valor: `rgb(0, 42, 255)` produce un color y `linear-gradient(90deg, blue, red)` produce una imagen de degradado. No son llamadas a JavaScript; forman parte de los valores CSS que el navegador conoce.

En esta lección usarás `calc()`, `min()`, `max()` y `clamp()` para expresar relaciones de tamaño. El objetivo es que una medida responda al espacio disponible sin acumular números que sólo funcionan en tu pantalla.

## `calc()`: calcular con unidades

`calc()` permite operaciones con medidas compatibles y mezclar unidades que se resuelven en el navegador. Los operadores `+` y `-` necesitan espacios a ambos lados. También puedes anidar cálculos, aunque conviene conservar una expresión legible.

```css
:root {
  --encabezado: 3rem;
  --pie: 40px;
  --principal: calc(100vh - (var(--encabezado) + var(--pie)));
}
main { min-height: var(--principal); }
```

El cálculo equivale a alto de pantalla menos encabezado y pie. Las propiedades que comienzan con `--` se explican en la siguiente lección. Cambia las unidades en el [ejemplo de calc](https://codepen.io/TheOdinProjectExamples/pen/OJxNxya) y comprueba el resultado. Es un ejemplo matemático, no necesariamente la mejor distribución de una página: Grid o Flexbox suelen evitar la necesidad de conocer la altura exacta de cada sección.

## `min()`: elegir el menor

`min()` recibe valores separados por comas y elige el menor después de resolver sus unidades. `width: min(150px, 100%)` mide 150 píxeles si caben; si el contenedor es menor, ocupa el 100% disponible. No significa “ancho mínimo”: de hecho, limita el crecimiento.

```css
.icono { width: min(150px, 100%); }
.lectura { width: min(80ch, 100vw - 2rem); }
```

Puedes escribir operaciones dentro de `min()` sin envolverlas otra vez en `calc()`. Manipula el [ejemplo de min](https://codepen.io/TheOdinProjectExamples/pen/RwLaLay), incluido su borde y `box-sizing`, para ver qué dimensión estás limitando.

## `max()`: elegir el mayor

`max()` hace la comparación contraria. `width: max(100px, 4em, 50%)` usa el valor que resulte mayor. Puede establecer un espacio mínimo que crezca con el texto o con el viewport. Sin embargo, si obligas a una caja a ser más ancha que la pantalla, aparecerá desbordamiento: la función no sustituye una decisión de diseño.

## `clamp()`: mínimo, preferido y máximo

```css
h1 { font-size: clamp(1.5rem, 1rem + 3vw, 3rem); }
```

El primer argumento establece un límite inferior; el segundo es el valor preferido que cambia con el viewport; el tercero, un límite superior. Aquí el título aumenta gradualmente, pero no baja de `1.5rem` ni supera `3rem`. Mezclar una parte relativa al texto y otra a la pantalla ayuda a evitar tamaños basados exclusivamente en `vw`; comprueba de todos modos el aumento de texto y el zoom.

## Predecir antes de redimensionar

Para `min(150px, 100%)`, imagina primero un padre de 120 píxeles. El porcentaje se resuelve a 120 y gana por ser menor. Si el padre crece a 300, gana 150. La regla no necesita un breakpoint explícito porque la comparación se vuelve a resolver al cambiar el contexto. En `max(100px, 4em, 50%)`, primero convierte mentalmente cada candidato a una medida comparable usando la fuente y el tamaño del padre. Sólo entonces puedes saber cuál gana.

En `clamp`, comprueba tres casos: el preferido por debajo del mínimo, dentro del rango y por encima del máximo. Si nunca entra al rango en los tamaños que pruebas, quizá tus límites no corresponden a la intención. No confundas una función que produce un valor válido con un diseño que funciona: ese valor aún puede dejar poco espacio, producir líneas demasiado largas o exceder el contenedor. Observa siempre la caja y su contenido después del cálculo.

## Actividad

1. Recorre la [lista de funciones CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Functions). Identifica funciones de color, imágenes y tamaño.
2. Lee [min, max y clamp en acción](https://web.dev/min-max-clamp/).
3. Crea un contenedor de lectura que conserve margen en pantallas pequeñas y deje de crecer en pantallas grandes. Antes de abrir DevTools, calcula qué argumento ganará a 320, 768 y 1440 píxeles.
4. Añade el título fluido y prueba zoom al 200%. Si se recorta, corrige la caja o el límite que impide crecer al contenido.

## Comprobación

- ¿Cuáles son las cuatro funciones matemáticas y qué devuelve cada una?
- ¿Dónde se escribe una función en una declaración CSS?
- ¿Por qué `min()` puede imponer un tamaño máximo y `max()` uno mínimo?
- ¿Cómo ayudan estas funciones al diseño adaptable?
