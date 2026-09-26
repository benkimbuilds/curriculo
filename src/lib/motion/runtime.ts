import { gsap, registerGsap, ScrollTrigger } from "./gsap";
import { applyReveal } from "./presets";

const FONT_WAIT = 1000;

const fontsReady = () =>
  Promise.race([document.fonts?.ready, new Promise((resolve) => setTimeout(resolve, FONT_WAIT))]);

/**
 * Runtime de motion. Se carga con import() diferido desde <MotionRoot/>: GSAP (~63 KB gz) queda
 * fuera del JS crítico de hidratación. Devuelve una función que revierte todo.
 */
export function startMotion(): () => void {
  registerGsap();
  const root = document.documentElement;
  const mm = gsap.matchMedia();
  let cancelled = false;

  // SplitText mide el texto: se espera a Manrope (máx. FONT_WAIT ms) para no dividir con el fallback.
  fontsReady().then(() => {
    if (cancelled) return;
    try {
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        for (const el of gsap.utils.toArray<HTMLElement>("[data-reveal]")) applyReveal(el);
        ScrollTrigger.refresh();
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        root.dataset.motion = "off";
      });
    } catch (error) {
      root.dataset.motion = "off";
      console.error("[motion] desactivado por error:", error);
    }
  });

  return () => {
    cancelled = true;
    mm.revert();
  };
}
