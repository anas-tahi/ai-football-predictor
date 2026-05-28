import Link from "next/link";
import { notFound } from "next/navigation";
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

export default async function MatchDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { date = todayIsoDate() } = await searchParams;

  const fixtures = await getFixturesByDate(date);
  const fixture = fixtures.find((m) => String(m.matchId) === id);
  if (!fixture) notFound();

  const prediction = await predictFixture(fixture);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 px-4 py-6 md:px-8">
      <Link className="text-sm underline underline-offset-4" href={`/?date=${date}`}>
        Back to matches
      </Link>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="text-xs text-[var(--muted)]">
          {fixture.competition.name} • {formatInUserTimezone(fixture.utcDate)}
        </p>
        <h1 className="mt-2 text-2xl font-bold">
          {fixture.homeTeam.name} vs {fixture.awayTeam.name}
        </h1>
        <p className="mt-3 text-sm">
          Predicted winner:{" "}
          <strong>
            {winnerLabel(prediction.winner, fixture.homeTeam.name, fixture.awayTeam.name)}
          </strong>
        </p>
        <p className="text-sm">Confidence: {prediction.confidence}%</p>
        <p className="mt-3 text-sm text-[var(--muted)]">{prediction.reasoning}</p>
      </div>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="text-lg font-semibold">Probability breakdown</h2>
        <ul className="mt-2 space-y-1 text-sm">
          <li>Home: {(prediction.probabilities.home * 100).toFixed(1)}%</li>
          <li>Draw: {(prediction.probabilities.draw * 100).toFixed(1)}%</li>
          <li>Away: {(prediction.probabilities.away * 100).toFixed(1)}%</li>
        </ul>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="text-lg font-semibold">Model factors</h2>
        <pre className="mt-2 overflow-auto rounded-md bg-slate-100 p-3 text-xs text-slate-900 dark:bg-slate-900 dark:text-slate-100">
{JSON.stringify(prediction.factorsUsed, null, 2)}
        </pre>
      </section>
    </main>
  );
}
