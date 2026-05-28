import { featureFlags, env } from "@/lib/env";
import { cacheKeys, ttlSeconds } from "@/lib/cache/keys";
import { withCache } from "@/lib/cache/redis";
import type { Fixture } from "@/types/domain";

const BASE_URL = "https://api.football-data.org/v4";

interface FootballDataMatch {
  id: number;
  utcDate: string;
  status: string;
  competition: { id: number; code: string; name: string; area?: { name?: string } };
  homeTeam: { id: number; name: string; shortName?: string; tla?: string; crest?: string };
  awayTeam: { id: number; name: string; shortName?: string; tla?: string; crest?: string };
  score?: { fullTime?: { home?: number | null; away?: number | null } };
}

async function footballFetch<T>(path: string): Promise<T> {
  if (!featureFlags.hasFootballApiKey) {
    throw new Error("FOOTBALL_DATA_API_KEY missing");
  }

  const execute = async () =>
    fetch(`${BASE_URL}${path}`, {
      headers: {
        "X-Auth-Token": env.FOOTBALL_DATA_API_KEY!,
      },
      next: { revalidate: 60 * 60 },
    });

  let response = await execute();
  if (response.status === 429) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    response = await execute();
  }

  if (!response.ok) {
    throw new Error(`football-data error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function mapMatch(match: FootballDataMatch): Fixture {
  return {
    matchId: match.id,
    competition: {
      id: match.competition.id,
      code: match.competition.code,
      name: match.competition.name,
      areaName: match.competition.area?.name,
    },
    utcDate: match.utcDate,
    status: match.status,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    score: {
      home: match.score?.fullTime?.home ?? null,
      away: match.score?.fullTime?.away ?? null,
    },
  };
}

export async function getFixturesByDate(date: string): Promise<Fixture[]> {
  if (!featureFlags.hasFootballApiKey) return [];

  try {
    return await withCache(cacheKeys.fixtures(date), ttlSeconds.fixtures, async () => {
      const data = await footballFetch<{ matches: FootballDataMatch[] }>(
        `/matches?dateFrom=${date}&dateTo=${date}&status=SCHEDULED`,
      );
      return data.matches.map(mapMatch);
    });
  } catch {
    return [];
  }
}

export async function getLastMatchesByTeam(teamId: number, limit = 8): Promise<Fixture[]> {
  if (!featureFlags.hasFootballApiKey) return [];
  return withCache(cacheKeys.teamForm(teamId), ttlSeconds.teamForm, async () => {
    const data = await footballFetch<{ matches: FootballDataMatch[] }>(
      `/teams/${teamId}/matches?status=FINISHED&limit=${Math.max(5, Math.min(limit, 10))}`,
    );
    return data.matches.map(mapMatch);
  });
}

export async function getHeadToHead(homeTeamId: number, awayTeamId: number): Promise<Fixture[]> {
  if (!featureFlags.hasFootballApiKey) return [];
  return withCache(cacheKeys.h2h(homeTeamId, awayTeamId), ttlSeconds.h2h, async () => {
    const data = await footballFetch<{ matches: FootballDataMatch[] }>(
      `/matches?status=FINISHED&limit=8&homeTeam=${homeTeamId}&awayTeam=${awayTeamId}`,
    );
    return data.matches.map(mapMatch);
  });
}
