import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { RegisterForm } from "@/components/auth-forms";

export default function RegisterPage() {
  return (
    <AuthShell body="Crea tu cuenta y empieza hoy a construir la primera versión de tu idea." footer={<>¿Ya tienes cuenta? <Link href="/iniciar-sesion">Inicia sesión</Link></>} title="Regístrate">
      <RegisterForm />
    </AuthShell>
  );
}
