import type { Metadata } from "next";
import { CurriculumOverview } from "@/components/curriculum-overview";
import { SiteShell } from "@/components/layout/site-shell";
import { resolvePublicAccountCta } from "@/modules/authorization/account-link";
import { listCurriculumWeeks } from "@/modules/curriculum";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Programa abierto",
  description:
    "Ruta gratuita de doce semanas para aprender desarrollo web desde cero, con práctica diaria, proyectos verificables y acompañamiento en cohorte.",
};

export default async function CurriculoPage() {
  const { accountHref, accountLabel } = await resolvePublicAccountCta();
  const weeks = listCurriculumWeeks({ locale: "es-MX" });

  return (
    <SiteShell page="curriculo" platformHref={accountHref} platformLabel={accountLabel}>
      <main id="contenido" tabIndex={-1} className="outline-none pt-header">
        <CurriculumOverview weeks={weeks} accountHref={accountHref} />
      </main>
    </SiteShell>
  );
}
