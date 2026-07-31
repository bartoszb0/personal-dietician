import { api } from "@/lib/api"
import type { MealValues } from "@/schemas/mealSchema"
import type { Meal, MealSort, MealsPage } from "@/types/meal"

export type SearchMealsParams = {
  search?: string
  sort?: MealSort
  page?: number
  limit?: number
}

export async function searchMeals(
  params: SearchMealsParams
): Promise<MealsPage> {
  const { data } = await api.get<MealsPage>("/meals", { params })
  return data
}

export async function createMeal(input: MealValues): Promise<Meal> {
  const { data } = await api.post<Meal>("/meals", input)
  return data
}

export async function getMeal(id: string): Promise<Meal> {
  const { data } = await api.get<Meal>(`/meals/${id}`)
  return data
}

export async function deleteMeal(id: string): Promise<void> {
  await api.delete(`/meals/${id}`)
}
