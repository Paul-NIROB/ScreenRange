"use client";

import { useState, useTransition } from "react";
import { rateRole } from "../app/title/[id]/actions";

export default function RatingControl({
  castRoleId,
  titleId,
  initialScore,
  isLoggedIn,
}: {
  castRoleId: number;
  titleId: number;
  initialScore: number | null;
  isLoggedIn: boolean;
}) {
  const [score, setScore] = useState<number | null>(initialScore);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <p className="mt-2 text-xs text-muted">
        Sign in to rate this performance.
      </p>
    );
  }

  function handleRate(value: number) {
    const previous = score;
    setScore(value);
    setMessage(null);

    startTransition(async () => {
      const result = await rateRole(castRoleId, titleId, value);
      if (result.error) {
        setScore(previous);
        setMessage(result.error);
      }
    });
  }

  const buttonTone = (n: number) => {
    if (n >= 8) {
      return {
        base: "bg-success/8 text-success hover:bg-success/15 hover:text-success border-success/30",
        active:
          "bg-success text-background border-success shadow-[0_0_0_3px_rgba(49,196,141,0.18)]",
        tone: "text-success",
      };
    }
    if (n >= 5) {
      return {
        base: "bg-gold/8 text-gold hover:bg-gold/18 hover:text-gold-soft border-gold/35",
        active:
          "bg-gold text-background border-gold shadow-[0_0_0_3px_rgba(234,190,85,0.18)]",
        tone: "text-gold",
      };
    }
    return {
      base: "bg-danger/8 text-danger hover:bg-danger/16 hover:text-danger border-danger/30",
      active:
        "bg-danger text-background border-danger shadow-[0_0_0_3px_rgba(239,100,97,0.18)]",
      tone: "text-danger",
    };
  };

  const activeTone =
    score != null ? buttonTone(score).tone : "text-muted";

  return (
    <div className="mt-1">
      <p className="text-xs font-medium text-muted sm:text-sm">
        {score ? (
          <span>
            Your rating: <span className={`font-bold ${activeTone}`}>{score}/10</span>
          </span>
        ) : (
          "Rate this performance"
        )}
      </p>
      <div className="mt-2.5 grid grid-cols-5 gap-1.5 sm:gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const tone = buttonTone(n);
          return (
            <button
              key={n}
              type="button"
              disabled={isPending}
              onClick={() => handleRate(n)}
              className={`rounded-xl border py-1.5 text-xs font-bold transition-all duration-200 will-change-transform hover:-translate-y-0.5 active:translate-y-0 sm:py-2 sm:text-sm disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${
                score === n ? tone.active : tone.base
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
      {message && (
        <p className="mt-2.5 rounded-lg bg-danger/10 px-2.5 py-1.5 text-xs font-medium text-danger">
          {message}
        </p>
      )}
    </div>
  );
}