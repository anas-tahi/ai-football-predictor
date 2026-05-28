import { cacheKeys, ttlSeconds } from "@/lib/cache/keys";
import { withCache } from "@/lib/cache/redis";
import {
  getHeadToHead,
  getLastMatchesByTeam,
} from "@/lib/providers/football-data";
import { getNewsSignals } from "@/lib/providers/news";
import { computeForm } from "@/lib/prediction/form";
import { computeH2H } from "@/lib/prediction/h2h";
import { buildReasoning } from "@/lib/prediction/reasoning";
import type { Fixture, Prediction } from "@/types/domain";

const WEIGHTS = {
  form: 0.35,
  elo: 0.3,
  h2h: 0.1,
  standings: 0.2,
  news: 0.05,
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

function normalizeEloDelta(delta: number) {
  return clamp(delta / 300, -1, 1);
}

function normalizeStandingsProxy(formDelta: number) {
  return clamp(formDelta, -1, 1);
}

export async function predictFixture(fixture: Fixture): Promise<Prediction> {
  return withCache(cacheKeys.prediction(fixture.matchId), ttlSeconds.prediction, async () => {
    const [homeHistory, awayHistory, h2hHistory, homeNews, awayNews] = await Promise.all([
      getLastMatchesByTeam(fixture.homeTeam.id, 8),
      getLastMatchesByTeam(fixture.awayTeam.id, 8),
      getHeadToHead(fixture.homeTeam.id, fixture.awayTeam.id),
      getNewsSignals(fixture.homeTeam.name),
      getNewsSignals(fixture.awayTeam.name),
    ]);

    if (homeHistory.length < 5 || awayHistory.length < 5) {
      return {
        matchId: fixture.matchId,
        winner: "INSUFFICIENT_DATA",
        confidence: 0,
        probabilities: { home: 0, draw: 1, away: 0 },
        reasoning: "Insufficient data: at least 5 recent matches per team are required.",
        factorsUsed: {},
        computedAt: new Date().toISOString(),
      };
    }

    const homeForm = computeForm(fixture.homeTeam.id, fixture.homeTeam.name, homeHistory);
    const awayForm = computeForm(fixture.awayTeam.id, fixture.awayTeam.name, awayHistory);
    const h2h = computeH2H(fixture.homeTeam.id, fixture.awayTeam.id, h2hHistory);

    const homeNewsImpact = homeNews.reduce((sum, n) => sum + n.scoreImpact, 0);
    const awayNewsImpact = awayNews.reduce((sum, n) => sum + n.scoreImpact, 0);

    const formDelta = homeForm.formScore - awayForm.formScore;
    const eloDelta = normalizeEloDelta(homeForm.elo - awayForm.elo);
    const h2hDelta = h2h.h2hScoreHome - h2h.h2hScoreAway;
    const standingsDelta = normalizeStandingsProxy(formDelta * 0.6);
    const newsDelta = clamp(homeNewsImpact - awayNewsImpact, -0.5, 0.5);

    const aggregate =
      formDelta * WEIGHTS.form +
      eloDelta * WEIGHTS.elo +
      h2hDelta * WEIGHTS.h2h +
      standingsDelta * WEIGHTS.standings +
      newsDelta * WEIGHTS.news;

    const homeRaw = sigmoid(aggregate * 4);
    const awayRaw = sigmoid(-aggregate * 4);
    const drawBase = clamp(0.22 - Math.abs(aggregate) * 0.15, 0.08, 0.3);

    const total = homeRaw + awayRaw + drawBase;
    const probabilities = {
      home: homeRaw / total,
      draw: drawBase / total,
      away: awayRaw / total,
    };

    const entries = [
      ["HOME", probabilities.home] as const,
      ["DRAW", probabilities.draw] as const,
      ["AWAY", probabilities.away] as const,
    ];
    entries.sort((a, b) => b[1] - a[1]);
    const winner = entries[0][0];

    const prediction: Prediction = {
      matchId: fixture.matchId,
      winner,
      confidence: Math.round(entries[0][1] * 100),
      probabilities: {
        home: Number(probabilities.home.toFixed(4)),
        draw: Number(probabilities.draw.toFixed(4)),
        away: Number(probabilities.away.toFixed(4)),
      },
      reasoning: "",
      factorsUsed: {
        formDelta: Number(formDelta.toFixed(4)),
        eloDelta: Number(eloDelta.toFixed(4)),
        h2hDelta: Number(h2hDelta.toFixed(4)),
        standingsDelta: Number(standingsDelta.toFixed(4)),
        newsDelta: Number(newsDelta.toFixed(4)),
        aggregate: Number(aggregate.toFixed(4)),
      },
      computedAt: new Date().toISOString(),
    };

    prediction.reasoning = buildReasoning({
      prediction,
      homeForm,
      awayForm,
      h2h,
      homeNews,
      awayNews,
    });
    return prediction;
  });
}
