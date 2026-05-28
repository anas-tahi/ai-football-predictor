interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="glass-panel rounded-[28px] border border-dashed p-8 text-center sm:p-12">
      <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full border border-white/10 bg-white/5 text-4xl shadow-[0_0_50px_rgba(124,249,176,0.16)]">
        ⚽
      </div>
      <h3 className="mt-5 text-2xl font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{description}</p>
    </div>
  );
}
