import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ACTIVITY_OPTIONS,
  GOAL_OPTIONS,
  SEX_OPTIONS,
} from "@/constants/onboarding/options"
import { formatBirthDate } from "@/lib/date"
import type { UserProfile } from "@/types/profile"

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

export default function ProfileDetails({ profile }: { profile: UserProfile }) {
  const sex = SEX_OPTIONS.find((o) => o.value === profile.sex)?.label ?? "—"
  const activity =
    ACTIVITY_OPTIONS.find((o) => o.value === profile.activityLevel)?.label ?? "—"
  const goal = GOAL_OPTIONS.find((o) => o.value === profile.goal)?.label ?? "—"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Your details</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Row label="Sex" value={sex} />
        <Row label="Date of birth" value={formatBirthDate(profile.birthDate)} />
        <Row label="Height" value={`${profile.heightCm} cm`} />
        <Row label="Weight" value={`${Number(profile.weightKg)} kg`} />
        <Row label="Activity" value={activity} />
        <Row label="Goal" value={goal} />
      </CardContent>
    </Card>
  )
}
