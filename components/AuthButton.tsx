"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";

function initialsOf(name: string | null): string {
  if (!name) return "·";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "·";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function AuthButton({ userName }: { userName: string | null }) {
  const router = useRouter();

  async function signIn() {
    const supabase = createClient();
    const next = encodeURIComponent(window.location.pathname);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${next}`,
      },
    });
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  if (userName) {
    const initials = initialsOf(userName);
    const display =
      userName.includes("@") && userName.split("@")[0].length > 0
        ? userName.split("@")[0]
        : userName;

    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2.5 sm:flex">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold/85 to-[#b7912f] text-[11px] font-bold text-background ring-1 ring-white/10">
            {initials}
          </span>
          <span className="max-w-[160px] truncate text-sm font-medium text-muted sm:text-foreground/85">
            {display}
          </span>
        </div>
        <button
          onClick={signOut}
          type="button"
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition hover:border-gold/40 hover:bg-surface-hover hover:text-gold focus:outline-none sm:px-4 sm:py-2 sm:text-sm"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signIn}
      type="button"
      className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background transition hover:bg-white focus:outline-none sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden>
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          opacity="0.92"
        />
        <path
          fill="currentColor"
          d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
          opacity="0.78"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
          opacity="0.62"
        />
      </svg>
      <span className="hidden sm:inline">Sign in with Google</span>
      <span className="sm:hidden">Sign in</span>
    </button>
  );
}
