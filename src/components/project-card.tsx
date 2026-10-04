import Link from "next/link";

import { VisibilityBadge } from "@/components/community/visibility-badge";
import { ArrowRight, Message, Star } from "@/components/icons";
import { Avatar } from "@/components/ui";
import { toggleGalleryStarAction } from "@/modules/community/db-actions";
import type { GalleryVisibility } from "@/modules/community/types";

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

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <article className="gallery-card">
      <Link className={`gallery-card__preview gallery-card__preview--${project.accent}`} href={`/galeria/${project.id}`}>
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
          <VisibilityBadge visibility={project.visibility} />
        </div>
        <h2>
          <Link href={`/galeria/${project.id}`}>{project.title}</Link>
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
          <form action={toggleGalleryStarAction}>
            <input name="submissionId" type="hidden" value={project.id} />
            <input name="returnTo" type="hidden" value="/galeria" />
            <button
              aria-label={project.viewerHasStarred ? "Quitar estrella" : "Destacar proyecto"}
              aria-pressed={project.viewerHasStarred}
              className={`gallery-star${project.viewerHasStarred ? " is-active" : ""}`}
              type="submit"
            >
              <Star /> {starLabel(project.starCount)}
            </button>
          </form>
          <Link className="gallery-card__comments" href={`/galeria/${project.id}#comentarios`}>
            <Message /> {commentLabel(project.commentCount)}
          </Link>
        </div>
      </div>
    </article>
  );
}
