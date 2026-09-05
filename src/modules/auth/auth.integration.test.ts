import { desc, eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { db } from "@/db";
import {
  enrollments,
  mailOutbox,
  profiles,
  roleAssignments,
  session,
  user,
  verification,
} from "@/db/schema";
import { auth } from "@/modules/auth/config";

const integrationTest = process.env.TEST_DATABASE_URL ? it : it.skip;

describe("verified learner provisioning", () => {
  integrationTest("grants self-paced access only after email verification", async () => {
    const email = `learner-${crypto.randomUUID()}@example.test`;
    await auth.api.signUpEmail({
      body: { name: "Persona estudiante", email, password: "a-secure-password-123" },
    });

    const [createdUser] = await db.select().from(user).where(eq(user.email, email)).limit(1);
    expect(createdUser?.emailVerified).toBe(false);
    if (!createdUser) throw new Error("User was not created");

    const beforeVerification = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.userId, createdUser.id));
    expect(beforeVerification).toHaveLength(0);
    await expect(
      auth.api.signInEmail({ body: { email, password: "a-secure-password-123" } }),
    ).rejects.toThrow();

    const [emailMessage] = await db
      .select()
      .from(mailOutbox)
      .where(eq(mailOutbox.recipient, email))
      .limit(1);
    const verificationUrl = emailMessage?.textBody.match(/https?:\/\/\S+/)?.[0];
    const token = verificationUrl ? new URL(verificationUrl).searchParams.get("token") : null;
    expect(token).toBeTruthy();
    if (!token) throw new Error("Verification message did not contain a token");

    const storedTokens = await db.select({ identifier: verification.identifier }).from(verification);
    expect(storedTokens.some(({ identifier }) => identifier.includes(token))).toBe(false);

    await auth.api.verifyEmail({ query: { token } });

    const [verifiedUser] = await db.select().from(user).where(eq(user.id, createdUser.id)).limit(1);
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, createdUser.id));
    const learnerRoles = await db
      .select()
      .from(roleAssignments)
      .where(eq(roleAssignments.userId, createdUser.id));
    const learnerEnrollments = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.userId, createdUser.id));

    expect(verifiedUser?.emailVerified).toBe(true);
    expect(profile).toMatchObject({ isMinor: true, profileVisible: false, locale: "es-MX" });
    expect(learnerRoles.map(({ role }) => role)).toContain("student");
    expect(learnerEnrollments).toHaveLength(1);
    expect(learnerEnrollments[0]).toMatchObject({ mode: "self_paced", status: "active" });
  });

  integrationTest("uses generic recovery responses, consumes reset tokens, and revokes sessions", async () => {
    const email = `recovery-${crypto.randomUUID()}@example.test`;
    const oldPassword = "a-secure-password-123";
    const newPassword = "a-new-secure-password-456";
    await auth.api.signUpEmail({ body: { name: "Cuenta de prueba", email, password: oldPassword } });

    const [verificationMessage] = await db
      .select()
      .from(mailOutbox)
      .where(eq(mailOutbox.recipient, email))
      .orderBy(desc(mailOutbox.createdAt))
      .limit(1);
    const verificationUrl = verificationMessage?.textBody.match(/https?:\/\/\S+/)?.[0];
    const verificationToken = verificationUrl
      ? new URL(verificationUrl).searchParams.get("token")
      : null;
    if (!verificationToken) throw new Error("Verification message did not contain a token");
    await auth.api.verifyEmail({ query: { token: verificationToken } });

    const signedIn = await auth.api.signInEmail({ body: { email, password: oldPassword } });
    expect(signedIn.user.email).toBe(email);
    const sessionsBeforeReset = await db
      .select()
      .from(session)
      .where(eq(session.userId, signedIn.user.id));
    expect(sessionsBeforeReset.length).toBeGreaterThan(0);

    const knownResponse = await auth.api.requestPasswordReset({
      body: { email, redirectTo: "http://localhost:3000/restablecer" },
    });
    const unknownResponse = await auth.api.requestPasswordReset({
      body: { email: `missing-${crypto.randomUUID()}@example.test` },
    });
    expect(unknownResponse.message).toBe(knownResponse.message);

    const [resetMessage] = await db
      .select()
      .from(mailOutbox)
      .where(eq(mailOutbox.recipient, email))
      .orderBy(desc(mailOutbox.createdAt))
      .limit(1);
    expect(resetMessage?.kind).toBe("password_reset");
    const resetUrlText = resetMessage?.textBody.match(/https?:\/\/\S+/)?.[0];
    const resetUrl = resetUrlText ? new URL(resetUrlText) : null;
    const resetToken = resetUrl?.pathname.split("/").at(-1);
    if (!resetToken) throw new Error("Recovery message did not contain a reset token");

    const storedTokens = await db.select({ identifier: verification.identifier }).from(verification);
    expect(storedTokens.some(({ identifier }) => identifier.includes(resetToken))).toBe(false);

    await auth.api.resetPassword({ body: { token: resetToken, newPassword } });
    await expect(
      auth.api.resetPassword({ body: { token: resetToken, newPassword: oldPassword } }),
    ).rejects.toThrow();

    const sessionsAfterReset = await db
      .select()
      .from(session)
      .where(eq(session.userId, signedIn.user.id));
    expect(sessionsAfterReset).toHaveLength(0);
    await expect(auth.api.signInEmail({ body: { email, password: oldPassword } })).rejects.toThrow();
    await expect(auth.api.signInEmail({ body: { email, password: newPassword } })).resolves.toMatchObject({
      user: { email },
    });
  });
});
