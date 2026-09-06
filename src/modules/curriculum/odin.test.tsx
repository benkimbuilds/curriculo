import fs from "node:fs";
import crypto from "node:crypto";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MarkdownText } from "@/components/markdown-text";
import { compileLessonMarkdown } from "./compiler";
import { normalizeOdinMarkdown, originalReadingUrls } from "./odin-markdown";
import { getOdinCoverage, listOdinDocuments } from "./odin";
import { curriculumCompletionRequirements, listCurriculumWeeks } from "./registry";

describe("pinned Odin coverage", () => {
  it("includes every official lesson and project in both editions", () => {
    const coverage = getOdinCoverage();
    const documents = listOdinDocuments();
    expect(coverage.expected).toBe(197);
    expect(coverage.mapped).toBe(coverage.expected);
    expect(coverage.courses.every(course => course.count === course.mapped)).toBe(true);
    expect(documents.filter(item => item.kind === "project")).toHaveLength(35);
    expect(new Set(documents.map(item => item.id)).size).toBe(documents.length);
    for (const item of documents) {
      const original = fs.readFileSync(`content/odin/upstream/${item.sourcePath}`);
      expect(crypto.createHash("sha256").update(original).digest("hex")).toBe(item.sourceHash);
      expect(item.markdown["es-MX"].length).toBeGreaterThan(200);
      expect(item.markdown.en.length).toBeGreaterThan(200);
      expect(item.sourceUrl).toContain(coverage.curriculumCommit);
    }
  });

  it("exposes extension lessons without changing existing graduation requirements", () => {
    const weeks = listCurriculumWeeks({ includeLibrary: true });
    const lessons = weeks.flatMap(week => week.modules.flatMap(module => module.lessons));
    expect(lessons.filter(lesson => !lesson.required)).toHaveLength(197);
    expect(lessons.filter(lesson => lesson.required)).toHaveLength(48);
    expect(curriculumCompletionRequirements().requiredLessonIds).toHaveLength(48);
    for (const week of weeks) for (const unit of week.modules) for (const lesson of unit.lessons) {
      expect(week.lessonBodies[lesson.id]).toBeDefined();
    }
  });
});

describe("safe curriculum rendering", () => {
  it("keeps inline code literal while removing upstream presentation HTML", () => {
    const markdown = normalizeOdinMarkdown('<div class="lesson-note">\nUse `<script>` in the example.\n</div>\n\n```html\n<script>alert(1)</script>\n```', "https://github.com/TheOdinProject/curriculum/blob/commit/foundations/example.md");
    const body = compileLessonMarkdown("example", markdown);
    expect(body.blocks.some(block => block.type === "code" && block.code.includes("<script>"))).toBe(true);
    expect(body.markdown).toContain("`<script>`");
    expect(body.markdown).not.toContain('<div class="lesson-note">');
    expect(() => compileLessonMarkdown("unsafe", "<script>alert(1)</script>")).toThrow();
  });

  it("renders safe reading links and code without executing HTML or unsafe URLs", () => {
    const html = renderToStaticMarkup(<MarkdownText text={'Read [reference](https://example.org/a_(b)) and **check** `<script>`. [bad](javascript:alert(1))'} />);
    expect(html).toContain('href="https://example.org/a_(b)"');
    expect(html).toContain("<strong>check</strong>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain('href="javascript:');
  });

  it("preserves nested assignment lists and code pipes inside tables", () => {
    const nested = compileLessonMarkdown("list", "1. Build the app\n   - Validate input\n   - Reject unauthorized edits\n2. Test it");
    const group = nested.blocks[0];
    expect(group.type).toBe("nested-list");
    if (group.type === "nested-list") {
      expect(group.groups[0].items).toHaveLength(2);
      expect(group.groups[0].items[0].children[0].items).toHaveLength(2);
    }
    const table = compileLessonMarkdown("table", "| Operator | Use |\n| --- | --- |\n| `a || b` | fallback |");
    expect(table.blocks[0]).toMatchObject({ type: "table", rows: [["`a || b`", "fallback"]] });
  });

  it("preserves indented examples, angle-bracket destinations and explicit source anchors", () => {
    const markdown = normalizeOdinMarkdown('## State\n<span id="useState-hook"></span>\n[Vim](<https://en.wikipedia.org/wiki/Vim_(text_editor)>)\n\n    ```jsx\n    <Button />\n    ```', "https://github.com/TheOdinProject/curriculum/blob/commit/react/state.md");
    const body = compileLessonMarkdown("source", markdown);
    expect(body.blocks).toContainEqual({ type: "anchor", id: "useState-hook" });
    expect(body.blocks).toContainEqual({ type: "code", language: "jsx", code: "<Button />" });
    expect(markdown).toContain("[Vim](https://en.wikipedia.org/wiki/Vim_(text_editor))");
    expect(originalReadingUrls('[Vim](<https://en.wikipedia.org/wiki/Vim_(text_editor)>)\n\n```js\nconst url = "https://placeholder.test";\n```', "https://github.com/TheOdinProject/curriculum/blob/commit/example.md")).toEqual(["https://en.wikipedia.org/wiki/Vim_(text_editor)"]);
  });
});
