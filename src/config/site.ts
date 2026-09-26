/**
 * Configuración del sitio. Los valores operativos (URLs, indexación) vienen de variables de entorno
 * para que el mismo build sirva a vista previa y producción. Ver .env.example.
 *
 * Sin prefijo `NEXT_PUBLIC_`: todo lo que sale de aquí se consume al renderizar en el servidor
 * (metadata, robots, sitemap, JSON-LD y los `visible()` de las secciones), así que no hace falta
 * exponerlas al navegador. Si algún día un componente cliente necesita uno de estos valores,
 * pásalo por props antes de volver a agregar el prefijo.
 */
const env = process.env;

export const site = {
  name: "Centro Iquiti",
  shortName: "Iquiti",
  title: "Iquiti — Centro de Innovación y Academia de Tecnología",
  description:
    "Iquiti es un Centro de Innovación que reúne formación aplicada, creación de soluciones y comunidad. Hogar de la Academia de Tecnología.",
  tagline: "Aprender. Construir. Conectar.",
  coordinate: "[ CI — AT ]",
  locale: "es_MX",
  url: env.SITE_URL ?? "http://localhost:3000",
  /** Solo se permite indexar cuando el contenido está aprobado. */
  indexable: env.ALLOW_INDEXING === "true",
  /** Borradores visibles en desarrollo; ocultos en producción salvo que se fuerce. */
  showDrafts: env.SHOW_DRAFTS ? env.SHOW_DRAFTS === "true" : env.NODE_ENV !== "production",
  academy: {
    /** URL de la plataforma de la Academia. Si falta, el CTA apunta a la sección #academia. */
    platformUrl: env.ACADEMY_PLATFORM_URL || null,
  },
  /** Sede. Fuente: prensa de la inauguración (9 ago 2026): Récord, Chilango, Excélsior. */
  location: {
    venue: "Utopía Elena Poniatowska",
    street: "Av. Miguel Hidalgo 128",
    neighborhood: "Barrio de San Lucas",
    locality: "Coyoacán",
    region: "Ciudad de México",
    country: "MX",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Utop%C3%ADa+Elena+Poniatowska%2C+Av.+Miguel+Hidalgo+128%2C+Coyoac%C3%A1n",
  },
  /** Canales. Sin URL → en producción no se muestra el botón (nunca enlaces inventados). */
  contact: {
    email: env.CONTACT_EMAIL || null,
    instagram: env.INSTAGRAM_URL || null,
    facebook: env.FACEBOOK_URL || null,
  },
} as const;
