import { contentManifest } from "@/generated/content-manifest";
import type { CurriculumDocument, CurriculumLocale } from "./schema";
import { withOdinLibrary } from "./odin";

const manifest: readonly CurriculumDocument[] = contentManifest;

export interface CurriculumRegistryOptions {
  locale?: CurriculumLocale;
  includeUnpublished?: boolean;
  includeLibrary?: boolean;
}

export interface CurriculumLesson {
  id: string;
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  required: boolean;
  kind: "lesson" | "lab" | "checkpoint" | "workshop";
  outcomes: string[];
  weekId: string;
  week: number;
  weekTitle: string;
  moduleId: string;
  locale: CurriculumLocale;
  contentVersion: string;
  content: CurriculumDocument["lessonBodies"][string];
}

export function listCurriculumWeeks(options: CurriculumRegistryOptions = {}): CurriculumDocument[] {
  const locale = options.locale ?? "es-MX";
  return manifest
    .filter((document) => document.locale === locale)
    .filter((document) => options.includeUnpublished || document.status === "published")
    .slice()
    .sort((left, right) => left.week - right.week)
    .map((week) => options.includeLibrary ? withOdinLibrary(week) : week);
}

export function getCurriculumWeek(
  week: number,
  options: CurriculumRegistryOptions = {},
): CurriculumDocument | undefined {
  return listCurriculumWeeks(options).find((document) => document.week === week);
}

export function getCurriculumWeekById(
  id: string,
  options: CurriculumRegistryOptions = {},
): CurriculumDocument | undefined {
  return listCurriculumWeeks(options).find((document) => document.id === id);
}

export function listCurriculumLessons(options: CurriculumRegistryOptions = {}): CurriculumLesson[] {
  return listCurriculumWeeks(options).flatMap((week) =>
    week.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({
        ...lesson,
        slug: lesson.id,
        weekId: week.id,
        week: week.week,
        weekTitle: week.title,
        moduleId: module.id,
        locale: week.locale,
        contentVersion: week.contentVersion,
        content: week.lessonBodies[lesson.id],
      })),
    ),
  );
}

export function getCurriculumLesson(
  lessonId: string,
  options: CurriculumRegistryOptions = {},
): CurriculumLesson | undefined {
  return listCurriculumLessons(options).find((lesson) => lesson.id === lessonId);
}

export function getCurriculumLessonBySlug(
  week: number,
  slug: string,
  options: CurriculumRegistryOptions = {},
): CurriculumLesson | undefined {
  return listCurriculumLessons(options).find((lesson) => lesson.week === week && lesson.slug === slug);
}

export function getCurriculumVersion(): string {
  return manifest[0]?.contentVersion ?? "unknown";
}

export function getProgramId(): string {
  return manifest[0]?.programId ?? "unknown";
}

export function getRequiredLessonIds(locale: CurriculumLocale = "es-MX"): string[] {
  return listCurriculumWeeks({ locale }).flatMap((week) =>
    week.modules.flatMap((module) =>
      module.lessons.filter((lesson) => lesson.required).map((lesson) => lesson.id),
    ),
  );
}

export function getProjectIds(locale: CurriculumLocale = "es-MX"): string[] {
  return listCurriculumWeeks({ locale }).map((week) => week.project.id);
}

export function curriculumCompletionRequirements(locale: CurriculumLocale = "es-MX") {
  return {
    contentVersion: getCurriculumVersion(),
    requiredLessonIds: getRequiredLessonIds(locale),
    requiredProjectIds: getProjectIds(locale),
    capstoneProjectId: "week-12-project",
  } as const;
}
