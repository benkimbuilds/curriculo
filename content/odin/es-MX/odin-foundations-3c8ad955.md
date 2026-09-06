# Proyecto: recetario

Construye un sitio básico de recetas para practicar todo el HTML aprendido. Tendrá una página de inicio que enlaza a tres recetas. No necesita verse sofisticado: volverás después para añadir CSS. El objetivo ahora es estructura, navegación y contenido correcto.

## Prepara el repositorio

Crea en GitHub `odin-recipes` y clónalo dentro de `repos` mediante SSH. Entra a la carpeta antes de ejecutar comandos Git. Prepara un README que explique qué construirás y qué habilidades demostrarás. Puedes ampliar la reflexión al terminar.

Si necesitas repasar, consulta [Introducción a Git](https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/introduction-to-git), [Git básico](https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/git-basics) y [configuración SSH](https://www.theodinproject.com/lessons/foundations-setting-up-git). Trabaja en los archivos locales; editar también en GitHub antes de sincronizar crea versiones diferentes.

Usa varios ciclos de `git add`, `git commit` y `git push origin main`, siguiendo lo aprendido sobre [mensajes de commit](https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/commit-messages). Confirma cambios significativos y verifica los archivos publicados en GitHub.

## Iteración 1: inicio

1. Crea `index.html` en la raíz del repositorio.
2. Añade la estructura HTML completa, idioma, codificación y título.
3. Dentro de `body`, incluye un `h1` con «Recetas de Odin».

## Iteración 2: primera receta

1. Crea el directorio `recipes` y dentro un archivo nombrado por el platillo, por ejemplo `lasagna.html`. Puedes elegir un platillo propio o consultar [Allrecipes](https://www.allrecipes.com/) como inspiración.
2. Incluye la estructura completa del documento y un `h1` con el nombre de la receta.
3. Desde el inicio enlaza a `recipes/lasagna.html` con el nombre del platillo como texto.
4. En la receta añade un regreso al inicio:

```html
<a href="../index.html">Inicio</a>
```

## Iteración 3: contenido completo

La receta debe contener, en este orden:

1. Una imagen del platillo terminado bajo el encabezado, con permiso de uso, crédito cuando corresponda, texto alternativo y dimensiones.
2. Un encabezado «Descripción» del nivel apropiado y uno o dos párrafos que expliquen el platillo.
3. Un encabezado «Ingredientes» con una **lista no ordenada** de ingredientes.
4. Un encabezado «Pasos» con una **lista ordenada** de instrucciones de preparación.

Escribe o adapta el texto con permiso; atribuye la receta y la fotografía si usas material ajeno. No confundas encontrar contenido en internet con tener autorización para republicarlo.

## Iteración 4: completa el recetario

Crea otras dos recetas con la misma estructura. Enlaza las tres desde el inicio, preferentemente dentro de una lista para que no queden juntas en una sola línea. Cada enlace debe apuntar a su propio archivo, no a la misma receta copiada por accidente.

```html
<ul>
  <li><a href="recipes/lasagna.html">Lasaña</a></li>
  <li><a href="recipes/sopa.html">Sopa</a></li>
  <li><a href="recipes/ensalada.html">Ensalada</a></li>
</ul>
```

## Publicación y aceptación

Para mostrar el sitio fuera de tu computadora, publica con GitHub Pages. En un repositorio público puedes usar el servicio gratuito: abre **Settings > Pages**, elige desplegar desde la rama `main` y la carpeta raíz, y guarda. [Esta captura original](https://cdn.statically.io/gh/TheOdinProject/curriculum/90b1a362af0bb8635af9593cd8911c9aefb68569/foundations/html_css/html-foundations/imgs/01.png) ubica Settings. Espera a que Actions muestre la publicación; no añadas un tema que modifique tus archivos. Usa la URL que muestra Pages, normalmente `https://TU-USUARIO.github.io/odin-recipes/`.

Si no aparece, revisa el estado de Actions, la rama elegida y que `index.html` esté en la raíz. Los repositorios privados pueden requerir un plan de pago; no son necesarios para esta práctica.

Comprueba desde la URL publicada: inicio con tres enlaces, tres recetas completas, imágenes sin errores, regreso al inicio en cada receta y HTML válido. El README debe explicar el proyecto y el historial mostrar avances reales.

No copies soluciones de otros estudiantes antes de terminar: también pueden contener errores y no muestran todo el proceso de razonamiento. Pide orientación en [la comunidad](https://discord.gg/fbFCkYabZB) o en su [canal de ayuda](https://discord.com/channels/505093832157691914/516751477306294273). Después puedes comparar enfoques, recordando que algunos proyectos fueron mejorados con CSS o hechos por personas con experiencia. Lee [Learning Code](https://dev.to/theodinproject/learning-code-f56) para mantener el foco en aprendizaje y requisitos.

## Revisa cada iteración antes de avanzar

Después de la primera iteración, abre index.html y verifica el título visible y el de la pestaña. Todavía no necesitas imágenes ni estilos. Este punto pequeño permite confirmar que estás editando el archivo correcto y que la estructura básica funciona. Haz un commit con esa intención antes de añadir el resto del sitio.

Al crear la primera receta, escribe su estructura completa en su propio archivo. No pegues sólo el contenido de body suponiendo que heredará la estructura de index: son documentos independientes. Cambia title y h1 para que nombren el platillo correcto. Comprueba el enlace de ida y el de regreso antes de dedicar tiempo al contenido. Si fallan, dibuja la estructura de carpetas y reconstruye la ruta relativa desde cada archivo.

Cuando añadas la fotografía, revisa que el recurso esté dentro del repositorio o que uses una URL permitida y estable. Una ruta hacia Descargas de tu computadora puede funcionar para ti pero no para otra persona. El texto alternativo debe corresponder al platillo y la imagen debe aparecer debajo del nombre. Incluye crédito y licencia donde corresponda; la atribución no sustituye un permiso de uso que no tienes.

La descripción no tiene que ser extensa, pero debe decir algo útil sobre la receta. Los ingredientes son una colección donde el orden suele no afectar la preparación, por eso usas ul. Los pasos sí expresan una secuencia: mezclar antes de cortar puede cambiar el procedimiento, por eso usas ol. Comprueba que cada entrada sea un li y no texto separado mediante saltos manuales.

## Evita errores al duplicar estructura

Usar la primera página como punto de partida para las otras puede ahorrar escritura, pero revisa todos los lugares donde quedó el nombre anterior. Un fallo común es cambiar el h1 y olvidar el title, la imagen, el texto alternativo o el destino de los enlaces. Abre las tres recetas de forma independiente y confirma que cada una contiene sus propios ingredientes y pasos.

La lista del inicio debe tener tres destinos diferentes. Pulsa cada enlace y vuelve usando el enlace de inicio del sitio, no sólo el botón Atrás del navegador. Esa comprobación demuestra que construiste la navegación requerida. Si una receta sólo se puede abrir escribiendo manualmente su ruta, todavía falta integrar el sitio.

## Publicación como prueba adicional

Después de desplegar, repite la navegación desde la dirección pública. Un entorno remoto puede distinguir mayúsculas que tu sistema local trataba de otra forma. Compara nombres exactos de archivos e imágenes si algo deja de cargar. Revisa Actions para distinguir un fallo de publicación de un fallo de ruta dentro de una página publicada.

No evalúes este proyecto por parecerse a las entregas más elaboradas de otras personas. Algunas fueron revisadas después de aprender CSS o creadas con experiencia previa. Tu evidencia es cumplir la estructura, explicar las decisiones y mantener un historial honesto del proceso. Al terminar puedes comparar alternativas y registrar una mejora futura sin confundirla con un requisito de esta etapa.
