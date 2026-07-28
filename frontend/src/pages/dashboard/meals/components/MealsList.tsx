import { useQuery } from "@tanstack/react-query"
import { LayoutGrid, List } from "lucide-react"
import { useState } from "react"

import { getMeals } from "@/api/meals"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { Meal } from "@/types/meal"

import MealCard, { type MealView } from "./MealCard"

type SortKey = "recent" | "calories" | "protein" | "name"

const SORT_LABELS: Record<SortKey, string> = {
  recent: "Recently added",
  calories: "Calories",
  protein: "Protein",
  name: "Name (A–Z)",
}

function sortMeals(meals: Meal[], key: SortKey): Meal[] {
  const copy = [...meals]
  switch (key) {
    case "calories":
      return copy.sort((a, b) => b.calories - a.calories)
    case "protein":
      return copy.sort((a, b) => b.proteinG - a.proteinG)
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name))
    case "recent":
    default:
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
}

export default function MealsList() {
  const [view, setView] = useState<MealView>("grid")
  const [sort, setSort] = useState<SortKey>("recent")

  const { data, isPending, isError } = useQuery({
    queryKey: ["meals"],
    queryFn: () => getMeals(),
  })

  if (isPending) return <LoadingSpinner />
  if (isError) {
    return <p className="text-sm text-destructive">Couldn't load meals.</p>
  }
  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No meals yet — add your first one.
      </p>
    )
  }

  const meals = sortMeals(data, sort)

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">
          {data.length} meal{data.length === 1 ? "" : "s"}
        </span>

        <div className="flex items-center gap-2">
          <Select
            items={SORT_LABELS}
            value={sort}
            onValueChange={(value) => setSort(value as SortKey)}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {SORT_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="inline-flex rounded-lg bg-muted p-0.5">
            {(["grid", "list"] as const).map((option) => {
              const Icon = option === "grid" ? LayoutGrid : List
              return (
                <button
                  key={option}
                  type="button"
                  aria-label={`${option} view`}
                  onClick={() => setView(option)}
                  className={cn(
                    "rounded-md p-1.5 transition-colors",
                    view === option
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-2 gap-3">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} view="grid" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} view="list" />
          ))}
        </div>
      )}
    </div>
  )
}
