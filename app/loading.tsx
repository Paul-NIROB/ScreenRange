import Header from "../components/Header";

export default function Loading() {
  return (
    <div className="min-h-screen text-foreground">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 sm:pt-10 lg:px-8">
        <div className="h-4 w-40 animate-pulse rounded-md bg-surface-hover" />

        <section className="relative mt-6 overflow-hidden sm:mt-8">
          <div className="relative flex flex-col gap-8 p-5 sm:p-8 md:flex-row md:gap-10 lg:gap-12">
            <div className="mx-auto w-full max-w-[220px] sm:max-w-xs md:mx-0 md:h-fit md:shrink-0 md:sticky md:top-24">
              <div className="relative aspect-[2/3] w-full animate-pulse rounded-xl bg-surface ring-1 ring-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]" />
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <div className="h-5 w-16 animate-pulse rounded-md bg-surface-hover sm:h-6" />
              <div className="h-10 w-4/5 animate-pulse rounded-lg bg-surface-hover sm:h-14 md:w-2/3" />
              <div className="mt-1 space-y-2">
                <div className="h-3.5 w-full animate-pulse rounded bg-surface-hover sm:h-4" />
                <div className="h-3.5 w-3/4 animate-pulse rounded bg-surface-hover sm:h-4" />
              </div>
              <div className="mt-8 h-52 w-full animate-pulse rounded-2xl border border-border bg-surface/60 sm:h-60" />
            </div>
          </div>
        </section>

        <section className="mt-14 sm:mt-20">
          <div className="mb-6 space-y-2">
            <div className="h-6 w-32 animate-pulse rounded bg-surface-hover sm:h-7" />
            <div className="h-7 w-56 animate-pulse rounded bg-surface-hover sm:h-9" />
          </div>
          <ul className="space-y-3 sm:space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="card flex flex-col gap-3 p-0 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
                <div className="h-20 w-full animate-pulse rounded-t-xl bg-surface-hover sm:h-[72px] sm:w-[72px] sm:rounded-lg" />
                <div className="flex-1 space-y-2 p-3 pt-0 sm:p-0">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-surface-hover" />
                  <div className="h-3.5 w-2/5 animate-pulse rounded bg-surface-hover" />
                  <div className="mt-1 h-5 w-28 animate-pulse rounded-full bg-surface-hover" />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 sm:mt-20">
          <div className="mb-6 space-y-2">
            <div className="h-7 w-40 animate-pulse rounded bg-surface-hover sm:h-9" />
            <div className="h-4 w-56 animate-pulse rounded bg-surface-hover" />
          </div>
          <div className="h-64 w-full animate-pulse rounded-2xl border border-border bg-surface sm:h-72" />
          <ul className="mt-6 space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <li
                key={i}
                className="h-40 w-full animate-pulse rounded-2xl border border-border bg-surface sm:h-44"
              />
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
