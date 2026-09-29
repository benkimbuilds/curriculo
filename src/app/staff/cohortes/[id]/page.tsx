import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { BackLink } from "@/components/back-link";
import { ArrowRight, Check, Clock, People, Warning } from "@/components/icons";
import { Avatar, EmptyState, Metric, PageIntro, ProgressBar, StatusPill } from "@/components/ui";
import { getCurrentSession } from "@/modules/auth/session";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";
import {
  archiveCohortAction,
  assignStaffAction,
  inviteLearnersAction,
  publishAnnouncementAction,
  setWeekScheduleAction,
} from "@/modules/cohorts/actions";
import { listCohortCreationCandidates } from "@/modules/cohorts/service";
import { assignCohortDirectMentorAction } from "@/modules/mentoring/actions";
import { getCohortDashboard } from "@/modules/staff/db-staff";
import type {
  ActivityStatus,
  AttentionReason,
  EvaluationStatus,
  PaceStatus,
  SubmissionStatus,
} from "@/modules/staff/types";

const paceLabels: Record<PaceStatus, string> = {
  ahead: "Adelantado",
  on_track: "En ritmo",
  behind: "Atrasado",
  complete: "Completo",
  self_paced: "A su ritmo",
};

const activityLabels: Record<ActivityStatus, string> = {
  active: "Activo",
  inactive: "Inactivo",
  no_activity: "Sin actividad",
};

const submissionLabels: Record<SubmissionStatus, string> = {
  not_started: "Sin entrega",
  draft: "Borrador",
  submitted: "Enviado",
  resubmitted: "Reenviado",
  accepted: "Aceptado",
};

const evaluationLabels: Record<EvaluationStatus, string> = {
  not_applicable: "Sin evaluación",
  pending: "Pendiente",
  running: "En curso",
  passed: "Aprobado",
  failed: "No aprobado",
  needs_review: "Requiere revisión",
  error: "Error",
  overridden: "Anulado",
};

const attentionLabels: Record<AttentionReason, string> = {
  behind: "Atraso",
  inactive: "Sin actividad reciente",
  overdue_work: "Trabajo vencido",
  evaluation_failed: "Evaluación fallida",
  needs_review: "Revisión pendiente",
};

function formatDate(date: Date, timeZone = "America/Mexico_City") {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone,
  }).format(date);
}

