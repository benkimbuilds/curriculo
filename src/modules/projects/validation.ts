import type { SubmissionSnapshot } from "./types";

export class SubmissionValidationError extends Error {
  readonly issues: readonly string[];

  constructor(issues: readonly string[]) {
    super(`Invalid submission: ${issues.join("; ")}`);
    this.name = "SubmissionValidationError";
    this.issues = Object.freeze([...issues]);
  }
}

const SHA_PATTERN = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/i;
const GITHUB_OWNER_PATTERN = /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i;
const GITHUB_REPOSITORY_PATTERN = /^[a-z\d._-]+$/i;

function requiredIdentifier(value: string, field: string, issues: string[]): string {
  const normalized = value.trim();
  if (!normalized) issues.push(`${field} is required`);
  return normalized;
}

export function normalizeCommitSha(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (!SHA_PATTERN.test(normalized)) {
    throw new SubmissionValidationError([
      "commitSha must be a complete 40- or 64-character hexadecimal SHA",
    ]);
  }
  return normalized;
}

export function normalizeGitHubRepositoryUrl(value: string): string {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new SubmissionValidationError(["repositoryUrl must be a valid URL"]);
  }

  const issues: string[] = [];
  if (url.protocol !== "https:") issues.push("repositoryUrl must use HTTPS");
  if (url.hostname.toLowerCase() !== "github.com") {
    issues.push("repositoryUrl must point to github.com");
  }
  if (url.username || url.password) issues.push("repositoryUrl must not contain credentials");
  if (url.port) issues.push("repositoryUrl must not use a custom port");
  if (url.search || url.hash) issues.push("repositoryUrl must not include a query or fragment");

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length !== 2) {
    issues.push("repositoryUrl must identify one GitHub owner and repository");
  }

  const owner = segments[0] ?? "";
  const repository = (segments[1] ?? "").replace(/\.git$/i, "");
  if (owner && !GITHUB_OWNER_PATTERN.test(owner)) {
    issues.push("repositoryUrl has an invalid GitHub owner");
  }
  if (!repository || repository === "." || repository === "..") {
    issues.push("repositoryUrl must include a repository name");
  } else if (!GITHUB_REPOSITORY_PATTERN.test(repository)) {
    issues.push("repositoryUrl has an invalid GitHub repository name");
  }

  if (issues.length > 0) throw new SubmissionValidationError(issues);
  return `https://github.com/${owner}/${repository}`;
}

export function normalizeDeploymentUrl(value: string): string {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new SubmissionValidationError(["deploymentUrl must be a valid URL"]);
  }

  const issues: string[] = [];
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    issues.push("deploymentUrl must use HTTP or HTTPS");
  }
  if (!url.hostname) issues.push("deploymentUrl must include a hostname");
  if (url.username || url.password) issues.push("deploymentUrl must not contain credentials");
  if (url.hash) issues.push("deploymentUrl must not include a fragment");
  if (
    url.port &&
    !((url.protocol === "http:" && url.port === "80") ||
      (url.protocol === "https:" && url.port === "443"))
  ) {
    issues.push("deploymentUrl may only use the default HTTP or HTTPS port");
  }

  if (issues.length > 0) throw new SubmissionValidationError(issues);
  url.hash = "";
  return url.toString();
}

export interface CreateSubmissionSnapshotInput {
  readonly id: string;
  readonly studentId: string;
  readonly projectId: string;
  readonly projectVersion: string;
  readonly rubricVersion: string;
  readonly attemptNumber: number;
  readonly submittedAt: string;
  readonly repositoryUrl: string;
  readonly commitSha: string;
  readonly deploymentUrl: string;
}

export function createSubmissionSnapshot(
  input: CreateSubmissionSnapshotInput,
): Readonly<SubmissionSnapshot> {
  const issues: string[] = [];
  const id = requiredIdentifier(input.id, "id", issues);
  const studentId = requiredIdentifier(input.studentId, "studentId", issues);
  const projectId = requiredIdentifier(input.projectId, "projectId", issues);
  const projectVersion = requiredIdentifier(input.projectVersion, "projectVersion", issues);
  const rubricVersion = requiredIdentifier(input.rubricVersion, "rubricVersion", issues);

  if (!Number.isSafeInteger(input.attemptNumber) || input.attemptNumber < 1) {
    issues.push("attemptNumber must be a positive integer");
  }
  if (!input.submittedAt || Number.isNaN(Date.parse(input.submittedAt))) {
    issues.push("submittedAt must be a valid timestamp");
  }

  let repositoryUrl = "";
  let commitSha = "";
  let deploymentUrl = "";
  for (const operation of [
    () => (repositoryUrl = normalizeGitHubRepositoryUrl(input.repositoryUrl)),
    () => (commitSha = normalizeCommitSha(input.commitSha)),
    () => (deploymentUrl = normalizeDeploymentUrl(input.deploymentUrl)),
  ]) {
    try {
      operation();
    } catch (error) {
      if (error instanceof SubmissionValidationError) issues.push(...error.issues);
      else throw error;
    }
  }

  if (issues.length > 0) throw new SubmissionValidationError(issues);

  const artifact = Object.freeze({ repositoryUrl, commitSha, deploymentUrl });
  return Object.freeze({
    id,
    studentId,
    projectId,
    projectVersion,
    rubricVersion,
    attemptNumber: input.attemptNumber,
    submittedAt: new Date(input.submittedAt).toISOString(),
    artifact,
  });
}
