import "server-only";

import { and, asc, desc, eq, gt, isNull, lte, or } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { announcements, cohorts, cohortSchedules, enrollments, lessonProgress, programVersions, submissions, weekProgress } from "@/db/schema";
import { getCurrentSession } from "@/modules/auth/session";
import { listCurriculumWeeks, type CurriculumDocument } from "@/modules/curriculum";
import { provisionVerifiedLearner } from "@/modules/enrollment/service";

export type LessonProgressRecord = typeof lessonProgress.$inferSelect;
export type SubmissionRecord = typeof submissions.$inferSelect;

export interface StudentContext {
  user: { id: string; name: string; email: string };
  enrollment: typeof enrollments.$inferSelect;
  contentVersion: string;
  weeks: CurriculumDocument[];
  lessonProgress: LessonProgressRecord[];
  weekProgress: (typeof weekProgress.$inferSelect)[];
  submissions: SubmissionRecord[];
  schedules: (typeof cohortSchedules.$inferSelect)[];
  announcements: (typeof announcements.$inferSelect)[];
}

async function findActiveEnrollment(userId: string) {
  const records = await db
    .select({ enrollment: enrollments, contentVersion: programVersions.version })
    .from(enrollments)
    .innerJoin(programVersions, eq(programVersions.id, enrollments.programVersionId))
    .where(and(eq(enrollments.userId, userId), or(eq(enrollments.status, "active"), eq(enrollments.status, "completed"))))
    .orderBy(asc(enrollments.enrolledAt));
  return records.find(({ enrollment }) => enrollment.mode === "facilitated" && enrollment.status === "active")
    ?? records.find(({ enrollment }) => enrollment.status === "active")
    ?? records.find(({ enrollment }) => enrollment.mode === "facilitated")
    ?? records[0];
}

export async function loadStudentContext(returnTo: string): Promise<StudentContext> {
  const currentSession = await getCurrentSession();
  if (!currentSession) redirect(`/iniciar-sesion?next=${encodeURIComponent(returnTo)}`);
  if (!currentSession.user.emailVerified) redirect("/verifica-tu-correo");

  let enrollmentWithVersion = await findActiveEnrollment(currentSession.user.id);
  if (!enrollmentWithVersion) {
    await provisionVerifiedLearner(currentSession.user.id);
    enrollmentWithVersion = await findActiveEnrollment(currentSession.user.id);
  }
  if (!enrollmentWithVersion) throw new Error("No se pudo preparar tu inscripción.");
  const { enrollment, contentVersion } = enrollmentWithVersion;
  const weeks = listCurriculumWeeks({ includeLibrary: true }).filter((week) => week.contentVersion === contentVersion);
  if (weeks.length === 0) throw new Error("La versión de tu programa ya no está disponible.");

  const [progressRows, weekRows, submissionRows, cohortRows] = await Promise.all([
    db.select().from(lessonProgress).where(and(eq(lessonProgress.enrollmentId, enrollment.id), eq(lessonProgress.contentVersion, contentVersion))),
    db.select().from(weekProgress).where(and(eq(weekProgress.enrollmentId, enrollment.id), eq(weekProgress.contentVersion, contentVersion))),
    db.select().from(submissions).where(and(eq(submissions.enrollmentId, enrollment.id), eq(submissions.projectVersion, contentVersion))),
    enrollment.cohortId ? db.select().from(cohorts).where(eq(cohorts.id, enrollment.cohortId)).limit(1) : Promise.resolve([]),
  ]);
  const cohort = cohortRows[0];
  const now = new Date();
  const [scheduleRows, announcementRows] = cohort ? await Promise.all([
    db.select().from(cohortSchedules).where(eq(cohortSchedules.cohortId, cohort.id)),
    db.select().from(announcements).where(and(
      eq(announcements.organizationId, cohort.organizationId),
      or(eq(announcements.cohortId, cohort.id), isNull(announcements.cohortId)),
      lte(announcements.publishedAt, now),
      or(isNull(announcements.expiresAt), gt(announcements.expiresAt, now)),
    )).orderBy(desc(announcements.publishedAt)),
  ]) : [[], []];

  return {
    user: { id: currentSession.user.id, name: currentSession.user.name, email: currentSession.user.email },
    enrollment,
    contentVersion,
    weeks,
    lessonProgress: progressRows,
    weekProgress: weekRows,
    submissions: submissionRows,
    schedules: scheduleRows,
    announcements: announcementRows,
  };
}

export function isLessonComplete(state: LessonProgressRecord["state"] | undefined): boolean {
  return state === "completed" || state === "passed";
}

export function isProjectComplete(status: SubmissionRecord["status"] | undefined): boolean {
  return status === "passed";
}

export function getStudentProgressSummary(context: StudentContext) {
  const lessons = context.weeks.flatMap((week) => week.modules.flatMap((module) => module.lessons));
  const requiredLessons = lessons.filter((lesson) => lesson.required);
  const lessonState = new Map(context.lessonProgress.map((record) => [record.lessonId, record.state]));
  const completedLessons = requiredLessons.filter((lesson) => isLessonComplete(lessonState.get(lesson.id)));
  const passedProjects = new Set(context.submissions.filter(({ status }) => status === "passed").map(({ projectId }) => projectId));
  const completedUnits = completedLessons.length + passedProjects.size;
  const totalUnits = requiredLessons.length + context.weeks.length;
  const currentLesson = requiredLessons.find((lesson) => !isLessonComplete(lessonState.get(lesson.id))) ?? requiredLessons.at(-1);
  const currentWeek = context.weeks.find((week) => week.modules.some((module) => module.lessons.some((lesson) => lesson.id === currentLesson?.id))) ?? context.weeks[0];

  return {
    totalLessons: requiredLessons.length,
    completedLessons: completedLessons.length,
    passedProjects: passedProjects.size,
    percent: totalUnits ? Math.round((completedUnits / totalUnits) * 100) : 0,
    currentLesson,
    currentWeek,
    lessonState,
  };
}
