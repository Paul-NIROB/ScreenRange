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
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold">Top performances</h1>
        <p className="mt-2 text-neutral-400">
          The best-rated acting performances of all time, ranked by the
          community. Scores with few ratings are pulled toward the site
          average, so one lucky 10 can&apos;t take the top spot.
        </p>

        {error && (
          <p className="mt-6 text-red-400">
            Could not load rankings: {error.message}
          </p>
        )}

        {!error && rows.length === 0 && (
          <p className="mt-6 text-neutral-500">
            No ratings yet. Open a movie and rate a performance to start the
            leaderboard.
          </p>
        )}

        <ol className="mt-8 space-y-3">
          {rows.map((r, index) => {
            const count = Number(r.rating_count);

            return (
              <li key={r.cast_role_id}>
                <Link
                  href={`/title/${r.title_id}`}
                  className="flex items-center gap-4 rounded-lg bg-neutral-900 p-3 transition hover:bg-neutral-800"
                >
                  <span className="w-8 text-center text-xl font-bold text-neutral-500">
                    {index + 1}
                  </span>

                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-neutral-800">
                    {r.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${r.profile_path}`}
                        alt={r.person_name}
                        fill
                        sizes="64px"
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xl text-neutral-500">
                        {r.person_name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{r.person_name}</p>
                    <p className="truncate text-sm text-neutral-400">
                      {r.character_name ? `as ${r.character_name} in ` : "in "}
                      {r.title_name}
                      {r.title_year ? ` (${r.title_year})` : ""}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      ★ {Number(r.weighted_score).toFixed(1)}
                    </p>
                    <p className="text-xs text-neutral-500">
                      avg {Number(r.avg_score).toFixed(1)} · {count}{" "}
                      {count === 1 ? "rating" : "ratings"}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}