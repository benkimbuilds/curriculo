"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Check } from "@/components/icons";
import { completeLessonAction, type LessonActionState } from "../../../../actions";

const initialState: LessonActionState = { status: "idle", message: "" };

function CompletionButton({ alreadyComplete }: { alreadyComplete: boolean }) {
  const { pending } = useFormStatus();
  return <button className={`button ${alreadyComplete ? "button--success" : "button--primary"}`} disabled={pending || alreadyComplete} type="submit"><Check />{pending ? "Guardando…" : alreadyComplete ? "Lección completada" : "Marcar como completada"}</button>;
}

export function LessonCompleteForm({ enrollmentId, lessonId, week, contentVersion, alreadyComplete }: { enrollmentId: string; lessonId: string; week: number; contentVersion: string; alreadyComplete: boolean }) {
  const [state, formAction] = useActionState(completeLessonAction, initialState);
  const complete = alreadyComplete || state.status === "success";
  return <form action={formAction} className="lesson-completion-form"><input name="enrollmentId" type="hidden" value={enrollmentId} /><input name="lessonId" type="hidden" value={lessonId} /><input name="week" type="hidden" value={week} /><input name="contentVersion" type="hidden" value={contentVersion} /><CompletionButton alreadyComplete={complete} />{state.status === "error" ? <small role="alert">{state.message}</small> : null}</form>;
}
