import type { ImageAsset, Publishable } from "./types";

export type Sponsor = Publishable & {
  id: string;
  name: string;
  href?: string;
  /** SVG monocromo negro (se adapta a la superficie vía --iq-logo-filter). Sin logo → el nombre. */
  logo?: ImageAsset;
};

const logo = (file: string, name: string, width: number, height: number): ImageAsset => ({
  src: `/brand/partners/${file}`,
  width,
  height,
  alt: name,
});

/**
 * Aliados. `draft` mientras la relación no esté confirmada: aparecen en vista previa y no se
 * publican. Nombrar a una organización en esta sección afirma un vínculo con el Centro; pasar a
 * `published` solo con el acuerdo verificado y con permiso de uso de marca.
 *
 * Toda la tira va en nombres, por decisión de diseño: con logotipos de proporciones tan distintas
 * las alturas se descompensan y hacen falta escalas ópticas por marca. Los SVG ya descargados
 * (Cursor, Vercel, ElevenLabs) esperan en `public/brand/partners/`; para volver a mostrarlos basta
 * añadir `logo: logo("vercel.svg", "Vercel", 262, 52)` a su entrada.
 */
export const sponsors: Sponsor[] = [
  { id: "openai", status: "draft", name: "OpenAI" },
  { id: "cursor", status: "draft", name: "Cursor" },
  { id: "vercel", status: "draft", name: "Vercel" },
  { id: "anthropic", status: "draft", name: "Anthropic" },
  { id: "elevenlabs", status: "draft", name: "ElevenLabs" },
  { id: "heygen", status: "draft", name: "HeyGen" },
  { id: "aws", status: "draft", name: "AWS" },
  { id: "google-cloud", status: "draft", name: "Google Cloud" },
];

/** Alta de un logo: `{ ..., logo: logo("openai.svg", "OpenAI", 1024, 260) }`. */
export { logo as partnerLogo };
