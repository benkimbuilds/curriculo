import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { RegisterForm } from "@/components/auth-forms";

export default function RegisterPage() {
  return (
    <AuthShell body="Crea tu cuenta y empieza a aprender hoy. Es gratis, siempre." footer={<>¿Ya tienes cuenta? <Link href="/iniciar-sesion">Inicia sesión</Link></>} title="Empieza tu ruta">
      <RegisterForm />
    </AuthShell>
  );
}
