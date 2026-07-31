import { useQuery } from "@tanstack/react-query"

import { getDayLogs } from "@/api/log"
import ErrorState from "@/components/common/ErrorState"
import { Spinner } from "@/components/ui/spinner"
import { toISODate } from "@/lib/date"

import MealEntryRow from "../today/components/MealEntryRow"

export default function DayLogDetails({ date }: { date: Date }) {
  const { data, isPending, isError } = useQuery({
    queryKey: ["day-log", toISODate(date)],
    queryFn: () => getDayLogs(date),
  })

  const heading = date.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  // today is still in progress — never label it a miss until the day is over
  const isToday = toISODate(date) === toISODate(new Date())

  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-medium">{heading}</span>
        {data &&
          data.meals.length > 0 &&
          (data.hitGoal ? (
            <span className="text-xs font-medium text-emerald-500">
              Goal hit
            </span>
          ) : isToday ? (
            <span className="text-xs font-medium text-primary">In progress</span>
          ) : (
            <span className="text-xs font-medium text-muted-foreground">
              Goal missed
            </span>
          ))}
      </div>

      {isPending ? (
        <div className="flex justify-center py-6">
          <Spinner className="size-6" />
        </div>
      ) : isError ? (
        <ErrorState message="Couldn't load this day." />
      ) : data.meals.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          No meals logged.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {data.meals.map((entry) => (
              <MealEntryRow key={entry.id} entry={entry} />
            ))}
          </div>
          <div className="flex justify-between border-t pt-2 text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-semibold">
              {data.nutrition.calories.toLocaleString()} kcal ·{" "}
              {data.nutrition.proteinG}g protein
            </span>
          </div>
        </>
      )}
    </div>
  )
}
