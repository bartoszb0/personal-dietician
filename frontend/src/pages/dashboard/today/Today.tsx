import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { getDayLogs } from "@/api/log"
import { getCurrentNutritionTarget } from "@/api/nutrition"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import { toISODate } from "@/lib/date"

import { MacroBars } from "./components/MacroBars"
import { NutritionRings } from "./components/NutritionRings"
import TodayMeals from "./components/TodayMeals"
import { ViewToggle, type View } from "./components/ViewToggle"

const EMPTY_NUTRITION = { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }

export default function Today() {
  const [view, setView] = useState<View>("remaining")
  const today = new Date()

  const { data: target, isPending } = useQuery({
    queryKey: ["current-target"],
    queryFn: () => getCurrentNutritionTarget(),
  })

  const { data: dayLog } = useQuery({
    queryKey: ["day-log", toISODate(today)],
    queryFn: () => getDayLogs(today),
  })

  if (isPending) return <LoadingSpinner />
  if (!target) {
    return (
      <div className="p-6 text-sm text-muted-foreground">No target yet.</div>
    )
  }

  // consumed = today's totals; falls back to zeros until the day log loads
  const consumed = dayLog?.nutrition ?? EMPTY_NUTRITION

  return (
    <div className="flex flex-col gap-8 p-6">
      <ViewToggle value={view} onChange={setView} />
      <NutritionRings target={target} consumed={consumed} view={view} />
      <MacroBars target={target} consumed={consumed} />
      <TodayMeals />
    </div>
  )
}
