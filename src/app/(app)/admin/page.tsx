import { count, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

import { UserCheck } from "lucide-react";

import { AdminSummaryTabs } from "@/components/admin/admin-summary-tabs";
import { ArrowRight, Compass, Shield } from "@/components/icons";
import { SidebarProgramaIcon, SidebarUsuariosIcon } from "@/components/sidebar-icons";
import { db } from "@/db";
import { enrollments, roleAssignments, user } from "@/db/schema";
import { loadAdminSummaryCharts } from "@/modules/admin/summary-metrics";
import { getCurrentSession } from "@/modules/auth/session";
import { requirePermission } from "@/modules/authorization/service";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";

export default async function AdminPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  const organizationId = await resolveDefaultOrganizationId();
  await requirePermission(session.user.id, organizationId, "role:manage");
  const [[accounts], [activeAccounts], [activeEnrollments], [accessRoles], recentAccounts, charts] =
    await Promise.all([
      db.select({ value: count() }).from(user),
      db.select({ value: count() }).from(user).where(eq(user.isActive, true)),
      db.select({ value: count() }).from(enrollments).where(eq(enrollments.status, "active")),
      db.select({ value: count() }).from(roleAssignments).where(eq(roleAssignments.organizationId, organizationId)),
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
        .orderBy(desc(user.createdAt))
        .limit(6),
      loadAdminSummaryCharts(organizationId),
    ]);

  const totalAccounts = accounts?.value ?? 0;
  const totalActiveAccounts = activeAccounts?.value ?? 0;
  const totalActiveEnrollments = activeEnrollments?.value ?? 0;
  const totalAccessRoles = accessRoles?.value ?? 0;
  const activeRate = totalAccounts > 0 ? Math.round((totalActiveAccounts / totalAccounts) * 100) : 0;
  const rolesPerAccount = totalAccounts > 0 ? (totalAccessRoles / totalAccounts).toFixed(1) : "0.0";

  return (
    <div className="app-content app-content--wide admin-overview">
      <div className="admin-overview__pinned">
        <header className="admin-overview__header">
          <div className="admin-overview__intro">
            <p className="eyebrow">Administración</p>
            <h1>Resumen de operación</h1>
            <p className="lede">Panorama de cuentas, acceso e inscripciones de la organización.</p>
          </div>
          <div className="admin-overview__actions">
            <Link className="button button--secondary" href="/admin/curriculo">
              <Compass />
              Currículo
            </Link>
            <Link className="button button--primary" href="/admin/usuarios">
              <SidebarUsuariosIcon />
              Gestionar usuarios
              <ArrowRight />
            </Link>
          </div>
        </header>

        <section aria-label="Indicadores clave" className="admin-overview__kpis">
        <article className="admin-kpi">
          <div className="admin-kpi__top">
            <span className="admin-kpi__label">Cuentas registradas</span>
            <span aria-hidden="true" className="admin-kpi__icon">
              <SidebarUsuariosIcon />
            </span>
          </div>
          <strong className="admin-kpi__value">{totalAccounts}</strong>
          <div className="admin-kpi__footer">
            <small>Total en la organización</small>
          </div>
        </article>

        <article className="admin-kpi admin-kpi--highlight">
          <div className="admin-kpi__top">
            <span className="admin-kpi__label">Cuentas activas</span>
            <span aria-hidden="true" className="admin-kpi__icon admin-kpi__icon--good">
              <UserCheck strokeWidth={1.8} />
            </span>
          </div>
          <div className="admin-kpi__value-row">
            <strong className="admin-kpi__value">{totalActiveAccounts}</strong>
            <span className="admin-kpi__badge">{activeRate}%</span>
          </div>
          <div className="admin-kpi__footer">
            <div aria-hidden="true" className="admin-kpi__bar">
              <span style={{ width: `${activeRate}%` }} />
            </div>
            <small>Con acceso disponible</small>
          </div>
        </article>

        <article className="admin-kpi">
          <div className="admin-kpi__top">
            <span className="admin-kpi__label">Inscripciones activas</span>
            <span aria-hidden="true" className="admin-kpi__icon">
              <SidebarProgramaIcon />
            </span>
          </div>
          <strong className="admin-kpi__value">{totalActiveEnrollments}</strong>
          <div className="admin-kpi__footer">
            <small>En programa vigente</small>
          </div>
        </article>

        <article className="admin-kpi">
          <div className="admin-kpi__top">
            <span className="admin-kpi__label">Roles asignados</span>
            <span aria-hidden="true" className="admin-kpi__icon">
              <Shield />
            </span>
          </div>
          <div className="admin-kpi__value-row">
            <strong className="admin-kpi__value">{totalAccessRoles}</strong>
            <span className="admin-kpi__meta">{rolesPerAccount} / cuenta</span>
          </div>
          <div className="admin-kpi__footer">
            <small>En la organización</small>
          </div>
        </article>
      </section>
      </div>

      <div className="admin-overview__scroll">
        <AdminSummaryTabs
          accountStatus={charts.accountStatus}
          recentAccounts={recentAccounts.map((account) => ({
            id: account.id,
            name: account.name,
            email: account.email,
            emailVerified: account.emailVerified,
            isActive: account.isActive,
            createdAt: account.createdAt.toISOString(),
          }))}
          roleDistribution={charts.roleDistribution}
          signupsTrend={charts.signupsTrend}
        />
      </div>
    </div>
  );
}
