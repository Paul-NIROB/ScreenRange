import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import RatingControl from "../../../components/RatingControl";
import ReviewForm from "../../../components/ReviewForm";
import ScreenTimeControl from "../../../components/ScreenTimeControl";
import { createClient } from "../../../utils/supabase/server";
import AiSummary from "../../../components/AiSummary";

type CastRow = {
  id: number;
  character_name: string | null;
  billing_order: number | null;
  people: {
    id: number;
    name: string;
    profile_path: string | null;
  };
};

type StatRow = {
  cast_role_id: number;
  avg_score: number | string;
  rating_count: number | string;
};

type TimeRow = {
  cast_role_id: number;
  median_minutes: number | string;
  entry_count: number | string;
};

type ReviewRow = {
  id: number;
  user_id: string;
  author_name: string;
  body: string;
  created_at: string;
};

export default async function TitlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: title } = await supabase
    .from("titles")
    .select("id, name, year, poster_path")
    .eq("id", id)
    .single();

  if (!title) {
    notFound();
  }

  const { data: castData } = await supabase
    .from("cast_roles")
    .select("id, character_name, billing_order, people(id, name, profile_path)")
    .eq("title_id", title.id)
    .order("billing_order");

  const cast = (castData ?? []) as unknown as CastRow[];

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: statsData } = await supabase.rpc("get_title_stats", {
    p_title_id: title.id,
  });
  const stats = new Map<number, StatRow>(
    ((statsData ?? []) as StatRow[]).map((s): [number, StatRow] => [
      s.cast_role_id,
      s,
    ])
  );

  const { data: timeData } = await supabase.rpc("get_title_screen_time", {
    p_title_id: title.id,
  });
  const timeStats = new Map<number, TimeRow>(
    ((timeData ?? []) as TimeRow[]).map((t): [number, TimeRow] => [
      t.cast_role_id,
      t,
    ])
  );

  let myScores = new Map<number, number>();
  let myMinutes = new Map<number, number>();
  if (user && cast.length > 0) {
    const roleIds = cast.map((c) => c.id);

    const { data: mine } = await supabase
      .from("performance_ratings")
      .select("cast_role_id, score")
      .in("cast_role_id", roleIds);
    myScores = new Map(
      (mine ?? []).map((r): [number, number] => [r.cast_role_id, r.score])
    );

    const { data: mineTime } = await supabase
      .from("screen_time_entries")
      .select("cast_role_id, minutes")
      .in("cast_role_id", roleIds);
    myMinutes = new Map(
      (mineTime ?? []).map((r): [number, number] => [r.cast_role_id, r.minutes])
    );
  }

  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("id, user_id, author_name, body, created_at")
    .eq("title_id", title.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const reviews = (reviewsData ?? []) as ReviewRow[];
  const myReview = user
    ? (reviews.find((r) => r.user_id === user.id) ?? null)
    : null;
    const { data: summaryRow } = await supabase
    .from("ai_summaries")
    .select("summary")
    .eq("title_id", title.id)
    .maybeSingle();  

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <Link href="/" className="text-sm text-neutral-400 hover:text-white">
          ← Back to all titles
        </Link>

        <div className="mt-6 flex flex-col gap-8 md:flex-row">
          <div className="relative aspect-[2/3] w-full max-w-xs shrink-0 self-start overflow-hidden rounded-lg bg-neutral-800 md:sticky md:top-6">
            {title.poster_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w500${title.poster_path}`}
                alt={title.name}
                fill
                sizes="320px"
                className="object-cover"
              />
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold">{title.name}</h1>
            <p className="mt-2 text-neutral-400">{title.year}</p>
            <AiSummary
  titleId={title.id}
  initialSummary={summaryRow?.summary ?? null}
  isLoggedIn={!!user}
/>

            <h2 className="mt-10 text-xl font-semibold">Cast</h2>

            {cast.length === 0 ? (
              <p className="mt-2 text-neutral-500">No cast information yet.</p>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {cast.map((c) => {
                  const stat = stats.get(c.id);
                  const count = stat ? Number(stat.rating_count) : 0;
                  const time = timeStats.get(c.id);
                  const timeCount = time ? Number(time.entry_count) : 0;

                  return (
                    <div key={c.id} className="rounded-lg bg-neutral-900 p-3">
                      <div className="relative aspect-square overflow-hidden rounded-md bg-neutral-800">
                        {c.people.profile_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w185${c.people.profile_path}`}
                            alt={c.people.name}
                            fill
                            sizes="150px"
                            className="object-cover object-top"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-2xl text-neutral-500">
                            {c.people.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-sm font-medium">{c.people.name}</p>
                      {c.character_name && (
                        <p className="text-xs text-neutral-400">
                          as {c.character_name}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-neutral-300">
                        {stat
                          ? `★ ${Number(stat.avg_score).toFixed(1)} · ${count} ${
                              count === 1 ? "rating" : "ratings"
                            }`
                          : "No ratings yet"}
                      </p>
                      <RatingControl
                        castRoleId={c.id}
                        titleId={title.id}
                        initialScore={myScores.get(c.id) ?? null}
                        isLoggedIn={!!user}
                      />

                      <p className="mt-3 border-t border-neutral-800 pt-2 text-xs text-neutral-300">
                        {time
                          ? `⏱ ${Number(time.median_minutes)} min on screen · ${timeCount} ${
                              timeCount === 1 ? "report" : "reports"
                            }`
                          : "No screen time reported yet"}
                      </p>
                      <ScreenTimeControl
                        castRoleId={c.id}
                        titleId={title.id}
                        initialMinutes={myMinutes.get(c.id) ?? null}
                        isLoggedIn={!!user}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            <h2 className="mt-12 text-xl font-semibold">Reviews</h2>

            <ReviewForm
              titleId={title.id}
              initialBody={myReview?.body ?? null}
              isLoggedIn={!!user}
            />

            {reviews.length === 0 ? (
              <p className="mt-4 text-neutral-500">
                No reviews yet. Be the first to write one.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {reviews.map((r) => (
                  <li key={r.id} className="rounded-lg bg-neutral-900 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">
                        {r.author_name}
                        {user && r.user_id === user.id ? " (you)" : ""}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {new Date(r.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="mt-2 whitespace-pre-line text-sm text-neutral-300">
                      {r.body}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}