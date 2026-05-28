import { DateNav } from "@/components/date-nav";
import { EmptyState } from "@/components/empty-state";
import { LeagueFilter } from "@/components/league-filter";
import { MatchCard } from "@/components/match-card";
import { featureFlags } from "@/lib/env";
import { getMatchesWithPredictions } from "@/lib/services/matches";
import { todayIsoDate } from "@/lib/timezone";

interface HomeProps {
  searchParams: Promise<{ date?: string; league?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const date = params.date ?? todayIsoDate();
  const selectedLeague = params.league;

  const all = await getMatchesWithPredictions(date);
  const competitions = Array.from(
    new Map(all.map((x) => [x.fixture.competition.id, x.fixture.competition])).values(),
  );
  const matches = selectedLeague
    ? all.filter((m) => m.fixture.competition.code === selectedLeague)
    : all;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:px-8">
      <header className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">AI Football Predictor</h1>
        <p className="text-sm text-[var(--muted)]">
          Daily match predictions using form, ELO, head-to-head, standings proxy, and team news.
        </p>
        {!featureFlags.hasFootballApiKey && (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            Add <code>FOOTBALL_DATA_API_KEY</code> to load live fixtures and predictions.
          </div>
        )}
      </header>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <DateNav currentDate={date} />
        <LeagueFilter
          competitions={competitions.map((c) => ({ id: c.id, code: c.code, name: c.name }))}
          selected={selectedLeague}
        />
      </div>

      {matches.length === 0 ? (
        <EmptyState
          title="No upcoming matches found"
          description="Try another date or league. If this is a fresh setup, add API keys and trigger refresh."
        />
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {matches.map(({ fixture, prediction }) => (
            <MatchCard key={fixture.matchId} fixture={fixture} prediction={prediction} />
          ))}
        </section>
      )}
    </main>
  );
}
