import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ArrowLeft, ArrowRight, Check, Clock, ExternalLink } from "@/components/icons";
import { LessonContent } from "@/components/lesson-content";
import { listCurriculumWeeks, lessonHeadingId } from "@/modules/curriculum";
import { getOdinDocument, listOdinDocuments, odinCourseTitles } from "@/modules/curriculum/odin";
import { hasPermission } from "@/modules/authorization/policy";
import { loadAuthorizationContext } from "@/modules/authorization/service";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";
import { isLessonComplete, loadStudentContext } from "../../../../student-data";
import { LessonCompleteForm } from "./lesson-complete-form";
import { LessonProgressTracker } from "./lesson-progress-tracker";

export default async function LessonPage({ params, searchParams }: {
  params: Promise<{ week: string; slug: string }>;
  searchParams: Promise<{ idioma?: string }>;
}) {
  const [{ week: rawWeek, slug }, query] = await Promise.all([params, searchParams]);
  const weekNumber = Number(rawWeek);
  const context = await loadStudentContext(`/programa/semana/${rawWeek}/leccion/${slug}`);
  const authorization = await loadAuthorizationContext(context.user.id, await resolveDefaultOrganizationId());
  const canAudit = hasPermission(authorization, "curriculum:audit");
  if (query.idioma === "en" && !canAudit) notFound();
  const locale = query.idioma === "en" ? "en" : "es-MX";
  const weeks = locale === "en" ? listCurriculumWeeks({ locale, includeLibrary: true }) : context.weeks;
  const week = Number.isInteger(weekNumber) ? weeks.find(item => item.week === weekNumber && item.contentVersion === context.contentVersion) : undefined;
  if (!week) notFound();
  const allLessons = week.modules.flatMap(module => module.lessons);
  const lesson = allLessons.find(item => item.id === slug);
  if (!lesson) notFound();
  const source = getOdinDocument(slug);
  const sequence = source
    ? listOdinDocuments().filter(item => item.course === source.course).map(item => ({ id: item.id, title: item.title[locale], week: item.week }))
    : allLessons.filter(item => item.required).map(item => ({ ...item, week: weekNumber }));
  const lessonIndex = sequence.findIndex(item => item.id === slug);
  const previous = sequence[lessonIndex - 1];
  const next = sequence[lessonIndex + 1];
  const suffix = locale === "en" ? "?idioma=en" : "";
  const href = (item: typeof sequence[number]) => `/programa/semana/${item.week}/leccion/${item.id}${suffix}`;
  const progress = context.lessonProgress.find(record => record.lessonId === lesson.id && record.contentVersion === week.contentVersion);
  const content = week.lessonBodies[lesson.id];
  const headings = content.blocks.filter(block => block.type === "heading").slice(0, 16);

  return <AppShell userName={context.user.name}><div className="lesson-page">
    {locale !== "en" ? <LessonProgressTracker contentVersion={week.contentVersion} enrollmentId={context.enrollment.id} initialPosition={progress?.resumePosition ?? 0} lessonId={lesson.id} week={weekNumber} /> : null}
    <header className="lesson-header">
      <Link className="back-link" href={source ? "/programa/biblioteca" : `/programa/semana/${weekNumber}`}><ArrowLeft />{source ? "Biblioteca completa" : `Semana ${weekNumber}`}</Link>
      <div className="lesson-header__meta"><span>{source ? "MATERIAL" : "LECCIÓN"} {lessonIndex + 1} DE {sequence.length}</span><span><Clock /> {lesson.estimatedMinutes} min</span><span>{source?.kind === "project" ? "PROYECTO DE PRÁCTICA" : source ? "PROFUNDIZACIÓN" : "RUTA GUIADA"}</span></div>
      <h1>{lesson.title}</h1><p>{lesson.summary}</p>
      {canAudit ? <Link className="text-link" href={`/programa/semana/${weekNumber}/leccion/${slug}${locale === "en" ? "" : "?idioma=en"}`}>{locale === "en" ? "Volver a español" : "Auditar contenido en inglés"}</Link> : null}
    </header>
    <div className="lesson-layout"><article className="lesson-article">
      {source ? <aside className="lesson-objectives"><strong>{odinCourseTitles[source.course]}</strong><p>{source.treatment === "nextjs-replacement" ? "Esta lección conserva los objetivos del original y sustituye la implementación por Next.js." : "Adaptación del material de The Odin Project. Realiza las lecturas, actividades y comprobaciones indicadas."}</p>{source.kind === "project" ? <p>Proyecto adicional: guarda el código y compruébalo con estos requisitos. La plataforma registra su lectura como material completado; no puntúa automáticamente este proyecto.</p> : null}<a className="text-link" href={source.sourceUrl} target="_blank" rel="noreferrer">Consultar original en inglés <ExternalLink /></a></aside> : <div className="lesson-objectives"><strong>{locale === "en" ? "Learning outcomes" : "Al terminar podrás:"}</strong><ul>{lesson.outcomes.map(outcome => <li key={outcome}><Check />{outcome}</li>)}</ul></div>}
      {locale === "en" ? <p className="audit-notice">{source?.englishEdition === "upstream" ? "Original de Odin en inglés, conservado para comparar con la adaptación española." : "Edición adaptada de auditoría en inglés."} Consultar esta versión no modifica el avance del estudiante.</p> : null}
      <LessonContent content={content} />
      {source ? <details className="source-readings"><summary>Enlaces conservados de la edición original</summary><p>Referencias de procedencia. Algunas están en inglés o describen el stack original; para los pasos de Next.js sigue la adaptación anterior.</p><ul>{source.resources.map(url => <li key={url}><a href={url} target="_blank" rel="noreferrer">{url}</a></li>)}</ul></details> : <><h2 id="recursos">Recursos para consultar</h2><div className="resource-list">{week.provenance.externalResources.map(resource => <a className="external-resource" href={resource.url} key={resource.url} rel="noreferrer" target="_blank"><ExternalLink /><span><strong>{resource.label}</strong><small>Documentación de referencia</small></span></a>)}</div></>}
      {locale !== "en" ? <footer className="lesson-complete"><div><span>{isLessonComplete(progress?.state) ? "Avance guardado" : "¿Terminaste las actividades?"}</span><strong>{isLessonComplete(progress?.state) ? "Este material está completado." : "Guarda tu avance."}</strong></div><LessonCompleteForm alreadyComplete={isLessonComplete(progress?.state)} contentVersion={week.contentVersion} enrollmentId={context.enrollment.id} lessonId={lesson.id} week={weekNumber} /></footer> : null}
      <nav aria-label="Navegación entre lecciones" className="lesson-pager">{previous ? <Link href={href(previous)}><ArrowLeft /><span><small>ANTERIOR</small>{previous.title}</span></Link> : <span />}{next ? <Link href={href(next)}><span><small>SIGUIENTE</small>{next.title}</span><ArrowRight /></Link> : <Link href={source ? "/programa/biblioteca" : `/proyectos/${weekNumber}/entrega`}><span><small>SIGUIENTE</small>{source ? "Volver a la biblioteca" : "Proyecto de la semana"}</span><ArrowRight /></Link>}</nav>
      <p className="attribution">{source ? "Adaptado de The Odin Project, creado por Erik Trautman y mantenido por su comunidad. La fuente está fijada por commit y archivo en el inventario de cobertura." : week.provenance.attribution} · CC BY-NC-SA 4.0</p>
    </article><aside className="lesson-toc"><strong>En este material</strong><nav>{headings.map((heading, index) => <a href={`#${lessonHeadingId(heading.text)}`} key={index}>{heading.text.replace(/[*`]/g, "")}</a>)}</nav></aside></div>
  </div></AppShell>;
}
