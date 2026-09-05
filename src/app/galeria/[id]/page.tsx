import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { ArrowLeft, Check, ExternalLink, GitBranch, Message, Shield } from "@/components/icons";
import { Avatar, StatusPill } from "@/components/ui";
import { getCurrentSession } from "@/modules/auth/session";
import { reportGalleryEntryAction, submitStructuredFeedbackAction } from "@/modules/community/db-actions";
import { getGalleryProjectForViewer } from "@/modules/community/db-community";

const marks = [["demonstrated", "Logrado"], ["partially_demonstrated", "Parcialmente logrado"], ["not_yet_demonstrated", "Aún no"], ["not_observed", "No se observa"]] as const;
const nextSteps = [["review_requirements", "Revisar requisitos"], ["improve_accessibility", "Mejorar accesibilidad"], ["improve_responsiveness", "Mejorar adaptación a pantallas"], ["improve_code_clarity", "Aclarar el código"], ["test_edge_cases", "Probar casos límite"], ["ready_for_resubmission", "Listo para volver a entregar"]] as const;

export default async function ProjectDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ retroalimentacion?: string; reportado?: string }> }) {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const { enabled, project } = await getGalleryProjectForViewer(session.user.id, id);
  if (!enabled) redirect("/galeria");
  if (!project) notFound();
  const submitFeedback = submitStructuredFeedbackAction.bind(null, project.id);
  const reportProject = reportGalleryEntryAction.bind(null, project.id);
  const isOwner = project.ownerId === session.user.id;
  const hasReviewed = project.feedback.some(
    ({ authorId }) => authorId === session.user.id,
  );

  return (
    <AppShell userName={session.user.name}><div className="app-content app-content--narrow">
      <Link className="back-link" href="/galeria"><ArrowLeft /> Volver a la galería</Link>
      <header className="project-detail-header"><div className="project-detail-author"><Avatar color="yellow" name={project.author} /><span><strong>{project.author}</strong><small>Estudiante · Semana {project.week}</small></span></div><StatusPill tone="good"><Check /> Proyecto aprobado</StatusPill></header>
      <section className="project-showcase"><div className="project-showcase__browser"><span className="browser-chrome"><i /><i /><i /></span><div><p>Semana {project.week}</p><h1>{project.title}<em>.</em></h1><span>{project.technology}</span></div></div><div className="project-showcase__actions"><h2>{project.title}</h2><div>{project.deploymentUrl ? <a className="button button--primary" href={project.deploymentUrl} rel="noreferrer" target="_blank">Abrir proyecto <ExternalLink /></a> : null}<a className="button button--ghost" href={project.repositoryUrl} rel="noreferrer" target="_blank"><GitBranch /> Ver código</a></div></div></section>
      <div className="project-detail-grid"><article className="panel reflection"><p className="eyebrow">Objetivo del proyecto</p><h2>Qué construyó</h2><p>{project.description}</p><p>{project.reviewCount} revisiones estructuradas recibidas.</p></article><aside className="panel project-facts"><h3>Sobre la entrega</h3><dl><div><dt>Semana</dt><dd>{project.week}</dd></div><div><dt>Versión</dt><dd><code>{project.commitSha.slice(0, 12)}</code></dd></div><div><dt>Entregado</dt><dd>{project.submittedAt.toLocaleDateString("es-MX")}</dd></div></dl>{!isOwner ? <form action={reportProject} className="form-stack"><label>Motivo del reporte<select name="reason" required><option value="personal_information">Datos personales</option><option value="harassment">Acoso</option><option value="hate_or_discrimination">Odio o discriminación</option><option value="sexual_content">Contenido sexual</option><option value="spam">Spam</option><option value="copyright">Derechos de autor</option><option value="other_safety_concern">Otro riesgo de seguridad</option></select></label><button className="report-link" type="submit"><Shield /> Reportar contenido</button>{query.reportado ? <p className="form-success">Reporte recibido.</p> : null}</form> : null}</aside></div>
      <section className="panel feedback-section"><div className="panel__header"><div><p className="eyebrow">Retroalimentación</p><h2>Revisión con la rúbrica de esta entrega</h2></div><Message /></div>{query.retroalimentacion ? <p className="form-success">Gracias. La revisión estructurada quedó registrada.</p> : null}{isOwner ? <p>Estas son las selecciones de quienes revisaron tu proyecto.</p> : hasReviewed ? <p>Ya registraste una revisión para este intento.</p> : <form action={submitFeedback} className="feedback-form">{project.rubricCriteria.map((criterion) => <fieldset key={criterion.id}><legend>{criterion.title}</legend><p className="form-hint">{criterion.description}</p><div className="choice-row">{marks.map(([value, label]) => <label className="choice-chip" key={value}><input name={`criterion:${criterion.id}`} required type="radio" value={value} /> {label}</label>)}</div></fieldset>)}<fieldset><legend>Siguientes pasos concretos</legend><div className="choice-row">{nextSteps.map(([value, label]) => <label className="choice-chip" key={value}><input name="nextSteps" type="checkbox" value={value} /> {label}</label>)}</div></fieldset><p className="form-hint">No se aceptan comentarios libres ni mensajes privados.</p><button className="button button--primary" type="submit">Enviar revisión</button></form>}{project.feedback.length ? <div className="attention-list">{project.feedback.map((feedback, index) => <div key={feedback.id}><span><strong>Revisión {index + 1}</strong><small>{feedback.criteria.map(({ mark }) => marks.find(([value]) => value === mark)?.[1] ?? mark).join(" · ")}</small></span></div>)}</div> : <p>Todavía no hay revisiones.</p>}</section>
    </div></AppShell>
  );
}
