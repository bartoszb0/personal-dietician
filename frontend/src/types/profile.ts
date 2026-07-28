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
