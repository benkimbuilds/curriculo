import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { ArrowLeft, ArrowRight, Check, Clock, ExternalLink } from "@/components/icons";
import { LessonContent } from "@/components/lesson-content";
import { isLessonComplete, loadStudentContext } from "../../../../student-data";
import { LessonCompleteForm } from "./lesson-complete-form";
import { LessonProgressTracker } from "./lesson-progress-tracker";

export default async function LessonPage({ params }: { params: Promise<{ week: string; slug: string }> }) {
  const { week: rawWeek, slug } = await params;
  const weekNumber = Number(rawWeek);
  const context = await loadStudentContext(`/programa/semana/${rawWeek}/leccion/${slug}`);
  const week = Number.isInteger(weekNumber) ? context.weeks.find((item) => item.week === weekNumber) : undefined;
  if (!week) notFound();
  const lessons = week.modules.flatMap((module) => module.lessons);
  const lessonIndex = lessons.findIndex((lesson) => lesson.id === slug);
  const lesson = lessons[lessonIndex];
  if (!lesson) notFound();
  const progress = context.lessonProgress.find((record) => record.lessonId === lesson.id && record.contentVersion === week.contentVersion);
  const previousLesson = lessons[lessonIndex - 1];
  const nextLesson = lessons[lessonIndex + 1];
  const lessonModule = week.modules.find((item) => item.lessons.some(({ id }) => id === lesson.id));

  return (
    <AppShell userName={context.user.name}>
      <div className="lesson-page">
        <LessonProgressTracker contentVersion={week.contentVersion} enrollmentId={context.enrollment.id} initialPosition={progress?.resumePosition ?? 0} lessonId={lesson.id} week={weekNumber} />
        <header className="lesson-header">
          <Link className="back-link" href={`/programa/semana/${weekNumber}`}><ArrowLeft /> Semana {weekNumber}</Link>
          <div className="lesson-header__meta"><span>LECCIÓN {lessonIndex + 1} DE {lessons.length}</span><span><Clock /> {lesson.estimatedMinutes} min</span><span>{lesson.kind === "lab" ? "LABORATORIO" : "LECCIÓN"}</span></div>
          <h1>{lesson.title}</h1>
          <p>{lesson.summary}</p>
        </header>
        <div className="lesson-layout">
          <article className="lesson-article">
            <div className="lesson-objectives"><strong>Al terminar podrás:</strong><ul>{lesson.outcomes.map((outcome) => <li key={outcome}><Check /> {outcome}</li>)}</ul></div>
            <LessonContent content={week.lessonBodies[lesson.id]} />

            <h2 id="recursos">Recursos para consultar</h2>
            <div className="resource-list">{week.provenance.externalResources.map((resource) => <a className="external-resource" href={resource.url} key={resource.url} rel="noreferrer" target="_blank"><ExternalLink /> <span><strong>{resource.label}</strong><small>{resource.kind === "upstream" ? "Fuente de referencia" : "Documentación"}</small></span></a>)}</div>

            <footer className="lesson-complete"><div><span>{isLessonComplete(progress?.state) ? "Avance guardado" : "¿Terminaste la práctica?"}</span><strong>{isLessonComplete(progress?.state) ? "Esta lección está completada." : "Marca la lección como completada."}</strong></div><LessonCompleteForm alreadyComplete={isLessonComplete(progress?.state)} contentVersion={week.contentVersion} enrollmentId={context.enrollment.id} lessonId={lesson.id} week={weekNumber} /></footer>
            <nav aria-label="Navegación entre lecciones" className="lesson-pager">
              {previousLesson ? <Link href={`/programa/semana/${weekNumber}/leccion/${previousLesson.id}`}><ArrowLeft /><span><small>ANTERIOR</small>{previousLesson.title}</span></Link> : <span />}
              {nextLesson ? <Link href={`/programa/semana/${weekNumber}/leccion/${nextLesson.id}`}><span><small>SIGUIENTE</small>{nextLesson.title}</span><ArrowRight /></Link> : <Link href={`/proyectos/${weekNumber}/entrega`}><span><small>SIGUIENTE</small>Proyecto de la semana</span><ArrowRight /></Link>}
            </nav>
            <p className="attribution">{week.provenance.attribution} · {week.provenance.license}</p>
          </article>
          <aside className="lesson-toc"><strong>En esta lección</strong><nav><a className="is-active" href="#explicacion">Explicación</a><a href="#ejemplo">Ejemplo</a><a href="#ejercicio-guiado">Ejercicio guiado</a><a href="#comprobacion">Comprobación</a><a href="#recursos">Recursos</a></nav><div><span>{lessonModule?.title ?? `Semana ${weekNumber}`}</span><strong>{lessonIndex + 1}/{lessons.length}</strong></div></aside>
        </div>
      </div>
    </AppShell>
  );
}
