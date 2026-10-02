import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";

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

export default async function TitlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800 px-6 py-4">
        <Link href="/" className="text-2xl font-bold">
          ScreenRange
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <Link href="/" className="text-sm text-neutral-400 hover:text-white">
          ← Back to all titles
        </Link>

        <div className="mt-6 flex flex-col gap-8 md:flex-row">
          <div className="relative aspect-[2/3] w-full max-w-xs shrink-0 overflow-hidden rounded-lg bg-neutral-800">
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

            <h2 className="mt-10 text-xl font-semibold">Cast</h2>

            {cast.length === 0 ? (
              <p className="mt-2 text-neutral-500">No cast information yet.</p>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {cast.map((c) => (
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}