"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { manageUserRoleAction, type UserRoleActionState } from "./actions";

const initialState: UserRoleActionState = { status: "idle", message: "" };
const labels = { student: "Estudiante", instructor: "Mentor", administrator: "Administración", curriculum_editor: "Edición curricular", developer_administrator: "Administración técnica" };

export function UserRoleManager({ userId, roles }: { userId: string; roles: Array<keyof typeof labels> }) {
  const [state, formAction] = useActionState(manageUserRoleAction, initialState);
  useEffect(() => {
    if (state.status === "success") toast.success(state.message);
    if (state.status === "error") toast.error(state.message);
  }, [state]);
  const assignable = (Object.keys(labels) as Array<keyof typeof labels>).filter((role) => !roles.includes(role));
  return <section className="panel settings-form"><div className="panel__header"><div><p className="eyebrow">Acceso</p><h2>Roles de organización</h2></div></div>
    {roles.length ? <div className="role-manager__current">{roles.map((role) => <form action={formAction} key={role}><input name="userId" type="hidden" value={userId} /><input name="role" type="hidden" value={role} /><input name="operation" type="hidden" value="revoke" /><label className="check-label"><input name="confirmed" type="checkbox" value="true" /><span>Confirmo revocar {labels[role]}</span></label><button className="button button--ghost" type="submit">Revocar</button></form>)}</div> : <p>Esta cuenta no tiene roles en la organización.</p>}
    {assignable.length ? <form action={formAction} className="form-stack"><input name="userId" type="hidden" value={userId} /><input name="operation" type="hidden" value="grant" /><label>Agregar rol<select name="role">{assignable.map((role) => <option key={role} value={role}>{labels[role]}</option>)}</select></label><button className="button button--primary" type="submit">Asignar rol</button></form> : null}
  </section>;
}
