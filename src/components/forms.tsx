"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Check, Send } from "./icons";

export function DemoForm({ children, success = "Listo. Guardamos tus cambios." }: { children: ReactNode; success?: string }) {
  const [submitted, setSubmitted] = useState(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }
  return <form className="form-stack" onSubmit={handleSubmit}>{children}{submitted ? <p className="form-success" role="status"><Check /> {success}</p> : null}</form>;
}

export function CompleteLessonButton() {
  const [done, setDone] = useState(false);
  return <button className={`button ${done ? "button--success" : "button--primary"}`} onClick={() => setDone(true)} type="button"><Check /> {done ? "Lección completada" : "Marcar como completada"}</button>;
}

export function HelpfulToggle({ initial = 12 }: { initial?: number }) {
  const [helpful, setHelpful] = useState(false);
  return <button aria-pressed={helpful} className={`helpful-button ${helpful ? "is-active" : ""}`} onClick={() => setHelpful(!helpful)} type="button">{helpful ? "Te sirvió" : "¿Te sirvió?"} · {initial + (helpful ? 1 : 0)}</button>;
}

export function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <form className="feedback-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
      <fieldset>
        <legend>¿Qué destaca en este proyecto?</legend>
        <div className="choice-row">
          {['Claridad', 'Diseño', 'Código', 'Accesibilidad'].map((label) => <label className="choice-chip" key={label}><input name="strength" type="radio" /> {label}</label>)}
        </div>
      </fieldset>
      <label>Comparte una sugerencia concreta<textarea maxLength={500} name="suggestion" placeholder="Por ejemplo: podrías hacer más claro el mensaje de error…" rows={4} /></label>
      <p className="form-hint">Tu retroalimentación será visible para la persona autora y el equipo facilitador.</p>
      <button className="button button--primary" type="submit"><Send /> Enviar retroalimentación</button>
      {submitted ? <p className="form-success" role="status"><Check /> Gracias. Tu comentario quedó registrado.</p> : null}
    </form>
  );
}
