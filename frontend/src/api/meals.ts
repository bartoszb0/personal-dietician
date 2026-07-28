import { api } from "@/lib/api"
import type { MealValues } from "@/schemas/mealSchema"
import type { Meal } from "@/types/meal"

export async function getMeals(): Promise<Meal[]> {
  const { data } = await api.get<Meal[]>("/meals")
  return data
}

export async function createMeal(input: MealValues): Promise<Meal> {
  const { data } = await api.post<Meal>("/meals", input)
  return data
}
