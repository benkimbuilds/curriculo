"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";

import { Compass, People, Shield } from "./icons";
import { Logo } from "./logo";
import { ProgramNavigation } from "./program-navigation";
import {
  SidebarComunidadIcon,
  SidebarInicioIcon,
  SidebarMentoriaIcon,
  SidebarPerfilIcon,
  SidebarProgramaIcon,
  SidebarResumenIcon,
  SidebarUsuariosIcon,
} from "./sidebar-icons";

const preferenceKey = "ruta:sidebar-collapsed";
const exactMatchRoutes = new Set(["/dashboard", "/staff", "/admin"]);

function isLinkActive(href: string, pathname: string): boolean {
  if (href === "/programa") {
    return pathname === "/programa" || pathname.startsWith("/programa/") || /^\/proyectos\/\d+\/entrega/.test(pathname);
  }
  if (exactMatchRoutes.has(href)) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export type SidebarLink = {
  href: string;
  label: string;
  icon: "book" | "compass" | "grid" | "home" | "message" | "people" | "shield" | "summary" | "user" | "users";
};

const icons: Record<SidebarLink["icon"], ComponentType<{ className?: string }>> = {
  book: SidebarProgramaIcon,
  compass: Compass,
  grid: SidebarComunidadIcon,
  home: SidebarInicioIcon,
  message: SidebarMentoriaIcon,
  people: People,
  shield: Shield,
  summary: SidebarResumenIcon,
  user: SidebarPerfilIcon,
  users: SidebarUsuariosIcon,
};

export function AppSidebar({
  links,
  roleLabel,
  weeks,
}: {
  links: SidebarLink[];
  roleLabel: string;
  weeks: { week: number; title: string; completed?: boolean }[];
}) {
  const pathname = usePathname();
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
        <Link aria-label="Academia Iquiti, inicio" className="sidebar__favicon-link" href="/">
          <Image alt="" height={26} priority src="/icon.svg" width={26} />
        </Link>
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
      <nav aria-label={`Área de ${roleLabel.toLowerCase()}`} className="sidebar__nav">
        {links.map(({ href, label, icon }) => {
          const Icon = icons[icon];
          const active = isLinkActive(href, pathname);
          return href === "/programa" ? (
            collapsed ? (
              <Link aria-current={active ? "page" : undefined} aria-label={label} href={href} key={href} title={label}>
                <Icon />
                <span>{label}</span>
              </Link>
            ) : (
              <ProgramNavigation key={href} label={label} weeks={weeks} />
            )
          ) : (
            <Link aria-current={active ? "page" : undefined} href={href} key={href} title={collapsed ? label : undefined}>
              <Icon />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
