import Link from "next/link";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { formatInUserTimezone } from "@/lib/timezone";
import type { Fixture, Prediction } from "@/types/domain";

interface MatchCardProps {
  fixture: Fixture;
  prediction?: Prediction;
}

function labelWinner(winner: Prediction["winner"], fixture: Fixture) {
  if (winner === "HOME") return fixture.homeTeam.name;
  if (winner === "AWAY") return fixture.awayTeam.name;
  if (winner === "DRAW") return "Draw";
  return "Insufficient data";
}

export function MatchCard({ fixture, prediction }: MatchCardProps) {
  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-[var(--muted)]">
          {fixture.competition.name} ({fixture.competition.code})
        </p>
        <p className="text-xs text-[var(--muted)]">{formatInUserTimezone(fixture.utcDate)}</p>
      </div>
      <div className="mt-2">
        <h3 className="text-base font-semibold">
          {fixture.homeTeam.name} vs {fixture.awayTeam.name}
        </h3>
      </div>
      {prediction ? (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">
              Prediction: <strong>{labelWinner(prediction.winner, fixture)}</strong>
            </span>
            <ConfidenceBadge confidence={prediction.confidence} />
          </div>
          <p className="text-sm text-[var(--muted)]">{prediction.reasoning}</p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-[var(--muted)]">
          Prediction unavailable while data is loading.
        </p>
      )}

      <div className="mt-4">
        <Link className="text-sm font-medium underline underline-offset-4" href={`/match/${fixture.matchId}`}>
          View analysis
        </Link>
      </div>
    </article>
  );
}
