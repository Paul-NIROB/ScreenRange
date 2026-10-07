import Image from "next/image";
import Link from "next/link";
import type { PerformanceRow } from "./HomeHeroSection";

type Props = {
  rows: PerformanceRow[];
};

function initialOf(name: string): string {
  const c = name.trim().charAt(0).toUpperCase();
  return c.length > 0 ? c : "·";
}

export default function HomeStandoutsSection({ rows }: Props) {
  if (rows.length === 0) return null;

  return (
    <section className="mb-14 sm:mb-20">
      <div className="mb-5 flex items-end justify-between gap-3 sm:mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Standout <span className="text-gold">performances</span>
          </h2>
          <p className="mt-1 text-sm text-muted">
            #2–#5 on the community leaderboard.
          </p>
        </div>
      </div>

      <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:gap-4 sm:px-6 md:static md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 md:pb-0">
        {rows.map((r, i) => {
          const rank = String(i + 2).padStart(2, "0");
          const weighted = Number(r.weighted_score);
          const hasCharacter = !!r.character_name && r.character_name.trim().length > 0;

          return (
            <div
              key={r.cast_role_id}
              className="card group pointer-events-none relative flex min-w-[72%] shrink-0 snap-start flex-col overflow-hidden p-0 sm:min-w-[260px] md:min-w-0"
            >
              <Link
                href={`/title/${r.title_id}`}
                aria-label={`View film: ${r.title_name}`}
                className="pointer-events-auto absolute inset-0 z-0"
              />
              <div className="relative z-10 relative aspect-[4/5] w-full overflow-hidden rounded-t-[calc(1.5rem-1px)] bg-surface-hover">
                <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
                  <span className="font-display text-lg font-bold leading-none text-muted sm:text-xl">
                    {rank}
                  </span>
                </div>

                {r.profile_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/h632${r.profile_path}`}
                    alt={r.person_name}
                    fill
                    sizes="(max-width: 767px) 72vw, (max-width: 1023px) 260px, 1fr"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-5xl text-muted sm:text-6xl">
                    {initialOf(r.person_name)}
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 z-20 flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={`/actor/${r.person_id}`}
                      className="pointer-events-auto relative z-20 truncate text-xs font-medium text-white/90 hover:text-gold sm:text-sm"
                    >
                      {r.person_name}
                    </Link>
                  </div>
                  <div className="rating-badge shrink-0">
                    <span aria-hidden>★</span>
                    <span>{weighted.toFixed(1)}</span>
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
              </div>

              <div className="space-y-0.5 p-4 relative z-10">
                <p className="truncate font-display text-base font-bold leading-snug sm:text-lg">
                  {hasCharacter ? r.character_name : r.title_name}
                </p>
                <p className="truncate text-xs text-muted sm:text-sm">
                  <Link
                    href={`/actor/${r.person_id}`}
                    className="pointer-events-auto relative z-20 text-foreground/80 hover:text-gold"
                  >
                    {hasCharacter ? r.person_name : r.character_name ?? r.person_name}
                  </Link>
                  {r.title_year ? ` · ${r.title_year}` : ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
