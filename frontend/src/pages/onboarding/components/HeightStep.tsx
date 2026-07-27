import { WheelPicker, WheelPickerWrapper } from "@ncdai/react-wheel-picker"

import { HEIGHT_OPTIONS, WHEEL_CLASS_NAMES } from "@/constants/onboarding/options"
import type { StepProps } from "@/types/onboarding"

export function HeightStep({ answers, set }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium">How tall are you?</h1>
      <WheelPickerWrapper>
        <WheelPicker
          options={HEIGHT_OPTIONS}
          value={answers.heightCm}
          onValueChange={(value) => set({ heightCm: value })}
          classNames={WHEEL_CLASS_NAMES}
          infinite
        />
      </WheelPickerWrapper>
    </div>
  )
}
