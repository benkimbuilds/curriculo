import { faqItems } from "@/content/faq";
import { galleryItems } from "@/content/gallery";
import { primaryNav } from "@/content/navigation";
import { sponsors } from "@/content/sponsors";
import { visible } from "./content";

/** Solo enlaza a secciones que se renderizan (nunca un ancla rota si una sección queda vacía). */
const available: Record<string, boolean> = {
  "#aliados": visible(sponsors).length > 0,
  "#galeria": visible(galleryItems).length > 0,
  "#faq": visible(faqItems).length > 0,
};

export const navItems = primaryNav.filter((item) => available[item.href] ?? true);
