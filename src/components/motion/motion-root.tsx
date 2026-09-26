"use client";

import { useEffect } from "react";
import { MOTION_BOOT_TIMEOUT } from "@/lib/motion/boot";

declare global {
  interface Window {
    __iqMotion?: boolean;
  }
}

/**
 * Orquestador único de motion (isla cliente mínima). Las secciones siguen siendo Server Components
 * y solo declaran `data-reveal`. GSAP se descarga después de hidratar; si no llega a tiempo, el
 * contenido se muestra sin animación (fail-open).
 */
export function MotionRoot() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.motion !== "on") return; // reducido, sin soporte o el fail-open ya actuó
    window.__iqMotion = true; // este componente toma el control del fail-open del arranque

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
