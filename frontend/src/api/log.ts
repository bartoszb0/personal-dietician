import { api } from "@/lib/api"
import { toISODate } from "@/lib/date"
import type { DailyLog } from "@/types/log"

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
