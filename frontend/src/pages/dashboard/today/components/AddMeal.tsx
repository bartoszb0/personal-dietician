import { useQuery } from "@tanstack/react-query"
import { Plus, Search } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { getMeals } from "@/api/meals"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { Meal } from "@/types/meal"

export default function AddMeal() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const {
    data: meals,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["meals"],
    queryFn: () => getMeals(),
    enabled: open, // only fetch once the picker is opened
  })

  const addToToday = (meal: Meal) => {
    // TODO: persist to today's log once daily logging (DailyLogEntry) exists.
    toast.success(`Added ${meal.name} to today`)
    setOpen(false)
  }

  const allMeals = meals ?? []
  const filtered = allMeals.filter((meal) =>
    meal.name.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setQuery("")
        setOpen(next)
      }}
    >
      <DialogTrigger render={<Button size="sm" />}>
        <Plus /> Add meal
      </DialogTrigger>

      <DialogContent className="flex max-h-[80vh] flex-col gap-4 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a meal</DialogTitle>
        </DialogHeader>

        {isPending ? (
          <LoadingSpinner />
        ) : isError ? (
          <p className="text-sm text-destructive">Couldn't load meals.</p>
        ) : allMeals.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No saved meals yet — create one in the Meals tab.
          </p>
        ) : (
          <>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search meals"
                className="pl-9"
              />
            </div>

            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No meals match “{query.trim()}”.
              </p>
            ) : (
              <ul className="flex flex-col gap-2 overflow-y-auto">
                {filtered.map((meal) => (
                  <li key={meal.id}>
                    <button
                      type="button"
                      onClick={() => addToToday(meal)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl bg-muted/50 p-3 text-left transition-colors hover:bg-muted"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium">{meal.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {meal.proteinG}g protein · {meal.carbsG}g carbs ·{" "}
                          {meal.fatG}g fat
                        </div>
                      </div>
                      <div className="shrink-0 text-sm whitespace-nowrap">
                        <span className="font-bold">
                          {meal.calories.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground"> kcal</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
