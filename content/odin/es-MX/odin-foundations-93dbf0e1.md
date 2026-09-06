# Prepara tu entorno de desarrollo

Un editor dentro del navegador permite empezar rápido, pero no enseña por sí solo a organizar archivos, instalar herramientas y ejecutar un proyecto real. Preparar tu computadora puede ser frustrante al principio; también es una habilidad que utilizarás durante toda tu carrera.

## Adaptación para Windows y macOS

Odin usa instrucciones Unix y brinda soporte para macOS, Ubuntu y sus [variantes oficiales](https://ubuntu.com/desktop/flavours). Ruta admite Windows y macOS. Para seguir los ejercicios Unix en Windows recomendamos un entorno Ubuntu en **WSL2**, preparado con apoyo del laboratorio. Puedes mantener Windows, tus programas y tus archivos personales. WSL2 no es WSL1: comprueba qué versión estás usando.

En Windows, sigue la [guía oficial de instalación de WSL](https://learn.microsoft.com/en-us/windows/wsl/install). Desde PowerShell con permisos administrativos, el paso habitual es `wsl --install`; reinicia si se solicita, abre Ubuntu y crea su usuario. Verifica en PowerShell con `wsl --list --verbose` que la distribución use versión 2. En un equipo compartido, el personal del laboratorio debe autorizar y preparar la instalación. No cambies particiones ni controles del equipo por tu cuenta.

Desde entonces, ejecuta los comandos Bash de las lecciones **en Ubuntu**, no en PowerShell. Guarda repositorios bajo tu directorio Linux, por ejemplo `~/projects`, e instala Git y Node dentro de esa distribución. VS Code se instala en Windows y se conecta mediante su extensión WSL. El navegador sigue ejecutándose en Windows. Esta separación evita mezclar ejecutables o dependencias de ambos sistemas. Para ejercicios iniciales de HTML también puedes usar VS Code y navegador nativos; los comandos PowerShell no son intercambiables con Bash.

En macOS abre Terminal desde Aplicaciones > Utilidades o Spotlight. No necesitas instalar Linux. Mantén el sistema actualizado y utiliza una carpeta de proyectos dentro de tu usuario. Instalarás Git, el editor y Node en sus lecciones específicas.

## Otras opciones del original

Una **máquina virtual** emula una computadora dentro de otra; permite probar Linux sin reemplazar Windows, pero consume memoria y almacenamiento. Odin explica la [instalación en VirtualBox](https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/linux/virtual_machine.md) y este [video describe las máquinas virtuales](https://youtu.be/yIVXjl4SwVo).

El **arranque dual** instala sistemas separados y permite elegir uno al encender. Puede usar todos los recursos del equipo, pero modificar particiones implica riesgo para los datos. La [guía de arranque dual](https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/linux/dual_boot.md) se conserva como alternativa; no es requisito de Ruta ni una actividad para realizar sin respaldo y supervisión. También existen [Linux en ChromeOS](https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/linux/chromeos.md) y la [guía WSL2 de Odin](https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/linux/wsl2.md).

El soporte de la comunidad original es distinto del de Ruta. Sus [razones para no soportar Windows nativo](https://github.com/TheOdinProject/blog/wiki/Why-We-Do-Not-Support-Windows) explican esa decisión; no asumas que podrán resolver cualquier configuración del laboratorio.

## Navegador y verificación

Usaremos Chrome para que nombres y paneles de las herramientas de desarrollo coincidan. Instálalo desde su sitio oficial; conserva las guías de [macOS](https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/chrome/macos.md), [Linux](https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/chrome/linux.md) y [Windows con WSL2](https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/chrome/wsl2.md). En WSL2 no necesitas instalar un segundo Chrome Linux.

1. Completa una sola ruta de instalación adecuada a tu equipo.
2. Abre el navegador y consulta sus [atajos](https://support.google.com/chrome/answer/157179?hl=en&co=GENIE.Platform%3DDesktop#zippy=%2Ctab-window-shortcuts).
3. Abre tu terminal y ejecuta `pwd`. Anota si estás en Ubuntu o macOS y dónde guardarás proyectos. Cierra y vuelve a abrir para comprobar que puedes regresar.

Como contexto adicional, consulta la [participación de distintos navegadores](https://en.wikipedia.org/wiki/Usage_share_of_web_browsers#Summary_tables); no determina qué navegador deben usar tus futuros usuarios.

## Comprobación

- ¿Qué sistemas admite el currículo original y cómo adapta Ruta Windows?
- ¿Qué diferencia hay entre WSL2, una máquina virtual y arranque dual?
- ¿En qué sistema ejecutas cada herramienta de tu configuración?
- ¿Qué navegador usamos para los ejercicios y por qué?

## Comprende tu configuración antes de instalar

El motivo de usar un entorno de desarrollo real es aprender a controlar dónde viven tus archivos y dónde se ejecuta cada herramienta. Un editor en línea puede preparar todo por ti, pero después necesitarás reproducir ese trabajo en otra computadora. La instalación no es una prueba de memoria: sigue una guía apropiada, lee los mensajes y conserva una nota de qué elegiste.

Una máquina virtual tiene un sistema invitado separado del sistema anfitrión. Si instalas Ubuntu dentro de VirtualBox, el editor, Git y Node que ejecutas dentro de Ubuntu no son automáticamente los mismos que instalaste en Windows. Esa separación visual puede ser útil para algunas personas. También exige asignar memoria y almacenamiento suficientes y puede rendir peor en equipos limitados.

WSL2 integra Linux con Windows de forma más estrecha. Esa comodidad puede producir confusión si no sabes qué terminal abriste o qué versión de una herramienta se está ejecutando. Por eso Ruta recomienda acompañamiento del laboratorio al configurarlo. La recomendación adapta el entorno a las computadoras disponibles; no implica que las advertencias del currículo original sobre mezclar sistemas dejen de importar.

Si ya trabajas en Ubuntu o una variante oficial y tienes las herramientas requeridas, no necesitas instalar otro sistema. Si trabajas en macOS, tampoco necesitas crear una máquina virtual para seguir los comandos Unix. Elegir una configuración estable y conocerla es más útil que probar todas las alternativas antes de comenzar.

## Verifica Windows con WSL2

Después de instalar, abre Ubuntu desde el menú de Windows. El primer inicio puede pedir crear un usuario Linux y una contraseña. Esa cuenta pertenece a la distribución y puede ser distinta de tu cuenta de Windows. Cuando escribes una contraseña en terminal, es posible que no aparezcan caracteres; sigue las instrucciones de la herramienta y no publiques esa contraseña en capturas.

Ejecuta pwd dentro de Ubuntu y reconoce una ruta bajo home. Crea una carpeta de proyectos allí. Si ves una ruta bajo mnt/c, estás accediendo a archivos de Windows desde Linux; eso puede ser válido para copiar un recurso, pero no es la ubicación recomendada de trabajo para los proyectos con dependencias Linux. Mantener las herramientas y archivos en un mismo entorno evita incompatibilidades de permisos, rutas y rendimiento.

Desde PowerShell, el comando de listado de WSL permite comprobar que la distribución usa versión dos. No escribas ese comando de administración como si fuera una operación Bash dentro de la distribución sin revisar qué entorno lo recibe. Si la instalación falla por políticas del equipo o virtualización deshabilitada, comparte el mensaje con el personal del laboratorio. No intentes sortear controles ni modificar firmware de un equipo que no administras.

## Navegador, editor y documentación

Chrome se ejecuta en Windows cuando usas WSL2. VS Code también puede instalarse en Windows y conectarse al entorno Linux para abrir archivos y ejecutar herramientas allí. La conexión del editor debe mostrarse claramente. En una máquina virtual convencional, en cambio, puedes instalar ambos dentro del sistema invitado. Comprender esta diferencia te permite elegir la guía correcta.

Los recursos originales limitan soporte a configuraciones concretas para que su comunidad pueda reproducir problemas. Si preguntas allí por una instalación adaptada de Ruta, explica la configuración real y respeta sus límites. El laboratorio puede ofrecer ayuda para Windows nativo que la comunidad original no promete.

Al finalizar esta lección debes poder abrir navegador y terminal, identificar el sistema donde estás trabajando y localizar tu carpeta de proyectos. No es necesario instalar todavía todas las herramientas de las próximas semanas. Cada instalación adicional tendrá una razón y una comprobación propia.
