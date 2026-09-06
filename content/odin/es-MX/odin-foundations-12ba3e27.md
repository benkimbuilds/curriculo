# Introducción a Git

Git es un sistema de control de versiones. Guardar en un editor actualiza un archivo; crear un commit registra un estado del proyecto en un historial. Sin control de versiones podrías acumular `ensayo-borrador1`, `ensayo-final` y `ensayo-final-ahora-si`, sin saber bien qué cambió. Git conserva referencias a versiones anteriores y permite investigar cómo evolucionaron archivos y directorios.

## Local y remoto

Git funciona en tu computadora. Puedes consultar el historial y crear commits sin internet. GitHub es un servicio remoto donde publicas repositorios, colaboras y muestras proyectos. También existen GitLab, Bitbucket y otros servicios, pero los ejercicios de este currículo usan GitHub. Un commit local no se publica automáticamente: `push` envía commits al remoto.

Para una persona que trabaja sola, el historial permite comparar una versión que funcionaba con otra que falla, recuperar una idea anterior y recordar el motivo de una decisión. En un equipo, facilita integrar cambios, saber quién modificó algo y discutir propuestas antes de incorporarlas. El historial y los proyectos también pueden servir como evidencia de trabajo para un portafolio.

Los sistemas de versiones pueden ser locales, centralizados o distribuidos. En uno centralizado, un servidor concentra el historial y los clientes dependen más de él. Git es distribuido: un clon normal contiene el historial del repositorio, no sólo la copia actual de los archivos. Eso permite trabajar localmente y compartir cambios después. No elimina la necesidad de coordinarse ni convierte en seguros los secretos que publiques por error.

## Actividad

1. Lee los capítulos 1.1 a 1.4 de [Pro Git: primeros pasos](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control). Distingue los tres modelos de control de versiones.
2. Mira [What is Git? en dos minutos](https://www.youtube.com/watch?v=2ReR1YJrNOM).
3. Lee [Acerca de GitHub y Git](https://docs.github.com/en/get-started/start-your-journey/about-github-and-git); puedes omitir la sección final sobre dónde empezar.
4. Si falta instalarlo, vuelve a [Configurar Git](https://www.theodinproject.com/lessons/foundations-setting-up-git).
5. Explora el [repositorio del currículo de Odin](https://github.com/TheOdinProject/curriculum) y sus [contribuciones](https://github.com/TheOdinProject/curriculum/graphs/contributors). Abre el historial de una lección: identifica autor, fecha y cambio sin modificar el repositorio.

## Comprobación

- ¿Qué tipo de programa es Git?
- ¿Qué guarda un editor y qué registra un commit?
- ¿Git y GitHub trabajan a nivel local o remoto?
- ¿Cómo ayuda el historial a una persona y a un equipo?
## Profundiza con el ejemplo

No confundas un historial con una copia automática de cada pulsación del teclado. Git conserva los estados que confirmas deliberadamente. Si nunca guardaste ni confirmaste una modificación, no puedes asumir que Git la recuperará; por eso revisar y crear commits forma parte del trabajo habitual.
