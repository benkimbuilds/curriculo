import { createServer } from "node:http";
import type { AddressInfo } from "node:net";

import { afterEach, describe, expect, it } from "vitest";

import {
  evaluateWeekOneDeployment,
  fetchPublicHtml,
  InvalidEvaluationTransitionError,
  isPublicIpAddress,
  nodePinnedHttpTransport,
  scoreRubric,
  transitionEvaluationRun,
  validatePublicHttpUrl,
  validateRubric,
  WEEK_ONE_EVALUATOR_VERSION,
  WEEK_ONE_CURRICULUM_RUBRIC,
  WEEK_ONE_RUBRIC,
  type EvaluationRun,
  type HostResolver,
  type PinnedHttpTransport,
} from ".";

const openServers: ReturnType<typeof createServer>[] = [];

afterEach(async () => {
  await Promise.all(
    openServers.splice(0).map(
      (server) =>
        new Promise<void>((resolve) => {
          server.close(() => resolve());
        }),
    ),
  );
});

function publicResolver(records: Record<string, string> = {}): HostResolver {
  return {
    async resolve(hostname) {
      return [{ address: records[hostname] ?? "93.184.216.34", family: 4 }];
    },
  };
}

describe("public HTTP policy", () => {
  it.each([
    "127.0.0.1",
    "10.0.0.1",
    "169.254.169.254",
    "172.16.0.1",
    "192.168.1.1",
    "100.64.0.1",
    "::1",
    "fe80::1",
    "fd00::1",
    "::ffff:127.0.0.1",
  ])("blocks private, local, and special address %s", (address) => {
    expect(isPublicIpAddress(address)).toBe(false);
  });

  it.each(["8.8.8.8", "1.1.1.1", "2606:4700:4700::1111"])(
    "allows public address %s",
    (address) => expect(isPublicIpAddress(address)).toBe(true),
  );

  it.each([
    ["file:///etc/passwd", "unsupported_protocol"],
    ["http://user:pass@example.com", "credentials_not_allowed"],
    ["https://example.com:8443", "port_not_allowed"],
  ])("rejects URL %s with %s", (url, code) => {
    expect(() => validatePublicHttpUrl(url)).toThrowError(
      expect.objectContaining({ code }),
    );
  });

  it("rejects a hostname when any DNS result is non-public", async () => {
    const resolver: HostResolver = {
      async resolve() {
        return [
          { address: "93.184.216.34", family: 4 },
          { address: "127.0.0.1", family: 4 },
        ];
      },
    };
    let requests = 0;
    const transport: PinnedHttpTransport = {
      async get() {
        requests += 1;
        throw new Error("must not run");
      },
    };

    await expect(
      fetchPublicHtml("https://example.com", undefined, { resolver, transport }),
    ).rejects.toMatchObject({ code: "non_public_address" });
    expect(requests).toBe(0);
  });

  it.each([
    "http://2130706433/",
    "http://0x7f000001/",
    "http://0177.0.0.1/",
    "http://[::ffff:127.0.0.1]/",
  ])("blocks alternate loopback URL notation %s", async (url) => {
    await expect(fetchPublicHtml(url)).rejects.toMatchObject({ code: "non_public_address" });
  });

  it("rejects resolver records whose declared family does not match the address", async () => {
    const resolver: HostResolver = {
      async resolve() {
        return [{ address: "93.184.216.34", family: 6 }];
      },
    };
    await expect(
      fetchPublicHtml("https://example.com", undefined, { resolver }),
    ).rejects.toMatchObject({ code: "dns_invalid_address" });
  });

  it("re-resolves and validates every redirect destination", async () => {
    const resolved: string[] = [];
    const requested: string[] = [];
    const resolver: HostResolver = {
      async resolve(hostname) {
        resolved.push(hostname);
        return [{ address: hostname === "private.example" ? "10.0.0.2" : "93.184.216.34", family: 4 }];
      },
    };
    const transport: PinnedHttpTransport = {
      async get(url) {
        requested.push(url.href);
        return {
          status: 302,
          headers: { location: "http://private.example/admin" },
          body: "",
        };
      },
    };

    await expect(
      fetchPublicHtml("https://public.example", undefined, { resolver, transport }),
    ).rejects.toMatchObject({ code: "non_public_address" });
    expect(resolved).toEqual(["public.example", "private.example"]);
    expect(requested).toEqual(["https://public.example/"]);
  });

  it("follows bounded safe redirects and passes pinned addresses to transport", async () => {
    const addressesSeen: string[][] = [];
    const transport: PinnedHttpTransport = {
      async get(url, addresses) {
        addressesSeen.push(addresses.map(({ address }) => address));
        if (url.pathname === "/") {
          return {
            status: 301,
            headers: { location: "/home" } as Record<string, string>,
            body: "",
          };
        }
        return {
          status: 200,
          headers: { "content-type": "text/html" } as Record<string, string>,
          body: "<html></html>",
        };
      },
    };
    const result = await fetchPublicHtml("https://example.com", undefined, {
      resolver: publicResolver(),
      transport,
    });

    expect(result.finalUrl).toBe("https://example.com/home");
    expect(addressesSeen).toEqual([["93.184.216.34"], ["93.184.216.34"]]);
  });

  it("enforces the response byte cap in the pinned node transport", async () => {
    const server = createServer((_request, response) => {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end("x".repeat(128));
    });
    openServers.push(server);
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const port = (server.address() as AddressInfo).port;

    await expect(
      nodePinnedHttpTransport.get(
        new URL(`http://example.test:${port}/`),
        [{ address: "127.0.0.1", family: 4 }],
        { timeoutMs: 1_000, maxResponseBytes: 32 },
      ),
    ).rejects.toMatchObject({ code: "response_too_large" });
  });

  it("enforces the request timeout in the pinned node transport", async () => {
    const server = createServer(() => undefined);
    openServers.push(server);
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const port = (server.address() as AddressInfo).port;

    await expect(
      nodePinnedHttpTransport.get(
        new URL(`http://example.test:${port}/`),
        [{ address: "127.0.0.1", family: 4 }],
        { timeoutMs: 10, maxResponseBytes: 32 },
      ),
    ).rejects.toMatchObject({ code: "request_timeout" });
  });
});

