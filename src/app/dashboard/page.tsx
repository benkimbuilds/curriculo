import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { ArrowRight, BookOpen, Clock, GitBranch } from "@/components/icons";
import { LessonRow, ProgressBar, StatusPill } from "@/components/ui";
import { getStudentProgressSummary, isLessonComplete, loadStudentContext } from "@/app/programa/student-data";

export default async function DashboardPage() {
  const context = await loadStudentContext("/dashboard");
  const summary = getStudentProgressSummary(context);
  const currentWeek = summary.currentWeek ?? context.weeks[0];
  const currentLesson = summary.currentLesson ?? currentWeek.modules[0]?.lessons[0];
  const currentWeekLessons = currentWeek.modules.flatMap((module) => module.lessons);
  const nextLessons = currentWeekLessons
    .filter((lesson) => !isLessonComplete(summary.lessonState.get(lesson.id)))
    .slice(0, 3);
  const completedInWeek = currentWeekLessons.filter((lesson) => isLessonComplete(summary.lessonState.get(lesson.id))).length;
  const latestSubmission = context.submissions
    .filter(({ projectId }) => projectId === currentWeek.project.id)
    .sort((left, right) => right.attempt - left.attempt)[0];
  const firstName = context.user.name.trim().split(/\s+/)[0] || context.user.name;
  const today = new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Mexico_City" }).format(new Date());
  const currentSchedule = context.schedules.find(({ weekId }) => weekId === currentWeek.id);

  return (
    <AppShell userName={context.user.name}>
      <div className="app-content">
        <header className="dashboard-greeting"><div><p className="eyebrow">{today}</p><h1>Hola, {firstName}</h1><p>Continúa desde tu siguiente lección pendiente.</p></div><p className="enrollment-mode">{context.enrollment.mode === "facilitated" ? "Cohorte facilitada" : "Estudio autodidacta"}</p></header>

        {currentLesson ? <section className="continue-card">
          <div className="continue-card__body"><div className="card-kicker"><span>SEMANA {currentWeek.week}</span><StatusPill tone="warm">En curso</StatusPill></div><h2>{currentLesson.title}</h2><p>{currentLesson.summary}</p><ProgressBar label={`${completedInWeek} de ${currentWeekLessons.length} lecciones completadas`} value={currentWeekLessons.length ? Math.round((completedInWeek / currentWeekLessons.length) * 100) : 0} /><Link className="button button--primary" href={`/programa/semana/${currentWeek.week}/leccion/${currentLesson.id}`}>Continuar <ArrowRight /></Link></div>
        </section> : null}

        <div className="dashboard-grid">
          <section className="panel"><div className="panel__header"><div><p className="eyebrow">Tu semana</p><h2>Lo que sigue</h2></div><Link className="text-link" href={`/programa/semana/${currentWeek.week}`}>Ver semana <ArrowRight /></Link></div>
            <div className="lesson-list">{nextLessons.map((lesson, index) => <LessonRow href={`/programa/semana/${currentWeek.week}/leccion/${lesson.id}`} key={lesson.id} meta={`${lesson.estimatedMinutes} min`} status={index === 0 ? "current" : "upcoming"} title={lesson.title} />)}</div>
          </section>
          <aside className="panel project-mini"><div className="project-mini__icon"><GitBranch /></div><p className="eyebrow">Proyecto semanal</p><h2>{currentWeek.project.title}</h2><p>{currentWeek.project.summary}</p><div className="mini-meta"><span><Clock /> {Math.round(currentWeek.project.estimatedMinutes / 60)} h</span><span><GitBranch /> {latestSubmission ? `Intento ${latestSubmission.attempt}` : "Sin entrega"}</span></div><Link className="button button--secondary button--full" href={`/proyectos/${currentWeek.week}/entrega`}>{latestSubmission ? "Ver entrega" : "Entregar proyecto"} <ArrowRight /></Link></aside>
        </div>

        {currentSchedule?.dueAt || context.announcements.length ? <div className="dashboard-grid">
          {currentSchedule?.dueAt ? <section className="panel"><p className="eyebrow">Calendario de cohorte</p><h2>Entrega de la semana {currentWeek.week}</h2><p>{new Intl.DateTimeFormat("es-MX", { dateStyle: "full", timeStyle: "short", timeZone: "America/Mexico_City" }).format(currentSchedule.dueAt)}</p></section> : null}
          {context.announcements.length ? <section className="panel"><p className="eyebrow">Avisos</p><div className="attention-list">{context.announcements.slice(0, 3).map((announcement) => <article key={announcement.id}><strong>{announcement.title}</strong><p>{announcement.body}</p></article>)}</div></section> : null}
        </div> : null}

        <section className="dashboard-bottom"><div><h2>Tu ruta completa</h2><p>{summary.completedLessons} de {summary.totalLessons} lecciones · {summary.passedProjects} proyectos aprobados.</p></div><div className="big-progress"><strong>{summary.percent}%</strong><ProgressBar value={summary.percent} /></div><Link className="button button--ghost" href="/programa"><BookOpen /> Ver mapa completo</Link></section>
      </div>
    </AppShell>
  );
}
