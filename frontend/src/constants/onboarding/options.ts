import type { WheelPickerOption } from "@ncdai/react-wheel-picker"

import type { ActivityLevel, Goal, Sex } from "@/types/onboarding"

export const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: "MALE", label: "Man" },
  { value: "FEMALE", label: "Woman" },
]

export const ACTIVITY_OPTIONS: {
  value: ActivityLevel
  label: string
  hint: string
}[] = [
  { value: "SEDENTARY", label: "Sedentary", hint: "Little or no exercise" },
  { value: "LIGHT", label: "Lightly active", hint: "1-3 days / week" },
  { value: "MODERATE", label: "Moderately active", hint: "3-5 days / week" },
  { value: "ACTIVE", label: "Active", hint: "6-7 days / week" },
  {
    value: "VERY_ACTIVE",
    label: "Very active",
    hint: "Hard training / physical job",
  },
]

export const GOAL_OPTIONS: { value: Goal; label: string; hint: string }[] = [
  { value: "LOSE", label: "Lose weight", hint: "Eat below maintenance" },
  { value: "MAINTAIN", label: "Maintain", hint: "Stay where you are" },
  { value: "GAIN", label: "Gain weight", hint: "Eat above maintenance" },
]

function rangeOptions(
  min: number,
  max: number,
  unit: string
): WheelPickerOption[] {
  const options: WheelPickerOption[] = []
  for (let value = min; value <= max; value++) {
    options.push({ value: String(value), label: `${value} ${unit}` })
  }
  return options
}

function numberOptions(min: number, max: number): WheelPickerOption[] {
  const options: WheelPickerOption[] = []
  for (let value = min; value <= max; value++) {
    options.push({ value: String(value), label: String(value) })
  }
  return options
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export const HEIGHT_OPTIONS = rangeOptions(120, 220, "cm")

export const WEIGHT_WHOLE_OPTIONS = numberOptions(30, 300)
export const WEIGHT_FRACTION_OPTIONS: WheelPickerOption[] = Array.from(
  { length: 10 },
  (_, digit) => ({ value: String(digit), label: `.${digit} kg` })
)

export const DAY_OPTIONS = numberOptions(1, 31)
export const MONTH_OPTIONS: WheelPickerOption[] = MONTHS.map(
  (label, index) => ({
    value: String(index + 1),
    label,
  })
)
export const YEAR_OPTIONS = numberOptions(1920, new Date().getFullYear())

// The highlight band needs a solid background so it masks the dimmed list item
// rendered behind it — otherwise the selected value shows doubled.
export const WHEEL_CLASS_NAMES = {
  optionItem: "text-muted-foreground",
  highlightWrapper: "bg-muted text-foreground rounded-xl",
}
