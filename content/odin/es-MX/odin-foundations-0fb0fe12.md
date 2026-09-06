# Estructura básica de un documento HTML

Crea una carpeta `html-boilerplate` y un archivo `index.html`. La extensión indica el tipo de documento; confirma que no se llame `index.html.txt`. `index.html` es el nombre convencional que muchos servidores usan como página inicial de un directorio.

## Construye la estructura

La declaración `<!DOCTYPE html>` indica al navegador que use el modo estándar moderno. Los documentos antiguos usaban declaraciones más largas, por ejemplo HTML 4 Transitional; no necesitas copiarlas. Después viene `html`, el elemento raíz del documento. Todos los demás elementos pertenecen a su árbol.

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi primera página</title>
  </head>
  <body>
    <h1>¡Hola, mundo!</h1>
  </body>
</html>
```

`lang="es"` declara el idioma principal y ayuda, entre otras cosas, a elegir pronunciación en lectores de pantalla. `head` contiene información sobre el documento, no el contenido principal visible. `meta charset="UTF-8"` establece una codificación capaz de representar acentos y muchos otros caracteres. `title` nombra la pestaña del navegador; no sustituye el encabezado que la persona ve dentro de la página.

`body` contiene texto, imágenes, listas y enlaces visibles. Si está vacío, la página puede verse en blanco aunque tenga un título de pestaña correcto. `meta viewport` ayuda a que el navegador móvil use el ancho del dispositivo; estudiarás diseño adaptable después y por ahora puedes conservarla.

## Guarda, abre y actualiza

Abre el archivo con Ctrl+O en Chrome o Cmd+O en macOS, arrástralo al navegador o haz doble clic desde el explorador de archivos. En macOS también puedes ejecutar `open ./index.html`. En WSL, desde el directorio del archivo, `explorer.exe index.html` puede abrirlo con la asociación de Windows; usa sólo el nombre del archivo. En Linux con Chrome instalado, `google-chrome index.html` es otra opción.

Comprueba que aparece «¡Hola, mundo!» y que la pestaña dice «Mi primera página». Cambia ambas frases por separado para observar qué controla cada elemento. Guarda antes de actualizar el navegador: un cambio no guardado en el editor todavía no está en el archivo que Chrome lee.

VS Code puede generar la estructura al escribir `!` y aceptar la sugerencia en un archivo reconocido como HTML. Úsalo después de escribirla manualmente y explicar cada parte. La abreviatura ahorra escritura, pero no sustituye saber detectar una estructura incorrecta.

## Actividad

1. Sigue el video [Construye tu primera página, de Kevin Powell](https://www.youtube.com/watch?v=V8UAEoOvqFg&t=93s).
2. Pega tu documento en el [validador HTML del W3C](https://validator.w3.org/#validate_by_input). Corrige cada error empezando por el primero; un cierre perdido puede provocar varios avisos posteriores.
3. Introduce temporalmente un error, como un cierre mal escrito, observa qué señala el validador y corrígelo. Que un navegador muestre algo no demuestra que el marcado sea válido: los navegadores intentan recuperarse de errores.

## Comprobación

- ¿Para qué sirve doctype?
- ¿Qué papel tiene `html` y qué expresa `lang`?
- ¿Qué pertenece a `head` y qué a `body`?
- ¿Cómo distingues el título de pestaña del encabezado visible?
## Profundiza con el ejemplo

## Recorrido paso a paso del archivo

Construye una vez el documento sin usar la abreviatura del editor. Escribe doctype en la primera línea y después apertura y cierre de html. Deja espacio entre ambas para que resulte claro que lo siguiente pertenece al elemento raíz. Añade head como primer hijo y body como segundo. Indenta ambos al mismo nivel: son hermanos y ninguno debe quedar accidentalmente dentro del otro.

Dentro de head escribe meta charset y title. El elemento meta es vacío, por lo que no necesita un cierre. title sí contiene texto y debe cerrarse. Si escribes una frase en head fuera de un elemento adecuado, el navegador puede moverla al cuerpo al reparar el documento; no uses ese comportamiento como forma de construir una página.

Abre ahora el archivo con body vacío. La pestaña debe tener un nombre útil, pero el área del documento puede estar en blanco. Esto es una comprobación esperada, no un fallo de instalación. Añade el h1 dentro de body, guarda y actualiza. Si el nombre de pestaña cambia pero el encabezado no, revisa que editaste las partes correspondientes y que no abriste otra copia del mismo archivo.

## Dos ubicaciones que conviene reconocer

El título de pestaña permite identificar la página entre varias abiertas, guardarla en marcadores y reconocerla en otras superficies del navegador. Un nombre genérico como Documento aporta poca información cuando tienes muchas pestañas. El encabezado visible comunica el asunto del contenido una vez dentro de la página. A menudo se relacionan, pero no tienen que ser idénticos carácter por carácter.

La codificación UTF-8 importa especialmente cuando escribes español. Prueba una frase con á, ñ y signos de apertura. Si aparecen símbolos extraños, comprueba que el archivo también esté guardado como UTF-8 en el editor y que la declaración sea correcta. Cambiar sólo lo que muestra el navegador no arregla un archivo guardado con una codificación incompatible.

## Comprueba la ruta que abriste

Si utilizas Windows con WSL, recuerda que hay dos sistemas de archivos visibles. Abre el archivo del proyecto que estás editando, no una copia anterior en Descargas de Windows. En macOS también puedes tener duplicados con el mismo nombre en distintas carpetas. La dirección del navegador y el explorador de VS Code te ayudan a verificarlo.

Después de probar la abreviatura de VS Code, compara la estructura generada con tu versión manual. Identifica cada línea conocida y deja anotada la pregunta sobre viewport para la unidad de diseño adaptable. El propósito de una plantilla es evitar errores repetitivos sin ocultarte qué estás entregando al navegador.

Conserva la versión validada como referencia para futuros documentos, pero cambia siempre idioma, título y contenido para que correspondan a la página nueva.
