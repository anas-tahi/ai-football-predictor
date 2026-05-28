import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, Trophy } from "lucide-react";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { getFixturesByDate } from "@/lib/providers/football-data";
import { predictFixture } from "@/lib/prediction/engine";
import { formatInUserTimezone, todayIsoDate } from "@/lib/timezone";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
}

function winnerLabel(
  winner: "HOME" | "AWAY" | "DRAW" | "INSUFFICIENT_DATA",
  homeName: string,
  awayName: string,
) {
  if (winner === "HOME") return homeName;
  if (winner === "AWAY") return awayName;
  if (winner === "DRAW") return "Draw";
  return "Insufficient data";
}

function clampPercent(value: number) {
  return Math.max(8, Math.min(100, Math.abs(value) * 100));
}

function factorRows(factorsUsed: Record<string, number>) {
  return [
    { key: "formDelta", label: "Form", value: factorsUsed.formDelta ?? 0 },
    { key: "eloDelta", label: "ELO", value: factorsUsed.eloDelta ?? 0 },
    { key: "h2hDelta", label: "Head-to-head", value: factorsUsed.h2hDelta ?? 0 },
    { key: "standingsDelta", label: "Standings", value: factorsUsed.standingsDelta ?? 0 },
    { key: "newsDelta", label: "News", value: factorsUsed.newsDelta ?? 0 },
  ];
}

function teamInitials(name: string, fallback?: string) {
  if (fallback) return fallback;
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function TeamCrest({
  name,
  crest,
  tla,
}: {
  name: string;
  crest?: string;
  tla?: string;
}) {
  if (crest) {
    return (
      <Image
        alt={`${name} crest`}
        className="h-20 w-20 rounded-full border border-white/10 bg-slate-950/60 object-contain p-3 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:h-24 sm:w-24"
        height={96}
        sizes="(max-width: 640px) 80px, 96px"
        src={crest}
        unoptimized
        width={96}
      />
    );
  }

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/6 text-lg font-bold tracking-[0.24em] text-white/86 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:h-24 sm:w-24">
      {teamInitials(name, tla)}
    </div>
  );
}

export default async function MatchDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { date = todayIsoDate() } = await searchParams;

  const fixtures = await getFixturesByDate(date);
  const fixture = fixtures.find((m) => String(m.matchId) === id);
  if (!fixture) notFound();

  const prediction = await predictFixture(fixture);
  const factors = factorRows(prediction.factorsUsed);

  return (
    <main className="surface-grid mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <Link
        className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-white/90 hover:border-[var(--accent)] hover:text-[var(--accent)]"
        href={`/?date=${date}`}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to matches
      </Link>

      <section className="glass-panel rounded-[32px] px-5 py-6 sm:px-7 sm:py-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
                <Trophy className="h-4 w-4 text-[var(--accent)]" />
                {fixture.competition.name}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
                <Clock3 className="h-4 w-4 text-[var(--accent)]" />
                {formatInUserTimezone(fixture.utcDate)}
              </span>
            </div>

            <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
              <div className="text-center sm:text-left">
                <div className="flex justify-center sm:justify-start">
                  <TeamCrest
                    crest={fixture.homeTeam.crest}
                    name={fixture.homeTeam.name}
                    tla={fixture.homeTeam.tla}
                  />
                </div>
                <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                  {fixture.homeTeam.name}
                </h1>
              </div>
              <div className="display-font text-center text-4xl text-white/32 sm:text-6xl">vs</div>
              <div className="text-center sm:text-right">
                <div className="flex justify-center sm:justify-end">
                  <TeamCrest
                    crest={fixture.awayTeam.crest}
                    name={fixture.awayTeam.name}
                    tla={fixture.awayTeam.tla}
                  />
                </div>
                <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                  {fixture.awayTeam.name}
                </h1>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-black/18 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              Predicted winner
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {winnerLabel(prediction.winner, fixture.homeTeam.name, fixture.awayTeam.name)}
            </p>
            <div className="mt-4">
              <ConfidenceBadge confidence={prediction.confidence} />
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{prediction.reasoning}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel rounded-[28px] p-5 sm:p-6">
          <h2 className="text-2xl font-semibold text-white">Factor breakdown</h2>
          <div className="mt-6 space-y-4">
            {factors.map((factor) => {
              const favorsHome = factor.value >= 0;
              return (
                <div key={factor.key} className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white">{factor.label}</p>
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                      Favors {favorsHome ? fixture.homeTeam.name : fixture.awayTeam.name}
                    </p>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/8">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${
                        favorsHome
                          ? "from-emerald-500 via-[var(--accent)] to-cyan-300"
                          : "from-rose-500 via-orange-400 to-amber-300"
                      }`}
                      style={{ width: `${clampPercent(factor.value)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <section className="glass-panel rounded-[28px] p-5 sm:p-6">
            <h2 className="text-2xl font-semibold text-white">Probability split</h2>
            <div className="mt-6 space-y-4">
              {[
                { label: fixture.homeTeam.name, value: prediction.probabilities.home, tone: "from-emerald-500 to-cyan-300" },
                { label: "Draw", value: prediction.probabilities.draw, tone: "from-amber-500 to-yellow-300" },
                { label: fixture.awayTeam.name, value: prediction.probabilities.away, tone: "from-rose-500 to-orange-300" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="text-white">{item.label}</span>
                    <span className="font-semibold text-[var(--muted)]">
                      {(item.value * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/8">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.tone}`}
                      style={{ width: `${(item.value * 100).toFixed(1)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel rounded-[28px] p-5 sm:p-6">
            <h2 className="text-2xl font-semibold text-white">Narrative reasoning</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{prediction.reasoning}</p>
          </section>
        </div>
      </section>
    </main>
  );
}
