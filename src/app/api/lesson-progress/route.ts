import { NextResponse } from "next/server";

import { getCurrentSession } from "@/modules/auth/session";
import { recordStudentLessonView } from "@/app/programa/student-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const currentSession = await getCurrentSession();
  if (!currentSession?.user.emailVerified) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: {
    enrollmentId?: string;
    lessonId?: string;
    week?: number;
    contentVersion?: string;
    resumePosition?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const enrollmentId = String(body.enrollmentId ?? "");
  const lessonId = String(body.lessonId ?? "");
  const contentVersion = String(body.contentVersion ?? "");
  const week = Number(body.week);
  if (!enrollmentId || !lessonId || !contentVersion || !Number.isInteger(week)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    await recordStudentLessonView({
      userId: currentSession.user.id,
      enrollmentId,
      lessonId,
      week,
      contentVersion,
      resumePosition: body.resumePosition,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
