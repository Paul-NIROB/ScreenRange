"use client";

import { useState, useTransition } from "react";
import { rateMovie } from "../app/title/[id]/actions";

const SCORE_COLORS = [
  { score: 1, red: 239, green: 68, blue: 68 },
  { score: 35, red: 250, green: 204, blue: 21 },
  { score: 68, red: 34, green: 197, blue: 94 },
  { score: 100, red: 59, green: 130, blue: 246 },
];

function getScoreColor(score: number) {
  const upperIndex = SCORE_COLORS.findIndex((stop) => score <= stop.score);
  const upper = SCORE_COLORS[Math.max(upperIndex, 1)];
  const lower = SCORE_COLORS[Math.max(upperIndex - 1, 0)];
  const progress = (score - lower.score) / (upper.score - lower.score);
  const red = Math.round(lower.red + (upper.red - lower.red) * progress);
  const green = Math.round(
    lower.green + (upper.green - lower.green) * progress
  );
  const blue = Math.round(lower.blue + (upper.blue - lower.blue) * progress);

  return `rgb(${red}, ${green}, ${blue})`;
}

function getScoreDescription(score: number) {
  if (score < 25) return "A rough watch";
  if (score < 50) return "Not quite there";
  if (score < 70) return "A mixed bag";
  if (score < 85) return "A good watch";
  if (score < 95) return "A great movie";
  return "That’s a Range(d) movie!";
}

export default function MovieRangeScoreControl({
  titleId,
  averageScore,
  ratingCount,
  initialScore,
  isLoggedIn,
}: {
  titleId: number;
  averageScore: number;
  ratingCount: number;
  initialScore: number | null;
  isLoggedIn: boolean;
}) {
  const [score, setScore] = useState(initialScore ?? 50);
  const [savedScore, setSavedScore] = useState(initialScore);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const scoreColor = getScoreColor(score);

  function handleRate() {
    setStatus(null);
    startTransition(async () => {
      const result = await rateMovie(titleId, score);
      if (result.error) {
        setStatus({ type: "error", message: result.error });
      } else {
        setSavedScore(score);
        setStatus({ type: "success", message: "Movie-RangeScore saved." });
      }
    });
  }

  return (
    <section className="card flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <p className="chip">
          <span className="text-gold" aria-hidden>
            ★
          </span>
          Movie-RangeScore
        </p>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p
            className="font-display text-3xl font-bold tracking-tight"
            style={{ color: ratingCount > 0 ? getScoreColor(averageScore) : undefined }}
          >
            {ratingCount > 0 ? averageScore.toFixed(1) : "—"}
            <span className="ml-1 text-base font-medium text-muted">/ 100</span>
          </p>
          <p className="text-sm text-muted">
            {ratingCount} {ratingCount === 1 ? "rating" : "ratings"}
          </p>
        </div>
        <p className="mt-1 text-sm text-muted">
          The community&apos;s score for the movie overall.
        </p>
      </div>

      <div className="w-full sm:max-w-sm">
        {!isLoggedIn ? (
          <p className="text-sm text-muted">
            Sign in to give this movie a Movie-RangeScore.
          </p>
        ) : (
          <>
            <label
              htmlFor={`movie-range-score-${titleId}`}
              className="flex items-center justify-between gap-3 text-sm font-medium"
            >
              <span>
                {savedScore === null ? "Your rating" : "Your Movie-RangeScore"}
              </span>
              <span style={{ color: scoreColor }} className="font-bold">
                {score}/100
              </span>
            </label>
            <input
              id={`movie-range-score-${titleId}`}
              type="range"
              min={1}
              max={100}
              step={1}
              value={score}
              onChange={(event) => setScore(Number(event.target.value))}
              disabled={isPending}
              className="movie-range-slider mt-3 w-full disabled:opacity-55"
              style={{ "--movie-score-color": scoreColor } as React.CSSProperties}
              aria-valuetext={`${score} out of 100`}
            />
            <div className="mt-1 flex justify-between text-xs">
              <span>1</span>
              <span style={{ color: scoreColor }} className="font-medium">
                {getScoreDescription(score)}
              </span>
              <span>100</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleRate}
                disabled={isPending}
                className="btn btn-gold text-xs sm:text-sm"
              >
                {isPending
                  ? "Saving…"
                  : savedScore === null
                    ? "Rate movie"
                    : "Update rating"}
              </button>
              {savedScore !== null && (
                <span className="text-xs text-muted">
                  Saved: {savedScore}/100
                </span>
              )}
            </div>
          </>
        )}
        {status && (
          <p
            role="status"
            className={`mt-3 text-sm ${
              status.type === "success"
                ? "text-emerald-400"
                : "text-rose-400"
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </section>
  );
}
