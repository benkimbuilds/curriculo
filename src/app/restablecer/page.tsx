import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { ResetPasswordForm } from "@/components/auth-forms";

export default async function ResetPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <AuthShell body="Elige una contraseña nueva que no uses en otros sitios." footer={<Link href="/iniciar-sesion">Volver a iniciar sesión</Link>} title="Crea una nueva contraseña">
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
