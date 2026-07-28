import type { NutritionTarget } from "@/types/nutrition"

import { MacroBar } from "./MacroBar"

export function MacroBars({
  target,
  consumed,
}: {
  target: NutritionTarget
  consumed: NutritionTarget
}) {
  return (
    <div className="flex flex-col gap-3">
      <MacroBar label="Carbs" value={consumed.carbsG} max={target.carbsG} />
      <MacroBar label="Fat" value={consumed.fatG} max={target.fatG} />
    </div>
  )
}
