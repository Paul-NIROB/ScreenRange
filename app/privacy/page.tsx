import Header from "../../components/Header";

export const metadata = {
  title: "Privacy | ScreenRange",
  description: "How ScreenRange handles your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen text-foreground">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="card p-6 sm:p-10">
          <span className="chip">Legal</span>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Privacy
          </h1>
          <p className="mt-3 text-sm text-muted sm:text-base">
            Last updated: 5 October 2026
          </p>

          <div className="hairline my-8" />

          <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
            ScreenRange is a portfolio project where people rate acting
            performances, report screen time and write reviews. This page
            explains what data it handles.
          </p>

          <h2 className="mt-10 font-display text-2xl font-semibold sm:text-3xl">
            What we collect
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/85 sm:text-base sm:pl-6">
            <li>
              When you sign in with Google, we receive your name and email
              address and a unique account ID. We do not receive your Google
              password.
            </li>
            <li>
              The RangeScores you submit, screen-time estimates and reviews, linked
              to your account.
            </li>
          </ul>

          <h2 className="mt-10 font-display text-2xl font-semibold sm:text-3xl">
            What is public
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/85 sm:text-base sm:pl-6">
            <li>
              Your reviews are public and show your first name only. Your email
              address is never shown.
            </li>
            <li>
              RangeScores and screen times appear only as community averages and
              medians, not tied to your name.
            </li>
          </ul>

          <h2 className="mt-10 font-display text-2xl font-semibold sm:text-3xl">
            Services we use
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/85 sm:text-base sm:pl-6">
            <li>Supabase for the database and sign-in.</li>
            <li>Vercel for hosting.</li>
            <li>
              Google Gemini API to write AI community summaries. Public RangeScores
              and review text (without names or emails) may be sent to it.
            </li>
            <li>TMDB for movie and cast information and images.</li>
          </ul>

          <h2 className="mt-10 font-display text-2xl font-semibold sm:text-3xl">
            We do not
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/85 sm:text-base sm:pl-6">
            <li>Sell your data or show ads.</li>
            <li>Send marketing email.</li>
          </ul>

          <h2 className="mt-10 font-display text-2xl font-semibold sm:text-3xl">
            Deleting your data
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-foreground/85 sm:text-base">
            You can delete your own reviews on each movie page. To delete your
            account and all your data, email{" "}
            <a
              href="mailto:nirobpaulgetit@gmail.com"
              className="font-medium text-gold underline-offset-4 hover:underline"
            >
              nirobpaulgetit@gmail.com
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}