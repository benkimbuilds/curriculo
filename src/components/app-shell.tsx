import Link from "next/link";
import type { ReactNode } from "react";
import { AccountMenu, AppTopbar } from "./auth/account-menu";
import { AppSessionProvider } from "./session/app-session-provider";
import { AppSidebar, type SidebarLink } from "./app-sidebar";
import { Logo } from "./logo";
import { ProgramNavigation } from "./program-navigation";
import { listCurriculumWeeks } from "@/modules/curriculum";
import { getCurrentSession } from "@/modules/auth/session";
import { hasLearningEnrollment, listCompletedWeekNumbers } from "@/modules/enrollment/queries";
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
  { href: "/staff", label: "Resumen", icon: "summary" },
  { href: "/staff/mentoria", label: "Mentoría", icon: "message" },
  { href: "/staff/moderacion", label: "Moderación", icon: "shield" },
];

const adminLinks: SidebarLink[] = [
  { href: "/admin", label: "Resumen", icon: "summary" },
  { href: "/admin/usuarios", label: "Usuarios", icon: "users" },
  { href: "/staff", label: "Cohortes", icon: "people" },
  { href: "/staff/mentoria", label: "Mentoría", icon: "message" },
  { href: "/staff/moderacion", label: "Moderación", icon: "shield" },
  { href: "/admin/curriculo", label: "Currículo", icon: "compass" },
];

const editorLinks: SidebarLink[] = [{ href: "/admin/curriculo", label: "Currículo", icon: "compass" }];
const learningLinks: SidebarLink[] = [
  { href: "/dashboard", label: "Mi inicio", icon: "home" },
  { href: "/programa", label: "Mi programa", icon: "book" },
  { href: "/galeria", label: "Comunidad", icon: "grid" },
  { href: "/perfil", label: "Mi perfil", icon: "user" },
];

const navigationPermissions: Partial<Record<SidebarLink["href"], Permission>> = {
  "/admin": "role:manage",
  "/admin/curriculo": "curriculum:audit",
  "/admin/usuarios": "role:manage",
  "/staff": "roster:read",
  "/staff/mentoria": "mentoring:manage",
  "/staff/moderacion": "moderation:manage",
};

export function resolveShellRole(roles: readonly PlatformRole[]): ShellRole {
  if (roles.includes("developer_administrator") || roles.includes("administrator")) return "admin";
  if (roles.includes("instructor")) return "staff";
  if (roles.includes("curriculum_editor")) return "editor";
  return "student";
}

export async function AppShell({ children, userName }: { children: ReactNode; userName?: string }) {
  const currentSession = await getCurrentSession();
  const organizationId = currentSession ? await resolveDefaultOrganizationId() : null;
  const [authorization, enrolled, completedWeekNumbers] = currentSession && organizationId
    ? await Promise.all([
        loadAuthorizationContext(currentSession.user.id, organizationId),
        hasLearningEnrollment(currentSession.user.id),
        listCompletedWeekNumbers(currentSession.user.id),
      ])
    : [null, false, [] as number[]];
  const roles = authorization?.organizationRoles ?? [];
  const role = resolveShellRole(roles);
  const canViewLearning = currentSession ? hasLearningAccess(roles, enrolled) : false;
  const teamLinks = role === "student"
    ? studentLinks
    : role === "editor"
      ? editorLinks
      : role === "admin"
        ? adminLinks
        : staffLinks;
  const capabilityLinks = role === "staff" && Boolean(authorization && hasPermission(authorization, "curriculum:audit")) ? editorLinks : [];
  const candidateLinks = role === "student" ? teamLinks : [...teamLinks, ...capabilityLinks, ...(canViewLearning ? learningLinks : [])];
  const links = candidateLinks.filter(({ href }) => {
    const permission = navigationPermissions[href];
    return !permission || Boolean(authorization && hasPermission(authorization, permission));
  });
  const completedWeeks = canViewLearning ? new Set(completedWeekNumbers) : new Set<number>();
  const weeks = canViewLearning ? listCurriculumWeeks().map(({ week, title }) => ({ week, title, completed: completedWeeks.has(week) })) : [];
  const roleLabel = role === "student" ? "Estudiante" : role === "staff" ? "Mentor" : role === "editor" ? "Edición curricular" : "Administración";
  const displayName = userName ?? currentSession?.user.name ?? (role === "student" ? "Mi cuenta" : "Equipo");
  return (
    <AppSessionProvider value={{ userName: displayName, roleLabel, showProfile: canViewLearning }}>
      <div className="app-frame">
        <a className="skip-link" href="#contenido">Saltar al contenido</a>
        <AppSidebar links={links} roleLabel={roleLabel} weeks={weeks} />
        <header className="mobile-app-header">
          <Logo />
          <div className="mobile-app-header__actions">
            <AccountMenu />
            <details>
              <summary aria-label="Abrir navegación">Menú</summary>
              <nav>
                {links.map(({ href, label }) =>
                  href === "/programa" ? (
                    <ProgramNavigation key={href} label={label} weeks={weeks} />
                  ) : (
                    <Link href={href} key={href}>
                      {label}
                    </Link>
                  ),
                )}
              </nav>
            </details>
          </div>
        </header>
        <main className="app-main" id="contenido">
          <AppTopbar />
          {children}
        </main>
      </div>
    </AppSessionProvider>
  );
}
