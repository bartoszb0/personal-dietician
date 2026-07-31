import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ACTIVITY_OPTIONS } from "@/constants/onboarding/options"
import { ChoiceCard } from "@/pages/onboarding/components/ChoiceCard"
import type { ActivityLevel } from "@/types/onboarding"
import type { UserProfile } from "@/types/profile"

import { useUpdateProfile } from "../../../../hooks/useUpdateProfile"

export default function UpdateActivityForm({ onDone }: { onDone: () => void }) {
  const profile = useQueryClient().getQueryData<UserProfile>(["profile"])
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    profile?.activityLevel ?? "MODERATE"
  )
  const update = useUpdateProfile(onDone)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {ACTIVITY_OPTIONS.map((option) => (
          <ChoiceCard
            key={option.value}
            title={option.label}
            hint={option.hint}
            selected={activityLevel === option.value}
            onClick={() => setActivityLevel(option.value)}
            compact
          />
        ))}
      </div>

      <Button
        onClick={() => update.mutate({ activityLevel })}
        disabled={update.isPending}
      >
        {update.isPending ? "Saving…" : "Save and update your daily target"}
      </Button>
    </div>
  )
}
