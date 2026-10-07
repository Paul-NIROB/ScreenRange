import Image from "next/image";
import Link from "next/link";
import type { PerformanceRow } from "./HomeHeroSection";

type SideTone = "heroes" | "villains";

type Props = {
  tone: SideTone;
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  rows: PerformanceRow[];
};

function initialOf(name: string): string {
  const c = name.trim().charAt(0).toUpperCase();
  return c.length > 0 ? c : "·";
}

function rankColors(rank: number, tone: SideTone): string {
  if (rank === 1) {
    return tone === "heroes"
      ? "text-gold ring-gold/40 bg-gold/10"
      : "text-gold ring-purple-400/40 bg-purple-500/10";
  }
  if (rank === 2) {
    return "text-muted-strong ring-white/10 bg-white/5";
  }
  if (rank === 3) {
    return "text-[#cc8850] ring-[#cc8850]/30 bg-[#cc8850]/5";
  }
  return "text-muted ring-border bg-surface-hover";
}

function toneClasses(tone: SideTone): {
  sectionBg: string;
  heroBackdrop: string;
  heroBorder: string;
  heroGlow: string;
  overlay: string;
  eyebrowAccent: string;
} {
  if (tone === "heroes") {
    return {
      sectionBg: "",
      heroBackdrop:
        "bg-gradient-to-br from-gold/8 via-surface to-background-elevated",
      heroBorder: "border-gold/20",
      heroGlow:
        "before:pointer-events-none before:absolute before:-inset-1 before:-z-0 before:rounded-[calc(1.75rem+4px)] before:bg-[radial-gradient(60%_50%_at_50%_0%,rgba(234,190,85,0.18),transparent_70%)]",
      overlay:
        "bg-gradient-to-t from-[#0a0a10] via-[#0a0a10]/60 to-transparent",
      eyebrowAccent: "text-gold",
    };
  }
  return {
    sectionBg: "",
    heroBackdrop:
      "bg-gradient-to-br from-purple-500/10 via-surface to-background-elevated",
    heroBorder: "border-purple-500/20",
    heroGlow:
      "before:pointer-events-none before:absolute before:-inset-1 before:-z-0 before:rounded-[calc(1.75rem+4px)] before:bg-[radial-gradient(60%_50%_at_50%_0%,rgba(168,85,247,0.2),transparent_70%)]",
    overlay:
      "bg-gradient-to-t from-[#0a0a14] via-[#0a0a14]/70 to-transparent",
    eyebrowAccent: "text-purple-300/90",
  };
}

