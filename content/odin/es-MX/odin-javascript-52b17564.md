# Mirar Git con más profundidad

Git no es solamente una secuencia de add, commit y push. Para modificar historial de forma consciente necesitas entender snapshots, referencias, índice y directorio de trabajo. Practica esta lección en un repositorio desechable nuevo, nunca primero en un proyecto compartido con trabajo valioso sin confirmar.

## Commits y referencias

Un commit identifica una instantánea y sus metadatos; normalmente tiene un padre, y una fusión puede tener varios. Una rama no es una carpeta ni una copia completa independiente: es una referencia móvil a un commit. HEAD suele apuntar a la rama actual; en estado detached apunta directamente a un commit. Al confirmar en una rama, su referencia avanza al nuevo commit, cuyos padres enlazan el historial.

`HEAD~2` sigue dos primeros padres desde HEAD. Eso permite seleccionar una región de historial sin enumerar todos los hashes. El índice o staging area prepara la próxima instantánea; el directorio de trabajo contiene tus archivos editables. No confundas cambios sin preparar con cambios que ya están listos para el siguiente commit.

## Laboratorio inicial

Crea un repositorio local o un repositorio de práctica vacío en GitHub y clónalo. En tu editor crea cuatro archivos `test1.md`, `test2.md`, `test3.md` y `test4.md`. Confirma los primeros tres por separado dejando el cuarto sin preparar, e introduce deliberadamente un error de texto en el mensaje del segundo commit. Inspecciona `git status` y `git log --oneline --graph --all`.

