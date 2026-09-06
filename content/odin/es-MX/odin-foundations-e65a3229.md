# Editores de texto

El editor será una de tus herramientas más utilizadas. Un editor de código guarda texto simple y facilita escribirlo mediante colores de sintaxis, indentación, cierre de delimitadores, búsqueda y avisos de errores. Estas ayudas no garantizan que el programa sea correcto, pero permiten detectar detalles como un paréntesis que falta.

## Por qué no usamos Word

Word y LibreOffice Writer guardan información de presentación además del texto: estilos, imágenes y estructura del documento. Un archivo de código debe contener exactamente los caracteres que interpreta el navegador o el runtime. Cambiarle la extensión a un documento de Word no lo convierte en código válido. Utiliza texto simple y conserva extensiones como `.html`, `.css` o `.js`.

## Visual Studio Code

Usaremos [VS Code](https://code.visualstudio.com/docs), un editor gratuito con integración de Git y extensiones. Su comportamiento es parecido en Windows y macOS, aunque cambian algunos atajos. No es lo mismo que Visual Studio. Otros editores pueden servir, pero las instrucciones del curso asumirán VS Code para facilitar la ayuda.

En Windows instala VS Code en Windows. Si usas Ubuntu mediante WSL2, instala la extensión WSL y abre el proyecto desde la terminal Ubuntu con `code .`; confirma que la esquina del editor indique WSL. Así los archivos y herramientas se ejecutan en el entorno correcto. Consulta la [guía WSL2 de Odin](https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/text_editors/wsl2.md).

En macOS sigue la [guía del editor](https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/text_editors/macos.md). Si usas una máquina virtual Linux, instala el editor dentro de ella siguiendo la [guía Linux](https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/text_editors/linux.md), no solamente en el sistema anfitrión.

## Actividad

1. Instala y abre VS Code con la ruta apropiada. Usa Abrir carpeta, crea `practica-editor` y dentro un archivo `notas.txt`. Escribe una frase, guarda, cierra el editor y vuelve a abrir el archivo. Comprueba que el cambio existe en disco.
2. Mira el [recorrido de VS Code para principiantes](https://youtu.be/ORrELERGIHs?t=103). Observa el explorador de archivos, pestañas, terminal integrada y búsqueda. No necesitas reproducir el código del video.
3. En Configuración busca **Disable AI Features** y activa esa opción si está disponible. Deshabilita Copilot o cualquier extensión de generación de código durante Fundamentos. La lección [Motivación y mentalidad](https://www.theodinproject.com/lessons/foundations-motivation-and-mindset#a-note-on-ai-code-generation) explica por qué necesitas practicar la resolución por ti mismo antes de trabajar con IA.
4. Crea `index.html` y observa que el editor reconoce el lenguaje por la extensión. Abre la paleta de comandos —Ctrl+Shift+P en Windows, Cmd+Shift+P en macOS— y busca una función por su nombre. No instales muchas extensiones antes de necesitar una.

## Comprobación

- ¿Qué guarda un editor de código que lo distingue de un procesador de textos?
- ¿Qué editor asumimos en este curso?
- ¿Cómo sabes si un archivo está guardado y qué carpeta está abierta?
- En WSL o una máquina virtual, ¿dónde deben vivir los archivos y ejecutarse las herramientas?
