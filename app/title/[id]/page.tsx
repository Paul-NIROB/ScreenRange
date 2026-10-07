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
    <div className="min-h-screen text-foreground">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 sm:pt-10 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-foreground"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to all titles
        </Link>

        <section className="card mt-6 overflow-hidden p-0 sm:mt-8">
          <div className="flex flex-col gap-8 p-5 sm:p-8 md:flex-row md:gap-10 lg:gap-12">
            <div className="media-wrap relative mx-auto aspect-[2/3] w-full max-w-[220px] shrink-0 sm:max-w-xs md:mx-0 md:sticky md:top-24">
              {title.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${title.poster_path}`}
                  alt={title.name}
                  fill
                  sizes="(max-width: 768px) 240px, 320px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-6 text-center font-display text-xl text-muted">
                  {title.name}
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col">
              <div>
                <span className="chip">{title.year}</span>
                <h1 className="mt-4 font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-5xl lg:text-6xl">
                  {title.name}
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-muted-strong sm:text-base">
                  Explore the cast performances, rate each one, add screen-time
                  estimates, and write a review.
                </p>
              </div>

              <div className="mt-8">
                <AiSummary
                  titleId={title.id}
                  initialSummary={summaryRow?.summary ?? null}
                  isLoggedIn={!!user}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 sm:mt-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Cast &amp; <span className="text-gold">performances</span>
              </h2>
              <p className="mt-1 text-sm text-muted">
                Click through the buttons below to rate each performance.
              </p>
            </div>
            {cast.length > 0 && (
              <span className="chip">
                {cast.length} performer{cast.length === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {cast.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-strong bg-surface p-10 text-center text-muted">
              No cast information yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {cast.map((c) => {
                const stat = stats.get(c.id);
                const count = stat ? Number(stat.rating_count) : 0;
                const avg = stat ? Number(stat.avg_score) : 0;
                const time = timeStats.get(c.id);
                const timeCount = time ? Number(time.entry_count) : 0;

                return (
                  <article key={c.id} className="card group p-0">
                    <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
                      <div className="media-wrap h-24 w-20 shrink-0 ring-1 ring-white/5 sm:h-28 sm:w-24">
                        {c.people.profile_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w185${c.people.profile_path}`}
                            loading="eager"
                            alt={c.people.name}
                            fill
                            sizes="96px"
                            className="object-cover object-top"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-display text-2xl text-muted sm:text-3xl">
                            {c.people.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold leading-snug sm:text-base">
                          {c.people.name}
                        </p>
                        {c.character_name && (
                          <p className="mt-0.5 truncate text-xs text-muted sm:text-sm">
                            as{" "}
                            <span className="text-foreground/85">
                              {c.character_name}
                            </span>
                          </p>
                        )}
                        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          {stat ? (
                            <span
                              className={
                                avg >= 8
                                  ? "text-success"
                                  : avg >= 5
                                    ? "text-gold"
                                    : avg > 0
                                      ? "text-danger"
                                      : "text-muted"
                              }
                            >
                              <span className="font-bold">★ {avg.toFixed(1)}</span>
                              <span className="ml-1 text-xs text-muted">
                                · {count} {count === 1 ? "rating" : "ratings"}
                              </span>
                            </span>
                          ) : (
                            <span className="text-xs text-muted">
                              No ratings yet
                            </span>
                          )}
                          {time ? (
                            <span className="text-xs text-muted-strong">
                              ⏱ {Number(time.median_minutes)} min
                              <span className="ml-1 text-muted">
                                · {timeCount}{" "}
                                {timeCount === 1 ? "report" : "reports"}
                              </span>
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 border-t border-border bg-surface-strong/40 p-4 sm:p-5">
                      <RatingControl
                        castRoleId={c.id}
                        titleId={title.id}
                        initialScore={myScores.get(c.id) ?? null}
                        isLoggedIn={!!user}
                      />
                      <ScreenTimeControl
                        castRoleId={c.id}
                        titleId={title.id}
                        initialMinutes={myMinutes.get(c.id) ?? null}
                        isLoggedIn={!!user}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-14 sm:mt-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Reviews
              </h2>
              <p className="mt-1 text-sm text-muted">
                What did you think of the film overall?
              </p>
            </div>
            {reviews.length > 0 && (
              <span className="chip">
                {reviews.length} review{reviews.length === 1 ? "" : "s"}
              </span>
            )}
          </div>

          <ReviewForm
            titleId={title.id}
            initialBody={myReview?.body ?? null}
            isLoggedIn={!!user}
          />

          {reviews.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border-strong bg-surface p-10 text-center text-muted">
              No reviews yet. Be the first to write one.
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
              {reviews.map((r) => (
                <li key={r.id} className="card p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3 sm:gap-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold/90 to-gold-muted text-[13px] font-bold text-background ring-1 ring-white/5 sm:h-10 sm:w-10">
                        {r.author_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground sm:text-base">
                          {r.author_name}
                          {user && r.user_id === user.id ? (
                            <span className="chip ml-2 py-0 align-middle">
                              you
                            </span>
                          ) : null}
                        </p>
                        <p className="text-xs text-muted sm:text-sm">
                          {new Date(r.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-foreground/90 sm:text-[15px]">
                    {r.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}