export default function LeaderboardSection({
  tone,
  eyebrow,
  title,
  subtitle,
  rows,
}: Props) {
  if (rows.length === 0) return null;

  const [first, ...rest] = rows;
  const support = rest.slice(0, 3);
  const t = toneClasses(tone);
  const firstWeighted = Math.min(
    Math.max(Number(first.weighted_score), 0),
    10
  );
  const firstCount = Number(first.rating_count);
  const firstHasCharacter =
    !!first.character_name && first.character_name.trim().length > 0;

  return (
    <section className="mb-14 sm:mb-20">
      <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
        <div>
          <span className="chip">
            <span className={t.eyebrowAccent}>{eyebrow}</span>
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold leading-[1.02] tracking-tight sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            {subtitle}
          </p>
        </div>
        <Link
          href="/rankings"
          className="btn btn-ghost hidden shrink-0 px-3 py-2 text-xs sm:inline-flex sm:text-sm"
        >
          Full rankings
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-3.5 w-3.5 opacity-80 sm:h-4 sm:w-4"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12h14" />
            <path d="M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.75fr_1fr] lg:gap-5">
        {/* #1 LARGE FEATURE */}
        <Link
          href={`/title/${first.title_id}`}
          className={`card group relative overflow-hidden p-0 before:-z-0 ${t.heroGlow} relative z-0 border ${t.heroBorder} ${t.heroBackdrop} hover:scale-[1.005]`}
        >
          <div className="relative z-10 grid min-h-[360px] content-end grid-cols-1 sm:min-h-[420px] md:grid-cols-[1fr_1.15fr]">
            {/* Image area */}
            <div className="relative h-56 w-full overflow-hidden sm:h-full md:h-full">
              {first.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/h632${first.profile_path}`}
                  alt={first.person_name}
                  fill
                  sizes="(max-width: 1023px) 100vw, 42vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  loading={tone === "heroes" ? "eager" : "lazy"}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-6xl text-muted sm:text-7xl">
                  {initialOf(first.person_name)}
                </div>
              )}
              <div
                className={`pointer-events-none absolute inset-0 ${t.overlay}`}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent md:to-[rgba(7,7,10,0.85)]" />
            </div>

            {/* Info */}
            <div className="relative flex flex-col justify-end p-5 sm:p-7 md:p-8">
              <span
                className={`inline-flex w-fit items-center gap-2 rounded-full ring-1 backdrop-blur px-3 py-1 font-display text-lg font-bold leading-none sm:text-xl ${rankColors(
                  1,
                  tone
                )}`}
              >
                #1
              </span>

              <h3 className="mt-4 truncate font-display text-2xl font-bold leading-[1.02] tracking-tight sm:text-3xl md:text-4xl">
                {firstHasCharacter ? first.character_name : first.title_name}
              </h3>
              <p className="mt-1.5 truncate text-sm text-muted sm:text-base">
                portrayed by{" "}
                <span className="text-foreground/90">{first.person_name}</span>
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-strong sm:text-sm">
                in {first.title_name}
                {first.title_year ? ` · ${first.title_year}` : ""}
              </p>

              <div className="mt-5 flex items-end flex-wrap gap-4 sm:gap-5">
                <div className="flex items-baseline gap-1.5 text-gold">
                  <span
                    aria-hidden
                    className="text-lg leading-none sm:text-2xl"
                  >
                    ★
                  </span>
                  <span className="font-display text-4xl font-bold leading-none sm:text-5xl">
                    {firstWeighted.toFixed(1)}
                  </span>
                  <span className="text-sm font-medium text-muted sm:text-base">
                    / 10
                  </span>
                </div>
                <p className="text-xs text-muted sm:text-sm pb-1">
                  {firstCount.toLocaleString()}{" "}
                  {firstCount === 1 ? "rating" : "ratings"}
                </p>
              </div>

              <div className="mt-5 inline-flex w-full items-center gap-2">
                <span className="btn btn-primary sm:btn-gold py-2 text-xs sm:text-sm">
                  View performance
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M5 12h14" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* #2 / #3 / #4 SUPPORT STACK */}
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-1">
          {support.map((r, i) => {
            const rank = i + 2;
            const weighted = Math.min(Math.max(Number(r.weighted_score), 0), 10);
            const count = Number(r.rating_count);
            const hasChar = !!r.character_name && r.character_name.trim().length > 0;
            return (
              <li key={r.cast_role_id}>
                <Link
                  href={`/title/${r.title_id}`}
                  className="card group flex h-full items-center gap-3 p-3 sm:gap-4 sm:p-4"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ring-1 font-display text-base font-bold leading-none sm:h-9 sm:w-9 sm:text-lg ${rankColors(
                      rank,
                      tone
                    )}`}
                    aria-hidden
                  >
                    #{rank}
                  </span>

                  <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-hover ring-1 ring-white/5 sm:h-16 sm:w-14 sm:rounded-xl">
                    {r.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/h632${r.profile_path}`}
                        alt={r.person_name}
                        fill
                        sizes="(max-width: 639px) 48px, 56px"
                        className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-display text-lg text-muted sm:text-xl">
                        {initialOf(r.person_name)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold leading-snug sm:text-base">
                      {hasChar ? r.character_name : r.title_name}
                    </p>
                    <p className="truncate text-[11px] text-muted sm:text-xs">
                      {r.person_name} · {r.title_name}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end">
                    <div className="flex items-baseline gap-1 text-gold">
                      <span aria-hidden className="text-[13px] leading-none">
                        ★
                      </span>
                      <span className="font-display text-lg font-bold leading-none sm:text-xl">
                        {weighted.toFixed(1)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-muted sm:text-[11px]">
                      {count.toLocaleString()}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}

          {support.length === 0 && (
            <li className="hidden h-full sm:block">
              <div className="card flex h-full items-center justify-center p-6 text-center text-sm text-muted">
                More characters coming as the community rates.
              </div>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