export default async function CohortPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ buscar?: string; estado?: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const dashboard = await getCohortDashboard(session.user.id, id, {
    search: query.buscar,
    needsAttention: query.estado === "attention" ? true : query.estado === "ok" ? false : undefined,
  });
  const candidates = await listCohortCreationCandidates(await resolveDefaultOrganizationId());
  const { cohort, roster } = dashboard;
  const inviteLearners = inviteLearnersAction.bind(null, cohort.id);
  const setSchedule = setWeekScheduleAction.bind(null, cohort.id);
  const announce = publishAnnouncementAction.bind(null, cohort.id);
  const archive = archiveCohortAction.bind(null, cohort.id);
  const assignStaff = assignStaffAction.bind(null, cohort.id);
  const assignCohortMentor = assignCohortDirectMentorAction.bind(null, cohort.id);
  const onPace =
    roster.aggregates.pace.ahead +
    roster.aggregates.pace.on_track +
    roster.aggregates.pace.complete;
  const submitted =
    roster.aggregates.submission.submitted +
    roster.aggregates.submission.resubmitted +
    roster.aggregates.submission.accepted;
  const filterEstado = query.estado ?? "all";

  return (
    <AppShell userName={session.user.name}>
      <div className="app-content cohort-page">
        <BackLink href="/staff">Volver al resumen</BackLink>
        <PageIntro
          description={`${formatDate(cohort.startsAt, cohort.timezone)} – ${formatDate(cohort.endsAt, cohort.timezone)} · ${cohort.timezone}`}
          eyebrow="Cohorte facilitada"
          title={cohort.name}
        />

        <div className="metrics-grid">
          <Metric label="Estudiantes" value={String(roster.aggregates.total)} />
          <Metric detail="Según avance esperado" label="En ritmo" value={String(onPace)} />
          <Metric
            detail="Sin actividad, atrasos o revisión"
            label="Atención"
            value={String(roster.aggregates.needingAttention)}
          />
          <Metric label="Proyectos enviados" value={String(submitted)} />
        </div>

        <section className="panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Seguimiento</p>
              <h2>Estudiantes</h2>
            </div>
            <StatusPill tone={roster.aggregates.needingAttention ? "warm" : "good"}>
              {roster.aggregates.needingAttention
                ? `${roster.aggregates.needingAttention} requieren atención`
                : "Al día"}
            </StatusPill>
          </div>

          <form className="filter-bar cohort-page__filters" method="get">
            <label>
              <span className="sr-only">Buscar estudiante</span>
              <input
                defaultValue={query.buscar}
                name="buscar"
                placeholder="Buscar por nombre o correo…"
                type="search"
              />
            </label>
            <select aria-label="Filtrar por estado" defaultValue={filterEstado} name="estado">
              <option value="all">Todos los estados</option>
              <option value="ok">Sin señales de atención</option>
              <option value="attention">Requiere atención</option>
            </select>
            <button className="button button--ghost" type="submit">
              Filtrar
            </button>
          </form>

          {roster.rows.length ? (
            <div className="cohort-roster">
              {roster.rows.map((student) => {
                const percent = student.totalRequiredItems
                  ? Math.round((student.completedRequiredItems / student.totalRequiredItems) * 100)
                  : 0;
                const needsAttention = student.attentionReasons.length > 0;
                return (
                  <article className="cohort-roster__card" key={student.userId}>
                    <div className="cohort-roster__identity">
                      <Avatar
                        color={needsAttention ? "clay" : "green"}
                        name={student.displayName}
                        size="sm"
                      />
                      <div>
                        <strong>{student.displayName}</strong>
                        <small>{student.email}</small>
                      </div>
                      <StatusPill tone={needsAttention ? "warm" : "good"}>
                        {needsAttention ? <Warning /> : student.activityStatus === "active" ? <Check /> : <Clock />}
                        {needsAttention
                          ? attentionLabels[student.attentionReasons[0]]
                          : paceLabels[student.paceStatus]}
                      </StatusPill>
                    </div>

                    <div className="cohort-roster__progress">
                      <ProgressBar
                        label={`${student.completedRequiredItems} de ${student.totalRequiredItems} · ${percent}%`}
                        value={percent}
                      />
                      <p>
                        Última actividad:{" "}
                        {student.lastActivityAt
                          ? formatDate(student.lastActivityAt, cohort.timezone)
                          : "sin registro"}
                        {" · "}
                        {activityLabels[student.activityStatus]}
                        {" · "}
                        {submissionLabels[student.submissionStatus]}
                        {" · "}
                        {evaluationLabels[student.evaluationStatus]}
                      </p>
                      {needsAttention ? (
                        <ul className="cohort-roster__signals">
                          {student.attentionReasons.map((reason) => (
                            <li key={reason}>{attentionLabels[reason]}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>

                    <div className="cohort-roster__mentor">
                      <p>
                        Mentor:{" "}
                        <strong>
                          {student.directMentors.length
                            ? student.directMentors.map((mentor) => mentor.name).join(", ")
                            : "Sin mentor"}
                        </strong>
                      </p>
                      <form action={assignCohortMentor} className="cohort-roster__mentor-form">
                        <input name="studentUserId" type="hidden" value={student.userId} />
                        <label>
                          <span className="sr-only">Mentor para {student.displayName}</span>
                          <select aria-label={`Mentor para ${student.displayName}`} defaultValue="" name="mentorUserId">
                            <option disabled value="">
                              Asignar o cambiar
                            </option>
                            {candidates.mentors.map((mentor) => (
                              <option key={mentor.id} value={mentor.id}>
                                {mentor.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <button className="button button--ghost" type="submit">
                          Guardar
                        </button>
                      </form>
                    </div>

                    <Link
                      className="cohort-roster__link"
                      href={`/staff/cohortes/${cohort.id}/estudiantes/${student.userId}`}
                    >
                      Ver seguimiento
                      <ArrowRight />
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState
              body={
                filterEstado === "attention"
                  ? "Nadie coincide con el filtro de atención. Prueba con todos los estados."
                  : "Cuando haya estudiantes inscritos o que coincidan con la búsqueda, aparecerán aquí."
              }
              icon={<People />}
              title="Sin estudiantes en este filtro"
            />
          )}
        </section>

        <section className="cohort-tools">
          <article className="panel settings-form">
            <h2>Agregar estudiantes</h2>
            <p>
              Las cuentas existentes se agregan de inmediato. Las demás personas reciben una
              invitación y conservan acceso autodidacta.
            </p>
            <form action={inviteLearners} className="form-stack">
              <label>
                Correos, uno por línea
                <textarea name="emails" required rows={5} />
              </label>
              <button className="button button--primary" type="submit">
                Procesar lista
              </button>
            </form>
          </article>

          <article className="panel settings-form">
            <h2>Calendario semanal</h2>
            <form action={setSchedule} className="form-stack">
              <label>
                Semana
                <select name="weekId">
                  {Array.from({ length: 12 }, (_, index) => (
                    <option
                      key={index + 1}
                      value={`week-${String(index + 1).padStart(2, "0")}`}
                    >
                      Semana {index + 1}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Apertura
                <input name="opensAt" required type="datetime-local" />
              </label>
              <label>
                Entrega
                <input name="dueAt" required type="datetime-local" />
              </label>
              <button className="button button--primary" type="submit">
                Guardar fecha
              </button>
            </form>
          </article>

          <article className="panel settings-form">
            <h2>Publicar aviso</h2>
            <form action={announce} className="form-stack">
              <label>
                Título
                <input maxLength={180} minLength={3} name="title" required />
              </label>
              <label>
                Mensaje
                <textarea maxLength={5000} minLength={3} name="body" required rows={5} />
              </label>
              <button className="button button--primary" type="submit">
                Publicar aviso
              </button>
            </form>
          </article>

          <article className="panel settings-form">
            <h2>Asignar equipo</h2>
            <form action={assignStaff} className="form-stack">
              <label>
                Correo de una cuenta verificada
                <input name="email" required type="email" />
              </label>
              <label>
                Rol
                <select name="role">
                  <option value="instructor">Facilitación</option>
                  <option value="administrator">Administración</option>
                  <option value="curriculum_editor">Edición curricular</option>
                  <option value="developer_administrator">Administración técnica</option>
                </select>
              </label>
              <button className="button button--primary" type="submit">
                Asignar
              </button>
            </form>
          </article>

          <article className="panel settings-form">
            <h2>Mentoría directa</h2>
            <p>
              La mentoría personal se gestiona por estudiante y también cubre a quienes avanzan de
              forma autodidacta.
            </p>
            <Link className="button button--ghost" href="/staff/mentoria">
              Gestionar mentoría directa <ArrowRight />
            </Link>
          </article>

          <article className="panel settings-form">
            <h2>Cerrar cohorte</h2>
            <p>Archivar evita nuevas operaciones sin borrar el historial.</p>
            <form action={archive}>
              <button className="button button--ghost" type="submit">
                Archivar cohorte
              </button>
            </form>
          </article>
        </section>
      </div>
    </AppShell>
  );
}
