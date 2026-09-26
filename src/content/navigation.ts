export type NavItem = { label: string; href: `#${string}` };

/** Máximo 5 destinos (Ley de Hick). El orden sigue el recorrido de la página. */
export const primaryNav: NavItem[] = [
  { label: "Currículo", href: "#plan-estudios" },
  { label: "Academia", href: "#academia" },
  { label: "Aliados", href: "#aliados" },
  { label: "Galería", href: "#galeria" },
  { label: "Preguntas", href: "#faq" },
];
