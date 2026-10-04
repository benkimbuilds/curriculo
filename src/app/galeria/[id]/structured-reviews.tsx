import {
  nextStepLabel,
  reviewCountLabel,
  rubricMarkLabel,
} from "@/components/community/review-labels";
import type { PeerFeedback } from "@/modules/community/types";

type Criterion = { id: string; title: string; description: string };

export function StructuredReviews({
  criteria,
  feedback,
}: {
  criteria: readonly Criterion[];
  feedback: readonly PeerFeedback[];
}) {
  if (!feedback.length) {
    return <p className="feedback-empty">Todavía no hay revisiones estructuradas para este intento.</p>;
  }

  const criterionById = new Map(criteria.map((criterion) => [criterion.id, criterion]));

  return (
    <div className="structured-reviews">
      <div className="structured-reviews__header">
        <p className="eyebrow">Revisiones recibidas</p>
        <strong>{reviewCountLabel(feedback.length)}</strong>
      </div>
      <ol className="structured-reviews__list">
        {feedback.map((review, index) => (
          <li className="structured-review" key={review.id}>
            <header className="structured-review__header">
              <strong>Revisión {String(index + 1).padStart(2, "0")}</strong>
              <time dateTime={review.createdAt.toISOString()}>
                {new Intl.DateTimeFormat("es-MX", {
                  dateStyle: "medium",
                  timeZone: "America/Mexico_City",
                }).format(review.createdAt)}
              </time>
            </header>
            <ul className="structured-review__criteria">
              {review.criteria.map((item) => {
                const criterion = criterionById.get(item.criterionId);
                return (
                  <li key={`${review.id}-${item.criterionId}`}>
                    <span>{criterion?.title ?? item.criterionId}</span>
                    <strong data-mark={item.mark}>{rubricMarkLabel(item.mark)}</strong>
                  </li>
                );
              })}
            </ul>
            <div className="structured-review__steps">
              <p className="eyebrow">Siguientes pasos</p>
              {review.nextSteps.length ? (
                <ul>
                  {review.nextSteps.map((step) => (
                    <li key={`${review.id}-${step}`}>{nextStepLabel(step)}</li>
                  ))}
                </ul>
              ) : (
                <p>Sin siguientes pasos seleccionados.</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
