import { getCalendar } from "@/api/log"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { toISODate, toMonthParam } from "@/lib/date"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"

export default function StreakCalendar() {
  const [date, setDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 12)
  )
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  )

  const { data: days } = useQuery({
    queryKey: ["calendar", toMonthParam(currentMonth)],
    queryFn: () => getCalendar(toMonthParam(currentMonth)),
  })

  // date (YYYY-MM-DD) -> hit/miss; days with no log simply aren't present
  const hitByDate = useMemo(() => {
    const map = new Map<string, boolean>()
    days?.forEach((d) => map.set(d.date, d.hit))
    return map
  }, [days])

  const getDayStatus = (date: Date, outside: boolean): "hit" | "miss" | null => {
    if (outside) return null
    const hit = hitByDate.get(toISODate(date))
    if (hit === undefined) return null // no entries logged that day
    return hit ? "hit" : "miss"
  }

  return (
    <div className="mt-2 flex flex-col justify-center">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        fixedWeeks
        weekStartsOn={1}
        className="w-sm p-0 [--cell-size:--spacing(9.5)]"
        components={{
          DayButton: ({ children, modifiers, day, ...props }) => {
            // Skip on selected — its own highlight owns the cell.
            const status = modifiers.selected
              ? null
              : getDayStatus(day.date, modifiers.outside)
            return (
              <CalendarDayButton
                day={day}
                modifiers={modifiers}
                {...props}
                className={cn(
                  "rounded-full",
                  status === "hit" && "ring-2 ring-emerald-500/60 ring-inset",
                  status === "miss" && "ring-2 ring-destructive/60 ring-inset"
                )}
              >
                {children}
              </CalendarDayButton>
            )
          },
        }}
      />
      <h1>Legend here</h1>
      <h1>Current streak: </h1>
      <h1>Longest streak:</h1>
    </div>
  )
}
