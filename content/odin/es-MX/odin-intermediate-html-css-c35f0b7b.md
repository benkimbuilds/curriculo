# Proyecto: panel administrativo

## Objetivo

Construye una página de panel administrativo utilizando Grid para la mayor parte de su distribución. Este proyecto es una interfaz estática: no requiere autenticación, búsqueda real ni un servidor. Debe demostrar que puedes descomponer un diseño en cuadrículas anidadas.

## Preparar y planear

1. Crea un repositorio Git, HTML y CSS. Comprueba que los estilos cargan antes de avanzar.
2. Descarga el [diseño completo](https://cdn.statically.io/gh/TheOdinProject/curriculum/43cc6ab69fdfbef40d431a65677d2144668930ac/intermediate_html_css/grid/project_admin_dashboard/imgs/dashboard-project.png).
3. Identifica barra lateral, encabezado y contenido principal. Dibuja sus relaciones de columnas y filas antes de escribir tamaños.

## Construcción por regiones

1. Escribe los contenedores principales y aplica Grid hasta obtener la estructura exterior.
2. En la barra lateral, organiza marca y navegación mediante otra cuadrícula.
3. En el encabezado, organiza búsqueda, información de usuario y botones. Usa etiquetas y tipos de botón apropiados, aunque las acciones sean demostrativas.
4. En el contenido principal, crea regiones para proyectos, anuncios y tendencias. Las tarjetas de proyectos deben formar una cuadrícula propia.
5. Añade textos e imágenes provisionales para verificar tamaños. Después reemplázalos por contenido coherente, sin datos de personas reales.

```css
.panel { display: grid; grid-template-columns: 15rem minmax(0, 1fr); }
.proyectos { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.5rem; }
```

## Recursos y acabado

Puedes reproducir la referencia o aplicar tu propio estilo. Los iconos pueden obtenerse de [Material Design Icons](https://pictogrammers.com/library/mdi/). La referencia usa Roboto, disponible en Google Fonts; repasa [más estilos de texto](https://www.theodinproject.com/lessons/intermediate-html-and-css-more-text-styles) para incorporarla correctamente. Conserva atribuciones y licencias necesarias.

Durante el trabajo, aplica colores o bordes temporales para distinguir contenedores. Usa pistas en píxeles, `fr` o una combinación, y explica por qué. La referencia no exige coincidencia perfecta de píxeles ni una adaptación móvil completa en esta etapa; opcionalmente permite que las tarjetas cambien de cantidad de columnas al reducir la ventana.

No confundas separación entre pistas con relleno de una tarjeta: el texto debe tener espacio respecto a sus bordes. Prueba títulos largos y más anuncios para descubrir alturas que recorten contenido.

## Entrega

Publica el código en GitHub y la demostración en GitHub Pages. Incluye captura, instrucciones y decisiones de distribución en el README. Si quieres aportar retroalimentación al proyecto original, existe este [formulario del curso intermedio de Odin](https://docs.google.com/forms/d/e/1FAIpQLSf_hNwIjvqcPZyl9Lx41mgJNQKp04qOro03SI8ABw4Zp7U_4w/viewform?usp=sf_link); es opcional y externo a Ruta.

## Comprobación

- ¿Puedes identificar la cuadrícula exterior y las anidadas en DevTools?
- ¿Qué ocurre al añadir una tarjeta o aumentar el texto?
- ¿La demostración distingue claramente acciones ficticias de funciones implementadas?
