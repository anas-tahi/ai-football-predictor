import { NextRequest, NextResponse } from "next/server";
import { getMatchesWithPredictions } from "@/lib/services/matches";
import { todayIsoDate } from "@/lib/timezone";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ?? todayIsoDate();
  const league = request.nextUrl.searchParams.get("league");

  const matches = await getMatchesWithPredictions(date);
  const filtered = league
    ? matches.filter((m) => m.fixture.competition.code === league)
    : matches;

  return NextResponse.json({ date, count: filtered.length, matches: filtered });
}
