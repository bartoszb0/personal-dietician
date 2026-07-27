import {
  ACTIVITY_OPTIONS,
  GOAL_OPTIONS,
  SEX_OPTIONS,
} from "@/constants/onboarding/options"
import { formatBirthDate } from "@/lib/date"
import type { StepProps } from "@/types/onboarding"

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value ?? "—"}</dd>
    </div>
  )
}

export function ReviewStep({ answers }: StepProps) {
  const sexLabel = SEX_OPTIONS.find(
    (option) => option.value === answers.sex,
  )?.label
  const activityLabel = ACTIVITY_OPTIONS.find(
    (option) => option.value === answers.activityLevel,
  )?.label
  const goalLabel = GOAL_OPTIONS.find(
    (option) => option.value === answers.goal,
  )?.label

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium">Review</h1>
      <dl className="flex flex-col gap-2 text-sm">
        <Row label="Sex" value={sexLabel} />
        <Row label="Date of birth" value={formatBirthDate(answers.birthDate)} />
        <Row
          label="Height"
          value={answers.heightCm ? `${answers.heightCm} cm` : undefined}
        />
        <Row
          label="Weight"
          value={answers.weightKg ? `${answers.weightKg} kg` : undefined}
        />
        <Row label="Activity" value={activityLabel} />
        <Row label="Goal" value={goalLabel} />
      </dl>
    </div>
  )
}
