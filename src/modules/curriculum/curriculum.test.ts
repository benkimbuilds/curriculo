import { describe, expect, it } from "vitest";
import { loadCurriculum } from "./loader";
import {
  curriculumCompletionRequirements,
  getCurriculumLesson,
  getCurriculumWeek,
  listCurriculumLessons,
  listCurriculumWeeks,
} from "./registry";
import { isSafePublicUrl } from "./schema";

describe("curriculum content", () => {
  it("validates all 12 weeks in both locales", () => {
    const result = loadCurriculum();
    expect(result.issues).toEqual([]);
    expect(result.documents).toHaveLength(24);
    expect(new Set(result.documents.map((document) => document.week)).size).toBe(12);
    expect(new Set(result.documents.map((document) => document.locale))).toEqual(new Set(["en", "es-MX"]));
  });

  it("keeps locale-stable curriculum identifiers", () => {
    const result = loadCurriculum();
    for (let week = 1; week <= 12; week += 1) {
      const localized = result.documents.filter((document) => document.week === week);
      expect(localized).toHaveLength(2);
      expect(localized[0].project.id).toBe(localized[1].project.id);
      expect(localized[0].project.rubric.criteria.map(({ id }) => id)).toEqual(
        localized[1].project.rubric.criteria.map(({ id }) => id),
      );
      expect(Object.keys(localized[0].lessonBodies)).toEqual(Object.keys(localized[1].lessonBodies));
    }
  });

  it("contains substantive compiled content for every localized lesson", () => {
    const result = loadCurriculum();
    const bodies = result.documents.flatMap((document) => Object.values(document.lessonBodies));
    expect(bodies).toHaveLength(96);
    for (const body of bodies) {
      expect(body.wordCount).toBeGreaterThanOrEqual(140);
      expect(body.blocks.some((block) => block.type === "code")).toBe(true);
      expect(body.blocks.filter((block) => block.type === "heading")).toHaveLength(5);
      expect(body.blocks.some((block) => block.type === "list" && block.ordered && block.items.length >= 3)).toBe(true);
      expect(body.blocks.some((block) => block.type === "list" && !block.ordered && block.items.length >= 2)).toBe(true);
    }
  });

  it("exposes safe compiled lesson blocks through the registry", () => {
    expect(listCurriculumLessons()).toHaveLength(48);
    const lesson = getCurriculumLesson("week-01-lesson-01");
    expect(lesson?.locale).toBe("es-MX");
    expect(lesson?.content.lessonId).toBe(lesson?.id);
    expect(lesson?.content.blocks.some((block) => block.type === "code")).toBe(true);
    expect(JSON.stringify(lesson?.content.blocks)).not.toContain("<script");
  });

  it("exposes only the published Spanish learner sequence by default", () => {
    const weeks = listCurriculumWeeks();
    expect(weeks).toHaveLength(12);
    expect(weeks.every((week) => week.locale === "es-MX" && week.status === "published")).toBe(true);
    expect(getCurriculumWeek(1)?.title).toBe("Empieza como desarrollador o desarrolladora");
  });

  it("derives version-pinned completion requirements", () => {
    const requirements = curriculumCompletionRequirements();
    expect(requirements.contentVersion).toBe("2026.1");
    expect(requirements.requiredLessonIds).toHaveLength(48);
    expect(requirements.requiredProjectIds).toHaveLength(12);
    expect(requirements.capstoneProjectId).toBe("week-12-project");
  });
});

describe("safe public curriculum URLs", () => {
  it.each([
    "http://example.com",
    "https://localhost/lesson",
    "https://127.0.0.1/lesson",
    "https://10.0.0.5/lesson",
    "https://user:pass@example.com/lesson",
    "javascript:alert(1)",
  ])("rejects %s", (url) => expect(isSafePublicUrl(url)).toBe(false));

  it("accepts public HTTPS documentation", () => {
    expect(isSafePublicUrl("https://developer.mozilla.org/en-US/docs/Web/HTML")).toBe(true);
  });
});
