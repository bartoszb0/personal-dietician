import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateMeal } from "@/api/meals"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toastApiError } from "@/lib/toast-api-error"
import type { MealValues } from "@/schemas/mealSchema"

import MealForm from "./MealForm"

export default function EditMeal({
  open,
  onOpenChange,
  mealId,
  defaultValues,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  mealId: string
  defaultValues: MealValues
}) {
  const queryClient = useQueryClient()

  const onSubmit = async (values: MealValues) => {
    try {
      await updateMeal(mealId, values)
      await queryClient.invalidateQueries({ queryKey: ["meals"] })
      await queryClient.invalidateQueries({ queryKey: ["meal", mealId] })
      toast.success("Meal updated")
      onOpenChange(false)
    } catch (error) {
      toastApiError(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        forceOverlay
        className="z-[70]! max-h-[90vh] overflow-y-auto sm:max-w-md"
        overlayClassName="z-[60]!"
      >
        <DialogHeader>
          <DialogTitle>Edit meal</DialogTitle>
          <DialogDescription>Update this meal's details.</DialogDescription>
        </DialogHeader>

        <MealForm
          defaultValues={defaultValues}
          submitLabel="Save changes"
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
