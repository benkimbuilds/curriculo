import Link from "next/link";
import { ArrowRight, ExternalLink, Heart } from "./icons";
import { Avatar } from "./ui";

export type ProjectCardData = {
  id: string;
  title: string;
  author: string;
  week: string;
  description: string;
  accent: "yellow" | "clay" | "blue" | "green" | "violet";
  initialsColor: "clay" | "blue" | "green" | "yellow" | "violet";
  likes: number;
  tag: string;
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <article className="gallery-card">
      <Link className={`gallery-card__preview gallery-card__preview--${project.accent}`} href={`/galeria/${project.id}`}>
        <span className="browser-chrome"><i /><i /><i /></span>
        <span className="preview-word">{project.title.split(" ")[0]}<em>.</em></span>
        <span className="preview-lines"><i /><i /><i /></span>
        <span className="gallery-card__visit">Ver proyecto <ArrowRight /></span>
      </Link>
      <div className="gallery-card__body"><div className="gallery-card__author"><Avatar color={project.initialsColor} name={project.author} size="sm" /><span><strong>{project.title}</strong><small>por {project.author}</small></span><button aria-label={`${project.likes} personas marcaron este proyecto como útil`} className="card-like" type="button"><Heart /> {project.likes}</button></div><p>{project.description}</p><div className="gallery-card__footer"><span>{project.week}</span><span>{project.tag}</span><Link aria-label={`Ver ${project.title}`} href={`/galeria/${project.id}`}><ExternalLink /></Link></div></div>
    </article>
  );
}
