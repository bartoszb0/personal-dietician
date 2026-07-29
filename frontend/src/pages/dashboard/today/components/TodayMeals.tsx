import { getDayLogs } from "@/api/log"
import { useQuery } from "@tanstack/react-query"

import LoadingSpinner from "@/components/common/LoadingSpinner"
import AddMeal from "./AddMeal"
import MealRow from "./MealRow"

export default function TodayMeals() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["today-logs"],
    queryFn: () => getDayLogs(new Date()),
  })

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <span className="font-medium">Meals</span>
        <AddMeal />
      </div>

      {isPending ? (
        <div className="mt-8 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : isError ? (
        <p className="mt-8 text-center text-sm text-destructive">
          Couldn't load today's meals.
        </p>
      ) : data.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          No meals yet.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          {data.map((meal) => (
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
