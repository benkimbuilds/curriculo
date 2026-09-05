import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { RecoveryForm } from "@/components/auth-forms";

export default function RecoveryPage() {
  return (
    <AuthShell body="Escribe el correo de tu cuenta. Si lo encontramos, te enviaremos un enlace seguro." footer={<Link href="/iniciar-sesion">← Volver a iniciar sesión</Link>} title="Recupera tu acceso">
      <RecoveryForm />
    </AuthShell>
  );
}
