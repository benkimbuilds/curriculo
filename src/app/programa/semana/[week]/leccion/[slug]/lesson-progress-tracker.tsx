"use client";

import { startTransition, useEffect, useRef } from "react";

import { recordLessonViewAction } from "../../../../actions";

export function LessonProgressTracker({ enrollmentId, lessonId, week, contentVersion, initialPosition }: { enrollmentId: string; lessonId: string; week: number; contentVersion: string; initialPosition: number }) {
  const lastSaved = useRef(initialPosition);
  useEffect(() => {
    const save = (position: number) => {
      if (Math.abs(position - lastSaved.current) < 5 && position !== 0) return;
      lastSaved.current = position;
      startTransition(() => { void recordLessonViewAction({ enrollmentId, lessonId, week, contentVersion, resumePosition: position }); });
    };
    save(initialPosition);
    const onScroll = () => {
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      const position = maximum > 0 ? Math.round((window.scrollY / maximum) * 100) : 100;
      save(position);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); onScroll(); };
  }, [contentVersion, enrollmentId, initialPosition, lessonId, week]);
  return initialPosition > 5 ? <p className="resume-note">Retomaste esta lección cerca del {initialPosition}%.</p> : null;
}
