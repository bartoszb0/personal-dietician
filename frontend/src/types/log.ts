export type DailyLogEntry = {
  id: string
  name: string
  servings: string
  calories: number
  proteinG: number
  fatG: number
  carbsG: number
  date: string
  mealId: string | null
  createdAt: string
}