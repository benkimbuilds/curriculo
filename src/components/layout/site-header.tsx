import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { site } from "@/config/site";
import { navItems } from "@/lib/nav";
import { HeaderSurfaceSync } from "./header-surface-sync";
import { MobileMenu } from "./mobile-menu";
import { platformCta } from "./platform-cta";

/**
 * Header fijo y translúcido. Adopta la superficie de la sección que tiene debajo (HeaderSurfaceSync);
 * arranca en blanco porque el hero es blanco.
 * Convención (Ley de Jakob): marca a la izquierda → inicio; navegación al centro; acción a la derecha.
 */
export function SiteHeader({ platformHref = platformCta.href }: { platformHref?: string }) {
  return (
    <header
      id="site-header"
      data-surface="white"
      className="header-glass fixed inset-x-0 top-0 z-(--iq-z-header) border-b border-line"
    >
      <HeaderSurfaceSync headerId="site-header" />
      <div className="mx-auto grid h-header w-full max-w-content grid-cols-[1fr_auto] items-center gap-6 px-gutter md:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="-m-2 inline-flex min-h-target items-center p-2"
            aria-label={`${site.shortName}, ir al inicio`}
          >
            <Logo name="wordmark" alt="" eager className="w-[4.25rem]" />
          </Link>
        </div>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center">
            {navItems.map((item, i) => (
              <li key={item.href} className="flex items-center">
                {i > 0 && (
                  <span aria-hidden="true" className="type-meta px-1 text-fg-subtle/60 lg:px-2">
                    /
                  </span>
                )}
                <a
                  href={item.href}
                  className="link-weave type-label inline-flex min-h-target items-center px-2 text-fg-muted transition-colors duration-(--iq-duration-fast) hover:text-fg"
                >
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-end gap-2">
          <ButtonLink href={platformHref} size="sm" className="hidden sm:inline-flex">
            {platformCta.shortLabel}
          </ButtonLink>
          <MobileMenu items={navItems} cta={{ ...platformCta, href: platformHref }} />
        </div>
      </div>
    </header>
  );
}
