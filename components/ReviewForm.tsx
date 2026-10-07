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
      <p className="mt-3 text-sm text-muted">
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

  const charCount = text.length;
  const progress = Math.min((charCount / 1000) * 100, 100);
  const progressColor =
    charCount < 10
      ? "bg-muted/30"
      : charCount > 900
        ? "bg-danger"
        : charCount > 750
          ? "bg-gold"
          : "bg-gold/80";

  return (
    <div className="card p-4 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight sm:text-xl">
            {hasReview ? "Your review" : "Write a review"}
          </p>
          <p className="mt-0.5 text-xs text-muted sm:text-sm">
            {hasReview
              ? "Feel free to edit what you wrote."
              : "Share your take with the community."}
          </p>
        </div>
        <span className="chip">{hasReview ? "editing" : "new"}</span>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={1000}
        rows={5}
        placeholder="What did you think of this film? (10 to 1000 characters)"
        className="textarea"
      />
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-hover">
        <div
          className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          type="button"
          disabled={isPending || text.trim().length < 10}
          onClick={handleSave}
          className="btn btn-gold px-4 py-2 text-sm disabled:cursor-not-allowed sm:text-[0.95rem]"
        >
          {isPending ? "…" : hasReview ? "Update review" : "Post review"}
        </button>
        {hasReview && (
          <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="btn border-danger/30 bg-danger/5 text-danger hover:bg-danger/10 px-4 py-2 text-sm disabled:cursor-not-allowed sm:text-[0.95rem]"
          >
            Delete
          </button>
        )}
        <span className="ml-auto text-xs font-semibold text-muted sm:text-sm">
          <span
            className={
              charCount < 10
                ? "text-muted"
                : charCount > 900
                  ? "text-danger"
                  : "text-foreground"
            }
          >
            {charCount}
          </span>
          /1000
        </span>
      </div>
      {text.trim().length > 0 && text.trim().length < 10 && (
        <p className="mt-3 text-xs text-muted sm:text-sm">
          Minimum 10 characters. Add {10 - text.trim().length} more.
        </p>
      )}
      {status && (
        <p
          className={`mt-4 rounded-lg px-3 py-2 text-sm font-medium ${
            status.type === "ok"
              ? "bg-success/10 text-success"
              : "bg-danger/10 text-danger"
          }`}
        >
          {status.text}
        </p>
      )}
    </div>
  );
}