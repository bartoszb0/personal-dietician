import { GOAL_OPTIONS } from "@/constants/onboarding/options"
import type { StepProps } from "@/types/onboarding"

import { ChoiceCard } from "./ChoiceCard"

export function GoalStep({ answers, set }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium">What is your goal?</h1>
      <div className="flex flex-col gap-3">
        {GOAL_OPTIONS.map((option) => (
          <ChoiceCard
            key={option.value}
            title={option.label}
            hint={option.hint}
            selected={answers.goal === option.value}
            onClick={() => set({ goal: option.value })}
          />
        ))}
      </div>
    </div>
  )
}
