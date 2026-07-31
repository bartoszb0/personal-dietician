import { useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { createMeal } from "@/api/meals"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toastApiError } from "@/lib/toast-api-error"
import type { MealValues } from "@/schemas/mealSchema"

import MealForm from "./MealForm"

const EMPTY_MEAL: MealValues = {
  name: "",
  ingredients: "",
  recipe: "",
  calories: 0,
  proteinG: 0,
  fatG: 0,
  carbsG: 0,
}

export default function NewMeal() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const onSubmit = async (values: MealValues) => {
    try {
      await createMeal(values)
      await queryClient.invalidateQueries({ queryKey: ["meals"] })
      toast.success("Meal added")
      setOpen(false)
    } catch (error) {
      toastApiError(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="h-10 w-10 rounded-md text-2xl" aria-label="Add meal" />
        }
      >
        <Plus />
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New meal</DialogTitle>
          <DialogDescription>
            Enter the meal's calories and macros — you own the numbers.
          </DialogDescription>
        </DialogHeader>

        <MealForm
          defaultValues={EMPTY_MEAL}
          submitLabel="Save meal"
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
