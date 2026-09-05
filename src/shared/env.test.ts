import { afterEach, describe, expect, it, vi } from "vitest";

import { getEnvironment, resetEnvironmentForTests } from "./env";

afterEach(() => {
  vi.unstubAllEnvs();
  resetEnvironmentForTests();
});

describe("environment validation", () => {
  it("rejects the development auth secret in a production runtime", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv(
      "BETTER_AUTH_SECRET",
      "local-development-secret-change-before-deploying-32-chars",
    );
    vi.stubEnv("NEXT_PHASE", "");
    resetEnvironmentForTests();
    expect(() => getEnvironment()).toThrow(/unique BETTER_AUTH_SECRET/);
  });

  it("allows credential-free production compilation without weakening runtime checks", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv(
      "BETTER_AUTH_SECRET",
      "local-development-secret-change-before-deploying-32-chars",
    );
    vi.stubEnv("NEXT_PHASE", "phase-production-build");
    resetEnvironmentForTests();
    expect(getEnvironment().NODE_ENV).toBe("production");
  });
});
