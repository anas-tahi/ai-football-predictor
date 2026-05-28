export const cacheKeys = {
  fixtures: (date: string) => `fixtures:${date}`,
  standings: (competitionId: number, season: string) =>
    `standings:${competitionId}:${season}`,
  teamForm: (teamId: number) => `teamForm:${teamId}`,
  h2h: (homeId: number, awayId: number) => `h2h:${homeId}:${awayId}`,
  prediction: (matchId: number) => `prediction:${matchId}`,
  news: (teamName: string) => `news:${teamName.toLowerCase()}`,
};

export const ttlSeconds = {
  fixtures: 60 * 60 * 3,
  standings: 60 * 60 * 12,
  teamForm: 60 * 60 * 12,
  h2h: 60 * 60 * 24,
  prediction: 60 * 60 * 6,
  news: 60 * 60 * 4,
};
