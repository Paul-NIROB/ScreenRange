import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").replace(/[,()%_\\"]/g, " ").trim().slice(0, 50);

  let titleIdsFromCast: number[] = [];

  if (query) {
    const { data: matchedPeople } = await supabase
      .from("people")
      .select("id")
      .ilike("name", `%${query}%`)
      .limit(25);

    const personIds = (matchedPeople ?? []).map((p: { id: number }) => p.id);

    if (personIds.length > 0) {
      const { data: roles } = await supabase
        .from("cast_roles")
        .select("title_id")
        .in("person_id", personIds);

      titleIdsFromCast = Array.from(
        new Set((roles ?? []).map((r: { title_id: number }) => r.title_id))
      );
    }
  }

  let builder = supabase
    .from("titles")
    .select("id, name, year, poster_path");

  if (query) {
    const filters = [`name.ilike."%${query}%"`];
    if (titleIdsFromCast.length > 0) {
      filters.push(`id.in.(${titleIdsFromCast.join(",")})`);
    }
    builder = builder.or(filters.join(","));
  }

  const { data: titles, error } = await builder.order("id").limit(24);

  return (
    <div className="min-h-screen text-foreground">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <section className="relative mx-auto mb-14 max-w-4xl text-center sm:mb-20">
          <span className="chip mb-6">
            <span className="text-gold">★</span> Community-rated performances
          </span>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Who stole{" "}
            <span className="bg-gradient-to-r from-gold via-gold-soft to-gold bg-clip-text text-transparent">
              the show
            </span>
            ?
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted-strong sm:text-lg">
            Rate the performance, not just the movie. Discover standout acting,
            report screen time, and celebrate the actors that made films
            unforgettable.
          </p>
        </section>

        <form action="/" method="get" className="mx-auto mb-14 flex max-w-2xl flex-col gap-2 sm:mb-18 sm:flex-row sm:gap-3">
          <div className="relative flex-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search movies, shows, or actors…"
              className="input pl-11 py-3.5 text-sm sm:text-base"
            />
          </div>
          <button
            type="submit"
            className="btn btn-gold px-5 py-3.5 text-sm sm:px-6 sm:text-base"
          >
            Search
          </button>
        </form>

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {query ? `Results for "${query}"` : "Featured titles"}
            </h2>
            {!query && (
              <p className="mt-1 text-sm text-muted">
                A selection to explore — click any to rate the performances.
              </p>
            )}
          </div>
          {query && (
            <Link
              href="/"
              className="btn btn-ghost shrink-0 px-3 py-2 text-xs sm:text-sm"
            >
              Clear search
            </Link>
          )}
        </div>

        {error && (
          <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
            Could not load titles: {error.message}
          </p>
        )}

        {!error && titles?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border-strong bg-surface p-10 text-center text-muted">
            No titles found. Try a different name.
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {titles?.map((t, index) => {
            const rating =
              (t as { avg_rating?: number; rating?: number; vote_average?: number })
                .avg_rating ??
              (t as { rating?: number }).rating ??
              (t as { vote_average?: number }).vote_average;
            const hasRating = typeof rating === "number" && !Number.isNaN(rating);

            return (
              <Link
                key={t.id}
                href={`/title/${t.id}`}
                className="card group flex flex-col"
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-t-[calc(1.5rem-1px)] bg-surface-hover">
                  {t.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${t.poster_path}`}
                      alt={t.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading={index < 4 ? "eager" : "lazy"}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-4 text-center font-display text-sm text-muted">
                      {t.name}
                    </div>
                  )}

                  {hasRating && (
                    <div className="rating-badge absolute left-3 top-3">
                      <span aria-hidden>★</span>
                      <span>{(rating as number).toFixed(1)}</span>
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
                      View cast
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between gap-1 p-4">
                  <div>
                    <p className="truncate text-sm font-semibold leading-snug sm:text-[0.95rem]">
                      {t.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted sm:text-sm">
                      {t.year}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}