import { cn } from "@/lib/utils";

interface ConfidenceBadgeProps {
  confidence: number;
  compact?: boolean;
}

function getBand(confidence: number) {
  if (confidence > 60) {
    return {
      label: "High confidence",
      pill: "border-emerald-400/30 bg-emerald-400/12 text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.2)]",
      bar: "from-emerald-500 via-emerald-400 to-lime-300",
    };
  }

  if (confidence >= 40) {
    return {
      label: "Medium confidence",
      pill: "border-amber-400/30 bg-amber-300/12 text-amber-100 shadow-[0_0_30px_rgba(245,158,11,0.18)]",
      bar: "from-amber-500 via-yellow-400 to-orange-300",
    };
  }

  return {
    label: "Low confidence",
    pill: "border-rose-400/30 bg-rose-400/12 text-rose-100 shadow-[0_0_30px_rgba(244,63,94,0.16)]",
    bar: "from-rose-600 via-rose-500 to-red-300",
  };
}

export function ConfidenceBadge({ confidence, compact = false }: ConfidenceBadgeProps) {
  const band = getBand(confidence);

  return (
    <div className="space-y-2">
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]",
          band.pill,
        )}
      >
        {compact ? `${confidence}%` : `${band.label} · ${confidence}%`}
      </span>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/8">
        <div
          aria-hidden="true"
          className={cn("h-full rounded-full bg-gradient-to-r", band.bar)}
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );
}
