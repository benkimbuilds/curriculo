"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { createCohortAction, type CohortActionState } from "@/modules/cohorts/actions";
import type { CohortCreationCandidates } from "@/modules/cohorts/service";

const initialState: CohortActionState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button className="button button--primary" disabled={pending} type="submit">{pending ? "Creando cohorte…" : "Crear cohorte"}</button>;
}

export function CohortCreateForm({ candidates }: { candidates: CohortCreationCandidates }) {
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
    <fieldset>
      <legend>Mentores de la cohorte</legend>
      <p>Estos mentores acompañarán al grupo completo. La mentoría directa de estudiantes se asigna por separado.</p>
      {candidates.mentors.length ? candidates.mentors.map((mentor) => (
        <label key={mentor.id}><input name="mentorIds" type="checkbox" value={mentor.id} /> {mentor.name} <small>{mentor.email}</small></label>
      )) : <p>No hay cuentas con rol de instructor disponibles.</p>}
    </fieldset>
    <fieldset>
      <legend>Estudiantes registrados</legend>
      <p>Las personas seleccionadas se inscriben inmediatamente. Las no seleccionadas pueden agregarse después o recibir una invitación.</p>
      {candidates.learners.length ? candidates.learners.map((learner) => (
        <label key={learner.id}><input name="learnerIds" type="checkbox" value={learner.id} /> {learner.name} <small>{learner.email}</small></label>
      )) : <p>No hay estudiantes verificados disponibles.</p>}
    </fieldset>
    <SubmitButton />
  </form>;
}
