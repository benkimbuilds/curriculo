# Proyecto: piedra, papel o tijeras

Construye [piedra, papel o tijeras](https://www.wikihow.com/Play-Rock,-Paper,-Scissors) contra la computadora. Esta primera versión se juega completamente en la consola del navegador. Las versiones con botones que puedas ver en proyectos de estudiantes corresponden a una lección posterior; ahora concéntrate en la lógica.

En cada paso aplica la secuencia de [resolución de problemas](https://www.theodinproject.com/lessons/foundations-problem-solving): escribe un plan o pseudocódigo, implementa y comprueba antes de avanzar. Consulta el texto sobre [construir estratégicamente un portafolio](https://dev.to/theodinproject/strategically-building-your-portfolio-1km4) si te distraes añadiendo funciones no necesarias. Conserva avances con [commits significativos](https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/commit-messages).

## Paso 1: estructura

Crea un repositorio nuevo, un documento HTML vacío y un script externo enlazado. Escribe `console.log("Hello World")` en el archivo JavaScript y comprueba el mensaje al abrir la página. No necesitas interfaz gráfica ni estilos todavía. Si no aparece, arregla la conexión antes de escribir el juego.

## Paso 2: elección de la computadora

Crea `getComputerChoice()`. Debe devolver aleatoriamente una de las cadenas `"rock"`, `"paper"` o `"scissors"`. Puedes mostrar mensajes en español conservando estos valores internos para las pruebas.

[Math.random](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) entrega un número mayor o igual a cero y menor que uno. Piensa cómo dividir ese intervalo en tres regiones para elegir. No necesitas arreglos para resolverlo. Llama a la función varias veces, muestra resultados y revisa las condiciones; obtener dos veces la misma elección no demuestra que el azar esté roto.

## Paso 3: elección humana

Crea `getHumanChoice()`, solicita la entrada mediante [prompt](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt) y devuelve la elección. Para esta primera versión puedes asumir entradas válidas: no es requisito repetir la pregunta tras un error, porque aún faltan herramientas que estudiarás después. Comprueba lo devuelto antes de conectarlo al juego. Indica claramente en el prompt cuáles valores acepta.

## Paso 4: puntuación

Declara `humanScore` y `computerScore` con valor inicial cero en el ámbito global durante la primera prueba. Deben poder incrementarse, así que elige una declaración adecuada. No confundas el puntaje con el número de rondas: un empate consume una ronda pero no da punto a ninguno.

## Paso 5: una ronda

Crea `playRound(humanChoice, computerChoice)`. Normaliza la elección humana para aceptar `rock`, `ROCK` y `RocK`. Usa sus parámetros para comparar las elecciones, muestra una frase que explique el resultado —por ejemplo «Pierdes: papel vence a piedra»— e incrementa sólo el marcador ganador.

```javascript
const humanSelection = getHumanChoice();
const computerSelection = getComputerChoice();
playRound(humanSelection, computerSelection);
```

Prueba las nueve combinaciones posibles: tres empates, tres victorias humanas y tres de la computadora. Puedes llamar temporalmente a playRound con argumentos fijos para revisar cada caso sin depender del azar.

## Paso 6: partida de cinco rondas

Crea `playGame()`. Mueve dentro de ella los marcadores y la definición de playRound para que pertenezcan a esa partida. Llama a playRound cinco veces y anuncia el ganador final, o empate, comparando los marcadores.

Obtén elecciones nuevas en cada ronda. Guardar una llamada en una variable guarda su resultado, no una operación que se repite sola: reutilizar `humanSelection` sin volver a preguntar repetiría la elección anterior. Puedes ajustar valores de retorno o añadir funciones auxiliares. Si ya conoces bucles, puedes usarlos; si no, cinco llamadas explícitas cumplen esta etapa.

## Aceptación

Comprueba que cada partida empieza en cero, hay exactamente cinco rondas, las elecciones se renuevan, las mayúsculas no alteran la elección humana y cada ronda actualiza sólo el puntaje apropiado. El anuncio final debe corresponder a los marcadores. Guarda y publica el repositorio; documenta cómo abrirlo y que se juega en la consola. Para ayuda con herramientas revisa [DevTools](https://www.theodinproject.com/lessons/foundations-javascript-developer-tools).
## Profundiza con el ejemplo

Comprueba también empates finales.
