import {
  getConsumedNutrition,
  getCurrentNutritionTarget,
} from "@/api/nutrition"
import { useQuery } from "@tanstack/react-query"

export default function Today() {
  const { data: target } = useQuery({
    queryKey: ["current-target"],
    queryFn: () => getCurrentNutritionTarget(),
  })

  const { data: consumed } = useQuery({
    queryKey: ["consumed-nutrition"],
    queryFn: () => getConsumedNutrition(),
  })

  console.log(target, consumed)

  return (
    <div className="p-6">
      <h1 className="text-xl font-medium">Today</h1>
      <p className="text-sm text-muted-foreground">
        Your daily calories, macros and streak — coming soon.
      </p>
    </div>
  )
}
