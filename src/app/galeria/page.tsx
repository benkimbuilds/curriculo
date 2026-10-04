import { redirect } from "next/navigation";

import { projectCountLabel } from "@/components/community/review-labels";
import { AppShell } from "@/components/app-shell";
import { Compass, Grid, Shield } from "@/components/icons";
import { ProjectCard, type ProjectCardData } from "@/components/project-card";
import { getCurrentSession } from "@/modules/auth/session";
import { listGalleryForViewer } from "@/modules/community/db-community";

import { GalleryActionToasts } from "./[id]/gallery-action-toasts";

const accents: ProjectCardData["accent"][] = ["yellow", "clay", "blue", "green", "violet"];

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
  const search = query.buscar?.trim().toLocaleLowerCase("es-MX") ?? "";
  const week = Number(query.semana);
  const filtered = entries.filter(
    (entry) =>
      (!search ||
        entry.title.toLocaleLowerCase("es-MX").includes(search) ||
        entry.author.toLocaleLowerCase("es-MX").includes(search)) &&
      (!Number.isInteger(week) || week < 1 || entry.week === week),
  );
  const projects: ProjectCardData[] = filtered.map((entry, index) => ({
    id: entry.id,
    title: entry.title,
    author: entry.author,
    authorBio: entry.authorBio,
    week: entry.week,
    description: entry.description,
    accent: accents[index % accents.length],
    initialsColor: accents[(index + 2) % accents.length],
    tag: entry.technology,
    visibility: entry.visibility,
    starCount: entry.starCount,
    commentCount: entry.commentCount,
    viewerHasStarred: entry.viewerHasStarred,
  }));
  const uniqueAuthors = new Set(projects.map((project) => project.author)).size;
  const totalStars = projects.reduce((sum, project) => sum + project.starCount, 0);

  return (
    <AppShell userName={session.user.name}>
      <div className="app-content community-page">
        <GalleryActionToasts
          listOnly
          ownStarBlocked={query.estrella === "propia"}
          starred={query.estrella === "1"}
        />
        <header className="community-hero">
          <div className="community-hero__copy">
            <p className="eyebrow">Comunidad</p>
            <h1>Proyectos de la comunidad</h1>
            <p className="community-hero__lede">
              Descubre lo que otras personas están construyendo, destaca lo que te inspire y deja un comentario.
            </p>
            <p className="community-hero__safety">
              <Shield /> Comunidad verificada · Sin datos personales ni formas de contacto
            </p>
          </div>
          <dl className="community-stats">
            <div>
              <dt>Proyectos</dt>
              <dd>{projects.length}</dd>
            </div>
            <div>
              <dt>Personas</dt>
              <dd>{uniqueAuthors}</dd>
            </div>
            <div>
              <dt>Estrellas</dt>
              <dd>{totalStars}</dd>
            </div>
          </dl>
        </header>

        {!enabled ? (
          <section className="community-empty">
            <Grid />
            <h2>La galería todavía no está habilitada</h2>
            <p>
              El equipo la activará cuando la operación de moderación esté lista. Tus entregas y tu avance continúan
              disponibles.
            </p>
          </section>
        ) : (
          <>
            <form className="community-filters" method="get">
              <label>
                <span className="sr-only">Buscar proyectos</span>
                <input
                  defaultValue={query.buscar}
                  name="buscar"
                  placeholder="Buscar por proyecto o persona…"
                  type="search"
                />
              </label>
              <select aria-label="Filtrar por semana" defaultValue={query.semana ?? "todas"} name="semana">
                <option value="todas">Todas las semanas</option>
                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    Semana {index + 1}
                  </option>
                ))}
              </select>
              <button className="button button--ghost" type="submit">
                Filtrar
              </button>
              <p className="community-filters__summary">
                <Grid /> Mostrando {projectCountLabel(projects.length)}
              </p>
            </form>

            {projects.length ? (
              <div className="gallery-grid">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <section className="community-empty">
                <Compass />
                <h2>Aún no hay proyectos publicados</h2>
                <p>Cuando alguien comparta una entrega aprobada, aparecerá aquí para que la comunidad la vea.</p>
              </section>
            )}
          </>
        )}

        <div className="gallery-end">
          <Compass />
          <strong>Compartir también es aprender</strong>
          <p>Cada proyecto visible corresponde a una entrega aprobada y una decisión explícita de publicación.</p>
        </div>
      </div>
    </AppShell>
  );
}
