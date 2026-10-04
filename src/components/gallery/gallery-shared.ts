import type { GalleryListItem } from "@/modules/community/db-community";
import type { ProjectCardData } from "@/components/project-card";

export type GallerySurface = "community" | "public";

export const GALLERY_DETAIL_BASE = {
  community: "/galeria",
  public: "/proyectos/ver",
} as const;

export const GALLERY_LIST_HREF = {
  community: "/galeria",
  public: "/proyectos",
} as const;

const accents: ProjectCardData["accent"][] = ["yellow", "clay", "blue", "green", "violet"];

export function filterGalleryEntries(
  entries: readonly GalleryListItem[],
  query: { buscar?: string; semana?: string },
): GalleryListItem[] {
  const search = query.buscar?.trim().toLocaleLowerCase("es-MX") ?? "";
  const week = Number(query.semana);
  return entries.filter(
    (entry) =>
      (!search ||
        entry.title.toLocaleLowerCase("es-MX").includes(search) ||
        entry.author.toLocaleLowerCase("es-MX").includes(search)) &&
      (!Number.isInteger(week) || week < 1 || entry.week === week),
  );
}

export function mapGalleryEntriesToCards(
  entries: readonly GalleryListItem[],
): ProjectCardData[] {
  return entries.map((entry, index) => ({
    id: entry.id,
    title: entry.title,
    author: entry.author,
    authorBio: entry.authorBio,
    week: entry.week,
    description: entry.description,
    accent: accents[index % accents.length],
    initialsColor: accents[(index + 2) % accents.length],
    tag: entry.technology,
    visibility: entry.visibility,
    isDemo: entry.isDemo,
    starCount: entry.starCount,
    commentCount: entry.commentCount,
    viewerHasStarred: entry.viewerHasStarred,
  }));
}
