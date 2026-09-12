import type { PlatformRole } from "./policy";

export function hasLearningAccess(roles: readonly PlatformRole[], hasLearningEnrollment = false): boolean {
  return hasLearningEnrollment || roles.includes("student");
}

export function getRoleHomeDestination(
  roles: readonly PlatformRole[],
  hasLearningEnrollment = false,
): { href: string; label: string } {
  if (hasLearningAccess(roles, hasLearningEnrollment)) return { href: "/dashboard", label: "Mi programa" };
  if (roles.includes("developer_administrator") || roles.includes("administrator")) {
    return { href: "/staff", label: "Equipo" };
  }
  if (roles.includes("instructor")) return { href: "/staff", label: "Equipo" };
  if (roles.includes("curriculum_editor")) return { href: "/admin/curriculo", label: "Currículo" };
  return { href: "/", label: "Inicio" };
}
