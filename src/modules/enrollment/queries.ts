import "server-only";

import { and, asc, eq, or } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/db";
import { enrollments, programVersions, weekProgress } from "@/db/schema";

export const findActiveEnrollment = cache(async function findActiveEnrollment(userId: string) {
  const records = await db
    .select({ enrollment: enrollments, contentVersion: programVersions.version })
    .from(enrollments)
    .innerJoin(programVersions, eq(programVersions.id, enrollments.programVersionId))
    .where(
      and(
        eq(enrollments.userId, userId),
        or(eq(enrollments.status, "active"), eq(enrollments.status, "completed")),
      ),
    )
    .orderBy(asc(enrollments.enrolledAt));

  return (
    records.find(({ enrollment }) => enrollment.mode === "facilitated" && enrollment.status === "active") ??
    records.find(({ enrollment }) => enrollment.status === "active") ??
    records.find(({ enrollment }) => enrollment.mode === "facilitated") ??
    records[0]
  );
});

export const hasLearningEnrollment = cache(async function hasLearningEnrollment(
  userId: string,
): Promise<boolean> {
  return Boolean(await findActiveEnrollment(userId));
});

export const listCompletedWeekNumbers = cache(async function listCompletedWeekNumbers(
  userId: string,
): Promise<number[]> {
  const enrollmentWithVersion = await findActiveEnrollment(userId);
  if (!enrollmentWithVersion) return [];
  const records = await db
    .select({ weekId: weekProgress.weekId })
    .from(weekProgress)
    .where(
      and(
        eq(weekProgress.enrollmentId, enrollmentWithVersion.enrollment.id),
        eq(weekProgress.contentVersion, enrollmentWithVersion.contentVersion),
        eq(weekProgress.state, "completed"),
      ),
    );
  return records
    .map(({ weekId }) => Number(weekId.match(/week-(\d+)/)?.[1]))
    .filter(Number.isInteger);
});
