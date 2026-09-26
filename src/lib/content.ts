import { site } from "@/config/site";
import type { Publishable } from "@/content/types";

/** Filtra borradores según el entorno. Usar siempre antes de renderizar colecciones. */
export const visible = <T extends Publishable>(items: readonly T[]): T[] =>
  items.filter((item) => item.status === "published" || site.showDrafts);
