# Enlaces e imágenes

Los enlaces conectan documentos y otros recursos: esa conexión es lo que da sentido a la palabra web. Crea `odin-links-and-images/index.html` con la estructura básica y un `h1` que diga «Inicio». Usaremos ese proyecto durante la lección.

## El elemento a y sus atributos

```html
<a>Acerca de The Odin Project</a>
<a href="https://www.theodinproject.com/about">Acerca de The Odin Project</a>
```

El primero no tiene destino. En el segundo, `href` indica a dónde navegar. Un **atributo** aporta información adicional y se coloca dentro de la etiqueta de apertura; suele consistir en nombre y valor, aunque también existen atributos booleanos. Los enlaces pueden apuntar a páginas, imágenes, videos o PDF.

Por defecto un enlace abre en la misma pestaña (`target="_self"`). `target="_blank"` solicita otro contexto, normalmente otra pestaña. `rel="noopener"` impide que la página nueva controle la original mediante `window.opener`; los navegadores modernos ya aplican esa protección a `_blank`, pero verás el atributo explícito por compatibilidad. `noreferrer` además evita enviar información del origen de la navegación.

```html
<a href="https://www.theodinproject.com/about"
   target="_blank" rel="noreferrer">Conoce a Odin (otra pestaña)</a>
```

