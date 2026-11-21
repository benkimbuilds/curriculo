"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/modules/auth/client";

function initialsFrom(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AccountMenu({
  showProfile = true,
  userName,
  roleLabel,
}: {
  showProfile?: boolean;
  userName?: string;
  roleLabel?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const label = userName?.trim() || "Mi cuenta";
  const initials = initialsFrom(label);

  async function signOut() {
    setPending(true);
    await authClient.signOut();
    router.push("/iniciar-sesion");
    router.refresh();
  }

  return (
    <details className="account-menu">
      <summary aria-label="Abrir menú de cuenta" className="account-menu__trigger">
        <span className="avatar avatar--green avatar--sm" aria-hidden="true">
          {initials}
        </span>
        <span className="account-menu__meta">
          <strong>{label}</strong>
          {roleLabel ? <small>{roleLabel}</small> : null}
        </span>
      </summary>
      <div>
        {showProfile ? <Link href="/perfil">Mi perfil</Link> : null}
        <button disabled={pending} onClick={signOut} type="button">
          {pending ? "Saliendo…" : "Cerrar sesión"}
        </button>
      </div>
    </details>
  );
}
