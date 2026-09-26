import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Surface = "dark" | "light" | "white" | "brand" | "accent";

type SectionProps = {
  id: string;
  surface?: Surface;
  /** id del título visible; da nombre accesible a la región. */
  labelledBy: string;
  padded?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Sección de página. Declara su superficie; todos los hijos consumen roles
 * (bg, fg, accent, line…) que se remapean solos.
 */
export function Section({
  id,
  surface = "dark",
  labelledBy,
  padded = true,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      data-surface={surface}
      aria-labelledby={labelledBy}
      className={cn("relative isolate bg-bg text-fg", padded && "py-section", className)}
    >
      {children}
    </section>
  );
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-content px-gutter", className)}>{children}</div>;
}

type SectionHeaderProps = {
  label: string;
  title: string;
  titleId: string;
  /** false: el título existe solo para lectores de pantalla (la sección conserva su nombre). */
  showTitle?: boolean;
  lead?: string;
  className?: string;
  children?: ReactNode;
};

/** Encabezado de sección: etiqueta a la izquierda (3 col), título y entrada (9 col). */
export function SectionHeader({
  label,
  title,
  titleId,
  showTitle = true,
  lead,
  className,
  children,
}: SectionHeaderProps) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-12 lg:gap-8", className)}>
      <p
        className="type-meta flex items-center gap-3 text-fg-subtle lg:col-span-3 lg:pt-3"
        data-reveal="fade"
      >
        <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
        <span>{label}</span>
      </p>
      <div className="lg:col-span-9">
        {showTitle ? (
          <h2 id={titleId} className="type-title max-w-[18ch]" data-reveal="words">
            {title}
          </h2>
        ) : (
          <h2 id={titleId} className="sr-only">
            {title}
          </h2>
        )}
        {lead && (
          <p
            className={cn("type-lead max-w-reading text-fg-muted", showTitle && "mt-6")}
            data-reveal="fade-up"
          >
            {lead}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
