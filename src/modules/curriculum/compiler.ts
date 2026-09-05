import type { CompiledLessonBody, LessonContentBlock } from "./schema";

const RAW_HTML = /<(?!https?:\/\/)[A-Za-z!/][^>]*>/;

export function countWords(value: string): number {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#[\]()]/g, " ")
    .trim()
    .split(/\s+/u)
    .filter(Boolean).length;
}

export function compileLessonMarkdown(lessonId: string, markdown: string): CompiledLessonBody {
  const proseOnly = markdown.replace(/```[\s\S]*?```/g, "");
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

    const fence = line.match(/^```([a-zA-Z0-9_-]*)\s*$/);
    if (fence) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !/^```\s*$/.test(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }
      if (index >= lines.length) throw new Error(`${lessonId}: unclosed code fence`);
      blocks.push({ type: "code", language: fence[1] || "text", code: code.join("\n") });
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length as 2 | 3, text: heading[2].trim() });
      index += 1;
      continue;
    }

    const orderedItem = line.match(/^\d+\.\s+(.+)$/);
    const unorderedItem = line.match(/^[-*]\s+(.+)$/);
    if (orderedItem || unorderedItem) {
      const ordered = Boolean(orderedItem);
      const items: string[] = [];
      const itemPattern = ordered ? /^\d+\.\s+(.+)$/ : /^[-*]\s+(.+)$/;
      while (index < lines.length) {
        const item = lines[index].match(itemPattern);
        if (!item) break;
        items.push(item[1].trim());
        index += 1;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    const paragraph: string[] = [line.trim()];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^```/.test(lines[index]) &&
      !/^#{2,3}\s+/.test(lines[index]) &&
      !/^\d+\.\s+/.test(lines[index]) &&
      !/^[-*]\s+/.test(lines[index])
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return { lessonId, markdown: markdown.trim(), wordCount: countWords(markdown), blocks };
}
