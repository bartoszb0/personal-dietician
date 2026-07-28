import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { MealSort } from "@/types/meal"

const SORT_LABELS: Record<MealSort, string> = {
  recent: "Recently added",
  calories: "Calories",
  protein: "Protein",
  name: "Name (A-Z)",
}

export default function MealSortSelect({
  value,
  onChange,
}: {
  value: MealSort
  onChange: (sort: MealSort) => void
}) {
  return (
    <Select
      items={SORT_LABELS}
      value={value}
      onValueChange={(next) => onChange(next as MealSort)}
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
  )
}
