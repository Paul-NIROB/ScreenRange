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

export default function HomeTopPerformancesList({ rows }: Props) {
  if (rows.length === 0) return null;

  return (
    <section className="mb-14 sm:mb-20">
      <div className="mb-5 flex items-end justify-between gap-3 sm:mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Top performances of <span className="text-gold">all time</span>
          </h2>
          <p className="mt-1 text-sm text-muted">
            A quick look at the leaderboard.
          </p>
        </div>
        <Link
          href="/rankings"
          className="btn btn-ghost shrink-0 px-3 py-2 text-xs sm:text-sm"
        >
          See full rankings
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-3.5 w-3.5 opacity-80 sm:h-4 sm:w-4"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12h14" />
            <path d="M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      <ol className="card divide-y divide-border overflow-hidden p-0">
        {rows.map((r, i) => {
          const rank = i + 1;
          const weighted = Number(r.weighted_score);
          const hasCharacter = !!r.character_name && r.character_name.trim().length > 0;

          return (
            <li key={r.cast_role_id}>
              <div className="group pointer-events-none relative flex items-center gap-3 p-3 transition hover:bg-surface-hover sm:gap-4 sm:p-4">
                <Link
                  href={`/title/${r.title_id}`}
                  aria-label={`View film: ${r.title_name}`}
                  className="pointer-events-auto absolute inset-0 z-0"
                />
                <div className="relative z-10 flex w-6 shrink-0 items-center justify-center sm:w-8">
                  <span
                    className={`font-display text-base font-bold leading-none sm:text-xl ${
                      rank === 1
                        ? "text-gold"
                        : rank === 2
                          ? "text-muted-strong"
                          : rank === 3
                            ? "text-[#cc8850]"
                            : "text-muted"
                    }`}
                  >
                    {rank}
                  </span>
                </div>

                <Link
                  href={`/actor/${r.person_id}`}
                  className="pointer-events-auto relative z-20 h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-hover ring-1 ring-white/5 sm:h-12 sm:w-12"
                  aria-label={`View actor profile: ${r.person_name}`}
                >
                  {r.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/h632${r.profile_path}`}
                      alt={r.person_name}
                      fill
                      sizes="48px"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-display text-base text-muted sm:text-lg">
                      {initialOf(r.person_name)}
                    </div>
                  )}
                </Link>

                <div className="min-w-0 flex-1 relative z-10">
                  <p className="truncate text-sm font-semibold leading-tight sm:text-base">
                    {hasCharacter ? r.character_name : r.title_name}
                  </p>
                  <p className="truncate text-xs text-muted sm:text-sm">
                    <Link
                      href={`/actor/${r.person_id}`}
                      className="pointer-events-auto relative z-20 text-foreground/80 hover:text-gold underline-offset-2 hover:underline"
                    >
                      {r.person_name}
                    </Link>{" "}
                    · {r.title_name}
                  </p>
                </div>

                <div className="rating-badge shrink-0 relative z-10">
                  <span aria-hidden>★</span>
                  <span>{weighted.toFixed(1)}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
