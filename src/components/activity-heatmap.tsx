import { formatInvestedTime, type StudentActivitySummary } from "@/app/programa/student-activity";

export function ActivityHeatmap({
  activity,
  compact = false,
}: {
  activity: StudentActivitySummary;
  compact?: boolean;
}) {
  return (
    <section className={`activity-card${compact ? " activity-card--compact" : ""}`} aria-label="Registro de actividad">
      <div className="activity-card__header">
        <div>
          <p className="eyebrow">Tu ritmo</p>
          <h2>Actividad</h2>
        </div>
        <div className="activity-card__total">
          <strong>{formatInvestedTime(activity.totalMinutes)}</strong>
          <span>tiempo invertido</span>
        </div>
      </div>

      <div className="activity-heatmap" role="img" aria-label={`Actividad del ${activity.rangeLabel}`}>
        <div className="activity-heatmap__weekdays" aria-hidden="true">
          {activity.weekdayLabels.map((label, index) => (
            <span key={label} className={index % 2 === 0 ? undefined : "is-muted"}>
              {label}
            </span>
          ))}
        </div>
        <div className="activity-heatmap__grid">
          {activity.weeks.map((week) => (
            <div className="activity-heatmap__week" key={week.days[0]?.date}>
              {week.days.map((day) => (
                <span
                  key={day.date}
                  className={`activity-heatmap__cell activity-heatmap__cell--l${day.level}`}
                  title={day.label}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="activity-card__footer">
        <p>
          {activity.activeDays === 0
            ? "Sin actividad todavía."
            : `${activity.activeDays} día${activity.activeDays === 1 ? "" : "s"} activo${activity.activeDays === 1 ? "" : "s"}`}
          {activity.streakDays > 0 ? ` · Racha ${activity.streakDays}` : null}
        </p>
        <div className="activity-heatmap__legend" aria-hidden="true">
          <span>Menos</span>
          <span className="activity-heatmap__cell activity-heatmap__cell--l0" />
          <span className="activity-heatmap__cell activity-heatmap__cell--l1" />
          <span className="activity-heatmap__cell activity-heatmap__cell--l2" />
          <span className="activity-heatmap__cell activity-heatmap__cell--l3" />
          <span className="activity-heatmap__cell activity-heatmap__cell--l4" />
          <span>Más</span>
        </div>
      </div>
    </section>
  );
}
