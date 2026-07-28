import { useState } from "react"

import MealsList from "./components/MealsList"
import NewMeal from "./components/NewMeal"
import SearchInput from "./components/SearchInput"

export default function Meals() {
  const [search, setSearch] = useState("")

  return (
    <div className="p-6">
      <div className="flex gap-2">
        <SearchInput value={search} onChange={setSearch} />
        <NewMeal />
      </div>
      <MealsList search={search} />
    </div>
  )
}
