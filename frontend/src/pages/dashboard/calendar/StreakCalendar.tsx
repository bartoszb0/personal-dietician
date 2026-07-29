import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useState } from "react"

// Placeholder until daily logging exists — real hit/miss comes from
// DailyLogEntry vs the day's NutritionTarget.
function getDayStatus(date: Date, outside: boolean): "hit" | "miss" | null {
  if (outside) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (date > today) return null
  return date.getDate() % 4 === 0 ? "miss" : "hit"
}

export default function StreakCalendar() {
  const [date, setDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 12)
  )
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  )

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
