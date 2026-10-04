import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { GalleryProjectsSection } from "@/components/gallery/gallery-projects-section";
import {
  filterGalleryEntries,
  mapGalleryEntriesToCards,
} from "@/components/gallery/gallery-shared";
import { getCurrentSession } from "@/modules/auth/session";
import { listGalleryForViewer } from "@/modules/community/db-community";

import { GalleryActionToasts } from "./[id]/gallery-action-toasts";

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ buscar?: string; semana?: string; estrella?: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  const [{ enabled, entries }, query] = await Promise.all([
    listGalleryForViewer(session.user.id),
    searchParams,
  ]);
  const projects = mapGalleryEntriesToCards(filterGalleryEntries(entries, query));

  return (
    <AppShell userName={session.user.name}>
      <div className="app-content">
        <GalleryActionToasts
          listOnly
          ownStarBlocked={query.estrella === "propia"}
          starred={query.estrella === "1"}
        />
        <GalleryProjectsSection
          disabled={{
            title: "La galería todavía no está habilitada",
            body: "El equipo la activará cuando la operación de moderación esté lista. Tus entregas y tu avance continúan disponibles.",
          }}
          empty={{
            title: "Aún no hay proyectos publicados",
            body: "Cuando alguien comparta una entrega aprobada, aparecerá aquí para que la comunidad la vea.",
          }}
          enabled={enabled}
          hero={{
            eyebrow: "Comunidad",
            title: "Proyectos de la comunidad",
            lede: "Descubre lo que otras personas están construyendo, destaca lo que te inspire y deja un comentario.",
            safety: "Comunidad verificada · Sin datos personales ni formas de contacto",
          }}
          projects={projects}
          query={query}
          surface="community"
        />
      </div>
    </AppShell>
  );
}
