import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ArrowLeft, ArrowRight, Check, Clock, GitBranch, Lightbulb } from "@/components/icons";
import { LessonRow, ProgressBar, StatusPill } from "@/components/ui";
import { isLessonComplete, loadStudentContext } from "../../student-data";

const colors = ["yellow", "clay", "blue", "green", "violet"] as const;

export default async function WeekPage({ params }: { params: Promise<{ week: string }> }) {
  const { week: rawWeek } = await params;
  const number = Number(rawWeek);
  const context = await loadStudentContext(`/programa/semana/${number}`);
  const week = Number.isInteger(number)
    ? context.weeks.find((item) => item.week === number)
    : undefined;
  if (!week) notFound();
  const lessonState = new Map(context.lessonProgress.map((record) => [record.lessonId, record.state]));
  const color = colors[(week.week - 1) % colors.length];
  const coreLessons = week.modules.flatMap((module) => module.lessons).filter((lesson) => lesson.required);
  const libraryModules = week.modules.filter((module) => module.id.includes("-odin-"));
  const lessons = coreLessons.map((lesson, index) => ({
    slug: lesson.id,
    title: lesson.title,
    meta: `${lesson.estimatedMinutes} min`,
    status: isLessonComplete(lessonState.get(lesson.id)) ? "done" as const : index === coreLessons.findIndex((item) => !isLessonComplete(lessonState.get(item.id))) ? "current" as const : "upcoming" as const,
  }));
  const completedLessons = lessons.filter(({ status }) => status === "done").length;
  const latestSubmission = context.submissions.filter(({ projectId }) => projectId === week.project.id).sort((left, right) => right.attempt - left.attempt)[0];
  return (
    <AppShell userName={context.user.name}>
      <div className="app-content app-content--narrow">
        <Link className="back-link" href="/programa"><ArrowLeft /> Volver al programa</Link>
        <header className={`week-hero week-hero--${color}`}><div><p className="eyebrow">SEMANA {number}</p><h1>{week.title}</h1><p>{week.summary}</p><div className="week-hero__meta"><span><Clock /> {Math.round(week.estimatedMinutes / 60)} h estimadas</span><span>{lessons.length} lecciones</span><span>1 proyecto</span></div></div><span className="week-hero__number">{String(number).padStart(2, "0")}</span></header>
        <div className="week-layout">
          <section className="panel"><div className="panel__header"><div><p className="eyebrow">Lecciones</p><h2>Aprende paso a paso</h2></div><StatusPill tone="info">{completedLessons}/{lessons.length} completadas</StatusPill></div><ProgressBar value={lessons.length ? Math.round((completedLessons / lessons.length) * 100) : 0} /><div className="lesson-list lesson-list--roomy">{lessons.map((lesson) => <LessonRow href={`/programa/semana/${number}/leccion/${lesson.slug}`} key={lesson.slug} {...lesson} />)}</div></section>
          <aside className="week-aside">
            <article className="panel project-brief-card"><span className="project-brief-card__icon"><GitBranch /></span><p className="eyebrow">Proyecto de la semana</p><h2>{week.project.title}</h2><p>{week.project.summary}</p><ul>{week.project.deliverables.slice(0, 3).map((deliverable) => <li key={deliverable}><Check /> {deliverable}</li>)}</ul>{latestSubmission ? <StatusPill tone={latestSubmission.status === "passed" ? "good" : latestSubmission.status === "needs_revision" ? "alert" : "info"}>Intento {latestSubmission.attempt} · {latestSubmission.status.replace("_", " ")}</StatusPill> : null}<Link className="button button--secondary button--full" href={`/proyectos/${number}/entrega`}>{latestSubmission ? "Ver o volver a entregar" : "Ver instrucciones"} <ArrowRight /></Link></article>
            <article className="tip-card"><Lightbulb /><div><strong>Trabaja a tu ritmo</strong><p>Las horas son una guía, no una fecha límite. Lo importante es practicar y entender.</p></div></article>
          </aside>
        </div>
        {libraryModules.length ? <section className="panel odin-week-library"><p className="eyebrow">Currículo ampliado</p><h2>Profundización y proyectos de práctica</h2><p>Estos materiales completan la cobertura de Odin. Puedes guardar su avance, pero no cambian el porcentaje de la ruta guiada. Cada proyecto de práctica tiene sus propios requisitos; su entrega no usa el evaluador del proyecto semanal.</p>{libraryModules.map((module) => <details className="odin-course" key={module.id}><summary>{module.title}<span>{module.lessons.length} materiales</span></summary><div className="lesson-list">{module.lessons.map((lesson) => <LessonRow key={lesson.id} title={lesson.title} href={`/programa/semana/${number}/leccion/${lesson.id}`} meta={`${lesson.kind === "lab" ? "Proyecto de práctica" : "Lección"} · ${lesson.estimatedMinutes} min`} status={isLessonComplete(lessonState.get(lesson.id)) ? "done" : "upcoming"} />)}</div></details>)}<Link className="text-link" href="/programa/biblioteca">Ver todas las materias <ArrowRight /></Link></section> : null}
      </div>
    </AppShell>
  );
}
