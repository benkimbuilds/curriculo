"use client";

import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { useAppSession } from "@/components/session/app-session-provider";
import { authClient } from "@/modules/auth/client";

function initialsFrom(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AccountMenu() {
  const { userName, roleLabel, showProfile } = useAppSession();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const label = userName.trim() || "Mi cuenta";
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

export function AppTopbar() {
  const pathname = usePathname();
  if (pathname !== "/dashboard") return null;

  return (
    <header className="app-topbar">
      <AccountMenu />
    </header>
  );
}

export function SidebarAccountFooter() {
  const { userName, roleLabel, showProfile } = useAppSession();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const label = userName.trim() || "Mi cuenta";
  const initials = initialsFrom(label);

  async function signOut() {
    setPending(true);
    await authClient.signOut();
    router.push("/iniciar-sesion");
    router.refresh();
  }

  return (
    <div className="sidebar__account">
      <span className="sidebar__account-avatar" aria-hidden="true" title={label}>
        {initials}
      </span>
      <div className="sidebar__account-meta">
        <strong title={label}>{label}</strong>
        {roleLabel ? <small>{roleLabel}</small> : null}
      </div>
      <div className="sidebar__account-actions">
        {showProfile ? (
          <Link
            aria-label="Mi perfil"
            className="sidebar__account-btn"
            href="/perfil"
            title="Mi perfil"
          >
            <Settings size={17} strokeWidth={1.75} />
          </Link>
        ) : null}
        <button
          aria-label="Cerrar sesión"
          className="sidebar__account-btn"
          disabled={pending}
          onClick={signOut}
          title={pending ? "Saliendo…" : "Cerrar sesión"}
          type="button"
        >
          <LogOut size={17} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
