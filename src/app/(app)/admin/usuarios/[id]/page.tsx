import { and, count, desc, eq, gt } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { BackLink } from "@/components/back-link";
import { Avatar, StatusPill } from "@/components/ui";
import { db } from "@/db";
import { enrollments, roleAssignments, session as authSession, submissions, user } from "@/db/schema";
import { getCurrentSession } from "@/modules/auth/session";
import { requirePermission } from "@/modules/authorization/service";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";
import { UserRoleManager } from "../user-role-manager";
import { UserSecurityActions } from "../user-security-actions";

const roleLabels = {
  student: "Estudiante",
  instructor: "Mentor",
  administrator: "Administración",
  curriculum_editor: "Edición curricular",
  developer_administrator: "Administración técnica",
} as const;

const uuidSchema = z.string().uuid();

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");

  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();

  const organizationId = await resolveDefaultOrganizationId();
  await requirePermission(session.user.id, organizationId, "role:manage");

  const now = new Date();
  const [accountRows, roles, learning, projects, sessionCountRows] = await Promise.all([
    db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, id))
      .limit(1),
    db
      .select({ role: roleAssignments.role })
      .from(roleAssignments)
      .where(and(eq(roleAssignments.userId, id), eq(roleAssignments.organizationId, organizationId))),
    db
      .select({
        id: enrollments.id,
        mode: enrollments.mode,
        status: enrollments.status,
        enrolledAt: enrollments.enrolledAt,
      })
      .from(enrollments)
      .where(eq(enrollments.userId, id))
      .orderBy(desc(enrollments.enrolledAt)),
    db
      .select({
        id: submissions.id,
        projectId: submissions.projectId,
        attempt: submissions.attempt,
        status: submissions.status,
        submittedAt: submissions.submittedAt,
      })
      .from(submissions)
      .innerJoin(enrollments, eq(enrollments.id, submissions.enrollmentId))
      .where(eq(enrollments.userId, id))
      .orderBy(desc(submissions.submittedAt))
      .limit(10),
    db
      .select({ value: count() })
      .from(authSession)
      .where(and(eq(authSession.userId, id), gt(authSession.expiresAt, now))),
  ]);

  const account = accountRows[0];
  if (!account) notFound();

  const activeSessions = sessionCountRows[0]?.value ?? 0;
  const formattedCreatedAt = new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(
    account.createdAt,
  );

  return (
    <div className="app-content app-content--wide admin-user-detail">
      <BackLink href="/admin/usuarios">Volver a usuarios</BackLink>

      <header className="admin-user-hero">
        <div className="admin-user-hero__identity">
          <Avatar
            color={account.isActive && account.emailVerified ? "green" : "yellow"}
            name={account.name}
            size="lg"
          />
          <div className="admin-user-hero__meta">
            <h1>{account.name}</h1>
            <a className="admin-user-hero__email" href={`mailto:${account.email}`}>
              {account.email}
            </a>
            <div className="admin-user-hero__badges">
              <StatusPill
                tone={account.isActive ? (account.emailVerified ? "good" : "warm") : "neutral"}
              >
                {account.isActive ? (account.emailVerified ? "Verificada" : "Pendiente") : "Desactivada"}
              </StatusPill>
              {roles.map(({ role }) => (
                <StatusPill key={role}>{roleLabels[role]}</StatusPill>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-user-hero__stats">
          <div className="admin-user-hero__stat">
            <span>Registro</span>
            <time dateTime={account.createdAt.toISOString()}>{formattedCreatedAt}</time>
          </div>
          <div className="admin-user-hero__stat">
            <span>Sesiones</span>
            <strong>{activeSessions}</strong>
          </div>
          <div className="admin-user-hero__stat">
            <span>Inscripciones</span>
            <strong>{learning.length}</strong>
          </div>
          <div className="admin-user-hero__stat">
            <span>Entregas</span>
            <strong>{projects.length}</strong>
          </div>
        </div>
      </header>

      <div className="admin-user-workspace">
        <div className="admin-user-column">
          <UserRoleManager roles={roles.map(({ role }) => role)} userId={account.id} />

          <section className="admin-user-card">
            <div className="admin-user-card__head">
              <div>
                <p className="eyebrow">Aprendizaje</p>
                <h2>
                  {learning.length
                    ? `${learning.length} inscripción${learning.length === 1 ? "" : "es"}`
                    : "Sin inscripciones"}
                </h2>
              </div>
            </div>
            {learning.length ? (
              <div className="admin-user-detail__enrollments">
                {learning.map((enrollment) => (
                  <div key={enrollment.id}>
                    <div>
                      <strong>{enrollment.mode === "facilitated" ? "Cohorte" : "Autodidacta"}</strong>
                      <small>
                        Inscrito el{" "}
                        {new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(
                          enrollment.enrolledAt,
                        )}
                      </small>
                    </div>
                    <StatusPill tone={enrollment.status === "active" ? "good" : "neutral"}>
                      {enrollment.status}
                    </StatusPill>
                  </div>
                ))}
              </div>
            ) : (
              <p className="admin-user-detail__empty">
                Esta persona todavía no tiene una inscripción activa.
              </p>
            )}
          </section>

          <section className="admin-user-card">
            <div className="admin-user-card__head">
              <div>
                <p className="eyebrow">Actividad académica</p>
                <h2>Entregas recientes</h2>
              </div>
              <small style={{ color: "var(--muted)", fontSize: 12 }}>
                {projects.length} {projects.length === 1 ? "registrada" : "registradas"}
              </small>
            </div>
            {projects.length ? (
              <div className="admin-user-detail__submissions">
                {projects.map((submission) => (
                  <article key={submission.id}>
                    <div>
                      <strong>{submission.projectId}</strong>
                      <small>
                        Intento {submission.attempt} ·{" "}
                        {submission.submittedAt.toLocaleDateString("es-MX")}
                      </small>
                    </div>
                    <StatusPill
                      tone={
                        submission.status === "passed"
                          ? "good"
                          : submission.status === "needs_revision"
                            ? "warm"
                            : "neutral"
                      }
                    >
                      {submission.status}
                    </StatusPill>
                  </article>
                ))}
              </div>
            ) : (
              <p className="admin-user-detail__empty">
                No hay entregas registradas para esta cuenta.
              </p>
            )}
          </section>
        </div>

        <UserSecurityActions
          active={account.isActive}
          activeSessions={activeSessions}
          email={account.email}
          isSelf={account.id === session.user.id}
          userId={account.id}
        />
      </div>
    </div>
  );
}
