import { tokens } from "@/lib/tokens";
import { gsap, SplitText } from "./gsap";

/**
 * Presets declarativos. Uso en cualquier Server Component:
 *   <h2 data-reveal="words">…</h2>
 *   <p data-reveal="fade-up" data-reveal-delay="0.2">…</p>
 *   <ul data-reveal="stagger">…</ul>          (anima los hijos directos)
 *
 * Reglas: animar solo transform/opacity (y blur en elementos pequeños); nunca `visibility`
 * (los elementos siguen enfocables y legibles por lector de pantalla mientras esperan).
 */
export type RevealName = "fade" | "fade-up" | "words" | "chars" | "stagger" | "media" | "draw";

type PresetOptions = { delay: number };
type Preset = (el: HTMLElement, options: PresetOptions) => void;

const { duration, stagger, distance, blur } = tokens;

const remToPx = (value: string) =>
  Number.parseFloat(value) * Number.parseFloat(getComputedStyle(document.documentElement).fontSize);

const onEnter = (trigger: Element) => ({ trigger, start: "top 88%", once: true });

const presets: Record<RevealName, Preset> = {
  fade: (el, { delay }) => {
    gsap.fromTo(
      el,
      { opacity: 0 },
      { opacity: 1, delay, duration: duration.reveal, scrollTrigger: onEnter(el) },
    );
  },

  "fade-up": (el, { delay }) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: remToPx(distance.md), filter: `blur(${blur.reveal})` },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        delay,
        ease: "iq.out-expo",
        clearProps: "filter",
        scrollTrigger: onEnter(el),
      },
    );
  },

  words: (el, { delay }) => splitReveal(el, "words", delay),
  chars: (el, { delay }) => splitReveal(el, "chars", delay),

  stagger: (el, { delay }) => {
    gsap.set(el, { opacity: 1 });
    gsap.fromTo(
      el.children,
      { opacity: 0, y: remToPx(distance.md) },
      { opacity: 1, y: 0, delay, stagger: stagger.items, ease: "iq.out-expo", scrollTrigger: onEnter(el) },
    );
    drawThreads(el, delay);
  },

  media: (el, { delay }) => {
    gsap.fromTo(
      el,
      { opacity: 0, scale: 1.08 },
      {
        opacity: 1,
        scale: 1,
        delay,
        duration: duration["reveal-slow"],
        ease: "iq.out",
        scrollTrigger: onEnter(el.parentElement ?? el),
      },
    );
  },

  draw: (el, { delay }) => {
    gsap.set(el, { opacity: 1 });
    // El contenedor puede declarar la opacidad de reposo (`data-draw-rest`). El trazo se ve
    // completo mientras se dibuja y, al terminar, baja a ese valor. Sin JS queda el CSS.
    const host = el.parentElement instanceof HTMLElement ? el.parentElement : null;
    const rest = host ? Number(host.dataset.drawRest) : Number.NaN;
    const settle = host != null && Number.isFinite(rest) && rest >= 0 && rest < 1;
    const tl = gsap.timeline({
      delay,
      scrollTrigger: onEnter(el),
      onStart: () => {
        if (settle) gsap.set(host, { opacity: 1 });
      },
      onComplete: () => {
        if (settle) gsap.to(host, { opacity: rest, duration: duration.slow, ease: "iq.out" });
      },
    });
    tl.fromTo(
      el.querySelectorAll("[data-draw-line]"),
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: duration["reveal-slow"] * 1.8, stagger: 0.15, ease: "iq.in-out" },
    ).fromTo(
      el.querySelectorAll("[data-draw-node]"),
      { scale: 0, transformOrigin: "50% 50%" },
      { scale: 1, duration: duration.slow, stagger: stagger.items, ease: "iq.out-expo" },
      "-=1",
    );
  },
};

/**
 * Hilos cortos de una lista (`.thread-mark` con `data-thread`): se trazan detrás de su fila y, al
 * terminar cada uno, sueltan el eco que define el CSS. Un tween por hilo para escalonar el eco.
 */
function drawThreads(list: HTMLElement, delay: number) {
  const threads = gsap.utils.toArray<HTMLElement>("[data-thread]", list);
  threads.forEach((thread, i) => {
    gsap.fromTo(
      thread,
      { scaleX: 0 },
      {
        scaleX: 1,
        delay: delay + 0.18 + i * stagger.items,
        duration: duration.slow,
        ease: "iq.out-expo",
        scrollTrigger: onEnter(list),
        // clearProps deja el transform libre: el eco en hover es CSS y no pelea con estilos inline.
        clearProps: "transform",
        // El eco es CSS: se dispara con el atributo y este se retira al terminar, para que el
        // hover pueda volver a sonarlo (una animación idéntica ya aplicada no se reinicia sola).
        onComplete: () => {
          thread.dataset.thread = "eco";
          thread.addEventListener(
            "animationend",
            () => {
              thread.dataset.thread = "";
            },
            { once: true },
          );
        },
      },
    );
  });
}

function splitReveal(el: HTMLElement, type: "words" | "chars", delay: number) {
  const isHeading = /^H[1-6]$/.test(el.tagName);
  const isHidden = el.getAttribute("aria-hidden") === "true";
  if (!isHeading && !isHidden) {
    // aria-label no es válido en roles genéricos: usar <RevealText> o un heading.
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[motion] data-reveal="${type}" requiere h1–h6 o aria-hidden; se usa fade-up.`, el);
    }
    presets["fade-up"](el, { delay });
    return;
  }

  const split = SplitText.create(el, {
    type,
    mask: type,
    // Heading: aria-label en el contenedor + fragmentos ocultos. Capa aria-hidden: no tocar ARIA.
    aria: isHeading ? "auto" : "none",
  });
  // Las máscaras recortan tildes y la tilde de la Ñ en mayúsculas (line-height < 1): se amplía la
  // zona de recorte con padding compensado por margen negativo (el layout no cambia).
  gsap.set(split.masks, {
    paddingTop: "0.22em",
    paddingBottom: "0.12em",
    marginTop: "-0.22em",
    marginBottom: "-0.12em",
  });
  gsap.set(el, { opacity: 1 });
  gsap.from(type === "words" ? split.words : split.chars, {
    yPercent: 115,
    delay,
    stagger: type === "words" ? stagger.words : stagger.words * 1.5,
    ease: "iq.out-expo",
    duration: duration.reveal,
    scrollTrigger: onEnter(el),
    // Al terminar se restaura el DOM original: texto continuo, sin máscaras ni spans.
    onComplete: () => split.revert(),
  });
}

export function applyReveal(el: HTMLElement) {
  const name = (el.dataset.reveal || "fade-up") as RevealName;
  const preset = presets[name] ?? presets["fade-up"];
  preset(el, { delay: Number(el.dataset.revealDelay ?? 0) });
}
