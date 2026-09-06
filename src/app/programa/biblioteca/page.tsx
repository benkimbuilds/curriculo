import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PageIntro, LessonRow } from "@/components/ui";
import { listOdinDocuments, odinCourseTitles } from "@/modules/curriculum/odin";
import { isLessonComplete, loadStudentContext } from "../student-data";

export default async function LibraryPage({ searchParams }: { searchParams: Promise<{ buscar?: string; curso?: string }> }) {
  const context = await loadStudentContext("/programa/biblioteca");
  const query = await searchParams;
  const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const search = normalize((query.buscar ?? "").slice(0, 200));
  const all = listOdinDocuments();
  const items = all.filter(item => (!query.curso || item.course === query.curso) && normalize(`${item.title["es-MX"]} ${item.title.en}`).includes(search));
  const progress = new Map(context.lessonProgress.map(item => [item.lessonId, item.state]));
  const completed = all.filter(item => isLessonComplete(progress.get(item.id))).length;
  return <AppShell userName={context.user.name}><div className="app-content">
    <PageIntro title="Currículo completo" eyebrow="Biblioteca de aprendizaje" description="Fundamentos y Full Stack JavaScript de The Odin Project, adaptados al español y a Next.js." />
    <section className="panel curriculum-scope"><h2>{all.length} materiales, una ruta más profunda</h2><p>{all.filter(item => item.kind === "lesson").length} lecciones y {all.filter(item => item.kind === "project").length} proyectos de práctica. Completados: {completed}. Sigue el orden de cada materia y realiza sus lecturas y tareas; la ruta completa se extiende más allá del calendario de doce semanas.</p><p>Las lecturas externas conservan su idioma y autoría. La adaptación está en español, y el equipo puede consultar el original y su edición de auditoría. Los proyectos de esta biblioteca se comprueban con sus requisitos; no tienen evaluación automática individual.</p><Link className="text-link" href="/programa">Volver a la ruta guiada</Link></section>
    <form className="filter-bar" method="get"><label><span className="sr-only">Buscar en el currículo</span><input name="buscar" type="search" defaultValue={query.buscar} placeholder="Buscar tema o proyecto…" /></label><select aria-label="Materia" name="curso" defaultValue={query.curso ?? ""}><option value="">Todas las materias</option>{Object.entries(odinCourseTitles).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select><button className="button button--ghost" type="submit">Buscar</button></form>
    <p className="library-results">{items.length} resultados</p>
    {Object.entries(odinCourseTitles).map(([course, title], index) => {
      const entries = items.filter(item => item.course === course);
      return entries.length ? <details className="panel odin-course" key={course} open={Boolean(search || query.curso || index === 0)}><summary>{title}<span>{entries.length} materiales</span></summary><div className="lesson-list">{entries.map(item => <LessonRow key={item.id} title={item.title["es-MX"]} href={`/programa/semana/${item.week}/leccion/${item.id}`} meta={`${item.kind === "project" ? "Proyecto" : "Lección"} · Semana ${item.week} · ${item.estimatedMinutes} min${item.treatment === "nextjs-replacement" ? " · Next.js" : ""}`} status={isLessonComplete(progress.get(item.id)) ? "done" : "upcoming"} />)}</div></details> : null;
    })}
    {!items.length ? <section className="empty-state"><h3>No encontramos ese tema</h3><p>Prueba otro término o cambia la materia.</p><Link className="text-link" href="/programa/biblioteca">Mostrar todo</Link></section> : null}
  </div></AppShell>;
}
