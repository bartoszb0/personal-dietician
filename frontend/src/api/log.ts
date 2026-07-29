import { api } from "@/lib/api"
import { toISODate } from "@/lib/date"
import type { CalendarDay, DailyLog } from "@/types/log"

export async function addMealLog(mealId: string) {
  const { data } = await api.post("/log", {
    mealId,
    date: toISODate(new Date()),
  })
  return data
}

export async function getDayLogs(date: Date): Promise<DailyLog> {
  const { data } = await api.get<DailyLog>("/log", {
    params: { date: toISODate(date) },
  })
  return data
}

export async function removeLog(id: string) {
  const { data } = await api.delete(`/log/${id}`)
  return data
}

export async function getCalendar(month: string): Promise<CalendarDay[]> {
  const { data } = await api.get<CalendarDay[]>("/log/calendar", {
    params: { month },
  })
  return data
}
