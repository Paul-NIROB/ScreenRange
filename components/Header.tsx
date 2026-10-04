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
    <header className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
      <Link href="/" className="text-2xl font-bold">
        ScreenRange
      </Link>
      <AuthButton userName={userName} />
    </header>
  );
}