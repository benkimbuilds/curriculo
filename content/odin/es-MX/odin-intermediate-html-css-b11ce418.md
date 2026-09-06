# Propiedades personalizadas

## Declarar y reutilizar valores

Una propiedad personalizada permite nombrar un valor CSS y reutilizarlo. Si siete componentes comparten el mismo color, puedes cambiarlo en una declaración en lugar de localizar siete copias. Los nombres también comunican intención: `--color-error` dice más que un valor hexadecimal aislado.

```css
.aviso {
  --color-error: #9c231c;
  --borde-aviso: 1px solid currentColor;
  --tamano-aviso: calc(1rem + .2vw);
  color: var(--color-error);
  border: var(--borde-aviso);
  font-size: var(--tamano-aviso);
}
```

Los nombres comienzan con `--`, distinguen mayúsculas de minúsculas y no admiten espacios. Los guiones entre palabras son una convención útil. Puedes almacenar colores, atajos y cálculos, pero el valor final debe ser válido para la propiedad que lo consume. `var(--color-error)` inserta el valor al calcular la declaración.

## Valores de respaldo

El segundo argumento de `var()` es un respaldo para cuando la propiedad personalizada no está disponible o tiene un valor inválido en el sentido de resolución de variables. También puede contener otra referencia:

```css
.mensaje {
  --texto: white;
  background: var(--fondo-no-declarado, black);
  color: var(--otro-texto, var(--texto, yellow));
}
```

El fondo será negro y el texto blanco. Si `--texto` tampoco existiera, se usaría amarillo. Un detalle importante: si `--texto` existe pero contiene `20px`, no se usa automáticamente amarillo para reparar `color: 20px`; el valor sustituido no es válido como color. Prueba este caso para distinguir “variable ausente” de “valor inapropiado para esta propiedad”.

## Alcance e herencia

Las propiedades personalizadas declaradas normalmente con `--nombre` se heredan. Están disponibles en el elemento que coincide con el selector y en sus descendientes, salvo que éstos las sobrescriban. No aparecen automáticamente en hermanos ajenos a ese árbol.

```html
<section class="tema"><p class="dentro">Dentro del tema</p></section>
<p class="fuera">Fuera del tema</p>
```

```css
.tema { --fondo: lavender; }
.dentro, .fuera { background: var(--fondo, white); }
```

El párrafo interior hereda lavanda y el exterior usa blanco. Para valores compartidos por todo el documento utiliza `:root`, que normalmente selecciona `html` con mayor especificidad que el selector de tipo.

```css
:root { --color-texto: #1f2933; --color-fondo: #fff; }
body { color: var(--color-texto); background: var(--color-fondo); }
```

## Temas manuales y preferencias

Puedes redefinir variables cuando la raíz tenga una clase o atributo. En el [ejemplo de cambio de tema](https://codepen.io/TheOdinProjectExamples/pen/PojVRMb), las clases `dark` y `light` eligen grupos de valores. Los componentes siguen usando los mismos nombres; no necesitas duplicar todas sus reglas.

```css
:root[data-tema="oscuro"] {
  --color-texto: #f4f5f6;
  --color-fondo: #17212a;
}
```

También puedes usar una consulta de medios para respetar el tema configurado en el sistema:

```css
@media (prefers-color-scheme: dark) {
  :root { --color-texto: #f4f5f6; --color-fondo: #17212a; }
}
```

Declara primero un tema base fuera de la consulta. Después cambia la preferencia de tu sistema y observa el [ejemplo de tema automático](https://codepen.io/TheOdinProjectExamples/pen/powGZzE). `prefers-color-scheme` distingue `dark` y `light`; el caso claro incluye ausencia de una preferencia activa. No permite inventar temas como “sepia”, ni ofrece por sí mismo un control para que el usuario elija algo diferente de su sistema. Un selector manual puede complementar esa preferencia si defines explícitamente su prioridad.

## Seguir una variable en DevTools

Cuando un valor no se aplica, revisa primero que el nombre coincida exactamente. `--color-texto`, `--Color-texto` y `--color-text` son tres propiedades diferentes. Después identifica qué elemento declara la propiedad y si el elemento consumidor está dentro de su árbol de descendientes. Si no la hereda, inspecciona el respaldo de `var()` o la declaración que quedó inválida. Ese recorrido es más útil que duplicar la variable en todos los selectores hasta que aparezca el color.

La herencia sigue la estructura de los elementos, no la ubicación física de las reglas en la hoja. Una regla escrita al final puede declarar una variable local que sólo afecta a una sección; una regla al principio en `:root` puede servir a todo el documento. La cascada decide cuál declaración corresponde a cada elemento, y después se hereda el valor. Son etapas relacionadas, pero no equivalen al alcance léxico de una variable JavaScript dentro de una función.

El ejemplo inicial también muestra que una propiedad personalizada no está limitada a un único token. Puede guardar `1px solid black` y consumirse como un borde completo. Eso facilita coherencia, pero piensa qué necesitas cambiar después. Si algunas tarjetas comparten grosor y estilo pero tienen otro color, quizá resulte más claro nombrar esas decisiones por separado. No crees una variable por cada número sólo por hacerlo: nombra los valores que representan decisiones compartidas o configurables.

## Probar temas completos

Al construir temas, evita cambiar sólo fondo y texto principal. Revisa enlaces visitados, bordes, errores, foco, botones y superficies secundarias. Un color adecuado sobre blanco puede no serlo sobre un fondo oscuro. Las mismas variables pueden alimentar varios componentes, por lo que modificar una declaración tiene alcance amplio: inspecciona todos sus usos antes de considerar terminado el tema.

Para probar el cambio manual del ejemplo, modifica primero la clase de la raíz desde el inspector. Comprueba que los componentes cambian sin editar cada selector. Después observa el pequeño código que alterna la clase. Su función es escoger el contexto; la distribución de colores sigue en CSS. En el ejemplo automático, cambia la preferencia del sistema o utiliza la emulación del navegador para comparar claro y oscuro.

Si combinas control manual y consulta automática, define cuál gana. Una posibilidad es aplicar la consulta sólo cuando no exista una elección explícita y usar un atributo para la elección. Sin esa decisión, las reglas pueden competir por orden o especificidad y el usuario podría pulsar “claro” sin ver ningún cambio. La preferencia automática es un buen valor inicial, pero no sustituye necesariamente una elección disponible en el sitio.

## Actividad

1. Mira la [introducción a propiedades personalizadas](https://www.youtube.com/watch?v=PHO6TBq_auI).
2. Lee [Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties#inheritance_of_custom_properties), comenzando por la herencia.
3. Mira [los ejemplos de Kevin Powell](https://www.youtube.com/watch?v=_2LwjfYc1x8).
4. Inspecciona esta página y la página de Odin: identifica variables, dónde se declaran y dónde se consumen. Construye dos tarjetas que hereden un color global y una sección que lo sobrescriba localmente.

## Comprobación

- ¿Cómo declaras `--text-color` y consultas `--background-color`?
- ¿Dónde colocarías una variable compartida por todo el documento?
- ¿Cómo incorporarías la preferencia de tema del sistema?
- ¿Por qué cambiar una variable en una sección no necesariamente afecta a su hermana?
