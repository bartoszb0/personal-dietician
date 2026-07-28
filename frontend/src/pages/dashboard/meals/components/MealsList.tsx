import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query"
import { LayoutGrid, List } from "lucide-react"
import { useEffect, useState } from "react"

import { searchMeals } from "@/api/meals"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { MealSort } from "@/types/meal"

import MealCard, { type MealView } from "./MealCard"

const SORT_LABELS: Record<MealSort, string> = {
  recent: "Recently added",
  calories: "Calories",
  protein: "Protein",
  name: "Name (A–Z)",
}

const PAGE_SIZE = 12

export default function MealsList({ search }: { search: string }) {
  const [view, setView] = useState<MealView>("grid")
  const [sort, setSort] = useState<MealSort>("recent")
  const [debouncedSearch, setDebouncedSearch] = useState(search)

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
    placeholderData: keepPreviousData,
  })

  if (isPending) return <LoadingSpinner />
  if (isError) {
    return <p className="mt-4 text-sm text-destructive">Couldn't load meals.</p>
  }

  const meals = data.pages.flatMap((page) => page.items)
  const total = data.pages[0]?.total ?? 0

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">
          {total} meal{total === 1 ? "" : "s"}
        </span>

        <div className="flex items-center gap-2">
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

          <div className="inline-flex rounded-lg bg-muted p-0.5">
            {(["grid", "list"] as const).map((option) => {
              const Icon = option === "grid" ? LayoutGrid : List
              return (
                <button
                  key={option}
                  type="button"
                  aria-label={`${option} view`}
                  onClick={() => setView(option)}
                  className={cn(
                    "rounded-md p-1.5 transition-colors",
                    view === option
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {meals.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {debouncedSearch
            ? `No meals match “${debouncedSearch}”.`
            : "No meals yet — add your first one."}
        </p>
      ) : (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-2 gap-3">
              {meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} view="grid" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} view="list" />
              ))}
            </div>
          )}

          {hasNextPage && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading…" : "Load more"}
            </Button>
          )}
        </>
      )}
    </div>
  )
}
