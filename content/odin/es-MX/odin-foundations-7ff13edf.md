# Añade interfaz a piedra, papel o tijeras

Vuelve al [juego de consola](https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/rock-paper-scissors) y añade una interfaz con botones. Antes, usa una rama Git para conservar la versión que funciona mientras desarrollas la nueva.

## Ramas

Una rama es una referencia a una secuencia de commits. Permite desarrollar una función sin mover todavía la rama principal. Ya usas `main`, cuyo nombre configuraste en [la preparación de Git](https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/setting-up-git). Las ramas pueden comenzar desde main o desde otra rama.

`git branch nombre` crea una rama; `git checkout nombre` cambia a ella. `git checkout -b nombre` realiza ambas acciones. También encontrarás `git switch` y `git switch -c` en documentación moderna. `git branch` muestra las ramas y marca la actual con asterisco. Antes de cambiar revisa tus archivos pendientes: crear una rama no crea por sí solo un commit de ellos.

```bash
git checkout -b rps-ui
git push origin rps-ui
git branch
```

La primera orden crea la rama local; push la publica. Comprueba ambas ramas en GitHub con el selector, ilustrado en la [captura original](https://cdn.statically.io/gh/TheOdinProject/curriculum/46c18d8445051e016b1e415fe0227a0fa33cc825/foundations/javascript_basics/revisiting_rock_paper_scissors/imgs/00.png). Desde ahí tus commits nuevos avanzan rps-ui y main permanece en la versión anterior.

Una rama también permite compartir un intento que falla para pedir ayuda sin incorporarlo a main. Puedes crear una rama temporal, confirmar el ejemplo y publicar el enlace exacto. Eso no significa esconder errores del historial, sino separar trabajo en curso de una versión que quieres mantener estable.

## Actividad previa

Completa niveles 1–3 de la secuencia de introducción del [visualizador de ramas Git](https://learngitbranching.js.org/). Observa cómo se mueven referencias al crear commits y al combinar ramas.

## Construye la interfaz

1. Confirma que trabajas en rps-ui. Publica sus avances con `git push origin rps-ui`.
2. Retira la lógica que juega exactamente cinco rondas de forma automática. La nueva partida avanza por clics.
3. Crea tres botones: piedra, papel y tijeras. Registra listeners que llamen a playRound con la elección correspondiente y obtengan una nueva elección de computadora en cada clic. Puedes conservar mensajes de consola mientras conectas las piezas.
4. Añade un div para resultados. Cambia las salidas de console.log por actualizaciones del DOM.
5. Muestra el marcador acumulado y anuncia un ganador cuando una persona alcance **cinco puntos**. Esto cambia la regla anterior de cinco rondas; los empates no dan puntos y pueden alargar la partida.
6. Reorganiza funciones si hace falta. Evita recrear los marcadores en cada clic o registrar listeners repetidos tras cada ronda. Cuando termine una partida, bloquea rondas adicionales o establece claramente una acción de reinicio.

Prueba empates, las tres elecciones y una partida completa. Comprueba que un clic produce una sola ronda, el resultado y marcador coinciden, no se muestra un prompt y la victoria ocurre al llegar a cinco puntos.

## Integra la rama

Cuando funcione, revisa `git status` y confirma todo lo perteneciente a la función. Para combinar, primero cambia a la rama que recibirá los cambios:

```bash
git checkout main
git merge rps-ui
git log --oneline
git push origin main
```

merge incorpora los commits de rps-ui a la rama actual. Si las dos ramas cambiaron las mismas líneas de manera incompatible, aparecerá un conflicto: necesitas resolverlo y comprobar el resultado antes de completar la integración. No borres una de las versiones a ciegas ni fuerces push para evitar entender el conflicto.

Verifica en GitHub que main contiene la interfaz. Cuando la rama esté integrada y no se necesite, puedes quitar la referencia local con `git branch -d rps-ui` y la remota con `git push origin --delete rps-ui`. `-d` protege frente a eliminar trabajo no integrado; `-D` fuerza el borrado y no es la opción habitual de esta práctica.

Publica con GitHub Pages y añade al README el enlace de vista previa. Si participas en Odin, puedes compartirlo en la lección del proyecto una vez completo.

## Comprobación

- ¿Qué es una rama y qué cambia cuando haces un commit en ella?
- ¿Cómo creas, publicas y cambias de rama?
- ¿Desde qué rama ejecutas merge para integrar en main?
- ¿Qué uso tiene una rama temporal para pedir ayuda?

## Sigue las referencias de Git durante la práctica

Antes de crear rps-ui, anota el último commit de main. Crea la rama y realiza una modificación pequeña que puedas confirmar. Ahora revisa el historial de ambas ramas: la nueva contiene tu avance y main todavía señala el punto anterior. Cambiar de rama modifica qué versión de archivos representa tu directorio de trabajo, siempre que el estado pendiente permita hacerlo.

Publicar una rama no la integra automáticamente en main. GitHub puede mostrar ambas en su selector y cada URL de archivo puede corresponder a una rama distinta. Cuando pidas ayuda, señala cuál contiene el intento actual. Esto evita que alguien revise la versión de consola mientras tú intentas explicar un problema de botones.

Al ejecutar merge desde main, Git incorpora la historia de rps-ui al destino. En una historia sencilla puede mover la referencia sin crear un commit de combinación adicional; en otra puede necesitar un merge commit. Lo importante es comprobar el resultado y el historial, no esperar una forma visual única en todos los casos.

## Verifica el cambio de reglas del juego

La versión anterior contaba cinco rondas; la nueva termina cuando alguien acumula cinco puntos. Diseña una prueba con varios empates para demostrar la diferencia. Si la partida termina después de cinco clics aunque nadie tenga cinco puntos, conservaste una condición vieja que ya no corresponde al requisito.

El marcador debe sobrevivir entre clics y reiniciarse sólo cuando empieza otra partida. Si declaras las puntuaciones dentro del callback y les asignas cero en cada clic, nunca acumularán. Por otro lado, si reiniciar registra nuevos listeners sin retirar los anteriores, un clic puede jugar varias rondas. Comprueba estas dos situaciones antes de integrar la rama.

Después de publicar main, abre la página desplegada y repite una partida. Ver la rama actualizada en GitHub no demuestra que el sitio publicado ya sirva esa versión. La verificación final conecta historial, despliegue y comportamiento visible.
