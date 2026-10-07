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

  return (
    <div className="card p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
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
        <span className="chip">
          {hasReview ? "editing" : "new"}
        </span>
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={1000}
          rows={6}
          placeholder="What did you think of this film? (10 to 1000 characters)"
          className="textarea min-h-[160px] p-4 text-sm leading-relaxed sm:text-[15px]"
        />
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-border bg-surface/90 px-2 py-0.5 text-[11px] font-semibold text-muted backdrop-blur sm:text-xs">
          <span
            className={
              charCount > 900
                ? "text-rose-400"
                : charCount > 750
                  ? "text-amber-400"
                  : "text-foreground/80"
            }
          >
            {charCount}
          </span>
          <span className="text-muted"> / 1000</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          type="button"
          disabled={isPending || text.trim().length < 10}
          onClick={handleSave}
          className="btn btn-gold text-xs sm:text-sm"
        >
          {isPending ? "…" : hasReview ? "Update review" : "Post review"}
        </button>
        {hasReview && (
          <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="btn border-rose-500/30 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-55 text-xs sm:text-sm"
          >
            Delete
          </button>
        )}
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
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-rose-500/10 text-rose-400"
          }`}
        >
          {status.text}
        </p>
      )}
    </div>
  );
}
