import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { People, User } from "@/components/icons";
import { Avatar, EmptyState, Metric, PageIntro, StatusPill } from "@/components/ui";
import { getCurrentSession } from "@/modules/auth/session";
import { requirePermission } from "@/modules/authorization/service";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";
import { listCohortCreationCandidates } from "@/modules/cohorts/service";
import { endDirectMentorAction } from "@/modules/mentoring/actions";
import { listDirectStudentsForMentor, listUnmentoredSelfPacedStudents } from "@/modules/mentoring/service";
import { MentoringAssignmentTable } from "./direct-mentor-form";

export default async function MentoringPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  const organizationId = await resolveDefaultOrganizationId();
  await requirePermission(session.user.id, organizationId, "mentoring:manage");
  const [students, candidates, assignedStudents] = await Promise.all([
    listUnmentoredSelfPacedStudents(organizationId),
    listCohortCreationCandidates(organizationId),
    listDirectStudentsForMentor(organizationId, session.user.id),
  ]);
  const mentorIds = new Set(candidates.mentors.map((mentor) => mentor.id));
  const assignableStudents = students.filter((student) => !mentorIds.has(student.id));

  return (
    <AppShell userName={session.user.name}>
      <div className="app-content mentoring-page">
        <PageIntro
          description="Asigna acompañamiento individual a estudiantes que avanzan a su propio ritmo."
          eyebrow="Mentoría"
          title="Mentoría directa"
        />

        <div className="metrics-grid mentoring-page__metrics">
          <Metric detail="Autodidactas pendientes" label="Sin mentor" value={String(assignableStudents.length)} />
          <Metric detail="Con rol de instructor" label="Mentores disponibles" value={String(candidates.mentors.length)} />
          <Metric detail="Mentoría activa" label="Asignados a ti" value={String(assignedStudents.length)} />
        </div>

        <section className="panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Acompañamiento pendiente</p>
              <h2>Estudiantes sin mentor</h2>
            </div>
            <StatusPill tone={assignableStudents.length ? "warm" : "good"}>
              {assignableStudents.length ? "Requieren guía" : "Al día"}
            </StatusPill>
          </div>
          {assignableStudents.length ? (
            <MentoringAssignmentTable mentors={candidates.mentors} students={assignableStudents} />
          ) : (
            <EmptyState
              body="Cuando alguien se inscriba de forma autodidacta sin mentor, aparecerá aquí para asignarlo."
              icon={<People />}
              title="Todos tienen mentor"
            />
          )}
        </section>

        <section className="panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Mi acompañamiento</p>
              <h2>
                {assignedStudents.length} estudiante{assignedStudents.length === 1 ? "" : "s"}
              </h2>
            </div>
            <User />
          </div>
          {assignedStudents.length ? (
            <div className="mentoring-table mentoring-table--assigned">
              <div className="mentoring-table__head">
                <span>Estudiante</span>
                <span>Origen</span>
                <span>Asignado</span>
                <span />
              </div>
              {assignedStudents.map((student) => (
                <div className="mentoring-table__row" key={`${student.id}-${student.cohortId ?? "self-paced"}`}>
                  <div className="person-cell">
                    <Avatar color="green" name={student.name} size="sm" />
                    <span>
                      <strong>{student.name}</strong>
                      <small>{student.email}</small>
                    </span>
                  </div>
                  <span>{student.cohortName ?? "Autodidacta"}</span>
                  <span>{student.assignedAt.toLocaleDateString("es-MX")}</span>
                  <form action={endDirectMentorAction}>
                    <input name="assignmentId" type="hidden" value={student.assignmentId} />
                    <button className="button button--ghost" type="submit">
                      Retirar
                    </button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              body="Los estudiantes que te asignen como mentor directo aparecerán en esta lista."
              icon={<User />}
              title="Sin asignaciones todavía"
            />
          )}
        </section>
      </div>
    </AppShell>
  );
}
