import Link from "next/link";

import {
  NEXT_STEP_OPTIONS,
  RUBRIC_MARK_OPTIONS,
} from "@/components/community/review-labels";
import { VisibilityBadge } from "@/components/community/visibility-badge";
import { BackLink } from "@/components/back-link";
import { Check, ExternalLink, GitBranch, Shield, Star } from "@/components/icons";
import { Avatar, StatusPill } from "@/components/ui";
import {
  reportGalleryEntryAction,
  submitStructuredFeedbackAction,
  toggleGalleryStarAction,
} from "@/modules/community/db-actions";
import type { GalleryProjectDetail } from "@/modules/community/db-community";

import { CommentThread } from "./comment-thread";
import { GALLERY_DETAIL_BASE, type GallerySurface } from "./gallery-shared";
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

  return (
    <div className={`community-detail${interactive ? "" : " community-detail--public"}`}>
      <BackLink href={backHref}>{backLabel}</BackLink>

      <header className="community-detail__hero">
        <div className="community-detail__author">
          <Avatar color="yellow" name={project.author} size="lg" />
          <div>
            <p className="eyebrow">Proyecto compartido</p>
            <h1>{project.title}</h1>
            <p className="community-detail__byline">
              <strong>{project.author}</strong>
              <span aria-hidden="true">·</span>
              <span>Semana {project.week}</span>
              <span aria-hidden="true">·</span>
              <span>{project.technology}</span>
            </p>
            {project.authorBio ? <p className="community-detail__bio">{project.authorBio}</p> : null}
            {project.authorGithubUsername ? (
              <a
                className="community-detail__github"
                href={`https://github.com/${project.authorGithubUsername}`}
                rel="noreferrer"
                target="_blank"
              >
                <GitBranch /> github.com/{project.authorGithubUsername} <ExternalLink />
              </a>
            ) : null}
          </div>
        </div>
        <div className="community-detail__pills">
          {project.isDemo ? <StatusPill tone="info">Demo</StatusPill> : null}
          <StatusPill tone="good">
            <Check /> Aprobado
          </StatusPill>
          {interactive ? <VisibilityBadge visibility={project.visibility} /> : null}
        </div>
      </header>

      <section className="project-showcase">
        <div className="project-showcase__browser">
          <span className="browser-chrome">
            <i />
            <i />
            <i />
          </span>
          <div>
            <p>Semana {String(project.week).padStart(2, "0")}</p>
            <h2>
              {project.title}
              <em>.</em>
            </h2>
            <span>{project.technology}</span>
          </div>
        </div>
        <div className="project-showcase__actions">
          <div className="project-showcase__engagement">
            {interactive ? (
              <form action={toggleGalleryStarAction}>
                <input name="submissionId" type="hidden" value={project.id} />
                <input name="returnTo" type="hidden" value={detailPath} />
                <button
                  aria-pressed={project.viewerHasStarred}
                  className={`gallery-star gallery-star--lg${project.viewerHasStarred ? " is-active" : ""}`}
                  disabled={isOwner}
                  type="submit"
                >
                  <Star />{" "}
                  {project.viewerHasStarred ? "Destacado" : "Destacar"} · {project.starCount}
                </button>
              </form>
            ) : (
              <span
                aria-label={`${project.starCount} estrellas`}
                className="gallery-star gallery-star--lg gallery-star--readonly"
              >
                <Star /> {project.starCount} estrellas
              </span>
            )}
            <a className="gallery-card__comments" href="#comentarios">
              {project.commentCount === 1 ? "1 comentario" : `${project.commentCount} comentarios`}
            </a>
          </div>
          <div>
            {project.deploymentUrl ? (
              <a className="button button--primary" href={project.deploymentUrl} rel="noreferrer" target="_blank">
                Abrir proyecto <ExternalLink />
              </a>
            ) : null}
            <a className="button button--ghost" href={project.repositoryUrl} rel="noreferrer" target="_blank">
              <GitBranch /> Ver código
            </a>
          </div>
        </div>
      </section>

      {!interactive ? (
        <aside className="community-notice community-notice--compact gallery-public-cta">
          <Shield />
          <div>
            <strong>Vista pública</strong>
            <p>
              Aquí puedes explorar el proyecto. Para destacar, comentar o publicar el tuyo,{" "}
              <Link className="text-link" href="/registro">
                únete a la comunidad
              </Link>
              .
            </p>
          </div>
        </aside>
      ) : null}

      <div className="project-detail-grid">
        <article className="panel reflection">
          <p className="eyebrow">Objetivo del programa</p>
          <h2>Qué resolvió este proyecto</h2>
          <p>{project.description}</p>
          <div className="reflection__meta">
            <span>Proyecto del programa · Semana {project.week}</span>
            <span>Compartido el {submittedLabel}</span>
          </div>
        </article>
        <aside className="panel project-facts">
          <h3>Sobre la entrega</h3>
          <dl>
            <div>
              <dt>Semana</dt>
              <dd>{project.week}</dd>
            </div>
            <div>
              <dt>Tecnología</dt>
              <dd>{project.technology}</dd>
            </div>
            <div>
              <dt>Versión</dt>
              <dd>
                <code>{project.commitSha.slice(0, 12)}</code>
              </dd>
            </div>
            <div>
              <dt>Compartido</dt>
              <dd>{submittedLabel}</dd>
            </div>
          </dl>
          {interactive && !isOwner && reportProject ? (
            <details className="report-disclosure">
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
      </div>

      <CommentThread comments={project.comments} readonly={!interactive} submissionId={project.id} />

      {interactive ? (
        <details className="panel feedback-section feedback-section--optional">
          <summary>
            <span className="eyebrow">Opcional</span>
            <strong>Evaluación técnica con rúbrica</strong>
          </summary>
          <div className="community-notice community-notice--compact">
            <Shield />
            <div>
              <strong>Separado de los comentarios</strong>
              <p>Esta sección usa solo marcas de rúbrica y siguientes pasos. No sustituye la conversación abierta.</p>
            </div>
          </div>

          {isOwner ? (
            <p className="feedback-intro">Estas son las selecciones técnicas de quienes revisaron tu proyecto.</p>
          ) : hasReviewed ? (
            <p className="feedback-intro">Ya registraste una evaluación técnica para este intento.</p>
          ) : submitFeedback ? (
            <form action={submitFeedback} className="feedback-form">
              {project.rubricCriteria.map((criterion) => (
                <fieldset key={criterion.id}>
                  <legend>{criterion.title}</legend>
                  <p className="form-hint">{criterion.description}</p>
                  <div className="choice-row">
                    {RUBRIC_MARK_OPTIONS.map(([value, label]) => (
                      <label className="choice-chip" key={value}>
                        <input name={`criterion:${criterion.id}`} required type="radio" value={value} /> {label}
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
        </details>
      ) : null}
    </div>
  );
}
