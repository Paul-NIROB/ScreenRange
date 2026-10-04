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
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <form action="/" method="get" className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search movies or actors..."
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-purple-600 px-5 py-3 font-medium hover:bg-purple-500"
          >
            Search
          </button>
        </form>

        <div className="mb-4 mt-10 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {query ? `Results for "${query}"` : "Popular titles"}
          </h2>
          {query && (
            <Link href="/" className="text-sm text-neutral-400 hover:text-white">
              Clear search
            </Link>
          )}
        </div>

        {error && (
          <p className="text-red-400">Could not load titles: {error.message}</p>
        )}

        {!error && titles?.length === 0 && (
          <p className="text-neutral-500">
            No titles found. Try a different name.
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {titles?.map((t) => (
            <Link
              key={t.id}
              href={`/title/${t.id}`}
              className="rounded-lg bg-neutral-900 p-3 transition hover:bg-neutral-800"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-neutral-800">
                {t.poster_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${t.poster_path}`}
                    alt={t.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                )}
              </div>
              <p className="mt-3 font-medium">{t.name}</p>
              <p className="text-sm text-neutral-400">{t.year}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}