describe("Week 1 evaluator", () => {
  it("passes a healthy semantic public HTML deployment", async () => {
    const transport: PinnedHttpTransport = {
      async get() {
        return {
          status: 200,
          headers: { "content-type": "text/html; charset=utf-8" },
          body: `<!doctype html><html lang="es"><head><title>Mi primera pagina</title></head>
            <body><header><nav>Inicio</nav></header><main><h1>Mi portafolio</h1><section>Proyecto</section></main><footer>Fin</footer></body></html>`,
        };
      },
    };
    const result = await evaluateWeekOneDeployment("https://student.example", {
      dependencies: { resolver: publicResolver(), transport },
    });

    expect(result).toMatchObject({
      state: "passed",
      score: 1,
      evaluatorVersion: WEEK_ONE_EVALUATOR_VERSION,
      finalUrl: "https://student.example/",
      rubricId: "week-01-rubric-v1",
      rubricVersion: "1",
    });
    expect(result.criteria).toHaveLength(WEEK_ONE_RUBRIC.criteria.length);
    expect(result.rubricCriteria).toEqual([
      expect.objectContaining({
        criterionId: WEEK_ONE_CURRICULUM_RUBRIC.functionalityCriterionId,
        status: "passed",
      }),
    ]);
  });

  it("returns criterion-level failures for reachable but incomplete HTML", async () => {
    const transport: PinnedHttpTransport = {
      async get() {
        return {
          status: 200,
          headers: { "content-type": "text/html" },
          body: "<html><head><title></title></head><body><div>Hola</div></body></html>",
        };
      },
    };
    const result = await evaluateWeekOneDeployment("https://student.example", {
      dependencies: { resolver: publicResolver(), transport },
    });

    expect(result.state).toBe("failed");
    expect(result.score).toBeCloseTo(0.3);
    expect(result.criteria.filter(({ status }) => status === "failed").map(({ criterionId }) => criterionId))
      .toEqual(["descriptive-title", "primary-heading", "main-landmark", "semantic-structure"]);
    expect(result.rubricCriteria[0]).toMatchObject({
      criterionId: "week-01-criterion-functionality",
      status: "failed",
    });
  });

  it("degrades safety, network, and evaluator errors to needs review", async () => {
    const result = await evaluateWeekOneDeployment("http://127.0.0.1/internal");
    expect(result).toMatchObject({
      state: "needs_review",
      score: null,
      reviewReason: "non_public_address",
      rubricId: "week-01-rubric-v1",
      rubricCriteria: [
        expect.objectContaining({
          criterionId: "week-01-criterion-functionality",
          status: "needs_review",
        }),
      ],
    });

    const transport: PinnedHttpTransport = {
      async get() {
        throw new Error("socket failed with sensitive details");
      },
    };
    const unavailable = await evaluateWeekOneDeployment("https://student.example", {
      dependencies: { resolver: publicResolver(), transport },
    });
    expect(unavailable.reviewReason).toBe("evaluator_unavailable");
  });
});

