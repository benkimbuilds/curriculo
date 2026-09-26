import { desc, eq, inArray } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { DataTable } from "@/components/data-table";
import { ArrowRight } from "@/components/icons";
import { Avatar, PageIntro, StatusPill } from "@/components/ui";
import { db } from "@/db";
import { enrollments, roleAssignments, user } from "@/db/schema";
import { getCurrentSession } from "@/modules/auth/session";
import { requirePermission } from "@/modules/authorization/service";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";
import { UserQuickActions } from "./user-quick-actions";

const roleLabels = {
  student: "Estudiante",
  instructor: "Mentor",
  administrator: "Administración",
  curriculum_editor: "Edición curricular",
  developer_administrator: "Administración técnica",
} as const;

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ buscar?: string; rol?: string }> }) {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  const organizationId = await resolveDefaultOrganizationId();
  await requirePermission(session.user.id, organizationId, "role:manage");
  const query = await searchParams;
  const search = query.buscar?.trim().toLocaleLowerCase() ?? "";

  const accounts = await db.select({
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    isActive: user.isActive,
    createdAt: user.createdAt,
  }).from(user).orderBy(desc(user.createdAt));
  const accountIds = accounts.map(({ id }) => id);
  const [roles, learning] = accountIds.length ? await Promise.all([
    db.select({ userId: roleAssignments.userId, role: roleAssignments.role })
      .from(roleAssignments)
      .where(eq(roleAssignments.organizationId, organizationId)),
    db.select({ userId: enrollments.userId, status: enrollments.status, mode: enrollments.mode })
      .from(enrollments)
      .where(inArray(enrollments.userId, accountIds)),
  ]) : [[], []];
  const rolesByUser = new Map<string, (typeof roles)[number]["role"][]>();
  for (const role of roles) rolesByUser.set(role.userId, [...(rolesByUser.get(role.userId) ?? []), role.role]);
  const enrollmentByUser = new Map<string, (typeof learning)[number]>();
  for (const enrollment of learning) {
    if (!enrollmentByUser.has(enrollment.userId) || enrollment.status === "active") enrollmentByUser.set(enrollment.userId, enrollment);
  }

  const visibleAccounts = accounts.filter((account) => {
    const roles = rolesByUser.get(account.id) ?? [];
    return (!search || `${account.name} ${account.email}`.toLocaleLowerCase().includes(search))
      && (!query.rol || roles.includes(query.rol as typeof roles[number]));
  });
  return <AppShell userName={session.user.name}><div className="app-content app-content--wide">
    <PageIntro eyebrow="Administración" title="Usuarios" description="Consulta cuentas, roles e inscripciones actuales. Los cambios de acceso se realizan mediante flujos autorizados." />
    <section className="panel user-directory"><div className="panel__header"><div><p className="eyebrow">Directorio</p><h2>{visibleAccounts.length} cuentas</h2></div><StatusPill tone="info">Organización actual</StatusPill></div><form className="filter-bar" method="get"><label><span className="sr-only">Buscar usuario</span><input defaultValue={query.buscar} name="buscar" placeholder="Buscar por nombre o correo…" type="search" /></label><select defaultValue={query.rol ?? ""} name="rol"><option value="">Todos los roles</option>{Object.entries(roleLabels).map(([role, label]) => <option key={role} value={role}>{label}</option>)}</select><button className="button button--ghost" type="submit">Filtrar</button></form>
      <DataTable className="user-directory__table" columns={[{ label: "Persona" }, { label: "Verificación" }, { label: "Roles" }, { label: "Programa" }, { label: "Registro" }, { className: "data-table__action", label: <span className="sr-only">Abrir</span> }]}>
        {visibleAccounts.map((account) => {
          const accountRoles = rolesByUser.get(account.id) ?? [];
          const enrollment = enrollmentByUser.get(account.id);
          return <tr className={account.isActive ? undefined : "user-directory__row--inactive"} key={account.id}><td><Link className="user-directory__person" href={`/admin/usuarios/${account.id}`}><Avatar color={account.isActive && account.emailVerified ? "green" : "yellow"} name={account.name} size="sm" /><span><strong>{account.name}</strong><small>{account.email}</small></span></Link></td><td><StatusPill tone={account.isActive ? (account.emailVerified ? "good" : "warm") : "neutral"}>{account.isActive ? (account.emailVerified ? "Verificada" : "Pendiente") : "Desactivada"}</StatusPill></td><td><span className="user-directory__roles">{accountRoles.length ? accountRoles.map((role) => <StatusPill key={role}>{roleLabels[role]}</StatusPill>) : <small>Sin rol</small>}</span></td><td>{enrollment ? <small>{enrollment.mode === "facilitated" ? "Cohorte" : "Autodidacta"} · {enrollment.status}</small> : <small>Sin inscripción</small>}</td><td><time dateTime={account.createdAt.toISOString()}>{new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(account.createdAt)}</time></td><td className="data-table__action"><span className="user-directory__quick-actions"><UserQuickActions active={account.isActive} email={account.email} name={account.name} roles={accountRoles} userId={account.id} /><Link aria-label={`Abrir ${account.name}`} className="data-table__row-link" href={`/admin/usuarios/${account.id}`}><ArrowRight /></Link></span></td></tr>;
        })}
      </DataTable>
    </section>
  </div></AppShell>;
}
