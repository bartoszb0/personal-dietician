export type Sex = "MALE" | "FEMALE"

export type ActivityLevel =
  | "SEDENTARY"
  | "LIGHT"
  | "MODERATE"
  | "ACTIVE"
  | "VERY_ACTIVE"

export type Goal = "LOSE" | "MAINTAIN" | "GAIN"

export type Answers = {
  sex?: Sex
  birthDate?: string
  heightCm?: string
  weightKg?: string
  activityLevel?: ActivityLevel
  goal?: Goal
}

export type StepProps = {
  answers: Answers
  set: (patch: Partial<Answers>) => void
}
