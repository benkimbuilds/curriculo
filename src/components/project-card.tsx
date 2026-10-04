import Link from "next/link";

import { VisibilityBadge } from "@/components/community/visibility-badge";
import { ArrowRight, Message, Star } from "@/components/icons";
import { Avatar, StatusPill } from "@/components/ui";
import { toggleGalleryStarAction } from "@/modules/community/db-actions";
import type { GalleryVisibility } from "@/modules/community/types";

import {
  GALLERY_DETAIL_BASE,
  GALLERY_LIST_HREF,
  type GallerySurface,
} from "./gallery/gallery-shared";

export type ProjectCardData = {
  id: string;
  title: string;
  author: string;
  authorBio: string | null;
  week: number;
  description: string;
  accent: "yellow" | "clay" | "blue" | "green" | "violet";
  initialsColor: "clay" | "blue" | "green" | "yellow" | "violet";
  tag: string;
  visibility: GalleryVisibility;
  isDemo?: boolean;
  starCount: number;
  commentCount: number;
  viewerHasStarred: boolean;
};

function starLabel(count: number) {
  return count === 1 ? "1 estrella" : `${count} estrellas`;
}

function commentLabel(count: number) {
  return count === 1 ? "1 comentario" : `${count} comentarios`;
}

export function ProjectCard({
  project,
  surface = "community",
}: {
  project: ProjectCardData;
  surface?: GallerySurface;
}) {
  const interactive = surface === "community";
  const detailHref = `${GALLERY_DETAIL_BASE[surface]}/${project.id}`;
  const listHref = GALLERY_LIST_HREF[surface];

  return (
    <article className="gallery-card">
      <Link className={`gallery-card__preview gallery-card__preview--${project.accent}`} href={detailHref}>
        <span className="gallery-card__meta">
          <span>Semana {String(project.week).padStart(2, "0")}</span>
          <span>{project.tag}</span>
        </span>
        <span className="preview-word">
          {project.title.split(" ")[0]}
          <em>.</em>
        </span>
        <span className="gallery-card__visit">
          Ver proyecto <ArrowRight />
        </span>
      </Link>
      <div className="gallery-card__body">
        <div className="gallery-card__top">
          <div className="gallery-card__badges">
            {project.isDemo ? <StatusPill tone="info">Demo</StatusPill> : null}
            {interactive ? <VisibilityBadge visibility={project.visibility} /> : null}
          </div>
        </div>
        <h2>
          <Link href={detailHref}>{project.title}</Link>
        </h2>
        <p>{project.description}</p>
        <div className="gallery-card__author">
          <Avatar color={project.initialsColor} name={project.author} size="sm" />
          <span>
            <strong>{project.author}</strong>
            <small>{project.authorBio || "Proyecto compartido del programa"}</small>
          </span>
        </div>
        <div className="gallery-card__engagement">
          {interactive ? (
            <form action={toggleGalleryStarAction}>
              <input name="submissionId" type="hidden" value={project.id} />
              <input name="returnTo" type="hidden" value={listHref} />
              <button
                aria-label={project.viewerHasStarred ? "Quitar estrella" : "Destacar proyecto"}
                aria-pressed={project.viewerHasStarred}
                className={`gallery-star${project.viewerHasStarred ? " is-active" : ""}`}
                type="submit"
              >
                <Star /> {starLabel(project.starCount)}
              </button>
            </form>
          ) : (
            <span className="gallery-star gallery-star--readonly" aria-label={starLabel(project.starCount)}>
              <Star /> {starLabel(project.starCount)}
            </span>
          )}
          <Link className="gallery-card__comments" href={`${detailHref}#comentarios`}>
            <Message /> {commentLabel(project.commentCount)}
          </Link>
        </div>
      </div>
    </article>
  );
}
