import { normalizeCodeFences } from "./compiler";
import { isSafePublicUrl } from "./schema";

export function originalReadingUrls(markdown: string, sourceUrl: string): string[] {
  const prose = normalizeOdinMarkdown(markdown, sourceUrl).replace(/```[\s\S]*?```/g, "");
  const links = [...prose.matchAll(/\]\(((?:[^\s()]|\([^()\s]*\))+)(?:\s+"[^"]*")?\)/g)].map(match => match[1]);
  const definitions = [...prose.matchAll(/^\s*\[[^\]]+\]:\s*(https?:\/\/\S+)/gm)].map(match => match[1].replace(/^http:/, "https:"));
  return [...new Set([...links, ...definitions].filter(isSafePublicUrl))];
}

/** Convert upstream presentation HTML to inert Markdown; code fences remain literal. */
export function normalizeOdinMarkdown(markdown: string, sourceUrl: string): string {
  markdown = normalizeCodeFences(markdown);
  const parts = markdown.split(/(```[\s\S]*?```|`[^`\n]+`)/g);
  return parts.map((part) => {
    if (part.startsWith("`")) return part;
    return part
      .replace(/\]\(<(https?:\/\/[^>]+)>\)/g, "]($1)")
      .replace(/<(https?:\/\/[^>\s]+)>/g, "[$1]($1)")
      .replace(/<!--([\s\S]*?)-->/g, "")
      .replace(/<[A-Za-z][^>]*\b(?:id|name)=["']([A-Za-z0-9_:.-]+)["'][^>]*>/g, (tag, id) => `\n[anchor:${id}]\n${tag}`)
      .replace(/\{:\s*#([A-Za-z0-9_:.-]+)[^}]*\}/g, "\n[anchor:$1]\n")
      .replace(/<iframe\b[^>]*src=["']([^"']+)["'][^>]*>[\s\S]*?<\/iframe>/gi, "[Ejemplo interactivo]($1)")
      .replace(/<img\b[^>]*>/gi, (tag) => {
        const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1];
        const alt = tag.match(/\balt=["']([^"']+)["']/i)?.[1] ?? "Imagen del material de origen";
        return src ? `[${alt}](${src})` : alt;
      })
      .replace(/<(?:kbd|code)>([\s\S]*?)<\/(?:kbd|code)>/gi, "`$1`")
      .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
      .replace(/<summary[^>]*>([\s\S]*?)<\/summary>/gi, "\n### $1\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/?[A-Za-z][^>]*>/g, "")
      .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
      .replace(/^#{4,6}\s+/gm, "### ")
      .replace(/^#\s+/gm, "## ")
      .replace(/^>\s?/gm, "")
      .replace(/\{:(?:[^}]*)\}/g, "")
      .replace(/\]\(http:\/\//g, "](https://")
      .replace(/\]\((?!https?:|#)([^)\s]+)\)/g, (_, target: string) => {
        const resolved = target.startsWith("/lessons/") || target.startsWith("/paths/")
          ? `https://www.theodinproject.com${target}`
          : new URL(target, sourceUrl).href;
        return `](${resolved})`;
      });
  }).join("");
}
