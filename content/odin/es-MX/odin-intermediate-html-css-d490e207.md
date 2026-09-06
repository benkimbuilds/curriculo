# Estilos predeterminados del navegador

## De dónde vienen

Una página sin tu CSS ya tiene apariencia: los encabezados son grandes, los enlaces suelen estar subrayados y el cuerpo tiene márgenes. El navegador aplica una hoja de estilos de agente de usuario, o *user-agent stylesheet*. Su objetivo es que un documento básico pueda leerse e interactuarse incluso sin estilos de autor.

Cada navegador incluye sus propias reglas. Las diferencias explican por qué un botón o un campo de formulario puede verse distinto en Windows, macOS o un teléfono. Cuando inspecciones un elemento, distingue sus reglas de las que escribiste. Un margen inesperado puede venir de la hoja del navegador; no necesariamente de un contenedor que agregaste.

## Sobrescribir o reiniciar

Normalmente puedes sobrescribir esos valores con tus propias reglas. Las declaraciones de autor tienen prioridad sobre las reglas normales del agente de usuario. Una hoja de reinicio, o *reset*, agrupa cambios iniciales para reducir diferencias y establecer un punto de partida consistente.

```css
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; line-height: 1.5; }
img { max-width: 100%; height: auto; }
button, input, select, textarea { font: inherit; }
```

Cada regla tiene un propósito: incluir borde y relleno en el tamaño declarado, quitar el margen exterior inicial, impedir imágenes más anchas que su contenedor y hacer que los controles compartan tipografía. Esto es una pequeña base, no una obligación universal.

Un reset es una decisión de diseño. Algunos eliminan muchos valores; otros normalizan diferencias conservando valores útiles. Puedes usar uno existente, crear uno o prescindir de él. Lo importante es comprender sus consecuencias. Borrar contornos de foco, viñetas y estilos de encabezados sin reemplazarlos puede quitar información que el navegador ofrecía gratuitamente.

## Actividad

1. Lee [Reboot, Resets, and Reasoning](https://css-tricks.com/reboot-resets-reasoning/) para conocer la historia de estas hojas y por qué reflejan preferencias de sus autores.
2. Revisa [el argumento a favor de normalize y reset](https://mattbrictson.com/blog/css-normalize-and-reset). Distingue qué problema intenta solucionar cada enfoque.
3. Lee el [reset comentado de Josh Comeau](https://www.joshwcomeau.com/css/custom-css-reset/). Explica con tus palabras cada regla antes de adoptarla.
4. Crea una página con encabezados, enlaces, listas y controles. Compara dos navegadores y activa o desactiva el reset desde DevTools. Registra una diferencia que desaparezca y un estilo útil que debas restaurar.

## Comprobación

- ¿Por qué un elemento tiene estilos aunque tu hoja esté vacía?
- ¿Qué problema resuelve un reset y por qué no es obligatorio?
- ¿Cómo detectarías si un margen procede del navegador o de tu código?
