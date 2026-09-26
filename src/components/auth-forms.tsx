"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/modules/auth/client";

const initialState = { pending: false };

export function RegisterForm() {
  const router = useRouter();
  const [state, setState] = useState(initialState);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setState({ pending: true });
    try {
      const result = await authClient.signUp.email({ name: String(data.get("name")), email: String(data.get("email")), password: String(data.get("password")), callbackURL: "/dashboard" });
      if (result.error) return toast.error(result.error.message ?? "No pudimos crear la cuenta. Revisa tus datos e intenta de nuevo.");
      toast.success("Cuenta creada. Revisa tu correo para verificarla.");
      router.push("/verifica-tu-correo");
    } catch {
      toast.error("No pudimos crear la cuenta. Intenta de nuevo.");
    } finally {
      setState({ pending: false });
    }
  }
  return <form className="form-stack" onSubmit={submit}><label>¿Cómo te llamamos?<input autoComplete="name" name="name" placeholder="Tu nombre" required /></label><label>Correo electrónico<input autoComplete="email" name="email" placeholder="tu@correo.com" required type="email" /></label><label>Contraseña<input autoComplete="new-password" minLength={10} name="password" placeholder="Mínimo 10 caracteres" required type="password" /></label><label className="check-label"><input name="terms" required type="checkbox" /> <span>Acepto los <Link href="/terminos">términos y reglas de la comunidad</Link> y el <Link href="/privacidad">aviso de privacidad</Link>.</span></label><button className="button button--primary button--full" disabled={state.pending} type="submit">{state.pending ? "Creando cuenta…" : "Crear mi cuenta"}</button></form>;
}

export function SignInForm({ returnTo = "/dashboard" }: { returnTo?: string }) {
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setState({ pending: true });
    const safeReturnTo = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/dashboard";
    try {
      const result = await authClient.signIn.email({ email: String(data.get("email")), password: String(data.get("password")), callbackURL: safeReturnTo });
      if (result.error) return toast.error("No pudimos iniciar sesión. Revisa tu correo, contraseña y verificación.");
      toast.success("Sesión iniciada.");
      router.push(safeReturnTo);
      router.refresh();
    } catch {
      toast.error("No pudimos iniciar sesión. Intenta de nuevo.");
    } finally {
      setState({ pending: false });
    }
  }
  return (
    <form className="form-stack" onSubmit={submit}>
      <label>Correo electrónico<input autoComplete="email" name="email" placeholder="tu@correo.com" required type="email" /></label>
      <label>
        <span className="label-row">Contraseña <Link href="/recuperar">¿La olvidaste?</Link></span>
        <span className="password-field">
          <input autoComplete="current-password" id="sign-in-password" name="password" placeholder="Tu contraseña" required type={showPassword ? "text" : "password"} />
          <button
            aria-controls="sign-in-password"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={showPassword}
            className="password-field__toggle"
            onClick={() => setShowPassword((visible) => !visible)}
            type="button"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </span>
      </label>
      <button className="button button--primary button--full" disabled={state.pending} type="submit">{state.pending ? "Entrando…" : "Entrar"}</button>
    </form>
  );
}

export function RecoveryForm() {
  const [state, setState] = useState(initialState);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setState({ pending: true });
    try {
      const result = await authClient.requestPasswordReset({ email: String(data.get("email")), redirectTo: "/restablecer" });
      if (result.error) return toast.error("No pudimos enviar las instrucciones. Intenta de nuevo.");
      toast.success("Si existe una cuenta con ese correo, recibirás las instrucciones en unos minutos.");
    } catch {
      toast.error("No pudimos enviar las instrucciones. Intenta de nuevo.");
    } finally {
      setState({ pending: false });
    }
  }
  return <form className="form-stack" onSubmit={submit}><label>Correo electrónico<input autoComplete="email" name="email" placeholder="tu@correo.com" required type="email" /></label><button className="button button--primary button--full" disabled={state.pending} type="submit">{state.pending ? "Enviando…" : "Enviar instrucciones"}</button></form>;
}

export function ResetPasswordForm({ token }: { token?: string }) {
  const [state, setState] = useState(initialState);
  useEffect(() => {
    if (!token) toast.error("Este enlace no incluye un token válido. Solicita uno nuevo.");
  }, [token]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return toast.error("Este enlace no incluye un token válido. Solicita uno nuevo.");
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password"));
    if (password !== String(data.get("confirmation"))) return toast.error("Las contraseñas no coinciden.");
    setState({ pending: true });
    try {
      const result = await authClient.resetPassword({ newPassword: password, token });
      if (result.error) return toast.error("El enlace ya no es válido o expiró. Solicita uno nuevo.");
      toast.success("Contraseña actualizada. Ya puedes iniciar sesión.");
    } catch {
      toast.error("No pudimos actualizar la contraseña. Intenta de nuevo.");
    } finally {
      setState({ pending: false });
    }
  }
  return <form className="form-stack" onSubmit={submit}><label>Nueva contraseña<input autoComplete="new-password" minLength={10} name="password" placeholder="Mínimo 10 caracteres" required type="password" /></label><label>Confirma la contraseña<input autoComplete="new-password" minLength={10} name="confirmation" placeholder="Escríbela otra vez" required type="password" /></label><button className="button button--primary button--full" disabled={state.pending || !token} type="submit">{state.pending ? "Guardando…" : "Guardar contraseña"}</button></form>;
}
