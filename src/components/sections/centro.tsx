import { ThreadField } from "@/components/brand/thread-field";
import { Meta } from "@/components/ui/meta";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { centro } from "@/content/home";

/**
 * El Centro. Columna izquierda fija (tejido + nota de concepto) + filas de pilares.
 * El título vive solo para lectores de pantalla: en pantalla abre la entradilla.
 */
export function Centro() {
  return (
    <Section id="intro" surface="light" labelledBy="intro-title" className="py-16 lg:py-20">
      <Container>
        <SectionHeader
          label={centro.label}
          title={centro.title}
          titleId="intro-title"
          showTitle={false}
          lead={centro.lead}
        />

        <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5 lg:self-start lg:sticky lg:top-[calc(var(--iq-layout-header-h)+2rem)]">
            {/* Variante vertical del tejido del hero: los hilos convergen en un nodo central. */}
            <div className="relative aspect-[4/3] overflow-hidden" data-reveal="fade-up">
              <ThreadField
                axis="vertical"
                pointer={false}
                spread={0.95}
                spacing={3.5}
                lines={44}
                className="absolute inset-0 size-full"
              />
            </div>
            <div className="mt-10 border-l border-accent pl-6" data-reveal="fade-up">
              <p className="type-body max-w-[48ch] text-fg-muted">{centro.network.body}</p>
              <Meta tone="muted" className="mt-6">
                {centro.origin}
              </Meta>
            </div>
          </div>

          <ol className="border-t border-line lg:col-span-6 lg:col-start-7" data-reveal="stagger">
            {centro.pillars.map((pillar) => (
              <li
                key={pillar.title}
                className="thread-row row-drift grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-6 md:py-7"
              >
                {/* Marca de pilar: un hilo corto alineado con la primera línea del título. */}
                <span
                  aria-hidden="true"
                  data-thread=""
                  className="thread-mark mt-[calc(var(--iq-type-heading-size)*0.55)]"
                />
                <div>
                  <h3 className="type-heading">{pillar.title}</h3>
                  <p className="type-body mt-3 max-w-[46ch] text-fg-muted">{pillar.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
