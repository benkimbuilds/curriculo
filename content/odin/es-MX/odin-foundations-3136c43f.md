# Fundamentos de la línea de comandos

La interfaz de línea de comandos, o CLI, permite dar instrucciones escritas a la computadora. La **terminal** es la ventana; el **shell** interpreta lo que escribes. Es nuestro punto de partida para movernos entre carpetas, ejecutar programas y utilizar Git. Aprenderás la sintaxis mediante repetición, no memorizando todos los comandos posibles.

## Abre y reconoce tu terminal

En macOS abre Terminal con Spotlight; en Windows abre Ubuntu si elegiste WSL2. PowerShell es otro shell y tiene comandos distintos. En Linux también puedes buscar Terminal o usar Ctrl+Alt+T. El prompt suele terminar en `$` o `%`; en tutoriales ese símbolo indica que se espera un comando y **no debes escribirlo**.

Ejecuta `whoami`. La salida muestra tu usuario. Después ejecuta `pwd`: muestra el directorio de trabajo actual. Muchos comandos actúan sobre ese lugar, así que verifica la ubicación antes de modificar archivos. Cuando una herramienta solicita una contraseña, puede no mostrar caracteres ni asteriscos mientras escribes; no significa necesariamente que esté bloqueada.

```bash
pwd
ls
mkdir practica-terminal
cd practica-terminal
touch index.html style.css
mkdir images
ls
code .
```

`mkdir` crea un directorio; `cd` cambia el directorio; `touch` crea un archivo vacío si no existe. `.` significa el directorio actual y `..` el padre. `cd` sin argumento regresa al directorio personal; `~` representa ese mismo lugar. Una ruta absoluta empieza desde la raíz; una relativa empieza desde donde estás. Usa comillas para rutas con espacios.

`cp origen destino` copia; `mv origen destino` mueve o cambia el nombre. `rm archivo` elimina un archivo y `rmdir carpeta` elimina una carpeta vacía. No hay necesariamente una papelera para recuperar lo eliminado. No uses borrados recursivos sobre directorios que no hayas inspeccionado.

## Atajos útiles

En terminales Linux, copiar y pegar suele usar Ctrl+Shift+C y Ctrl+Shift+V; en macOS, Cmd+C y Cmd+V. Ctrl+C normalmente interrumpe un programa. Comprueba los atajos de Windows Terminal si usas WSL. Lee lo que pegaste antes de ejecutarlo.

