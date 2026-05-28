export default function Loading() {
  return (
    <main className="surface-grid mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <div className="h-10 w-40 animate-pulse rounded-full bg-white/10" />
      <section className="glass-panel animate-pulse rounded-[32px] px-5 py-6 sm:px-7 sm:py-8">
        <div className="h-5 w-72 rounded-full bg-white/10" />
        <div className="mt-6 grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
          <div className="space-y-4">
            <div className="h-20 w-20 rounded-full bg-white/10" />
            <div className="h-8 w-40 rounded-full bg-white/10" />
          </div>
          <div className="mx-auto h-12 w-16 rounded-full bg-white/10" />
          <div className="space-y-4 sm:justify-self-end">
            <div className="h-20 w-20 rounded-full bg-white/10" />
            <div className="h-8 w-40 rounded-full bg-white/10" />
          </div>
        </div>
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel animate-pulse rounded-[28px] p-6">
          <div className="h-8 w-56 rounded-full bg-white/10" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-3 rounded-[22px] border border-white/10 p-4">
                <div className="h-5 w-32 rounded-full bg-white/10" />
                <div className="h-3 w-full rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="glass-panel animate-pulse rounded-[28px] p-6">
            <div className="h-8 w-48 rounded-full bg-white/10" />
            <div className="mt-6 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="h-4 w-full rounded-full bg-white/10" />
                  <div className="h-3 w-full rounded-full bg-white/10" />
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel animate-pulse rounded-[28px] p-6">
            <div className="h-8 w-52 rounded-full bg-white/10" />
            <div className="mt-4 h-4 w-full rounded-full bg-white/10" />
            <div className="mt-3 h-4 w-4/5 rounded-full bg-white/10" />
            <div className="mt-3 h-4 w-3/5 rounded-full bg-white/10" />
          </div>
        </div>
      </section>
    </main>
  );
}