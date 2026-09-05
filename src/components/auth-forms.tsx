"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/modules/auth/client";
import { Check } from "./icons";

type FormState = { pending: boolean; message: string; error: boolean };
const initialState: FormState = { pending: false, message: "", error: false };

function Notice({ state }: { state: FormState }) {
  if (!state.message) return null;
  return <p className={state.error ? "form-error" : "form-success"} role="status">{!state.error ? <Check /> : null}{state.message}</p>;
}

export function RegisterForm() {
  const router = useRouter();
  const [state, setState] = useState(initialState);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setState({ pending: true, message: "", error: false });
    const result = await authClient.signUp.email({ name: String(data.get("name")), email: String(data.get("email")), password: String(data.get("password")), callbackURL: "/dashboard" });
    if (result.error) return setState({ pending: false, message: result.error.message ?? "No pudimos crear la cuenta. Revisa tus datos e intenta de nuevo.", error: true });
    router.push("/verifica-tu-correo");
  }
  return <form className="form-stack" onSubmit={submit}><label>¿Cómo te llamamos?<input autoComplete="name" name="name" placeholder="Tu nombre" required /></label><label>Correo electrónico<input autoComplete="email" name="email" placeholder="tu@correo.com" required type="email" /></label><label>Contraseña<input autoComplete="new-password" minLength={10} name="password" placeholder="Mínimo 10 caracteres" required type="password" /></label><label className="check-label"><input name="terms" required type="checkbox" /> <span>Acepto los <Link href="/terminos">términos y reglas de la comunidad</Link> y el <Link href="/privacidad">aviso de privacidad</Link>.</span></label><button className="button button--primary button--full" disabled={state.pending} type="submit">{state.pending ? "Creando cuenta…" : "Crear mi cuenta"}</button><Notice state={state} /></form>;
}

export function SignInForm({ returnTo = "/dashboard" }: { returnTo?: string }) {
  const router = useRouter();
  const [state, setState] = useState(initialState);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setState({ pending: true, message: "", error: false });
    const safeReturnTo = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/dashboard";
    const result = await authClient.signIn.email({ email: String(data.get("email")), password: String(data.get("password")), callbackURL: safeReturnTo });
    if (result.error) return setState({ pending: false, message: "No pudimos iniciar sesión. Revisa tu correo, contraseña y verificación.", error: true });
    router.push(safeReturnTo);
    router.refresh();
  }
  return <form className="form-stack" onSubmit={submit}><label>Correo electrónico<input autoComplete="email" name="email" placeholder="tu@correo.com" required type="email" /></label><label><span className="label-row">Contraseña <Link href="/recuperar">¿La olvidaste?</Link></span><input autoComplete="current-password" name="password" placeholder="Tu contraseña" required type="password" /></label><button className="button button--primary button--full" disabled={state.pending} type="submit">{state.pending ? "Entrando…" : "Entrar"}</button><Notice state={state} /></form>;
}

export function RecoveryForm() {
  const [state, setState] = useState(initialState);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setState({ pending: true, message: "", error: false });
    await authClient.requestPasswordReset({ email: String(data.get("email")), redirectTo: "/restablecer" });
    setState({ pending: false, message: "Si existe una cuenta con ese correo, recibirás las instrucciones en unos minutos.", error: false });
  }
  return <form className="form-stack" onSubmit={submit}><label>Correo electrónico<input autoComplete="email" name="email" placeholder="tu@correo.com" required type="email" /></label><button className="button button--primary button--full" disabled={state.pending} type="submit">{state.pending ? "Enviando…" : "Enviar instrucciones"}</button><Notice state={state} /></form>;
}

export function ResetPasswordForm({ token }: { token?: string }) {
  const [state, setState] = useState<FormState>(token ? initialState : { pending: false, message: "Este enlace no incluye un token válido. Solicita uno nuevo.", error: true });
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password"));
    if (password !== String(data.get("confirmation"))) return setState({ pending: false, message: "Las contraseñas no coinciden.", error: true });
    setState({ pending: true, message: "", error: false });
    const result = await authClient.resetPassword({ newPassword: password, token });
    if (result.error) return setState({ pending: false, message: "El enlace ya no es válido o expiró. Solicita uno nuevo.", error: true });
    setState({ pending: false, message: "Contraseña actualizada. Ya puedes iniciar sesión.", error: false });
  }
  return <form className="form-stack" onSubmit={submit}><label>Nueva contraseña<input autoComplete="new-password" minLength={10} name="password" placeholder="Mínimo 10 caracteres" required type="password" /></label><label>Confirma la contraseña<input autoComplete="new-password" minLength={10} name="confirmation" placeholder="Escríbela otra vez" required type="password" /></label><button className="button button--primary button--full" disabled={state.pending || !token} type="submit">{state.pending ? "Guardando…" : "Guardar contraseña"}</button><Notice state={state} /></form>;
}
