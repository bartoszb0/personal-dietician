import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { getMeal } from "@/api/meals"
import { Dialog } from "@/components/ui/dialog"
import { MealDialogContent } from "@/pages/dashboard/meals/components/MealDialog"
import type { DailyLogEntry } from "@/types/log"

import MealRow from "./MealRow"

export default function MealEntryRow({ entry }: { entry: DailyLogEntry }) {
  const [open, setOpen] = useState(false)

  const { data: meal } = useQuery({
    queryKey: ["meal", entry.mealId],
    queryFn: () => getMeal(entry.mealId!),
    enabled: open && !!entry.mealId,
    retry: false,
  })

  const details = {
    name: entry.name,
    calories: entry.calories,
    proteinG: entry.proteinG,
    carbsG: entry.carbsG,
    fatG: entry.fatG,
    ingredients: meal?.ingredients ?? null,
    recipe: meal?.recipe ?? null,
  }

  return (
    <>
      <MealRow meal={entry} onSelect={() => setOpen(true)} />
      <Dialog open={open} onOpenChange={setOpen}>
        <MealDialogContent details={details} mealId={meal?.id} />
      </Dialog>
    </>
  )
}
