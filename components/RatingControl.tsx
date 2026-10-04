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
      <p className="mt-2 text-xs text-neutral-500">
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

  return (
    <div className="mt-2">
      <p className="text-xs text-neutral-400">
        {score ? `Your rating: ${score}/10` : "Rate this performance"}
      </p>
      <div className="mt-1 grid grid-cols-5 gap-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            disabled={isPending}
            onClick={() => handleRate(n)}
            className={`rounded py-1 text-xs ${
              score === n
                ? "bg-purple-600 text-white"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      {message && <p className="mt-1 text-xs text-red-400">{message}</p>}
    </div>
  );
}