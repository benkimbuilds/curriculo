import type { CompiledLessonBody, LessonContentBlock, LessonListGroup } from "./schema";

const RAW_HTML = /<(?!https?:\/\/)[A-Za-z!/][^>]*>/;
const LIST_LINE = /^(\s*)(\d+\.|[-*+])\s+(.+)$/;
export function normalizeCodeFences(markdown: string): string {
  return markdown.replace(/^~~~([a-zA-Z0-9_-]*)\s*$/gm, "```$1");
}
export function lessonHeadingId(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/['’]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function tableCells(row: string): string[] {
  const cells: string[] = [];
  let cell = "", code = false, escaped = false;
  for (const char of row.trim().replace(/^\||\|$/g, "")) {
    if (escaped) { cell += char; escaped = false; continue; }
    if (char === "\\") { escaped = true; continue; }
    if (char === "`") code = !code;
    if (char === "|" && !code) { cells.push(cell.trim()); cell = ""; } else cell += char;
  }
  cells.push(cell.trim());
  return cells;
}

function nestedLists(entries: { indent: number; ordered: boolean; text: string }[]): LessonListGroup[] {
  let index = 0;
  function level(indent: number): LessonListGroup[] {
    const groups: LessonListGroup[] = [];
    while (index < entries.length && entries[index].indent >= indent) {
      const entry = entries[index++];
      let group = groups.at(-1);
      if (!group || group.ordered !== entry.ordered) { group = { ordered: entry.ordered, items: [] }; groups.push(group); }
      const item: LessonListGroup["items"][number] = { text: entry.text, children: [] };
      group.items.push(item);
      if (index < entries.length && entries[index].indent > indent) item.children = level(entries[index].indent);
    }
    return groups;
  }
  return level(Math.min(...entries.map(entry => entry.indent)));
}

export function countWords(value: string): number {
  return normalizeCodeFences(value)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#[\]()]/g, " ")
    .trim()
    .split(/\s+/u)
    .filter(Boolean).length;
}

export function compileLessonMarkdown(lessonId: string, markdown: string): CompiledLessonBody {
  markdown = normalizeCodeFences(markdown);
  const proseOnly = markdown.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]+`/g, "");
  if (RAW_HTML.test(proseOnly)) {
    throw new Error(`${lessonId}: raw HTML is not supported in lesson bodies`);
  }

  const lines = markdown.trim().split("\n");
  const blocks: LessonContentBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }
    if (/^\s*(?:---+|___+|\*\*\*+)\s*$/.test(line)) { index += 1; continue; }
    const anchor = line.match(/^\[anchor:([A-Za-z0-9_:.-]+)\]$/);
    if (anchor) { blocks.push({ type: "anchor", id: anchor[1] }); index += 1; continue; }

    if (line.includes("|") && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1] ?? "")) {
      const headings = tableCells(line);
      const rows: string[][] = [];
      index += 2;
      while (index < lines.length && lines[index].includes("|") && lines[index].trim()) {
        rows.push(tableCells(lines[index])); index += 1;
      }
      blocks.push({ type: "table", headings, rows });
      continue;
    }

    const fence = line.match(/^(\s*)```([a-zA-Z0-9_-]*)\s*$/);
    if (fence) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !/^\s*```\s*$/.test(lines[index])) {
        code.push(lines[index].startsWith(fence[1]) ? lines[index].slice(fence[1].length) : lines[index]);
        index += 1;
      }
      if (index >= lines.length) throw new Error(`${lessonId}: unclosed code fence`);
      blocks.push({ type: "code", language: fence[2] || "text", code: code.join("\n") });
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length <= 2 ? 2 : 3, text: heading[2].trim() });
      index += 1;
      continue;
    }

    const listLine = line.match(LIST_LINE);
    if (listLine) {
      const entries: { indent: number; ordered: boolean; text: string }[] = [];
      while (index < lines.length) {
        const item = lines[index].match(LIST_LINE);
        if (!item) break;
        entries.push({ indent: item[1].replace(/\t/g, "    ").length, ordered: /^\d/.test(item[2]), text: item[3].trim() });
        index += 1;
      }
      if (entries.every(item => item.indent === entries[0].indent && item.ordered === entries[0].ordered)) blocks.push({ type: "list", ordered: entries[0].ordered, items: entries.map(item => item.text) });
      else blocks.push({ type: "nested-list", groups: nestedLists(entries) });
      continue;
    }

    const paragraph: string[] = [line.trim()];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^\s*```/.test(lines[index]) &&
      !/^#{1,6}\s+/.test(lines[index]) &&
      !/^\[anchor:/.test(lines[index]) &&
      !LIST_LINE.test(lines[index])
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return { lessonId, markdown: markdown.trim(), wordCount: countWords(markdown), blocks };
}
