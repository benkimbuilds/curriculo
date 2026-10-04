"use client";

import { useEffect } from "react";

/**
 * El header fijo adopta la superficie de la sección que tiene debajo (blanca, morada, clara,
 * oscura…). Así texto, logo, línea y CTA conservan el contraste verificado de cada superficie.
 * Un scroll pasivo con un rAF por cuadro; lee ~9 rectángulos, sin costo apreciable.
 */
export function HeaderSurfaceSync({ headerId }: { headerId: string }) {
  useEffect(() => {
    const header = document.getElementById(headerId);
    if (!header) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = header.getBoundingClientRect();
      const probe = rect.top + rect.height / 2;
      const regions = document.querySelectorAll<HTMLElement>(
        "main section[data-surface], footer[data-surface]",
      );
      for (const region of regions) {
        const r = region.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          const surface = region.dataset.surface;
          if (surface && header.dataset.surface !== surface) header.dataset.surface = surface;
          return;
        }
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [headerId]);

  return null;
}
