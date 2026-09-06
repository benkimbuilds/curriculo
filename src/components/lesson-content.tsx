import type { CompiledLessonBody, LessonListGroup } from "@/modules/curriculum";
import { lessonHeadingId } from "@/modules/curriculum/compiler";
import { MarkdownText } from "./markdown-text";

function NestedLists({ groups }: { groups: LessonListGroup[] }) {
  return <>{groups.map((group, i) => {
    const Tag = group.ordered ? "ol" : "ul";
    return <Tag key={i}>{group.items.map((item, j) => <li key={j}><MarkdownText text={item.text} />{item.children.length ? <NestedLists groups={item.children} /> : null}</li>)}</Tag>;
  })}</>;
}

export function LessonContent({ content }: { content: CompiledLessonBody }) {
  return (
    <div className="lesson-body">
      {content.blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        if (block.type === "anchor") return <span id={block.id} key={key} aria-hidden="true" />;
        if (block.type === "heading") {
          const id = lessonHeadingId(block.text);
          return block.level === 2
            ? <h2 id={id} key={key}><MarkdownText text={block.text} /></h2>
            : <h3 id={id} key={key}><MarkdownText text={block.text} /></h3>;
        }
        if (block.type === "paragraph") return <p key={key}><MarkdownText text={block.text} /></p>;
        if (block.type === "code") {
          return <pre className="lesson-code" key={key}><code data-language={block.language}>{block.code}</code></pre>;
        }
        if (block.type === "table") return <div className="lesson-table" key={key}><table><thead><tr>{block.headings.map((heading, i) => <th key={i}><MarkdownText text={heading} /></th>)}</tr></thead><tbody>{block.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}><MarkdownText text={cell} /></td>)}</tr>)}</tbody></table></div>;
        if (block.type === "nested-list") return <NestedLists key={key} groups={block.groups} />;
        return block.ordered
          ? <ol key={key}>{block.items.map((item, i) => <li key={i}><MarkdownText text={item} /></li>)}</ol>
          : <ul key={key}>{block.items.map((item, i) => <li key={i}><MarkdownText text={item} /></li>)}</ul>;
      })}
    </div>
  );
}
