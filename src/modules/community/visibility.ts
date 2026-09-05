import type {
  CommunityFeatureFlags,
  GalleryAccessDecision,
  GalleryEntry,
  GalleryViewer,
} from "./types";

function hasGalleryCohort(viewer: GalleryViewer, entry: GalleryEntry): boolean {
  return entry.cohortIds.some(
    (cohortId) =>
      viewer.memberCohortIds.includes(cohortId) ||
      viewer.staffedCohortIds.includes(cohortId),
  );
}

function hasStaffedCohort(viewer: GalleryViewer, entry: GalleryEntry): boolean {
  return entry.cohortIds.some((cohortId) =>
    viewer.staffedCohortIds.includes(cohortId),
  );
}

export function decideGalleryAccess(
  viewer: GalleryViewer,
  entry: GalleryEntry,
  flags: CommunityFeatureFlags,
): GalleryAccessDecision {
  if (
    viewer.roles.includes("administrator") ||
    (viewer.roles.includes("facilitator") && hasStaffedCohort(viewer, entry))
  ) {
    return { allowed: true, reason: "staff_moderation" };
  }

  if (viewer.userId === entry.ownerId) {
    return { allowed: true, reason: "owner_preview" };
  }

  if (!flags.galleryEnabled) {
    return { allowed: false, reason: "feature_disabled" };
  }

  if (!viewer.emailVerified) {
    return { allowed: false, reason: "unverified_viewer" };
  }

  if (!entry.published) {
    return { allowed: false, reason: "not_published" };
  }

  if (entry.moderationStatus !== "visible") {
    return { allowed: false, reason: "moderated" };
  }

  if (entry.visibility === "private") {
    return { allowed: false, reason: "private" };
  }

  if (
    entry.visibility === "cohort" &&
    !hasGalleryCohort(viewer, entry)
  ) {
    return { allowed: false, reason: "different_cohort" };
  }

  return { allowed: true, reason: "allowed" };
}
