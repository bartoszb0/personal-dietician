// Low-emphasis linear bar for carbs/fat — guidance, not gates, so it stays muted
// (no status color, no ring) to keep the calorie/protein rings the focus.
export function MacroBar({
  label,
  value,
  max,
}: {
  label: string
  value: number
  max: number
}) {
  const ratio = max > 0 ? Math.min(value / max, 1) : 0

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground">
          {value} / {max} g
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted-foreground/15">
        <div
          className="h-full rounded-full bg-muted-foreground/50 transition-all duration-500"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  )
}
