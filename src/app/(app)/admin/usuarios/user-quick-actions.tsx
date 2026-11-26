"use client";

import { Ban, CheckCircle2, Pencil, X } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { quickUserAction, type QuickUserActionState } from "./actions";

const initialState: QuickUserActionState = { status: "idle", message: "" };
const labels = {
  student: "Estudiante",
  instructor: "Mentor",
  administrator: "Administración",
  curriculum_editor: "Edición curricular",
  developer_administrator: "Administración técnica",
};

export function UserQuickActions({
  active,
  email,
  name,
  roles,
  userId,
}: {
  active: boolean;
  email: string;
  name: string;
  roles: Array<keyof typeof labels>;
  userId: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, formAction, pending] = useActionState(quickUserAction, initialState);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      dialog.current?.close();
    }
    if (state.status === "error") toast.error(state.message);
  }, [state]);

  return (
    <>
      <button
        aria-label={`Acciones para ${name}`}
        className="data-table__row-link"
        onClick={() => dialog.current?.showModal()}
        type="button"
      >
        <Pencil />
      </button>

      <dialog className="quick-user-modal" ref={dialog}>
        <div className="quick-user-modal__header">
          <div className="quick-user-modal__title">
            <div className="quick-user-modal__heading-row">
              <h2>Editar usuario</h2>
              <span className={`quick-user-modal__pill${active ? " is-active" : ""}`}>
                {active ? "Activa" : "Desactivada"}
              </span>
            </div>
            <p className="quick-user-modal__subtitle">{email}</p>
          </div>
          <button
            aria-label="Cerrar"
            className="quick-user-modal__close"
            onClick={() => dialog.current?.close()}
            type="button"
          >
            <X />
          </button>
        </div>

        <form action={formAction} className="quick-user-modal__form" id={`quick-edit-${userId}`}>
          <input name="userId" type="hidden" value={userId} />
          <input name="operation" type="hidden" value="update" />

          <label>
            Nombre completo
            <input defaultValue={name} name="name" required />
          </label>

          <fieldset>
            <legend>Roles en la organización</legend>
            <div className="quick-user-modal__roles">
              {(Object.keys(labels) as Array<keyof typeof labels>).map((role) => (
                <label key={role}>
                  <input defaultChecked={roles.includes(role)} name="roles" type="checkbox" value={role} />
                  <span>{labels[role]}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </form>

        <div className="quick-user-modal__footer">
          <form action={formAction}>
            <input name="userId" type="hidden" value={userId} />
            <input name="operation" type="hidden" value="toggle" />
            <input name="active" type="hidden" value={active ? "false" : "true"} />
            <button
              className={active ? "button button--danger quick-user-modal__btn" : "button button--ghost quick-user-modal__btn"}
              disabled={pending}
              title={
                active
                  ? "Cierra sus sesiones y bloquea el acceso sin borrar su historial"
                  : "Restablece el acceso de esta cuenta"
              }
              type="submit"
            >
              {active ? <Ban size={15} /> : <CheckCircle2 size={15} />}
              {active ? "Desactivar cuenta" : "Reactivar cuenta"}
            </button>
          </form>

          <div className="quick-user-modal__footer-actions">
            <button
              className="button button--ghost quick-user-modal__btn"
              disabled={pending}
              onClick={() => dialog.current?.close()}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="button button--primary quick-user-modal__btn"
              disabled={pending}
              form={`quick-edit-${userId}`}
              type="submit"
            >
              {pending ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
