import Image from "next/image";
import Link from "next/link";

export type PerformanceRow = {
  cast_role_id: number;
  person_id: number;
  person_name: string;
  profile_path: string | null;
  character_name: string | null;
  title_id: number;
  title_name: string;
  title_year: number | null;
  avg_score: number | string;
  rating_count: number | string;
  weighted_score: number | string;
};

type Props = {
  top: PerformanceRow | null;
};

export default function HomeHeroSection({ top }: Props) {
  if (!top) {
    return (
      <section className="relative mb-14 sm:mb-20">
        <span className="chip">
          <span className="text-gold">★</span> Community RangeScores
        </span>
        <div className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
            Who stole{" "}
            <span className="bg-gradient-to-r from-gold via-gold-soft to-gold bg-clip-text text-transparent">
              the show
            </span>
            ?
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-muted-strong sm:text-base">
            Give every character a RangeScore out of 10. Rate the performance,
            not just the movie.
          </p>
        </div>
        <div className="mt-10 rounded-2xl border border-dashed border-border-strong bg-surface p-8 text-center text-muted sm:p-12">
          No RangeScores yet.{" "}
          <Link
            href="#films"
            className="font-semibold text-gold underline-offset-4 hover:underline"
          >
            Give a character a RangeScore to start the leaderboard.
          </Link>
        </div>
      </section>
    );
  }

  const weighted = Math.min(Math.max(Number(top.weighted_score), 0), 10);
  const avg = Number(top.avg_score);
  const count = Number(top.rating_count);
  const progress = Math.min(Math.max(weighted * 10, 0), 100);
  const initial = top.person_name.trim().charAt(0).toUpperCase() || "·";
  const hasCharacter = !!top.character_name && top.character_name.trim().length > 0;

  return (
    <section className="relative mb-14 sm:mb-20">
      <span className="chip">
        <span className="text-gold">★</span> Community RangeScores
      </span>

      <div className="mt-6 flex flex-col gap-6 md:grid md:grid-cols-2 md:items-center md:gap-10">
        <div>
          <h1 className="font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
            Who stole{" "}
            <span className="bg-gradient-to-r from-gold via-gold-soft to-gold bg-clip-text text-transparent">
              the show
            </span>
            ?
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-muted-strong sm:text-base">
            Give every character a RangeScore out of 10. Rate the performance,
            not just the movie.
          </p>
        </div>

        <div className="card group pointer-events-none relative overflow-hidden p-0">
          <Link
            href={`/title/${top.title_id}`}
            aria-label={`View film: ${top.title_name}`}
            className="pointer-events-auto absolute inset-0 z-0"
          />
          <div className="relative z-10 grid grid-cols-[auto_1fr] gap-4 p-4 sm:gap-5 sm:p-5">
            <div className="relative h-40 w-28 shrink-0 overflow-hidden rounded-xl bg-surface-hover ring-1 ring-white/5 sm:h-48 sm:w-36">
              {top.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/h632${top.profile_path}`}
                  alt={top.person_name}
                  fill
                  sizes="(max-width: 767px) 112px, 144px"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-4xl text-muted sm:text-5xl">
                  {initial}
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>

            <div className="flex min-w-0 flex-col justify-between py-0.5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold sm:text-xs">
                  #1 Performance
                </p>
                <h2 className="mt-2 truncate font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                  {hasCharacter ? top.character_name : top.title_name}
                </h2>
                <p className="mt-1.5 truncate text-xs text-muted sm:text-sm">
                  <Link
                    href={`/actor/${top.person_id}`}
                    className="pointer-events-auto relative z-20 text-foreground/90 hover:text-gold underline-offset-2 hover:underline"
                  >
                    {top.person_name}
                  </Link>
                  {hasCharacter && (
                    <>
                      {" "}as{" "}
                      <span className="text-foreground/90">{top.character_name}</span>
                    </>
                  )}{" "}
                  in <span className="text-foreground/90">{top.title_name}</span>
                  {top.title_year ? ` (${top.title_year})` : ""}
                </p>
              </div>

              <div className="mt-4">
                <div className="flex items-end justify-between gap-3">
                  <div className="flex items-baseline gap-1.5 text-gold">
                    <span aria-hidden className="text-base leading-none sm:text-lg">
                      ★
                    </span>
                    <span className="font-display text-2xl font-bold leading-none sm:text-3xl">
                      {weighted.toFixed(1)}
                    </span>
                    <span className="text-sm font-medium text-muted sm:text-base">
                      / 10
                    </span>
                  </div>
                  <p className="shrink-0 text-[11px] text-muted sm:text-xs">
                    avg {Number.isFinite(avg) ? avg.toFixed(1) : "—"} ·{" "}
                    {Number.isFinite(count) ? count : 0}{" "}
                    {count === 1 ? "rating" : "ratings"}
                  </p>
                </div>
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-hover">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold to-gold-soft transition-[width] duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-4 flex w-full">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background transition group-hover:-translate-y-0.5 group-hover:bg-accent-hover sm:text-sm">
                    View film
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-3.5 w-3.5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M5 12h14" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
