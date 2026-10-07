type PerfScoreHeroProps = {
  avg: number;
  count: number;
  rank: number;
  total: number;
  actorName: string;
  characterName: string | null;
  titleName: string;
  titleYear: number | null;
};

function getScoreColors(avg: number): {
  ring: string;
  text: string;
  bg: string;
} {
  if (avg >= 8) {
    return {
      ring: "ring-emerald-500/30",
      text: "text-emerald-400",
      bg: "from-emerald-500/15",
    };
  }
  if (avg >= 5) {
    return {
      ring: "ring-amber-500/30",
      text: "text-amber-400",
      bg: "from-amber-500/15",
    };
  }
  return {
    ring: "ring-rose-500/30",
    text: "text-rose-400",
    bg: "from-rose-500/15",
  };
}

export default function PerfScoreHero({
  avg,
  count,
  rank,
  total,
  actorName,
  characterName,
  titleName,
  titleYear,
}: PerfScoreHeroProps) {
  const hasScore = count > 0 && avg > 0;
  const colors = hasScore ? getScoreColors(avg) : null;

  return (
    <div className="card overflow-hidden p-0">
      <div
        className={`relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-8 sm:p-7 ${
          colors
            ? `bg-gradient-to-br ${colors.bg} via-surface to-surface`
            : ""
        }`}
      >
        {hasScore && colors && (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-current opacity-[0.08] blur-3xl"
              style={{ color: "currentColor" }}
            />
          </>
        )}

        <div className="relative flex shrink-0 items-center gap-5">
          <div
            className={`relative flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-surface-strong ring-1 sm:h-36 sm:w-36 ${
              colors?.ring ?? "ring-border"
            }`}
          >
            {hasScore && colors ? (
              <div className="flex flex-col items-center leading-none">
                <span
                  className={`font-display text-5xl font-bold sm:text-6xl ${colors.text}`}
                >
                  {avg.toFixed(1)}
                </span>
                <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted sm:text-xs">
                  out of 10
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 px-3 text-center">
                <span className="font-display text-lg text-muted sm:text-xl">
                  —
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted sm:text-xs">
                  No RangeScore yet
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="relative min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {characterName ? (
              <p className="font-display text-xl font-bold leading-tight tracking-tight truncate sm:text-2xl">
                {characterName}
              </p>
            ) : (
              <p className="font-display text-xl font-bold leading-tight tracking-tight truncate sm:text-2xl text-muted">
                Unnamed role
              </p>
            )}
            {hasScore && rank <= total && (
              <span className="chip">
                <span className="text-gold">#{rank}</span>
                <span className="text-muted">
                  in {titleName}
                  {titleYear ? ` · ${titleYear}` : ""}
                </span>
              </span>
            )}
          </div>

          <p className="mt-1 truncate text-sm text-muted-strong sm:text-base">
            portrayed by <span className="text-foreground/90">{actorName}</span>
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:max-w-md sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface-strong/60 px-3 py-2.5">
              <p
                className={`font-display text-lg font-bold leading-none sm:text-xl ${
                  hasScore ? "text-foreground" : "text-muted"
                }`}
              >
                {hasScore ? count : "0"}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-muted">
                Ratings
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface-strong/60 px-3 py-2.5">
              <p className="font-display text-lg font-bold leading-none sm:text-xl text-foreground/90">
                #{rank <= total ? rank : "—"}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-muted">
                Cast rank
              </p>
            </div>
            <div className="col-span-2 rounded-xl border border-border bg-surface-strong/60 px-3 py-2.5 sm:col-span-1">
              <p className="truncate font-display text-lg font-bold leading-none sm:text-xl text-foreground/90">
                {total}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-muted">
                Total billed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
