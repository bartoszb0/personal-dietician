import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MACROS } from "@/constants/macro"
import type { UserNutritionTarget } from "@/types/nutrition"

export default function DailyTargets({
  target,
}: {
  target: UserNutritionTarget
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Daily targets</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-3xl font-bold">
            {target.calories.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">kcal / day</span>
          {target.isCustom && (
            <span className="mt-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              Custom
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {MACROS.map((macro) => (
            <div
              key={macro.key}
              className="flex flex-col items-center gap-0.5 rounded-xl bg-muted p-3"
            >
              <span className="text-sm text-muted-foreground">
                {macro.label}
              </span>
              <span className="text-lg font-medium">{target[macro.key]}g</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
