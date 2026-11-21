import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { ActivityHeatmap } from "@/components/activity-heatmap";
import { ArrowRight, BookOpen, Check, Clock, GitBranch } from "@/components/icons";
import { ProgressBar, StatusPill } from "@/components/ui";
import { formatInvestedTime, getStudentActivitySummary } from "@/app/programa/student-activity";
import { getStudentProgressSummary, isLessonComplete, isProjectComplete, loadStudentContext } from "@/app/programa/student-data";

export default async function DashboardPage() {
  const context = await loadStudentContext("/dashboard");
  const summary = getStudentProgressSummary(context);
  const activity = getStudentActivitySummary(context, { weeks: 20 });
  const currentWeek = summary.currentWeek ?? context.weeks[0];
  const currentLesson = summary.currentLesson ?? currentWeek.modules[0]?.lessons[0];
  const currentWeekLessons = currentWeek.modules.flatMap((module) => module.lessons).filter((lesson) => lesson.required);
  const completedInWeek = currentWeekLessons.filter((lesson) => isLessonComplete(summary.lessonState.get(lesson.id))).length;
  const latestSubmission = context.submissions
    .filter(({ projectId }) => projectId === currentWeek.project.id)
    .sort((left, right) => right.attempt - left.attempt)[0];
  const firstName = context.user.name.trim().split(/\s+/)[0] || context.user.name;
  const today = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Mexico_City",
  }).format(new Date());
  const currentSchedule = context.schedules.find(({ weekId }) => weekId === currentWeek.id);
  const passedProjectIds = new Set(
    context.submissions.filter(({ status }) => isProjectComplete(status)).map(({ projectId }) => projectId),
  );
  const submittedProjectIds = new Set(context.submissions.map(({ projectId }) => projectId));

  const weekRows = context.weeks.map((week) => {
    const lessons = week.modules.flatMap((module) => module.lessons).filter((lesson) => lesson.required);
    const completeCount = lessons.filter((lesson) => isLessonComplete(summary.lessonState.get(lesson.id))).length;
    const projectDone = passedProjectIds.has(week.project.id) || submittedProjectIds.has(week.project.id);
    const percent = lessons.length ? Math.round((completeCount / lessons.length) * 100) : 0;
    const isCurrent = week.week === currentWeek.week;
    const isComplete = completeCount === lessons.length && passedProjectIds.has(week.project.id);
    return { week, lessons, completeCount, projectDone, percent, isCurrent, isComplete };
  });

  const focusWeeks = (() => {
    const currentIndex = weekRows.findIndex((row) => row.isCurrent);
    const start = Math.max(0, currentIndex - 1);
    return weekRows.slice(start, start + 4);
  })();

  return (
    <AppShell userName={context.user.name}>
      <div className="app-content app-content--wide">
        <header className="dashboard-greeting">
          <p className="eyebrow">{today}</p>
          <h1>Hola, {firstName}</h1>
        </header>

        {currentLesson ? (
          <section className="continue-banner">
            <div className="continue-banner__copy">
              <div className="card-kicker">
                <span>SEMANA {currentWeek.week}</span>
                <StatusPill tone="warm">En curso</StatusPill>
              </div>
              <h2>{currentLesson.title}</h2>
              <p>{currentLesson.summary}</p>
              <ProgressBar
                label={`${completedInWeek} de ${currentWeekLessons.length} lecciones completadas`}
                value={currentWeekLessons.length ? Math.round((completedInWeek / currentWeekLessons.length) * 100) : 0}
              />
            </div>
            <Link
              className="button button--primary continue-banner__cta"
              href={`/programa/semana/${currentWeek.week}/leccion/${currentLesson.id}`}
            >
              Continuar <ArrowRight />
            </Link>
          </section>
        ) : null}

        <div className="dashboard-home">
          <section className="panel dashboard-home__courses">
            <div className="panel__header">
              <div>
                <p className="eyebrow">Tu ruta</p>
                <h2>Semanas en curso</h2>
              </div>
              <Link className="text-link" href="/programa">
                Ver mapa <ArrowRight />
              </Link>
            </div>

            <div className="course-progress-list">
              {focusWeeks.map(({ week, lessons, completeCount, percent, isCurrent, isComplete }) => (
                <Link
                  className={`course-progress-row${isCurrent ? " is-current" : ""}${isComplete ? " is-complete" : ""}`}
                  href={`/programa/semana/${week.week}`}
                  key={week.id}
                >
                  <span className="course-progress-row__mark">{String(week.week).padStart(2, "0")}</span>
                  <div className="course-progress-row__body">
                    <div className="course-progress-row__top">
                      <strong>{week.title}</strong>
                      {isComplete ? (
                        <StatusPill tone="good">Completada</StatusPill>
                      ) : isCurrent ? (
                        <StatusPill tone="warm">En curso</StatusPill>
                      ) : (
                        <StatusPill tone="neutral">Disponible</StatusPill>
                      )}
                    </div>
                    <div className="course-progress-row__meta">
                      <span>
                        <Clock /> {Math.round(week.estimatedMinutes / 60)} h estimadas
                      </span>
                      <span>
                        <Check /> {completeCount}/{lessons.length} lecciones
                      </span>
                    </div>
                    <ProgressBar value={percent} />
                  </div>
                </Link>
              ))}
            </div>

            <aside className="dashboard-project-strip">
              <div>
                <p className="eyebrow">Proyecto semanal</p>
                <strong>{currentWeek.project.title}</strong>
                <span>
                  <GitBranch /> {latestSubmission ? `Intento ${latestSubmission.attempt}` : "Sin entrega"}
                </span>
              </div>
              <Link className="button button--secondary" href={`/proyectos/${currentWeek.week}/entrega`}>
                {latestSubmission ? "Ver entrega" : "Entregar"} <ArrowRight />
              </Link>
            </aside>
          </section>

          <aside className="dashboard-home__progress">
            <ActivityHeatmap activity={activity} compact />

            <div className="progress-tiles">
              <article className="progress-tile">
                <p>Avance del programa</p>
                <strong>{summary.percent}%</strong>
                <ProgressBar value={summary.percent} />
              </article>
              <article className="progress-tile">
                <p>Tiempo invertido</p>
                <strong>{formatInvestedTime(activity.totalMinutes)}</strong>
                <small>
                  {summary.completedLessons} lecciones · {summary.passedProjects} proyectos
                </small>
              </article>
            </div>
          </aside>
        </div>

        {currentSchedule?.dueAt || context.announcements.length ? (
          <div className="dashboard-grid">
            {currentSchedule?.dueAt ? (
              <section className="panel">
                <p className="eyebrow">Calendario de cohorte</p>
                <h2>Entrega de la semana {currentWeek.week}</h2>
                <p>
                  {new Intl.DateTimeFormat("es-MX", {
                    dateStyle: "full",
                    timeStyle: "short",
                    timeZone: "America/Mexico_City",
                  }).format(currentSchedule.dueAt)}
                </p>
              </section>
            ) : null}
            {context.announcements.length ? (
              <section className="panel">
                <p className="eyebrow">Avisos</p>
                <div className="attention-list">
                  {context.announcements.slice(0, 3).map((announcement) => (
                    <article key={announcement.id}>
                      <strong>{announcement.title}</strong>
                      <p>{announcement.body}</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        ) : null}

        <section className="dashboard-bottom">
          <div>
            <h2>Tu ruta completa</h2>
            <p>
              {summary.completedLessons} de {summary.totalLessons} lecciones · {summary.passedProjects} proyectos
              aprobados.
            </p>
          </div>
          <div className="big-progress">
            <strong>{summary.percent}%</strong>
            <ProgressBar value={summary.percent} />
          </div>
          <Link className="button button--ghost" href="/programa">
            <BookOpen /> Ver mapa completo
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
