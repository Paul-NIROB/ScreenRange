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

  type Tone = {
    base: string;
    active: string;
  };

  const buttonTone = (n: number): Tone => {
    if (n >= 8) {
      return {
        base:
          "bg-surface-hover text-emerald-400 hover:bg-emerald-500/15 hover:text-emerald-300 border border-transparent hover:border-emerald-500/30",
        active:
          "bg-emerald-500 text-white border border-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]",
      };
    }
    if (n >= 5) {
      return {
        base:
          "bg-surface-hover text-amber-400 hover:bg-amber-400/15 hover:text-amber-300 border border-transparent hover:border-amber-400/30",
        active:
          "bg-amber-400 text-amber-950 border border-amber-400 shadow-[0_0_0_3px_rgba(251,191,36,0.18)]",
      };
    }
    return {
      base:
        "bg-surface-hover text-rose-400 hover:bg-rose-500/15 hover:text-rose-300 border border-transparent hover:border-rose-500/30",
      active:
        "bg-rose-500 text-white border border-rose-500 shadow-[0_0_0_3px_rgba(244,63,94,0.18)]",
    };
  };

  const activeLabelColor =
    score == null
      ? "text-muted"
      : score >= 8
        ? "text-emerald-400"
        : score >= 5
          ? "text-amber-400"
          : "text-rose-400";

  return (
    <div className="w-full">
      <p className="text-xs font-medium text-muted sm:text-sm">
        {score ? (
          <span>
            Your rating:{" "}
            <span className={`font-bold ${activeLabelColor}`}>{score}/10</span>
          </span>
        ) : (
          "Rate this performance"
        )}
      </p>
      <div
        className="mt-2.5 grid grid-cols-5 gap-1.5 sm:gap-2"
        role="group"
        aria-label="Performance rating"
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const tone = buttonTone(n);
          const pressed = score === n;
          return (
            <button
              key={n}
              type="button"
              disabled={isPending}
              aria-label={`Rate ${n} out of 10`}
              aria-pressed={pressed}
              onClick={() => handleRate(n)}
              className={`min-h-10 rounded-lg px-1 py-2 text-sm font-bold transition-all duration-150 active:scale-[0.97] focus:outline-none disabled:cursor-not-allowed disabled:opacity-55 sm:rounded-xl sm:px-1.5 sm:text-[15px] ${
                pressed ? tone.active : tone.base
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
      {message && (
        <p className="mt-3 rounded-lg bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-400">
          {message}
        </p>
      )}
    </div>
  );
}
