import { WheelPicker, WheelPickerWrapper } from "@ncdai/react-wheel-picker"

import { WEIGHT_OPTIONS, WHEEL_CLASS_NAMES } from "@/constants/onboarding/options"
import type { StepProps } from "@/types/onboarding"

export function WeightStep({ answers, set }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium">What is your weight?</h1>
      <WheelPickerWrapper>
        <WheelPicker
          options={WEIGHT_OPTIONS}
          value={answers.weightKg}
          onValueChange={(value) => set({ weightKg: value })}
          classNames={WHEEL_CLASS_NAMES}
          infinite
        />
      </WheelPickerWrapper>
    </div>
  )
}
