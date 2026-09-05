import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { ArrowLeft, Clock, Message, User } from "@/components/icons";
import { Avatar, PageIntro } from "@/components/ui";
import { getCurrentSession } from "@/modules/auth/session";
import { removeLearnerAction } from "@/modules/cohorts/actions";
import { addInterventionNoteAction, reviewSubmissionAction } from "@/modules/staff/db-actions";
import { getStudentTimeline, listReviewableSubmissions } from "@/modules/staff/db-staff";

export default async function StudentTimelinePage({ params, searchParams }: { params: Promise<{ id: string; learnerId: string }>; searchParams: Promise<{ nota?: string; evaluacion?: string }> }) {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  const [{ id, learnerId }, query] = await Promise.all([params, searchParams]);
  const [timeline, reviewable] = await Promise.all([
    getStudentTimeline(session.user.id, id, learnerId),
    listReviewableSubmissions(session.user.id, id, learnerId),
  ]);
  const addNote = addInterventionNoteAction.bind(null, id, learnerId);
  const removeLearner = removeLearnerAction.bind(null, id, learnerId);
  return (
    <AppShell role="staff" userName={session.user.name}><div className="app-content app-content--narrow"><Link className="back-link" href={`/staff/cohortes/${id}`}><ArrowLeft /> Volver a {timeline.cohort.name}</Link><PageIntro description={timeline.learner.email} eyebrow="Seguimiento individual" title={timeline.learner.name} />
      <div className="profile-grid"><section className="panel"><div className="project-detail-author"><Avatar color="green" name={timeline.learner.name} /><span><strong>{timeline.learner.name}</strong><small>{timeline.cohort.name}</small></span></div></section><aside className="panel privacy-card"><User /><h3>Uso responsable</h3><p>Las señales de actividad aportan contexto. Una persona del equipo decide si hace falta intervenir.</p></aside></div>
      <section className="panel settings-form"><div className="panel__header"><div><p className="eyebrow">Intervención</p><h2>Agregar nota privada del equipo</h2></div><Message /></div><form action={addNote} className="form-stack"><label>Categoría<select name="category"><option value="academic_support">Apoyo académico</option><option value="attendance_follow_up">Seguimiento de asistencia</option><option value="technical_support">Apoyo técnico</option><option value="wellbeing_check_in">Contacto de bienestar</option><option value="accommodation">Ajuste de apoyo</option><option value="other">Otro</option></select></label><label>Nota<textarea maxLength={2000} minLength={3} name="note" required rows={4} /></label><label>Seguimiento opcional<input name="followUpAt" type="datetime-local" /></label><button className="button button--primary" type="submit">Guardar nota</button>{query.nota ? <p className="form-success">Nota registrada.</p> : null}</form></section>
      <section className="panel"><div className="panel__header"><div><p className="eyebrow">Evaluaciones</p><h2>Revisión de entregas</h2></div><Clock /></div>{reviewable.length ? <div className="attention-list">{reviewable.map((item) => { const review = reviewSubmissionAction.bind(null, id, learnerId, item.evaluationRunId); return <article key={item.evaluationRunId}><strong>{item.projectId} · intento {item.attempt}</strong><p>Entrega: {item.submissionStatus} · Evaluación: {item.evaluationStatus}</p><p><a href={item.repositoryUrl} rel="noreferrer" target="_blank">Repositorio</a>{item.deploymentUrl ? <> · <a href={item.deploymentUrl} rel="noreferrer" target="_blank">Demo</a></> : null}</p>{item.evidence.map((evidence) => <p key={evidence.criterionId}>{evidence.criterionId}: {evidence.message}</p>)}<form action={review} className="form-stack"><label>Decisión<select name="outcome"><option value="passed">Aprobar</option><option value="failed">Solicitar cambios</option></select></label><label>Evidencia y motivo<textarea minLength={10} maxLength={1000} name="reason" required rows={3} /></label><button className="button button--primary" type="submit">Guardar revisión</button></form></article>; })}</div> : <p>No hay entregas para revisar.</p>}{query.evaluacion ? <p className="form-success">Evaluación actualizada.</p> : null}</section>
      <section className="panel"><div className="panel__header"><div><p className="eyebrow">Evidencia</p><h2>Línea de tiempo</h2></div><Clock /></div>{timeline.events.length ? <div className="attention-list">{timeline.events.map((event) => <div key={`${event.type}-${event.id}`}><span><strong>{event.title}</strong><small>{event.detail} · {event.occurredAt.toLocaleString("es-MX")}</small></span></div>)}</div> : <p>No hay actividad registrada para esta inscripción.</p>}</section>
      <section className="panel settings-form"><h2>Retirar de esta cohorte</h2><p>La persona conserva su acceso autodidacta y el historial de aprendizaje.</p><form action={removeLearner}><button className="button button--ghost" type="submit">Retirar de la cohorte</button></form></section>
    </div></AppShell>
  );
}
