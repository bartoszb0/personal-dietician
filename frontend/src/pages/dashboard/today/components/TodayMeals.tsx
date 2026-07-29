import type { DailyLogEntry } from "@/types/log"

import AddMeal from "./AddMeal"
import MealRow from "./MealRow"

export default function TodayMeals({ meals }: { meals: DailyLogEntry[] }) {
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
            <MealRow
              key={meal.id}
              meal={meal}
              onSelect={() => console.log(meal.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
