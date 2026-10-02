import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TMDB_KEY = process.env.TMDB_API_KEY;

async function fetchPage(page) {
  const url =
    "https://api.themoviedb.org/3/discover/movie" +
    `?api_key=${TMDB_KEY}` +
    "&with_original_language=hi" +
    "&sort_by=popularity.desc" +
    "&vote_count.gte=100" +
    `&page=${page}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.results) {
    throw new Error("TMDB error: " + JSON.stringify(data));
  }
  return data.results;
}

async function main() {
  console.log("Starting seed...");
  const rows = [];

  for (let page = 1; page <= 5; page++) {
    const movies = await fetchPage(page);
    for (const m of movies) {
      rows.push({
        tmdb_id: m.id,
        name: m.title,
        year: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
        poster_path: m.poster_path,
      });
    }
    console.log(`Fetched page ${page}`);
  }

  const { error } = await supabase
    .from("titles")
    .upsert(rows, { onConflict: "tmdb_id" });

  if (error) {
    console.error("Supabase error:", error.message);
  } else {
    console.log(`Done! Saved ${rows.length} movies.`);
  }
}

main();