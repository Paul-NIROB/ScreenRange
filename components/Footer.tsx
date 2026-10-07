import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border/80 bg-surface-strong/40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" aria-hidden />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-10 sm:px-6 sm:py-12 md:flex-row md:items-start lg:px-8">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <Link href="/" className="group inline-flex items-center gap-2">
            <span
              aria-hidden
              className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-gold/80 to-gold-muted text-background"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-3.5 w-3.5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 8l10-5 10 5-10 5L2 8z" />
                <path d="M2 16l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Screen<span className="text-gold">Range</span>
            </span>
          </Link>
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted sm:text-sm">
            A community-built cinema journal. Rate performances, track screen
            time, and find out who really stole the show.
          </p>
          <p className="mt-3 text-[11px] text-muted sm:text-xs">
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-muted sm:text-sm">
          <Link
            href="/"
            className="transition hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/rankings"
            className="transition hover:text-foreground"
          >
            Top performances
          </Link>
          <Link
            href="/privacy"
            className="transition hover:text-foreground"
          >
            Privacy
          </Link>
        </nav>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-[11px] text-muted sm:px-6 sm:text-xs lg:px-8">
          © {new Date().getFullYear()} ScreenRange · Community ratings &amp;
          reviews.
        </div>
      </div>
    </footer>
  );
}