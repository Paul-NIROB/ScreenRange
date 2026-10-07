type Props = {
  average: number | null;
  count: number | null;
  size?: "sm" | "md";
};

type Palette = {
  container: string;
  containerEmpty: string;
  star: string;
  score: string;
  count: string;
  emptyText: string;
};

function paletteForScore(score: number | null): Palette {
  if (score == null || Number.isNaN(score)) {
    return {
      container:
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-hover px-2.5 py-1 sm:px-3 sm:py-1.5",
      containerEmpty: "",
      star: "text-muted",
      score: "text-muted",
      count: "text-muted",
      emptyText: "text-muted",
    };
  }
  if (score >= 8) {
    return {
      container:
        "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 sm:px-3 sm:py-1.5",
      containerEmpty: "",
      star: "text-emerald-400",
      score: "text-emerald-300",
      count: "text-muted",
      emptyText: "",
    };
  }
  if (score >= 5) {
    return {
      container:
        "inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 sm:px-3 sm:py-1.5",
      containerEmpty: "",
      star: "text-amber-400",
      score: "text-amber-300",
      count: "text-muted",
      emptyText: "",
    };
  }
  return {
    container:
      "inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-2.5 py-1 sm:px-3 sm:py-1.5",
    containerEmpty: "",
    star: "text-rose-400",
    score: "text-rose-300",
    count: "text-muted",
    emptyText: "",
  };
}

export default function AverageBadge({ average, count, size = "md" }: Props) {
  const hasScore =
    average != null && !Number.isNaN(average) && Number.isFinite(average);

  if (!hasScore) {
    const pal = paletteForScore(null);
    return (
      <div className={pal.container + pal.containerEmpty}>
        <span className={`${size === "sm" ? "text-xs" : "text-xs sm:text-sm"} font-medium ${pal.emptyText}`}>
          No RangeScore yet
        </span>
      </div>
    );
  }

  const pal = paletteForScore(average);
  const n = Number(count ?? 0);

  return (
    <div className={pal.container}>
      <span
        aria-hidden
        className={`${pal.star} ${size === "sm" ? "text-[13px] leading-none" : "text-sm leading-none sm:text-[15px]"}`}
      >
        ★
      </span>
      <span
        className={`font-bold tabular-nums tracking-tight ${pal.score} ${
          size === "sm" ? "text-xs" : "text-xs sm:text-sm"
        }`}
      >
        {average!.toFixed(1)}
      </span>
      {n >= 0 && (
        <span
          className={`${pal.count} ${size === "sm" ? "text-[11px]" : "text-[11px] sm:text-xs"}`}
        >
          · {n} {n === 1 ? "rating" : "ratings"}
        </span>
      )}
    </div>
  );
}
