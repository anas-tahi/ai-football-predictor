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
    <main className="surface-grid mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-5 sm:px-6 lg:px-8">
      <header className="glass-panel rounded-[32px] px-5 py-6 sm:px-7 sm:py-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[var(--accent)]">
              Match intelligence
            </p>
            <div className="space-y-3">
              <h1 className="display-font text-balance text-5xl leading-none text-white sm:text-6xl md:text-7xl">
                AI Football Predictor
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Daily football predictions with a premium matchday view, confidence signals, and
                transparent reasoning built from form, ELO, head-to-head, standings, and news.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">Date</p>
              <p className="mt-2 text-xl font-semibold text-white">{date}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">Matches</p>
              <p className="mt-2 text-xl font-semibold text-white">{matches.length}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/6 p-4 col-span-2 sm:col-span-1">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">Leagues</p>
              <p className="mt-2 text-xl font-semibold text-white">{competitions.length}</p>
            </div>
          </div>
        </div>

        {!featureFlags.hasFootballApiKey && (
          <div className="mt-5 rounded-[24px] border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
            Add <code>FOOTBALL_DATA_API_KEY</code> to load live fixtures and predictions.
          </div>
        )}
      </header>

      <section className="sticky top-3 z-20">
        <div className="glass-panel rounded-[28px] px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <DateNav currentDate={date} />
            <LeagueFilter
              competitions={competitions.map((c) => ({ id: c.id, code: c.code, name: c.name }))}
              selected={selectedLeague}
            />
          </div>
        </div>
      </section>

      {matches.length === 0 ? (
        <EmptyState
          title="No upcoming matches found"
          description="Try another date or league filter. When live data is connected, this view fills with the next available fixture slate."
        />
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {matches.map(({ fixture, prediction }) => (
            <MatchCard key={fixture.matchId} fixture={fixture} prediction={prediction} />
          ))}
        </section>
      )}
    </main>
  );
}
