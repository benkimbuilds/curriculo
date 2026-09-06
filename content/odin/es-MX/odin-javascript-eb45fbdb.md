# Principios de programación orientada a objetos

La pregunta práctica no es cuántas clases tiene tu solución, sino qué cambios obligarían a modificar cada una. Si cambiar el texto de un botón exige tocar la detección de victoria, ambas responsabilidades están mezcladas. Si cambiar almacenamiento obliga a editar todas las vistas, su contrato no está concentrado en un límite claro. Haz ese experimento mental con tus proyectos anteriores antes de introducir patrones nuevos: imagina un cambio concreto y enumera los archivos afectados. Esa lista revela dependencias y ayuda a justificar una separación pequeña con un beneficio observable.

Saber escribir una clase o fábrica no resuelve dónde colocar una función. El diseño consiste en elegir responsabilidades y dependencias que permitan cambiar una parte sin romper muchas otras. Los principios siguientes orientan decisiones; no son reglas para multiplicar clases en un programa pequeño.

## Responsabilidad única

Una unidad debería tener una razón principal para cambiar. No significa “solo puede tener un método”: un tablero puede colocar marcas y reiniciarse porque ambas operaciones pertenecen al estado del tablero. Pero comprobar una victoria y crear un modal mezclan reglas del juego con presentación.

```js
function getWinner(board) {
  const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// En el controlador, después de una jugada:
// const winner = getWinner(board);
// if (winner) view.showWinner(winner);
```

La función de consulta devuelve un resultado; el controlador decide qué mostrar. Extraer el DOM a otro módulo pero llamarlo desde `isGameOver()` todavía deja a esa consulta con dos responsabilidades: determinar y actuar. Nombrar funciones según su contrato permite detectar esa mezcla.

## Acoplamiento

Dos objetos están fuertemente acoplados cuando dependen de tantos detalles internos del otro que cambiar uno obliga a reescribir ambos. Si `getWinner` necesita leer `document.querySelectorAll`, no puedes usarlo en una prueba Node o en una interfaz distinta sin simular la pantalla. Recibir el tablero como dato reduce esa dependencia.

No buscamos cero relaciones: una aplicación necesita colaboración. Buscamos relaciones explícitas, pequeñas y estables. Pasar una función `save` al módulo de tareas permite cambiar almacenamiento sin que el módulo conozca el proveedor. Pasar un objeto gigante con todo el programa oculta las dependencias que realmente usa.

## SOLID y composición

Responsabilidad única es la S de SOLID. Los otros principios son: abierto/cerrado, extender comportamiento con menos cambios a código estable; sustitución de Liskov, mantener los contratos esperados al sustituir tipos; segregación de interfaces, no exigir operaciones que un consumidor no necesita; e inversión de dependencias, depender de contratos y no de detalles concretos.

No fuerces cinco abstracciones para demostrar que conoces cinco letras. Por ejemplo, una clase `Bird` que siempre promete volar no modela bien un pingüino. Componer capacidades como nadar o volar puede expresar la diferencia sin una jerarquía llena de excepciones. La herencia sirve cuando la relación y el contrato son estables; la composición suele ser más flexible cuando quieres seleccionar comportamiento.

## Tareas

1. Lee [responsabilidad única con JavaScript](https://duncan-mcardle.medium.com/solid-principle-1-single-responsibility-javascript-5d9ce2c6f4a5) y consulta los ejemplos de [principios SOLID de WDS](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH9kocFX7R7BAe_CvvOCO_p9).
2. Lee [acoplamiento](https://web.archive.org/web/20170215102316/http://www.innoarchitech.com:80/scalable-maintainable-javascript-coupling) y observa la explicación de [composición frente a herencia](https://www.youtube.com/watch?v=wfMtDGfHWpA).
3. Revisa tu juego de gato: identifica una función que mezcle DOM y reglas. Sepárala, ejecuta las mismas partidas y documenta qué cambio de interfaz ahora sería más fácil.

## Comprobación

Antes de reorganizar, conserva una partida de ejemplo para demostrar que separar responsabilidades no cambió las reglas del juego.

- ¿Qué diferencia “una responsabilidad” de “una única operación”?
- ¿Por qué una consulta de victoria no debería además mostrar el resultado?
- ¿Qué significa acoplamiento fuerte en un ejemplo de tu código?
- ¿Qué flexibilidad aporta la composición y cuándo conservarías herencia?
