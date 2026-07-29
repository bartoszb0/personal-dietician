import SwipeToDelete from "@/components/common/SwipeToDelete"
import type { DailyLogEntry } from "@/types/log"

import { removeLog } from "@/api/log"
import { toISODate } from "@/lib/date"
import { toastApiError } from "@/lib/toast-api-error"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import AddMeal from "./AddMeal"
import MealRow from "./MealRow"

export default function TodayMeals({ meals }: { meals: DailyLogEntry[] }) {
  const queryClient = useQueryClient()

  const handleRemove = async (mealId: string) => {
    try {
      await removeLog(mealId)
      await queryClient.invalidateQueries({
        queryKey: ["day-log", toISODate(new Date())],
      })
      toast.success(`Removed the meal`)
    } catch (e) {
      toastApiError(e)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <span className="font-medium">Meals</span>
        <AddMeal />
      </div>

      {meals.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          No meals yet.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          {meals.map((meal) => (
            <SwipeToDelete key={meal.id} onDelete={() => handleRemove(meal.id)}>
              <MealRow meal={meal} onSelect={() => console.log(meal.id)} />
            </SwipeToDelete>
          ))}
        </div>
      )}
    </div>
  )
}
