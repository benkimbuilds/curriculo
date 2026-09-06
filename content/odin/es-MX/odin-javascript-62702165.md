# Proyecto: batalla naval

Implementa Battleship usando TDD. Dos jugadores colocan barcos en sus tableros y alternan ataques a coordenadas del oponente. Gana quien hunde toda la flota contraria. Consulta [las reglas](https://en.wikipedia.org/wiki/Battleship_(game)) o prueba [una versión en línea](http://en.battleship-game.org/) si no conoces el juego.

Avanza por objetos y contratos. Escribe una prueba, observa el fallo e implementa lo necesario. Las pruebas unitarias de esta actividad cubren reglas y estado, no la apariencia del DOM. Aun así verifica manualmente la interfaz terminada. Utiliza Jest y la configuración ESM/Babel de las lecciones de pruebas.

## Ship

Crea clase o fábrica `Ship` con longitud, cantidad de impactos y una forma de saber si se hundió. `hit()` incrementa impactos; `isSunk()` calcula si alcanzan la longitud. Define una longitud válida y evita estados imposibles. Prueba la interfaz pública, no cada helper privado.

Un barco de longitud tres no está hundido al empezar ni después de dos impactos, pero sí al tercero. No cuentes dos ataques a la misma coordenada como dos impactos: esa responsabilidad se coordina con el tablero, que conoce dónde ocurrió cada ataque.

## Gameboard

Implementa un tablero que pueda colocar barcos en coordenadas concretas. Cada colocación debe respetar límites y no superponer barcos. Puedes representar cada barco una vez y hacer que sus casillas apunten a esa instancia.

`receiveAttack(coordinates)` determina si hay barco. Si lo hay, llama hit en la instancia correcta; si no, registra un fallo. Guarda las coordenadas atacadas para impedir repeticiones y para renderizar aciertos/fallos. Agrega una consulta que indique si todos los barcos colocados están hundidos.

Antes de crear la pantalla, prueba barcos horizontales y verticales, límites, superposición, aciertos, fallos y repetición de disparos. El estado del juego debe poder verificarse con la suite, no depender de mirar logs.

## Player y controlador

Crea `Player` para jugador humano y computadora; cada instancia tiene su propio tablero. Otro módulo dirige turnos e inicio/fin. La vista muestra el tablero propio y el oponente sin revelar barcos enemigos no alcanzados.

1. Inicializa dos jugadores con posiciones predeterminadas para desarrollar el flujo.
2. Renderiza ambos tableros a partir de datos de Gameboard, mediante funciones de un módulo del DOM.
3. Cuando una persona pulsa una coordenada enemiga, el controlador llama a las operaciones del modelo y vuelve a mostrar el resultado.
4. Alterna turnos solo después de ataques legales. La computadora elige una coordenada válida que todavía no haya atacado.
5. Al hundirse toda una flota, muestra el ganador y bloquea nuevas jugadas.
6. Añade colocación de barcos por el usuario: puede capturar coordenadas y orientación o solicitar una distribución aleatoria válida antes de comenzar.

Para la computadora, elegir entre coordenadas no utilizadas evita bucles de reintentos cuando quedan pocas casillas. Si introduces un retraso visual, bloquea ataques humanos mientras espera y cancela ese trabajo al reiniciar para que una respuesta vieja no afecte una partida nueva.

## Criterios de aceptación

- Ship cambia correctamente de no hundido a hundido según su longitud.
- No puede colocarse un barco fuera del tablero ni sobre otro; una colocación rechazada conserva el estado anterior.
- Un ataque a un barco incrementa exactamente sus impactos; un fallo se registra sin modificar barcos.
- Repetir una coordenada no añade impacto ni consume otra jugada válida.
- Los jugadores tienen tableros independientes y el humano no puede atacar durante el turno de la computadora.
- La computadora nunca repite coordenadas ni ataca fuera del tablero.
- El juego termina cuando todos los barcos de un jugador están hundidos y no acepta más ataques.
- Reiniciar restaura flotas, turnos y marcas, sin listeners duplicados ni temporizadores antiguos.
- Las pruebas del modelo se ejecutan sin un documento HTML, y una partida completa se ha verificado en la página publicada.

## Extensiones y entrega

Puedes agregar arrastrar y soltar para colocar barcos, dos jugadores compartiendo dispositivo con una pantalla intermedia que oculte las flotas, o una computadora que busque casillas vecinas después de acertar. Estas extensiones no reemplazan los requisitos anteriores.

Entrega código, URL, comando de pruebas y una explicación de responsabilidades entre Ship, Gameboard, Player, controlador y vista. Incluye evidencia de un fallo prevenido por un test y los resultados de los casos de aceptación.
