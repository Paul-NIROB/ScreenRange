   const titles = [
  { id: 1, name: "Sample Movie One", year: 2023, rating: 8.4 },
  { id: 2, name: "Sample Movie Two", year: 2022, rating: 7.9 },
  { id: 3, name: "Sample Series Three", year: 2024, rating: 9.1 },
  { id: 4, name: "Sample Movie Four", year: 2021, rating: 8.0 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800 px-6 py-4">
        <h1 className="text-2xl font-bold">ScreenRange</h1>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <input
          type="text"
          placeholder="Search movies, shows, actors..."
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 outline-none focus:border-purple-500"
        />

        <h2 className="mb-4 mt-10 text-xl font-semibold">
          Top performances this week
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {titles.map((t) => (
            <div key={t.id} className="rounded-lg bg-neutral-900 p-3">
              <div className="aspect-[2/3] rounded-md bg-neutral-800" />
              <p className="mt-3 font-medium">{t.name}</p>
              <p className="text-sm text-neutral-400">
                {t.year} · ★ {t.rating.toFixed(1)}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}