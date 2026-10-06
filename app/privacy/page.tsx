import Header from "../../components/Header";

export const metadata = {
  title: "Privacy | ScreenRange",
  description: "How ScreenRange handles your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header />

      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-3xl font-bold">Privacy</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Last updated: 5 October 2026
        </p>

        <p className="mt-6 text-neutral-300">
          ScreenRange is a portfolio project where people rate acting
          performances, report screen time and write reviews. This page
          explains what data it handles.
        </p>

        <h2 className="mt-8 text-xl font-semibold">What we collect</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-neutral-300">
          <li>
            When you sign in with Google, we receive your name and email
            address and a unique account ID. We do not receive your Google
            password.
          </li>
          <li>
            The ratings, screen-time estimates and reviews you submit, linked
            to your account.
          </li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold">What is public</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-neutral-300">
          <li>
            Your reviews are public and show your first name only. Your email
            address is never shown.
          </li>
          <li>
            Ratings and screen times appear only as community averages and
            medians, not tied to your name.
          </li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold">Services we use</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-neutral-300">
          <li>Supabase for the database and sign-in.</li>
          <li>Vercel for hosting.</li>
          <li>
            Google Gemini API to write AI community summaries. Public ratings
            and review text (without names or emails) may be sent to it.
          </li>
          <li>TMDB for movie and cast information and images.</li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold">We do not</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-neutral-300">
          <li>Sell your data or show ads.</li>
          <li>Send marketing email.</li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold">Deleting your data</h2>
        <p className="mt-3 text-neutral-300">
          You can delete your own reviews on each movie page. To delete your
          account and all your data, email{" "}
          <span className="text-purple-300">nirobpaulgetit@gmail.com</span>.
        </p>
      </main>
    </div>
  );
}