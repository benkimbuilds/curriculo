/** Primer elemento enfocable de la página (WCAG 2.4.1). */
export function SkipLink() {
  return (
    <a
      href="#contenido"
      className="type-label fixed top-3 left-3 z-(--iq-z-skip) -translate-y-[200%] bg-action px-4 py-3 text-action-fg transition-transform duration-(--iq-duration-fast) focus:translate-y-0"
    >
      Saltar al contenido
    </a>
  );
}
