import Link from "next/link";
import { notFound } from "next/navigation";
import { inArray } from "drizzle-orm";
import { AppShell } from "@/components/app-shell";
import { ArrowLeft, Check, Clock, ExternalLink, GitBranch, Shield } from "@/components/icons";
import { StatusPill } from "@/components/ui";
import { db } from "@/db";
import { evaluationResults, evaluationRuns } from "@/db/schema";
import { loadStudentContext } from "../../../programa/student-data";
import { SubmissionForm } from "./submission-form";

export default async function SubmissionPage({ params }: { params: Promise<{ week: string }> }) {
  const { week } = await params;
  const weekNumber = Number(week);
  const context = await loadStudentContext(`/proyectos/${weekNumber}/entrega`);
  const curriculumWeek = Number.isInteger(weekNumber)
    ? context.weeks.find((item) => item.week === weekNumber)
    : undefined;
  if (!curriculumWeek) notFound();
  const attempts = context.submissions.filter(({ projectId }) => projectId === curriculumWeek.project.id).sort((left, right) => right.attempt - left.attempt);
  const runRows = attempts.length
    ? await db.select().from(evaluationRuns).where(inArray(evaluationRuns.submissionId, attempts.map(({ id }) => id)))
    : [];
  const resultRows = runRows.length
    ? await db.select().from(evaluationResults).where(inArray(evaluationResults.evaluationRunId, runRows.map(({ id }) => id)))
    : [];
  const runBySubmission = new Map(runRows.map((run) => [run.submissionId, run]));
  return (
    <AppShell userName={context.user.name}>
      <div className="app-content app-content--narrow">
        <Link className="back-link" href={`/programa/semana/${week}`}><ArrowLeft /> Volver a la semana {week}</Link>
        <header className="project-header"><div><p className="eyebrow">PROYECTO · SEMANA {weekNumber}</p><h1>{curriculumWeek.project.title}</h1><p>{curriculumWeek.project.summary}</p><div className="project-header__meta"><span><Clock /> {Math.round(curriculumWeek.project.estimatedMinutes / 60)} horas</span><span><GitBranch /> {curriculumWeek.project.collaboration === "individual" ? "Individual" : "Colaborativo"}</span>{weekNumber === 1 ? <StatusPill tone="info">Evaluación automática piloto</StatusPill> : <StatusPill tone="neutral">Revisión con rúbrica</StatusPill>}</div></div><div className="project-header__mark"><span>&lt;/&gt;</span></div></header>
        <div className="submission-layout">
          <section>
            <article className="panel rubric"><div className="panel__header"><div><p className="eyebrow">Antes de entregar</p><h2>Lista de verificación</h2></div><span className="rubric__score">Umbral {curriculumWeek.project.rubric.passThreshold}%</span></div>
              {curriculumWeek.project.rubric.criteria.map((criterion) => <label className="rubric-row" key={criterion.id}><input type="checkbox" /><span><Check /><span><strong>{criterion.title}</strong><small>{criterion.description}</small></span></span></label>)}
            </article>
            <article className="panel submission-form-card"><div className="panel__header"><div><p className="eyebrow">Tu entrega</p><h2>{attempts.length ? "Envía una nueva versión" : "Comparte tu proyecto"}</h2></div><StatusPill tone="neutral">Siguiente intento: {attempts.length + 1}</StatusPill></div>
              <SubmissionForm enrollmentId={context.enrollment.id} week={weekNumber} />
            </article>
          </section>
          <aside className="submission-aside">
            <article className="panel"><Shield /><h3>Tu entrega es una fotografía</h3><p>Guardamos el commit exacto que envías. Así, la evaluación y la retroalimentación siempre corresponden a la misma versión.</p></article>
            {attempts.length ? <article className="panel evaluation-steps"><h3>Historial de entregas</h3><ol>{attempts.map((attempt) => { const run = runBySubmission.get(attempt.id); const evidence = run ? resultRows.filter((row) => row.evaluationRunId === run.id) : []; return <li key={attempt.id}><span>{attempt.attempt}</span><div><strong>Intento {attempt.attempt}</strong><p>{attempt.status.replace("_", " ")} · {new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(attempt.submittedAt)}</p>{run ? <><small>Evaluación: {run.status.replace("_", " ")}</small>{evidence.map((item) => <p key={item.id}>{typeof item.evidence.message === "string" ? item.evidence.message : item.criterionId}</p>)}</> : null}</div></li>; })}</ol></article> : <article className="panel evaluation-steps"><h3>¿Qué pasará después?</h3><ol><li><span>1</span><div><strong>Revisamos los enlaces</strong><p>La página y el repositorio deben estar disponibles.</p></div></li><li><span>2</span><div><strong>Aplicamos la rúbrica</strong><p>Conservamos evidencia por cada criterio.</p></div></li><li><span>3</span><div><strong>Recibes evidencia</strong><p>Verás qué pasó y qué puedes mejorar.</p></div></li></ol></article>}
            <a className="text-link" href="https://docs.github.com/es/repositories/working-with-files/managing-files/viewing-and-understanding-files" rel="noreferrer" target="_blank">¿Cómo encuentro mi commit? <ExternalLink /></a>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
