"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { requireCurrentSession } from "@/modules/auth/session";
import { AuthorizationDeniedError } from "@/shared/errors";

import { PeerFeedbackService } from "./feedback-service";
import {
  cryptoCommunityIds,
  DrizzleContentReportRepository,
  DrizzleGalleryRepository,
  DrizzlePeerFeedbackRepository,
  requireCommunityContext,
  systemCommunityClock,
} from "./db-community";
import { getOwnProfile } from "./db-profile";
import { ModerationService } from "./moderation-service";
import type {
  FeedbackNextStep,
  ReportReason,
  RubricFeedbackMark,
} from "./types";

export async function updateProfileAction(formData: FormData): Promise<void> {
  const session = await requireCurrentSession();
  await requireCommunityContext(session.user.id, "gallery:read");
  const parsed = z
    .object({
      chosenName: z.string().trim().min(2).max(120),
      bio: z.string().trim().max(240),
      githubUsername: z
        .string()
        .trim()
        .max(39)
        .regex(/^$|^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/),
      profileVisible: z.boolean(),
    })
    .parse({
      chosenName: formData.get("chosenName"),
      bio: formData.get("bio"),
      githubUsername: formData.get("githubUsername"),
      profileVisible: formData.get("profileVisible") === "verified_users",
    });
  const existing = await getOwnProfile(session.user.id);
  if (parsed.profileVisible && existing.isMinor) {
    throw new AuthorizationDeniedError("profile:publish-minor");
  }
  await db
    .insert(profiles)
    .values({ userId: session.user.id, ...parsed })
    .onConflictDoUpdate({
      target: profiles.userId,
      set: { ...parsed, updatedAt: new Date() },
    });
  revalidatePath("/perfil");
  redirect("/perfil?guardado=1");
}

export async function submitStructuredFeedbackAction(
  submissionId: string,
  formData: FormData,
): Promise<void> {
  const session = await requireCurrentSession();
  const context = await requireCommunityContext(
    session.user.id,
    "peer-feedback:create",
  );
  const gallery = new DrizzleGalleryRepository(context.organizationId);
  const entry = await gallery.findById(submissionId);
  if (!entry) throw new Error("PROJECT_NOT_FOUND");
  const marks = new Set<RubricFeedbackMark>([
    "demonstrated",
    "partially_demonstrated",
    "not_yet_demonstrated",
    "not_observed",
  ]);
  const criteria = entry.rubricCriterionIds.map((criterionId) => {
    const value = formData.get(`criterion:${criterionId}`);
    if (typeof value !== "string" || !marks.has(value as RubricFeedbackMark)) {
      throw new Error("INVALID_RUBRIC_MARK");
    }
    return { criterionId, mark: value as RubricFeedbackMark };
  });
  const allowedNextSteps = new Set<FeedbackNextStep>([
    "review_requirements",
    "improve_accessibility",
    "improve_responsiveness",
    "improve_code_clarity",
    "test_edge_cases",
    "ready_for_resubmission",
  ]);
  const nextSteps = formData
    .getAll("nextSteps")
    .filter(
      (value): value is FeedbackNextStep =>
        typeof value === "string" && allowedNextSteps.has(value as FeedbackNextStep),
    );
  const service = new PeerFeedbackService(
    gallery,
    new DrizzlePeerFeedbackRepository(),
    systemCommunityClock,
    cryptoCommunityIds,
    context.flags,
  );
  await service.submit(context.viewer, {
    galleryEntryId: submissionId,
    rubricVersionId: entry.rubricVersionId,
    criteria,
    nextSteps,
  });
  revalidatePath(`/galeria/${submissionId}`);
  redirect(`/galeria/${submissionId}?retroalimentacion=1`);
}

export async function reportGalleryEntryAction(
  submissionId: string,
  formData: FormData,
): Promise<void> {
  const session = await requireCurrentSession();
  const context = await requireCommunityContext(session.user.id, "gallery:read");
  const reasons = new Set<ReportReason>([
    "harassment",
    "hate_or_discrimination",
    "sexual_content",
    "personal_information",
    "spam",
    "copyright",
    "other_safety_concern",
  ]);
  const reason = formData.get("reason");
  if (typeof reason !== "string" || !reasons.has(reason as ReportReason)) {
    throw new Error("INVALID_REPORT_REASON");
  }
  const service = new ModerationService(
    new DrizzleGalleryRepository(context.organizationId),
    new DrizzleContentReportRepository(),
    systemCommunityClock,
    cryptoCommunityIds,
    context.flags,
  );
  await service.report(context.viewer, submissionId, reason as ReportReason);
  revalidatePath(`/galeria/${submissionId}`);
  redirect(`/galeria/${submissionId}?reportado=1`);
}

export async function moderateReportAction(
  reportId: string,
  formData: FormData,
): Promise<void> {
  const session = await requireCurrentSession();
  const context = await requireCommunityContext(
    session.user.id,
    "moderation:manage",
  );
  const decision = formData.get("decision");
  const service = new ModerationService(
    new DrizzleGalleryRepository(context.organizationId, db, session.user.id),
    new DrizzleContentReportRepository(),
    systemCommunityClock,
    cryptoCommunityIds,
    context.flags,
  );
  if (decision === "hide") {
    await service.moderate(context.viewer, {
      reportId,
      nextStatus: "actioned",
      resolution: "content_hidden",
    });
  } else if (decision === "remove") {
    await service.moderate(context.viewer, {
      reportId,
      nextStatus: "actioned",
      resolution: "content_removed",
    });
  } else if (decision === "dismiss") {
    await service.moderate(context.viewer, {
      reportId,
      nextStatus: "dismissed",
      resolution: "no_action",
    });
  } else {
    throw new Error("INVALID_MODERATION_DECISION");
  }
  revalidatePath("/staff/moderacion");
}
