/**
 * Estado editorial. `draft` = contenido provisional o sin validar: se muestra con marca «Borrador»
 * en vista previa y se oculta en producción. Nunca publicar un hecho no confirmado como `published`.
 */
export type ContentStatus = "published" | "draft";

export type Publishable = { status: ContentStatus };

export type Ratio = "1/1" | "4/3" | "3/4" | "16/9" | "3/2";

export type ImageAsset = {
  src: string;
  width: number;
  height: number;
  /** Describe el contenido relevante de la imagen, no la intención. Vacío solo si es decorativa. */
  alt: string;
};

export type MediaItem = {
  id: string;
  caption: string;
  ratio: Ratio;
  /** Sin imagen = espacio reservado (placeholder honesto). */
  image?: ImageAsset;
};
