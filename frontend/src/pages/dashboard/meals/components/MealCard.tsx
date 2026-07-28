import { ImageIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import type { Meal } from "@/types/meal"

export type MealView = "grid" | "list"

function Macros({ meal }: { meal: Meal }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <span>
        <span className="font-medium text-foreground">{meal.proteinG}g</span>{" "}
        protein
      </span>
      <span>
        <span className="font-medium text-foreground">{meal.carbsG}g</span> carbs
      </span>
      <span>
        <span className="font-medium text-foreground">{meal.fatG}g</span> fat
      </span>
    </div>
  )
}

function Calories({ meal }: { meal: Meal }) {
  return (
    <div className="shrink-0 text-sm whitespace-nowrap">
      <span className="font-bold">{meal.calories.toLocaleString()}</span>
      <span className="text-muted-foreground"> kcal</span>
    </div>
  )
}

export default function MealCard({
  meal,
  view,
}: {
  meal: Meal
  view: MealView
}) {
  if (view === "list") {
    return (
      <Card className="flex-row items-center gap-3 p-3">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <ImageIcon className="size-6" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-medium">{meal.name}</h3>
            <Calories meal={meal} />
          </div>
          <Macros meal={meal} />
        </div>
      </Card>
    )
  }

  return (
    <Card className="gap-0 p-0">
      <div className="flex aspect-square items-center justify-center bg-muted text-muted-foreground">
        <ImageIcon className="size-8" />
      </div>
      <div className="flex min-w-0 flex-col gap-1 p-3">
        <h3 className="truncate font-medium">{meal.name}</h3>
        <Calories meal={meal} />
        <div className="mt-1">
          <Macros meal={meal} />
        </div>
      </div>
    </Card>
  )
}
