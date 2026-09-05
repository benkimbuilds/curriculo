import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { ArrowLeft, ArrowRight, Check, Clock, People, Warning } from "@/components/icons";
import { Avatar, Metric, PageIntro, ProgressBar, StatusPill } from "@/components/ui";
import { getCurrentSession } from "@/modules/auth/session";
import { archiveCohortAction, assignStaffAction, inviteLearnersAction, publishAnnouncementAction, setWeekScheduleAction } from "@/modules/cohorts/actions";
import { getCohortDashboard } from "@/modules/staff/db-staff";

function statusLabel(status: string): string {
  return ({ ahead: "Adelantado", on_track: "En ritmo", behind: "Atrasado", complete: "Completo", self_paced: "A su ritmo" } as Record<string, string>)[status] ?? status;
}

export default async function CohortPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ buscar?: string; estado?: string }> }) {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const dashboard = await getCohortDashboard(session.user.id, id, {
    search: query.buscar,
    needsAttention: query.estado === "attention" ? true : query.estado === "ok" ? false : undefined,
  });
  const { cohort, roster } = dashboard;
  const inviteLearners = inviteLearnersAction.bind(null, cohort.id);
  const setSchedule = setWeekScheduleAction.bind(null, cohort.id);
  const announce = publishAnnouncementAction.bind(null, cohort.id);
  const archive = archiveCohortAction.bind(null, cohort.id);
  const assignStaff = assignStaffAction.bind(null, cohort.id);
  const onPace = roster.aggregates.pace.ahead + roster.aggregates.pace.on_track + roster.aggregates.pace.complete;
  const submitted = roster.aggregates.submission.submitted + roster.aggregates.submission.resubmitted + roster.aggregates.submission.accepted;
  return (
    <AppShell role="staff" userName={session.user.name}><div className="app-content"><Link className="back-link" href="/staff"><ArrowLeft /> Volver al resumen</Link><PageIntro description={`${cohort.startsAt.toLocaleDateString("es-MX")} – ${cohort.endsAt.toLocaleDateString("es-MX")} · ${cohort.timezone}`} eyebrow="Cohorte facilitada" title={cohort.name} />
      <div className="metrics-grid"><Metric label="Estudiantes" value={String(roster.aggregates.total)} /><Metric detail="Según avance esperado" label="En ritmo" value={String(onPace)} /><Metric detail="Señales transparentes" label="Atención" value={String(roster.aggregates.needingAttention)} /><Metric label="Proyectos enviados" value={String(submitted)} /></div>
      <section className="panel roster"><div className="panel__header"><div><p className="eyebrow">Seguimiento</p><h2>Estudiantes</h2></div><People /></div><form className="filter-bar" method="get"><label><span className="sr-only">Buscar estudiante</span><input defaultValue={query.buscar} name="buscar" placeholder="Buscar por nombre o correo…" type="search" /></label><select aria-label="Filtrar por estado" defaultValue={query.estado ?? "all"} name="estado"><option value="all">Todos los estados</option><option value="ok">Sin señales de atención</option><option value="attention">Requiere atención</option></select><button className="button button--ghost" type="submit">Filtrar</button></form>
        <div className="roster-table"><div className="roster-table__head"><span>Estudiante</span><span>Avance</span><span>Progreso</span><span>Última actividad</span><span>Estado</span><span /></div>{roster.rows.map((student) => { const percent = student.totalRequiredItems ? Math.round((student.completedRequiredItems / student.totalRequiredItems) * 100) : 0; const needsAttention = student.attentionReasons.length > 0; return <div className="roster-table__row" key={student.userId}><span className="person-cell"><Avatar color={needsAttention ? "clay" : "green"} name={student.displayName} size="sm" /><span><strong>{student.displayName}</strong><small>{student.email}</small></span></span><span>{student.completedRequiredItems} de {student.totalRequiredItems}</span><ProgressBar label={`${percent}%`} value={percent} /><span>{student.lastActivityAt ? student.lastActivityAt.toLocaleDateString("es-MX") : "Sin actividad"}</span><StatusPill tone={needsAttention ? "warm" : "good"}>{needsAttention ? <Warning /> : student.activityStatus === "active" ? <Check /> : <Clock />}{statusLabel(student.paceStatus)} · {student.submissionStatus} · {student.evaluationStatus}</StatusPill><Link aria-label={`Ver seguimiento de ${student.displayName}`} href={`/staff/cohortes/${cohort.id}/estudiantes/${student.userId}`}><ArrowRight /></Link></div>; })}</div>
        {!roster.rows.length ? <p>No hay estudiantes que coincidan con estos filtros.</p> : null}
      </section>
      <section className="staff-grid">
        <article className="panel settings-form"><h2>Agregar estudiantes</h2><p>Las cuentas existentes se agregan de inmediato. Las demás personas reciben una invitación y conservan acceso autodidacta.</p><form action={inviteLearners} className="form-stack"><label>Correos, uno por línea<textarea name="emails" required rows={5} /></label><button className="button button--primary" type="submit">Procesar lista</button></form></article>
        <article className="panel settings-form"><h2>Calendario semanal</h2><form action={setSchedule} className="form-stack"><label>Semana<select name="weekId">{Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={`week-${String(index + 1).padStart(2, "0")}`}>Semana {index + 1}</option>)}</select></label><label>Apertura<input name="opensAt" required type="datetime-local" /></label><label>Entrega<input name="dueAt" required type="datetime-local" /></label><button className="button button--primary" type="submit">Guardar fecha</button></form></article>
        <article className="panel settings-form"><h2>Publicar aviso</h2><form action={announce} className="form-stack"><label>Título<input name="title" required minLength={3} maxLength={180} /></label><label>Mensaje<textarea name="body" required minLength={3} maxLength={5000} rows={5} /></label><button className="button button--primary" type="submit">Publicar aviso</button></form></article>
        <article className="panel settings-form"><h2>Asignar equipo</h2><form action={assignStaff} className="form-stack"><label>Correo de una cuenta verificada<input name="email" required type="email" /></label><label>Rol<select name="role"><option value="instructor">Facilitación</option><option value="administrator">Administración</option><option value="curriculum_editor">Edición curricular</option><option value="developer_administrator">Administración técnica</option></select></label><button className="button button--primary" type="submit">Asignar</button></form></article>
        <article className="panel settings-form"><h2>Cerrar cohorte</h2><p>Archivar evita nuevas operaciones sin borrar el historial.</p><form action={archive}><button className="button button--ghost" type="submit">Archivar cohorte</button></form></article>
      </section>
    </div></AppShell>
  );
}
