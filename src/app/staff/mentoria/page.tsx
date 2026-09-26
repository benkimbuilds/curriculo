import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { PageIntro, StatusPill } from "@/components/ui";
import { getCurrentSession } from "@/modules/auth/session";
import { requirePermission } from "@/modules/authorization/service";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";
import { listCohortCreationCandidates } from "@/modules/cohorts/service";
import { endDirectMentorAction } from "@/modules/mentoring/actions";
import { listDirectStudentsForMentor, listUnmentoredSelfPacedStudents } from "@/modules/mentoring/service";
import { DirectMentorForm } from "./direct-mentor-form";

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
  return <AppShell userName={session.user.name}><div className="app-content app-content--narrow">
    <PageIntro description="Asigna acompañamiento individual a estudiantes que avanzan a su propio ritmo." eyebrow="Mentoría" title="Mentoría directa" />
    <div className="metrics-grid"><div className="metric"><span className="metric__label">Sin mentor</span><strong className="metric__value">{students.length}</strong></div><div className="metric"><span className="metric__label">Mentores disponibles</span><strong className="metric__value">{candidates.mentors.length}</strong></div></div>
    <section className="panel"><div className="panel__header"><div><p className="eyebrow">Mi acompañamiento</p><h2>{assignedStudents.length} estudiante{assignedStudents.length === 1 ? "" : "s"}</h2></div><StatusPill tone="info">Asignados a ti</StatusPill></div>{assignedStudents.length ? <div className="attention-list">{assignedStudents.map((student) => <article key={`${student.id}-${student.cohortId ?? "self-paced"}`}><strong>{student.name}</strong><small>{student.email} · {student.cohortName ?? "Autodidacta"}</small><small>Asignado el {student.assignedAt.toLocaleDateString("es-MX")}</small><form action={endDirectMentorAction}><input name="assignmentId" type="hidden" value={student.assignmentId} /><button className="button button--ghost" type="submit">Retirar mentoría</button></form></article>)}</div> : <p>Aún no tienes estudiantes con mentoría directa asignados.</p>}</section>
    <section className="panel settings-form"><div className="panel__header"><div><p className="eyebrow">Acompañamiento pendiente</p><h2>Estudiantes autodidactas</h2></div><StatusPill tone={students.length ? "warm" : "good"}>{students.length ? "Requieren guía" : "Al día"}</StatusPill></div>
      {students.length ? <><p>Estas personas tienen una inscripción autodidacta activa y todavía no cuentan con mentor directo.</p><DirectMentorForm mentors={candidates.mentors} students={students} /></> : <p>Todos los estudiantes autodidactas tienen al menos un mentor directo.</p>}
    </section>
  </div></AppShell>;
}
