import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type MetaProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  tone?: "subtle" | "muted" | "accent" | "fg";
  children: ReactNode;
};

const tones = {
  subtle: "text-fg-subtle",
  muted: "text-fg-muted",
  accent: "text-accent",
  fg: "text-fg",
};

/** Etiqueta técnica en mayúsculas (12px). Complementa; nunca es la única fuente de información. */
export function Meta({ as: Tag = "p", tone = "subtle", className, children, ...rest }: MetaProps) {
  return (
    <Tag className={cn("type-meta tabular-nums", tones[tone], className)} {...rest}>
      {children}
    </Tag>
  );
}
