import { Container, Section, SectionHeader } from "@/components/ui/section";
import { intro } from "@/content/home";

/**
 * Concepto (superficie de marca). Agrupa en tres (Miller / chunking): aprender, construir, conectar.
 * No se monta en la página: se conserva para una versión posterior del deck de presentación.
 */
export function Intro() {
  return (
    <Section id="concepto" surface="brand" labelledBy="concepto-title">
      <div aria-hidden="true" className="grid-dots absolute inset-0 -z-10" />
      <Container>
        <SectionHeader label={intro.label} title={intro.title} titleId="concepto-title" />

        <p className="type-statement mt-14 max-w-[34ch] lg:mt-20 lg:ml-[25%]" data-reveal="fade-up">
          {intro.statement}
        </p>

        <ol className="mt-16 border-t border-line lg:mt-24" data-reveal="stagger">
          {intro.principles.map((p) => (
            <li
              key={p.word}
              className="grid gap-3 border-b border-line py-8 md:grid-cols-12 md:items-baseline md:gap-8 md:py-10"
            >
              <span aria-hidden="true" className="type-meta tabular-nums text-accent md:col-span-3">
                {p.index}
              </span>
              <h3 className="type-title md:col-span-5">{p.word}</h3>
              <p className="type-body max-w-[36ch] text-fg-muted md:col-span-4">{p.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
