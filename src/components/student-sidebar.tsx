"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, BookOpen, Grid2X2, House, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

import { AccountMenu } from "./auth/account-menu";
import { Logo } from "./logo";
import { ProgramNavigation } from "./program-navigation";

const preferenceKey = "ruta:student-sidebar-collapsed";

const links = [
  { href: "/dashboard", label: "Inicio", icon: House },
  { href: "/programa", label: "Mi programa", icon: BookOpen },
  { href: "/galeria", label: "Comunidad", icon: Grid2X2 },
  { href: "/perfil", label: "Mi perfil", icon: UserRound },
];

export function StudentSidebar({ initials, userName, weeks }: { initials: string; userName: string; weeks: { week: number; title: string; completed: boolean }[] }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setCollapsed(window.localStorage.getItem(preferenceKey) === "true");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggle() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(preferenceKey, String(next));
      return next;
    });
  }

  return (
    <aside className={`sidebar${collapsed ? " is-collapsed" : ""}`}>
      <div className="sidebar__top">
        <Logo />
        <Link aria-label="Ruta, inicio" className="sidebar__favicon-link" href="/"><Image alt="" height={26} priority src="/icon.svg" width={26} /></Link>
        <button
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expandir navegación" : "Minimizar navegación"}
          className="sidebar__collapse-toggle"
          onClick={toggle}
          title={collapsed ? "Expandir navegación" : "Minimizar navegación"}
          type="button"
        >
          {collapsed ? <ArrowRight size={16} strokeWidth={2} /> : <ArrowLeft size={16} strokeWidth={2} />}
        </button>
      </div>
      <nav aria-label="Área de estudiante" className="sidebar__nav">
        {links.map(({ href, label, icon: Icon }) => {
          if (href === "/programa") {
            return collapsed
              ? <Link aria-label={label} href={href} key={href} title={label}><Icon /><span>{label}</span></Link>
              : <ProgramNavigation key={href} weeks={weeks} />;
          }
          return <Link href={href} key={href} title={collapsed ? label : undefined}><Icon /><span>{label}</span></Link>;
        })}
      </nav>
      <div className="sidebar__profile">
        <span className="avatar avatar--green avatar--sm">{initials}</span>
        <span><strong>{userName}</strong><small>Estudiante</small></span>
        <AccountMenu compact={collapsed} />
      </div>
    </aside>
  );
}
