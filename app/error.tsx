"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen text-foreground">
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-5xl">⚠️</p>
        <h1 className="mt-4 text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-muted">
          We couldn&apos;t load this page. Please try again in a moment.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-md bg-brand px-5 py-2 font-medium hover:bg-brand-hover"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md border border-border px-5 py-2 hover:bg-surface-hover"
          >
            Home
          </Link>
        </div>
      </main>
    </div>
  );
}