import { type ElementType, Fragment } from "react";

/**
 * Texto que gira en 3D letra por letra (inspirado en «Letter 3D Swap»). Sin JS: las letras se
 * renderizan en el servidor y la animación es CSS, así no depende de la hidratación.
 *
 * - `trigger="load"`: cada letra entra girando sobre el eje indicado (una sola cara).
 * - `trigger="hover"`: cada letra es una caja de dos caras con la misma letra; al pasar el puntero
 *   por el texto, la caja gira 90° y la segunda cara toma el lugar de la primera.
 * - `trigger="load-hover"`: entra al cargar y además vuelve a girar en cada hover.
 * - `from="center"`: el escalonado nace en el centro del texto y se abre hacia los dos extremos.
 *
 * Accesibilidad: el lector de pantalla lee una copia continua (`sr-only`); las letras van en una
 * capa `aria-hidden`. Con `prefers-reduced-motion` no hay giro.
 */

type Direction = "top" | "bottom" | "left" | "right";

type LetterSwapProps = {
  text: string;
  as?: ElementType;
  direction?: Direction;
  trigger?: "load" | "hover" | "load-hover";
  /** Desde dónde se escalona: el inicio del texto o su centro (hacia los dos extremos). */
  from?: "start" | "center";
  /** Retraso entre letras (ms). */
  stagger?: number;
  /** Retraso inicial (ms). */
  delay?: number;
  className?: string;
};

const splitWords = (text: string) => text.split(" ").filter(Boolean);
const splitChars = (word: string) =>
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? [...new Intl.Segmenter("es", { granularity: "grapheme" }).segment(word)].map((s) => s.segment)
    : [...word];

export function LetterSwap({
  text,
  as: Tag = "p",
  direction = "top",
  trigger = "load",
  from = "start",
  stagger = 22,
  delay = 0,
  className,
}: LetterSwapProps) {
  const words = splitWords(text).map((word) => ({ word, chars: splitChars(word) }));
  // `center`: el retraso crece con la distancia al centro, así el giro se abre hacia los extremos.
  const middle = (words.reduce((n, { chars }) => n + chars.length, 0) - 1) / 2;
  const step = (i: number) => (from === "center" ? Math.abs(i - middle) : i);
  let index = -1;

  return (
    <Tag className={className} data-letter-swap={trigger} data-direction={direction}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map(({ word, chars }, w) => (
          // El espacio entre palabras queda fuera de la caja (un inline-block recorta el espacio
          // final) y es donde el navegador puede cortar la línea.
          // biome-ignore lint/suspicious/noArrayIndexKey: texto estático; la posición ES la identidad de la palabra.
          <Fragment key={`${word}-${w}`}>
            {w > 0 ? " " : null}
            <span className="letter-word">
              {chars.map((char, c) => {
                index += 1;
                const offset = step(index) * stagger;
                // Dos retrasos: la entrada incluye el retraso inicial; el hover no (responde al instante).
                const style = {
                  "--letter-delay": `${delay + offset}ms`,
                  "--letter-hover-delay": `${offset}ms`,
                } as React.CSSProperties;
                return (
                  // biome-ignore lint/suspicious/noArrayIndexKey: texto estático; la posición ES la identidad de la letra.
                  <span key={`${char}-${c}`} className="letter-box" style={style}>
                    <span className="letter-face">{char}</span>
                    {trigger !== "load" && (
                      <span className="letter-face letter-face-back" aria-hidden="true">
                        {char}
                      </span>
                    )}
                  </span>
                );
              })}
            </span>
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
