import Header from "../../components/Header";

export default function RankingsLoading() {
  return (
    <div className="min-h-screen text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-10 sm:mb-14">
          <div className="h-6 w-40 animate-pulse rounded-full bg-surface-hover sm:h-7" />
          <div className="mt-5 h-10 w-2/3 animate-pulse rounded-lg bg-surface-hover sm:h-14 md:w-1/2" />
          <div className="mx-auto mt-4 max-w-2xl space-y-2 sm:mx-0">
            <div className="h-4 w-full animate-pulse rounded bg-surface-hover sm:h-5" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-surface-hover sm:h-5" />
          </div>
        </div>

        <ol className="mt-8 space-y-3 sm:space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <li
              key={i}
              className="card flex items-center gap-4 p-3 sm:gap-6 sm:p-5"
            >
              <div className="flex w-10 shrink-0 items-center justify-center sm:w-14">
                <div className="h-6 w-3 animate-pulse rounded bg-surface-hover sm:h-9 sm:w-4" />
              </div>
              <div className="h-16 w-16 shrink-0 animate-pulse rounded-xl bg-surface-hover sm:h-20 sm:w-20" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-1/3 animate-pulse rounded bg-surface-hover sm:h-5" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-surface-hover sm:h-4" />
                <div className="h-3 w-2/5 animate-pulse rounded bg-surface-hover sm:h-4" />
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <div className="h-6 w-16 animate-pulse rounded-lg bg-surface-hover sm:h-7 sm:w-20" />
                <div className="h-3 w-20 animate-pulse rounded bg-surface-hover sm:w-28" />
              </div>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
