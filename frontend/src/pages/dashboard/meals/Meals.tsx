import NewMeal from "./components/NewMeal"
import SearchInput from "./components/SearchInput"

export default function Meals() {
  return (
    <div className="p-6">
      <div className="flex gap-2">
        <SearchInput />
        <NewMeal />
      </div>
    </div>
  )
}
