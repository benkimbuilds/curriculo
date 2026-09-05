import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db";
import * as authSchema from "@/db/schema";
import { recordAuditEvent } from "@/modules/audit/service";
import { provisionVerifiedLearner } from "@/modules/enrollment/service";
import { enqueueMail } from "@/modules/mail/outbox";
import { passwordResetEmail, verificationEmail } from "@/modules/mail/templates";
import { getEnvironment } from "@/shared/env";
import { logger } from "@/shared/logger";

import { hashPassword, verifyPassword } from "./password";

const environment = getEnvironment();

export const auth = betterAuth({
  appName: "Ruta",
  baseURL: environment.BETTER_AUTH_URL,
  secret: environment.BETTER_AUTH_SECRET,
  trustedOrigins: environment.TRUSTED_ORIGINS.split(",").map((origin) => origin.trim()),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
    transaction: true,
  }),
  advanced: {
    database: { generateId: "uuid" },
    cookiePrefix: "curriculo",
    useSecureCookies: environment.NODE_ENV === "production",
    // Railway's edge overwrites this single-value header with the client IP.
    // Do not add X-Forwarded-For here without configuring an exact trusted-proxy chain.
    ipAddress: { ipAddressHeaders: ["x-real-ip"] },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
    minPasswordLength: 10,
    maxPasswordLength: 128,
    revokeSessionsOnPasswordReset: true,
    password: {
      hash: hashPassword,
      verify: ({ hash, password }) => verifyPassword(hash, password),
    },
    sendResetPassword: async ({ user: accountUser, url }) => {
      const message = passwordResetEmail(accountUser.name, url);
      await enqueueMail({
        kind: "password_reset",
        to: accountUser.email,
        ...message,
      });
    },
    onPasswordReset: async ({ user: accountUser }) => {
      await recordAuditEvent(db, {
        actorUserId: accountUser.id,
        eventType: "account.password_reset",
        subjectType: "user",
        subjectId: accountUser.id,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,
    sendVerificationEmail: async ({ user: accountUser, url }) => {
      const message = verificationEmail(accountUser.name, url);
      await enqueueMail({
        kind: "email_verification",
        to: accountUser.email,
        ...message,
      });
    },
    afterEmailVerification: async (accountUser) => {
      await provisionVerifiedLearner(accountUser.id);
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  verification: {
    storeIdentifier: "hashed",
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 10 },
      "/sign-up/email": { window: 60 * 10, max: 5 },
      "/request-password-reset": { window: 60 * 10, max: 5 },
      "/send-verification-email": { window: 60 * 10, max: 5 },
    },
  },
  logger: {
    disabled: false,
    level: environment.NODE_ENV === "production" ? "warn" : "info",
    log(level, message, ...args) {
      logger[level]({ args }, message);
    },
  },
});

export type AuthSession = typeof auth.$Infer.Session;
