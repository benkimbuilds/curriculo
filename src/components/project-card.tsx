import Link from "next/link";

import { VisibilityBadge } from "@/components/community/visibility-badge";
import { ArrowRight, Message } from "@/components/icons";
import { Avatar, StatusPill } from "@/components/ui";

import { GalleryStarButton } from "./gallery/gallery-star-button";
import {
  GALLERY_DETAIL_BASE,
  GALLERY_LIST_HREF,
  type GallerySurface,
  type ProjectCardData,
} from "./gallery/gallery-shared";

export type { ProjectCardData };

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
        <h2 className="preview-word">
          {project.title}
          <em aria-hidden="true">.</em>
        </h2>
        <span className="gallery-card__visit">
          Ver proyecto <ArrowRight />
        </span>
      </Link>
      <div className="gallery-card__body">
        {(project.isDemo || interactive) ? (
          <div className="gallery-card__top">
            <div className="gallery-card__badges">
              {project.isDemo ? <StatusPill tone="info">Demo</StatusPill> : null}
              {interactive ? <VisibilityBadge visibility={project.visibility} /> : null}
            </div>
          </div>
        ) : null}
        {project.tagline ? (
          <p className="gallery-card__oneliner">
            <Link href={detailHref}>{project.tagline}</Link>
          </p>
        ) : (
          <p className="gallery-card__oneliner gallery-card__oneliner--empty" aria-hidden="true" />
        )}
        <p className="gallery-card__description">{project.description}</p>
        <div className="gallery-card__author">
          <Avatar color={project.initialsColor} name={project.author} size="sm" />
          <span>
            <strong>{project.author}</strong>
            <small className="gallery-card__week">
              Semana {String(project.week).padStart(2, "0")} · {project.tag}
            </small>
            <small>{project.authorBio || "Proyecto compartido del programa"}</small>
          </span>
        </div>
        <div className="gallery-card__engagement">
          <GalleryStarButton
            interactive={interactive}
            returnTo={listHref}
            starCount={project.starCount}
            starred={project.viewerHasStarred}
            submissionId={project.id}
          />
          <Link className="gallery-card__comments" href={`${detailHref}#comentarios`}>
            <Message /> {commentLabel(project.commentCount)}
          </Link>
        </div>
      </div>
    </article>
  );
}
