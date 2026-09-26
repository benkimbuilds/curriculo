import type { ReactNode } from "react";
import { Logo } from "@/components/brand/logo";
import { NodeGraphic } from "@/components/brand/node-graphic";
import { ArrowUpRight } from "@/components/ui/icons";
import { site } from "@/config/site";
import { hero } from "@/content/home";
import { cn } from "@/lib/cn";
import { navItems } from "@/lib/nav";
import { platformCta } from "./platform-cta";

/** Etiqueta de columna: acento de la superficie, en la escala corta de la referencia. */
const label = "type-meta text-accent";
/**
 * Enlace de texto. El subrayado nace en los extremos y se une al centro.
 * El alto de 44 px se solapa (`-my-2.5`) para que la lista se lea compacta.
 */
const link =
  "link-weave -my-2.5 inline-flex min-h-target items-center text-fg transition-colors duration-(--iq-duration-fast) hover:text-fg";

type Channel = { label: string; href: string | null };

function FooterLink({
  href,
  children,
  className,
  external,
  newTab,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  /**
   * Abre en otra pestaña. Lleva flecha y aviso para lector: salir de la página nunca debe
   * sorprender. Reservado a destinos ajenos al sitio; el acceso a la plataforma se queda en
   * la misma pestaña (PRD F02).
   */
  newTab?: boolean;
}) {
  return (
    <a
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : external ? "noopener" : undefined}
      className={cn(link, className)}
    >
      <span>{children}</span>
      {newTab && (
        <>
          <ArrowUpRight className="ml-1.5 size-3.5 shrink-0" />
          <span className="sr-only">(abre en otra pestaña)</span>
        </>
      )}
    </a>
  );
}

/**
 * Cierre compacto en cuatro columnas: marca, índice, conexión y ubicación a la derecha.
 * Debajo, una firma de una línea. La navegación se repite al final (efecto de posición serial).
 */
export function SiteFooter({ platformHref = platformCta.href }: { platformHref?: string }) {
  const year = new Date().getFullYear();
  const { location, contact } = site;

  // Instagram y Facebook se muestran siempre en vista previa; en producción solo con URL real.
  const channels = (
    [
      { label: "Instagram", href: contact.instagram },
      { label: "Facebook", href: contact.facebook },
      contact.email && { label: "Correo", href: `mailto:${contact.email}` },
    ].filter(Boolean) as Channel[]
  ).filter((c) => c.href || site.showDrafts);

  return (
    <footer data-surface="light" className="relative isolate overflow-hidden bg-bg text-fg">
      <div aria-hidden="true" className="h-1.5 bg-accent" />

      <div
        aria-hidden="true"
        data-draw-rest="0.3"
        className="pointer-events-none absolute top-0 left-1/2 -z-10 hidden w-[min(120vw,64rem)] -translate-x-[42%] text-neutral-400 opacity-30 md:block"
      >
        <NodeGraphic strokeWidth={1.5} className="w-full [&_circle]:opacity-[0.12]" />
      </div>

      <div className="mx-auto w-full max-w-content px-gutter">
        <div
          className="grid gap-x-8 gap-y-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:items-start lg:gap-x-12 lg:py-14"
          data-reveal="stagger"
        >
          <div>
            {/* eager: mismo archivo que el header, ya está en caché; además evita que Next
                registre este wordmark como «lazy» y avise de un LCP que no es este. */}
            <Logo name="wordmark" alt={site.shortName} eager className="w-[4.75rem]" />
            <p className="type-small mt-4 max-w-[24ch] text-pretty text-fg-muted">{hero.lead}</p>
          </div>

          <nav aria-labelledby="footer-index">
            <h2 id="footer-index" className={label}>
              Índice
            </h2>
            <ul className="type-small mt-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
              <li>
                <FooterLink href={platformHref} external={platformCta.external}>
                  {platformCta.label}
                </FooterLink>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className={label}>Conexión</h2>
            <ul className="type-small mt-3">
              {channels.map(({ label: name, href }) => (
                <li key={name}>
                  {href ? (
                    <FooterLink href={href} external>
                      {name}
                    </FooterLink>
                  ) : (
                    <span className="-my-2.5 inline-flex min-h-target items-center text-fg-subtle">
                      {name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:text-right">
            <h2 className={label}>Ubicación</h2>
            <address className="type-small mt-3 space-y-0.5 text-fg not-italic">
              <p>{location.venue}</p>
              <p>{location.street}</p>
              <p>
                {location.neighborhood}, {location.locality}
              </p>
              <p>{location.region}</p>
            </address>
            <FooterLink href={location.mapsUrl} external newTab>
              Ver mapa
            </FooterLink>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-line py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-meta text-fg-subtle normal-case tracking-normal">
            © {year}. Iquiti. Centro de Innovación y Academia de Tecnología.
          </p>
          <p className="type-meta text-fg-subtle sm:text-right">{site.coordinate}</p>
        </div>
      </div>
    </footer>
  );
}
