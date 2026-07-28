import { z } from "zod"

export const mealSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  ingredients: z.string().trim().max(1500).optional(),
  recipe: z.string().trim().max(1500).optional(),
  calories: z.number().int().min(0).max(10000),
  proteinG: z.number().int().min(0).max(1000),
  fatG: z.number().int().min(0).max(1000),
  carbsG: z.number().int().min(0).max(1000),
})

export type MealValues = z.infer<typeof mealSchema>
