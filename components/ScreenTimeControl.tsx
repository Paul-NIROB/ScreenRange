"use client";

import { useState, useTransition } from "react";
import { submitScreenTime } from "../app/title/[id]/actions";

export default function ScreenTimeControl({
  castRoleId,
  titleId,
  initialMinutes,
  isLoggedIn,
}: {
  castRoleId: number;
  titleId: number;
  initialMinutes: number | null;
  isLoggedIn: boolean;
}) {
  const [value, setValue] = useState(
    initialMinutes ? String(initialMinutes) : ""
  );
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <p className="mt-2 text-xs text-muted">
        Sign in to add screen time.
      </p>
    );
  }

  function handleSave() {
    const minutes = Number(value);
    setMessage(null);

    startTransition(async () => {
      const result = await submitScreenTime(castRoleId, titleId, minutes);
      setMessage(result.error ?? "Saved!");
    });
  }

  return (
    <div className="mt-1">
      <label className="text-xs font-medium text-muted sm:text-sm">
        Screen-time estimate
      </label>
      <div className="mt-2.5 flex gap-2">
        <div className="relative flex-1">
          <input
            type="number"
            min={1}
            max={300}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 45"
            className="input pr-10 py-2 text-sm sm:text-[0.95rem]"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-strong">
            min
          </span>
        </div>
        <button
          type="button"
          disabled={isPending || value === ""}
          onClick={handleSave}
          className="btn btn-primary shrink-0 px-4 py-2 text-sm disabled:cursor-not-allowed sm:text-[0.95rem]"
        >
          {isPending ? "…" : "Save"}
        </button>
      </div>
      {message && (
        <p
          className={`mt-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
            message === "Saved!"
              ? "bg-success/10 text-success"
              : "bg-danger/10 text-danger"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}