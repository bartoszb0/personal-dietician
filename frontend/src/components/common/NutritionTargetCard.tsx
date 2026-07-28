import { finishOnboarding } from "@/api/onboarding"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MACROS } from "@/constants/macro"
import { toastApiError } from "@/lib/toast-api-error"
import type { NutritionTarget } from "@/types/nutrition"
import type { Answers } from "@/types/onboarding"
import type { User } from "@/types/user"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../ui/button"

export function NutritionTargetCard({
  target,
  answers,
}: {
  target: NutritionTarget
  answers: Answers
}) {
  const [isLoading, setLoading] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleFinish = async () => {
    try {
      setLoading(true)
      await finishOnboarding(answers)
      queryClient.setQueryData<User>(["me"], (prev) =>
        prev ? { ...prev, isOnboarded: true } : prev
      )
      navigate("/", { replace: true })
    } catch (e) {
      toastApiError(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your daily target</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="text-center">
          <div className="text-4xl font-bold">
            {target.calories.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">kcal / day</div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {MACROS.map((macro) => {
            const grams = target[macro.key]
            const percent = Math.round(
              ((grams * macro.kcalPerGram) / target.calories) * 100
            )
            return (
              <div
                key={macro.key}
                className="flex flex-col items-center gap-1 rounded-xl bg-muted p-3"
              >
                <div className="text-sm text-muted-foreground">
                  {macro.label}
                </div>
                <div className="text-lg font-medium">{grams} g</div>
                <div className="text-xs text-muted-foreground">{percent}%</div>
              </div>
            )
          })}
        </div>

        <Button className="w-full" onClick={handleFinish} disabled={isLoading}>
          Save
        </Button>
      </CardContent>
    </Card>
  )
}
