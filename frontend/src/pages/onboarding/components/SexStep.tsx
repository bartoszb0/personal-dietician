import { SEX_OPTIONS } from "@/constants/onboarding/options"
import type { StepProps } from "@/types/onboarding"

import { ChoiceCard } from "./ChoiceCard"

export function SexStep({ answers, set }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium">What is your sex?</h1>
      <div className="flex flex-col gap-3">
        {SEX_OPTIONS.map((option) => (
          <ChoiceCard
            key={option.value}
            title={option.label}
            selected={answers.sex === option.value}
            onClick={() => set({ sex: option.value })}
          />
        ))}
      </div>
    </div>
  )
}
