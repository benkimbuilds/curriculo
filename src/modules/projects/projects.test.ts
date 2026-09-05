import { describe, expect, it } from "vitest";

import {
  createSubmissionSnapshot,
  InvalidSubmissionTransitionError,
  normalizeCommitSha,
  normalizeDeploymentUrl,
  normalizeGitHubRepositoryUrl,
  SubmissionValidationError,
  transitionSubmissionAttempt,
  type SubmissionAttempt,
} from ".";

const baseInput = {
  id: "submission-1",
  studentId: "student-1",
  projectId: "week-1-project",
  projectVersion: "2026.1",
  rubricVersion: "1",
  attemptNumber: 1,
  submittedAt: "2026-09-05T12:00:00-06:00",
  repositoryUrl: "https://github.com/Example/student-project.git",
  commitSha: "A".repeat(40),
  deploymentUrl: "https://student.example.com/portfolio?lang=es",
};

describe("submission validation", () => {
  it("normalizes GitHub repositories, full SHAs, and deployment URLs", () => {
    expect(normalizeGitHubRepositoryUrl(baseInput.repositoryUrl)).toBe(
      "https://github.com/Example/student-project",
    );
    expect(normalizeGitHubRepositoryUrl("https://github.com/student2/project2026")).toBe(
      "https://github.com/student2/project2026",
    );
    expect(normalizeCommitSha(baseInput.commitSha)).toBe("a".repeat(40));
    expect(normalizeCommitSha("b".repeat(64))).toBe("b".repeat(64));
    expect(normalizeDeploymentUrl(baseInput.deploymentUrl)).toBe(
      "https://student.example.com/portfolio?lang=es",
    );
  });

  it.each(["abc123", "g".repeat(40), "a".repeat(39), "a".repeat(41), "a".repeat(63)])(
    "rejects non-immutable or malformed SHA %s",
    (sha) => expect(() => normalizeCommitSha(sha)).toThrow(SubmissionValidationError),
  );

  it.each([
    "http://github.com/example/project",
    "https://gitlab.com/example/project",
    "https://token@github.com/example/project",
    "https://github.com/example/project/issues",
    "https://github.com/example/project?tab=readme",
    "https://github.com/example/.git",
  ])("rejects invalid GitHub repository URL %s", (url) => {
    expect(() => normalizeGitHubRepositoryUrl(url)).toThrow(SubmissionValidationError);
  });

  it.each([
    "file:///tmp/index.html",
    "ftp://student.example.com/site",
    "https://user:pass@student.example.com",
    "https://student.example.com:8443",
  ])("rejects unsafe deployment URL %s", (url) => {
    expect(() => normalizeDeploymentUrl(url)).toThrow(SubmissionValidationError);
  });

  it("creates a deeply frozen immutable submission snapshot", () => {
    const snapshot = createSubmissionSnapshot(baseInput);

    expect(snapshot).toMatchObject({
      attemptNumber: 1,
      submittedAt: "2026-09-05T18:00:00.000Z",
      artifact: {
        repositoryUrl: "https://github.com/Example/student-project",
        commitSha: "a".repeat(40),
      },
    });
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.artifact)).toBe(true);
  });

  it("collects field errors and rejects non-positive attempt numbers", () => {
    expect(() =>
      createSubmissionSnapshot({
        ...baseInput,
        id: " ",
        attemptNumber: 0,
        submittedAt: "not-a-date",
      }),
    ).toThrowError(/id is required; attemptNumber must be a positive integer; submittedAt/);
  });
});

describe("submission attempt transitions", () => {
  const submission = createSubmissionSnapshot(baseInput);
  const submitted: SubmissionAttempt = {
    submission,
    state: "submitted",
    updatedAt: submission.submittedAt,
  };

  it("moves an attempt through evaluation without mutating its snapshot", () => {
    const evaluating = transitionSubmissionAttempt(submitted, {
      type: "evaluation_started",
      at: "2026-09-05T18:01:00Z",
    });
    const passed = transitionSubmissionAttempt(evaluating, {
      type: "evaluation_passed",
      at: "2026-09-05T18:02:00Z",
    });

    expect(passed.state).toBe("passed");
    expect(passed.submission).toBe(submission);
    expect(submitted.state).toBe("submitted");
  });

  it("maps a failed evaluation to needs revision", () => {
    const evaluating = transitionSubmissionAttempt(submitted, {
      type: "evaluation_started",
      at: "2026-09-05T18:01:00Z",
    });
    expect(
      transitionSubmissionAttempt(evaluating, {
        type: "evaluation_failed",
        at: "2026-09-05T18:02:00Z",
      }).state,
    ).toBe("needs_revision");
  });

  it("requires a reason when staff resolve a review", () => {
    const review = transitionSubmissionAttempt(submitted, {
      type: "evaluation_needs_review",
      at: "2026-09-05T18:01:00Z",
    });
    expect(() =>
      transitionSubmissionAttempt(review, {
        type: "staff_resolved",
        outcome: "passed",
        reason: " ",
        at: "2026-09-05T18:02:00Z",
      }),
    ).toThrow(/requires a reason/);
  });

  it("rejects illegal terminal transitions", () => {
    const evaluating = transitionSubmissionAttempt(submitted, {
      type: "evaluation_started",
      at: "2026-09-05T18:01:00Z",
    });
    const passed = transitionSubmissionAttempt(evaluating, {
      type: "evaluation_passed",
      at: "2026-09-05T18:02:00Z",
    });
    expect(() =>
      transitionSubmissionAttempt(passed, {
        type: "evaluation_started",
        at: "2026-09-05T18:03:00Z",
      }),
    ).toThrow(InvalidSubmissionTransitionError);
  });
});
