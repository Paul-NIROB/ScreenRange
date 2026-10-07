"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";

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
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="hidden text-neutral-300 sm:inline">{userName}</span>
        <button
          onClick={signOut}
          className="rounded-md border border-border px-3 py-1.5 hover:bg-surface-hover"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signIn}
      className="rounded-md bg-white px-4 py-1.5 text-sm font-medium text-black hover:bg-neutral-200"
    >
      Sign in with Google
    </button>
  );
}