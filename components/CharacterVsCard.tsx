import Image from "next/image";

type VsSide = {
  name: string;
  actorName: string;
  titleName: string;
  titleYear: number | null;
  profilePath: string | null;
  avg: number | null;
  ratingCount: number;
  medianMinutes: number | null;
  screenTimeReports: number;
};

type Props = {
  a: VsSide;
  b: VsSide;
};

function winnerOf(a: VsSide, b: VsSide): "A" | "B" | null {
  const aScore = a.avg ?? 0;
  const bScore = b.avg ?? 0;
  if (aScore === bScore) return null;
  return aScore > bScore ? "A" : "B";
}

function scoreColor(score: number | null): string {
  if (!score || score <= 0) return "text-muted";
  if (score >= 8) return "text-emerald-400";
  if (score >= 5) return "text-amber-400";
  return "text-rose-400";
}

function barColor(score: number | null): string {
  if (!score || score <= 0) return "bg-muted/40";
  if (score >= 8) return "bg-emerald-500";
  if (score >= 5) return "bg-amber-400";
  return "bg-rose-500";
}

type RowProps = {
  label: string;
  a: { value: string; numeric: number; unit?: string };
  b: { value: string; numeric: number; unit?: string };
  higherWins?: boolean;
};

function MetricRow({ label, a, b, higherWins = true }: RowProps) {
  const max = Math.max(a.numeric, b.numeric, 0.0001);
  const aPct = Math.min(100, (a.numeric / max) * 100);
  const bPct = Math.min(100, (b.numeric / max) * 100);

  let aWin = false;
  let bWin = false;
  if (a.numeric !== b.numeric) {
    if (higherWins) {
      aWin = a.numeric > b.numeric;
      bWin = b.numeric > a.numeric;
    } else {
      aWin = a.numeric < b.numeric;
      bWin = b.numeric < a.numeric;
    }
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-[11px] font-medium uppercase tracking-wider text-muted sm:text-xs">
        <span
          className={`text-right sm:w-24 ${
            aWin ? "text-gold" : "text-foreground/70"
          }`}
        >
          {a.value}
          {a.unit ? <span className="text-muted"> {a.unit}</span> : null}
        </span>
        <span className="shrink-0">{label}</span>
        <span
          className={`sm:w-24 ${
            bWin ? "text-gold" : "text-foreground/70"
          }`}
        >
          {b.value}
          {b.unit ? <span className="text-muted"> {b.unit}</span> : null}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-surface-hover">
          <div
            className={`absolute right-0 top-0 h-full rounded-full ${
              aWin ? "bg-gradient-to-l from-gold/90 to-gold" : barColor(a.numeric > 0 ? a.numeric : null)
            }`}
            style={{ width: `${aPct}%` }}
          />
        </div>
        <div
          aria-hidden
          className="shrink-0 text-[10px] font-bold text-muted sm:text-xs"
        >
          ·
        </div>
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-surface-hover">
          <div
            className={`absolute left-0 top-0 h-full rounded-full ${
              bWin ? "bg-gradient-to-r from-gold/90 to-gold" : barColor(b.numeric > 0 ? b.numeric : null)
            }`}
            style={{ width: `${bPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function initialOf(name: string): string {
  const c = name.trim().charAt(0).toUpperCase();
  return c.length > 0 ? c : "·";
}

export default function CharacterVsCard({ a, b }: Props) {
  const winner = winnerOf(a, b);
  const aWins = winner === "A";
  const bWins = winner === "B";

  return (
    <div className="card overflow-hidden p-0">
      <div className="p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
          <div>
            <span className="chip">
              <span aria-hidden>⚔️</span>
              <span>Compare performances</span>
            </span>
            <h3 className="mt-3 font-display text-xl font-bold tracking-tight sm:text-2xl">
              Who <span className="text-gold">stole the show?</span>
            </h3>
            <p className="mt-1 text-sm text-muted">
              Side-by-side look at the top two billed performances.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end sm:gap-5">
          {/* SIDE A */}
          <div
            className={`relative flex items-center gap-4 rounded-2xl border p-4 sm:flex-col sm:items-center sm:gap-5 sm:p-5 ${
              aWins
                ? "border-gold/40 bg-gradient-to-br from-gold/10 via-surface to-surface shadow-[0_0_0_1px_rgba(234,190,85,0.12),0_30px_80px_-40px_rgba(234,190,85,0.45)]"
                : "border-border bg-surface-strong/40"
            }`}
          >
            {aWins && (
              <span className="absolute -top-2.5 left-4 sm:left-1/2 sm:-translate-x-1/2 chip bg-brand text-background border-transparent shadow-[0_0_30px_-10px_rgba(234,190,85,0.6)]">
                <span aria-hidden>👑</span>
                <span className="font-bold">Winner</span>
              </span>
            )}
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-surface-hover ring-1 ring-white/5 sm:h-24 sm:w-24 sm:rounded-3xl">
              {a.profilePath ? (
                <Image
                  src={`https://image.tmdb.org/t/p/h632${a.profilePath}`}
                  alt={a.name}
                  fill
                  sizes="(max-width: 640px) 64px, 96px"
                  className="object-cover object-top"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-2xl text-muted sm:text-3xl">
                  {initialOf(a.actorName)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 sm:text-center">
              <p className="truncate text-sm font-semibold sm:text-base">
                {a.name}
              </p>
              <p className="truncate text-xs text-muted sm:text-sm">
                {a.actorName}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-muted-strong sm:text-xs">
                {a.titleName}
                {a.titleYear ? ` · ${a.titleYear}` : ""}
              </p>
              <p
                className={`mt-3 font-display text-3xl font-bold leading-none sm:text-4xl ${
                  aWins ? "text-gold" : scoreColor(a.avg)
                }`}
              >
                {a.avg && a.avg > 0 ? a.avg.toFixed(1) : "—"}
              </p>
            </div>
          </div>

          {/* VS BADGE */}
          <div className="flex items-center justify-center py-1 sm:flex-col sm:py-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/90 to-fuchsia-500/70 text-[11px] font-black uppercase tracking-wider text-background shadow-[0_0_30px_-8px_rgba(168,85,247,0.55)] sm:h-14 sm:w-14 sm:text-xs">
              VS
            </div>
          </div>

          {/* SIDE B */}
          <div
            className={`relative flex items-center gap-4 rounded-2xl border p-4 sm:flex-col sm:items-center sm:gap-5 sm:p-5 ${
              bWins
                ? "border-gold/40 bg-gradient-to-br from-gold/10 via-surface to-surface shadow-[0_0_0_1px_rgba(234,190,85,0.12),0_30px_80px_-40px_rgba(234,190,85,0.45)]"
                : "border-border bg-surface-strong/40"
            }`}
          >
            {bWins && (
              <span className="absolute -top-2.5 left-4 sm:left-1/2 sm:-translate-x-1/2 chip bg-brand text-background border-transparent shadow-[0_0_30px_-10px_rgba(234,190,85,0.6)]">
                <span aria-hidden>👑</span>
                <span className="font-bold">Winner</span>
              </span>
            )}
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-surface-hover ring-1 ring-white/5 sm:h-24 sm:w-24 sm:rounded-3xl">
              {b.profilePath ? (
                <Image
                  src={`https://image.tmdb.org/t/p/h632${b.profilePath}`}
                  alt={b.name}
                  fill
                  sizes="(max-width: 640px) 64px, 96px"
                  className="object-cover object-top"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-2xl text-muted sm:text-3xl">
                  {initialOf(b.actorName)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 sm:text-center">
              <p className="truncate text-sm font-semibold sm:text-base">
                {b.name}
              </p>
              <p className="truncate text-xs text-muted sm:text-sm">
                {b.actorName}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-muted-strong sm:text-xs">
                {b.titleName}
                {b.titleYear ? ` · ${b.titleYear}` : ""}
              </p>
              <p
                className={`mt-3 font-display text-3xl font-bold leading-none sm:text-4xl ${
                  bWins ? "text-gold" : scoreColor(b.avg)
                }`}
              >
                {b.avg && b.avg > 0 ? b.avg.toFixed(1) : "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4 border-t border-border pt-5 sm:mt-8 sm:space-y-5 sm:pt-6">
          <MetricRow
            label="RangeScore"
            a={{
              value: a.avg && a.avg > 0 ? a.avg.toFixed(1) : "—",
              numeric: a.avg ?? 0,
            }}
            b={{
              value: b.avg && b.avg > 0 ? b.avg.toFixed(1) : "—",
              numeric: b.avg ?? 0,
            }}
          />
          <MetricRow
            label="Ratings"
            a={{
              value: a.ratingCount.toLocaleString(),
              numeric: a.ratingCount,
              unit: "total",
            }}
            b={{
              value: b.ratingCount.toLocaleString(),
              numeric: b.ratingCount,
              unit: "total",
            }}
          />
          <MetricRow
            label="Screen time"
            a={{
              value:
                a.medianMinutes && a.medianMinutes > 0
                  ? String(a.medianMinutes)
                  : "—",
              numeric: a.medianMinutes ?? 0,
              unit: a.medianMinutes && a.medianMinutes > 0 ? "min" : undefined,
            }}
            b={{
              value:
                b.medianMinutes && b.medianMinutes > 0
                  ? String(b.medianMinutes)
                  : "—",
              numeric: b.medianMinutes ?? 0,
              unit: b.medianMinutes && b.medianMinutes > 0 ? "min" : undefined,
            }}
          />
          <MetricRow
            label="ST reports"
            a={{
              value: a.screenTimeReports.toLocaleString(),
              numeric: a.screenTimeReports,
            }}
            b={{
              value: b.screenTimeReports.toLocaleString(),
              numeric: b.screenTimeReports,
            }}
          />
        </div>
      </div>
    </div>
  );
}
