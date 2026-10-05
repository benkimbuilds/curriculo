"use client";

import { useFormStatus } from "react-dom";

import { Spark } from "@/components/icons";
import { toggleGalleryStarAction } from "@/modules/community/db-actions";

function GalleryStarSubmit({
  starCount,
  starred,
  disabled = false,
  size = "md",
}: {
  starCount: number;
  starred: boolean;
  disabled?: boolean;
  size?: "md" | "lg";
}) {
  const { pending } = useFormStatus();
  const className = [
    "gallery-star",
    size === "lg" ? "gallery-star--lg" : "",
    starred ? "is-active" : "",
    pending ? "is-pending" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      aria-busy={pending}
      aria-label={
        pending
          ? "Guardando…"
          : starred
            ? "Dejar de creer en este proyecto"
            : "Creer en este proyecto"
      }
      aria-pressed={starred}
      className={className}
      disabled={disabled || pending}
      type="submit"
    >
      <span className="gallery-star__action">
        {pending ? <span aria-hidden="true" className="gallery-star__spinner" /> : <Spark />}
        {pending ? "Guardando…" : starred ? "Creo en esto" : "Creo"}
      </span>
      <span className="gallery-star__count">{starCount}</span>
    </button>
  );
}

export function GalleryStarButton({
  submissionId,
  returnTo,
  starCount,
  starred,
  interactive = true,
  disabled = false,
  size = "md",
}: {
  submissionId: string;
  returnTo: string;
  starCount: number;
  starred: boolean;
  interactive?: boolean;
  disabled?: boolean;
  size?: "md" | "lg";
}) {
  const className = [
    "gallery-star",
    size === "lg" ? "gallery-star--lg" : "",
    starred ? "is-active" : "",
    interactive ? "" : "gallery-star--readonly",
  ]
    .filter(Boolean)
    .join(" ");

  if (!interactive) {
    return (
      <span
        aria-label={starCount === 1 ? "1 persona cree en esto" : `${starCount} creen en esto`}
        className={className}
      >
        <span className="gallery-star__action">
          <Spark />
          {starred ? "Creo en esto" : "Creo"}
        </span>
        <span className="gallery-star__count">{starCount}</span>
      </span>
    );
  }

  return (
    <form action={toggleGalleryStarAction}>
      <input name="submissionId" type="hidden" value={submissionId} />
      <input name="returnTo" type="hidden" value={returnTo} />
      <GalleryStarSubmit
        disabled={disabled}
        size={size}
        starCount={starCount}
        starred={starred}
      />
    </form>
  );
}
