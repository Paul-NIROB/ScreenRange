import Header from "../../../components/Header";

export default function ActorLoading() {
  return (
    <div className="min-h-screen text-foreground">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 sm:pt-10 lg:px-8">
        <div className="h-4 w-40 animate-pulse rounded-md bg-surface-hover" />

        <section className="mt-6 grid gap-8 sm:mt-8 md:grid-cols-[auto_1fr] md:items-center md:gap-10">
          <div className="mx-auto aspect-[2/3] w-full max-w-[220px] animate-pulse rounded-2xl bg-surface-hover sm:max-w-xs" />
          <div className="space-y-4">
            <div className="h-10 w-3/4 animate-pulse rounded-lg bg-surface-hover sm:h-14" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-surface-hover" />
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-2xl border border-border bg-surface"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 sm:mt-20">
          <div className="mb-6 h-8 w-64 animate-pulse rounded bg-surface-hover" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] animate-pulse rounded-2xl border border-border bg-surface"
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
