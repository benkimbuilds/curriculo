# Proyecto: gato (Tic Tac Toe)

Construye un juego de gato que dos personas puedan jugar en el navegador. Este proyecto practica fábricas, cierres, encapsulación y separación del DOM. Primero debe funcionar en consola: si las reglas dependen de leer el texto de una celda HTML, todavía no has separado el modelo de su presentación.

## Diseña las responsabilidades

Guarda el tablero como un arreglo dentro de un objeto `Gameboard`. Representa jugadores con objetos que tengan nombre y marca. Utiliza otro objeto para dirigir turnos, inicio, fin y reinicio. Un controlador de pantalla traduce el estado a elementos y los clics a llamadas sobre el juego.

Mantén el menor código global posible. Las fábricas producen jugadores; las unidades de las que solo necesitas una instancia pueden envolverse en una IIFE. No escondas todo en un único objeto enorme: decide a cuál responsabilidad pertenece cada operación. Puedes revisar [construir desde adentro hacia afuera](https://www.ayweb.dev/blog/building-a-house-from-the-inside-out) para organizar el trabajo.

## Construcción por etapas

1. Crea repositorio y archivos HTML, CSS y JavaScript. Define qué representa una celda vacía y cómo se numeran las nueve posiciones.
2. Implementa consultar tablero, colocar marca en una posición válida y reiniciar. Devuelve una copia del arreglo si exponerlo permitiría saltarse tus reglas.
3. Implementa los turnos. Una jugada válida cambia de jugador; una jugada rechazada no debe consumir el turno.
4. Detecta todas las victorias: tres filas, tres columnas y dos diagonales. Detecta empate cuando el tablero está lleno sin ganador. Después del resultado, ninguna jugada debe modificarlo.
5. Juega manualmente en consola pasando posiciones a tus funciones. No necesitas pedir nombres por un formulario todavía.
6. Crea el controlador del DOM. Su función de renderizado recibe el estado y representa nueve celdas. No decide quién gana.
7. Conecta clics a posiciones, añade captura de nombres y botones de iniciar/reiniciar. Muestra el jugador actual y el resultado final con texto.

Este pequeño contrato sirve para planear tus funciones, no prescribe una implementación:

```text
play(4) -> jugada aceptada, cambia el turno
play(4) -> jugada rechazada, turno sin cambios
getState() -> tablero, jugador actual, ganador o empate
restart() -> nueve celdas vacías, resultado borrado
```

## Criterios de aceptación

- Las secuencias de índices `0,3,1,4,2` y `0,1,4,2,8` terminan en victoria de X por fila y diagonal respectivamente.
- Prueba las ocho líneas ganadoras, no solo esos dos ejemplos. Una secuencia `0,1,2,4,3,5,7,6,8` termina en empate.
- Repetir una celda ocupada no cambia su marca ni el jugador que debe jugar.
- Una posición fuera de 0–8 se rechaza sin alterar el tablero.
- Después de ganar no se aceptan movimientos, aunque queden celdas vacías.
- Reiniciar borra tablero, turno y resultado. Los controles siguen funcionando tras tres reinicios sin duplicar eventos.
- Puedes jugar una partida completa usando exclusivamente las funciones en consola.

## Entrega

Incluye repositorio, enlace público, instrucciones para dos jugadores y una explicación breve de los objetos. Conserva una tabla de las ocho victorias y el empate probado. Explica qué tendrías que cambiar para reemplazar la interfaz sin reescribir las reglas. La inteligencia artificial es opcional; este proyecto exige primero un juego local correcto.
