import type { Metadata } from "next";

import { hasLearningEnrollment } from "@/app/programa/student-data";
import { GalleryProjectsSection } from "@/components/gallery/gallery-projects-section";
import {
  filterGalleryEntries,
  mapGalleryEntriesToCards,
} from "@/components/gallery/gallery-shared";
import { SiteShell } from "@/components/layout/site-shell";
import { platformCta } from "@/components/layout/platform-cta";
import { getCurrentSession } from "@/modules/auth/session";
import { getRoleHomeDestination } from "@/modules/authorization/navigation";
import { loadAuthorizationContext } from "@/modules/authorization/service";
import {
  listPublicGalleryProjects,
  resolveDefaultOrganizationId,
} from "@/modules/community/db-community";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Muestras públicas de proyectos construidos en Academia Iquiti: comercio local, servicios de barrio e IA accesible en CDMX.",
};

export default async function PublicProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ buscar?: string; semana?: string }>;
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

  const [{ entries }, query] = await Promise.all([listPublicGalleryProjects(), searchParams]);
  const projects = mapGalleryEntriesToCards(filterGalleryEntries(entries, query));

  return (
    <SiteShell page="proyectos" platformHref={accountHref} platformLabel={accountLabel}>
      <main id="contenido" tabIndex={-1} className="outline-none pt-header">
        <section data-surface="white">
          <div className="app-content">
            <GalleryProjectsSection
              empty={{
                title: "Pronto verás proyectos aquí",
                body: "Estamos preparando muestras públicas del programa. Mientras tanto, explora el currículo abierto.",
              }}
              hero={{
                eyebrow: "Proyectos",
                title: "Lo que se construye en el programa",
                lede: "Explora muestras reales de aprendizaje aplicado: necesidades locales, servicios de barrio y AI útil para la comunidad.",
                safety: "Vista pública · Para comentar y destacar, entra a la comunidad",
              }}
              projects={projects}
              query={query}
              surface="public"
            />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
