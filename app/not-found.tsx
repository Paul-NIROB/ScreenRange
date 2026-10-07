import Link from "next/link";
import Header from "../components/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen text-foreground">
      <Header />
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-5xl font-bold text-purple-400">404</p>
        <h1 className="mt-4 text-2xl font-semibold">We couldn&apos;t find that page</h1>
        <p className="mt-2 text-muted">
          The movie or page you&apos;re looking for doesn&apos;t exist, or may
          have moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-md bg-brand px-5 py-2 font-medium hover:bg-brand-hover"
        >
          Back to home
        </Link>
      </main>
    </div>
  );
}