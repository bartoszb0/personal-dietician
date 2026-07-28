import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

// "band" = two-sided target (calories: under and over both matter, ±10%).
// "floor" = hit-at-least target (protein: reaching it is success, over is fine).
type Mode = "band" | "floor"
type Status = "under" | "good" | "over"

function statusOf(value: number, max: number, mode: Mode): Status {
  const ratio = max > 0 ? value / max : 0
  if (mode === "floor") return ratio >= 1 ? "good" : "under"
  if (ratio > 1.1) return "over"
  if (ratio >= 0.9) return "good"
  return "under"
}

// Status colors are semantic, not decorative — and the ring never carries meaning
// by color alone (the center label states the numbers too).
const STATUS_COLOR: Record<Status, string> = {
  under: "text-primary",
  good: "text-emerald-500",
  over: "text-destructive",
}

export function CircularProgress({
  value,
  max,
  mode = "floor",
  size = 128,
  strokeWidth = 12,
  children,
}: {
  value: number
  max: number
  mode?: Mode
  size?: number
  strokeWidth?: number
  children?: ReactNode
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = max > 0 ? Math.min(value / max, 1) : 0
  const dashOffset = circumference * (1 - ratio)
  const color = STATUS_COLOR[statusOf(value, max, mode)]

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          className="text-muted-foreground/15"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={cn("transition-all duration-500", color)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  )
}
