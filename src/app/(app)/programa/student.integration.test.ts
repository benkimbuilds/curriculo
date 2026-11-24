import { and, eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { db } from "@/db";
import { enrollments, lessonProgress, programVersions, submissions, user } from "@/db/schema";
import { createStudentSubmission } from "@/app/proyectos/submission-service";
import { completeStudentLesson } from "./student-service";
import { listOdinDocuments } from "@/modules/curriculum/odin";

const integrationTest = process.env.TEST_DATABASE_URL ? it : it.skip;

async function createEnrolledStudent() {
  const [version] = await db.select().from(programVersions).where(eq(programVersions.isDefault, true)).limit(1);
  if (!version) throw new Error("Seeded default program version is required");
  const [student] = await db.insert(user).values({ name: "Estudiante de integración", email: `${crypto.randomUUID()}@example.test`, emailVerified: true }).returning();
  if (!student) throw new Error("Student was not created");
  const [enrollment] = await db.insert(enrollments).values({ userId: student.id, programVersionId: version.id, mode: "self_paced", status: "active" }).returning();
  if (!enrollment) throw new Error("Enrollment was not created");
  return { student, enrollment };
}

describe("student learning persistence", () => {
  integrationTest("keeps extension progress available after graduation and scoped to the owner", async () => {
    const { student, enrollment } = await createEnrolledStudent();
    const lesson = listOdinDocuments()[0];
    expect(lesson).toBeDefined();
    const completedAt = new Date("2026-01-15T12:00:00Z");
    await db.update(enrollments).set({ status: "completed", completedAt }).where(eq(enrollments.id, enrollment.id));
    const input = { userId: student.id, enrollmentId: enrollment.id, week: lesson.week, lessonId: lesson.id, contentVersion: "2026.1" };
    const progress = await completeStudentLesson(input);
    expect(progress.lessonId).toBe(lesson.id);
    expect(progress.state).toBe("completed");
    await expect(completeStudentLesson({ ...input, userId: crypto.randomUUID() })).rejects.toMatchObject({ code: "NOT_FOUND" });
    const [stored] = await db.select().from(enrollments).where(eq(enrollments.id, enrollment.id));
    expect(stored.status).toBe("completed");
    expect(stored.completedAt).toEqual(completedAt);
  });
  integrationTest("stores version-pinned lesson completion only for an owned enrollment", async () => {
    const { student, enrollment } = await createEnrolledStudent();
    const progress = await completeStudentLesson({ userId: student.id, enrollmentId: enrollment.id, week: 1, lessonId: "week-01-lesson-01", contentVersion: "2026.1" });
    expect(progress).toMatchObject({ enrollmentId: enrollment.id, lessonId: "week-01-lesson-01", contentVersion: "2026.1", state: "completed" });

    const persisted = await db.select().from(lessonProgress).where(and(eq(lessonProgress.enrollmentId, enrollment.id), eq(lessonProgress.lessonId, "week-01-lesson-01")));
    expect(persisted).toHaveLength(1);
    await expect(completeStudentLesson({ userId: crypto.randomUUID(), enrollmentId: enrollment.id, week: 1, lessonId: "week-01-lesson-02", contentVersion: "2026.1" })).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  integrationTest("creates sequential immutable attempts and queues the week-one evaluator", async () => {
    const { student, enrollment } = await createEnrolledStudent();
    const base = {
      userId: student.id,
      enrollmentId: enrollment.id,
      week: 1,
      repositoryUrl: "https://github.com/example/ruta-profile",
      commitSha: "a".repeat(40),
      deploymentUrl: "https://student.example.com/profile",
      reflection: "Probé cada cambio por separado y validé la estructura antes de publicar.",
    };
    const first = await createStudentSubmission(base);
    const second = await createStudentSubmission({ ...base, commitSha: "b".repeat(40), reflection: "Corregí la estructura semántica y volví a comprobar cada enlace publicado." });
    expect([first.attempt, second.attempt]).toEqual([1, 2]);
    expect(first.status).toBe("evaluating");
    expect(first.snapshot).toMatchObject({ attemptNumber: 1, artifact: { commitSha: "a".repeat(40) } });

    const stored = await db.select().from(submissions).where(and(eq(submissions.enrollmentId, enrollment.id), eq(submissions.projectId, "week-01-project")));
    expect(stored.map(({ attempt }) => attempt).sort()).toEqual([1, 2]);
    expect(stored.find(({ attempt }) => attempt === 1)?.commitSha).toBe("a".repeat(40));
  });

  integrationTest("rejects duplicate commits and excessive rapid submissions", async () => {
    const { student, enrollment } = await createEnrolledStudent();
    const base = {
      userId: student.id,
      enrollmentId: enrollment.id,
      week: 2,
      repositoryUrl: "https://github.com/example/ruta-responsive",
      deploymentUrl: "https://student.example.com/responsive",
      reflection: "Validé los cambios en tamaños de pantalla distintos y documenté la evidencia.",
    };
    await createStudentSubmission({ ...base, commitSha: "1".repeat(40) });
    await expect(createStudentSubmission({ ...base, commitSha: "1".repeat(40) })).rejects.toThrow("already submitted");
    for (const value of ["2", "3", "4", "5"]) {
      await createStudentSubmission({ ...base, commitSha: value.repeat(40) });
    }
    await expect(createStudentSubmission({ ...base, commitSha: "6".repeat(40) })).rejects.toThrow("wait before submitting");
  });
});
