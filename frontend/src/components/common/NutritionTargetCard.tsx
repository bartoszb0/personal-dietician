import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { NutritionTarget } from "@/types/nutrition"

const MACROS = [
  { key: "proteinG", label: "Protein", kcalPerGram: 4 },
  { key: "carbsG", label: "Carbs", kcalPerGram: 4 },
  { key: "fatG", label: "Fat", kcalPerGram: 9 },
] as const

export function NutritionTargetCard({ target }: { target: NutritionTarget }) {
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
      </CardContent>
    </Card>
  )
}
