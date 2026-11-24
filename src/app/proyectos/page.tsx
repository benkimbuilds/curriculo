import type { Metadata } from "next";

import { GalleryProjectsSection } from "@/components/gallery/gallery-projects-section";
import {
  filterGalleryEntries,
  mapGalleryEntriesToCards,
} from "@/components/gallery/gallery-shared";
import { SiteShell } from "@/components/layout/site-shell";
import { resolvePublicAccountCta } from "@/modules/authorization/account-link";
import { listPublicGalleryProjects } from "@/modules/community/db-community";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Muestras públicas de proyectos construidos en Academia Iquiti: comercio local, servicios de barrio e IA accesible en CDMX.",
};

export default async function PublicProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ buscar?: string }>;
}) {
  const [{ accountHref, accountLabel }, { entries }, query] = await Promise.all([
    resolvePublicAccountCta(),
    listPublicGalleryProjects(),
    searchParams,
  ]);
  const projects = mapGalleryEntriesToCards(filterGalleryEntries(entries, query));

  return (
    <SiteShell page="proyectos" platformHref={accountHref} platformLabel={accountLabel}>
      <main id="contenido" tabIndex={-1} className="outline-none pt-header">
        <section data-surface="white">
          <div className="app-content app-content--wide">
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
