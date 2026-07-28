import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query"
import { Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { searchMeals } from "@/api/meals"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Meal, MealSort } from "@/types/meal"

const SORT_LABELS: Record<MealSort, string> = {
  recent: "Recently added",
  calories: "Calories",
  protein: "Protein",
  name: "Name (A–Z)",
}

const PAGE_SIZE = 10

export default function AddMeal() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [sort, setSort] = useState<MealSort>("recent")

  // debounce the search so we don't hit the server on every keystroke
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timeout)
  }, [search])

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["meals", { search: debouncedSearch, sort, limit: PAGE_SIZE }],
    queryFn: ({ pageParam }) =>
      searchMeals({
        search: debouncedSearch || undefined,
        sort,
        page: pageParam,
        limit: PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page * lastPage.limit < lastPage.total
        ? lastPage.page + 1
        : undefined,
    enabled: open,
    placeholderData: keepPreviousData, // keep the list while searching
  })

  const meals = data?.pages.flatMap((page) => page.items) ?? []

  const addToToday = (meal: Meal) => {
    // TODO: persist to today's log once daily logging (DailyLogEntry) exists.
    toast.success(`Added ${meal.name} to today`)
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setSearch("")
          setDebouncedSearch("")
          setSort("recent")
        }
        setOpen(next)
      }}
    >
      <DialogTrigger render={<Button size="sm" />}>
        <Plus /> Add meal
      </DialogTrigger>

      <DialogContent className="flex max-h-[80vh] flex-col gap-3 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a meal</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search meals"
              className="pl-9"
            />
          </div>
          <Select
            items={SORT_LABELS}
            value={sort}
            onValueChange={(value) => setSort(value as MealSort)}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SORT_LABELS) as MealSort[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {SORT_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isPending ? (
          <LoadingSpinner />
        ) : isError ? (
          <p className="text-sm text-destructive">Couldn't load meals.</p>
        ) : meals.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {debouncedSearch
              ? `No meals match “${debouncedSearch}”.`
              : "No saved meals yet — create one in the Meals tab."}
          </p>
        ) : (
          <ul className="flex flex-col gap-2 overflow-y-auto">
            {meals.map((meal) => (
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

            {hasNextPage && (
              <li>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading…" : "Load more"}
                </Button>
              </li>
            )}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}
