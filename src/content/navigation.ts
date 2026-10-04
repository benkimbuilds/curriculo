export type NavItem = { label: string; href: string };

/** Máximo 5 destinos (Ley de Hick). El currículo vive en su propia página; el resto ancla al home. */
export const primaryNav: NavItem[] = [
  { label: "Currículo", href: "/curriculo" },
  { label: "Academia", href: "/#academia" },
  { label: "Aliados", href: "/#aliados" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Preguntas", href: "/#faq" },
];
