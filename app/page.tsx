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

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <section className="mb-10 text-center sm:mb-14">
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Rate the{" "}
            <span className="bg-gradient-to-r from-brand to-gold bg-clip-text text-transparent">
              performance
            </span>
            ,
            <br className="hidden sm:block" /> not just the movie.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted sm:mt-6 sm:text-base">
            Discover standout acting, report screen time, and celebrate the
            performances that make films unforgettable.
          </p>
        </section>

        <form action="/" method="get" className="mx-auto mb-12 flex max-w-2xl gap-2 sm:mb-16">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search movies or actors..."
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/30 sm:text-base"
          />
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-hover sm:px-6 sm:text-base"
          >
            Search
          </button>
        </form>

        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold sm:text-2xl">
            {query ? `Results for "${query}"` : "Popular titles"}
          </h2>
          {query && (
            <Link href="/" className="text-sm text-muted transition hover:text-foreground">
              Clear search
            </Link>
          )}
        </div>

        {error && (
          <p className="text-red-400">Could not load titles: {error.message}</p>
        )}

        {!error && titles?.length === 0 && (
          <p className="text-muted">
            No titles found. Try a different name.
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
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
                className="group block overflow-hidden rounded-2xl bg-surface transition hover:bg-surface-hover hover:shadow-[0_8px_30px_rgb(124,58,237,0.15)]"
              >
                <div className="relative aspect-[2/3] overflow-hidden bg-surface-hover">
                  {t.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${t.poster_path}`}
                      alt={t.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      loading={index < 4 ? "eager" : "lazy"}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-4 text-center text-xs text-muted">
                      {t.name}
                    </div>
                  )}

                  {hasRating && (
                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-gold/95 px-2 py-0.5 text-xs font-bold text-background shadow-lg backdrop-blur-sm">
                      <span aria-hidden>★</span>
                      <span>{(rating as number).toFixed(1)}</span>
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="space-y-1 p-3 sm:p-4">
                  <p className="truncate text-sm font-medium leading-snug sm:text-base">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted sm:text-sm">{t.year}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}