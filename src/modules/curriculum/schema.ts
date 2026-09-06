import { z } from "zod";

export const CURRICULUM_LOCALES = ["es-MX", "en"] as const;
export const publicationStates = ["draft", "review", "published", "archived"] as const;

export const curriculumLocaleSchema = z.enum(CURRICULUM_LOCALES);
export const publicationStateSchema = z.enum(publicationStates);

const stableIdSchema = z
  .string()
  .min(3)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase kebab-case stable ID");

const nonEmptyText = z.string().trim().min(8).max(1_000);

export function isSafePublicUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return false;

    const host = url.hostname.toLowerCase().replace(/\.$/, "");
    if (
      host === "localhost" ||
      host.endsWith(".localhost") ||
      host.endsWith(".local") ||
      host === "0.0.0.0" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^169\.254\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host)
    ) {
      return false;
    }

    return host.includes(".");
  } catch {
    return false;
  }
}

export const safePublicUrlSchema = z
  .string()
  .url()
  .refine(isSafePublicUrl, "must be a public HTTPS URL without credentials");

const lessonSchema = z.object({
  id: stableIdSchema,
  title: z.string().trim().min(3).max(160),
  summary: nonEmptyText,
  estimatedMinutes: z.number().int().min(15).max(480),
  required: z.boolean(),
  kind: z.enum(["lesson", "lab", "checkpoint", "workshop"]),
  outcomes: z.array(nonEmptyText).min(2).max(6),
});

const moduleSchema = z.object({
  id: stableIdSchema,
  title: z.string().trim().min(3).max(160),
  lessons: z.array(lessonSchema).min(1).max(8),
});

const rubricCriterionSchema = z.object({
  id: stableIdSchema,
  title: z.string().trim().min(3).max(160),
  description: nonEmptyText,
  type: z.enum(["machine", "human"]),
  weight: z.number().int().min(1).max(100),
  required: z.boolean(),
});

const rubricSchema = z
  .object({
    id: stableIdSchema,
    version: z.number().int().positive(),
    passThreshold: z.number().int().min(1).max(100),
    criteria: z.array(rubricCriterionSchema).min(3).max(12),
  })
  .superRefine((rubric, context) => {
    const totalWeight = rubric.criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
    if (totalWeight !== 100) {
      context.addIssue({
        code: "custom",
        message: `rubric criterion weights must total 100, received ${totalWeight}`,
        path: ["criteria"],
      });
    }
  });

const projectSchema = z.object({
  id: stableIdSchema,
  title: z.string().trim().min(3).max(160),
  summary: nonEmptyText,
  collaboration: z.enum(["individual", "pairs", "team", "optional-team"]),
  estimatedMinutes: z.number().int().min(60).max(2_400),
  deliverables: z.array(nonEmptyText).min(3).max(10),
  rubric: rubricSchema,
});

const externalResourceSchema = z.object({
  label: z.string().trim().min(3).max(160),
  url: safePublicUrlSchema,
  kind: z.enum(["documentation", "reference", "tool", "upstream"]),
});

const provenanceSchema = z.object({
  adaptedFrom: z.literal("The Odin Project"),
  upstreamRepository: safePublicUrlSchema,
    upstreamCommit: z.string().regex(/^[a-f0-9]{40}$/, "must be a full Git commit SHA"),
  upstreamPaths: z
    .array(
      z
        .string()
        .trim()
        .min(3)
        .max(300)
        .regex(/^[a-zA-Z0-9][a-zA-Z0-9_./-]*$/)
        .refine((value) => !value.startsWith("/") && !value.split("/").includes(".."), "must be a safe repository-relative path"),
    )
    .min(1),
  license: z.literal("CC BY-NC-SA 4.0"),
  attribution: z
    .string()
    .trim()
    .min(30)
    .refine((value) => value.includes("The Odin Project"), "must name The Odin Project"),
  adaptationStatus: z.enum(["original-adaptation", "translated-adaptation", "reviewed"]),
  editor: z.string().trim().min(3).max(160),
  translator: z.string().trim().min(3).max(160).optional(),
  reviewedAt: z.string().date(),
  externalResources: z.array(externalResourceSchema).min(1).max(12),
});

