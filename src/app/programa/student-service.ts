import { and, eq, or, sql } from "drizzle-orm";

import { db, type Database } from "@/db";
import { enrollments, lessonProgress, submissions, weekProgress } from "@/db/schema";
import { listCurriculumWeeks } from "@/modules/curriculum";
import { ResourceNotFoundError } from "@/shared/errors";

async function requireOwnedEnrollment(userId: string, enrollmentId: string, database: Database) {
  const [ownedEnrollment] = await database
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(and(eq(enrollments.id, enrollmentId), eq(enrollments.userId, userId), or(eq(enrollments.status, "active"), eq(enrollments.status, "completed"))))
    .limit(1);
  if (!ownedEnrollment) throw new ResourceNotFoundError("Inscripción activa");
  return ownedEnrollment;
}

function requireLesson(week: number, lessonId: string, contentVersion?: string) {
  const curriculumWeek = listCurriculumWeeks({ includeLibrary: true }).find((item) => item.week === week && (!contentVersion || item.contentVersion === contentVersion));
  const lesson = curriculumWeek?.modules.flatMap((item) => item.lessons).find(({ id }) => id === lessonId);
  if (!curriculumWeek || !lesson || (contentVersion && curriculumWeek.contentVersion !== contentVersion)) {
    throw new ResourceNotFoundError("Lección publicada");
  }
  return { curriculumWeek, lesson };
}

export async function syncStudentCompletion(
  input: { userId: string; enrollmentId: string; contentVersion: string },
  database: Database = db,
) {
  await requireOwnedEnrollment(input.userId, input.enrollmentId, database);
  const weeks = listCurriculumWeeks().filter(({ contentVersion }) => contentVersion === input.contentVersion);
  if (weeks.length === 0) throw new ResourceNotFoundError("Versión del programa");
  const [lessonRows, submissionRows] = await Promise.all([
    database.select().from(lessonProgress).where(and(eq(lessonProgress.enrollmentId, input.enrollmentId), eq(lessonProgress.contentVersion, input.contentVersion))),
    database.select().from(submissions).where(and(eq(submissions.enrollmentId, input.enrollmentId), eq(submissions.projectVersion, input.contentVersion))),
  ]);
  const lessonStates = new Map(lessonRows.map(({ lessonId, state }) => [lessonId, state]));
  const now = new Date();
  for (const week of weeks) {
    const requiredLessons = week.modules.flatMap((item) => item.lessons).filter(({ required }) => required);
    const completedLessons = requiredLessons.filter(({ id }) => ["completed", "passed"].includes(lessonStates.get(id) ?? ""));
    const attempts = submissionRows.filter(({ projectId }) => projectId === week.project.id).sort((left, right) => right.attempt - left.attempt);
    const latest = attempts[0];
    const hasPassedProject = attempts.some(({ status }) => status === "passed");
    const state = completedLessons.length === requiredLessons.length && hasPassedProject
      ? "completed" as const
      : latest?.status === "needs_revision"
        ? "needs_revision" as const
        : latest
          ? "submitted" as const
          : completedLessons.length > 0
            ? "attempted" as const
            : "not_started" as const;
    await database.insert(weekProgress).values({ enrollmentId: input.enrollmentId, weekId: week.id, contentVersion: input.contentVersion, state, completedAt: state === "completed" ? now : null })
      .onConflictDoUpdate({ target: [weekProgress.enrollmentId, weekProgress.weekId, weekProgress.contentVersion], set: { state, completedAt: state === "completed" ? sql`coalesce(${weekProgress.completedAt}, ${now})` : null, updatedAt: now } });
  }
  const requiredLessonIds = weeks.flatMap((week) => week.modules.flatMap((item) => item.lessons).filter(({ required }) => required).map(({ id }) => id));
  const allLessonsComplete = requiredLessonIds.every((id) => ["completed", "passed"].includes(lessonStates.get(id) ?? ""));
  const allProjectsPassed = weeks.every((week) => submissionRows.some(({ projectId, status }) => projectId === week.project.id && status === "passed"));
  if (allLessonsComplete && allProjectsPassed) {
    await database.update(enrollments).set({ status: "completed", completedAt: now, updatedAt: now }).where(and(eq(enrollments.id, input.enrollmentId), eq(enrollments.userId, input.userId), eq(enrollments.status, "active")));
  }
  return { allLessonsComplete, allProjectsPassed, completed: allLessonsComplete && allProjectsPassed };
}

export async function recordStudentLessonView(
  input: { userId: string; enrollmentId: string; week: number; lessonId: string; contentVersion: string; resumePosition?: number },
  database: Database = db,
) {
  const { lesson } = requireLesson(input.week, input.lessonId, input.contentVersion);
  const ownedEnrollment = await requireOwnedEnrollment(input.userId, input.enrollmentId, database);
  const now = new Date();
  const position = Math.max(0, Math.min(100, Math.round(input.resumePosition ?? 0)));
  const [record] = await database.insert(lessonProgress).values({ enrollmentId: ownedEnrollment.id, lessonId: lesson.id, contentVersion: input.contentVersion, state: "viewed", viewedAt: now, resumePosition: position })
    .onConflictDoUpdate({ target: [lessonProgress.enrollmentId, lessonProgress.lessonId, lessonProgress.contentVersion], set: { viewedAt: now, resumePosition: position, updatedAt: now } }).returning();
  if (!record) throw new Error("No se pudo guardar la posición.");
  await syncStudentCompletion({ userId: input.userId, enrollmentId: input.enrollmentId, contentVersion: input.contentVersion }, database);
  return record;
}

export async function completeStudentLesson(
  input: { userId: string; enrollmentId: string; week: number; lessonId: string; contentVersion: string },
  database: Database = db,
) {
  const { curriculumWeek, lesson } = requireLesson(input.week, input.lessonId, input.contentVersion);
  const ownedEnrollment = await requireOwnedEnrollment(input.userId, input.enrollmentId, database);

  const now = new Date();
  const [record] = await database
    .insert(lessonProgress)
    .values({
      enrollmentId: ownedEnrollment.id,
      lessonId: lesson.id,
      contentVersion: curriculumWeek.contentVersion,
      state: "completed",
      viewedAt: now,
      completedAt: now,
    })
    .onConflictDoUpdate({
      target: [lessonProgress.enrollmentId, lessonProgress.lessonId, lessonProgress.contentVersion],
      set: { state: "completed", viewedAt: now, completedAt: now, updatedAt: now },
    })
    .returning();
  if (!record) throw new Error("No se pudo guardar el avance.");
  await syncStudentCompletion({ userId: input.userId, enrollmentId: input.enrollmentId, contentVersion: curriculumWeek.contentVersion }, database);
  return record;
}
