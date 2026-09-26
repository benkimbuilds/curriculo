import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Logos originales (public/brand). No se editan ni se redibujan: el color sobre superficies oscuras
 * se aplica con CSS (var(--iq-logo-filter), definido por cada superficie).
 *
 * Tamaño mínimo: la marca gráfica usa trazos de 2.5/494 u. Por debajo de ~200px de alto las líneas
 * quedan < 1px; en tamaños pequeños usar `wordmark`.
 */
const LOGOS = {
  wordmark: { src: "/brand/iquiti/logotipo-Iquiti.svg", width: 800, height: 296 },
  horizontal: { src: "/brand/iquiti/logo-horizontal-iquiti.svg", width: 1392, height: 494 },
  tagline: { src: "/brand/iquiti/logo-tagline-CI.svg", width: 1393, height: 494 },
  motto: { src: "/brand/iquiti/logo-horizontal-ACC.svg", width: 1393, height: 494 },
  vertical: { src: "/brand/iquiti/logo-vertical.svg", width: 800, height: 872 },
  graphic: { src: "/brand/iquiti/logo-graphic.svg", width: 492, height: 494 },
  "academia-horizontal": { src: "/brand/academia/logo-horizontal-academia.svg", width: 1392, height: 521 },
  "academia-tagline": { src: "/brand/academia/logo-horizontal-academia-tag.svg", width: 1392, height: 521 },
  "academia-vertical": { src: "/brand/academia/Logo-vertical-AC.svg", width: 800, height: 872 },
  "academia-graphic": { src: "/brand/academia/logo-lazos-AC.svg", width: 492, height: 521 },
} as const;

export type LogoName = keyof typeof LOGOS;

type LogoProps = {
  name: LogoName;
  /** Nombre accesible. Vacío ("") si el logo acompaña un texto que ya lo nombra. */
  alt: string;
  className?: string;
  /**
   * Carga inmediata: para logos del primer viewport, para los que pueden ser el LCP al entrar
   * por un ancla, y para los que repiten el `src` de uno eager (en dev Next guarda un registro
   * por `src` y gana el último: uno lazy tapa al eager y avisa de un LCP que no es ese).
   */
  eager?: boolean;
  /** Prioridad alta de red: solo en el elemento que será el LCP (uno por página). */
  lcp?: boolean;
};

export function Logo({ name, alt, className, eager, lcp }: LogoProps) {
  const logo = LOGOS[name];
  return (
    <Image
      src={logo.src}
      width={logo.width}
      height={logo.height}
      alt={alt}
      loading={eager || lcp ? "eager" : "lazy"}
      fetchPriority={lcp ? "high" : undefined}
      className={cn(
        "h-auto [filter:var(--iq-logo-filter)] transition-[filter] duration-(--iq-duration-base)",
        className,
      )}
    />
  );
}
