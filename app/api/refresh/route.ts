import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getMatchesWithPredictions } from "@/lib/services/matches";
import { todayIsoDate } from "@/lib/timezone";

function isAuthorized(request: NextRequest) {
  const bearer = request.headers.get("authorization");
  if (!env.CRON_SECRET) return false;
  return bearer === `Bearer ${env.CRON_SECRET}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const date = request.nextUrl.searchParams.get("date") ?? todayIsoDate();
  const matches = await getMatchesWithPredictions(date);
  return NextResponse.json({
    ok: true,
    date,
    refreshedMatches: matches.length,
    refreshedAt: new Date().toISOString(),
  });
}
