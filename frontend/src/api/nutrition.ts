import { api } from "@/lib/api"
import type { UserNutritionTarget } from "@/types/nutrition"

export async function getCurrentNutritionTarget(): Promise<UserNutritionTarget> {
  const { data } = await api.get<UserNutritionTarget>("/nutrition/target")
  return data
}
