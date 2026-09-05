import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { SignInForm } from "@/components/auth-forms";

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <AuthShell body="Continúa justo donde te quedaste." footer={<>¿Primera vez por aquí? <Link href="/registro">Crea una cuenta</Link></>} title="Qué bueno verte">
      <SignInForm returnTo={next} />
    </AuthShell>
  );
}
