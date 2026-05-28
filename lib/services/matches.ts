import { getFixturesByDate } from "@/lib/providers/football-data";
import { predictFixture } from "@/lib/prediction/engine";
import type { Fixture, Prediction } from "@/types/domain";

export interface MatchWithPrediction {
  fixture: Fixture;
  prediction?: Prediction;
}

export async function getMatchesWithPredictions(date: string): Promise<MatchWithPrediction[]> {
  const fixtures = await getFixturesByDate(date);
  const predictions = await Promise.all(
    fixtures.map(async (fixture) => {
      try {
        const prediction = await predictFixture(fixture);
        return { fixture, prediction };
      } catch {
        return { fixture };
      }
    }),
  );
  return predictions;
}
