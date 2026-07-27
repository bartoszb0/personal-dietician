import { WheelPicker, WheelPickerWrapper } from "@ncdai/react-wheel-picker"

import {
  DAY_OPTIONS,
  MONTH_OPTIONS,
  WHEEL_CLASS_NAMES,
  YEAR_OPTIONS,
} from "@/constants/onboarding/options"
import { parseISODate, toISODate } from "@/lib/date"
import type { StepProps } from "@/types/onboarding"

export function BirthDateStep({ answers, set }: StepProps) {
  const dob = parseISODate(answers.birthDate) ?? new Date(2000, 0, 1)
  const dobDay = dob.getDate()
  const dobMonth = dob.getMonth() + 1
  const dobYear = dob.getFullYear()

  const setDob = (part: { day?: number; month?: number; year?: number }) => {
    const year = part.year ?? dobYear
    const month = part.month ?? dobMonth
    const day = part.day ?? dobDay
    // clamp to the last valid day of the chosen month (e.g. Feb 30 -> Feb 28/29)
    const maxDay = new Date(year, month, 0).getDate()
    set({
      birthDate: toISODate(new Date(year, month - 1, Math.min(day, maxDay))),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium">When were you born?</h1>
      <WheelPickerWrapper>
        <WheelPicker
          options={DAY_OPTIONS}
          value={String(dobDay)}
          onValueChange={(value) => setDob({ day: Number(value) })}
          classNames={WHEEL_CLASS_NAMES}
          infinite
        />
        <WheelPicker
          options={MONTH_OPTIONS}
          value={String(dobMonth)}
          onValueChange={(value) => setDob({ month: Number(value) })}
          classNames={WHEEL_CLASS_NAMES}
          infinite
        />
        <WheelPicker
          options={YEAR_OPTIONS}
          value={String(dobYear)}
          onValueChange={(value) => setDob({ year: Number(value) })}
          classNames={WHEEL_CLASS_NAMES}
        />
      </WheelPickerWrapper>
    </div>
  )
}
