import type { ReactNode } from "react";
import { isSafePublicUrl } from "@/modules/curriculum/schema";

/** Deliberately renders text/links, never HTML or executable MDX. */
export function MarkdownText({ text }: { text: string }) {
  const result: ReactNode[] = [];
  const token = /(`[^`\n]+`|!?\[([^\]]+)\]\(((?:[^\s()]|\([^()\s]*\))+)(?:\s+"[^"]*")?\)|\*\*([^*]+)\*\*|\*([^*\n]+)\*)/g;
  let last = 0;
  for (const match of text.matchAll(token)) {
    const at = match.index!;
    result.push(text.slice(last, at));
    const value = match[0];
    if (value.startsWith("`")) result.push(<code key={at}>{value.slice(1, -1)}</code>);
    else if (match[2]) {
      const href = match[3];
      const safe = isSafePublicUrl(href) || /^#[a-z0-9-]+$/i.test(href);
      result.push(safe
        ? <a href={href} key={at} rel={href.startsWith("https:") ? "noreferrer" : undefined} target={href.startsWith("https:") ? "_blank" : undefined}>{match[2]}{value.startsWith("!") ? " ↗" : ""}</a>
        : <span key={at}>{match[2]} ({href})</span>);
    } else if (match[4]) result.push(<strong key={at}>{match[4]}</strong>);
    else result.push(<em key={at}>{match[5]}</em>);
    last = at + value.length;
  }
  result.push(text.slice(last));
  return <>{result}</>;
}
