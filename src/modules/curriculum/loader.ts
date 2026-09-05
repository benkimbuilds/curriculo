import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { parse as parseYaml } from "yaml";
import { compileLessonMarkdown } from "./compiler";
import {
  CURRICULUM_LOCALES,
  curriculumFrontmatterSchema,
  isSafePublicUrl,
  type CurriculumDocument,
  type CurriculumValidationIssue,
  type CurriculumValidationResult,
} from "./schema";

const MARKDOWN_LINK = /(?<!!)\[[^\]]+\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
const LESSON_SECTION = /<!-- lesson:([a-z0-9]+(?:-[a-z0-9]+)*) -->\s*([\s\S]*?)\s*<!-- \/lesson -->/g;

function collectMdxFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const resolved = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectMdxFiles(resolved);
    return entry.isFile() && entry.name.endsWith(".mdx") ? [resolved] : [];
  });
}

function validateBody(body: string, file: string): CurriculumValidationIssue[] {
  const issues: CurriculumValidationIssue[] = [];
  const proseOnly = body.replace(/```[\s\S]*?```/g, "");
  if (body.trim().length < 500) {
    issues.push({ file, message: "lesson body must contain at least 500 substantive characters" });
  }
  if (/<(?:script|iframe|object|embed)\b/i.test(proseOnly)) {
    issues.push({ file, message: "unsafe embedded HTML is not allowed in curriculum content" });
  }
  if (/^(?:import|export)\s/m.test(proseOnly) || /<[A-Z][A-Za-z0-9.]*(?:\s|\/?>)/.test(proseOnly)) {
    issues.push({ file, message: "executable MDX imports, exports, and JSX components are not allowed" });
  }

  const fenceCount = (body.match(/^```/gm) ?? []).length;
  if (fenceCount % 2 !== 0) {
    issues.push({ file, message: "code fences are not balanced" });
  }

  for (const match of body.matchAll(MARKDOWN_LINK)) {
    const target = match[1];
    if (target.startsWith("#")) continue;
    if (!isSafePublicUrl(target)) {
      issues.push({ file, message: `unsafe or unsupported Markdown link: ${target}` });
    }
  }

  return issues;
}

function extractLessonBodies(
  body: string,
  lessonIds: string[],
  locale: "en" | "es-MX",
  file: string,
): { lessonBodies: CurriculumDocument["lessonBodies"]; issues: CurriculumValidationIssue[] } {
  const issues: CurriculumValidationIssue[] = [];
  const lessonBodies: CurriculumDocument["lessonBodies"] = {};
  const matches = [...body.matchAll(LESSON_SECTION)];
  const extractedIds = matches.map((match) => match[1]);

  if (JSON.stringify(extractedIds) !== JSON.stringify(lessonIds)) {
    issues.push({
      file,
      message: `lesson body IDs must appear once in metadata order; expected ${lessonIds.join(", ")}, received ${extractedIds.join(", ") || "none"}`,
    });
  }

  const requiredHeadings = locale === "es-MX"
    ? ["### Explicación", "### Ejemplo", "### Ejercicio guiado", "### Comprobación"]
    : ["### Explanation", "### Example", "### Guided exercise", "### Checkpoint"];

  for (const match of matches) {
    const lessonId = match[1];
    const markdown = match[2].trim();
    try {
      const compiled = compileLessonMarkdown(lessonId, markdown);
      lessonBodies[lessonId] = compiled;
      if (compiled.wordCount < 140) {
        issues.push({ file, message: `${lessonId} must contain at least 140 instructional words; found ${compiled.wordCount}` });
      }
      for (const heading of requiredHeadings) {
        if (!markdown.includes(heading)) issues.push({ file, message: `${lessonId} is missing ${heading}` });
      }
      if (!/```[a-zA-Z0-9_-]*\n[\s\S]+?\n```/.test(markdown)) {
        issues.push({ file, message: `${lessonId} must include a concrete fenced example` });
      }
      const guidedExercise = markdown.split(requiredHeadings[2])[1]?.split(requiredHeadings[3])[0] ?? "";
      if ((guidedExercise.match(/^\d+\.\s+/gm) ?? []).length < 3) {
        issues.push({ file, message: `${lessonId} guided exercise must include at least three steps` });
      }
      const checkpoint = markdown.split(requiredHeadings[3])[1] ?? "";
      if ((checkpoint.match(/^[-*]\s+/gm) ?? []).length < 2) {
        issues.push({ file, message: `${lessonId} checkpoint must include at least two checks` });
      }
    } catch (error) {
      issues.push({ file, message: error instanceof Error ? error.message : String(error) });
    }
  }

  return { lessonBodies, issues };
}

function paritySignature(document: CurriculumDocument): unknown {
  return {
    programId: document.programId,
    week: document.week,
    estimatedMinutes: document.estimatedMinutes,
    platforms: document.platforms,
    modules: document.modules.map((module) => ({
      id: module.id,
      lessons: module.lessons.map(({ id, estimatedMinutes, required, kind }) => ({
        id,
        estimatedMinutes,
        required,
        kind,
      })),
    })),
    project: {
      id: document.project.id,
      collaboration: document.project.collaboration,
      estimatedMinutes: document.project.estimatedMinutes,
      deliverableCount: document.project.deliverables.length,
      rubric: {
        id: document.project.rubric.id,
        version: document.project.rubric.version,
        passThreshold: document.project.rubric.passThreshold,
        criteria: document.project.rubric.criteria.map(({ id, type, weight, required }) => ({
          id,
          type,
          weight,
          required,
        })),
      },
    },
  };
}

function validateCollection(documents: CurriculumDocument[]): CurriculumValidationIssue[] {
  const issues: CurriculumValidationIssue[] = [];
  const paths = new Set(documents.map((document) => document.sourcePath));
  const compositeIds = new Set<string>();

  for (const document of documents) {
    const key = `${document.contentVersion}:${document.locale}:${document.id}`;
    if (compositeIds.has(key)) {
      issues.push({ file: document.sourcePath, message: `duplicate curriculum document: ${key}` });
    }
    compositeIds.add(key);
  }

  const versions = [...new Set(documents.map((document) => document.contentVersion))];
  if (versions.length !== 1) {
    issues.push({ file: "content", message: `expected one content version, found: ${versions.join(", ")}` });
  }
  const programIds = [...new Set(documents.map((document) => document.programId))];
  if (programIds.length !== 1) {
    issues.push({ file: "content", message: `expected one program ID, found: ${programIds.join(", ")}` });
  }

  for (let week = 1; week <= 12; week += 1) {
    const weekId = `week-${String(week).padStart(2, "0")}`;
    const localized = CURRICULUM_LOCALES.map((locale) =>
      documents.find((document) => document.id === weekId && document.locale === locale),
    );
    for (let index = 0; index < localized.length; index += 1) {
      if (!localized[index]) {
        issues.push({ file: "content", message: `missing ${CURRICULUM_LOCALES[index]} document for ${weekId}` });
      }
    }
    if (!localized[0] || !localized[1]) continue;

    const [spanish, english] = localized;
    if (JSON.stringify(paritySignature(spanish)) !== JSON.stringify(paritySignature(english))) {
      issues.push({ file: spanish.sourcePath, message: `${weekId} structure does not match the English audit source` });
    }
    if (spanish.status === "published" && english.status !== "published") {
      issues.push({ file: spanish.sourcePath, message: "published Spanish content requires a published English audit source" });
    }
    if (spanish.provenance.upstreamCommit !== english.provenance.upstreamCommit) {
      issues.push({ file: spanish.sourcePath, message: "locale provenance commits must match" });
    }
    for (const [lessonId, englishBody] of Object.entries(english.lessonBodies)) {
      const spanishBody = spanish.lessonBodies[lessonId];
      if (!spanishBody || spanishBody.wordCount < englishBody.wordCount * 0.75) {
        issues.push({
          file: spanish.sourcePath,
          message: `${lessonId} Spanish body is materially shorter than the English audit source`,
        });
      }
    }
  }

  if (documents.length !== 24 || paths.size !== 24) {
    issues.push({ file: "content", message: `expected exactly 24 localized week documents, found ${documents.length}` });
  }

  return issues;
}

export function loadCurriculum(contentRoot = path.join(process.cwd(), "content")): CurriculumValidationResult {
  const issues: CurriculumValidationIssue[] = [];
  const documents: CurriculumDocument[] = [];
  const weeksRoot = path.join(contentRoot, "weeks");

  if (!fs.existsSync(weeksRoot)) {
    return { documents, issues: [{ file: weeksRoot, message: "curriculum weeks directory does not exist" }] };
  }

  for (const filename of collectMdxFiles(weeksRoot).sort()) {
    const sourcePath = path.relative(process.cwd(), filename).split(path.sep).join("/");
    try {
      const parsed = matter(fs.readFileSync(filename, "utf8"), {
        engines: { yaml: (source) => parseYaml(source) as Record<string, unknown> },
      });
      const frontmatter = curriculumFrontmatterSchema.safeParse(parsed.data);
      if (!frontmatter.success) {
        for (const problem of frontmatter.error.issues) {
          issues.push({
            file: sourcePath,
            message: `${problem.path.join(".") || "frontmatter"}: ${problem.message}`,
          });
        }
        continue;
      }

      issues.push(...validateBody(parsed.content, sourcePath));
      const lessonIds = frontmatter.data.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id));
      const lessonContent = extractLessonBodies(parsed.content, lessonIds, frontmatter.data.locale, sourcePath);
      issues.push(...lessonContent.issues);
      documents.push({
        ...frontmatter.data,
        body: parsed.content.trim(),
        lessonBodies: lessonContent.lessonBodies,
        sourcePath,
      });
    } catch (error) {
      issues.push({ file: sourcePath, message: error instanceof Error ? error.message : String(error) });
    }
  }

  issues.push(...validateCollection(documents));
  documents.sort((left, right) => left.week - right.week || left.locale.localeCompare(right.locale));
  return { documents, issues };
}

export function assertValidCurriculum(contentRoot?: string): CurriculumDocument[] {
  const result = loadCurriculum(contentRoot);
  if (result.issues.length > 0) {
    throw new Error(result.issues.map((issue) => `${issue.file}: ${issue.message}`).join("\n"));
  }
  return result.documents;
}
