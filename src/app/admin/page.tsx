import { count, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { ArrowRight } from "@/components/icons";
import { Avatar, Metric, PageIntro, StatusPill } from "@/components/ui";
import { db } from "@/db";
import { enrollments, roleAssignments, user } from "@/db/schema";
import { getCurrentSession } from "@/modules/auth/session";
import { requirePermission } from "@/modules/authorization/service";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";

export default async function AdminPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  const organizationId = await resolveDefaultOrganizationId();
  await requirePermission(session.user.id, organizationId, "role:manage");
  const [[accounts], [activeAccounts], [activeEnrollments], [accessRoles], recentAccounts] = await Promise.all([
    db.select({ value: count() }).from(user),
    db.select({ value: count() }).from(user).where(eq(user.isActive, true)),
    db.select({ value: count() }).from(enrollments).where(eq(enrollments.status, "active")),
    db.select({ value: count() }).from(roleAssignments).where(eq(roleAssignments.organizationId, organizationId)),
    db.select({ id: user.id, name: user.name, email: user.email, emailVerified: user.emailVerified, isActive: user.isActive, createdAt: user.createdAt }).from(user).orderBy(desc(user.createdAt)).limit(6),
  ]);
  return <AppShell userName={session.user.name}><div className="app-content">
    <PageIntro action={<Link className="button button--primary" href="/admin/usuarios">Gestionar usuarios</Link>} description="Panorama de cuentas, acceso e inscripciones de la organización." eyebrow="Administración" title="Resumen de operación" />
    <div className="metrics-grid"><Metric label="Cuentas registradas" value={String(accounts?.value ?? 0)} /><Metric detail="Con acceso disponible" label="Cuentas activas" value={String(activeAccounts?.value ?? 0)} /><Metric detail="En programa vigente" label="Inscripciones activas" value={String(activeEnrollments?.value ?? 0)} /><Metric detail="En la organización" label="Roles asignados" value={String(accessRoles?.value ?? 0)} /></div>
    <section className="panel admin-summary__recent"><div className="panel__header"><div><p className="eyebrow">Actividad reciente</p><h2>Cuentas nuevas</h2></div><Link className="text-link" href="/admin/usuarios">Ver directorio <ArrowRight /></Link></div>
      <div className="admin-summary__accounts">{recentAccounts.map((account) => <Link className="admin-summary__account" href={`/admin/usuarios/${account.id}`} key={account.id}><Avatar color={account.isActive && account.emailVerified ? "green" : "yellow"} name={account.name} size="sm" /><span><strong>{account.name}</strong><small>{account.email}</small></span><StatusPill tone={account.isActive ? (account.emailVerified ? "good" : "warm") : "neutral"}>{account.isActive ? (account.emailVerified ? "Verificada" : "Pendiente") : "Desactivada"}</StatusPill><time dateTime={account.createdAt.toISOString()}>{new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(account.createdAt)}</time><ArrowRight /></Link>)}</div>
    </section>
  </div></AppShell>;
}
