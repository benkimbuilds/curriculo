import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { tokens } from "@/lib/tokens";

let registered = false;

/**
 * Registro único de plugins y easings del sistema. Los easings de los tokens se exponen en GSAP como
 * "iq.standard", "iq.out", "iq.out-expo", "iq.in-out": CSS y JS usan exactamente la misma curva.
 * `useGSAP` queda registrado para animaciones de componente (fase 3), siempre con `scope`.
 */
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, CustomEase, DrawSVGPlugin);
  for (const [name, curve] of Object.entries(tokens.ease)) {
    CustomEase.create(`iq.${name}`, curve.join(","));
  }
  gsap.defaults({ ease: "iq.out", duration: tokens.duration.reveal });
  registered = true;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
