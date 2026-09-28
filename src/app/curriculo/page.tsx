import type { Metadata } from "next";
import { CurriculumOverview } from "@/components/curriculum-overview";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { platformCta } from "@/components/layout/platform-cta";
import { MotionRoot } from "@/components/motion/motion-root";
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
    <div data-iquiti-curriculo>
      <SkipLink />
      <SiteHeader platformHref={accountHref} platformLabel={accountLabel} />
      <main id="contenido" tabIndex={-1} className="outline-none pt-header">
        <CurriculumOverview weeks={weeks} accountHref={accountHref} />
      </main>
      <SiteFooter platformHref={accountHref} />
      <MotionRoot />
    </div>
  );
}
