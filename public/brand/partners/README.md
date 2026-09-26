# Logos de aliados

SVG **monocromo negro** (`fill="#000"` o `currentColor` resuelto a negro), sin fondo, recortado al
trazo. El color lo pone la superficie: `--iq-logo-filter` los deja en negro sobre claro y los
invierte a blanco sobre oscuro, así que **no** hace falta una variante blanca.

Estado (los consume `src/content/sponsors.ts`):

| Aliado | Archivo | Origen |
|---|---|---|
| Cursor | `cursor.svg` | Brand kit oficial (`cursor.com/brand` → `cursor-brand-assets.zip`), lockup horizontal 2D para fondo claro. |
| Vercel | `vercel.svg` | Wordmark oficial publicado por Vercel. |
| ElevenLabs | `elevenlabs.svg` | Logo negro oficial de `elevenlabs.io/brand`. |
| OpenAI | — | Sus guías de diseño solo ofrecen plantillas `.psb`; no publican SVG. |
| Anthropic | — | No se encontró descarga pública del logotipo. |
| HeyGen | — | Solo publican PNG a color. |
| AWS | — | Marca restringida: la descarga pasa por su programa de partners. |
| Google Cloud | — | Marca restringida por sus lineamientos. |

Los que no tienen archivo muestran el nombre en tipografía, que es el comportamiento previsto.

Al agregar un archivo, completa su entrada en `sponsors.ts` con `partnerLogo(...)` y las dimensiones
reales del `viewBox`. En la cinta se muestran a `max-h-12` (48 px) de alto.

## Antes de publicarlos

1. Descargar el SVG del **brand kit oficial** de cada organización, no de un buscador de imágenes.
2. Respetar sus lineamientos de marca (área de protección, proporciones, versión monocroma
   permitida). No redibujar ni recomponer el logotipo.
3. Usar la marca de un tercero en una sección llamada «Aliados» afirma un vínculo: solo con el
   acuerdo confirmado y el permiso de uso correspondiente. Hasta entonces, `status: "draft"`.
