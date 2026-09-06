# Mensajes de commit

El historial es una explicación de cómo y por qué cambió un proyecto. Sirve para investigar errores, colaborar y retomar trabajo después de semanas. También permite que quien revisa un portafolio vea el proceso, en lugar de encontrar un único commit con todo el resultado.

## Explica el motivo

Un mensaje como `fix a bug` o `actualizado` no permite saber qué problema se resolvió. Un buen mensaje identifica el cambio y explica la razón cuando no sea evidente. Tiene un asunto breve y, si hace falta, un cuerpo separado por una línea vacía.

```text
Agrega enlace y texto alternativo al logotipo

El logotipo llevaba al inicio pero no tenía un nombre accesible.
Ahora el enlace puede identificarse sin depender de la imagen.
```

El asunto permite explorar el historial rápidamente. El cuerpo conserva contexto que no siempre se deduce del diff. Procura un asunto cercano a 50 caracteres y evita extenderlo más allá de unos 72; es una convención de legibilidad, no una limitación técnica de Git. Usa voz activa y describe un cambio concreto. Algunos equipos aplican formatos específicos, pero la utilidad del mensaje sigue siendo la misma.

## Cómo escribir varias líneas

Si configuraste [VS Code como editor de Git](https://www.theodinproject.com/lessons/foundations-git-basics#changing-the-git-commit-message-editor), ejecuta `git commit` sin `-m`. En la pestaña que se abre escribe asunto, línea vacía y explicación; guarda y cierra. Git crea el commit con los cambios preparados. El editor permite revisar líneas largas y ortografía; una [extensión de corrección](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) es opcional.

## Cuándo confirmar

Crea un commit al completar un cambio significativo: una función que ya opera, una corrección de error o un ajuste de contenido coherente. No esperes a terminar todo el proyecto. Si algo deja de funcionar después, tener una versión comprobada facilita encontrar qué cambió. Tampoco crees commits arbitrarios sólo para aumentar el conteo; agrupa por intención.

Antes de confirmar, mira `git status` y `git diff --staged`. El mensaje debe describir exactamente lo preparado. Si hay dos propósitos diferentes, considera separarlos para que cada cambio se pueda revisar de forma independiente.

## Actividad

1. Lee [How to Write a Git Commit Message](https://cbea.ms/git-commit), especialmente sus siete reglas.
2. Revisa tus commits de `git_test`. Elige un mensaje vago y escribe en tus notas una versión más informativa; no necesitas reescribir el historial publicado para este ejercicio.
3. Realiza una mejora pequeña, compruébala y crea un commit con asunto y cuerpo cuando el motivo lo justifique.

## Comprobación

- Menciona dos beneficios de un historial bien explicado.
- ¿Qué longitud facilita leer un asunto y por qué?
- ¿Qué diferencia hay entre explicar el diff y explicar la razón del cambio?
## Profundiza con el ejemplo

## Revisa un historial como otra persona

Abre git log en un proyecto con varios commits. Pregunta si podrías localizar una corrección de enlaces sin abrir cada diff. Mensajes como guarda, cambios o listo obligan a revisar todo; asuntos concretos reducen esa búsqueda. Si encuentras el commit adecuado pero no comprendes por qué cambió una regla, un cuerpo que conserve la intención puede evitar volver a introducir el mismo problema.

La separación entre asunto y cuerpo también ayuda a herramientas que muestran sólo la primera línea en una lista. Esa primera línea debe sostenerse por sí sola. El cuerpo no necesita narrar cada tecla ni repetir nombres de archivos que el diff ya revela: explica el problema, la decisión y, cuando aporte valor, la comprobación realizada.

No hay un número mágico de minutos entre commits. Una señal útil es haber completado una unidad que puedes describir y probar. Si arreglaste un enlace roto, confirma esa corrección antes de comenzar una nueva sección. Si una tarea todavía está incompleta, puedes seguir trabajando, pero no describas su estado como terminado. En equipos, las convenciones sobre trabajo en curso pueden variar; sigue el acuerdo compartido.

Con la práctica, el historial se vuelve una herramienta para tu propio razonamiento. Cuando algo deje de funcionar, podrás comparar contra un punto conocido, en lugar de intentar recordar todas las modificaciones de los últimos días.

Revisa también la ortografía del mensaje antes de confirmar: el historial será una referencia para ti y para otras personas.
