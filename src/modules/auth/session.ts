import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/modules/auth/config";
import { AuthenticationRequiredError, AuthorizationDeniedError } from "@/shared/errors";

export async function getCurrentSession() {
  const currentSession = await auth.api.getSession({ headers: await headers() });
  if (!currentSession) return null;
  const [account] = await db.select({ isActive: user.isActive }).from(user).where(eq(user.id, currentSession.user.id)).limit(1);
  return account?.isActive ? currentSession : null;
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
