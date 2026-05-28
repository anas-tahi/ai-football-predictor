import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, Shield } from "lucide-react";
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

function teamInitials(name: string, fallback?: string) {
  if (fallback) return fallback;
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function Crest({ name, crest, tla }: { name: string; crest?: string; tla?: string }) {
  if (crest) {
    return (
      <Image
        alt={`${name} crest`}
        className="h-14 w-14 rounded-full border border-white/10 bg-slate-950/70 object-contain p-2 shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
        height={56}
        loading="lazy"
        sizes="56px"
        src={crest}
        unoptimized
        width={56}
      />
    );
  }

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/6 text-sm font-bold tracking-[0.24em] text-white/80 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
      {teamInitials(name, tla)}
    </div>
  );
}

export function MatchCard({ fixture, prediction }: MatchCardProps) {
  const winner = prediction ? labelWinner(prediction.winner, fixture) : "Model pending";

  return (
    <article className="glass-panel group rounded-[28px] p-5 transition duration-200 hover:-translate-y-1.5 hover:border-[var(--border-strong)] hover:shadow-[0_24px_70px_rgba(3,10,24,0.58)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            {fixture.competition.code}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">{fixture.competition.name}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/6 px-3 py-2 text-right">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">Kickoff</p>
          <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-white">
            <Clock3 className="h-4 w-4 text-[var(--accent)]" />
            {formatInUserTimezone(fixture.utcDate)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="min-w-0 text-center sm:text-left">
          <div className="flex justify-center sm:justify-start">
            <Crest
              crest={fixture.homeTeam.crest}
              name={fixture.homeTeam.name}
              tla={fixture.homeTeam.tla}
            />
          </div>
          <h3 className="mt-3 line-clamp-2 text-lg font-semibold text-white sm:text-xl">
            {fixture.homeTeam.name}
          </h3>
        </div>
        <div className="display-font text-center text-3xl text-white/38 sm:text-4xl">vs</div>
        <div className="min-w-0 text-center sm:text-right">
          <div className="flex justify-center sm:justify-end">
            <Crest
              crest={fixture.awayTeam.crest}
              name={fixture.awayTeam.name}
              tla={fixture.awayTeam.tla}
            />
          </div>
          <h3 className="mt-3 line-clamp-2 text-lg font-semibold text-white sm:text-xl">
            {fixture.awayTeam.name}
          </h3>
        </div>
      </div>

      {prediction ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-[22px] border border-white/10 bg-black/16 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                  Model pick
                </p>
                <p className="mt-1 text-xl font-semibold text-white">{winner}</p>
              </div>
              <Shield className="mt-1 h-5 w-5 text-[var(--accent)]" />
            </div>
            <div className="mt-4">
              <ConfidenceBadge confidence={prediction.confidence} compact />
            </div>
          </div>

          <p className="line-clamp-2 text-sm leading-6 text-[var(--muted)]">{prediction.reasoning}</p>
        </div>
      ) : (
        <p className="mt-6 text-sm text-[var(--muted)]">
          Prediction unavailable while data is loading.
        </p>
      )}

      <div className="mt-6">
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-medium text-white hover:border-[var(--accent)] hover:text-[var(--accent)]"
          href={`/match/${fixture.matchId}`}
        >
          View analysis
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
