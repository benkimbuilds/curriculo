"use client";

import { useState, type FormEvent } from "react";

import { authClient } from "@/modules/auth/client";

export function ResendVerificationForm() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    await authClient.sendVerificationEmail({ email: String(data.get("email")), callbackURL: "/dashboard" });
    setPending(false);
    setSent(true);
  }
  return (
    <details className="resend-panel">
      <summary>No recibí el correo</summary>
      <form className="resend-form" onSubmit={submit}>
        <p>Escribe la misma dirección que usaste al registrarte.</p>
        <label>Correo de tu cuenta<input autoComplete="email" name="email" placeholder="tu@correo.com" required type="email" /></label>
        <button className="button button--ghost" disabled={pending} type="submit">{pending ? "Enviando…" : "Enviar otro enlace"}</button>
        {sent ? <p className="form-success" role="status">Si encontramos una cuenta pendiente, enviamos un nuevo enlace.</p> : null}
      </form>
    </details>
  );
}
