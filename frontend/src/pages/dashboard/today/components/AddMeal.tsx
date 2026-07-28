import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query"
import { Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { searchMeals } from "@/api/meals"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import MealSortSelect from "@/components/common/MealSortSelect"
import { Button } from "@/components/ui/button"
import { MEALS_PAGE_SIZE } from "@/constants/meals"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { Meal, MealSort } from "@/types/meal"

import MealRow from "./MealRow"

const PAGE_SIZE = MEALS_PAGE_SIZE

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
          <MealSortSelect value={sort} onChange={setSort} />
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
                <MealRow meal={meal} onSelect={addToToday} />
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
