import type { GalleryListItem } from "@/modules/community/db-community";
import type { GalleryVisibility } from "@/modules/community/types";

export type GallerySurface = "community" | "public";

export type GalleryAccent = "yellow" | "clay" | "blue" | "green" | "violet";

export type ProjectCardData = {
  id: string;
  title: string;
  tagline: string | null;
  author: string;
  authorBio: string | null;
  week: number;
  description: string;
  accent: GalleryAccent;
  initialsColor: GalleryAccent;
  tag: string;
  visibility: GalleryVisibility;
  isDemo?: boolean;
  starCount: number;
  commentCount: number;
  viewerHasStarred: boolean;
};

export const GALLERY_DETAIL_BASE = {
  community: "/galeria",
  public: "/proyectos/ver",
} as const;

export const GALLERY_LIST_HREF = {
  community: "/galeria",
  public: "/proyectos",
} as const;

const accents: GalleryAccent[] = ["yellow", "clay", "blue", "green", "violet"];

export function galleryAccentForId(id: string): GalleryAccent {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash + id.charCodeAt(index) * (index + 1)) % accents.length;
  }
  return accents[hash] ?? "yellow";
}

export function filterGalleryEntries(
  entries: readonly GalleryListItem[],
  query: { buscar?: string },
): GalleryListItem[] {
  const search = query.buscar?.trim().toLocaleLowerCase("es-MX") ?? "";
  if (!search) return [...entries];
  return entries.filter(
    (entry) =>
      entry.title.toLocaleLowerCase("es-MX").includes(search) ||
      entry.author.toLocaleLowerCase("es-MX").includes(search),
  );
}

export function mapGalleryEntriesToCards(
  entries: readonly GalleryListItem[],
): ProjectCardData[] {
  return entries.map((entry, index) => ({
    id: entry.id,
    title: entry.title,
    tagline: entry.tagline,
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
