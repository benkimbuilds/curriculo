# Proyecto: página de presentación adaptable

## Objetivo

Construye una página de presentación parecida a la portada de un portafolio. Practicarás distribución, imágenes y accesibilidad; no necesitas tener todavía un portafolio profesional completo. Debe funcionar entre 320 y 1920 píxeles de ancho, incluidos tamaños intermedios.

Puedes elegir fuentes, colores y retrato propios. Lo principal es reproducir la estructura y el comportamiento de las referencias para escritorio, tableta y teléfono, no copiar cada decisión gráfica.

## Preparación

1. Crea HTML, CSS y repositorio. Comprueba que se cargan los estilos con contenido temporal.
2. Descarga las referencias de [escritorio](https://cdn.statically.io/gh/TheOdinProject/curriculum/fd6d4d2e2abbac4a3bd183bba6b6eaf1548a1458/advanced_html_css/responsive_design/project_personal_portfolio/imgs/portfolio.png), [tableta](https://cdn.statically.io/gh/TheOdinProject/curriculum/ca8588077887c9b653898537e84b1346967a4f0b/advanced_html_css/responsive_design/project_personal_portfolio/imgs/portfolio%20tablet.png) y [móvil](https://cdn.statically.io/gh/TheOdinProject/curriculum/1c8b5c739efd263e8cc48703988b18d6e3afe034/advanced_html_css/responsive-design/project_personal_portfolio/imgs/portfolio%20mobile.png).
3. Identifica cómo cambian encabezado, retrato, proyectos y contacto. Distingue cambios fluidos de cambios que necesitan otra distribución.

## Recursos

Puedes usar una fotografía propia o una imagen de práctica de [Pexels](https://www.pexels.com/), con atribución cuando corresponda. La referencia utiliza Playfair Display y Roboto; puedes escoger otras fuentes con licencia adecuada. Los iconos de enlaces sociales provienen de [Devicon](https://devicon.dev/) y los de teléfono, correo y enlace externo de [Material Design Icons](https://materialdesignicons.com/).

No publiques datos de contacto ajenos. Si todavía es una demostración ficticia, indícalo y usa ejemplos claros. Cada enlace de icono necesita un nombre accesible, aunque el dibujo parezca reconocible.

## Construcción y requisitos

1. Distribuye primero las regiones principales, ignorando detalles menores. Después trabaja de arriba abajo en encabezado, proyectos y contacto.
2. Usa Grid y Flexbox donde expresen claramente las relaciones. Mantén un orden HTML lógico para lectura y teclado.
3. Adapta las imágenes sin deformarlas; si cambia el encuadre entre tamaños, elige `object-position` o `picture` deliberadamente.
4. Mantén texto legible, espacios entre bordes y contenido, foco visible y enlaces descriptivos. Si añades movimiento, respeta la preferencia de reducción.
5. Implementa las consultas que el contenido requiera. Puedes comenzar por móvil o escritorio, pero el resultado debe funcionar en todo el rango, no sólo en tres capturas.

```css
.proyectos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: 1.5rem;
}
```

## Entrega y verificación

Publica código en GitHub y la demostración en GitHub Pages. Recorre lentamente todos los anchos del rango, prueba zoom, teclado, títulos largos y ausencia de una imagen. Compara las tres referencias con capturas a tamaños equivalentes. Incluye tus decisiones y pruebas en el README.

Opcionalmente comparte retroalimentación con el curso original mediante su [formulario de HTML y CSS avanzados](https://docs.google.com/forms/d/e/1FAIpQLSdVvT-2TiczhXP9qGfr28Aq6w6wzct0ypDqcpztaocA9bypXw/viewform?usp=sf_link).

## Comprobación

- ¿Qué ocurre justo antes y después de cada punto de cambio?
- ¿Pueden operarse los enlaces y controles sin ratón?
- ¿El sitio sigue siendo comprensible con imágenes ausentes y texto aumentado?
