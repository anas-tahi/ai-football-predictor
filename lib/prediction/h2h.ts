import type { Fixture, H2HStats } from "@/types/domain";

export function computeH2H(homeTeamId: number, awayTeamId: number, matches: Fixture[]): H2HStats {
  let homeWins = 0;
  let awayWins = 0;
  let draws = 0;

  for (const match of matches) {
    const homeGoals = match.score?.home ?? null;
    const awayGoals = match.score?.away ?? null;
    if (homeGoals === null || awayGoals === null) continue;
    if (homeGoals > awayGoals) homeWins += 1;
    else if (awayGoals > homeGoals) awayWins += 1;
    else draws += 1;
  }

  const considered = homeWins + awayWins + draws;
  const h2hScoreHome = considered > 0 ? (homeWins + draws * 0.5) / considered : 0.5;
  const h2hScoreAway = considered > 0 ? (awayWins + draws * 0.5) / considered : 0.5;

  return {
    homeTeamId,
    awayTeamId,
    matchesConsidered: considered,
    homeWins,
    awayWins,
    draws,
    h2hScoreHome,
    h2hScoreAway,
  };
}
