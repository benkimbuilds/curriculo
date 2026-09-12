import { and, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { PageIntro, StatusPill } from "@/components/ui";
import { db } from "@/db";
import { enrollments, roleAssignments, submissions, user } from "@/db/schema";
import { getCurrentSession } from "@/modules/auth/session";
import { requirePermission } from "@/modules/authorization/service";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";
import { UserRoleManager } from "../user-role-manager";

const roleLabels = { student: "Estudiante", instructor: "Mentor", administrator: "Administración", curriculum_editor: "Edición curricular", developer_administrator: "Administración técnica" } as const;

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  const { id } = await params;
  const organizationId = await resolveDefaultOrganizationId();
  await requirePermission(session.user.id, organizationId, "role:manage");
  const [account] = await db.select().from(user).where(eq(user.id, id)).limit(1);
  if (!account) notFound();
  const [roles, learning, projects] = await Promise.all([
    db.select({ role: roleAssignments.role }).from(roleAssignments).where(and(eq(roleAssignments.userId, id), eq(roleAssignments.organizationId, organizationId))),
    db.select().from(enrollments).where(eq(enrollments.userId, id)).orderBy(desc(enrollments.enrolledAt)),
    db.select().from(submissions).innerJoin(enrollments, eq(enrollments.id, submissions.enrollmentId)).where(eq(enrollments.userId, id)).orderBy(desc(submissions.submittedAt)).limit(10),
  ]);
  return <AppShell userName={session.user.name}><div className="app-content app-content--narrow"><Link className="back-link" href="/admin/usuarios">Volver a usuarios</Link><PageIntro eyebrow="Administración" title={account.name} description={account.email} />
    <div className="profile-grid"><section className="panel"><p className="eyebrow">Cuenta</p><h2>{account.emailVerified ? "Correo verificado" : "Correo pendiente de verificar"}</h2><p>Registro: {new Intl.DateTimeFormat("es-MX", { dateStyle: "long" }).format(account.createdAt)}</p><div className="user-directory__roles">{roles.map(({ role }) => <StatusPill key={role}>{roleLabels[role]}</StatusPill>)}</div></section><section className="panel"><p className="eyebrow">Aprendizaje</p><h2>{learning.length ? `${learning.length} inscripción${learning.length === 1 ? "" : "es"}` : "Sin inscripción"}</h2>{learning.map((enrollment) => <p key={enrollment.id}>{enrollment.mode === "facilitated" ? "Cohorte" : "Autodidacta"} · {enrollment.status}</p>)}</section></div>
    <UserRoleManager roles={roles.map(({ role }) => role)} userId={account.id} />
    <section className="panel"><div className="panel__header"><div><p className="eyebrow">Entregas recientes</p><h2>{projects.length}</h2></div></div>{projects.length ? <div className="attention-list">{projects.map(({ submissions: submission }) => <article key={submission.id}><strong>{submission.projectId} · intento {submission.attempt}</strong><p>{submission.status} · {submission.submittedAt.toLocaleDateString("es-MX")}</p></article>)}</div> : <p>No hay entregas registradas.</p>}</section>
  </div></AppShell>;
}
