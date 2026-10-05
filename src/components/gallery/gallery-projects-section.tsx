import { projectCountLabel } from "@/components/community/review-labels";
import { Compass, Grid, Shield } from "@/components/icons";
import { ProjectCard } from "@/components/project-card";
import type { GallerySurface, ProjectCardData } from "./gallery-shared";

export function GalleryProjectsSection({
  surface,
  enabled = true,
  projects,
  query,
  hero,
  empty,
  disabled,
}: {
  surface: GallerySurface;
  enabled?: boolean;
  projects: readonly ProjectCardData[];
  query: { buscar?: string };
  hero: {
    eyebrow: string;
    title: string;
    lede: string;
    safety?: string;
  };
  empty: { title: string; body: string };
  disabled?: { title: string; body: string };
}) {
  const uniqueAuthors = new Set(projects.map((project) => project.author)).size;
  const totalStars = projects.reduce((sum, project) => sum + project.starCount, 0);

  return (
    <div className="community-page">
      <header className="community-hero">
        <div className="community-hero__copy">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1>{hero.title}</h1>
          <p className="community-hero__lede">{hero.lede}</p>
          {hero.safety ? (
            <p className="community-hero__safety">
              <Shield /> {hero.safety}
            </p>
          ) : null}
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
            <dt>Creen</dt>
            <dd>{totalStars}</dd>
          </div>
        </dl>
      </header>

      {!enabled && disabled ? (
        <section className="community-empty">
          <Grid />
          <h2>{disabled.title}</h2>
          <p>{disabled.body}</p>
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
            <button className="button button--ghost" type="submit">
              Buscar
            </button>
            <p className="community-filters__summary">
              <Grid /> Mostrando {projectCountLabel(projects.length)}
            </p>
          </form>

          {projects.length ? (
            <div className="gallery-grid">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} surface={surface} />
              ))}
            </div>
          ) : (
            <section className="community-empty">
              <Compass />
              <h2>{empty.title}</h2>
              <p>{empty.body}</p>
            </section>
          )}
        </>
      )}

      <div className="gallery-end">
        <Compass />
        <strong>Compartir también es aprender</strong>
        <p>
          {surface === "public"
            ? "Estas muestras muestran el tipo de proyectos que se construyen en el programa. Para creer, comentar o publicar el tuyo, entra a la comunidad."
            : "Cada proyecto visible corresponde a una entrega aprobada y una decisión explícita de publicación."}
        </p>
      </div>
    </div>
  );
}
