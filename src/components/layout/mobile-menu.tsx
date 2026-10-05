"use client";

import { useEffect, useId, useRef } from "react";
import { buttonClasses } from "@/components/ui/button";
import { Close, Menu } from "@/components/ui/icons";
import type { NavItem } from "@/content/navigation";
import { cn } from "@/lib/cn";

type MobileMenuProps = {
  items: NavItem[];
  cta: { href: string; shortLabel: string };
  brandName: string;
};

/**
 * Menú móvil con <dialog> modal nativo: trampa de foco, Esc, fondo inerte y retorno de foco
 * los resuelve el navegador. El scroll del documento se bloquea por CSS (html:has(dialog[open])).
 */
export function MobileMenu({ items, cta, brandName }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // Si la ventana crece a tablet con el menú abierto, se cierra (la nav de escritorio toma el relevo).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 48rem)");
    const onChange = (e: MediaQueryListEvent) => e.matches && dialogRef.current?.close();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="-mr-2 inline-flex min-h-target min-w-target items-center justify-center gap-2 rounded-full px-3 text-fg md:hidden"
      >
        <span className="type-label">Menú</span>
        <Menu className="size-5" />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        data-surface="dark"
        className="mobile-menu m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-fg"
        // Respaldo explícito: el cierre con Esc no depende de la implementación de close watchers.
        onKeyDown={(e) => e.key === "Escape" && close()}
      >
        <div className="flex h-full flex-col px-gutter">
          <div className="flex h-header items-center justify-between">
            <p id={titleId} className="type-meta text-fg-subtle">
              {/* A la vista solo la marca; el diálogo conserva un nombre accesible que dice qué es. */}
              <span className="sr-only">Menú de </span>
              {brandName}
            </p>
            <button
              type="button"
              onClick={close}
              className="-mr-2 inline-flex min-h-target items-center gap-2 rounded-full px-3"
            >
              <span className="type-label">Cerrar</span>
              <Close className="size-5" />
            </button>
          </div>

          <nav aria-label="Principal móvil" className="flex-1 border-t border-line pt-8">
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.href} className="border-b border-line">
                  <a
                    href={item.href}
                    onClick={close}
                    className="flex min-h-16 items-center py-3 type-heading transition-colors duration-(--iq-duration-fast) hover:text-accent focus-visible:text-accent"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="pb-[max(2rem,env(safe-area-inset-bottom))]">
            <a href={cta.href} onClick={close} className={cn(buttonClasses("primary", "md"), "w-full")}>
              <span>{cta.shortLabel}</span>
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