export const curriculumFrontmatterSchema = z
  .object({
    schemaVersion: z.literal(1),
    programId: stableIdSchema,
    contentVersion: z.string().regex(/^\d{4}\.\d+$/),
    id: stableIdSchema,
    week: z.number().int().min(1).max(12),
    locale: curriculumLocaleSchema,
    status: publicationStateSchema,
    title: z.string().trim().min(3).max(160),
    summary: nonEmptyText,
    estimatedMinutes: z.number().int().min(120).max(3_000),
    prerequisites: z.array(z.string().trim().min(3).max(160)).max(10),
    objectives: z.array(nonEmptyText).min(3).max(10),
    platforms: z
      .array(z.enum(["windows", "macos"]))
      .min(2)
      .refine((values) => values.includes("windows") && values.includes("macos"), {
        message: "every week must support Windows and macOS",
      }),
    modules: z.array(moduleSchema).min(2).max(8),
    project: projectSchema,
    provenance: provenanceSchema,
  })
  .superRefine((week, context) => {
    const expectedPrefix = `week-${String(week.week).padStart(2, "0")}`;
    if (week.id !== expectedPrefix) {
      context.addIssue({
        code: "custom",
        message: `week ID must be ${expectedPrefix}`,
        path: ["id"],
      });
    }

    if (week.project.id !== `${week.id}-project`) {
      context.addIssue({
        code: "custom",
        message: `project ID must be ${week.id}-project`,
        path: ["project", "id"],
      });
    }
    if (week.project.rubric.id !== `${week.id}-rubric-v${week.project.rubric.version}`) {
      context.addIssue({
        code: "custom",
        message: `rubric ID must match its week and version`,
        path: ["project", "rubric", "id"],
      });
    }

    let lessonNumber = 0;
    week.modules.forEach((module, moduleIndex) => {
      const expectedModuleId = `${week.id}-module-${String(moduleIndex + 1).padStart(2, "0")}`;
      if (module.id !== expectedModuleId) {
        context.addIssue({
          code: "custom",
          message: `module ID must be ${expectedModuleId}`,
          path: ["modules", moduleIndex, "id"],
        });
      }
      module.lessons.forEach((lesson, localLessonIndex) => {
        lessonNumber += 1;
        const expectedLessonId = `${week.id}-lesson-${String(lessonNumber).padStart(2, "0")}`;
        if (lesson.id !== expectedLessonId) {
          context.addIssue({
            code: "custom",
            message: `lesson ID must be ${expectedLessonId}`,
            path: ["modules", moduleIndex, "lessons", localLessonIndex, "id"],
          });
        }
      });
    });

    week.project.rubric.criteria.forEach((criterion, criterionIndex) => {
      if (!criterion.id.startsWith(`${week.id}-criterion-`)) {
        context.addIssue({
          code: "custom",
          message: `criterion ID must begin with ${week.id}-criterion-`,
          path: ["project", "rubric", "criteria", criterionIndex, "id"],
        });
      }
    });

    const ids = [
      week.id,
      week.project.id,
      week.project.rubric.id,
      ...week.modules.flatMap((module) => [module.id, ...module.lessons.map((lesson) => lesson.id)]),
      ...week.project.rubric.criteria.map((criterion) => criterion.id),
    ];
    const duplicate = ids.find((id, index) => ids.indexOf(id) !== index);
    if (duplicate) {
      context.addIssue({ code: "custom", message: `duplicate stable ID: ${duplicate}`, path: ["id"] });
    }
  });

export type CurriculumLocale = z.infer<typeof curriculumLocaleSchema>;
export type PublicationState = z.infer<typeof publicationStateSchema>;
export type CurriculumFrontmatter = z.infer<typeof curriculumFrontmatterSchema>;

export interface LessonListGroup { ordered: boolean; items: { text: string; children: LessonListGroup[] }[] }

export type LessonContentBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; headings: string[]; rows: string[][] }
  | { type: "nested-list"; groups: LessonListGroup[] }
  | { type: "anchor"; id: string }
  | { type: "code"; language: string; code: string };

export interface CompiledLessonBody {
  lessonId: string;
  markdown: string;
  wordCount: number;
  blocks: LessonContentBlock[];
}

export interface CurriculumDocument extends CurriculumFrontmatter {
  body: string;
  lessonBodies: Record<string, CompiledLessonBody>;
  sourcePath: string;
}

export interface CurriculumValidationIssue {
  file: string;
  message: string;
}

export interface CurriculumValidationResult {
  documents: CurriculumDocument[];
  issues: CurriculumValidationIssue[];
}
