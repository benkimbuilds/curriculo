import { describe, expect, it } from "vitest";

import { formatInvestedTime, getStudentActivitySummary, type ActivitySource } from "./student-activity";

function makeSource(overrides: Partial<ActivitySource> = {}): ActivitySource {
  return {
    weeks: [
      {
        modules: [
          {
            lessons: [
              { id: "week-01-lesson-01", estimatedMinutes: 180 },
              { id: "week-01-lesson-02", estimatedMinutes: 120 },
            ],
          },
        ],
        project: { id: "week-01-project", estimatedMinutes: 720 },
      },
    ],
    lessonProgress: [],
    submissions: [],
    ...overrides,
  };
}

describe("formatInvestedTime", () => {
  it("formats minutes and hours", () => {
    expect(formatInvestedTime(45)).toBe("45 min");
    expect(formatInvestedTime(60)).toBe("1 h");
    expect(formatInvestedTime(150)).toBe("2 h 30 min");
  });
});

describe("getStudentActivitySummary", () => {
  it("attributes completed lesson minutes to the completion day", () => {
    const summary = getStudentActivitySummary(
      makeSource({
        lessonProgress: [
          {
            lessonId: "week-01-lesson-01",
            state: "completed",
            viewedAt: new Date("2026-11-10T18:00:00Z"),
            completedAt: new Date("2026-11-18T18:00:00Z"),
            updatedAt: new Date("2026-11-18T18:00:00Z"),
          },
        ],
      }),
      { weeks: 4, now: new Date("2026-11-20T18:00:00Z") },
    );

    expect(summary.totalMinutes).toBe(180);
    expect(summary.activeDays).toBe(1);
    expect(formatInvestedTime(summary.totalMinutes)).toBe("3 h");
    const active = summary.weeks.flatMap((week) => week.days).filter((day) => day.minutes > 0);
    expect(active).toHaveLength(1);
    expect(active[0]?.date).toBe("2026-11-18");
    expect(active[0]?.level).toBe(4);
  });

  it("returns an empty compact grid for new learners", () => {
    const summary = getStudentActivitySummary(makeSource(), {
      weeks: 16,
      now: new Date("2026-11-20T18:00:00Z"),
    });
    expect(summary.totalMinutes).toBe(0);
    expect(summary.activeDays).toBe(0);
    expect(summary.weeks).toHaveLength(16);
    expect(summary.weeks[0]?.days).toHaveLength(7);
  });
});
