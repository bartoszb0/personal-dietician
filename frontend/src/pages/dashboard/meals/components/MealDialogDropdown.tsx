import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CircleEllipsis, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { deleteMeal } from "@/api/meals"
import ConfirmationDialog from "@/components/common/ConfirmationDIalog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toastApiError } from "@/lib/toast-api-error"

export default function MealDialogDropdown({ mealId }: { mealId: string }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <CircleEllipsis className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem className="gap-2.5 px-2.5 py-2 text-sm">
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
