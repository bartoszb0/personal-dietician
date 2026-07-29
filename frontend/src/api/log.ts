import { api } from "@/lib/api"
import { toISODate } from "@/lib/date"
import type { DailyLogEntry } from "@/types/log"

export async function addMealLog(mealId: string) {
  const { data } = await api.post("/log", {
    mealId,
    date: toISODate(new Date()),
  })
  return data
}

export async function getDayLogs(date: Date): Promise<DailyLogEntry[]> {
  const { data } = await api.get<DailyLogEntry[]>("/log", {
    params: { date: toISODate(date) },
  })
  return data
}
