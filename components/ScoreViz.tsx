// components/ScoreViz.tsx
// Two visual treatments for the 1-10 dimension scores.
// `ScoreBar` is used in result cards (compact, four in a row).
// `ScoreDots` is used in the inventory rows (more reference-y).

interface ScoreBarProps {
  label: string;
  value: number; // 1-10
  size?: "sm" | "md";
}

export function ScoreBar({ label, value, size = "md" }: ScoreBarProps) {
  const pct = Math.max(0, Math.min(10, value)) * 10;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className={`font-medium text-ink-muted ${size === "sm" ? "text-[11px]" : "text-xs"}`}>
          {label}
        </span>
        <span className={`tabular-nums font-mono font-medium text-ink ${size === "sm" ? "text-[11px]" : "text-xs"}`}>
          {value}/10
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-canvas-off">
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface ScoreDotsProps {
  label: string;
  value: number; // 1-10
}

export function ScoreDots({ label, value }: ScoreDotsProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm font-semibold tabular-nums text-ink">{value}</span>
        <div className="flex gap-0.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className={`h-3 w-1 rounded-sm ${
                i < value ? "bg-brand" : "bg-line"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
