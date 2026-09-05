"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/db";
import { programVersions, programs, user } from "@/db/schema";
import { requireCurrentSession } from "@/modules/auth/session";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";

import {
  archiveCohort,
  assignCohortStaff,
  createCohort,
  inviteLearnerToCohort,
  grantOrganizationRole,
  publishAnnouncement,
  setCohortWeekSchedule,
  removeLearnerFromCohort,
} from "./service";

export async function createCohortAction(formData: FormData): Promise<void> {
  const session = await requireCurrentSession();
  const parsed = z.object({
    name: z.string().trim().min(3).max(160),
    slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date(),
    capacity: z.coerce.number().int().min(1).max(500),
  }).parse(Object.fromEntries(formData));
  const organizationId = await resolveDefaultOrganizationId();
  const [version] = await db.select({ id: programVersions.id }).from(programVersions)
    .innerJoin(programs, eq(programs.id, programVersions.programId))
    .where(sql`${programs.organizationId} = ${organizationId} and ${programVersions.isDefault} = true`).limit(1);
  if (!version) throw new Error("PROGRAM_VERSION_NOT_FOUND");
  const cohort = await createCohort({ ...parsed, organizationId, programVersionId: version.id, timezone: "America/Mexico_City" }, session.user.id);
  redirect(`/staff/cohortes/${cohort.id}`);
}

export async function inviteLearnersAction(cohortId: string, formData: FormData): Promise<void> {
  const session = await requireCurrentSession();
  const emails = z.string().max(10_000).parse(formData.get("emails")).split(/[\s,;]+/).map((value) => value.trim()).filter(Boolean);
  if (!emails.length || emails.length > 100) throw new Error("INVITATION_BATCH_INVALID");
  for (const email of [...new Set(emails)]) await inviteLearnerToCohort(cohortId, email, session.user.id);
  revalidatePath(`/staff/cohortes/${cohortId}`);
  redirect(`/staff/cohortes/${cohortId}?invitados=1`);
}

export async function setWeekScheduleAction(cohortId: string, formData: FormData): Promise<void> {
  const session = await requireCurrentSession();
  const parsed = z.object({
    weekId: z.string().regex(/^week-(?:0[1-9]|1[0-2])$/),
    opensAt: z.coerce.date(),
    dueAt: z.coerce.date(),
  }).parse(Object.fromEntries(formData));
  await setCohortWeekSchedule(cohortId, parsed.weekId, { opensAt: parsed.opensAt, dueAt: parsed.dueAt }, session.user.id);
  revalidatePath(`/staff/cohortes/${cohortId}`);
}

export async function publishAnnouncementAction(cohortId: string, formData: FormData): Promise<void> {
  const session = await requireCurrentSession();
  const parsed = z.object({ title: z.string().trim().min(3).max(180), body: z.string().trim().min(3).max(5_000) }).parse(Object.fromEntries(formData));
  await publishAnnouncement(cohortId, parsed, session.user.id);
  revalidatePath(`/staff/cohortes/${cohortId}`);
}

export async function archiveCohortAction(cohortId: string): Promise<void> {
  const session = await requireCurrentSession();
  await archiveCohort(cohortId, session.user.id);
  revalidatePath("/staff");
  redirect("/staff");
}

export async function assignStaffAction(cohortId: string, formData: FormData): Promise<void> {
  const session = await requireCurrentSession();
  const parsed = z.object({
    email: z.email(),
    role: z.enum(["instructor", "administrator", "curriculum_editor", "developer_administrator"]),
  }).parse(Object.fromEntries(formData));
  const [account] = await db.select({ id: user.id }).from(user).where(sql`lower(${user.email}) = ${parsed.email.toLowerCase()}`).limit(1);
  if (!account) throw new Error("STAFF_ACCOUNT_NOT_FOUND");
  const organizationId = await resolveDefaultOrganizationId();
  await grantOrganizationRole(organizationId, account.id, parsed.role, session.user.id);
  await assignCohortStaff(cohortId, account.id, parsed.role, session.user.id);
  revalidatePath(`/staff/cohortes/${cohortId}`);
}

export async function removeLearnerAction(cohortId: string, learnerId: string): Promise<void> {
  const session = await requireCurrentSession();
  await removeLearnerFromCohort(cohortId, learnerId, session.user.id);
  revalidatePath(`/staff/cohortes/${cohortId}`);
  redirect(`/staff/cohortes/${cohortId}`);
}
