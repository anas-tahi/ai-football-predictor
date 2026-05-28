"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface LeagueFilterProps {
  competitions: Array<{ id: number; name: string; code: string }>;
  selected?: string;
}

export function LeagueFilter({ competitions, selected }: LeagueFilterProps) {
  const router = useRouter();
  const params = useSearchParams();

  const onChange = (value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value === "all") next.delete("league");
    else next.set("league", value);
    router.push(`/?${next.toString()}`);
  };

  return (
    <div
      aria-label="League filters"
      className="soft-scrollbar flex gap-2 overflow-x-auto pb-1"
      role="group"
    >
      <button
        aria-label="Show all leagues"
        aria-pressed={!selected}
        className={`rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap ${
          !selected
            ? "border-[var(--accent)] bg-[var(--accent)] text-slate-950"
            : "border-[var(--border)] bg-white/6 text-white/82 hover:bg-white/10"
        }`}
        onClick={() => onChange("all")}
        type="button"
      >
        All leagues
      </button>
      {competitions.map((competition) => {
        const active = selected === competition.code;
        return (
          <button
            key={competition.id}
            aria-label={`Filter by ${competition.name}`}
            aria-pressed={active}
            className={`rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap ${
              active
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] shadow-[0_0_30px_rgba(124,249,176,0.12)]"
                : "border-[var(--border)] bg-white/6 text-white/82 hover:bg-white/10"
            }`}
            onClick={() => onChange(competition.code)}
            type="button"
          >
            {competition.code}
          </button>
        );
      })}
    </div>
  );
}
