"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/modules/auth/client";

export function AccountMenu({ showProfile = true }: { showProfile?: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  async function signOut() {
    setPending(true);
    await authClient.signOut();
    router.push("/iniciar-sesion");
    router.refresh();
  }
  return (
    <details className="account-menu">
      <summary aria-label="Abrir menú de cuenta" className="icon-button">•••</summary>
      <div>{showProfile ? <Link href="/perfil">Mi perfil</Link> : null}<button disabled={pending} onClick={signOut} type="button">{pending ? "Saliendo…" : "Cerrar sesión"}</button></div>
    </details>
  );
}