Lee sobre [tabnabbing](https://owasp.org/www-community/attacks/Reverse_Tabnabbing) y [privacidad de la cabecera Referer](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Referer_header:_privacy_and_security_concerns#the_referrer_problem). Abrir una pestaña nueva debe ser una decisión de experiencia, no una costumbre automática.

## Rutas absolutas y relativas

Una URL absoluta incluye esquema y dominio, como `https://www.theodinproject.com/about`. Consulta la [anatomía de una URL](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL#basics_anatomy_of_a_url). Una ruta relativa se interpreta desde la ubicación del documento actual.

1. Crea `about.html` junto a `index.html`, con estructura completa y un encabezado «Acerca de».
2. En el inicio añade `<a href="about.html">Acerca de</a>` y pruébalo.
3. Crea `pages` y mueve allí `about.html`. El enlace anterior ya no encuentra el archivo.
4. Corrige el destino a `./pages/about.html`. `./` señala explícitamente el directorio actual; `pages/about.html` es también una ruta relativa válida.

Imagina el dominio como una ciudad y las carpetas como pasillos de un museo: una ruta absoluta da la dirección completa; una relativa indica cómo llegar desde la habitación actual. `../` sale un nivel al directorio padre. Desde `pages/about.html`, el regreso al inicio es `../index.html`.

## Imágenes

`img` es un elemento vacío. `src` indica el archivo y admite ubicaciones absolutas o relativas. Mira el [ejemplo con URL absoluta](https://codepen.io/TheOdinProjectExamples/pen/gORbExZ).

Crea una carpeta `images`, descarga la [imagen de práctica del perro](https://unsplash.com/photos/Mv9hjnEUHR4/download?force=true&w=640) y guárdala como `dog.jpg`. En macOS usa Finder para moverla al proyecto. En Windows con WSL arrastra el archivo desde Descargas al explorador de VS Code conectado a Ubuntu; así mantienes el proyecto en Linux. También puedes copiarlo con `cp "/mnt/c/Users/TU-USUARIO/Downloads/dog.jpg" ./images/`, sustituyendo la ruta real. Algunos archivos descargados incluyen metadatos `Zone.Identifier`; no son parte de la imagen ni deben publicarse como contenido del proyecto.

```html
<img src="./images/dog.jpg" alt="Perro pug con un suéter">
```

En `pages/about.html` la misma imagen se encuentra mediante `../images/dog.jpg`: primero subes desde `pages`, después entras a `images`. Revisa siempre desde qué archivo se interpreta la ruta.

`alt` ofrece una alternativa textual cuando la imagen no carga o no se ve. Describe la información relevante para su contexto; una imagen puramente decorativa puede usar `alt=""`. Revisa el [ejemplo de texto alternativo](https://codepen.io/TheOdinProjectExamples/pen/ExXjoEp). Añade `width` y `height` con las dimensiones reales para que el navegador reserve proporción y reduzca saltos durante la carga; CSS puede modificar el tamaño visible después. Consulta el [ejemplo de dimensiones](https://codepen.io/TheOdinProjectExamples/pen/PogmYGp).

No toda imagen que encuentras se puede reutilizar. Revisa la licencia y acredita a su autor según lo requerido, por ejemplo en el README; esta [guía de atribución](https://support.freepik.com/s/article/Attribution-How-when-and-where?language=en_US) explica un caso. Buscar por licencias ayuda, pero siempre confirma la licencia en la fuente.

## Actividad

1. Mira [enlaces HTML](https://www.youtube.com/watch?v=tsEQgGjSmkM), [imágenes HTML](https://www.youtube.com/watch?v=0xoztJCHpbQ) y [estructura de archivos](https://www.youtube.com/watch?v=ta3Oxx7Yqbo), de Kevin Powell.
2. Lee y reproduce [Links and Images](https://internetingishard.netlify.app/html-and-css/links-and-images). Estudia sus formatos JPEG, GIF, PNG y SVG: fotografías, animación simple, transparencia y gráficos vectoriales tienen necesidades distintas. Conserva atributos de dimensiones aunque también uses CSS.
3. Comprueba navegación de ida y vuelta, carga de la imagen en ambas páginas y alternativa textual al romper temporalmente `src`. Corrige el error al terminar.

## Comprobación

- ¿Qué elemento y atributo crean un enlace con destino?
- ¿Qué diferencia hay entre `href`, `target` y `rel`?
- ¿Cómo distingues rutas absolutas, relativas y acceso al padre?
- ¿Qué elemento muestra imágenes y qué hacen `src` y `alt`?
- ¿Qué cuatro formatos explica la lectura y cuándo elegirías cada uno?

## Construye y rompe una ruta de forma controlada

El ejercicio de mover about.html no busca que memorices una cadena, sino que puedas reconstruirla desde la ubicación actual. Antes de mover el archivo, index y about son vecinos. Una ruta con sólo el nombre significa buscar en ese mismo directorio. Al mover about a pages, el archivo sigue existiendo, pero la dirección anterior ya no lo describe. El navegador no adivina que decidiste reorganizarlo.

Después de corregir el enlace desde index, abre about y añade un enlace de regreso. Ahora el punto de partida es pages, por lo que index.html sin prefijo buscaría un archivo dentro de pages. Usa dos puntos para subir un nivel. El nombre de la carpeta raíz de tu computadora no debe aparecer en ese enlace: una ruta pública del sitio no debe depender de una ubicación como Descargas o Documentos de tu equipo.

Dibuja la estructura en papel y traza cada paso con una flecha. Desde index, entra a pages y luego about. Desde about, sube al directorio del proyecto y entra a images para encontrar dog.jpg. Si más adelante añades otra carpeta intermedia, cada referencia relativa afectada necesita reconsiderarse. Esta habilidad también sirve para hojas de estilos y archivos JavaScript externos.

Una URL absoluta incluye suficiente información para localizar un recurso sin depender del directorio del documento actual. Eso no significa que todas las direcciones dentro del mismo sitio tengan que ser relativas; también puedes usar absolutas. La distinción técnica está en la forma de resolver la dirección, no sólo en si el destino pertenece o no a tu sitio.

## Comprende cada atributo del enlace

href responde a qué recurso ir. target responde en qué contexto abrirlo. rel describe relaciones y ciertas políticas entre el documento actual y el destino. Ninguno sustituye a los otros. Si escribes sólo target, el enlace sigue sin saber su destino. Si escribes un href correcto sin target, el comportamiento predeterminado es abrir en la misma pestaña.

Una nueva pestaña puede ser útil en algunos contextos, pero también puede sorprender. Si eliges abrirla, considera indicarlo en el texto cuando ayude a la persona. No uses ese comportamiento para compensar una navegación confusa. La protección noopener evita acceso mediante opener; noreferrer añade privacidad sobre el origen de la navegación y puede cambiar lo que observa el sitio de destino en sus estadísticas.

El texto del enlace debe explicar qué encontrará la persona. Repetir «aquí» para varios destinos obliga a leer todo el contexto. En el recetario, el nombre del platillo es un destino comprensible. Si el recurso es un PDF o un archivo descargable, el texto puede anunciarlo. Una dirección bien escrita que apunta a un recurso distinto sigue siendo un problema de experiencia aunque no produzca error técnico.

## Coloca la imagen en el entorno correcto

Descargar una fotografía guarda un archivo, pero todavía no lo añade automáticamente al proyecto. Localízalo, revisa su extensión real y cópialo al directorio images. En WSL, el navegador de Windows puede descargar en la carpeta de Windows; VS Code conectado a Ubuntu muestra otro lugar. Arrastrar el archivo al explorador de ese proyecto es una forma de cruzar conscientemente entre ambos entornos.

Si prefieres cp, verifica la ruta real antes de ejecutarlo. Los nombres de usuario, mayúsculas y nombres de carpetas pueden variar. La ruta mostrada en el ejemplo no tiene por qué existir en tu equipo. Después de copiar, usa ls y abre el archivo desde su nueva ubicación. No dependas de una imagen que continúa únicamente en Descargas: otra persona que clone el repositorio no la tendrá.

En algunos casos Windows añade metadatos sobre la zona de origen de una descarga. Esos archivos auxiliares no son parte de la fotografía que necesita tu página. Inspecciona qué archivos vas a confirmar en Git y evita publicar residuos de herramientas. No borres archivos que no reconoces en otras carpetas del equipo; esta limpieza se refiere sólo a copias auxiliares identificadas dentro de tu proyecto.

## Describe y dimensiona según contexto

alt no es un lugar para rellenar palabras clave ni repetir siempre «imagen de». Pregunta qué información perdería alguien que no ve la fotografía. En una receta, podría ser el aspecto del platillo terminado. En una imagen puramente decorativa, una descripción larga puede interrumpir la lectura sin aportar información. El atributo vacío expresa esa decisión; omitirlo no siempre produce la misma experiencia.

Para comprobar la alternativa, cambia temporalmente el nombre del archivo en src por uno inexistente y observa qué muestra el navegador. Después restáuralo. Ésta es una prueba controlada, no una razón para dejar una imagen rota en la entrega. Comprueba también que el texto alternativo corresponde a la imagen actual si la reemplazas por otra.

Los atributos width y height permiten reservar proporción antes de descargar la imagen. Usa sus dimensiones reales o una proporción coherente, no dos números arbitrarios que la estiren. Más adelante podrás ajustar el tamaño visible con CSS manteniendo altura automática. Reserva espacio para evitar que el contenido salte cuando termine una descarga lenta.

Finalmente, distingue formatos rasterizados y vectoriales en la lectura asignada. Una fotografía y un logotipo simple pueden beneficiarse de formatos distintos. Evalúa calidad, transparencia, animación y tamaño de archivo según el caso. No necesitas memorizar todos los formatos existentes hoy; sí reconocer que cambiar la extensión del nombre no convierte los datos de una imagen de un formato a otro.

Después de corregir una ruta, prueba tanto el enlace de ida como el regreso desde el documento de destino.
