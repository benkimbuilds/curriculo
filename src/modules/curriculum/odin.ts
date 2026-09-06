import { odinManifest } from "@/generated/odin-manifest";
import { compileLessonMarkdown } from "./compiler";
import { odinCourseTitles } from "./odin-types";
import type { CurriculumDocument, CurriculumLocale } from "./schema";
import { odinBaseline as inventory } from "@/generated/odin-baseline";

export { odinCourseTitles } from "./odin-types";
export function listOdinDocuments() { return odinManifest; }
export function getOdinDocument(id: string) { return odinManifest.find((item) => item.id === id); }
export function getOdinCoverage() {
  return {
    expected: inventory.expectedItems,
    mapped: odinManifest.length,
    curriculumCommit: inventory.curriculumCommit,
    orderingCommit: inventory.orderingCommit,
    courses: inventory.courses.map(course => ({ ...course, mapped: odinManifest.filter(item => item.course === course.id).length })),
  };
}

const compiled = new Map<string, ReturnType<typeof compileLessonMarkdown>>();
function bodyFor(id: string, locale: CurriculumLocale, markdown: string) {
  const key = `${id}:${locale}`;
  if (!compiled.has(key)) compiled.set(key, compileLessonMarkdown(id, markdown));
  return compiled.get(key)!;
}

export function withOdinLibrary(week: CurriculumDocument): CurriculumDocument {
  const additions = odinManifest.filter((item) => item.week === week.week);
  if (!additions.length) return week;
  const locale = week.locale;
  const modules = [...week.modules];
  const lessonBodies = { ...week.lessonBodies };
  for (const course of [...new Set(additions.map((item) => item.course))]) {
    const items = additions.filter((item) => item.course === course);
    const lessons = items.map((item) => {
      lessonBodies[item.id] = bodyFor(item.id, locale, item.markdown[locale]);
      return {
        id: item.id,
        title: item.title[locale],
        summary: locale === "es-MX"
          ? `${item.kind === "project" ? "Proyecto de práctica" : "Lección de profundización"} de ${odinCourseTitles[item.course]}. Incluye la adaptación del material, las actividades y las lecturas de referencia.`
          : `${item.kind === "project" ? "Practice project" : "Extended lesson"} from ${item.courseTitle}. Includes adapted instruction, assignments and reference readings.`,
        estimatedMinutes: item.estimatedMinutes,
        required: false,
        kind: item.kind === "project" ? "lab" as const : "lesson" as const,
        outcomes: locale === "es-MX"
          ? ["Resolver las actividades y requisitos específicos de esta lección.", "Comprobar el resultado con las preguntas y criterios del material."]
          : ["Complete the specific assignments and requirements in this lesson.", "Check the result against the questions and criteria in the material."],
      };
    });
    modules.push({ id: `${week.id}-odin-${course}`, title: locale === "es-MX" ? odinCourseTitles[course] : items[0].courseTitle, lessons });
  }
  return { ...week, modules, lessonBodies };
}
