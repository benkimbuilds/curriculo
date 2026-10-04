import type { Metadata } from "next";
import { CurriculumOverview } from "@/components/curriculum-overview";
import { SiteShell } from "@/components/layout/site-shell";
import { platformCta } from "@/components/layout/platform-cta";
import { getCurrentSession } from "@/modules/auth/session";
import { getRoleHomeDestination } from "@/modules/authorization/navigation";
import { loadAuthorizationContext } from "@/modules/authorization/service";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";
import { hasLearningEnrollment } from "@/app/programa/student-data";
import { listCurriculumWeeks } from "@/modules/curriculum";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Programa abierto",
  description:
    "Ruta gratuita de doce semanas para aprender desarrollo web desde cero, con práctica diaria, proyectos verificables y acompañamiento en cohorte.",
};

export default async function CurriculoPage() {
  const session = await getCurrentSession();
  const accountLink = session
    ? getRoleHomeDestination(
        (await loadAuthorizationContext(session.user.id, await resolveDefaultOrganizationId())).organizationRoles,
        await hasLearningEnrollment(session.user.id),
      )
    : undefined;
  const accountHref = accountLink?.href ?? platformCta.href;
  const accountLabel = accountLink?.label ?? platformCta.shortLabel;
  const weeks = listCurriculumWeeks({ locale: "es-MX" });

  return (
    <SiteShell page="curriculo" platformHref={accountHref} platformLabel={accountLabel}>
      <main id="contenido" tabIndex={-1} className="outline-none pt-header">
        <CurriculumOverview weeks={weeks} accountHref={accountHref} />
      </main>
    </SiteShell>
  );
}
