"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";

import { AccountMenu } from "./auth/account-menu";
import { Compass, Grid, Home, Shield, User } from "./icons";
import { Logo } from "./logo";
import { ProgramNavigation } from "./program-navigation";

const preferenceKey = "ruta:sidebar-collapsed";

export type SidebarLink = {
  href: string;
  label: string;
  icon: "book" | "compass" | "grid" | "home" | "shield" | "user";
};

const icons: Record<SidebarLink["icon"], ComponentType<{ className?: string }>> = {
  book: BookOpen,
  compass: Compass,
  grid: Grid,
  home: Home,
  shield: Shield,
  user: User,
};

export function AppSidebar({
  initials,
  links,
  roleLabel,
  showProfile,
  userName,
  weeks,
}: {
  initials: string;
  links: SidebarLink[];
  roleLabel: string;
  showProfile: boolean;
  userName: string;
  weeks: { week: number; title: string; completed?: boolean }[];
}) {
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
      <nav aria-label={`Área de ${roleLabel.toLowerCase()}`} className="sidebar__nav">
        {links.map(({ href, label, icon }) => {
          const Icon = icons[icon];
          return href === "/programa"
          ? collapsed
            ? <Link aria-label={label} href={href} key={href} title={label}><Icon /><span>{label}</span></Link>
            : <ProgramNavigation key={href} label={label} weeks={weeks} />
          : <Link href={href} key={href} title={collapsed ? label : undefined}><Icon /><span>{label}</span></Link>;
        })}
      </nav>
      <div className="sidebar__profile">
        <span className="avatar avatar--green avatar--sm">{initials}</span>
        <span><strong>{userName}</strong><small>{roleLabel}</small></span>
        <AccountMenu compact={collapsed} showProfile={showProfile} />
      </div>
    </aside>
  );
}
