import Link from "next/link";
import type { ReactNode } from "react";
import { AccountMenu } from "./auth/account-menu";
import { BookOpen, Grid, Home, People, Shield, User } from "./icons";
import { Logo } from "./logo";
import { ProgramNavigation } from "./program-navigation";
import { listCurriculumWeeks } from "@/modules/curriculum";

type ShellRole = "student" | "staff" | "admin";

const studentLinks = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/programa", label: "Mi programa", icon: BookOpen },
  { href: "/galeria", label: "Comunidad", icon: Grid },
  { href: "/perfil", label: "Mi perfil", icon: User },
];

const staffLinks = [
  { href: "/staff", label: "Resumen", icon: Home },
  { href: "/staff#cohortes", label: "Cohortes", icon: People },
  { href: "/staff/moderacion", label: "Moderación", icon: Shield },
  { href: "/admin/curriculo", label: "Currículo", icon: BookOpen },
];

export function AppShell({ children, role = "student", userName }: { children: ReactNode; role?: ShellRole; userName?: string }) {
  const links = role === "student" ? studentLinks : staffLinks;
  const weeks = role === "student" ? listCurriculumWeeks().map(({ week, title }) => ({ week, title })) : [];
  const roleLabel = role === "student" ? "Estudiante" : role === "staff" ? "Facilitadora" : "Administración";
  const displayName = userName ?? (role === "student" ? "Mi cuenta" : "Equipo");
  const initials = displayName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="app-frame">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <aside className="sidebar">
        <div className="sidebar__top"><Logo /></div>
        <nav aria-label={role === "student" ? "Área de estudiante" : "Área de equipo"} className="sidebar__nav">
          {links.map(({ href, label, icon: Icon }) => href === "/programa" ? <ProgramNavigation key={href} weeks={weeks} /> : <Link href={href} key={href}><Icon /> <span>{label}</span></Link>)}
        </nav>
        <div className="sidebar__profile">
          <span className="avatar avatar--green avatar--sm">{initials}</span>
          <span><strong>{displayName}</strong><small>{roleLabel}</small></span>
          <AccountMenu showProfile={role === "student"} />
        </div>
      </aside>
      <header className="mobile-app-header"><Logo /><details><summary aria-label="Abrir navegación">Menú</summary><nav>{links.map(({ href, label }) => href === "/programa" ? <ProgramNavigation key={href} weeks={weeks} /> : <Link href={href} key={href}>{label}</Link>)}<AccountMenu showProfile={role === "student"} /></nav></details></header>
      <main className="app-main" id="contenido">{children}</main>
    </div>
  );
}
