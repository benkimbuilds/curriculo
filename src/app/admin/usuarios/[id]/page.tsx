import { and, desc, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { BackLink } from "@/components/back-link";
import { Avatar, PageIntro, StatusPill } from "@/components/ui";
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
  return <AppShell userName={session.user.name}><div className="app-content app-content--narrow admin-user-detail"><BackLink href="/admin/usuarios">Volver a usuarios</BackLink><PageIntro eyebrow="Administración" title={account.name} description="Ficha de acceso y trayectoria dentro del programa." />
    <div className="admin-user-detail__overview"><section className="admin-user-card admin-user-card--identity"><div className="admin-user-card__identity"><Avatar color={account.isActive && account.emailVerified ? "green" : "yellow"} name={account.name} size="lg" /><div><p className="eyebrow">Cuenta</p><h2>{account.name}</h2><a href={`mailto:${account.email}`}>{account.email}</a></div></div><div className="admin-user-card__facts"><div><span>Estado</span><StatusPill tone={account.isActive ? (account.emailVerified ? "good" : "warm") : "neutral"}>{account.isActive ? (account.emailVerified ? "Verificada" : "Pendiente") : "Desactivada"}</StatusPill></div><div><span>Registro</span><time dateTime={account.createdAt.toISOString()}>{new Intl.DateTimeFormat("es-MX", { dateStyle: "long" }).format(account.createdAt)}</time></div></div><div className="user-directory__roles">{roles.length ? roles.map(({ role }) => <StatusPill key={role}>{roleLabels[role]}</StatusPill>) : <small>Sin roles asignados</small>}</div></section><section className="admin-user-card"><p className="eyebrow">Aprendizaje</p><h2>{learning.length ? `${learning.length} inscripción${learning.length === 1 ? "" : "es"}` : "Sin inscripción"}</h2>{learning.length ? <div className="admin-user-detail__enrollments">{learning.map((enrollment) => <div key={enrollment.id}><span>{enrollment.mode === "facilitated" ? "Cohorte" : "Autodidacta"}</span><StatusPill tone={enrollment.status === "active" ? "good" : "neutral"}>{enrollment.status}</StatusPill></div>)}</div> : <p className="admin-user-detail__empty">Esta persona todavía no tiene una inscripción.</p>}</section></div>
    <UserRoleManager roles={roles.map(({ role }) => role)} userId={account.id} />
    <section className="admin-user-card admin-user-detail__projects"><div className="panel__header"><div><p className="eyebrow">Entregas recientes</p><h2>{projects.length ? `${projects.length} registradas` : "Sin entregas"}</h2></div></div>{projects.length ? <div className="admin-user-detail__submissions">{projects.map(({ submissions: submission }) => <article key={submission.id}><div><strong>{submission.projectId}</strong><small>Intento {submission.attempt} · {submission.submittedAt.toLocaleDateString("es-MX")}</small></div><StatusPill tone={submission.status === "passed" ? "good" : submission.status === "needs_revision" ? "warm" : "neutral"}>{submission.status}</StatusPill></article>)}</div> : <p className="admin-user-detail__empty">No hay entregas registradas para esta cuenta.</p>}</section>
  </div></AppShell>;
}
