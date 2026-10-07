import Image from "next/image";
import Link from "next/link";
import type { ActorPerformanceRow } from "./MostLovedCharacter";

type Props = {
  rows: ActorPerformanceRow[];
};

function initialOf(name: string): string {
  const c = name.trim().charAt(0).toUpperCase();
  return c.length > 0 ? c : "·";
}

function rankTone(rank: number): string {
  if (rank === 1) {
    return "bg-gold/15 text-gold ring-gold/30";
  }
  if (rank === 2) {
    return "bg-white/5 text-muted-strong ring-white/10";
  }
  if (rank === 3) {
    return "bg-[#cc8850]/10 text-[#e1a571] ring-[#cc8850]/30";
  }
  return "bg-surface-hover text-muted ring-border";
}

function scoreColor(score: number): string {
  if (score >= 8) return "text-emerald-400";
  if (score >= 5) return "text-amber-400";
  if (score > 0) return "text-rose-400";
  return "text-muted";
}

export default function BestPerformances({ rows }: Props) {
  if (rows.length === 0) return null;

  const weighted = (r: ActorPerformanceRow) =>
    Number(r.weighted_score ?? r.avg_score ?? 0);

  const ranked = [...rows]
    .map((r) => ({ r, s: weighted(r), c: r.rating_count }))
    .sort((a, b) => {
      if (b.c === 0 && a.c === 0) return 0;
      if (b.c === 0) return -1;
      if (a.c === 0) return 1;
      return b.s - a.s;
    })
    .map((x) => x.r);

  return (
    <section className="mb-14 sm:mb-20">
      <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
        <div>
          <span className="chip">
            <span className="text-gold">🏆</span>
            <span>Best performances</span>
          </span>
          <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Ranked <span className="text-gold">by the community</span>
          </h2>
          <p className="mt-1 text-sm text-muted sm:text-base">
            Every major character they have played, ordered by RangeScore.
          </p>
        </div>
      </div>

      {/* Horizontal scroll on mobile, 2-col sm, 3-col lg desktop grid */}
      <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:gap-4 sm:px-6 md:static md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3 xl:grid-cols-4">
        {ranked.map((r, i) => {
          const rank = i + 1;
          const score = weighted(r);
          const hasChar =
            !!r.character_name && r.character_name.trim().length > 0;
          return (
            <Link
              key={r.cast_role_id}
              href={`/title/${r.title_id}`}
              className="card group flex min-w-[78%] shrink-0 snap-start flex-col overflow-hidden p-0 sm:min-w-[280px] md:min-w-0"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-[calc(1.5rem-1px)] bg-surface-hover">
                <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full ring-1 backdrop-blur px-2.5 py-1 text-xs font-bold sm:text-[13px] ${rankTone(
                      rank
                    )}`}
                  >
                    {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`}
                  </span>
                </div>
                {r.profile_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/h632${r.profile_path}`}
                    alt={hasChar ? r.character_name! : r.title_name}
                    fill
                    sizes="(max-width: 639px) 78vw, (max-width: 1023px) 280px, 1fr"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-5xl text-muted sm:text-6xl">
                    {initialOf(r.title_name)}
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-white/90 sm:text-sm">
                      {r.title_name}
                      {r.title_year ? ` (${r.title_year})` : ""}
                    </p>
                  </div>
                  <div className="rating-badge shrink-0 text-xs sm:text-sm">
                    <span aria-hidden>★</span>
                    <span>{score > 0 ? score.toFixed(1) : "—"}</span>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
              </div>
              <div className="space-y-1 p-4">
                <p className="truncate font-display text-base font-bold leading-snug sm:text-lg">
                  {hasChar ? r.character_name : r.title_name}
                </p>
                <p className="truncate text-xs text-muted sm:text-sm">
                  {hasChar ? `in ${r.title_name}` : r.title_name}
                </p>
                <div className="mt-1 flex items-center justify-between text-[11px] text-muted sm:text-xs">
                  <span className={scoreColor(score)}>
                    {score > 0 ? `★ ${score.toFixed(1)}` : "No RangeScore"}
                  </span>
                  <span>
                    {r.rating_count.toLocaleString()}{" "}
                    {r.rating_count === 1 ? "rating" : "ratings"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
