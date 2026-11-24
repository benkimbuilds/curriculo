import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { getCurrentSession } from "@/modules/auth/session";

// Defensa en profundidad: el shell nunca se renderiza para visitantes anónimos.
// Cada página sigue validando su propio acceso (sesión, rol y permisos).
export default async function AppGroupLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  return <AppShell userName={session.user.name}>{children}</AppShell>;
}
