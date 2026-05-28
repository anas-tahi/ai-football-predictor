"use client";

import { useRouter, useSearchParams } from "next/navigation";

function addDays(base: string, days: number) {
  const date = new Date(`${base}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function DateNav({ currentDate }: { currentDate: string }) {
  const router = useRouter();
  const params = useSearchParams();

  const setDate = (date: string) => {
    const next = new URLSearchParams(params.toString());
    next.set("date", date);
    router.push(`/?${next.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm"
        onClick={() => setDate(addDays(currentDate, -1))}
      >
        Previous
      </button>
      <input
        type="date"
        className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm"
        value={currentDate}
        onChange={(e) => setDate(e.target.value)}
      />
      <button
        className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm"
        onClick={() => setDate(addDays(currentDate, 1))}
      >
        Next
      </button>
    </div>
  );
}
