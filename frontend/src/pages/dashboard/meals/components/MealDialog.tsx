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
import MealDialogDropdown from "./MealDialogDropdown"

export type MealDetails = {
  name: string
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
  ingredients: string | null
  recipe: string | null
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-muted/50 py-2">
      <span className="text-sm font-semibold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

export function MealDialogContent({
  details,
  mealId,
}: {
  details: MealDetails
  mealId?: string
}) {
  return (
    <DialogContent className="flex max-h-[85vh] flex-col gap-4 overflow-y-auto sm:max-w-md">
      <DialogHeader>
        <div className="flex items-center gap-2">
          <DialogTitle>{details.name}</DialogTitle>
          {mealId && <MealDialogDropdown mealId={mealId} details={details} />}
        </div>
        <DialogDescription>Meal details</DialogDescription>
      </DialogHeader>

      {/* photo placeholder — no image field in v1 */}
      <div className="flex aspect-video items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <ImageIcon className="size-10" />
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Stat label="kcal" value={details.calories.toLocaleString()} />
        <Stat label="protein" value={`${details.proteinG}g`} />
        <Stat label="carbs" value={`${details.carbsG}g`} />
        <Stat label="fat" value={`${details.fatG}g`} />
      </div>

      <section className="flex flex-col gap-1">
        <h4 className="text-sm font-medium">Ingredients</h4>
        {details.ingredients ? (
          <p className="text-sm whitespace-pre-wrap text-muted-foreground">
            {details.ingredients}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground/60">
            No ingredients added.
          </p>
        )}
      </section>

      <section className="flex flex-col gap-1">
        <h4 className="text-sm font-medium">Recipe</h4>
        {details.recipe ? (
          <p className="text-sm whitespace-pre-wrap text-muted-foreground">
            {details.recipe}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground/60">No recipe added.</p>
        )}
      </section>
    </DialogContent>
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
      <MealDialogContent details={meal} mealId={meal.id} />
    </Dialog>
  )
}
