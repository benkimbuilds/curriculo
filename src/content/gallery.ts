import type { MediaItem } from "./types";

/**
 * Galería. Agregar imágenes en /public/images/galeria y completar `image`.
 * El arco las muestra en retrato 3:4. Las conceptuales o renders deben indicarlo en `caption`.
 */
export const galleryItems: MediaItem[] = [
  { id: "g-01", caption: "Espacio de trabajo", ratio: "3/4" },
  { id: "g-02", caption: "Comunidad", ratio: "3/4" },
  { id: "g-03", caption: "Sesión de la Academia", ratio: "3/4" },
  { id: "g-04", caption: "Proyectos", ratio: "3/4" },
  { id: "g-05", caption: "Encuentros", ratio: "3/4" },
  { id: "g-06", caption: "Detalle del espacio", ratio: "3/4" },
];
