import type { MediaItem } from "./types";

/**
 * Galería. Solo 6 imágenes del instituto (recortes 3:4 en /arc para nitidez en el arco).
 * Las conceptuales o renders deben indicarlo en `caption`.
 */
export const galleryItems: MediaItem[] = [
  {
    id: "g-01",
    caption: "Espacio Iquiti",
    ratio: "3/4",
    image: {
      src: "/images/galeria/instituto/arc/arc-1.webp",
      width: 744,
      height: 992,
      alt: "Vista del espacio Iquiti con pantallas, sillones y mesas de trabajo",
    },
  },
  {
    id: "g-02",
    caption: "Lounge y salas",
    ratio: "3/4",
    image: {
      src: "/images/galeria/instituto/arc/arc-2.webp",
      width: 744,
      height: 992,
      alt: "Lounge frente a la Sala 01 con sillones y barra de trabajo",
    },
  },
  {
    id: "g-03",
    caption: "Mesa colaborativa",
    ratio: "3/4",
    image: {
      src: "/images/galeria/instituto/arc/arc-3.webp",
      width: 744,
      height: 992,
      alt: "Mesa circular de trabajo alrededor de una columna con sillas altas",
    },
  },
  {
    id: "g-04",
    caption: "Área de estar",
    ratio: "3/4",
    image: {
      src: "/images/galeria/instituto/arc/arc-4.webp",
      width: 744,
      height: 992,
      alt: "Lounge con sillones y sala de reunión acristalada al fondo",
    },
  },
  {
    id: "g-05",
    caption: "Estaciones de trabajo",
    ratio: "3/4",
    image: {
      src: "/images/galeria/instituto/arc/arc-5.webp",
      width: 744,
      height: 992,
      alt: "Mesas de trabajo, cabina de madera y vista a la ciudad",
    },
  },
  {
    id: "g-06",
    caption: "Rincón de conversación",
    ratio: "3/4",
    image: {
      src: "/images/galeria/instituto/arc/arc-6.webp",
      width: 744,
      height: 992,
      alt: "Sillones de colores alrededor de una mesa baja frente a la ventana",
    },
  },
];
