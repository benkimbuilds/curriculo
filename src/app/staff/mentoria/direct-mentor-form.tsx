"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { assignDirectMentorAction, type MentoringActionState } from "@/modules/mentoring/actions";

type Student = { id: string; name: string; email: string };
type Mentor = { id: string; name: string; email: string };
const initialState: MentoringActionState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button className="button button--primary" disabled={pending} type="submit">{pending ? "Asignando…" : "Asignar mentor"}</button>;
}

export function DirectMentorForm({ students, mentors }: { students: Student[]; mentors: Mentor[] }) {
  const [state, formAction] = useActionState(assignDirectMentorAction, initialState);
  useEffect(() => {
    if (state.status === "error") toast.error(state.message);
  }, [state]);
  return <form action={formAction} className="form-stack">
    <label>Estudiante autodidacta<select name="studentUserId" required defaultValue=""><option disabled value="">Selecciona un estudiante</option>{students.map((student) => <option key={student.id} value={student.id}>{student.name} · {student.email}</option>)}</select></label>
    <label>Mentor directo<select name="mentorUserId" required defaultValue=""><option disabled value="">Selecciona un mentor</option>{mentors.map((mentor) => <option key={mentor.id} value={mentor.id}>{mentor.name} · {mentor.email}</option>)}</select></label>
    <SubmitButton />
  </form>;
}
