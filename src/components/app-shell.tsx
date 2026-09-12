import Link from "next/link";
import type { ReactNode } from "react";
import { AccountMenu } from "./auth/account-menu";
import { AppSidebar, type SidebarLink } from "./app-sidebar";
import { Logo } from "./logo";
import { ProgramNavigation } from "./program-navigation";
import { listCurriculumWeeks } from "@/modules/curriculum";
import { getCurrentSession } from "@/modules/auth/session";
import { hasLearningEnrollment, listCompletedWeekNumbers } from "@/app/programa/student-data";
import { loadAuthorizationContext } from "@/modules/authorization/service";
import { hasPermission, type Permission, type PlatformRole } from "@/modules/authorization/policy";
import { hasLearningAccess } from "@/modules/authorization/navigation";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";

type ShellRole = "student" | "staff" | "admin" | "editor";

const studentLinks: SidebarLink[] = [
  { href: "/dashboard", label: "Inicio", icon: "home" },
  { href: "/programa", label: "Mi programa", icon: "book" },
  { href: "/galeria", label: "Comunidad", icon: "grid" },
  { href: "/perfil", label: "Mi perfil", icon: "user" },
];

const staffLinks: SidebarLink[] = [
  { href: "/staff", label: "Resumen", icon: "grid" },
  { href: "/staff/moderacion", label: "Moderación", icon: "shield" },
];

const adminLinks: SidebarLink[] = [
  { href: "/admin", label: "Resumen", icon: "grid" },
  { href: "/staff/moderacion", label: "Moderación", icon: "shield" },
  { href: "/admin/curriculo", label: "Currículo", icon: "compass" },
  { href: "/admin/usuarios", label: "Usuarios", icon: "user" },
];

const editorLinks: SidebarLink[] = [{ href: "/admin/curriculo", label: "Currículo", icon: "compass" }];
const learningLinks: SidebarLink[] = [
  { href: "/programa", label: "Programa", icon: "book" },
];

const navigationPermissions: Partial<Record<SidebarLink["href"], Permission>> = {
  "/admin": "role:manage",
  "/admin/curriculo": "curriculum:audit",
  "/admin/usuarios": "role:manage",
  "/staff": "roster:read",
  "/staff/moderacion": "moderation:manage",
};

export function resolveShellRole(roles: readonly PlatformRole[]): ShellRole {
  if (roles.includes("developer_administrator") || roles.includes("administrator")) return "admin";
  if (roles.includes("curriculum_editor")) return "editor";
  if (roles.includes("instructor")) return "staff";
  return "student";
}

export async function AppShell({ children, userName }: { children: ReactNode; userName?: string }) {
  const currentSession = await getCurrentSession();
  const authorization = currentSession
    ? await loadAuthorizationContext(currentSession.user.id, await resolveDefaultOrganizationId())
    : null;
  const roles = authorization?.organizationRoles ?? [];
  const role = resolveShellRole(roles);
  const canViewLearning = currentSession
    ? hasLearningAccess(roles, await hasLearningEnrollment(currentSession.user.id))
    : false;
  const teamLinks = role === "student"
    ? studentLinks
    : role === "editor"
      ? editorLinks
      : role === "admin"
        ? adminLinks
        : staffLinks;
  const candidateLinks = role === "student" ? teamLinks : canViewLearning ? [...teamLinks, ...learningLinks] : teamLinks;
  const links = candidateLinks.filter(({ href }) => {
    const permission = navigationPermissions[href];
    return !permission || Boolean(authorization && hasPermission(authorization, permission));
  });
  const completedWeeks = currentSession && canViewLearning ? new Set(await listCompletedWeekNumbers(currentSession.user.id)) : new Set<number>();
  const weeks = canViewLearning ? listCurriculumWeeks().map(({ week, title }) => ({ week, title, completed: completedWeeks.has(week) })) : [];
  const roleLabel = role === "student" ? "Estudiante" : role === "staff" ? "Mentor" : role === "editor" ? "Edición curricular" : "Administración";
  const displayName = userName ?? (role === "student" ? "Mi cuenta" : "Equipo");
  const initials = displayName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="app-frame">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <AppSidebar initials={initials} links={links} roleLabel={roleLabel} showProfile={role === "student"} userName={displayName} weeks={weeks} />
      <header className="mobile-app-header"><Logo /><details><summary aria-label="Abrir navegación">Menú</summary><nav>{links.map(({ href, label }) => href === "/programa" ? <ProgramNavigation key={href} label={label} weeks={weeks} /> : <Link href={href} key={href}>{label}</Link>)}<AccountMenu showProfile={role === "student"} /></nav></details></header>
      <main className="app-main" id="contenido">{children}</main>
    </div>
  );
}
