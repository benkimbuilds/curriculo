/**
 * Copy del home. Base: concepto de marca (hub-brand-site). Todo texto nuevo que afirme hechos
 * (fechas, cifras, requisitos, costos) debe validarse antes de publicarse.
 */

export const hero = {
  eyebrow: "Centro de Innovación",
  academy: "Academia de Tecnología",
  title: "Iquiti",
  titleNote: "Centro de Innovación",
  lead: "Un espacio para convertir el aprendizaje tecnológico en soluciones y oportunidades.",
  primaryCta: { label: "Explorar el Centro", href: "#intro" },
  secondaryCta: { label: "Academia de Tecnología", href: "#academia" },
} as const;

export const intro = {
  label: "Concepto",
  title: "Donde las ideas se construyen.",
  statement:
    "El Centro de Innovación toma ese sentido: unir personas, ideas y proyectos para tejer redes de colaboración y conocimiento.",
  principles: [
    { index: "01", word: "Aprender", body: "Desarrollar capacidades a través de proyectos." },
    { index: "02", word: "Construir", body: "Probar ideas y convertirlas en soluciones." },
    { index: "03", word: "Conectar", body: "Compartir experiencia y abrir nuevas posibilidades." },
  ],
} as const;

export const centro = {
  label: "Intro",
  title: "Un lugar para hacerlo posible.",
  lead: "Iquiti Centro de Innovación y Academia de Tecnología proponen reunir formación aplicada, creación de soluciones y comunidad en un mismo lugar. Un entorno para aprender haciendo y desarrollar nuevas habilidades.",
  origin: "Iquiti · del náhuatl: «tejer»",
  network: {
    body: "Iquiti se piensa como una red viva de conocimiento: cada nodo o tejido es una persona, una idea o un proyecto, y cada conexión, un aprendizaje compartido.",
  },
  pillars: [
    {
      title: "Espacio",
      body: "Un lugar flexible donde aprender, construir y encontrarse pueden convivir.",
    },
    {
      title: "Comunidad",
      body: "Compartir experiencia entre personas, equipos y organizaciones para abrir nuevas posibilidades.",
    },
    {
      title: "Formación aplicada",
      body: "Desarrollar capacidades técnicas a través de proyectos, con la Academia de Tecnología como punto de partida.",
    },
    {
      title: "Creación de soluciones",
      body: "Un entorno para probar ideas, prototipar y convertirlas en soluciones.",
    },
  ],
} as const;

export const academia = {
  label: "Academia de Tecnología",
  lead: "Un punto de partida para desarrollar capacidades técnicas: proyectos, trabajo compartido y comunidad.",
  features: [
    { title: "Proyectos", body: "Aprender a partir de construir." },
    { title: "Trabajo compartido", body: "Equipos que colaboran y se retroalimentan." },
    { title: "Ecosistema", body: "Conexión con la comunidad." },
  ],
  verbs: ["Aprender", "Construir", "Conectar"],
  platform: {
    label: "[ CI - AT ]",
    title: "Plataforma de la Academia",
    body: "Entra a la plataforma",
    cta: "Acceder",
  },
} as const;

export const aliados = {
  label: "Aliados",
  title: "Quienes lo hacen posible.",
} as const;

export const galeria = {
  label: "Galería",
  title: "El Centro en imágenes.",
  lead: "Espacios, proyectos y comunidad.",
} as const;

export const faq = {
  label: "Preguntas frecuentes",
  title: "Antes de empezar.",
} as const;

export const cierre = {
  title: "Aprender. Construir. Conectar.",
  signature: "Centro de Innovación — Academia de Tecnología",
} as const;
