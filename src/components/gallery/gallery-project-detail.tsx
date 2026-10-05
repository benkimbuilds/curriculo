import Link from "next/link";

import {
  NEXT_STEP_OPTIONS,
  RUBRIC_MARK_OPTIONS,
} from "@/components/community/review-labels";
import { VisibilityBadge } from "@/components/community/visibility-badge";
import { BackLink } from "@/components/back-link";
import { Check, ExternalLink, GitBranch, Message, Shield } from "@/components/icons";
import { Avatar, StatusPill } from "@/components/ui";
import {
  reportGalleryEntryAction,
  submitStructuredFeedbackAction,
} from "@/modules/community/db-actions";
import type { GalleryProjectDetail } from "@/modules/community/db-community";

import { CommentThread } from "./comment-thread";
import { GalleryStarButton } from "./gallery-star-button";
import {
  GALLERY_DETAIL_BASE,
  galleryAccentForId,
  type GallerySurface,
} from "./gallery-shared";
import { StructuredReviews } from "./structured-reviews";

export function GalleryProjectDetailView({
  surface,
  project,
  backHref,
  backLabel,
  isOwner = false,
  hasReviewed = false,
}: {
  surface: GallerySurface;
  project: GalleryProjectDetail;
  backHref: string;
  backLabel: string;
  isOwner?: boolean;
  hasReviewed?: boolean;
}) {
  const interactive = surface === "community";
  const submitFeedback = interactive
    ? submitStructuredFeedbackAction.bind(null, project.id)
    : null;
  const reportProject = interactive ? reportGalleryEntryAction.bind(null, project.id) : null;
  const submittedLabel = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeZone: "America/Mexico_City",
  }).format(project.submittedAt);
  const detailPath = `${GALLERY_DETAIL_BASE[surface]}/${project.id}`;
  const accent = galleryAccentForId(project.id);
  const commentLabel =
    project.commentCount === 1 ? "1 comentario" : `${project.commentCount} comentarios`;

  return (
    <div className={`project-detail${interactive ? "" : " project-detail--public"}`}>
      <BackLink href={backHref}>{backLabel}</BackLink>

      <header className={`project-detail__hero project-detail__hero--${accent}`}>
        <div className="project-detail__hero-copy">
          <h1 className="project-detail__title">
            {project.title}
            <em aria-hidden="true">.</em>
          </h1>
          {project.tagline ? <p className="project-detail__tagline">{project.tagline}</p> : null}
        </div>
      </header>

      <div className="project-detail__actions">
        <div className="project-detail__engagement">
          <GalleryStarButton
            disabled={isOwner}
            interactive={interactive}
            returnTo={detailPath}
            size="lg"
            starCount={project.starCount}
            starred={project.viewerHasStarred}
            submissionId={project.id}
          />
          <a className="project-detail__comments" href="#comentarios">
            <Message /> {commentLabel}
          </a>
        </div>
        <div className="project-detail__links">
          {project.deploymentUrl ? (
            <a
              className="button button--primary"
              href={project.deploymentUrl}
              rel="noreferrer"
              target="_blank"
            >
              Abrir proyecto <ExternalLink />
            </a>
          ) : null}
          <a
            className="button button--ghost"
            href={project.repositoryUrl}
            rel="noreferrer"
            target="_blank"
          >
            <GitBranch /> Ver código
          </a>
        </div>
      </div>

      {!interactive ? (
        <aside className="community-notice community-notice--compact project-detail__cta">
          <Shield />
          <div>
            <strong>Vista pública</strong>
            <p>
              Aquí puedes explorar el proyecto. Para creer, comentar o publicar el tuyo,{" "}
              <Link className="text-link" href="/registro">
                únete a la comunidad
              </Link>
              .
            </p>
          </div>
        </aside>
      ) : null}

      <div className="project-detail__profile">
        <aside className="project-detail__profile-side">
          <Avatar color={accent} name={project.author} size="lg" />
          <div className="project-detail__profile-identity">
            <p className="eyebrow">Emprendedor</p>
            <h2>{project.author}</h2>
            <small className="project-detail__week">
              Semana {String(project.week).padStart(2, "0")} · {project.technology}
            </small>
            {project.authorBio ? <p className="project-detail__bio">{project.authorBio}</p> : null}
            {project.authorGithubUsername ? (
              <a
                className="project-detail__github"
                href={`https://github.com/${project.authorGithubUsername}`}
                rel="noreferrer"
                target="_blank"
              >
                <GitBranch /> {project.authorGithubUsername} <ExternalLink />
              </a>
            ) : null}
          </div>
          <div className="project-detail__pills">
            {project.isDemo ? <StatusPill tone="info">Demo</StatusPill> : null}
            <StatusPill tone="good">
              <Check /> Aprobado
            </StatusPill>
            {interactive ? <VisibilityBadge visibility={project.visibility} /> : null}
          </div>
          <dl className="project-detail__facts">
            <div>
              <dt>Compartido</dt>
              <dd>{submittedLabel}</dd>
            </div>
            <div>
              <dt>Código</dt>
              <dd>
                <a
                  className="project-detail__commit"
                  href={project.repositoryUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <code>{project.commitSha.slice(0, 7)}</code>
                </a>
              </dd>
            </div>
          </dl>
          {interactive && !isOwner && reportProject ? (
            <details className="project-detail__report">
              <summary>
                <Shield /> Reportar contenido
              </summary>
              <form action={reportProject} className="form-stack">
                <label>
                  Motivo del reporte
                  <select name="reason" required>
                    <option value="personal_information">Datos personales</option>
                    <option value="harassment">Acoso</option>
                    <option value="hate_or_discrimination">Odio o discriminación</option>
                    <option value="sexual_content">Contenido sexual</option>
                    <option value="spam">Spam</option>
                    <option value="copyright">Derechos de autor</option>
                    <option value="other_safety_concern">Otro riesgo de seguridad</option>
                  </select>
                </label>
                <button className="button button--ghost" type="submit">
                  Enviar reporte
                </button>
              </form>
            </details>
          ) : null}
        </aside>

        <div className="project-detail__profile-main">
          <section className="project-detail__story">
            <p className="eyebrow">El proyecto</p>
            <p>{project.description}</p>
          </section>

          <CommentThread
            comments={project.comments}
            readonly={!interactive}
            submissionId={project.id}
          />

          {interactive ? (
            <details className="project-detail__rubric">
              <summary>
                <span className="eyebrow">Opcional</span>
                <strong>Evaluación técnica con rúbrica</strong>
                <span className="project-detail__rubric-hint">
                  Separada de Creo y de los comentarios
                </span>
              </summary>
              <div className="project-detail__rubric-body">
                {isOwner ? (
                  <p className="feedback-intro">
                    Estas son las selecciones técnicas de quienes revisaron tu proyecto.
                  </p>
                ) : hasReviewed ? (
                  <p className="feedback-intro">
                    Ya registraste una evaluación técnica para este intento.
                  </p>
                ) : submitFeedback ? (
                  <form action={submitFeedback} className="feedback-form">
                    {project.rubricCriteria.map((criterion) => (
                      <fieldset key={criterion.id}>
                        <legend>{criterion.title}</legend>
                        <p className="form-hint">{criterion.description}</p>
                        <div className="choice-row">
                          {RUBRIC_MARK_OPTIONS.map(([value, label]) => (
                            <label className="choice-chip" key={value}>
                              <input
                                name={`criterion:${criterion.id}`}
                                required
                                type="radio"
                                value={value}
                              />{" "}
                              {label}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    ))}
                    <fieldset>
                      <legend>Siguientes pasos concretos</legend>
                      <div className="choice-row">
                        {NEXT_STEP_OPTIONS.map(([value, label]) => (
                          <label className="choice-chip" key={value}>
                            <input name="nextSteps" type="checkbox" value={value} /> {label}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <button className="button button--primary" type="submit">
                      Enviar evaluación
                    </button>
                  </form>
                ) : null}

                <StructuredReviews criteria={project.rubricCriteria} feedback={project.feedback} />
              </div>
            </details>
          ) : null}
        </div>
      </div>
    </div>
  );
}
