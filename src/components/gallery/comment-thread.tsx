import {
  createGalleryCommentAction,
  removeOwnGalleryCommentAction,
} from "@/modules/community/db-actions";
import type { GalleryCommentView } from "@/modules/community/db-community";
import { Avatar } from "@/components/ui";

const avatarColors = ["clay", "blue", "green", "yellow", "violet"] as const;

function avatarColorFor(name: string) {
  let hash = 0;
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash + name.charCodeAt(index) * (index + 1)) % avatarColors.length;
  }
  return avatarColors[hash] ?? "clay";
}

function relativeTime(date: Date) {
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const divisions: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
    { amount: 60, unit: "second" },
    { amount: 60, unit: "minute" },
    { amount: 24, unit: "hour" },
    { amount: 7, unit: "day" },
    { amount: 4.34524, unit: "week" },
    { amount: 12, unit: "month" },
    { amount: Number.POSITIVE_INFINITY, unit: "year" },
  ];

  let duration = seconds;
  const formatter = new Intl.RelativeTimeFormat("es-MX", { numeric: "auto" });
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return formatter.format(0, "second");
}

export function CommentThread({
  submissionId,
  comments,
  readonly = false,
}: {
  submissionId: string;
  comments: readonly GalleryCommentView[];
  readonly?: boolean;
}) {
  const submitComment = readonly ? null : createGalleryCommentAction.bind(null, submissionId);
  const countLabel = comments.length === 1 ? "1 comentario" : `${comments.length} comentarios`;

  return (
    <section className="comment-thread" id="comentarios">
      <div className="comment-thread__header">
        <p className="eyebrow">Conversación</p>
        <div className="comment-thread__title-row">
          <h2>Comentarios</h2>
          <span className="comment-thread__count">{countLabel}</span>
        </div>
      </div>

      {readonly ? (
        <p className="comment-readonly-note">
          Vista pública: puedes leer el hilo. Para participar, únete a la comunidad.
        </p>
      ) : submitComment ? (
        <form action={submitComment} className="comment-composer">
          <div className="comment-composer__shell">
            <span className="comment-composer__avatar" aria-hidden="true">
              +
            </span>
            <div className="comment-composer__fields">
              <label className="sr-only" htmlFor={`comment-body-${submissionId}`}>
                Escribe un comentario
              </label>
              <textarea
                id={`comment-body-${submissionId}`}
                maxLength={600}
                minLength={2}
                name="body"
                placeholder="Une tu comentario al hilo…"
                required
                rows={3}
              />
              <div className="comment-composer__footer">
                <p>Sin enlaces ni datos personales · máx. 600</p>
                <button className="button button--primary" type="submit">
                  Comentar
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : null}

      {comments.length ? (
        <ul className="comment-list">
          {comments.map((comment) => {
            const remove =
              !readonly && comment.canDelete
                ? removeOwnGalleryCommentAction.bind(null, comment.id)
                : null;
            return (
              <li className="comment-item" key={comment.id}>
                <div className="comment-item__rail" aria-hidden="true" />
                <Avatar color={avatarColorFor(comment.authorName)} name={comment.authorName} size="sm" />
                <div className="comment-item__body">
                  <header className="comment-item__meta">
                    <strong>{comment.authorName}</strong>
                    <span aria-hidden="true">·</span>
                    <time dateTime={comment.createdAt.toISOString()}>
                      {relativeTime(comment.createdAt)}
                    </time>
                  </header>
                  <p>{comment.body}</p>
                  {remove ? (
                    <div className="comment-item__actions">
                      <form action={remove}>
                        <button className="comment-item__action" type="submit">
                          Eliminar
                        </button>
                      </form>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="comment-empty">
          {readonly
            ? "Todavía no hay comentarios en este hilo."
            : "Sé la primera persona en abrir la conversación."}
        </p>
      )}
    </section>
  );
}
