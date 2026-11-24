"use client";

import { Ban, CheckCircle2, Pencil, X } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { quickUserAction, type QuickUserActionState } from "./actions";

const initialState: QuickUserActionState = { status: "idle", message: "" };
const labels = { student: "Estudiante", instructor: "Mentor", administrator: "Administración", curriculum_editor: "Edición curricular", developer_administrator: "Administración técnica" };

export function UserQuickActions({ active, email, name, roles, userId }: { active: boolean; email: string; name: string; roles: Array<keyof typeof labels>; userId: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, formAction] = useActionState(quickUserAction, initialState);
  useEffect(() => {
    if (state.status === "success") { toast.success(state.message); dialog.current?.close(); }
    if (state.status === "error") toast.error(state.message);
  }, [state]);
  return <><button aria-label={`Acciones para ${name}`} className="data-table__row-link" onClick={() => dialog.current?.showModal()} type="button"><Pencil /></button>
    <dialog className="quick-user-modal" ref={dialog}><div className="quick-user-modal__header"><div><p className="eyebrow">Acción rápida</p><h2>Editar usuario</h2></div><button aria-label="Cerrar" className="quick-user-modal__close" onClick={() => dialog.current?.close()} type="button"><X /></button></div>
      <form action={formAction} className="quick-user-modal__form"><input name="userId" type="hidden" value={userId} /><input name="operation" type="hidden" value="update" /><label>Nombre<input defaultValue={name} name="name" required /></label><label>Correo<input disabled value={email} /></label><fieldset><legend>Roles</legend><div className="quick-user-modal__roles">{(Object.keys(labels) as Array<keyof typeof labels>).map((role) => <label key={role}><input defaultChecked={roles.includes(role)} name="roles" type="checkbox" value={role} />{labels[role]}</label>)}</div></fieldset><div className="quick-user-modal__actions"><button className="button button--primary" type="submit">Guardar cambios</button></div></form>
      <form action={formAction} className="quick-user-modal__danger"><input name="userId" type="hidden" value={userId} /><input name="operation" type="hidden" value="toggle" /><input name="active" type="hidden" value={active ? "false" : "true"} /><p><strong>{active ? "Desactivar cuenta" : "Reactivar cuenta"}</strong><br />{active ? "Cierra sus sesiones y bloquea el acceso, sin borrar su historial." : "Restablece el acceso de esta cuenta."}</p><button className={active ? "button button--danger" : "button button--ghost"} type="submit">{active ? <Ban /> : <CheckCircle2 />}{active ? "Desactivar" : "Reactivar"}</button></form>
    </dialog></>;
}
