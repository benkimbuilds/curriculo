import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ArrowRight, Check, Clock, GitBranch } from "@/components/icons";
import { PageIntro, ProgressBar, StatusPill } from "@/components/ui";
import { getStudentProgressSummary, isLessonComplete, loadStudentContext } from "./student-data";

const colors = ["yellow", "clay", "blue", "green", "violet"] as const;

export default async function ProgramPage() {
  const context = await loadStudentContext("/programa");
  const summary = getStudentProgressSummary(context);
  const submittedProjectIds = new Set(context.submissions.map(({ projectId }) => projectId));
  return (
    <AppShell userName={context.user.name}>
      <div className="app-content">
        <PageIntro description="Doce semanas para pasar de cero a construir aplicaciones web completas. Avanza a tu ritmo: aquí no hay fechas límite." eyebrow="Tu mapa de aprendizaje" title="Mi programa" />
        <div className="program-summary"><div><strong>{summary.percent}%</strong><span>del programa</span></div><ProgressBar value={summary.percent} /><div><strong>{summary.completedLessons}</strong><span>lecciones completas</span></div><div><strong>{submittedProjectIds.size}</strong><span>proyectos entregados</span></div></div>
        <div className="weeks-grid">
          {context.weeks.map((week) => {
            const current = week.week === summary.currentWeek?.week;
            const color = colors[(week.week - 1) % colors.length];
            const lessons = week.modules.flatMap((module) => module.lessons);
            const completeCount = lessons.filter((lesson) => isLessonComplete(summary.lessonState.get(lesson.id))).length;
            const projectSubmitted = submittedProjectIds.has(week.project.id);
            return (
              <article className={`week-card week-card--${color} ${current ? "is-current" : ""}`} key={week.id}>
                <div className="week-card__top"><span className="week-badge">{String(week.week).padStart(2, "0")}</span>{current ? <StatusPill tone="warm">En curso</StatusPill> : <span className="week-lock">{completeCount === lessons.length && projectSubmitted ? <Check /> : "Disponible"}</span>}</div>
                <h2>{week.title}</h2><p>{week.summary}</p>
                <div className="week-card__project"><GitBranch /><span><small>PROYECTO</small><strong>{week.project.title}</strong></span></div>
                <div className="week-card__footer"><span><Clock /> {completeCount}/{lessons.length} lecciones</span><Link aria-label={`Abrir semana ${week.week}: ${week.title}`} href={`/programa/semana/${week.week}`}>{current ? "Continuar" : "Explorar"} <ArrowRight /></Link></div>
              </article>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
