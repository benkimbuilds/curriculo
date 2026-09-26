import { site } from "@/config/site";

/**
 * Destino único del CTA de la Academia. Con URL configurada lleva a la plataforma;
 * sin ella, a la sección #academia (nunca a un enlace roto).
 * `shortLabel` es la acción del header y del menú móvil; `label` describe el destino en el footer.
 */
export const platformCta = site.academy.platformUrl
  ? {
      href: site.academy.platformUrl,
      label: "Acceder a la Academia",
      shortLabel: "Aplicar",
      external: true,
    }
  : { href: "/registro", label: "Acceder a Curriculo", shortLabel: "Entrar", external: false };
