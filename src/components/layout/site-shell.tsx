import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { platformCta } from "@/components/layout/platform-cta";
import { MotionRoot } from "@/components/motion/motion-root";

/**
 * Chrome compartido del sitio público (header + footer + tokens iquiti).
 * Todas las páginas de marketing deben usar este wrapper para que el SiteHeader
 * conserve contraste y el CTA (Dashboard / Acceder) mantenga texto blanco.
 */
export function SiteShell({
  children,
  platformHref = platformCta.href,
  platformLabel = platformCta.shortLabel,
  page,
}: {
  children: ReactNode;
  platformHref?: string;
  platformLabel?: string;
  page?: "home" | "curriculo" | "proyectos";
}) {
  const pageAttr =
    page === "home"
      ? { "data-iquiti-home": true }
      : page === "curriculo"
        ? { "data-iquiti-curriculo": true }
        : page === "proyectos"
          ? { "data-iquiti-proyectos": true }
          : undefined;

  return (
    <div
      className="min-h-svh bg-bg text-fg"
      data-iquiti-site
      data-surface="white"
      {...pageAttr}
    >
      <SkipLink />
      <SiteHeader platformHref={platformHref} platformLabel={platformLabel} />
      {children}
      <SiteFooter platformHref={platformHref} />
      <MotionRoot />
    </div>
  );
}
