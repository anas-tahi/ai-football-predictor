export type PredictionOutcome = "HOME" | "AWAY" | "DRAW" | "INSUFFICIENT_DATA";

export interface TeamRef {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
  crest?: string;
}

export interface Competition {
  id: number;
  code: string;
  name: string;
  areaName?: string;
}

export interface Fixture {
  matchId: number;
  competition: Competition;
  utcDate: string;
  status: string;
  homeTeam: TeamRef;
  awayTeam: TeamRef;
  score?: {
    home?: number | null;
    away?: number | null;
  };
}

export interface TeamFormStats {
  teamId: number;
  teamName: string;
  matchesConsidered: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  formScore: number;
  elo: number;
}

export interface H2HStats {
  homeTeamId: number;
  awayTeamId: number;
  matchesConsidered: number;
  homeWins: number;
  awayWins: number;
  draws: number;
  h2hScoreHome: number;
  h2hScoreAway: number;
}

export interface NewsSignal {
  teamName: string;
  scoreImpact: number;
  summary: string;
  source: "newsapi" | "rss";
}

export interface Prediction {
  matchId: number;
  winner: PredictionOutcome;
  confidence: number;
  probabilities: {
    home: number;
    draw: number;
    away: number;
  };
  reasoning: string;
  factorsUsed: Record<string, number>;
  computedAt: string;
}
