const TIME_ZONE = "America/Mexico_City";
const WEEKDAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"] as const;

export type ActivityLevel = 0 | 1 | 2 | 3 | 4;

export interface ActivityDay {
  date: string;
  minutes: number;
  level: ActivityLevel;
  label: string;
}

export interface ActivityWeek {
  days: ActivityDay[];
}

export interface StudentActivitySummary {
  totalMinutes: number;
  activeDays: number;
  streakDays: number;
  weeks: ActivityWeek[];
  weekdayLabels: readonly string[];
  rangeLabel: string;
}

export interface ActivityLessonRef {
  id: string;
  estimatedMinutes: number;
}

export interface ActivityProjectRef {
  id: string;
  estimatedMinutes: number;
}

export interface ActivityWeekRef {
  modules: { lessons: ActivityLessonRef[] }[];
  project: ActivityProjectRef;
}

export interface ActivityLessonProgress {
  lessonId: string;
  state: string;
  viewedAt: Date | null;
  completedAt: Date | null;
  updatedAt: Date;
}

export interface ActivitySubmission {
  projectId: string;
  submittedAt: Date;
}

export interface ActivitySource {
  weeks: ActivityWeekRef[];
  lessonProgress: ActivityLessonProgress[];
  submissions: ActivitySubmission[];
}

function isLessonComplete(state: string | undefined): boolean {
  return state === "completed" || state === "passed";
}

function dayKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function parseDayKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + amount);
  return next;
}

function startOfWeekMonday(date: Date): Date {
  const day = date.getUTCDay();
  const offset = day === 0 ? -6 : 1 - day;
  return addDays(date, offset);
}

function activityLevel(minutes: number): ActivityLevel {
  if (minutes <= 0) return 0;
  if (minutes < 30) return 1;
  if (minutes < 90) return 2;
  if (minutes < 180) return 3;
  return 4;
}

function formatDayLabel(key: string, minutes: number): string {
  const date = parseDayKey(key);
  const formatted = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date);
  if (minutes <= 0) return `${formatted}: sin actividad`;
  return `${formatted}: ${formatInvestedTime(minutes)}`;
}

export function formatInvestedTime(totalMinutes: number): string {
  const minutes = Math.max(0, Math.round(totalMinutes));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (remainder === 0) return hours === 1 ? "1 h" : `${hours} h`;
  return `${hours} h ${remainder} min`;
}

function collectMinutesByDay(source: ActivitySource): Map<string, number> {
  const lessonMinutes = new Map(
    source.weeks
      .flatMap((week) => week.modules.flatMap((module) => module.lessons))
      .map((lesson) => [lesson.id, lesson.estimatedMinutes] as const),
  );
  const projectMinutes = new Map(source.weeks.map((week) => [week.project.id, week.project.estimatedMinutes] as const));
  const byDay = new Map<string, number>();

  const add = (when: Date | null | undefined, minutes: number) => {
    if (!when || minutes <= 0) return;
    const key = dayKey(when);
    byDay.set(key, (byDay.get(key) ?? 0) + minutes);
  };

  for (const record of source.lessonProgress) {
    const minutes = lessonMinutes.get(record.lessonId);
    if (!minutes) continue;
    if (isLessonComplete(record.state) && record.completedAt) {
      add(record.completedAt, minutes);
      continue;
    }
    if (record.viewedAt || record.state === "viewed" || record.state === "attempted") {
      add(record.viewedAt ?? record.updatedAt, Math.min(15, Math.round(minutes / 12)));
    }
  }

  const firstSubmissionByProject = new Map<string, ActivitySubmission>();
  for (const submission of source.submissions) {
    const existing = firstSubmissionByProject.get(submission.projectId);
    if (!existing || submission.submittedAt < existing.submittedAt) {
      firstSubmissionByProject.set(submission.projectId, submission);
    }
  }
  for (const submission of firstSubmissionByProject.values()) {
    add(submission.submittedAt, projectMinutes.get(submission.projectId) ?? 0);
  }

  return byDay;
}

function computeStreak(byDay: Map<string, number>, todayKey: string): number {
  let streak = 0;
  let cursor = parseDayKey(todayKey);
  if ((byDay.get(todayKey) ?? 0) <= 0) {
    cursor = addDays(cursor, -1);
  }
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if ((byDay.get(key) ?? 0) <= 0) break;
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function getStudentActivitySummary(
  source: ActivitySource,
  options: { weeks?: number; now?: Date } = {},
): StudentActivitySummary {
  const weekCount = options.weeks ?? 16;
  const now = options.now ?? new Date();
  const todayKey = dayKey(now);
  const today = parseDayKey(todayKey);
  const endWeek = startOfWeekMonday(today);
  const startWeek = addDays(endWeek, -(weekCount - 1) * 7);
  const byDay = collectMinutesByDay(source);

  const weeks: ActivityWeek[] = [];
  for (let weekIndex = 0; weekIndex < weekCount; weekIndex += 1) {
    const weekStart = addDays(startWeek, weekIndex * 7);
    const days: ActivityDay[] = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const date = addDays(weekStart, dayIndex);
      const key = date.toISOString().slice(0, 10);
      const minutes = key > todayKey ? 0 : (byDay.get(key) ?? 0);
      days.push({
        date: key,
        minutes,
        level: activityLevel(minutes),
        label: formatDayLabel(key, minutes),
      });
    }
    weeks.push({ days });
  }

  const totalMinutes = [...byDay.values()].reduce((sum, minutes) => sum + minutes, 0);
  const visibleDays = weeks.flatMap((week) => week.days);
  const activeDays = visibleDays.filter((day) => day.minutes > 0).length;
  const rangeStart = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", timeZone: "UTC" }).format(startWeek);
  const rangeEnd = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", timeZone: "UTC" }).format(addDays(endWeek, 6));

  return {
    totalMinutes,
    activeDays,
    streakDays: computeStreak(byDay, todayKey),
    weeks,
    weekdayLabels: WEEKDAY_LABELS,
    rangeLabel: `${rangeStart} – ${rangeEnd}`,
  };
}
