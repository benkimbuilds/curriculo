import "server-only";

import { platformCta } from "@/components/layout/platform-cta";
import { getCurrentSession } from "@/modules/auth/session";
import { getRoleHomeDestination } from "@/modules/authorization/navigation";
import { loadAuthorizationContext } from "@/modules/authorization/service";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";
import { hasLearningEnrollment } from "@/modules/enrollment/queries";

export async function resolvePublicAccountCta(): Promise<{
  accountHref: string;
  accountLabel: string;
}> {
  const session = await getCurrentSession();
  if (!session) {
    return {
      accountHref: platformCta.href,
      accountLabel: platformCta.shortLabel,
    };
  }

  const organizationId = await resolveDefaultOrganizationId();
  const [authorization, enrolled] = await Promise.all([
    loadAuthorizationContext(session.user.id, organizationId),
    hasLearningEnrollment(session.user.id),
  ]);
  const accountLink = getRoleHomeDestination(authorization.organizationRoles, enrolled);

  return {
    accountHref: accountLink.href,
    accountLabel: accountLink.label,
  };
}
