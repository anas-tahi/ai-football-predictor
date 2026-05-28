"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/6 p-1 shadow-[0_14px_40px_rgba(0,0,0,0.28)]">
        <button
          aria-label="View previous day"
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-white/88 hover:bg-white/8"
          onClick={() => setDate(addDays(currentDate, -1))}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>
        <button
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-[#9effc8]"
          onClick={() => setDate(new Date().toISOString().slice(0, 10))}
          type="button"
        >
          Today
        </button>
        <button
          aria-label="View next day"
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-white/88 hover:bg-white/8"
          onClick={() => setDate(addDays(currentDate, 1))}
          type="button"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white/6 px-4 py-3 text-sm text-white/90 shadow-[0_14px_40px_rgba(0,0,0,0.24)]">
        <CalendarDays className="h-4 w-4 text-[var(--accent)]" />
        <span className="sr-only">Choose fixture date</span>
        <input
          type="date"
          aria-label="Choose fixture date"
          className="[color-scheme:dark] bg-transparent text-sm text-white outline-none"
          value={currentDate}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
    </div>
  );
}
