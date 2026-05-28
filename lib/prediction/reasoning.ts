import type { Prediction, TeamFormStats, NewsSignal, H2HStats } from "@/types/domain";

function pct(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function buildReasoning(params: {
  prediction: Prediction;
  homeForm: TeamFormStats;
  awayForm: TeamFormStats;
  h2h: H2HStats;
  homeNews: NewsSignal[];
  awayNews: NewsSignal[];
}) {
  const { prediction, homeForm, awayForm, h2h, homeNews, awayNews } = params;

  if (prediction.winner === "INSUFFICIENT_DATA") {
    return "Insufficient historical signals to produce a reliable prediction.";
  }

  const reasons: string[] = [];

  if (homeForm.formScore !== awayForm.formScore) {
    const stronger = homeForm.formScore > awayForm.formScore ? homeForm.teamName : awayForm.teamName;
    reasons.push(`${stronger} has the stronger recent form trend.`);
  }

  if (Math.abs(homeForm.elo - awayForm.elo) > 25) {
    const stronger = homeForm.elo > awayForm.elo ? homeForm.teamName : awayForm.teamName;
    reasons.push(`${stronger} carries a stronger ELO-style performance rating.`);
  }

  if (h2h.matchesConsidered > 0) {
    reasons.push(
      `Recent head-to-head edge: ${homeForm.teamName} ${pct(h2h.h2hScoreHome)} vs ${awayForm.teamName} ${pct(h2h.h2hScoreAway)}.`,
    );
  }

  const homeImpact = homeNews.reduce((acc, n) => acc + n.scoreImpact, 0);
  const awayImpact = awayNews.reduce((acc, n) => acc + n.scoreImpact, 0);
  if (homeImpact !== awayImpact) {
    const better = homeImpact > awayImpact ? homeForm.teamName : awayForm.teamName;
    reasons.push(`Recent team news slightly favors ${better}.`);
  }

  if (!reasons.length) {
    reasons.push("Model signals are closely balanced with no dominant edge.");
  }

  return reasons.slice(0, 3).join(" ");
}
