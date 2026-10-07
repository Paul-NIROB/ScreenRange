type PerfStatsGridProps = {
  avg: number | null;
  ratingCount: number;
  medianMinutes: number | null;
  screenTimeReports: number;
  castRank: number | null;
  totalCast: number;
};

function averageColorClass(avg: number | null): string {
  if (avg == null || avg <= 0) return "text-muted";
  if (avg >= 8) return "text-emerald-400";
  if (avg >= 5) return "text-amber-400";
  return "text-rose-400";
}

type StatProps = {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  accent?: string;
};

function Stat({ icon, value, label }: StatProps) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-muted sm:text-xs">
            {label}
          </p>
          <div className="mt-2.5 truncate">{value}</div>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-hover text-muted-strong sm:h-10 sm:w-10">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function PerfStatsGrid({
  avg,
  ratingCount,
  medianMinutes,
  screenTimeReports,
  castRank,
  totalCast,
}: PerfStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <Stat
        label="Overall RangeScore"
        icon={
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 2l2.89 5.86L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l7.11-1.41L12 2z" />
          </svg>
        }
        value={
          <p
            className={`font-display text-2xl font-bold leading-none sm:text-3xl ${averageColorClass(
              avg
            )}`}
          >
            {avg && avg > 0 ? avg.toFixed(1) : "—"}
          </p>
        }
      />

      <Stat
        label="Ratings"
        icon={
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        }
        value={
          <p className="font-display text-2xl font-bold leading-none sm:text-3xl text-foreground">
            {ratingCount.toLocaleString()}
          </p>
        }
      />

      <Stat
        label="Screen time"
        icon={
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
        value={
          <div>
            <p className="font-display text-2xl font-bold leading-none sm:text-3xl text-foreground">
              {medianMinutes && medianMinutes > 0 ? medianMinutes : "—"}
            </p>
            {medianMinutes && medianMinutes > 0 ? (
              <p className="mt-0.5 text-[11px] font-medium text-muted sm:text-xs">
                minutes median
              </p>
            ) : null}
          </div>
        }
      />

      <Stat
        label={totalCast > 0 ? "Cast rank" : "Reports"}
        icon={
          totalCast > 0 ? (
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )
        }
        value={
          totalCast > 0 && castRank ? (
            <div>
              <p className="font-display text-2xl font-bold leading-none sm:text-3xl text-gold">
                #{castRank}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-muted sm:text-xs">
                of {totalCast} billed
              </p>
            </div>
          ) : (
            <p className="font-display text-2xl font-bold leading-none sm:text-3xl text-foreground">
              {screenTimeReports.toLocaleString()}
            </p>
          )
        }
      />
    </div>
  );
}
