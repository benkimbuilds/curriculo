# Git en trabajo real y contribuciones abiertas

Dominar Git exige práctica. Una historia comprensible ayuda a revisar cambios y entender decisiones meses después. Escribe mensajes que expliquen propósito y alcance; consulta [mensajes de commit](https://www.theodinproject.com/lessons/foundations-commit-messages) y conoce [Conventional Commits](https://www.conventionalcommits.org), aunque cada repositorio puede tener otra convención.

Esta lección conserva el flujo de contribución de Odin: un repositorio original, un fork propio, un clon local y una rama por cambio. La práctica no requiere enviar una PR de prueba a mantenedores. Si no tienes un issue real asignado, termina en tu fork o practica con un repositorio de tu cohorte.

## Tres repositorios, responsabilidades diferentes

`upstream` suele nombrar el original al que quieres contribuir. `origin` suele apuntar a tu fork en GitHub. El clon local obtiene cambios de ambos, pero normalmente solo tienes permiso para publicar en tu fork. Los nombres son convenciones configurables, no palabras especiales que otorguen permisos.

```text
original/upstream -> fetch -> clon local
clon local -> push -> fork/origin
fork/origin -> pull request -> original/upstream
```

Una PR propone integrar tu rama; no concede escritura directa en el original. Revisa siempre base y destino al abrirla para no proponer una fusión contra una rama o repositorio equivocado.

## Preparación

1. Lee [CONTRIBUTING de Odin](https://github.com/TheOdinProject/curriculum/blob/main/CONTRIBUTING.md) antes de trabajar en una contribución real. Sigue sus requisitos de issue, alcance y verificación.
2. Abre [curriculum](https://github.com/TheOdinProject/curriculum/tree/main) y crea un fork si vas a practicar ese flujo. Un fork copia el repositorio, no únicamente el archivo abierto.
3. Clona tu fork con la URL que proporciona GitHub. `origin` se configura automáticamente hacia esa copia.
4. Desde el clon, agrega el original como segundo remoto:

```bash
git remote add upstream git@github.com:TheOdinProject/curriculum.git
git remote -v
```

Puedes usar HTTPS si esa es tu configuración. Comprueba ambas direcciones; no asumas que origin sigue apuntando a donde crees después de copiar un repositorio.

## Flujo de una mejora

Mantén `main` como base actualizada. Crea una rama con nombre relacionado al cambio, por ejemplo `docs/clarify-modules`, y confirma unidades pequeñas siguiendo la convención del proyecto. Revisa el diff antes de cada commit y no incluyas archivos generados o configuración personal.

Durante tu trabajo alguien puede actualizar el original. Obtén sus commits con `git fetch upstream`. Eso actualiza `upstream/main` pero no tu main local. Con tus cambios confirmados, integra de forma explícita:

```bash
git switch main
git merge upstream/main
git switch docs/clarify-modules
git merge main
```

Primero actualizas tu base; después llevas esa base a tu rama de trabajo para resolver conflictos allí. Todavía no estás incorporando tu propuesta a la rama original. Esto permite que el resultado que presentes ya combine correctamente con los cambios recientes.

Separar fetch de merge facilita ver las dos operaciones. `git pull upstream main` combina obtener con una integración, cuya estrategia puede depender de opciones/configuración. Aprende qué hará en tu repositorio antes de utilizarlo como atajo.

Si hay conflictos, lee ambas versiones, resuelve según el comportamiento esperado y confirma la resolución. Vuelve a ejecutar los comandos de verificación del repositorio. Un archivo sin marcadores de conflicto puede seguir conteniendo una combinación lógicamente incorrecta.

## Publicar la propuesta

Envía tu rama a tu fork con `git push -u origin docs/clarify-modules`. Inspecciona el diff publicado. Una descripción útil de PR explica el problema, el cambio observable y cómo lo verificaste; enlaza el issue real cuando corresponda.

Si estás haciendo cambios arbitrarios para practicar, detente aquí: no abras una PR de ensayo contra Odin. Sus mantenedores consideran esas solicitudes ruido y no deben revisar trabajo ficticio. Si resolviste un issue asignado conforme a su guía, abre la PR desde tu rama del fork hacia `main` del original.

La revisión puede pedir cambios. Respóndelos en la misma rama y verifica nuevamente. Respeta el flujo de integración del proyecto; una PR no está terminada solamente por aparecer abierta.

## Revisar qué estás proponiendo

Una rama puede contener cambios correctos pero ajenos al issue. Antes de enviar la propuesta, compara contra la base y revisa cada archivo. Comprueba que no arrastraste experimentos, capturas innecesarias, archivos de editor o reformateos masivos. Una PR pequeña permite que la persona revisora comprenda intención y resultado con menos contexto, y reduce el trabajo de corregirla si la base avanza.

Después de atender comentarios, revisa de nuevo el diff completo, no solamente el último commit. Un ajuste puede resolver un comentario e introducir una inconsistencia con otro archivo. Si modificaste una interfaz exportada, busca sus consumidores y ejecuta las comprobaciones relevantes. Describe la verificación real: un comando que no ejecutaste no debe aparecer como pasado.

Cuando la propuesta se integre, actualiza tu main desde upstream antes de comenzar la siguiente. Evita basar cada tarea nueva en la rama anterior por costumbre, porque puede arrastrar cambios todavía no aprobados o commits reorganizados durante la integración.

## Tareas y comprobación

1. Dibuja origin, upstream, main local y tu rama, con flechas de fetch, merge y push.
2. Practica actualizar una rama después de un cambio en la base y resolver un conflicto en un repositorio de ensayo.
3. Redacta una descripción de PR con evidencia reproducible. Para una contribución real, verifica la guía antes de enviarla.

- ¿Qué nombre suele recibir el remoto original y cuál el fork?
- ¿Por qué puedes publicar en tu fork pero necesitas una PR para el original?
- ¿Qué debes hacer antes de fusionar main dentro de tu rama?
- ¿Dónde debes detenerte si no estás resolviendo un issue legítimo de Odin?
