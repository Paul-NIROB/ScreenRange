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
      <p className="mt-2 text-xs text-neutral-500">
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
    <div className="mt-2">
      <label className="text-xs text-neutral-400">
        Your screen-time estimate (minutes)
      </label>
      <div className="mt-1 flex gap-1">
        <input
          type="number"
          min={1}
          max={300}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. 45"
          className="w-full rounded bg-neutral-800 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-purple-500"
        />
        <button
          type="button"
          disabled={isPending || value === ""}
          onClick={handleSave}
          className="rounded bg-neutral-700 px-2 py-1 text-xs hover:bg-neutral-600 disabled:opacity-50"
        >
          Save
        </button>
      </div>
      {message && (
        <p
          className={`mt-1 text-xs ${
            message === "Saved!" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}