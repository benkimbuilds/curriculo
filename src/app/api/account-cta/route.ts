import { NextResponse } from "next/server";

import { resolvePublicAccountCta } from "@/modules/authorization/account-link";

export const dynamic = "force-dynamic";

export async function GET() {
  const cta = await resolvePublicAccountCta();
  return NextResponse.json(cta, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
