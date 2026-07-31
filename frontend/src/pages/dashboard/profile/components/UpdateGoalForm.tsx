import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { GOAL_OPTIONS } from "@/constants/onboarding/options"
import { ChoiceCard } from "@/pages/onboarding/components/ChoiceCard"
import type { Goal } from "@/types/onboarding"
import type { UserProfile } from "@/types/profile"

import { useUpdateProfile } from "../../../../hooks/useUpdateProfile"

export default function UpdateGoalForm({ onDone }: { onDone: () => void }) {
  const profile = useQueryClient().getQueryData<UserProfile>(["profile"])
  const [goal, setGoal] = useState<Goal>(profile?.goal ?? "MAINTAIN")
  const update = useUpdateProfile(onDone)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {GOAL_OPTIONS.map((option) => (
          <ChoiceCard
            key={option.value}
            title={option.label}
            hint={option.hint}
            selected={goal === option.value}
            onClick={() => setGoal(option.value)}
            compact
          />
        ))}
      </div>

      <Button
        onClick={() => update.mutate({ goal })}
        disabled={update.isPending}
      >
        {update.isPending ? "Saving…" : "Save and update your daily target"}
      </Button>
    </div>
  )
}
