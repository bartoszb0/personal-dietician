import { WheelPicker, WheelPickerWrapper } from "@ncdai/react-wheel-picker"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  WEIGHT_FRACTION_OPTIONS,
  WEIGHT_WHOLE_OPTIONS,
  WHEEL_CLASS_NAMES,
} from "@/constants/onboarding/options"

import { useUpdateProfile } from "../../../../hooks/useUpdateProfile"

export default function UpdateWeightForm({ onDone }: { onDone: () => void }) {
  const [whole, setWhole] = useState("70")
  const [frac, setFrac] = useState("0")
  const update = useUpdateProfile(onDone)

  return (
    <div className="flex flex-col gap-4">
      <WheelPickerWrapper>
        <WheelPicker
          options={WEIGHT_WHOLE_OPTIONS}
          value={whole}
          onValueChange={setWhole}
          classNames={WHEEL_CLASS_NAMES}
          infinite
        />
        <WheelPicker
          options={WEIGHT_FRACTION_OPTIONS}
          value={frac}
          onValueChange={setFrac}
          classNames={WHEEL_CLASS_NAMES}
          infinite
        />
      </WheelPickerWrapper>

      <Button
        onClick={() => update.mutate({ weightKg: Number(`${whole}.${frac}`) })}
        disabled={update.isPending}
      >
        {update.isPending ? "Saving…" : "Save and update your daily target"}
      </Button>
    </div>
  )
}
