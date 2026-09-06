# Código legible

Gran parte del desarrollo consiste en leer código: de colegas, de personas que ya no están y tuyo de hace semanas. La legibilidad reduce el trabajo de reconstruir intenciones. No se espera escribir perfecto desde el primer intento; mejora de forma gradual mientras sigues construyendo.

Compara una función llamada x, con argumentos z y variables w, contra ésta:

```javascript
const generateUserGreeting = function (name) {
  const greeting = "Hello ";
  return greeting + name;
};
generateUserGreeting("John");
```

Ambas podrían hacer exactamente lo mismo. La segunda permite anticipar su propósito por sus nombres y seguir su estructura por la indentación. En un bucle corto, i puede ser una convención razonable; fuera de contextos así, letras aisladas obligan a recordar significados ocultos.

## Nombres y vocabulario

JavaScript suele usar **camelCase**: primera palabra en minúscula y siguientes con inicial mayúscula, como `generateUserGreeting`. Las convenciones varían por equipo; la meta común es claridad y consistencia, no obedecer una preferencia personal en todo proyecto.

Una función representa una acción, así que suele comenzar con verbo; una variable representa una cosa o estado. `getCount()` sugiere una función, mientras `numberOfThings` sugiere un dato. Llamar `getCount` a un número resulta confuso; llamar `myName` a una función no expresa qué hace.

Usa un vocabulario consistente. `getPlayerScore`, `getPlayerName` y `getPlayerTag` indican acciones relacionadas. Si mezclas `getUserScore`, `fetchPlayerName` y `retrievePlayer1Tag` sin diferencia real, quien lee podría buscar una distinción inexistente entre user, player y player1, o entre get, fetch y retrieve. Si sí existe una diferencia —por ejemplo una llamada remota— nómbrala de forma deliberada.

## Valores con significado

```javascript
const ONE_HOUR = 60 * 60 * 1000;
setTimeout(stopTimer, ONE_HOUR);
```

El número 3600000 por sí solo obliga a recordar unidades o calcular. Un nombre comunica el concepto y facilita buscarlo. Las mayúsculas suelen reservarse para constantes conceptuales conocidas, como milisegundos por hora; no todo valor declarado con const necesita mayúsculas. `setTimeout` usa milisegundos, por eso la conversión aparece explícita.

## Formato consistente

