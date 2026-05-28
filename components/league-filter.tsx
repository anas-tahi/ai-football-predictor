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
    <select
      className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
      value={selected ?? "all"}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="all">All leagues</option>
      {competitions.map((c) => (
        <option key={c.id} value={c.code}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
