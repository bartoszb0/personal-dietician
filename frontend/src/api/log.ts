import { api } from "@/lib/api"
import { toISODate } from "@/lib/date"

export async function addMealLog(mealId: string) {
  const { data } = await api.post("/log", {
    mealId,
    date: toISODate(new Date()),
  })
  return data
}
