"use client";

import { useLayoutEffect } from "react";
import { MOTION_BOOT_TIMEOUT } from "@/lib/motion/boot";

/**
 * Orquestador único de motion (isla cliente mínima). Las secciones siguen siendo Server Components
 * y solo declaran `data-reveal`. Activa motion en el cliente (sin <script> en el layout — React 19
 * no ejecuta scripts inline de componentes). GSAP se descarga después; si no llega a tiempo, el
 * contenido se muestra sin animación (fail-open). Sin JS: nunca se oculta nada.
 */
export function MotionRoot() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        root.dataset.motion = "off";
        return;
      }
    } catch {
      root.dataset.motion = "off";
      return;
    }

    root.dataset.motion = "on";

    let stop: (() => void) | undefined;
    let cancelled = false;
    const failOpen = window.setTimeout(() => {
      if (!stop) root.dataset.motion = "off";
    }, MOTION_BOOT_TIMEOUT);

    import("@/lib/motion/runtime")
      .then(({ startMotion }) => {
        if (cancelled || root.dataset.motion !== "on") return;
        stop = startMotion();
      })
      .catch((error) => {
        root.dataset.motion = "off";
        console.error("[motion] no se pudo cargar:", error);
      });

    return () => {
      cancelled = true;
      window.clearTimeout(failOpen);
      stop?.();
    };
  }, []);

  return null;
}
