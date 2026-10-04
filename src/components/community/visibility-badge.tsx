import { StatusPill } from "@/components/ui";
import type { GalleryVisibility } from "@/modules/community/types";

import { visibilityLabel } from "./review-labels";

const tones: Record<GalleryVisibility, "neutral" | "info" | "warm"> = {
  private: "neutral",
  cohort: "warm",
  verified_users: "info",
};

export function VisibilityBadge({ visibility }: { visibility: GalleryVisibility }) {
  return <StatusPill tone={tones[visibility]}>{visibilityLabel(visibility)}</StatusPill>;
}
