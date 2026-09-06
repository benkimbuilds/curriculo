import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { z } from "zod";
import { countWords, compileLessonMarkdown, lessonHeadingId } from "../../src/modules/curriculum/compiler";
import { normalizeOdinMarkdown, originalReadingUrls } from "../../src/modules/curriculum/odin-markdown";
import type { OdinDocument } from "../../src/modules/curriculum/odin-types";

const root = path.resolve("content/odin");
const inventory = JSON.parse(fs.readFileSync(path.join(root, "inventory.json"), "utf8")) as {
  curriculumCommit: string; orderingCommit: string;
  courses: { id: string; title: string; fixture: string; count: number }[];
  items: { id: string; collection: string; upstreamUuid: string; course: string; title: string; kind: "lesson" | "project"; order: number; courseOrder: number; sourcePath: string; sourceUrl: string; sha256: string }[];
};
const mappingSchema = z.object({ id: z.string(), titleEs: z.string().min(3), week: z.number().int().min(1).max(12), estimatedMinutes: z.number().int().min(10).max(3600), treatment: z.enum(["translation", "platform-adaptation", "technical-adaptation", "nextjs-replacement"]) });
const mappings: z.infer<typeof mappingSchema>[] = [];
const issues: string[] = [];
for (const course of inventory.courses) {
  const fixture = fs.readFileSync(path.join(root, "ordering", course.fixture), "utf8");
  const listedCount = [...fixture.matchAll(/\w+_lessons\.fetch\(/g)].length;
  const actual = inventory.items.filter(item => item.course === course.id);
  if (listedCount !== course.count || actual.length !== course.count) issues.push(`${course.id}: inventory differs from the vendored official ordering`);
  const orderedReferences = [...fixture.matchAll(/(\w+_lessons)\.fetch\('((?:\\.|[^'])*)'\)/g)].map(match => `${match[1]}:${match[2].replace(/\\'/g, "'")}`);
  if (JSON.stringify(orderedReferences) !== JSON.stringify(actual.map(item => `${item.collection}:${item.title}`))) issues.push(`${course.id}: lesson membership/order differs from the official course`);
  for (const item of actual) {
    const definitions = fs.readFileSync(path.join(root, "ordering/db/fixtures/lessons", `${item.collection}.rb`), "utf8");
    const block = definitions.split("    '").find(part => part.includes(`identifier_uuid: '${item.upstreamUuid}'`));
    if (!block?.includes(`github_path: '/${item.sourcePath}'`)) issues.push(`${item.id}: source path does not match its official lesson UUID`);
  }
  const filename = path.join(root, "mappings", `${course.id}.json`);
  if (!fs.existsSync(filename)) { issues.push(`Missing mapping: ${course.id}`); continue; }
  const entries = z.array(mappingSchema).parse(JSON.parse(fs.readFileSync(filename, "utf8")));
  for (const entry of entries) if (!actual.some(item => item.id === entry.id)) issues.push(`${entry.id}: not in course ${course.id}`);
  mappings.push(...entries);
}
const allIds = inventory.items.map(item => item.id);
if (new Set(allIds).size !== allIds.length) issues.push("Duplicate upstream inventory identifiers");
const documents: OdinDocument[] = [];
for (const item of inventory.items) {
  const candidates = mappings.filter(mapping => mapping.id === item.id);
  if (candidates.length !== 1) { issues.push(`${item.id}: expected exactly one mapping, got ${candidates.length}`); continue; }
  const mapping = candidates[0];
  if (/^(archive|ruby|ruby_on_rails)\//.test(item.sourcePath)) issues.push(`${item.id}: out-of-scope source`);
  const source = fs.readFileSync(path.join(root, "upstream", item.sourcePath), "utf8");
  const sourceHash = crypto.createHash("sha256").update(source).digest("hex");
  if (sourceHash !== item.sha256) issues.push(`${item.id}: vendored source differs from its pinned hash`);
  const spanishPath = path.join(root, "es-MX", `${item.id}.md`);
  const englishPath = path.join(root, "en", `${item.id}.md`);
  if (!fs.existsSync(spanishPath)) { issues.push(`${item.id}: missing Spanish lesson`); continue; }
  if (mapping.treatment !== "translation" && !fs.existsSync(englishPath)) issues.push(`${item.id}: adapted instructions need an English audit edition`);
  const es = normalizeOdinMarkdown(fs.readFileSync(spanishPath, "utf8").replace(/^# [^\n]+\n/, ""), item.sourceUrl);
  const englishSource = fs.existsSync(englishPath) ? fs.readFileSync(englishPath, "utf8") : source;
  const englishTitle = englishSource.match(/^# ([^\n]+)/)?.[1] ?? item.title;
  const en = normalizeOdinMarkdown(englishSource.replace(/^# [^\n]+\n/, ""), item.sourceUrl);
  const sourceWords = countWords(source);
  const spanishWords = countWords(es);
  const floor = mapping.treatment === "translation" ? Math.max(60, Math.round(sourceWords * .6)) : Math.max(120, Math.min(600, Math.round(sourceWords * .5)));
  if (spanishWords < floor) issues.push(`${item.id}: Spanish text is too abbreviated (${spanishWords} words, minimum source-relative check ${floor})`);
  for (const [locale, markdown] of [["es-MX", es], ["en", en]]) {
    try {
      const blocks = compileLessonMarkdown(item.id, markdown).blocks;
      const anchors = new Set(blocks.flatMap(block => block.type === "anchor" ? [block.id] : block.type === "heading" ? [lessonHeadingId(block.text)] : []));
      for (const link of markdown.matchAll(/\]\(#([^)]*)\)/g)) if (!anchors.has(link[1])) issues.push(`${item.id} ${locale}: missing knowledge-check anchor ${link[1]}`);
    } catch (error) { issues.push(`${item.id} ${locale}: ${String(error)}`); }
    if (/\b(?:TODO_TRANSLATE|TRANSLATION_PENDING|PLACEHOLDER_CONTENT)\b/.test(markdown)) issues.push(`${item.id} ${locale}: unfinished translation marker`);
  }
  const resources = originalReadingUrls(source, item.sourceUrl);
  documents.push({ id: mapping.id, week: mapping.week, estimatedMinutes: mapping.estimatedMinutes, treatment: mapping.treatment, course: item.course, courseTitle: inventory.courses.find(course => course.id === item.course)!.title, kind: item.kind, order: item.order, courseOrder: item.courseOrder, title: { en: englishTitle, "es-MX": mapping.titleEs }, sourceTitle: item.title, englishEdition: fs.existsSync(englishPath) ? "adapted" : "upstream", markdown: { en, "es-MX": es }, sourcePath: item.sourcePath, sourceUrl: item.sourceUrl, sourceHash, sourceWords, spanishWords, resources });
}
if (documents.length !== inventory.items.length) issues.push(`Coverage incomplete: ${documents.length}/${inventory.items.length} lesson pairs`);
if (issues.length) { console.error(issues.join("\n")); process.exit(1); }

const output = `// Generated by scripts/content/generate-odin-manifest.ts. Do not edit.\nimport type { OdinDocument } from "@/modules/curriculum/odin-types";\nexport const odinManifest: OdinDocument[] = ${JSON.stringify(documents, null, 2)};\n`;
const report = {
  curriculumCommit: inventory.curriculumCommit,
  orderingCommit: inventory.orderingCommit,
  expectedItems: inventory.items.length,
  mappedItems: documents.length,
  sourceLessons: documents.filter(item => item.kind === "lesson").length,
  sourceProjects: documents.filter(item => item.kind === "project").length,
  translatedItems: documents.filter(item => item.treatment === "translation").length,
  adaptedItems: documents.filter(item => item.treatment !== "translation").length,
  humanEditorialReview: "not_independently_certified",
  scope: "Structural source coverage at the pinned commits; not a guarantee about future upstream changes, external resource availability, or instructional quality.",
  courses: inventory.courses.map(course => ({ ...course, mapped: documents.filter(item => item.course === course.id).length })),
};
const baseline = { curriculumCommit: inventory.curriculumCommit, orderingCommit: inventory.orderingCommit, expectedItems: inventory.items.length, courses: inventory.courses };
const files = [[path.resolve("src/generated/odin-manifest.ts"), output], [path.resolve("src/generated/odin-baseline.ts"), `// Generated by scripts/content/generate-odin-manifest.ts.\nexport const odinBaseline = ${JSON.stringify(baseline, null, 2)};\n`], [path.join(root, "coverage.json"), JSON.stringify(report, null, 2) + "\n"]];
for (const [file, body] of files) {
  if (process.argv.includes("--check")) {
    if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== body) throw new Error(`${file} is stale; run pnpm content:odin:build`);
  } else fs.writeFileSync(file, body);
}
console.log(`Odin coverage: ${documents.length}/${inventory.items.length} mapped bilingual items (${report.sourceLessons} lessons, ${report.sourceProjects} projects).`);
