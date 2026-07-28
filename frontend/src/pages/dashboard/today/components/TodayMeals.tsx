import AddMeal from "./AddMeal"

export default function TodayMeals() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <span className="font-medium">Meals</span>
        <AddMeal />
      </div>
      <div className="mt-8 flex justify-center text-muted-foreground">
        No meals yet.
      </div>
    </div>
  )
}
