import { notFound, redirect } from "next/navigation";

import {
  NEXT_STEP_OPTIONS,
  RUBRIC_MARK_OPTIONS,
} from "@/components/community/review-labels";
import { VisibilityBadge } from "@/components/community/visibility-badge";
import { AppShell } from "@/components/app-shell";
import { BackLink } from "@/components/back-link";
import { Check, ExternalLink, GitBranch, Shield, Star } from "@/components/icons";
import { Avatar, StatusPill } from "@/components/ui";
import { getCurrentSession } from "@/modules/auth/session";
import {
  reportGalleryEntryAction,
  submitStructuredFeedbackAction,
  toggleGalleryStarAction,
} from "@/modules/community/db-actions";
import { getGalleryProjectForViewer } from "@/modules/community/db-community";

import { CommentThread } from "./comment-thread";
import { GalleryActionToasts } from "./gallery-action-toasts";
import { StructuredReviews } from "./structured-reviews";

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    retroalimentacion?: string;
    reportado?: string;
    estrella?: string;
    comentario?: string;
  }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const { enabled, project } = await getGalleryProjectForViewer(session.user.id, id);
  if (!enabled) redirect("/galeria");
  if (!project) notFound();

  const submitFeedback = submitStructuredFeedbackAction.bind(null, project.id);
  const reportProject = reportGalleryEntryAction.bind(null, project.id);
  const isOwner = project.ownerId === session.user.id;
  const hasReviewed = project.feedback.some(({ authorId }) => authorId === session.user.id);
  const submittedLabel = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeZone: "America/Mexico_City",
  }).format(project.submittedAt);

  return (
    <AppShell userName={session.user.name}>
      <div className="app-content app-content--narrow community-detail">
        <GalleryActionToasts
          commentError={query.comentario === "error"}
          commentPosted={query.comentario === "1"}
          commentRemoved={query.comentario === "eliminado"}
          feedbackSubmitted={Boolean(query.retroalimentacion)}
          ownStarBlocked={query.estrella === "propia"}
          projectId={project.id}
          reported={Boolean(query.reportado)}
          starred={query.estrella === "1"}
        />

        <BackLink href="/galeria">Volver a la comunidad</BackLink>

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
            <StatusPill tone="good">
              <Check /> Aprobado
            </StatusPill>
            <VisibilityBadge visibility={project.visibility} />
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
              <form action={toggleGalleryStarAction}>
                <input name="submissionId" type="hidden" value={project.id} />
                <input name="returnTo" type="hidden" value={`/galeria/${project.id}`} />
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
            {!isOwner ? (
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

        <CommentThread comments={project.comments} submissionId={project.id} />

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
          ) : (
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
          )}

          <StructuredReviews criteria={project.rubricCriteria} feedback={project.feedback} />
        </details>
      </div>
    </AppShell>
  );
}
