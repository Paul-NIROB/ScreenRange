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
    <div className="w-full">
      <label className="text-xs font-medium text-muted sm:text-sm">
        Report screen time
      </label>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <div className="relative flex min-w-0 flex-1">
          <input
            type="number"
            min={1}
            max={300}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 45"
            className="input w-full min-w-0 pr-10 py-2 sm:py-2.5 text-sm sm:text-[0.95rem]"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold uppercase tracking-wider text-muted sm:text-xs">
            min
          </span>
        </div>
        <button
          type="button"
          disabled={isPending || value === ""}
          onClick={handleSave}
          className="btn btn-gold py-2 text-xs sm:text-sm"
        >
          {isPending ? "…" : "Save"}
        </button>
      </div>
      {message && (
        <p
          className={`mt-3 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
            message === "Saved!"
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-rose-500/10 text-rose-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
