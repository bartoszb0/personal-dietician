export type Meal = {
  id: string
  userId: string
  name: string
  calories: number
  proteinG: number
  fatG: number
  carbsG: number
  ingredients: string | null
  recipe: string | null
  createdAt: string
  updatedAt: string
}

export type MealSort = "recent" | "calories" | "protein" | "name"

export type MealsPage = {
  items: Meal[]
  total: number
  page: number
  limit: number
}
