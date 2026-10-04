import Image from "next/image";
import Header from "../components/Header";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default async function Home() {
  const { data: titles, error } = await supabase
    .from("titles")
    .select("id, name, year, poster_path")
    .order("id")
    .limit(12);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <input
          type="text"
          placeholder="Search movies, shows, actors..."
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 outline-none focus:border-purple-500"
        />

        <h2 className="mb-4 mt-10 text-xl font-semibold">Popular titles</h2>

        {error && (
          <p className="text-red-400">Could not load titles: {error.message}</p>
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