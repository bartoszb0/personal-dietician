import { ImageIcon } from "lucide-react"
import type { ReactNode } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Meal } from "@/types/meal"

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-muted/50 py-2">
      <span className="text-sm font-semibold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

export default function MealDialog({
  meal,
  children,
}: {
  meal: Meal
  children: ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger
        render={<button type="button" className="w-full text-left" />}
      >
        {children}
      </DialogTrigger>

      <DialogContent className="flex max-h-[85vh] flex-col gap-4 overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{meal.name}</DialogTitle>
          <DialogDescription>Meal details</DialogDescription>
        </DialogHeader>

        {/* photo placeholder — no image field in v1 */}
        <div className="flex aspect-video items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <ImageIcon className="size-10" />
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Stat label="kcal" value={meal.calories.toLocaleString()} />
          <Stat label="protein" value={`${meal.proteinG}g`} />
          <Stat label="carbs" value={`${meal.carbsG}g`} />
          <Stat label="fat" value={`${meal.fatG}g`} />
        </div>

        <section className="flex flex-col gap-1">
          <h4 className="text-sm font-medium">Ingredients</h4>
          {meal.ingredients ? (
            <p className="text-sm whitespace-pre-wrap text-muted-foreground">
              {meal.ingredients}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground/60">No ingredients added.</p>
          )}
        </section>

        <section className="flex flex-col gap-1">
          <h4 className="text-sm font-medium">Recipe</h4>
          {meal.recipe ? (
            <p className="text-sm whitespace-pre-wrap text-muted-foreground">
              {meal.recipe}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground/60">No recipe added.</p>
          )}
        </section>
      </DialogContent>
    </Dialog>
  )
}
