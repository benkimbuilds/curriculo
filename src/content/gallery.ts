import type { MediaItem } from "./types";

/**
 * Galería. Agregar imágenes en /public/images/galeria y completar `image`.
 * El arco las muestra en retrato 3:4. Las conceptuales o renders deben indicarlo en `caption`.
 */
export const galleryItems: MediaItem[] = [
  {
    id: "g-01",
    caption: "Espacio Iquiti",
    ratio: "3/4",
    image: {
      src: "/images/galeria/instituto/visor-1.webp",
      width: 1586,
      height: 992,
      alt: "Vista del espacio Iquiti con el lema Aprender Construir Conectar y mesa circular de trabajo",
    },
  },
  {
    id: "g-02",
    caption: "Aprender, construir, conectar",
    ratio: "3/4",
    image: {
      src: "/images/galeria/comunidad/comunidad-2.webp",
      width: 1586,
      height: 992,
      alt: "Personas colaborando bajo el lema Aprender Construir Conectar",
    },
  },
  {
    id: "g-03",
    caption: "Sala de reunión",
    ratio: "3/4",
    image: {
      src: "/images/galeria/instituto/visor-2.webp",
      width: 1586,
      height: 992,
      alt: "Lounge frente a la Sala 01 con sillones y mesas altas de trabajo",
    },
  },
  {
    id: "g-04",
    caption: "Intercambio de ideas",
    ratio: "3/4",
    image: {
      src: "/images/galeria/comunidad/comunidad-3.webp",
      width: 1585,
      height: 992,
      alt: "Conversación en el lounge junto a una sala de reunión",
    },
  },
  {
    id: "g-05",
    caption: "Mesa colaborativa",
    ratio: "3/4",
    image: {
      src: "/images/galeria/instituto/visor-3.webp",
      width: 1586,
      height: 992,
      alt: "Mesa circular de trabajo alrededor de una columna con sillas altas",
    },
  },
  {
    id: "g-06",
    caption: "Colaboración",
    ratio: "3/4",
    image: {
      src: "/images/galeria/comunidad/comunidad-4.webp",
      width: 1586,
      height: 992,
      alt: "Dos personas trabajando juntas en una mesa compartida",
    },
  },
  {
    id: "g-07",
    caption: "Área de estar",
    ratio: "3/4",
    image: {
      src: "/images/galeria/instituto/visor-4.webp",
      width: 1586,
      height: 992,
      alt: "Lounge con sillones y sala de reunión acristalada al fondo",
    },
  },
  {
    id: "g-08",
    caption: "Salas y estaciones",
    ratio: "3/4",
    image: {
      src: "/images/galeria/instituto/visor-5.webp",
      width: 1586,
      height: 992,
      alt: "Mesas de trabajo, cabinas de madera y Sala 02 con vista a la ciudad",
    },
  },
];
