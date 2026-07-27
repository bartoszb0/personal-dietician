export const STEPS = [
  "sex",
  "birthDate",
  "height",
  "weight",
  "activity",
  "goal",
  "review",
] as const

export type Step = (typeof STEPS)[number]
