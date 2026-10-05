import { notFound, redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { GalleryProjectDetailView } from "@/components/gallery/gallery-project-detail";
import { getCurrentSession } from "@/modules/auth/session";
import { getGalleryProjectForViewer } from "@/modules/community/db-community";

import { GalleryActionToasts } from "./gallery-action-toasts";

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    retroalimentacion?: string;
    reportado?: string;
    estrella?: string;
    comentario?: string;
  }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const { enabled, project } = await getGalleryProjectForViewer(session.user.id, id);
  if (!enabled) redirect("/galeria");
  if (!project) notFound();

  const isOwner = project.ownerId === session.user.id;
  const hasReviewed = project.feedback.some(({ authorId }) => authorId === session.user.id);

  return (
    <AppShell userName={session.user.name}>
      <div className="app-content">
        <GalleryActionToasts
          commentError={query.comentario === "error"}
          commentPosted={query.comentario === "1"}
          commentRemoved={query.comentario === "eliminado"}
          feedbackSubmitted={Boolean(query.retroalimentacion)}
          ownStarBlocked={query.estrella === "propia"}
          projectId={project.id}
          reported={Boolean(query.reportado)}
          starred={query.estrella === "1"}
        />
        <GalleryProjectDetailView
          backHref="/galeria"
          backLabel="Volver a la comunidad"
          hasReviewed={hasReviewed}
          isOwner={isOwner}
          project={project}
          surface="community"
        />
      </div>
    </AppShell>
  );
}
