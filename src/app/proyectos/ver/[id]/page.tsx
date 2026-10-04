import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { hasLearningEnrollment } from "@/app/programa/student-data";
import { GalleryProjectDetailView } from "@/components/gallery/gallery-project-detail";
import { SiteShell } from "@/components/layout/site-shell";
import { platformCta } from "@/components/layout/platform-cta";
import { getCurrentSession } from "@/modules/auth/session";
import { getRoleHomeDestination } from "@/modules/authorization/navigation";
import { loadAuthorizationContext } from "@/modules/authorization/service";
import {
  getPublicGalleryProject,
  resolveDefaultOrganizationId,
} from "@/modules/community/db-community";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proyecto",
  description: "Muestra pública de un proyecto del programa Academia Iquiti.",
};

export default async function PublicProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getCurrentSession();
  const accountLink = session
    ? getRoleHomeDestination(
        (await loadAuthorizationContext(session.user.id, await resolveDefaultOrganizationId()))
          .organizationRoles,
        await hasLearningEnrollment(session.user.id),
      )
    : undefined;
  const accountHref = accountLink?.href ?? platformCta.href;
  const accountLabel = accountLink?.label ?? platformCta.shortLabel;

  const { id } = await params;
  const { project } = await getPublicGalleryProject(id);
  if (!project) notFound();

  return (
    <SiteShell page="proyectos" platformHref={accountHref} platformLabel={accountLabel}>
      <main id="contenido" tabIndex={-1} className="outline-none pt-header">
        <section data-surface="white">
          <div className="app-content app-content--narrow">
            <GalleryProjectDetailView
              backHref="/proyectos"
              backLabel="Volver a proyectos"
              project={project}
              surface="public"
            />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