Configura un editor que puedas cerrar correctamente antes de usar comandos interactivos, por ejemplo `git config core.editor "code --wait"` en este repositorio si VS Code está instalado. Revisa [configurar el editor de commits](https://www.theodinproject.com/lessons/foundations-git-basics#changing-the-git-commit-message-editor) si Git abre uno desconocido.

## Corregir el último commit

```bash
git add test4.md
git commit --amend
```

El nuevo commit incluye lo que acabas de preparar y permite corregir el mensaje. No modifica internamente el objeto anterior: crea otro commit con otra identidad. Compara hashes antes y después. Para la práctica, conserva estos commits locales; no reescribas commits que otra persona ya pueda estar utilizando.

Si solo faltó un archivo, amend puede agruparlo con su cambio relacionado. Si el último commit ya está publicado en una rama compartida, normalmente agrega otro commit correctivo. El objetivo de una historia legible no justifica sorprender a colaboradores.

## Editar commits anteriores

`git rebase -i HEAD~2` abre una lista de los dos últimos commits, del más antiguo al más nuevo, el orden contrario al log habitual. Cada línea indica una operación. `pick` conserva el commit; `reword` cambia solo su mensaje; `edit` pausa para modificarlo. Reordenar líneas cambia el orden de aplicación y puede producir conflictos si un cambio depende de otro.

Para practicar como en Odin, cambia `pick` por `edit` en el commit cuyo mensaje contiene el error. Guarda y cierra el editor, ejecuta `git commit --amend`, corrige el mensaje y luego `git rebase --continue`. Inspecciona el historial resultante. No copies hashes de un ejemplo: usa los de tu repositorio.

Si la operación se complica y quieres regresar al inicio de ese rebase, `git rebase --abort` lo cancela. Antes de empezar, un `git branch practice-backup` crea una referencia al estado actual de commits; no respalda cambios sin confirmar. Comprueba siempre esos cambios por separado.

## Unir commits

`git rebase -i --root` permite trabajar desde el primero. Mantén `pick` en el primer commit y cambia a `squash` el segundo para combinarlo con el anterior. Al abrirse el editor de mensajes, escribe una descripción que explique el cambio conjunto. `fixup` también combina, pero descarta el mensaje del commit que se une.

Un historial de desarrollo puede contener correcciones intermedias útiles mientras trabajas; al presentar una función terminada, un equipo puede preferir una unidad coherente. Conoce la política del repositorio. Squash no sustituye revisar qué cambios se combinan ni verificar que el resultado compila.

## Dividir un commit

Si un commit mezcla dos responsabilidades, selecciónalo como `edit` en un rebase. Cuando Git pause en él, `git reset HEAD~` mueve la rama al padre y restablece el índice, pero conserva los archivos modificados. Ahora puedes preparar y confirmar cada parte por separado:

```bash
git reset HEAD~
git add test3.md
git commit -m "Agregar el tercer ejemplo de práctica"
git add test4.md
git commit -m "Agregar el cuarto ejemplo de práctica"
git rebase --continue
```

Este procedimiento se realiza en el commit pausado del laboratorio y requiere que tenga padre. No ejecutes reset sobre una rama importante solo para intentar “arreglar Git”. Examina `status` y el diff para confirmar que cada nuevo commit contiene la parte adecuada.

## Qué cambia cada reset

`git reset --soft referencia` mueve la referencia de rama pero deja índice y archivos como estaban. Permite reunir varios commits locales conservando sus cambios preparados.

`git reset referencia`, cuyo modo habitual es `--mixed`, mueve la referencia y actualiza el índice al commit seleccionado, pero conserva los archivos del directorio de trabajo. Los cambios pasan a estar sin preparar.

`git reset --hard referencia` también hace coincidir los archivos de trabajo con la instantánea elegida. Puede eliminar cambios sin confirmar que Git no podrá recuperar. Entiende este modo, pero no necesitas ejecutarlo sobre trabajo real para aprenderlo. Un respaldo de rama protege commits, no garantiza rescatar archivos que nunca confirmaste.

## Por qué la reescritura afecta a más de un commit

El hash de un commit depende también de su información de parentesco. Cambiar un commit antiguo implica recrear sus descendientes al reaplicarlos. Por eso una operación aparentemente pequeña, como corregir un mensaje anterior, puede producir múltiples identidades nuevas. Quienes basaron trabajo en las identidades previas no recibirán la historia nueva como un simple avance.

Reescribir historia publicada requiere coordinación. Para cambios compartidos, revertir mediante un commit nuevo suele ser más claro y seguro. La siguiente lección explica la relación con remotos.

## Observar antes y después

En cada operación del laboratorio conserva tres observaciones: el gráfico de commits, git status y el contenido de los archivos. Una reescritura puede mantener los mismos archivos finales y cambiar todos los hashes relevantes; un reset puede mover la referencia sin modificar tus archivos de trabajo. Mirar solamente uno de esos aspectos deja incompleta la explicación.

El historial no almacena una narración escrita a mano de las ramas. Los padres de commits forman un grafo y las referencias señalan puntos de ese grafo. Crear una rama agrega un nombre que apunta al estado actual; no necesita copiar toda la carpeta. Cuando haces otro commit en esa rama, avanza ese nombre, mientras otras referencias pueden permanecer donde estaban.

## Qué selecciona el rebase interactivo

HEAD~2 identifica un ancestro utilizado como límite, y el rebase ofrece reaplicar los commits posteriores a ese límite. La lista se procesa del más antiguo al más reciente porque un cambio posterior puede depender del anterior. Si mueves una línea hacia arriba, cambias qué contenido existe cuando se aplica; que el editor permita moverla no garantiza que la nueva secuencia sea coherente.

Edit pausa en un punto para que puedas modificar el contenido. Reword abre la edición del mensaje sin el mismo trabajo manual de archivos. Squash combina con el commit precedente en la lista, por lo que necesitas un commit anterior con el cual unirlo. El primer commit no puede simplemente marcarse squash sin definir una base anterior apropiada en esa secuencia.

Después de cada pausa, lee las instrucciones que Git muestra y usa status para saber en qué fase estás. Ejecutar otro comando de historial sin entender la operación pendiente puede complicar el estado. Si solo necesitas cancelar el experimento, abort vuelve al inicio de ese rebase, pero no sustituye comprobar archivos y referencias después.

## El índice durante una división

Al dividir un commit mediante reset mixto, conservas en el directorio de trabajo las modificaciones del commit pausado, pero el índice vuelve al padre. Por eso puedes elegir una parte con add y confirmar esa nueva unidad. Si usaras soft, todos los cambios seguirían preparados y tendrías que ajustar el índice antes de separar. Si usaras hard, perderías del directorio precisamente las modificaciones que querías redistribuir.

La selección puede ser por archivo o por fragmentos cuando un mismo archivo contiene dos cambios. Antes de confirmar cada parte, git diff --cached muestra qué instantánea estás preparando. El mensaje debe describir esa parte concreta y no una intención que todavía pertenece a la siguiente. Al terminar, verifica que el resultado final conserva todo el comportamiento del cambio original.

## Historial útil para otras personas

Una historia limpia no significa esconder errores o fabricar una secuencia perfecta. Significa presentar unidades comprensibles que ayuden a encontrar por qué cambió el programa. En tu rama local puedes reorganizar experimentos para lograrlo; una vez compartida, también importa conservar referencias que otros usan. Evalúa ambos objetivos antes de decidir entre reescribir y agregar una corrección.

## Tareas y comprobación

1. Completa en el laboratorio amend, reword/edit, squash y división. Guarda los gráficos antes y después.
2. Lee [ramificación y fusión](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging), [rebase](https://git-scm.com/book/en/v2/Git-Branching-Rebasing) y [reset explicado](https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified).
3. Explica qué estado conservan `--soft`, `--mixed` y `--hard` usando índice y directorio de trabajo, no solo “deshace cosas”.

- ¿Por qué amend crea otra identidad de commit?
- ¿A qué apunta una rama y cómo llegan sus commits a los anteriores?
- ¿Cómo unirías dos commits locales y cómo dividirías uno en dos?
- ¿Por qué una rama de respaldo no protege todo el trabajo sin confirmar?
