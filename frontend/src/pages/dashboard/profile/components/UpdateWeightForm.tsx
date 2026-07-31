import { useQueryClient } from "@tanstack/react-query"
import { WheelPicker, WheelPickerWrapper } from "@ncdai/react-wheel-picker"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  WEIGHT_FRACTION_OPTIONS,
  WEIGHT_WHOLE_OPTIONS,
  WHEEL_CLASS_NAMES,
} from "@/constants/onboarding/options"
import type { UserProfile } from "@/types/profile"

import { useUpdateProfile } from "../../../../hooks/useUpdateProfile"

export default function UpdateWeightForm({ onDone }: { onDone: () => void }) {
  const profile = useQueryClient().getQueryData<UserProfile>(["profile"])
  // weightKg is a Decimal string ("70.50") — normalize to whole + one tenths digit
  const [wholeInit, fracInit] = Number(profile?.weightKg ?? 70)
    .toFixed(1)
    .split(".")

  const [whole, setWhole] = useState(wholeInit)
  const [frac, setFrac] = useState(fracInit)
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
