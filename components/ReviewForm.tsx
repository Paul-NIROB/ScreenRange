"use client";

import { useState, useTransition } from "react";
import { saveReview, deleteReview } from "../app/title/[id]/actions";

export default function ReviewForm({
  titleId,
  initialBody,
  isLoggedIn,
}: {
  titleId: number;
  initialBody: string | null;
  isLoggedIn: boolean;
}) {
  const [text, setText] = useState(initialBody ?? "");
  const [hasReview, setHasReview] = useState(initialBody !== null);
  const [status, setStatus] = useState<{
    type: "ok" | "error";
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <p className="mt-3 text-sm text-neutral-500">
        Sign in to write a review.
      </p>
    );
  }

  function handleSave() {
    setStatus(null);
    startTransition(async () => {
      const result = await saveReview(titleId, text);
      if (result.error) {
        setStatus({ type: "error", text: result.error });
      } else {
        setHasReview(true);
        setStatus({ type: "ok", text: "Saved!" });
      }
    });
  }

  function handleDelete() {
    setStatus(null);
    startTransition(async () => {
      const result = await deleteReview(titleId);
      if (result.error) {
        setStatus({ type: "error", text: result.error });
      } else {
        setText("");
        setHasReview(false);
        setStatus({ type: "ok", text: "Review deleted." });
      }
    });
  }

  return (
    <div className="mt-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={1000}
        rows={4}
        placeholder="What did you think of this film? (10 to 1000 characters)"
        className="w-full rounded-lg bg-neutral-900 p-3 text-sm outline-none focus:ring-1 focus:ring-purple-500"
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          disabled={isPending || text.trim().length < 10}
          onClick={handleSave}
          className="rounded-md bg-purple-600 px-4 py-1.5 text-sm font-medium hover:bg-purple-500 disabled:opacity-50"
        >
          {hasReview ? "Update review" : "Post review"}
        </button>
        {hasReview && (
          <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="rounded-md border border-neutral-700 px-4 py-1.5 text-sm hover:bg-neutral-800 disabled:opacity-50"
          >
            Delete
          </button>
        )}
        <span className="ml-auto text-xs text-neutral-500">
          {text.length}/1000
        </span>
      </div>
      {status && (
        <p
          className={`mt-2 text-sm ${
            status.type === "ok" ? "text-green-400" : "text-red-400"
          }`}
        >
          {status.text}
        </p>
      )}
    </div>
  );
}