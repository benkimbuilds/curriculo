import type { Metadata } from "next";
import { CurriculumOverview } from "@/components/curriculum-overview";
import { SiteShell } from "@/components/layout/site-shell";
import { platformCta } from "@/components/layout/platform-cta";
import { listCurriculumWeeks } from "@/modules/curriculum";

export const metadata: Metadata = {
  title: "Programa abierto",
  description:
    "Ruta gratuita de doce semanas para aprender desarrollo web desde cero, con práctica diaria, proyectos verificables y acompañamiento en cohorte.",
};

export default function CurriculoPage() {
  const weeks = listCurriculumWeeks({ locale: "es-MX" });

  return (
    <SiteShell page="curriculo">
      <main id="contenido" tabIndex={-1} className="outline-none pt-header">
        <CurriculumOverview weeks={weeks} accountHref={platformCta.href} />
      </main>
    </SiteShell>
  );
}
