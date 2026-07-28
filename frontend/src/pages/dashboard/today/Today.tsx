import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { getCurrentNutritionTarget } from "@/api/nutrition"
import LoadingSpinner from "@/components/common/LoadingSpinner"

import { MacroBars } from "./components/MacroBars"
import { NutritionRings } from "./components/NutritionRings"
import TodayMeals from "./components/TodayMeals"
import { ViewToggle, type View } from "./components/ViewToggle"

export default function Today() {
  const [view, setView] = useState<View>("remaining")

  const { data: target, isPending } = useQuery({
    queryKey: ["current-target"],
    queryFn: () => getCurrentNutritionTarget(),
  })

  if (isPending) return <LoadingSpinner />
  if (!target) {
    return (
      <div className="p-6 text-sm text-muted-foreground">No target yet.</div>
    )
  }

  // Consumed is not tracked yet (needs the logging feature) — treat as 0 for now.
  const consumed = { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }

  return (
    <div className="flex flex-col gap-8 p-6">
      <ViewToggle value={view} onChange={setView} />
      <NutritionRings target={target} consumed={consumed} view={view} />
      <MacroBars target={target} consumed={consumed} />
      <TodayMeals />
    </div>
  )
}
