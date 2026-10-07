import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import RatingControl from "../../../components/RatingControl";
import ReviewForm from "../../../components/ReviewForm";
import ScreenTimeControl from "../../../components/ScreenTimeControl";
import { createClient } from "../../../utils/supabase/server";
import AiSummary from "../../../components/AiSummary";
import ScoreBadge from "../../../components/ScoreBadge";

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

  let maxMedian = 0;
  for (const c of cast) {
    const t = timeStats.get(c.id);
    if (t) {
      const m = Number(t.median_minutes);
      if (m > maxMedian) maxMedian = m;
    }
  }

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

        <section className="relative mt-6 overflow-hidden sm:mt-8">
          {title.poster_path && (
            <>
              <div aria-hidden className="absolute inset-0">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${title.poster_path}`}
                  alt=""
                  aria-hidden
                  fill
                  sizes="100vw"
                  className="object-cover opacity-20 blur-2xl scale-110"
                />
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/70 to-transparent"
              />
            </>
          )}

          <div className="relative flex flex-col gap-8 p-5 sm:p-8 md:flex-row md:gap-10 lg:gap-12">
            <div className="md:sticky md:top-24 md:h-fit md:shrink-0 mx-auto w-full max-w-[220px] sm:max-w-xs md:mx-0">
              <div className="media-wrap relative aspect-[2/3] w-full rounded-xl ring-1 ring-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
                {title.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${title.poster_path}`}
                    alt={title.name}
                    fill
                    loading="eager"
                    sizes="(max-width: 768px) 220px, 320px"
                    className="object-cover rounded-xl"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center p-6 text-center font-display text-xl text-muted">
                    {title.name}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-1 flex-col">
              <div>
                <p className="text-sm text-muted sm:text-base">{title.year}</p>
                <h1 className="mt-2 font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  {title.name}
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
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
                Cast and performances
              </h2>
              <p className="mt-1 text-sm text-muted">
                Rate each performance and report screen time.
              </p>
            </div>
            {cast.length > 0 && (
              <span className="chip">
                {cast.length} performer{cast.length === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {cast.length === 0 ? (
            <div className="card p-10 text-center text-muted">
              No cast information yet.
            </div>
          ) : (
            <>
              <div className="space-y-3 sm:hidden">
                {cast.map((c) => {
                  const stat = stats.get(c.id);
                  const count = stat ? Number(stat.rating_count) : 0;
                  const avg = stat ? Number(stat.avg_score) : 0;
                  const time = timeStats.get(c.id);
                  const median = time ? Number(time.median_minutes) : 0;
                  const timeCount = time ? Number(time.entry_count) : 0;
                  const barPct =
                    maxMedian > 0 ? Math.min(100, (median / maxMedian) * 100) : 0;

                  return (
                    <article key={c.id} className="card p-0">
                      <div className="flex gap-3 p-3">
                        <div className="media-wrap h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg">
                          <div className="relative h-full w-full">
                            {c.people.profile_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/h632${c.people.profile_path}`}
                                alt={c.people.name}
                                fill
                                sizes="72px"
                                className="object-cover object-top"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center font-display text-xl text-muted">
                                {c.people.name.charAt(0)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold leading-snug">
                            {c.people.name}
                          </p>
                          {c.character_name && (
                            <p className="mt-0.5 truncate text-xs text-muted">
                              as{" "}
                              <span className="text-foreground/80">
                                {c.character_name}
                              </span>
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-y-1.5">
                            <ScoreBadge avg={avg} count={count} />
                          </div>
                          {time && (
                            <div className="mt-2">
                              <p className="text-[11px] text-muted">
                                <span className="text-foreground/75 font-medium">
                                  {median} min on screen
                                </span>
                                {" · "}
                                {timeCount}{" "}
                                {timeCount === 1 ? "report" : "reports"}
                              </p>
                              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-surface-hover">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-gold/70 to-gold"
                                  style={{ width: `${barPct}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3.5 border-t border-border bg-surface-strong/40 p-3">
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

              <div className="hidden grid-cols-1 gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
                {cast.map((c) => {
                  const stat = stats.get(c.id);
                  const count = stat ? Number(stat.rating_count) : 0;
                  const avg = stat ? Number(stat.avg_score) : 0;
                  const time = timeStats.get(c.id);
                  const median = time ? Number(time.median_minutes) : 0;
                  const timeCount = time ? Number(time.entry_count) : 0;
                  const barPct =
                    maxMedian > 0 ? Math.min(100, (median / maxMedian) * 100) : 0;

                  return (
                    <article key={c.id} className="card flex flex-col p-0">
                      <div className="flex flex-col gap-4 p-5">
                        <div className="flex gap-4">
                          <div className="media-wrap h-28 w-24 shrink-0 overflow-hidden">
                            <div className="relative h-full w-full">
                              {c.people.profile_path ? (
                                <Image
                                  src={`https://image.tmdb.org/t/p/h632${c.people.profile_path}`}
                                  alt={c.people.name}
                                  fill
                                  sizes="96px"
                                  className="object-cover object-top"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center font-display text-3xl text-muted">
                                  {c.people.name.charAt(0)}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold leading-snug sm:text-base">
                              {c.people.name}
                            </p>
                            {c.character_name && (
                              <p className="mt-0.5 truncate text-xs text-muted sm:text-sm">
                                as{" "}
                                <span className="text-foreground/80">
                                  {c.character_name}
                                </span>
                              </p>
                            )}
                            <div className="mt-2.5">
                              <ScoreBadge avg={avg} count={count} />
                            </div>
                            {time && (
                              <div className="mt-2.5">
                                <p className="text-[11px] text-muted sm:text-xs">
                                  <span className="text-foreground/75 font-medium">
                                    {median} min on screen
                                  </span>
                                  {" · "}
                                  {timeCount}{" "}
                                  {timeCount === 1 ? "report" : "reports"}
                                </p>
                                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-surface-hover">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-gold/70 to-gold"
                                    style={{ width: `${barPct}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto space-y-4 border-t border-border bg-surface-strong/40 p-5">
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
            </>
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
            <div className="mt-6 card p-10 text-center text-muted">
              No reviews yet. Be the first to write one.
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
              {reviews.map((r) => {
                const isOwn = user && r.user_id === user.id;
                const firstName = r.author_name.split(" ")[0];
                return (
                  <li key={r.id} className="card p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3 sm:gap-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold/90 to-gold-muted text-[13px] font-bold text-background ring-1 ring-white/5 sm:h-10 sm:w-10">
                          {r.author_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="flex flex-wrap items-center gap-2 text-sm font-semibold sm:text-base">
                            <span className="text-gold truncate">
                              {firstName}
                            </span>
                            {isOwn && (
                              <span className="chip py-0 text-[10px] uppercase tracking-wider">
                                You
                              </span>
                            )}
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
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}