describe("rubric and evaluation lifecycle", () => {
  it("validates rubric weights and scores required criteria", () => {
    expect(() =>
      validateRubric({ ...WEEK_ONE_RUBRIC, criteria: WEEK_ONE_RUBRIC.criteria.slice(0, 1) }),
    ).toThrow(/weights must total 1/);

    const results = WEEK_ONE_RUBRIC.criteria.map((criterion) => ({
      criterionId: criterion.id,
      status: "passed" as const,
      evidence: "ok",
    }));
    expect(scoreRubric(WEEK_ONE_RUBRIC, results)).toEqual({ state: "passed", score: 1 });
    expect(() => scoreRubric(WEEK_ONE_RUBRIC, [...results, results[0]])).toThrow(
      /Duplicate criterion result/,
    );
  });

  it("moves queued runs through completion and preserves the original run", () => {
    const queued: EvaluationRun = {
      id: "run-1",
      submissionId: "submission-1",
      rubricId: "week-01-rubric-v1",
      rubricVersion: "1",
      evaluatorVersion: WEEK_ONE_EVALUATOR_VERSION,
      idempotencyKey: "submission-1:rubric-1:evaluator-1",
      attempt: 0,
      maxAttempts: 3,
      state: "queued",
      createdAt: "2026-09-05T18:00:00Z",
      updatedAt: "2026-09-05T18:00:00Z",
    };
    const running = transitionEvaluationRun(queued, {
      type: "started",
      at: "2026-09-05T18:01:00Z",
    });
    const result = {
      state: "passed" as const,
      score: 1,
      evaluatorVersion: WEEK_ONE_EVALUATOR_VERSION,
      finalUrl: "https://student.example/",
      criteria: [],
      rubricId: "week-01-rubric-v1",
      rubricVersion: "1",
      rubricCriteria: [],
    };
    const completed = transitionEvaluationRun(running, {
      type: "completed",
      at: "2026-09-05T18:02:00Z",
      result,
    });

    expect(running).toMatchObject({ state: "running", attempt: 1 });
    expect(completed).toMatchObject({ state: "passed", result });
    expect(queued).toMatchObject({ state: "queued", attempt: 0 });
  });

  it("degrades run errors to needs review and requires an audited override reason", () => {
    const running: EvaluationRun = {
      id: "run-1",
      submissionId: "submission-1",
      rubricId: "week-01-rubric-v1",
      rubricVersion: "1",
      evaluatorVersion: WEEK_ONE_EVALUATOR_VERSION,
      idempotencyKey: "key",
      attempt: 1,
      maxAttempts: 3,
      state: "running",
      createdAt: "2026-09-05T18:00:00Z",
      updatedAt: "2026-09-05T18:01:00Z",
    };
    const review = transitionEvaluationRun(running, {
      type: "errored",
      at: "2026-09-05T18:02:00Z",
      errorCode: "request_timeout",
    });
    expect(review).toMatchObject({ state: "needs_review", errorCode: "request_timeout" });
    expect(() =>
      transitionEvaluationRun(review, {
        type: "staff_override",
        at: "2026-09-05T18:03:00Z",
        staffUserId: "staff-1",
        reason: " ",
        outcome: "passed",
      }),
    ).toThrow(/requires a reason/);

    const overridden = transitionEvaluationRun(review, {
      type: "staff_override",
      at: "2026-09-05T18:03:00Z",
      staffUserId: "staff-1",
      reason: "Verified the deployment manually",
      outcome: "passed",
    });
    expect(overridden).toMatchObject({
      state: "passed",
      override: { previousState: "needs_review", staffUserId: "staff-1" },
    });
    expect(overridden.result).toBe(review.result);
    expect(overridden.result?.state).toBe("needs_review");

    const retried = transitionEvaluationRun(review, {
      type: "retry_requested",
      at: "2026-09-05T18:04:00Z",
    });
    expect(retried).toMatchObject({ state: "queued", attempt: 1 });
    expect(retried.result).toBeUndefined();
    expect(retried.errorCode).toBeUndefined();
  });

  it("rejects invalid transitions and exhausted retries", () => {
    const exhausted: EvaluationRun = {
      id: "run-1",
      submissionId: "submission-1",
      rubricId: "week-01-rubric-v1",
      rubricVersion: "1",
      evaluatorVersion: WEEK_ONE_EVALUATOR_VERSION,
      idempotencyKey: "key",
      attempt: 3,
      maxAttempts: 3,
      state: "queued",
      createdAt: "2026-09-05T18:00:00Z",
      updatedAt: "2026-09-05T18:01:00Z",
    };
    expect(() =>
      transitionEvaluationRun(exhausted, { type: "started", at: "2026-09-05T18:02:00Z" }),
    ).toThrow(/retry limit/);
    expect(() =>
      transitionEvaluationRun(exhausted, {
        type: "completed",
        at: "2026-09-05T18:02:00Z",
        result: {
          state: "passed",
          score: 1,
          evaluatorVersion: WEEK_ONE_EVALUATOR_VERSION,
          finalUrl: null,
          criteria: [],
          rubricId: "week-01-rubric-v1",
          rubricVersion: "1",
          rubricCriteria: [],
        },
      }),
    ).toThrow(InvalidEvaluationTransitionError);
  });
});
