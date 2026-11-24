import "server-only";

import { and, desc, eq, gt, isNull, lte, or } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { announcements, cohorts, cohortSchedules, enrollments, lessonProgress, submissions, weekProgress } from "@/db/schema";
import { getCurrentSession } from "@/modules/auth/session";
import { getRoleHomeDestination, hasLearningAccess } from "@/modules/authorization/navigation";
import { loadAuthorizationContext } from "@/modules/authorization/service";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";
import { listCurriculumWeeks, type CurriculumDocument } from "@/modules/curriculum";
import { findActiveEnrollment, hasLearningEnrollment, listCompletedWeekNumbers } from "@/modules/enrollment/queries";
import { provisionVerifiedLearner } from "@/modules/enrollment/service";

export { hasLearningEnrollment, listCompletedWeekNumbers };

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

export async function loadStudentContext(
  returnTo: string,
  options: { includeLibrary?: boolean } = {},
): Promise<StudentContext> {
  const currentSession = await getCurrentSession();
  if (!currentSession) redirect(`/iniciar-sesion?next=${encodeURIComponent(returnTo)}`);
  if (!currentSession.user.emailVerified) redirect("/verifica-tu-correo");
  const organizationId = await resolveDefaultOrganizationId();
  let [authorization, enrollmentWithVersion] = await Promise.all([
    loadAuthorizationContext(currentSession.user.id, organizationId),
    findActiveEnrollment(currentSession.user.id),
  ]);
  // Fresh verified accounts may lack role/enrollment until provisioning runs.
  if (!hasLearningAccess(authorization.organizationRoles, Boolean(enrollmentWithVersion))) {
    if (authorization.organizationRoles.length === 0) {
      await provisionVerifiedLearner(currentSession.user.id);
      [authorization, enrollmentWithVersion] = await Promise.all([
        loadAuthorizationContext(currentSession.user.id, organizationId),
        findActiveEnrollment(currentSession.user.id),
      ]);
    }
    if (!hasLearningAccess(authorization.organizationRoles, Boolean(enrollmentWithVersion))) {
      redirect(getRoleHomeDestination(authorization.organizationRoles, Boolean(enrollmentWithVersion)).href);
    }
  }
  if (!enrollmentWithVersion) {
    await provisionVerifiedLearner(currentSession.user.id);
    enrollmentWithVersion = await findActiveEnrollment(currentSession.user.id);
  }
  if (!enrollmentWithVersion) throw new Error("No se pudo preparar tu inscripción.");
  const { enrollment, contentVersion } = enrollmentWithVersion;
  const weeks = listCurriculumWeeks({ includeLibrary: options.includeLibrary ?? false }).filter(
    (week) => week.contentVersion === contentVersion,
  );
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
