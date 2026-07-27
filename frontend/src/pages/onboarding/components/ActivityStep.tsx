import { ACTIVITY_OPTIONS } from "@/constants/onboarding/options"
import type { StepProps } from "@/types/onboarding"

import { ChoiceCard } from "./ChoiceCard"

export function ActivityStep({ answers, set }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium">How active are you?</h1>
      <div className="flex flex-col gap-3">
        {ACTIVITY_OPTIONS.map((option) => (
          <ChoiceCard
            key={option.value}
            title={option.label}
            hint={option.hint}
            selected={answers.activityLevel === option.value}
            onClick={() => set({ activityLevel: option.value })}
          />
        ))}
      </div>
    </div>
  )
}
