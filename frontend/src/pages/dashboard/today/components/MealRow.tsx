import type { Meal } from "@/types/meal"

export default function MealRow({
  meal,
  onSelect,
}: {
  meal: Meal
  onSelect: (meal: Meal) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(meal)}
      className="flex w-full items-center justify-between gap-3 rounded-xl bg-muted/50 p-3 text-left transition-colors hover:bg-muted"
    >
      <div className="min-w-0">
        <div className="truncate font-medium">{meal.name}</div>
        <div className="text-xs text-muted-foreground">
          {meal.proteinG}g protein · {meal.carbsG}g carbs · {meal.fatG}g fat
        </div>
      </div>
      <div className="shrink-0 text-sm whitespace-nowrap">
        <span className="font-bold">{meal.calories.toLocaleString()}</span>
        <span className="text-muted-foreground"> kcal</span>
      </div>
    </button>
  )
}
