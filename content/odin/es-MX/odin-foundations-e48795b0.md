# Flujo básico de Git

El ciclo que repetirás es modificar, revisar, preparar, confirmar y publicar. Hay tres lugares distintos: los archivos de trabajo, el área de preparación (**staging**) y los commits. `git add` prepara la versión actual de un archivo; `git commit` registra lo preparado. Si editas de nuevo después de `add`, esa segunda edición todavía no está preparada.

## Crea y clona un repositorio

1. Comprueba `git --version`; necesitas una versión que admita configurar la rama inicial, al menos 2.28. Ejecuta `git config --global init.defaultBranch main` si no lo hiciste. [GitHub explica el cambio de nombre de la rama predeterminada](https://github.com/github/renaming).
2. En GitHub elige **New repository**, nómbralo `git_test`, activa **Add README** y créalo. La cuenta y SSH se prepararon en [Configurar Git](https://www.theodinproject.com/lessons/foundations-setting-up-git).
3. En **Code > SSH** copia la dirección. En tu directorio personal crea `repos` si no existe y entra. Su [ubicación varía por sistema](https://swcarpentry.github.io/shell-novice/02-filedir.html#home-directory-variation).

```bash
cd ~
mkdir repos
cd repos
git clone git@github.com:TU-USUARIO/git_test.git
cd git_test
git remote -v
```

Sustituye `TU-USUARIO`. Si `repos` ya existe, no necesitas crearlo otra vez. `clone` descarga el repositorio y configura normalmente un remoto llamado `origin`. Es un nombre convencional, no una palabra especial para GitHub. En `git push origin main`, `origin` es el destino remoto y `main` la rama.

## Primer commit

```bash
touch hello_world.txt
git status
git add hello_world.txt
git status
git commit -m "Agrega archivo de práctica"
git status
git log
```

Al principio el archivo es **untracked**: Git aún no lo sigue. Después de `add` aparece en **Changes to be committed**. Tras el commit, el árbol puede quedar limpio aunque la rama esté adelantada respecto a `origin/main`; limpio significa que no hay cambios locales pendientes, no que todo esté publicado. En `git log` observa identificador, autor, fecha y mensaje. Si aparece un visor con `(END)`, sal con `q`.

## Modifica dos archivos

Abre `code .`. Si macOS no reconoce `code`, revisa la [configuración del comando del editor](https://www.theodinproject.com/lessons/foundations-command-line-basics#opening-files-in-vscode-from-the-command-line). Añade `Hello Odin!` al README y guarda. `git status` debe mostrar un archivo seguido pero modificado, no un archivo nuevo. Prepara sólo el README con `git add README.md`.

Escribe una frase en `hello_world.txt`, guarda y observa el estado de nuevo. Ahora hay un cambio preparado y otro sin preparar. Añade el segundo archivo y crea un commit que describa ambos cambios relacionados. `git add .` prepara todos los cambios bajo el directorio actual: úsalo sólo después de revisar qué contiene. `git diff` muestra cambios sin preparar; `git diff --staged` muestra los preparados.

El historial debería contener el commit inicial del README y tus dos commits. Haz cambios pequeños con un propósito. Un commit atómico reúne una tarea coherente; permite entender y revertir esa tarea sin mezclar trabajo ajeno.

## Publica y verifica

Ejecuta `git push origin main`. Después revisa `git status` y actualiza la página del repositorio: deben aparecer ambos archivos y los mensajes de los commits. Si aparece una petición de contraseña de GitHub o un aviso de que la autenticación por contraseña fue retirada, comprueba si clonaste con HTTPS. Para este ejercicio sigue la [guía para cambiar el remoto a SSH](https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories?platform=linux#switching-remote-urls-from-https-to-ssh).

Evita editar los mismos archivos directamente en GitHub durante esta práctica. Eso crea cambios remotos que todavía no están en tu copia; más adelante aprenderás a sincronizarlos e integrarlos.

Configura `git config --global core.editor "code --wait"` para que `git commit` sin `-m` abra VS Code en lugar de [Vim](https://en.wikipedia.org/wiki/Vim_(text_editor)). Escribe el mensaje, guarda y cierra la pestaña para completar el commit. `--wait` hace que Git espere ese cierre.

## Comprobación

- ¿Cómo creas un repositorio y cómo lo clonas?
- ¿Qué representan `origin` y `main`?
- ¿Cuál es la diferencia entre archivo sin seguimiento, modificado y preparado?
- ¿Qué guardaría un commit si editas después de `git add`?
- ¿Qué comandos muestran estado e historial, preparan cambios, crean commits y los publican?

## Lee el estado en cada transición

En el primer recorrido, untracked significa que Git ve un archivo nuevo pero todavía no lo incluyó en el historial ni en staging. Ese archivo existe en disco y puedes abrirlo normalmente. Git no empieza a seguir todo lo que colocas en una carpeta por el simple hecho de estar dentro de un repositorio. Elegir qué entra es una responsabilidad de quien trabaja.

Después de git add, el archivo aparece entre los cambios listos para confirmar. En muchas terminales cambia de rojo a verde, pero no dependas del color: lee los encabezados. Ahora Git tiene preparada la versión que existía en ese momento. Si abres el archivo, escribes otra línea y guardas, status puede mostrar el mismo archivo en dos secciones: una versión preparada y una modificación adicional sin preparar. Eso no es una duplicación accidental del archivo, sino dos estados distintos.

Haz ese experimento deliberadamente antes de continuar. Prepara una frase, añade otra y compara git diff con git diff --staged. El primero muestra la diferencia entre trabajo y preparación; el segundo, entre preparación y el commit actual. Si quieres que ambas frases entren, ejecuta add de nuevo. Si quieres confirmar sólo la primera, deja la segunda pendiente. Esta capacidad permite crear commits enfocados incluso cuando trabajaste en varios detalles al mismo tiempo.

Una vez creado el commit, git status puede indicar que tu rama está adelantada por uno o varios commits. Eso compara el historial local con la referencia remota conocida. No significa que el archivo esté sin guardar ni que el commit haya fallado. La publicación ocurre al hacer push. Después revisa el remoto real en GitHub, porque una afirmación local sobre la última referencia conocida no reemplaza comprobar que la operación de red terminó correctamente.

## Identifica el repositorio correcto

Ejecuta los comandos desde git_test o una subcarpeta suya, no desde una carpeta vecina que no pertenece al repositorio. Si Git dice que no es un repositorio, revisa primero pwd y el lugar donde clonaste. No soluciones ese mensaje creando repositorios nuevos indiscriminadamente: podrías terminar con repositorios anidados que dificulten entender qué historial contiene cada archivo.

Un clon crea una carpeta con el nombre del repositorio, salvo que le indiques otro destino. Si estabas en repos y ejecutaste clone, necesitas entrar en git_test antes de trabajar. El comando remote -v muestra las URL de fetch y push. Normalmente ambas apuntan al mismo repositorio y usan el nombre origin. Ese nombre podría ser otro, pero en esta práctica seguimos la convención para reducir confusión.

La dirección SSH comienza con git@github.com y contiene tu usuario y el nombre del repositorio. No uses literalmente USER-NAME o REPOSITORY-NAME. Esos textos representan valores que debes sustituir. Una URL que comienza con HTTPS utiliza otro método de autenticación; ambos pueden funcionar con configuración apropiada, pero el ejercicio preparó SSH y sus llaves. Si aparece un error de autenticación, revisa primero que el remoto use el método que configuraste.

## Guardar y confirmar desde el editor

VS Code puede tener guardado automático activado o no. Comprueba que el archivo realmente se guardó antes de esperar que Git detecte los cambios. Si el editor muestra un indicador de modificación pendiente, el contenido que ves puede no estar todavía en disco. Usar la terminal integrada no cambia esta regla: sigue siendo una terminal trabajando sobre archivos guardados.

La configuración core.editor con code --wait hace que Git espere a que cierres la pestaña del mensaje. Si sólo guardas pero dejas la pestaña abierta, la terminal puede seguir esperando; no necesariamente está bloqueada. Escribe un asunto significativo, guarda y cierra la pestaña del mensaje. Si no querías crear el commit, no improvises una interrupción sin entender el estado; consulta el editor y después vuelve a status.

El visor de git log también puede parecer una pantalla que no responde a los comandos habituales. Cuando el contenido se abre en un paginador, la letra q sale al prompt. Mientras estás dentro, no estás escribiendo nuevos comandos del shell. Reconocer qué programa está recibiendo el teclado evita pensar que la terminal dejó de funcionar.

## Revisa lo publicado y conserva un proceso simple

Después de push, actualiza la página del repositorio y abre README y hello_world.txt. Comprueba el texto, no sólo los nombres de archivo. Abre el historial y localiza los mismos mensajes que viste localmente. Así conectas la operación del terminal con un resultado remoto visible.

Durante esta etapa realiza las ediciones localmente. El editor web de GitHub es cómodo para una corrección, pero crea un commit remoto que tu copia local todavía no tiene. La siguiente publicación podría exigir integrar historias. Ese flujo es normal y se estudiará después; por ahora mantener una sola ubicación de edición te permite aprender claramente cada transición.

Al terminar, explica el recorrido completo sin recitar una lista de comandos: creaste un remoto, lo clonaste, editaste archivos, seleccionaste versiones, registraste dos cambios y los enviaste. Si puedes señalar evidencia de cada etapa, ya tienes una base para repetir el mismo flujo en los siguientes proyectos.

Como comprobación final, pide a otra persona que siga el README desde una copia nueva. Si necesita un archivo que sólo existe en tu equipo, identifica por qué no quedó incluido antes de considerar completa la publicación.
