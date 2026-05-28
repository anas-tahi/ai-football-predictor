import { cn } from "@/lib/utils";

interface ConfidenceBadgeProps {
  confidence: number;
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const band =
    confidence >= 65 ? "high" : confidence >= 45 ? "medium" : "low";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        band === "high" && "bg-[var(--badge-high)]",
        band === "medium" && "bg-[var(--badge-mid)]",
        band === "low" && "bg-[var(--badge-low)]",
      )}
    >
      {confidence}% confidence
    </span>
  );
}
