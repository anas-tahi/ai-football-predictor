function CardSkeleton() {
  return (
    <div className="glass-panel animate-pulse rounded-[28px] p-5">
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 rounded-full bg-white/10" />
        <div className="h-4 w-24 rounded-full bg-white/10" />
      </div>
      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="space-y-3">
          <div className="h-14 w-14 rounded-full bg-white/10" />
          <div className="h-5 w-28 rounded-full bg-white/10" />
        </div>
        <div className="h-8 w-10 rounded-full bg-white/10" />
        <div className="flex flex-col items-end space-y-3">
          <div className="h-14 w-14 rounded-full bg-white/10" />
          <div className="h-5 w-28 rounded-full bg-white/10" />
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <div className="h-5 w-40 rounded-full bg-white/10" />
        <div className="h-2.5 w-full rounded-full bg-white/10" />
        <div className="h-4 w-full rounded-full bg-white/10" />
        <div className="h-4 w-3/4 rounded-full bg-white/10" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main className="surface-grid mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-5 sm:px-6 lg:px-8">
      <section className="glass-panel animate-pulse rounded-[32px] px-5 py-6 sm:px-7 sm:py-8">
        <div className="h-4 w-36 rounded-full bg-white/10" />
        <div className="mt-4 h-16 w-72 rounded-[20px] bg-white/10" />
        <div className="mt-4 h-5 w-full max-w-2xl rounded-full bg-white/10" />
      </section>
      <section className="glass-panel animate-pulse rounded-[28px] px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="h-12 w-full max-w-md rounded-full bg-white/10" />
          <div className="h-12 w-full rounded-full bg-white/10" />
        </div>
      </section>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </section>
    </main>
  );
}