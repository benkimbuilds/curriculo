import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GalleryProjectDetailView } from "@/components/gallery/gallery-project-detail";
import { SiteShell } from "@/components/layout/site-shell";
import { resolvePublicAccountCta } from "@/modules/authorization/account-link";
import { getPublicGalleryProject } from "@/modules/community/db-community";

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
  const { id } = await params;
  const [{ accountHref, accountLabel }, { project }] = await Promise.all([
    resolvePublicAccountCta(),
    getPublicGalleryProject(id),
  ]);
  if (!project) notFound();

  return (
    <SiteShell page="proyectos" platformHref={accountHref} platformLabel={accountLabel}>
      <main id="contenido" tabIndex={-1} className="outline-none pt-header">
        <section data-surface="white">
          <div className="app-content app-content--wide">
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
