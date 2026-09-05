import type { CompiledLessonBody } from "@/modules/curriculum";

function headingId(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function LessonContent({ content }: { content: CompiledLessonBody }) {
  return (
    <div className="lesson-body">
      {content.blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        if (block.type === "heading") {
          const id = headingId(block.text);
          return block.level === 2
            ? <h2 id={id} key={key}>{block.text}</h2>
            : <h3 id={id} key={key}>{block.text}</h3>;
        }
        if (block.type === "paragraph") return <p key={key}>{block.text}</p>;
        if (block.type === "code") {
          return <pre className="lesson-code" key={key}><code data-language={block.language}>{block.code}</code></pre>;
        }
        return block.ordered
          ? <ol key={key}>{block.items.map((item) => <li key={item}>{item}</li>)}</ol>
          : <ul key={key}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
      })}
    </div>
  );
}