La [compleción con Tab](https://en.wikipedia.org/wiki/Command-line_completion) reduce errores. Si escribes `cd D` y existen `Documents` y `Downloads`, el shell necesita más letras; tras escribir `Doc`, Tab puede completar `Documents`. Las flechas arriba y abajo recorren el historial. `code .` abre el proyecto completo: en macOS activa primero `Shell Command: Install 'code' command in PATH` desde la paleta de VS Code y reinicia Terminal; en WSL confirma que VS Code se conectó a Ubuntu.

## Actividad

1. Completa de [The Unix Shell](https://swcarpentry.github.io/shell-novice/) estas partes: [descarga de archivos](https://swcarpentry.github.io/shell-novice/#download-files), [introducción](https://swcarpentry.github.io/shell-novice/01-intro.html), [navegar archivos y directorios](https://swcarpentry.github.io/shell-novice/02-filedir.html) y [trabajar con archivos](https://swcarpentry.github.io/shell-novice/03-create.html). No necesitas instalar todo lo que mencione el curso.
2. En WSL descarga los datos en tu directorio Linux con `wget https://swcarpentry.github.io/shell-novice/data/shell-lesson-data.zip`; si falta `unzip`, consulta con el laboratorio antes de instalarlo con `sudo apt install unzip`. Extrae mediante `unzip shell-lesson-data.zip`. Cuando el tutorial use Desktop, puedes trabajar desde `cd ~`; si necesitas una carpeta Desktop, créala sólo si no existe.
3. Construye desde la terminal la estructura del ejemplo: `index.html`, `style.css` y `images`. Abre la carpeta con el editor y observa que ambos programas ven los mismos archivos.
4. En tu directorio personal crea una carpeta de práctica llamada `test`, entra y crea `test.txt`. Ábrelo en VS Code, escribe y guarda. Renómbralo con `mv test.txt prueba.txt`, inspecciona con `ls`, elimina solamente ese archivo con `rm prueba.txt`, sal con `cd ..` y elimina la carpeta vacía con `rmdir test`.

Si un comando falla, conserva el mensaje y revisa `pwd`, la ortografía y las mayúsculas. Las rutas de Ubuntu distinguen mayúsculas y minúsculas.

## Comprobación

- ¿Qué es la CLI y cómo la abres en tu computadora?
- ¿Qué hacen `cd`, `cd ..`, `pwd` y `ls`?
- ¿Cómo creas un archivo y un directorio? ¿Cómo los renombras o eliminas?
- ¿Por qué revisas la ubicación antes de borrar?
- ¿Qué representa el punto en `code .`?

Puedes repasar [navegación y comandos Unix](https://www.softcover.io/read/fc6c09de/unix_commands/basics) y [creación de archivos](https://swcarpentry.github.io/shell-novice/03-create.html#create-a-text-file).

## Reconoce qué programa recibe el teclado

Una ventana de terminal puede estar mostrando el prompt del shell o un programa ejecutado dentro de ella. Si un comando abre un visor, un editor o un REPL, los caracteres que escribes se interpretan según ese programa hasta que salgas. No asumas que cualquier pantalla de texto espera un comando nuevo de Bash. Busca el prompt y lee instrucciones de salida cuando corresponda.

En los ejemplos, el signo dólar representa el prompt, no parte del comando. En macOS puede aparecer porcentaje y en otra configuración puede verse tu usuario o ruta. Estas diferencias visuales no cambian lo que hace pwd. Escribe sólo la instrucción indicada y pulsa Enter. La salida siguiente es la respuesta del programa, no otra orden que debas copiar automáticamente.

## Practica rutas sin perder contexto

Empieza en el directorio personal y lista lo que existe. En macOS puede estar bajo Users y en Ubuntu bajo home. El atajo virgulilla representa ese lugar sin que tengas que escribir toda la ruta. Una carpeta llamada Desktop puede no existir en una distribución nueva; no significa que la terminal esté incompleta. Puedes trabajar desde tu directorio personal o crear una carpeta de práctica cuando la actividad la necesite.

Entra a una carpeta, muestra pwd y lista su contenido. Después entra a una subcarpeta y repite. Usa cd con dos puntos para subir exactamente un nivel. Si ejecutas cd sin argumentos, vuelves al directorio personal, que no necesariamente es el padre del lugar actual. Comprueba la diferencia con una estructura de varios niveles.

Una ruta relativa cambia de significado cuando cambia tu ubicación. Si intentas abrir notes.txt desde otro directorio, el shell no busca por todo el disco para encontrar el archivo que tenías en mente. Especifica una ruta desde el lugar actual o una absoluta. Esa misma idea aparece después en enlaces HTML y cargas de recursos.

## Usa autocompletado de forma deliberada

Escribe las primeras letras de una carpeta y pulsa Tab. Si existe una única coincidencia, el shell puede completar el nombre. Si hay varias, puede mostrar opciones o necesitar más letras según la configuración. No interpretes la ausencia de una finalización inmediata como un error: quizá aún no hay suficiente información.

El ejemplo de Documents y Downloads muestra por qué escribir sólo D es ambiguo. Añadir Doc reduce las opciones. Esta práctica ayuda con rutas largas y evita errores de mayúsculas o espacios. Aun así, revisa la ruta completada antes de ejecutar una operación que modifique archivos. Autocompletar ahorra escritura, no decide tu intención.

## Abre el proyecto desde la terminal

El punto en code seguido de punto significa abrir el directorio actual completo. Si estás en una carpeta equivocada, el editor abrirá esa carpeta, no la que imaginabas. Primero comprueba pwd. En macOS, si code no existe, habilita el comando desde la paleta de VS Code y abre una terminal nueva para cargar el PATH actualizado.

En WSL confirma que la ventana del editor esté conectada a Ubuntu. Si ves archivos diferentes de los que lista la terminal, revisa esa conexión y la ubicación antes de crear copias adicionales. Tener dos carpetas con nombres iguales en Windows y Linux puede hacer parecer que los cambios se pierden cuando en realidad estás alternando versiones.

## Elimina sólo la práctica que identificaste

El ejercicio de borrar sirve para aprender alcance. Lista primero los archivos de test, abre el que creaste y confirma que no contiene trabajo que quieras conservar. Elimina ese archivo y después la carpeta vacía. rmdir falla cuando aún hay contenido: esa negativa puede ser una protección útil, no una invitación automática a usar una opción recursiva.

Mantén estos hábitos en proyectos reales. Antes de mover, copiar o eliminar, identifica origen, destino y si ya existe algo allí. Una orden corta puede tener un efecto grande; comprenderla es más importante que ejecutarla rápido.
