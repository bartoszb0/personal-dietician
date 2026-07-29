import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { getDayLogs } from "@/api/log"
import { getCurrentNutritionTarget } from "@/api/nutrition"
import ErrorState from "@/components/common/ErrorState"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import { toISODate } from "@/lib/date"

import { MacroBars } from "./components/MacroBars"
import { NutritionRings } from "./components/NutritionRings"
import TodayMeals from "./components/TodayMeals"
import { ViewToggle, type View } from "./components/ViewToggle"

export default function Today() {
  const [view, setView] = useState<View>("remaining")
  const today = new Date()

  const {
    data: target,
    isPending: targetPending,
    isError: targetError,
  } = useQuery({
    queryKey: ["current-target"],
    queryFn: () => getCurrentNutritionTarget(),
  })

  const {
    data: dayLog,
    isPending: dayLogPending,
    isError: dayLogError,
  } = useQuery({
    queryKey: ["day-log", toISODate(today)],
    queryFn: () => getDayLogs(today),
  })

  if (targetPending || dayLogPending) return <LoadingSpinner />
  if (targetError || dayLogError) {
    return <ErrorState message="Couldn't load today's progress." />
  }
  if (!target) {
    return (
      <div className="p-6 text-sm text-muted-foreground">No target yet.</div>
    )
  }
  if (!dayLog) return null // narrowing: unreachable past the guards above

  const consumed = dayLog.nutrition

  return (
    <div className="flex flex-col gap-8 p-6">
      <ViewToggle value={view} onChange={setView} />
      <NutritionRings target={target} consumed={consumed} view={view} />
      <MacroBars target={target} consumed={consumed} />
      <TodayMeals meals={dayLog.meals} />
    </div>
  )
}
