import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const dot = "absolute size-1.5 rounded-full bg-fg";

/**
 * Marco técnico con nodos en las esquinas: firma visual del sistema (nodo = persona, idea o proyecto).
 * Los nodos son decorativos.
 */
export function Frame({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { className?: string; children?: ReactNode }) {
  return (
    <div className={cn("relative border border-line", className)} {...rest}>
      <span aria-hidden="true" className={cn(dot, "-top-[3.5px] -left-[3.5px]")} />
      <span aria-hidden="true" className={cn(dot, "-top-[3.5px] -right-[3.5px]")} />
      <span aria-hidden="true" className={cn(dot, "-bottom-[3.5px] -left-[3.5px]")} />
      <span aria-hidden="true" className={cn(dot, "-right-[3.5px] -bottom-[3.5px]")} />
      {children}
    </div>
  );
}
