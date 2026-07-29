import { api } from "@/lib/api"
import { toISODate } from "@/lib/date"
import type { Meal } from "@/types/meal"

export async function addMealLog(mealId: string) {
  const { data } = await api.post("/log", {
    mealId,
    date: toISODate(new Date()),
  })
  return data
}

export async function getTodayLogs(): Promise<Meal[]> {
  const { data } = await api.get<Meal[]>("/log", {
    params: { date: toISODate(new Date()) },
  })
  return data
}
