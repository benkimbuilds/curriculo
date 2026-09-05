import { headers } from "next/headers";

import { auth } from "@/modules/auth/config";
import { AuthenticationRequiredError, AuthorizationDeniedError } from "@/shared/errors";

export async function getCurrentSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireCurrentSession() {
  const currentSession = await getCurrentSession();
  if (!currentSession) throw new AuthenticationRequiredError();
  return currentSession;
}

export async function requireVerifiedSession() {
  const currentSession = await requireCurrentSession();
  if (!currentSession.user.emailVerified) {
    throw new AuthorizationDeniedError("verified-email");
  }
  return currentSession;
}
