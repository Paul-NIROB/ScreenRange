import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-800 px-6 py-8 text-center text-xs text-neutral-500">
      <p>
        ScreenRange is a portfolio project. Ratings and reviews come from the
        community.
      </p>
      <p className="mt-2">
        This product uses the TMDB API but is not endorsed or certified by
        TMDB.
      </p>
      <p className="mt-2">
        <Link href="/privacy" className="underline hover:text-neutral-300">
          Privacy
        </Link>
      </p>
    </footer>
  );
}