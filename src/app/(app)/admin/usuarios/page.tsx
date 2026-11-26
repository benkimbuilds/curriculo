import Link from "next/link";
import { redirect } from "next/navigation";

import { CountPill } from "@/components/count-pill";
import { DataTable } from "@/components/data-table";
import {
  FilterBar,
  FilterSearchInput,
  FilterSelect,
  FilterSubmitButton,
} from "@/components/filter-controls";
import { ArrowRight } from "@/components/icons";
import { SidebarUsuariosIcon } from "@/components/sidebar-icons";
import { TablePagination } from "@/components/table-pagination";
import { Avatar, StatusPill } from "@/components/ui";
import { listPaginatedAdminUsers } from "@/modules/admin/user-service";
import { getCurrentSession } from "@/modules/auth/session";
import type { PlatformRole } from "@/modules/authorization/policy";
import { requirePermission } from "@/modules/authorization/service";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";
import { UserQuickActions } from "./user-quick-actions";

const roleLabels: Record<PlatformRole, string> = {
  student: "Estudiante",
  instructor: "Mentor",
  administrator: "Administración",
  curriculum_editor: "Edición curricular",
  developer_administrator: "Administración técnica",
};

const PAGE_SIZE = 10;

function isPlatformRole(value: string | undefined): value is PlatformRole {
  return Boolean(value && value in roleLabels);
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ buscar?: string; rol?: string; pagina?: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");

  const organizationId = await resolveDefaultOrganizationId();
  await requirePermission(session.user.id, organizationId, "role:manage");

  const query = await searchParams;
  const parsedPage = Number.parseInt(query.pagina ?? "1", 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const roleFilter = isPlatformRole(query.rol) ? query.rol : undefined;

  const { items, totalCount, page, pageSize, totalPages } = await listPaginatedAdminUsers({
    organizationId,
    search: query.buscar,
    role: roleFilter,
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  return (
    <div className="app-content app-content--wide">
      <header className="user-directory__header">
        <div>
          <p className="eyebrow">Administración</p>
          <div className="user-directory__title-row">
            <h1>Usuarios</h1>
            <CountPill>
              <SidebarUsuariosIcon />
              <span>
                {totalCount} {totalCount === 1 ? "cuenta" : "cuentas"}
              </span>
            </CountPill>
          </div>
          <p>Cuentas, roles e inscripciones de la organización.</p>
        </div>
        <FilterBar>
          <FilterSearchInput
            defaultValue={query.buscar}
            label="Buscar usuario"
            name="buscar"
            placeholder="Buscar por nombre o correo…"
          />
          <FilterSelect
            defaultValue={query.rol ?? ""}
            label="Filtrar por rol"
            name="rol"
            options={Object.entries(roleLabels).map(([value, label]) => ({ value, label }))}
            placeholder="Todos los roles"
          />
          <FilterSubmitButton>Filtrar</FilterSubmitButton>
        </FilterBar>
      </header>

      <section className="panel user-directory">
        <DataTable
          className="user-directory__table"
          columns={[
            { label: "Persona" },
            { label: "Verificación" },
            { label: "Roles" },
            { label: "Programa" },
            { label: "Registro" },
            { className: "data-table__action", label: <span className="sr-only">Abrir</span> },
          ]}
        >
          {items.map((account) => (
            <tr
              className={account.isActive ? undefined : "user-directory__row--inactive"}
              key={account.id}
            >
              <td>
                <Link className="user-directory__person" href={`/admin/usuarios/${account.id}`}>
                  <Avatar
                    color={account.isActive && account.emailVerified ? "green" : "yellow"}
                    name={account.name}
                    size="sm"
                  />
                  <span>
                    <strong>{account.name}</strong>
                    <small>{account.email}</small>
                  </span>
                </Link>
              </td>
              <td>
                <StatusPill
                  tone={account.isActive ? (account.emailVerified ? "good" : "warm") : "neutral"}
                >
                  {account.isActive
                    ? account.emailVerified
                      ? "Verificada"
                      : "Pendiente"
                    : "Desactivada"}
                </StatusPill>
              </td>
              <td>
                <span className="user-directory__roles">
                  {account.roles.length ? (
                    account.roles.map((role) => (
                      <StatusPill key={role}>{roleLabels[role]}</StatusPill>
                    ))
                  ) : (
                    <small>Sin rol</small>
                  )}
                </span>
              </td>
              <td>
                {account.enrollment ? (
                  <small>
                    {account.enrollment.mode === "facilitated" ? "Cohorte" : "Autodidacta"} ·{" "}
                    {account.enrollment.status}
                  </small>
                ) : (
                  <small>Sin inscripción</small>
                )}
              </td>
              <td>
                <time dateTime={account.createdAt.toISOString()}>
                  {new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(
                    account.createdAt,
                  )}
                </time>
              </td>
              <td className="data-table__action">
                <span className="user-directory__quick-actions">
                  <UserQuickActions
                    active={account.isActive}
                    email={account.email}
                    name={account.name}
                    roles={account.roles}
                    userId={account.id}
                  />
                  <Link
                    aria-label={`Abrir ${account.name}`}
                    className="data-table__row-link"
                    href={`/admin/usuarios/${account.id}`}
                  >
                    <ArrowRight />
                  </Link>
                </span>
              </td>
            </tr>
          ))}
        </DataTable>

        <TablePagination
          basePath="/admin/usuarios"
          page={page}
          pageSize={pageSize}
          searchParams={{ buscar: query.buscar, rol: roleFilter }}
          totalCount={totalCount}
          totalPages={totalPages}
        />
      </section>
    </div>
  );
}
