type ScoreBadgeProps = {
  avg: number;
  count: number;
};

function getScoreClasses(avg: number): {
  badge: string;
  star: string;
  scoreText: string;
} {
  if (avg >= 8) {
    return {
      badge:
        "bg-emerald-500/10 border-emerald-500/25",
      star: "text-emerald-400",
      scoreText: "text-emerald-400",
    };
  }
  if (avg >= 5) {
    return {
      badge: "bg-amber-500/10 border-amber-500/25",
      star: "text-amber-400",
      scoreText: "text-amber-400",
    };
  }
  return {
    badge: "bg-rose-500/10 border-rose-500/25",
    star: "text-rose-400",
    scoreText: "text-rose-400",
  };
}

export default function ScoreBadge({ avg, count }: ScoreBadgeProps) {
  if (count === 0 || !avg) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-hover px-2.5 py-1 text-xs text-muted">
        No RangeScore yet
      </span>
    );
  }

  const classes = getScoreClasses(avg);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${classes.badge}`}
      aria-label={`RangeScore ${avg.toFixed(1)} out of 10, ${count} ${
        count === 1 ? "rating" : "ratings"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={`h-3 w-3 ${classes.star}`}
        fill="currentColor"
      >
        <path d="M12 2l2.89 5.86L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l7.11-1.41L12 2z" />
      </svg>
      <span>RangeScore</span>
      <span className={classes.scoreText}>{avg.toFixed(1)}</span>
      <span className="text-muted font-normal">
        · {count} {count === 1 ? "rating" : "ratings"}
      </span>
    </span>
  );
}
