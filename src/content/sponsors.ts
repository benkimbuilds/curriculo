import type { ImageAsset } from "./types";

export type Sponsor = {
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
 * Aliados. Toda la tira va en nombres, por decisión de diseño: con logotipos de proporciones
 * tan distintas las alturas se descompensan y hacen falta escalas ópticas por marca. Los SVG
 * ya descargados (Cursor, Vercel, ElevenLabs) esperan en `public/brand/partners/`; para volver
 * a mostrarlos basta añadir `logo: logo("vercel.svg", "Vercel", 262, 52)` a su entrada.
 */
export const sponsors: Sponsor[] = [
  { id: "openai", name: "OpenAI" },
  { id: "cursor", name: "Cursor" },
  { id: "vercel", name: "Vercel" },
  { id: "anthropic", name: "Anthropic" },
  { id: "elevenlabs", name: "ElevenLabs" },
  { id: "heygen", name: "HeyGen" },
  { id: "aws", name: "AWS" },
  { id: "google-cloud", name: "Google Cloud" },
];

/** Alta de un logo: `{ ..., logo: logo("openai.svg", "OpenAI", 1024, 260) }`. */
export { logo as partnerLogo };
