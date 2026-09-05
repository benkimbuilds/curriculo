import { z } from "zod";

const booleanString = z
  .enum(["true", "false"])
  .default("false")
  .transform((value) => value === "true");

const environmentSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z
      .url()
      .default("postgresql://curriculo:curriculo@localhost:5432/curriculo"),
    BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
    BETTER_AUTH_SECRET: z
      .string()
      .min(32)
      .default("local-development-secret-change-before-deploying-32-chars"),
    TRUSTED_ORIGINS: z.string().default("http://localhost:3000"),
    SMTP_HOST: z.string().min(1).default("localhost"),
    SMTP_PORT: z.coerce.number().int().positive().default(1025),
    SMTP_SECURE: booleanString,
    SMTP_FROM: z.string().min(1).default("Curriculo <no-reply@curriculo.local>"),
    SMTP_USER: z.string().optional(),
    SMTP_PASSWORD: z.string().optional(),
    DEFAULT_ORGANIZATION_SLUG: z.string().min(1).default("aibuilders-mexico"),
    DEFAULT_PROGRAM_SLUG: z.string().min(1).default("odin-full-stack-mx"),
    BOOTSTRAP_DEVELOPER_ADMIN_EMAIL: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.email().optional(),
    ),
    SOCIAL_FEATURES_ENABLED: booleanString,
    LOG_LEVEL: z
      .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
      .default("info"),
    WORKER_POLL_INTERVAL_MS: z.coerce.number().int().min(250).default(2000),
  })
  .superRefine((value, context) => {
    if (
      value.NODE_ENV === "production" &&
      process.env.NEXT_PHASE !== "phase-production-build" &&
      value.BETTER_AUTH_SECRET ===
        "local-development-secret-change-before-deploying-32-chars"
    ) {
      context.addIssue({
        code: "custom",
        path: ["BETTER_AUTH_SECRET"],
        message: "Production requires a unique BETTER_AUTH_SECRET.",
      });
    }
  });

export type Environment = z.infer<typeof environmentSchema>;

let cachedEnvironment: Environment | undefined;

export function getEnvironment(): Environment {
  cachedEnvironment ??= environmentSchema.parse(process.env);
  return cachedEnvironment;
}

export function resetEnvironmentForTests(): void {
  cachedEnvironment = undefined;
}
