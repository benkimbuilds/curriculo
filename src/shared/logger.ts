import pino from "pino";

import { getEnvironment } from "@/shared/env";

export const logger = pino({
  level: getEnvironment().LOG_LEVEL,
  base: { service: "curriculo" },
  redact: {
    paths: [
      "password",
      "token",
      "req.headers.authorization",
      "req.headers.cookie",
      "smtp.auth.pass",
    ],
    censor: "[REDACTED]",
  },
});
