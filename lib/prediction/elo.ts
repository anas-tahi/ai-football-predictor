export function expectedScore(ratingA: number, ratingB: number) {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

export function updateElo(rating: number, expected: number, actual: number, k = 20) {
  return rating + k * (actual - expected);
}

export function goalDiffMultiplier(goalDiff: number) {
  return Math.log2(Math.max(1, goalDiff) + 1);
}
