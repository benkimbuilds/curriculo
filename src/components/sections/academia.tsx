import { Logo } from "@/components/brand/logo";
import { platformCta } from "@/components/layout/platform-cta";
import { LetterSwap } from "@/components/motion/letter-swap";
import { ButtonLink } from "@/components/ui/button";
import { Meta } from "@/components/ui/meta";
import { Container, Section } from "@/components/ui/section";
import { academia } from "@/content/home";

/**
 * Academia de Tecnología y acceso a su plataforma. El bloque de acceso es la única superficie
 * verde de la página (efecto Von Restorff): la acción principal se distingue sin competir.
 */
export function Academia({ platformHref = platformCta.href }: { platformHref?: string }) {
  return (
    <Section id="academia" surface="white" labelledBy="academia-title" className="overflow-hidden py-14 lg:py-20">
      {/* eager: al entrar por #academia esta marca de agua queda en el primer viewport y es el LCP.
          Son 3 KB de SVG, así que adelantarla no compite con el contenido real. */}
      <Logo
        name="academia-graphic"
        alt=""
        eager
        className="pointer-events-none absolute top-24 -left-[20%] -z-10 w-[min(90vw,44rem)] opacity-[0.03] lg:left-[-6%]"
      />
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="academia-title" className="sr-only">
            {academia.label}
          </h2>
          <div className="w-[min(100%,18rem)]" data-reveal="fade">
            <Logo name="academia-tagline" alt="Iquiti, Academia de Tecnología" />
          </div>
          <p className="type-body max-w-[42ch] text-fg-muted lg:text-right" data-reveal="fade-up">
            {academia.lead}
          </p>
        </div>

        <ul className="mt-8 grid border-t border-l border-line md:grid-cols-3" data-reveal="stagger">
          {academia.features.map((f) => (
            <li
              key={f.title}
              className="cell-sweep thread-row row-drift group border-r border-b border-line px-5 py-5 md:px-6"
            >
              <span aria-hidden="true" data-thread="" className="thread-mark" />
              <h3 className="type-heading mt-4">{f.title}</h3>
              <p className="type-body mt-2 text-fg-muted transition-colors duration-(--iq-duration-base) ease-standard group-hover:text-fg">
                {f.body}
              </p>
            </li>
          ))}
        </ul>

        {/* Acceso a la plataforma */}
        <div
          id="plataforma"
          data-surface="accent"
          className="dot-texture mt-10 grid gap-8 bg-bg p-6 text-fg sm:p-10 lg:mt-14 lg:grid-cols-12 lg:items-end lg:gap-8 lg:p-14"
          data-reveal="fade-up"
        >
          <div className="lg:col-span-8">
            <Meta tone="muted">{academia.platform.label}</Meta>
            {/* Giro 3D por letra sobre el borde inferior; el orden nace en el centro del texto. */}
            <LetterSwap
              as="h3"
              text={academia.platform.title}
              direction="bottom"
              from="center"
              trigger="hover"
              stagger={22}
              className="type-title mt-6 block max-w-[16ch]"
            />
            <p className="type-lead mt-6 max-w-[44ch] text-fg-muted">{academia.platform.body}</p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            {/* Destino único (platformCta): con plataforma configurada sale a ella; sin ella, a la
                sección. Nunca un enlace roto. */}
            <ButtonLink href={platformHref} className="w-full sm:w-auto">
              {academia.platform.cta}
            </ButtonLink>
          </div>
        </div>

        <p
          className="type-meta mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-fg-subtle lg:mt-12"
          data-reveal="fade"
        >
          {academia.verbs.map((verb, i) => (
            <span key={verb} className="flex items-center gap-4">
              {i > 0 && <span aria-hidden="true">/</span>}
              <LetterSwap as="span" text={verb} direction="left" trigger="hover" stagger={28} />
            </span>
          ))}
        </p>
      </Container>
    </Section>
  );
}
