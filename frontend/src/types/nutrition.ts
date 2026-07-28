export type NutritionTarget = {
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
}

export type UserNutritionTarget = NutritionTarget & {
  id: string
  userId: string
  isCustom: boolean
  effectiveFrom: string
}
