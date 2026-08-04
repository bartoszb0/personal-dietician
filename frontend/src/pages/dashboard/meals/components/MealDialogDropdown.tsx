import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CircleEllipsis, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { deleteMeal } from "@/api/meals"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toastApiError } from "@/lib/toast-api-error"
import type { MealValues } from "@/schemas/mealSchema"

import ConfirmationDialog from "@/components/common/ConfirmationDialog"
import EditMeal from "./EditMeal"
import type { MealDetails } from "./MealDialog"

export default function MealDialogDropdown({
  mealId,
  details,
}: {
  mealId: string
  details: MealDetails
}) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const queryClient = useQueryClient()

  const remove = useMutation({
    mutationFn: (id: string) => deleteMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] })
      toast.success("Meal deleted")
      setConfirmOpen(false)
    },
    onError: toastApiError,
  })

  const editDefaults: MealValues = {
    name: details.name,
    calories: details.calories,
    proteinG: details.proteinG,
    fatG: details.fatG,
    carbsG: details.carbsG,
    ingredients: details.ingredients ?? "",
    recipe: details.recipe ?? "",
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <CircleEllipsis className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="gap-2.5 px-2.5 py-2 text-sm"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="size-5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2.5 px-2.5 py-2 text-sm text-destructive"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="size-5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditMeal
        open={editOpen}
        onOpenChange={setEditOpen}
        mealId={mealId}
        defaultValues={editDefaults}
      />

      <ConfirmationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this meal?"
        description="It's removed from your meal library. Days you already logged it keep their record."
        confirmLabel="Delete"
        destructive
        loading={remove.isPending}
        onConfirm={() => remove.mutate(mealId)}
      />
    </>
  )
}
