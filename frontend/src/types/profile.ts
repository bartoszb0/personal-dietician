import type { UserNutritionTarget } from "./nutrition"
import type { ActivityLevel, Goal, Sex } from "./onboarding"

export type UserProfile = {
  id: string
  userId: string
  sex: Sex
  birthDate: string
  heightCm: number
  weightKg: string
  activityLevel: ActivityLevel
  goal: Goal
  onboardingCompletedAt: string
  createdAt: string
  updatedAt: string
}

export type UpdateProfilePayload = {
  weightKg?: number
  activityLevel?: ActivityLevel
  goal?: Goal
}

export type UpdateProfileResponse = {
  profile: UserProfile
  nutritionTarget: UserNutritionTarget
}
