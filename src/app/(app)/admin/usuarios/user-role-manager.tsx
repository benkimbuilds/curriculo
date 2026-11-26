"use client";

import { Plus, ShieldMinus } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { manageUserRoleAction, type UserRoleActionState } from "./actions";

const initialState: UserRoleActionState = { status: "idle", message: "" };

const roleMeta = {
  student: { label: "Estudiante", detail: "Acceso al programa, lecciones y comunidad" },
  instructor: { label: "Mentor", detail: "Seguimiento de cohortes, mentoría y moderación" },
  curriculum_editor: { label: "Edición curricular", detail: "Auditoría y control editorial del currículo" },
  administrator: { label: "Administración", detail: "Gestión de usuarios, roles y operación" },
  developer_administrator: {
    label: "Administración técnica",
    detail: "Control total de la plataforma y cuentas privilegiadas",
  },
} as const;

type RoleKey = keyof typeof roleMeta;

export function UserRoleManager({ userId, roles }: { userId: string; roles: RoleKey[] }) {
  const [confirmingRole, setConfirmingRole] = useState<RoleKey | null>(null);
  const [state, formAction, pending] = useActionState(manageUserRoleAction, initialState);

  useEffect(() => {
    if (state.status === "success") toast.success(state.message);
    if (state.status === "error") toast.error(state.message);
  }, [state]);

  const activeConfirmingRole =
    confirmingRole && roles.includes(confirmingRole) ? confirmingRole : null;
  const assignable = (Object.keys(roleMeta) as RoleKey[]).filter((role) => !roles.includes(role));

  return (
    <section className="admin-user-card">
      <div className="admin-user-card__head">
        <div>
          <p className="eyebrow">Acceso y permisos</p>
          <h2>Roles de organización</h2>
        </div>
        <small style={{ color: "var(--muted)", fontSize: 12 }}>
          {roles.length} {roles.length === 1 ? "rol activo" : "roles activos"}
        </small>
      </div>

      {roles.length ? (
        <div className="role-manager__list">
          {roles.map((role) => {
            const isConfirming = activeConfirmingRole === role;
            return (
              <div className="role-manager__row" key={role}>
                <div className="role-manager__row-label">
                  <strong>{roleMeta[role].label}</strong>
                  <small>{roleMeta[role].detail}</small>
                </div>
                <div className="role-manager__row-actions">
                  {isConfirming ? (
                    <>
                      <form action={formAction}>
                        <input name="userId" type="hidden" value={userId} />
                        <input name="role" type="hidden" value={role} />
                        <input name="operation" type="hidden" value="revoke" />
                        <input name="confirmed" type="hidden" value="true" />
                        <button className="button button--danger" disabled={pending} type="submit">
                          Confirmar
                        </button>
                      </form>
                      <button
                        className="button button--ghost"
                        disabled={pending}
                        onClick={() => setConfirmingRole(null)}
                        type="button"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      className="button button--ghost"
                      disabled={pending}
                      onClick={() => setConfirmingRole(role)}
                      type="button"
                    >
                      <ShieldMinus size={14} />
                      Revocar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="admin-user-card__copy">Esta cuenta todavía no tiene roles asignados en la organización.</p>
      )}

      {assignable.length ? (
        <form action={formAction} className="role-manager__add">
          <input name="userId" type="hidden" value={userId} />
          <input name="operation" type="hidden" value="grant" />
          <select aria-label="Seleccionar rol para asignar" defaultValue={assignable[0]} name="role">
            {assignable.map((role) => (
              <option key={role} value={role}>
                {roleMeta[role].label}
              </option>
            ))}
          </select>
          <button className="button button--primary" disabled={pending} type="submit">
            <Plus size={15} />
            Asignar rol
          </button>
        </form>
      ) : null}
    </section>
  );
}
