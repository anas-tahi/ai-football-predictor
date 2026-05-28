import type { Fixture, TeamFormStats } from "@/types/domain";
import { expectedScore, goalDiffMultiplier, updateElo } from "@/lib/prediction/elo";

function getPoints(goalsFor: number, goalsAgainst: number) {
  if (goalsFor > goalsAgainst) return 3;
  if (goalsFor === goalsAgainst) return 1;
  return 0;
}

export function computeForm(teamId: number, teamName: string, matches: Fixture[]): TeamFormStats {
  let points = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;
  let formWeighted = 0;
  let totalWeight = 0;
  let elo = 1500;

  matches.forEach((match, index) => {
    const isHome = match.homeTeam.id === teamId;
    const gf = isHome ? (match.score?.home ?? 0) : (match.score?.away ?? 0);
    const ga = isHome ? (match.score?.away ?? 0) : (match.score?.home ?? 0);

    const pointsForMatch = getPoints(gf, ga);
    points += pointsForMatch;
    goalsFor += gf;
    goalsAgainst += ga;

    const weight = Math.max(1, matches.length - index);
    formWeighted += (pointsForMatch / 3) * weight;
    totalWeight += weight;

    const actual = pointsForMatch === 3 ? 1 : pointsForMatch === 1 ? 0.5 : 0;
    const expected = expectedScore(elo, 1500);
    elo = updateElo(elo, expected, actual, 20 * goalDiffMultiplier(Math.abs(gf - ga)));
  });

  const formScore = totalWeight > 0 ? formWeighted / totalWeight : 0;

  return {
    teamId,
    teamName,
    matchesConsidered: matches.length,
    points,
    goalsFor,
    goalsAgainst,
    formScore,
    elo,
  };
}
