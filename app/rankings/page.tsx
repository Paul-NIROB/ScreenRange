import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";
import { supabase } from "../../lib/supabase";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Top performances | ScreenRange",
  description: "The best-rated acting performances, ranked by the community.",
};

type RankingRow = {
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

export default async function RankingsPage() {
  const { data, error } = await supabase.rpc("get_top_performances", {
    p_limit: 20,
  });

  const rows = (data ?? []) as RankingRow[];

  return (
    <div className="min-h-screen text-foreground">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-10 text-center sm:mb-14 sm:text-left">
          <span className="chip">
            <span className="text-gold">★</span> Leaderboard
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Top <span className="text-gold">performances</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-strong sm:mx-0 sm:text-base">
            The best-rated acting performances of all time, ranked by the
            community. Scores with few ratings are pulled toward the site
            average, so one lucky 10 can&apos;t take the top spot.
          </p>
        </div>

        {error && (
          <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
            Could not load rankings: {error.message}
          </p>
        )}

        {!error && rows.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border-strong bg-surface p-10 text-center text-muted">
            No ratings yet. Open a movie and rate a performance to start the
            leaderboard.
          </div>
        )}

        <ol className="mt-8 space-y-3 sm:space-y-4">
          {rows.map((r, index) => {
            const count = Number(r.rating_count);
            const weighted = Number(r.weighted_score);

            return (
              <li key={r.cast_role_id}>
                <div className="card group relative flex items-center gap-4 p-3 sm:gap-6 sm:p-5">
                  <Link
                    href={`/title/${r.title_id}`}
                    aria-label={`View film: ${r.title_name}`}
                    className="absolute inset-0 z-0"
                  />
                  <div className="relative z-10 flex w-10 shrink-0 flex-col items-center justify-center sm:w-14">
                    <span
                      className={`font-display text-2xl font-bold leading-none sm:text-4xl ${
                        index === 0
                          ? "text-gold"
                          : index === 1
                            ? "text-muted-strong"
                            : index === 2
                              ? "text-[#cc8850]"
                              : "text-muted"
                      }`}
                    >
                      {index + 1}
                    </span>
                    {index < 3 && (
                      <span
                        aria-hidden
                        className={`mt-1 block h-0.5 w-6 sm:w-8 ${
                          index === 0
                            ? "bg-gold"
                            : index === 1
                              ? "bg-muted-strong/60"
                              : "bg-[#cc8850]/70"
                        }`}
                      />
                    )}
                  </div>

                  <Link
                    href={`/actor/${r.person_id}`}
                    className="relative z-20 h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-hover ring-1 ring-white/5 sm:h-20 sm:w-20"
                    aria-label={`View actor profile: ${r.person_name}`}
                  >
                    {r.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${r.profile_path}`}
                        alt={r.person_name}
                        fill
                        sizes="80px"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-display text-2xl text-muted sm:text-3xl">
                        {r.person_name.charAt(0)}
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1 relative z-10">
                    <Link
                      href={`/actor/${r.person_id}`}
                      className="relative z-20 truncate text-base font-semibold leading-tight hover:text-gold underline-offset-2 hover:underline sm:text-lg"
                    >
                      {r.person_name}
                    </Link>
                    {r.character_name && (
                      <p className="truncate text-xs text-muted-strong sm:text-sm">
                        as <span className="text-foreground/85">{r.character_name}</span>
                      </p>
                    )}
                    <p className="mt-0.5 truncate text-xs text-muted sm:text-sm">
                      in {r.title_name}
                      {r.title_year ? ` · ${r.title_year}` : ""}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end relative z-10">
                    <div className="rating-badge text-sm sm:text-base">
                      <span aria-hidden>★</span>
                      <span>{weighted.toFixed(1)}</span>
                    </div>
                    <p className="mt-1.5 text-[11px] text-muted sm:text-xs">
                      avg {Number(r.avg_score).toFixed(1)} · {count}{" "}
                      {count === 1 ? "rating" : "ratings"}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}