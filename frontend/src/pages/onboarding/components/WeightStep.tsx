import { WheelPicker, WheelPickerWrapper } from "@ncdai/react-wheel-picker"

import {
  WEIGHT_FRACTION_OPTIONS,
  WEIGHT_WHOLE_OPTIONS,
  WHEEL_CLASS_NAMES,
} from "@/constants/onboarding/options"
import type { StepProps } from "@/types/onboarding"

export function WeightStep({ answers, set }: StepProps) {
  const [whole = "70", frac = "0"] = (answers.weightKg ?? "70").split(".")

  const setWeight = (part: { whole?: string; frac?: string }) => {
    const w = part.whole ?? whole
    const f = part.frac ?? frac
    set({ weightKg: `${w}.${f}` })
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium">What is your weight?</h1>
      <WheelPickerWrapper>
        <WheelPicker
          options={WEIGHT_WHOLE_OPTIONS}
          value={whole}
          onValueChange={(value) => setWeight({ whole: value })}
          classNames={WHEEL_CLASS_NAMES}
          infinite
        />
        <WheelPicker
          options={WEIGHT_FRACTION_OPTIONS}
          value={frac}
          onValueChange={(value) => setWeight({ frac: value })}
          classNames={WHEEL_CLASS_NAMES}
          infinite
        />
      </WheelPickerWrapper>
    </div>
  )
}
