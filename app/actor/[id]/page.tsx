import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "../../../components/Header";
import ActorHero from "../../../components/ActorHero";
import MostLovedCharacter, {
  type ActorPerformanceRow,
} from "../../../components/MostLovedCharacter";
import BestPerformances from "../../../components/BestPerformances";
import { createClient } from "../../../utils/supabase/server";

type PersonRow = {
  id: number;
  name: string;
  profile_path: string | null;
};

type CastRoleWithTitle = {
  id: number;
  title_id: number;
  character_name: string | null;
  billing_order: number | null;
  titles: {
    id: number;
    name: string;
    year: number | null;
    poster_path: string | null;
  };
};

type TitleSummaryRow = {
  id: number;
  name: string;
  year: number | null;
  poster_path: string | null;
};

type TopPerfRawRow = {
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: person } = await supabase
    .from("people")
    .select("name")
    .eq("id", Number(id))
    .maybeSingle();
  const name = (person as { name: string } | null)?.name ?? "Actor";
  return {
    title: `${name} | ScreenRange`,
    description: `Explore ${name}'s highest-rated performances on ScreenRange.`,
  };
}

export default async function ActorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const personId = Number(id);
  if (!Number.isFinite(personId) || personId <= 0) {
    notFound();
  }
  const supabase = await createClient();

  const personPromise = supabase
    .from("people")
    .select("id, name, profile_path")
    .eq("id", personId)
    .maybeSingle()
    .then((r) => (r.data ?? null) as PersonRow | null);

  const topPerfsPromise = supabase
    .rpc("get_top_performances", { p_limit: 100 })
    .then((r) => ((r.data ?? []) as TopPerfRawRow[]));

  const allRolesPromise = supabase
    .from("cast_roles")
    .select(
      "id, title_id, character_name, billing_order, titles!inner(id, name, year, poster_path)"
    )
    .eq("person_id", personId)
    .order("billing_order", { ascending: true, nullsFirst: false })
    .then((r) => (r.data ?? []) as unknown as CastRoleWithTitle[]);

  const [person, topPerfsRows, allRoles] = await Promise.all([
    personPromise,
    topPerfsPromise,
    allRolesPromise,
  ]);

  if (!person) {
    notFound();
  }

  const myPerfs = topPerfsRows.filter((r) => r.person_id === personId);
  const perfsByCastRole = new Map(
    myPerfs.map((r): [number, (typeof myPerfs)[number]] => [r.cast_role_id, r])
  );

  const performanceRows: ActorPerformanceRow[] = allRoles.map(
    (role): ActorPerformanceRow => {
      const perf = perfsByCastRole.get(role.id);
      return {
        cast_role_id: role.id,
        title_id: role.title_id,
        title_name: role.titles.name,
        title_year: role.titles.year,
        title_poster_path: role.titles.poster_path,
        character_name: role.character_name,
        profile_path: person.profile_path,
        avg_score: perf ? Number(perf.avg_score) || null : null,
        rating_count: perf ? Number(perf.rating_count) || 0 : 0,
        weighted_score: perf ? Number(perf.weighted_score) || null : null,
      };
    }
  );

  const characterCount = allRoles.length;
  const uniqueTitleIds = new Set(allRoles.map((r) => r.title_id));
  const movieCount = uniqueTitleIds.size;

  let totalRatings = 0;
  let scoreSum = 0;
  let scoreCount = 0;
  for (const r of performanceRows) {
    totalRatings += r.rating_count;
    const s = Number(r.weighted_score ?? r.avg_score);
    if (Number.isFinite(s) && s > 0 && r.rating_count > 0) {
      scoreSum += s * r.rating_count;
      scoreCount += r.rating_count;
    }
  }
  const avgRating = scoreCount > 0 ? scoreSum / scoreCount : null;

  const titleMap = new Map<number, TitleSummaryRow>();
  for (const r of allRoles) {
    if (!titleMap.has(r.title_id)) {
      titleMap.set(r.title_id, {
        id: r.titles.id,
        name: r.titles.name,
        year: r.titles.year,
        poster_path: r.titles.poster_path,
      });
    }
  }
  const titles = Array.from(titleMap.values());

  function initialOf(name: string): string {
    const c = name.trim().charAt(0).toUpperCase();
    return c.length > 0 ? c : "·";
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
          Back to home
        </Link>

        <ActorHero
          name={person.name}
          profilePath={person.profile_path}
          characterCount={characterCount}
          movieCount={movieCount}
          avgRating={avgRating}
          totalRatings={totalRatings}
        />

        <MostLovedCharacter rows={performanceRows} />

        <BestPerformances rows={performanceRows} />

        {titles.length > 0 && (
          <section className="mb-14 sm:mb-20">
            <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
              <div>
                <span className="chip">
                  <span className="text-purple-300/90">🎬</span>
                  <span>Movies &amp; Series</span>
                </span>
                <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  Films{" "}
                  <span className="bg-gradient-to-r from-purple-300 via-purple-200 to-fuchsia-300 bg-clip-text text-transparent">
                    they appeared in
                  </span>
                </h2>
                <p className="mt-1 text-sm text-muted sm:text-base">
                  Every film and series where {person.name} has a credited
                  performance on ScreenRange.
                </p>
              </div>
              {titles.length > 0 && (
                <span className="chip">
                  {titles.length} title{titles.length === 1 ? "" : "s"}
                </span>
              )}
            </div>

            <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:gap-4 sm:px-6 md:static md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3 xl:grid-cols-4">
              {titles.map((t) => (
                <Link
                  key={t.id}
                  href={`/title/${t.id}`}
                  className="card group flex min-w-[60%] shrink-0 snap-start flex-col overflow-hidden p-0 sm:min-w-[220px] md:min-w-0"
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-t-[calc(1.5rem-1px)] bg-surface-hover">
                    {t.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${t.poster_path}`}
                        alt={t.name}
                        fill
                        sizes="(max-width: 639px) 60vw, (max-width: 1023px) 220px, 1fr"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-display text-4xl text-muted sm:text-5xl">
                        {initialOf(t.name)}
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
                  </div>
                  <div className="space-y-1 p-4">
                    <p className="truncate font-display text-base font-bold leading-snug sm:text-lg">
                      {t.name}
                    </p>
                    <p className="truncate text-xs text-muted sm:text-sm">
                      {t.year ? `${t.year}` : "—"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
