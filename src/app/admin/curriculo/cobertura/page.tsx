import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { PageIntro } from "@/components/ui";
import { getCurrentSession } from "@/modules/auth/session";
import { requirePermission } from "@/modules/authorization/service";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";
import { getOdinCoverage, listOdinDocuments, odinCourseTitles } from "@/modules/curriculum/odin";

export default async function CoveragePage() {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  await requirePermission(session.user.id, await resolveDefaultOrganizationId(), "curriculum:audit");
  const coverage = getOdinCoverage();
  const lessons = listOdinDocuments();
  const labels = { translation: "Traducción", "platform-adaptation": "Windows / macOS", "technical-adaptation": "Actualización técnica", "nextjs-replacement": "Equivalente en Next.js" };
  return <AppShell role="admin" userName={session.user.name}><div className="app-content">
    <PageIntro title="Cobertura de Odin" eyebrow="Auditoría de fuentes" description={`${coverage.mapped} de ${coverage.expected} lecciones y proyectos del inventario fijado cuentan con material localizado.`} />
    <section className="panel coverage-summary"><h2>Qué demuestra este reporte</h2><p>El inventario se deriva del orden oficial de Fundamentos y Full Stack JavaScript. CI compara cada entrada, archivo, hash, edición en español y adaptación declarada. Ruby, Rails y cursos archivados quedan fuera del alcance acordado.</p><p>Esta es una verificación de cobertura estructural y procedencia. No certifica una revisión pedagógica humana independiente, la disponibilidad permanente de recursos externos ni futuras versiones de Odin.</p><p>Currículo: <code>{coverage.curriculumCommit}</code><br />Orden de cursos: <code>{coverage.orderingCommit}</code></p><Link className="button button--ghost" href="/programa/biblioteca">Abrir biblioteca del estudiante</Link></section>
    {coverage.courses.map(course => <section className="panel" key={course.id}><h2>{odinCourseTitles[course.id]} · {course.mapped}/{course.count}</h2><div className="coverage-table">{lessons.filter(item => item.course === course.id).map(item => {
      const href = `/programa/semana/${item.week}/leccion/${item.id}`;
      return <article key={item.id}><div><strong>{item.title["es-MX"]}</strong><small>Origen: {item.sourceTitle} · {item.kind === "project" ? "Proyecto" : "Lección"} · Semana {item.week}</small><code>{item.sourcePath}</code></div><span>{labels[item.treatment]}</span><div className="coverage-links"><Link href={href}>Español</Link><Link href={`${href}?idioma=en`}>{item.englishEdition === "upstream" ? "English original" : "English adaptation"}</Link><a href={item.sourceUrl} rel="noreferrer" target="_blank">Original fijado</a></div></article>;
    })}</div></section>)}
  </div></AppShell>;
}
