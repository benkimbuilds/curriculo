"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Spark } from "@/components/icons";
import { submitProjectAction, type SubmissionActionState } from "../../actions";

const initialState: SubmissionActionState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button className="button button--primary button--full" disabled={pending} type="submit">{pending ? "Guardando entrega…" : <>Enviar proyecto <Spark /></>}</button>;
}

export function SubmissionForm({ enrollmentId, week }: { enrollmentId: string; week: number }) {
  const [state, formAction] = useActionState(submitProjectAction, initialState);
  return (
    <form action={formAction} className="form-stack">
      <input name="enrollmentId" type="hidden" value={enrollmentId} />
      <input name="week" type="hidden" value={week} />
      <label>Repositorio de GitHub<input name="repositoryUrl" pattern="https://github.com/.+/.+" placeholder="https://github.com/tu-usuario/tu-proyecto" required type="url" /><small>Debe ser un repositorio público.</small></label>
      <label>Commit exacto<input minLength={40} name="commitSha" pattern="[0-9a-fA-F]{40}|[0-9a-fA-F]{64}" placeholder="40 caracteres, por ejemplo: a1b2c3d4…" required /><small>Usaremos esta versión aunque después hagas nuevos cambios.</small></label>
      <label>Tu página publicada<input name="deploymentUrl" placeholder="https://tu-proyecto.pages.dev" required type="url" /></label>
      <label>¿Qué fue lo más difícil?<textarea maxLength={1000} minLength={20} name="reflection" placeholder="Cuéntanos brevemente cómo resolviste un reto…" required rows={5} /></label>
      <label className="check-label"><input name="ownership" required type="checkbox" /><span>Confirmo que este es mi trabajo y que no contiene datos personales sensibles.</span></label>
      <SubmitButton />
      {state.message ? <p className={state.status === "success" ? "form-success" : "form-error"} role="status">{state.message}</p> : null}
    </form>
  );
}
