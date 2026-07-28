import { Button } from "@/components/ui/button"

export default function TodayMeals() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <span className="font-medium">Meals</span>
        <Button>+ Add meal</Button>
      </div>
      <div className="mt-8 flex justify-center text-muted-foreground">
        No meals yet.
      </div>
    </div>
  )
}
