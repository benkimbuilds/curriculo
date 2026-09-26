import type { ElementType } from "react";
import type { RevealName } from "@/lib/motion/presets";

type RevealTextProps = {
  text: string;
  as?: ElementType;
  reveal?: Extract<RevealName, "words" | "chars">;
  delay?: number;
  className?: string;
  id?: string;
};

/**
 * Texto dividido en palabras/letras sin perder accesibilidad.
 * - En h1–h6: SplitText nombra el heading con aria-label (permitido por ARIA).
 * - En otros elementos (p, span): aria-label está prohibido en roles genéricos, así que se
 *   renderiza una copia sr-only para el lector y una capa visual aria-hidden para la animación.
 */
export function RevealText({ text, as: Tag = "p", reveal = "words", delay, className, id }: RevealTextProps) {
  const isHeading = typeof Tag === "string" && /^h[1-6]$/.test(Tag);
  const delayAttr = delay ? String(delay) : undefined;

  if (isHeading) {
    return (
      <Tag id={id} className={className} data-reveal={reveal} data-reveal-delay={delayAttr}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="block" data-reveal={reveal} data-reveal-delay={delayAttr}>
        {text}
      </span>
    </Tag>
  );
}
