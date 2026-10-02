import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TMDB_KEY = process.env.TMDB_API_KEY;

async function getCast(tmdbId) {
  const url = `https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=${TMDB_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    console.warn(`  TMDB returned ${response.status} for movie ${tmdbId}`);
    return [];
  }

  const data = await response.json();
  return (data.cast || []).slice(0, 10);
}

async function main() {
  console.log("Starting cast seed...");

  const { data: titles, error } = await supabase
    .from("titles")
    .select("id, tmdb_id, name");

  if (error) {
    console.error("Could not read titles:", error.message);
    return;
  }

  for (const title of titles) {
    const cast = await getCast(title.tmdb_id);
    if (cast.length === 0) continue;

    const peopleMap = new Map();
    for (const c of cast) {
      peopleMap.set(c.id, {
        tmdb_id: c.id,
        name: c.name,
        profile_path: c.profile_path,
      });
    }

    const { data: people, error: peopleError } = await supabase
      .from("people")
      .upsert([...peopleMap.values()], { onConflict: "tmdb_id" })
      .select("id, tmdb_id");

    if (peopleError) {
      console.error(`  People error for ${title.name}:`, peopleError.message);
      continue;
    }

    const personIdByTmdbId = new Map(people.map((p) => [p.tmdb_id, p.id]));

    const roles = cast.map((c, index) => ({
      title_id: title.id,
      person_id: personIdByTmdbId.get(c.id),
      character_name: c.character || null,
      billing_order: c.order ?? index,
      tmdb_credit_id: c.credit_id,
    }));

    const { error: rolesError } = await supabase
      .from("cast_roles")
      .upsert(roles, { onConflict: "tmdb_credit_id" });

    if (rolesError) {
      console.error(`  Roles error for ${title.name}:`, rolesError.message);
    } else {
      console.log(`${title.name}: saved ${roles.length} cast members`);
    }
  }

  console.log("Done!");
}

main();