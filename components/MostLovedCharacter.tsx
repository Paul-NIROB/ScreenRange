import Image from "next/image";
import Link from "next/link";

export type ActorPerformanceRow = {
  cast_role_id: number;
  title_id: number;
  title_name: string;
  title_year: number | null;
  title_poster_path: string | null;
  character_name: string | null;
  profile_path: string | null;
  avg_score: number | null;
  rating_count: number;
  weighted_score: number | null;
};

type Props = {
  rows: ActorPerformanceRow[];
};

function initialOf(name: string): string {
  const c = name.trim().charAt(0).toUpperCase();
  return c.length > 0 ? c : "·";
}

export default function CharacterPerformanceCard({ rows }: Props) {
  if (rows.length === 0) return null;

  const weighted = (r: ActorPerformanceRow) =>
    Number(r.weighted_score ?? r.avg_score ?? 0);

  const highestRated = [...rows].sort(
    (a, b) => weighted(b) - weighted(a)
  )[0];

  if (!highestRated) return null;

  const score = weighted(highestRated);
  const hasCharacter =
    !!highestRated.character_name &&
    highestRated.character_name.trim().length > 0;

  return (
    <section className="mb-14 sm:mb-20">
      <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
        <div>
          <span className="chip">
            <span className="text-gold">🏆</span>
            <span>Highest Rated Performance</span>
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold leading-[1.02] tracking-tight sm:text-4xl md:text-5xl">
            Their{" "}
            <span className="bg-gradient-to-r from-gold via-gold-soft to-gold bg-clip-text text-transparent">
              finest work
            </span>{" "}
            on ScreenRange
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            The character that brought out their highest community rating.
            ScreenRange has no separate &ldquo;love / favorite&rdquo; metric
            today, so this reflects the best-reviewed performance.
          </p>
        </div>
      </div>

      <Link
        href={`/title/${highestRated.title_id}`}
        className="card group relative overflow-hidden p-0"
      >
        <div className="grid min-h-[380px] grid-cols-1 content-end sm:min-h-[460px] md:grid-cols-[1fr_1.2fr]">
          <div className="relative h-60 w-full overflow-hidden sm:h-full">
            {highestRated.profile_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/h632${highestRated.profile_path}`}
                alt={
                  hasCharacter
                    ? highestRated.character_name!
                    : highestRated.title_name
                }
                fill
                priority
                sizes="(max-width: 767px) 100vw, 42vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-6xl text-muted sm:text-7xl">
                {initialOf(highestRated.title_name)}
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07070b] via-[#07070b]/70 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent md:to-[rgba(7,7,10,0.85)]" />
          </div>

          <div className="relative flex flex-col justify-end p-5 sm:p-7 md:p-9">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30 backdrop-blur px-3 py-1 font-display text-base font-bold leading-none text-emerald-400 sm:text-lg">
              <span aria-hidden>👑</span> #1 Rated
            </span>

            <h3 className="mt-4 truncate font-display text-3xl font-bold leading-[1.02] tracking-tight sm:text-4xl md:text-5xl">
              {hasCharacter
                ? highestRated.character_name
                : highestRated.title_name}
            </h3>
            <p className="mt-1.5 truncate text-sm text-muted sm:text-base">
              in <span className="text-foreground/90">{highestRated.title_name}</span>
              {highestRated.title_year ? ` · ${highestRated.title_year}` : ""}
            </p>

            <div className="mt-5 flex flex-wrap items-end gap-4 sm:gap-6">
              <div className="flex items-baseline gap-1.5 text-gold">
                <span aria-hidden className="text-xl leading-none sm:text-2xl">
                  ★
                </span>
                <span className="font-display text-4xl font-bold leading-none sm:text-5xl">
                  {score > 0 ? score.toFixed(1) : "—"}
                </span>
                <span className="text-sm font-medium text-muted sm:text-base">
                  / 10
                </span>
              </div>
              <p className="text-xs text-muted sm:text-sm pb-1">
                {highestRated.rating_count.toLocaleString()}{" "}
                {highestRated.rating_count === 1 ? "rating" : "ratings"}
              </p>
            </div>

            <div className="mt-6 inline-flex w-full">
              <span className="btn btn-gold text-xs sm:text-sm">
                View performance
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  stroke="currentColor"
                  strokeWidth="2.3"
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
      </Link>
    </section>
  );
}