La [discusión de tabs frente a espacios](https://www.reddit.com/r/programming/comments/p1j1c/tabs_vs_spaces_vs_both/) ilustra que hay preferencias distintas. Escoge la convención del proyecto y mantenla. Indenta el contenido de funciones y condiciones para mostrar anidación, pero no confíes en espacios para cambiar el comportamiento del programa.

Líneas moderadas —a menudo alrededor de 80 caracteres— facilitan leer sin desplazamiento horizontal. Divide expresiones largas después de operadores o comas y alinea continuaciones de forma consistente. No hay una única distribución correcta; evita mezclar varias sin motivo.

```javascript
const total =
  subtotal +
  shippingCost +
  serviceFee;
```

JavaScript inserta algunos puntos y coma automáticamente. Hay casos límite donde omitirlos cambia cómo se interpreta el código; para estos ejercicios acostúmbrate a escribirlos. Si más adelante un proyecto usa otra convención, sigue su formato y entiende sus consecuencias.

## Comentarios que aportan

No guardes en comentarios un diario de cambios con fechas e iniciales: Git ya registra autores, fechas y diffs. Ese segundo historial acaba incompleto y agrega ruido. Tampoco conserves bloques de código obsoleto comentados indefinidamente. Desactivarlos durante un experimento puede ayudar; cuando dejan de necesitarse, elimínalos y confía en el historial.

Un comentario que sólo traduce una línea a español duplica información y puede quedar desactualizado. En una función que extrae texto entre corchetes, nombres como `extractTextWithinBrackets`, `bracketTextStart` y `bracketTextEnd` pueden comunicar más que «función para extraer texto».

```javascript
function extractTextWithinBrackets(text) {
  const bracketTextStart = text.indexOf("[") + 1;
  const bracketTextEnd = text.indexOf("]");
  return text.substring(bracketTextStart, bracketTextEnd);
}
```

Ese ejemplo asume que ambos corchetes existen y están en orden. En un programa real, explicar una precondición así o validar la entrada puede ser importante. La legibilidad no reemplaza corrección.

Los buenos comentarios sí son valiosos cuando conservan una razón que no se ve en la sintaxis: por qué una llamada debe preceder a otra, una restricción externa o las unidades de una fórmula. El ejemplo de Odin sobre calcular IMC explica que la fórmula usa kilogramos y metros al cuadrado, de modo que una entrada en centímetros necesita conversión. No basta ver una división por 100 para conocer esa intención. El comentario complementa nombres y unidades, no debería repetir cada operación.

La meta no es eliminar todos los comentarios ni añadirlos en cada línea. Pregunta qué necesitará entender una persona futura y si un mejor nombre, una función más pequeña o una nota breve lo expresa mejor.

## Actividad

1. Lee [10 principios para mantener código limpio](https://onextrapixel.com/10-principles-for-keeping-your-programming-code-clean/).
2. Lee [el código explica cómo, los comentarios por qué](https://blog.codinghorror.com/code-tells-you-how-comments-tell-you-why/) y [programar sin comentarios redundantes](https://blog.codinghorror.com/coding-without-comments/).
3. Revisa una función de tu juego. Mejora nombres, formato o un comentario sin cambiar su comportamiento. Ejecuta las mismas combinaciones antes y después y crea un commit enfocado.

## Comprobación

- ¿Por qué importa la legibilidad aunque un programa funcione?
- ¿Qué principios ayudan con nombres, constantes y formato?
- ¿Qué diferencia un comentario útil de uno redundante?
- ¿Qué información pertenece al historial Git?

## Compara dos formas de expresar lo mismo

Toma la función de saludo y cambia sólo los nombres, sin tocar las operaciones. Pregunta a otra persona qué cree que hace antes de ejecutarla. Si puede anticiparlo con generateUserGreeting pero no con x, observaste el valor de un nombre descriptivo. No necesitas que el nombre repita cada detalle del algoritmo; sí que identifique la responsabilidad.

Después cambia sólo la indentación y los espacios de una copia. El comportamiento puede seguir igual, pero la lectura exige más esfuerzo cuando los límites visuales no corresponden a funciones y condiciones. La consistencia permite dedicar atención al problema en vez de descifrar cómo está escrito. Ese beneficio crece cuando varias personas revisan muchos archivos.

## No escondas diferencias reales

Usar vocabulario consistente no significa llamar igual a acciones distintas. Si una función obtiene datos de memoria y otra realiza una petición remota, puede existir una razón para distinguirlas. Lo que debes evitar es alternar palabras sólo por variedad de estilo. En código, una diferencia de nombre puede comunicar una diferencia de comportamiento que quien lee intentará encontrar.

Algo similar ocurre con constantes. Dar nombre a un número importante ayuda, pero crear una constante para cada literal trivial puede fragmentar la lectura. Pregunta si el valor expresa una regla, una unidad o una decisión que merece un nombre. ONE_HOUR comunica una duración estable y evita volver a calcularla mentalmente; un nombre genérico como VALUE no mejora mucho respecto al número original.

## Revisa comentarios durante cambios

Un comentario puede quedar obsoleto aunque el código se actualice correctamente. Si cambiaste la unidad de una entrada o la responsabilidad de una función, revisa también la explicación cercana. Un comentario falso puede ser más confuso que ninguno porque invita a confiar en una intención que ya no existe.

El ejemplo de extracción entre corchetes muestra varias opciones. Un comentario que dice «extraer texto» es demasiado general; otro que explica «texto entre corchetes, excluyendo los delimitadores» aporta un contrato. Un nombre de función y variables precisos pueden expresar ese mismo contrato sin repetirlo en una nota. Elige la combinación que reduzca preguntas reales del lector.

## Mejora con comportamiento protegido

Antes de reorganizar tu juego, ejecuta una ronda ganadora, una perdedora y un empate. Después mejora una cosa, como nombres de variables, y repite esos casos. Si cambias formato, nombres y lógica al mismo tiempo, será más difícil saber qué causó una diferencia. Una limpieza pequeña y comprobada enseña más que una reescritura completa que ya no puedes comparar.

No pospongas todos los proyectos hasta sentir que escribes código elegante. La experiencia surge de construir, detectar dificultades y mejorar. Tu primera solución puede ser repetitiva y aun así ofrecer una base útil para aprender a separarla. Conserva esa progresión en commits que expliquen qué problema de lectura o mantenimiento resolviste.

Revisa también si un nombre sigue siendo cierto después de ampliar la función; un nombre desactualizado puede confundir tanto como un comentario incorrecto.
