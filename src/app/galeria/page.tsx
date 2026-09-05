import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { Compass, Grid, Shield } from "@/components/icons";
import { ProjectCard, type ProjectCardData } from "@/components/project-card";
import { PageIntro } from "@/components/ui";
import { getCurrentSession } from "@/modules/auth/session";
import { listGalleryForViewer } from "@/modules/community/db-community";

const accents: ProjectCardData["accent"][] = ["yellow", "clay", "blue", "green", "violet"];

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ buscar?: string; semana?: string }>;
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
    week: `Semana ${entry.week}`,
    description: entry.description,
    accent: accents[index % accents.length],
    initialsColor: accents[(index + 2) % accents.length],
    likes: entry.reviewCount,
    tag: entry.technology,
  }));

  return (
    <AppShell userName={session.user.name}>
      <div className="app-content">
        <PageIntro action={<span className="gallery-count"><Grid /> {projects.length} proyectos</span>} description="Conoce proyectos aprobados y comparte retroalimentación basada en su rúbrica." eyebrow="Comunidad Ruta" title="Hecho por quienes aprenden" />
        <div className="community-notice"><Shield /><div><strong>Un espacio verificado y moderado</strong><p>La galería exige correo verificado, respeta cada cohorte y no permite mensajes directos ni comentarios libres.</p></div></div>
        {!enabled ? (
          <section className="panel"><h2>La galería todavía no está habilitada</h2><p>El equipo la activará cuando la operación de moderación esté lista. Tus entregas y tu avance continúan disponibles.</p></section>
        ) : (
          <>
            <form className="filter-bar" method="get"><label><span className="sr-only">Buscar proyectos</span><input defaultValue={query.buscar} name="buscar" placeholder="Buscar por proyecto o persona…" type="search" /></label><select aria-label="Filtrar por semana" defaultValue={query.semana ?? "todas"} name="semana"><option value="todas">Todas las semanas</option>{Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>Semana {index + 1}</option>)}</select><button className="button button--ghost" type="submit">Filtrar</button></form>
            {projects.length ? <div className="gallery-grid">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div> : <section className="panel"><h2>No hay proyectos que coincidan</h2><p>Prueba otra búsqueda o vuelve cuando haya entregas aprobadas y publicadas.</p></section>}
          </>
        )}
        <div className="gallery-end"><Compass /><strong>Aprender también es observar</strong><p>Cada proyecto visible corresponde a una entrega aprobada y una decisión explícita de publicación.</p></div>
      </div>
    </AppShell>
  );
}
