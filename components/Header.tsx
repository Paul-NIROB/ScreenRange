import Link from "next/link";
import AuthButton from "./AuthButton";
import { createClient } from "../utils/supabase/server";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName = user
    ? (user.user_metadata?.full_name ?? user.email ?? "Signed in")
    : null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-tight sm:text-2xl"
          >
            Screen<span className="text-gold">Range</span>
          </Link>
          <nav>
            <Link
              href="/rankings"
              className="text-xs text-muted transition hover:text-foreground sm:text-sm"
            >
              Top performances
            </Link>
          </nav>
        </div>
        <AuthButton userName={userName} />
      </div>
    </header>
  );
}