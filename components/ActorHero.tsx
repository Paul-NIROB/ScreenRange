import Image from "next/image";

type ActorHeroProps = {
  name: string;
  profilePath: string | null;
  characterCount: number;
  movieCount: number;
  avgRating: number | null;
  totalRatings: number;
};

function initialOf(name: string): string {
  const c = name.trim().charAt(0).toUpperCase();
  return c.length > 0 ? c : "·";
}

export default function ActorHero({
  name,
  profilePath,
  characterCount,
  movieCount,
  avgRating,
  totalRatings,
}: ActorHeroProps) {
  return (
    <section className="relative mt-6 overflow-hidden sm:mt-8">
      {profilePath && (
        <>
          <div aria-hidden className="absolute inset-0">
            <Image
              src={`https://image.tmdb.org/t/p/h632${profilePath}`}
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              className="object-cover object-top opacity-20 blur-3xl scale-125"
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-background via-background/70 to-transparent"
          />
        </>
      )}

      <div className="relative z-10 flex flex-col items-center gap-6 p-5 text-center sm:p-8 md:flex-row md:items-stretch md:gap-10 md:text-left lg:gap-14">
        <div className="mx-auto shrink-0 md:mx-0 md:sticky md:top-24 md:h-fit">
          <div className="media-wrap relative aspect-[3/4] h-44 w-32 overflow-hidden rounded-3xl ring-2 ring-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] sm:h-60 sm:w-44 md:h-72 md:w-56">
            {profilePath ? (
              <Image
                src={`https://image.tmdb.org/t/p/h632${profilePath}`}
                alt={name}
                priority
                fill
                sizes="(max-width: 767px) 176px, 224px"
                className="object-cover object-top"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-5xl text-muted sm:text-7xl">
                {initialOf(name)}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <span className="chip mx-auto md:mx-0">
            <span className="text-purple-300/90">🎭 Actor</span>
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {name}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-strong md:mx-0 sm:text-base">
            Known for some of the most memorable characters on ScreenRange.
            Below are their highest-rated and most talked-about performances.
          </p>

          <div className="mx-auto mt-6 grid w-full max-w-xl grid-cols-3 gap-2 sm:gap-3 md:mx-0">
            <div className="card p-3.5 sm:p-4">
              <p className="font-display text-xl font-bold leading-none text-foreground sm:text-2xl">
                {characterCount}
              </p>
              <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-xs">
                Characters
              </p>
            </div>
            <div className="card p-3.5 sm:p-4">
              <p className="font-display text-xl font-bold leading-none text-foreground sm:text-2xl">
                {movieCount}
              </p>
              <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-xs">
                Movies
              </p>
            </div>
            <div className="card p-3.5 sm:p-4">
              {avgRating ? (
                <>
                  <p className="flex items-baseline gap-1 text-gold">
                    <span aria-hidden className="text-base leading-none sm:text-lg">
                      ★
                    </span>
                    <span className="font-display text-xl font-bold leading-none sm:text-2xl">
                      {avgRating.toFixed(1)}
                    </span>
                  </p>
                  <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-xs">
                    Avg · {totalRatings.toLocaleString()}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-display text-xl font-bold leading-none text-muted sm:text-2xl">
                    —
                  </p>
                  <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-xs">
                    Not rated yet
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
