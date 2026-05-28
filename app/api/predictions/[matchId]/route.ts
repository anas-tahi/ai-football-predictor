import { NextRequest, NextResponse } from "next/server";
import { getFixturesByDate } from "@/lib/providers/football-data";
import { todayIsoDate } from "@/lib/timezone";
import { predictFixture } from "@/lib/prediction/engine";

interface Params {
  params: Promise<{ matchId: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { matchId } = await params;
  const date = request.nextUrl.searchParams.get("date") ?? todayIsoDate();
  const fixtures = await getFixturesByDate(date);
  const fixture = fixtures.find((m) => String(m.matchId) === matchId);

  if (!fixture) {
    return NextResponse.json({ error: "Match not found for selected date" }, { status: 404 });
  }

  const prediction = await predictFixture(fixture);
  return NextResponse.json({ matchId, prediction });
}
