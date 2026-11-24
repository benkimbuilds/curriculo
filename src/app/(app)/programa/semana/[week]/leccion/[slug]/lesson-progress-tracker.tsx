"use client";

import { useEffect, useRef } from "react";

const SAVE_THRESHOLD = 5;
const SCROLL_DEBOUNCE_MS = 1200;

function persistLessonProgress(input: {
  enrollmentId: string;
  lessonId: string;
  week: number;
  contentVersion: string;
  resumePosition: number;
}) {
  void fetch("/api/lesson-progress", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
    keepalive: true,
  });
}

export function LessonProgressTracker({
  enrollmentId,
  lessonId,
  week,
  contentVersion,
  initialPosition,
}: {
  enrollmentId: string;
  lessonId: string;
  week: number;
  contentVersion: string;
  initialPosition: number;
}) {
  const lastSaved = useRef(initialPosition);
  const trackedLesson = useRef<string | null>(null);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const lessonKey = `${enrollmentId}:${contentVersion}:${lessonId}`;
    if (trackedLesson.current !== lessonKey) {
      trackedLesson.current = lessonKey;
      lastSaved.current = initialPosition;
      persistLessonProgress({
        enrollmentId,
        lessonId,
        week,
        contentVersion,
        resumePosition: lastSaved.current,
      });
    }

    const persist = (position: number) => {
      const clamped = Math.max(0, Math.min(100, Math.round(position)));
      if (Math.abs(clamped - lastSaved.current) < SAVE_THRESHOLD) return;
      lastSaved.current = clamped;
      persistLessonProgress({
        enrollmentId,
        lessonId,
        week,
        contentVersion,
        resumePosition: clamped,
      });
    };

    const onScroll = () => {
      if (pendingTimer.current) clearTimeout(pendingTimer.current);
      pendingTimer.current = setTimeout(() => {
        const maximum = document.documentElement.scrollHeight - window.innerHeight;
        const position = maximum > 0 ? Math.round((window.scrollY / maximum) * 100) : 100;
        persist(position);
      }, SCROLL_DEBOUNCE_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (pendingTimer.current) clearTimeout(pendingTimer.current);
    };
    // initialPosition only seeds the first save for a lesson key; refreshes must not re-fire.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [contentVersion, enrollmentId, lessonId, week]);

  return initialPosition > 5 ? <p className="resume-note">Retomaste esta lección cerca del {initialPosition}%.</p> : null;
}
