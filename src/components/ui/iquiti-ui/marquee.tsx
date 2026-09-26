import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

type MarqueeProps = {
  /** Elementos de la cinta (`<li>`): se pintan dos veces para que el bucle no tenga costura. */
  children: ReactNode;
  /** Segundos de una vuelta completa. Escalar con la cantidad de elementos mantiene la velocidad. */
  duration?: number;
  className?: string;
};

/**
 * Cinta en bucle continuo, solo CSS (no necesita hidratación). Se detiene con el puntero encima o
 * con el foco dentro, y con `prefers-reduced-motion` no se mueve: la cinta se reparte en filas.
 *
 * La segunda copia va `aria-hidden` e `inert`: el lector de pantalla lee la lista una sola vez y
 * el teclado no cae en duplicados.
 */
export function Marquee({ children, duration = 48, className }: MarqueeProps) {
  return (
    <div
      className={cn("marquee", className)}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
    >
      <div className="marquee-track">
        <ul className="marquee-run">{children}</ul>
        <ul className="marquee-run" aria-hidden="true" inert>
          {children}
        </ul>
      </div>
    </div>
  );
}
