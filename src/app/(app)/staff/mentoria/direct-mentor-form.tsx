"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { Avatar } from "@/components/ui";
import { assignDirectMentorAction, type MentoringActionState } from "@/modules/mentoring/actions";

type Student = { id: string; name: string; email: string };
type Mentor = { id: string; name: string; email: string };
const initialState: MentoringActionState = { status: "idle", message: "" };

function AssignButton() {
  const { pending } = useFormStatus();
  return (
    <button className="button button--primary" disabled={pending} type="submit">
      {pending ? "Asignando…" : "Asignar"}
    </button>
  );
}

function AssignRow({ student, mentors }: { student: Student; mentors: Mentor[] }) {
  const [state, formAction] = useActionState(assignDirectMentorAction, initialState);

  useEffect(() => {
    if (state.status === "error") toast.error(state.message);
    if (state.status === "success") toast.success(state.message);
  }, [state]);

  return (
    <form action={formAction} className="mentoring-table__row">
      <div className="person-cell">
        <Avatar color="yellow" name={student.name} size="sm" />
        <span>
          <strong>{student.name}</strong>
          <small>{student.email}</small>
        </span>
      </div>
      <span>Autodidacta</span>
      <input name="studentUserId" type="hidden" value={student.id} />
      <label className="mentoring-table__mentor">
        <span className="sr-only">Mentor para {student.name}</span>
        <select defaultValue="" name="mentorUserId" required>
          <option disabled value="">
            Selecciona mentor
          </option>
          {mentors.map((mentor) => (
            <option key={mentor.id} value={mentor.id}>
              {mentor.name}
            </option>
          ))}
        </select>
      </label>
      <AssignButton />
    </form>
  );
}

export function MentoringAssignmentTable({
  students,
  mentors,
}: {
  students: Student[];
  mentors: Mentor[];
}) {
  if (!mentors.length) {
    return <p className="form-hint">No hay mentores con rol de instructor disponibles para asignar.</p>;
  }

  return (
    <div className="mentoring-table">
      <div className="mentoring-table__head">
        <span>Estudiante</span>
        <span>Modalidad</span>
        <span>Mentor</span>
        <span />
      </div>
      {students.map((student) => (
        <AssignRow key={student.id} mentors={mentors} student={student} />
      ))}
    </div>
  );
}
