import Link from "next/link";
import AuthButton from "./AuthButton";
import { createClient } from "../utils/supabase/server";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;
  const userName = user
    ? (user.user_metadata?.full_name ?? user.email ?? "Signed in")
    : null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:gap-6 md:py-4">
        <div className="flex items-center justify-between gap-3 py-3 md:w-auto md:py-0 md:justify-start">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 focus:outline-none"
            aria-label="ScreenRange — home"
          >
            <span
              aria-hidden
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold text-background shadow-[0_0_20px_-8px_rgba(234,190,85,0.6)] sm:h-9 sm:w-9"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 7h18v12H3z" />
                <path d="M3 11h18" opacity="0.55" />
                <path d="M7 3L9 7M17 3L15 7M12 3L11 7" />
                <path d="M8 15l1.5 1.5L13 13" />
              </svg>
            </span>
            <span className="font-display text-lg font-bold tracking-tight sm:text-xl">
              Screen<span className="text-gold">Range</span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 md:hidden">
            <Link
              href="/#search"
              aria-label="Search"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:bg-surface-hover hover:text-foreground focus:outline-none"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-[18px] w-[18px]"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </Link>
            <AuthButton userName={userName} />
          </div>
        </div>

        <nav
          aria-label="Primary"
          className="scrollbar-none -mx-4 flex items-center gap-1 overflow-x-auto px-4 pb-3 md:static md:mx-0 md:overflow-visible md:px-0 md:pb-0 sm:-mx-6 sm:px-6"
        >
          <Link
            href="/#films"
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-hover hover:text-gold focus:outline-none sm:px-3.5"
          >
            Films
          </Link>
          <Link
            href="/rankings"
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-hover hover:text-gold focus:outline-none sm:px-3.5"
          >
            Rankings
          </Link>
        </nav>

        <div className="hidden shrink-0 items-center gap-1.5 sm:gap-3 md:flex">
          <Link
            href="/#search"
            aria-label="Search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted transition hover:bg-surface-hover hover:text-foreground focus:outline-none"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </Link>
          <AuthButton userName={userName} />
        </div>
      </div>
    </header>
  );
}
