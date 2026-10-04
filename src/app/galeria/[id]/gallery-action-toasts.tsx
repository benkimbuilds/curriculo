"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function GalleryActionToasts({
  feedbackSubmitted = false,
  reported = false,
  starred = false,
  ownStarBlocked = false,
  commentPosted = false,
  commentRemoved = false,
  commentError = false,
  projectId,
  listOnly = false,
}: {
  feedbackSubmitted?: boolean;
  reported?: boolean;
  starred?: boolean;
  ownStarBlocked?: boolean;
  commentPosted?: boolean;
  commentRemoved?: boolean;
  commentError?: boolean;
  projectId?: string;
  listOnly?: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    const hasToast =
      feedbackSubmitted ||
      reported ||
      starred ||
      ownStarBlocked ||
      commentPosted ||
      commentRemoved ||
      commentError;
    if (!hasToast) return;
    if (feedbackSubmitted) toast.success("Revisión enviada", { id: "gallery-feedback" });
    if (reported) toast.success("Reporte recibido", { id: "gallery-report" });
    if (starred) toast.success("Proyecto destacado", { id: "gallery-star" });
    if (ownStarBlocked) toast.message("No puedes destacar tu propio proyecto", { id: "gallery-star-own" });
    if (commentPosted) toast.success("Comentario publicado", { id: "gallery-comment" });
    if (commentRemoved) toast.success("Comentario eliminado", { id: "gallery-comment-removed" });
    if (commentError) toast.error("No se pudo publicar el comentario", { id: "gallery-comment-error" });
    router.replace(listOnly || !projectId ? "/galeria" : `/galeria/${projectId}`);
  }, [
    feedbackSubmitted,
    reported,
    starred,
    ownStarBlocked,
    commentPosted,
    commentRemoved,
    commentError,
    projectId,
    listOnly,
    router,
  ]);

  return null;
}
