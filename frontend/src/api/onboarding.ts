import { api } from "@/lib/api"
import type { NutritionTarget } from "@/types/nutrition"
import type { Answers } from "@/types/onboarding"

function toProfilePayload(input: Answers) {
  return {
    sex: input.sex,
    birthDate: input.birthDate,
    heightCm: Number(input.heightCm),
    weightKg: Number(input.weightKg),
    activityLevel: input.activityLevel,
    goal: input.goal,
  }
}

export async function getNutritionTarget(
  input: Answers
): Promise<NutritionTarget> {
  const { data } = await api.post<NutritionTarget>(
    "/profile/preview",
    toProfilePayload(input)
  )
  return data
}

export async function finishOnboarding(input: Answers): Promise<void> {
  await api.post("/profile", toProfilePayload(input))
}
