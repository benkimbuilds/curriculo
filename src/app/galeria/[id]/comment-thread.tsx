import {
  createGalleryCommentAction,
  removeOwnGalleryCommentAction,
} from "@/modules/community/db-actions";
import type { GalleryCommentView } from "@/modules/community/db-community";

export function CommentThread({
  submissionId,
  comments,
}: {
  submissionId: string;
  comments: readonly GalleryCommentView[];
}) {
  const submitComment = createGalleryCommentAction.bind(null, submissionId);

  return (
    <section className="comment-thread" id="comentarios">
      <div className="comment-thread__header">
        <div>
          <p className="eyebrow">Conversación</p>
          <h2>Comentarios</h2>
        </div>
        <strong>{comments.length === 1 ? "1 comentario" : `${comments.length} comentarios`}</strong>
      </div>

      <form action={submitComment} className="comment-composer">
        <label>
          Deja un comentario constructivo
          <textarea
            maxLength={600}
            minLength={2}
            name="body"
            placeholder="Qué te gustó, qué probarías o qué aprendiste al ver este proyecto…"
            required
            rows={3}
          />
        </label>
        <div className="comment-composer__footer">
          <p>Sin enlaces, correos ni datos personales. Máximo 600 caracteres.</p>
          <button className="button button--primary" type="submit">
            Publicar comentario
          </button>
        </div>
      </form>

      {comments.length ? (
        <ul className="comment-list">
          {comments.map((comment) => {
            const remove = removeOwnGalleryCommentAction.bind(null, comment.id);
            return (
              <li className="comment-item" key={comment.id}>
                <header>
                  <strong>{comment.authorName}</strong>
                  <time dateTime={comment.createdAt.toISOString()}>
                    {new Intl.DateTimeFormat("es-MX", {
                      dateStyle: "medium",
                      timeZone: "America/Mexico_City",
                    }).format(comment.createdAt)}
                  </time>
                </header>
                <p>{comment.body}</p>
                {comment.canDelete ? (
                  <form action={remove}>
                    <button className="text-link" type="submit">
                      Eliminar
                    </button>
                  </form>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="comment-empty">Sé la primera persona en comentar este proyecto.</p>
      )}
    </section>
  );
}
