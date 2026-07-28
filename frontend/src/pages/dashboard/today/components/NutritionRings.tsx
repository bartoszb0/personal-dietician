import type { NutritionTarget } from "@/types/nutrition"

import { CircularProgress } from "./CircularProgress"

import type { View } from "./ViewToggle"

function RingLabel({
  primary,
  secondary,
}: {
  primary: string
  secondary: string
}) {
  return (
    <>
      <span className="text-2xl font-bold">{primary}</span>
      <span className="text-xs text-muted-foreground">{secondary}</span>
    </>
  )
}

export function NutritionRings({
  target,
  consumed,
  view,
}: {
  target: NutritionTarget
  consumed: NutritionTarget
  view: View
}) {
  return (
    <div className="flex justify-around gap-4">
      <div className="flex flex-col items-center gap-2">
        <CircularProgress
          mode="band"
          value={consumed.calories}
          max={target.calories}
        >
          {view === "remaining" ? (
            <RingLabel
              primary={(target.calories - consumed.calories).toLocaleString()}
              secondary="kcal left"
            />
          ) : (
            <RingLabel
              primary={consumed.calories.toLocaleString()}
              secondary={`of ${target.calories.toLocaleString()}`}
            />
          )}
        </CircularProgress>
        <span className="text-sm font-medium">Calories</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <CircularProgress
          mode="floor"
          value={consumed.proteinG}
          max={target.proteinG}
        >
          {view === "remaining" ? (
            <RingLabel
              primary={String(Math.max(target.proteinG - consumed.proteinG, 0))}
              secondary="g left"
            />
          ) : (
            <RingLabel
              primary={String(consumed.proteinG)}
              secondary={`of ${target.proteinG} g`}
            />
          )}
        </CircularProgress>
        <span className="text-sm font-medium">Protein</span>
      </div>
    </div>
  )
}
