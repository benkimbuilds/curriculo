"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { createCohortAction, type CohortActionState } from "@/modules/cohorts/actions";

const initialState: CohortActionState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button className="button button--primary" disabled={pending} type="submit">{pending ? "Creando cohorte…" : "Crear cohorte"}</button>;
}

export function CohortCreateForm() {
  const [state, formAction] = useActionState(createCohortAction, initialState);
  useEffect(() => {
    if (state.status === "error") toast.error(state.message);
  }, [state]);
  return <form action={formAction} className="form-stack">
    <label>Nombre<input name="name" required minLength={3} maxLength={160} /></label>
    <label>Identificador<input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="primavera-2027" /></label>
    <label>Inicio<input name="startsAt" required type="date" /></label>
    <label>Fin<input name="endsAt" required type="date" /></label>
    <label>Capacidad<input name="capacity" required type="number" min={1} max={500} defaultValue={100} /></label>
    <SubmitButton />
  </form>;
}
