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
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex items-center gap-3 sm:gap-6">
        <Link href="/" className="text-xl font-bold sm:text-2xl">
          ScreenRange
        </Link>
        <Link
          href="/rankings"
          className="text-xs text-neutral-400 hover:text-white sm:text-sm"
        >
          Top performances
        </Link>
      </div>
      <AuthButton userName={userName} />
    </header>
  );
}