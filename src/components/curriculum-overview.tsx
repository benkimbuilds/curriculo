import Link from "next/link";
import type { CurriculumDocument } from "@/modules/curriculum/schema";
import { Container, Section, SectionHeader } from "@/components/ui/section";

export function CurriculumOverview({
  weeks,
  accountHref,
}: {
  weeks: CurriculumDocument[];
  accountHref: string;
}) {
  return (
    <Section id="plan-estudios" surface="light" labelledBy="plan-estudios-title">
      <Container>
        <SectionHeader
          label="Programa abierto"
          title="Aprender desarrollo web construyendo proyectos."
          titleId="plan-estudios-title"
          lead="Una ruta gratuita de doce semanas para aprender desde cero, con práctica diaria, proyectos verificables y acompañamiento cuando estudias en cohorte."
        />

        <dl className="mt-12 grid border-y border-line sm:grid-cols-2 lg:grid-cols-4" data-reveal="stagger">
          {[
            ["Duración", "12 semanas"],
            ["Dedicación", "20–40 horas por semana"],
            ["Modalidad", "Autodidacta o con cohorte"],
            ["Acceso", "Abierto y gratuito"],
          ].map(([label, value]) => (
            <div key={label} className="border-b border-line py-6 sm:px-5 lg:border-b-0 lg:border-r lg:first:pl-0 lg:last:border-r-0">
              <dt className="type-meta text-fg-subtle">{label}</dt>
              <dd className="type-heading mt-3">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 border-t border-line" role="list" aria-label="Semanas del programa">
          {weeks.map((week) => (
            <article key={week.id} className="grid gap-4 border-b border-line py-7 md:grid-cols-[4rem_1fr_1fr] md:items-center md:gap-8" role="listitem">
              <span className="type-meta tabular-nums text-accent">{String(week.week).padStart(2, "0")}</span>
              <div>
                <h3 className="type-heading">{week.title}</h3>
                <p className="type-body mt-2 max-w-reading text-fg-muted">{week.summary}</p>
              </div>
              <p className="type-small md:justify-self-end md:text-right"><span className="type-meta block text-fg-subtle">Proyecto</span><span className="mt-1 block">{week.project.title}</span></p>
            </article>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-body max-w-reading text-fg-muted">Estudia a tu ritmo y consulta también la biblioteca de Fundamentos y Full Stack JavaScript adaptados al español.</p>
          <Link href={accountHref} className="inline-flex min-h-target shrink-0 items-center justify-center bg-action px-6 py-3 type-label text-action-fg transition-colors hover:bg-action-hover hover:text-action-hover-fg">Comenzar el programa</Link>
        </div>
      </Container>
    </Section>
  );
}
