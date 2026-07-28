import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { ChevronDown, Plus } from "lucide-react"
import { useState, type ReactNode } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { createMeal } from "@/api/meals"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { toastApiError } from "@/lib/toast-api-error"
import { mealSchema, type MealValues } from "@/schemas/mealSchema"

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export default function NewMeal() {
  const [open, setOpen] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MealValues>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: "",
      ingredients: "",
      recipe: "",
      calories: 0,
      proteinG: 0,
      fatG: 0,
      carbsG: 0,
    },
  })

  const onSubmit = async (values: MealValues) => {
    try {
      await createMeal(values)
      await queryClient.invalidateQueries({ queryKey: ["meals"] })
      toast.success("Meal added")
      reset()
      setOpen(false)
    } catch (error) {
      toastApiError(error)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          reset()
          setShowDetails(false)
        }
        setOpen(next)
      }}
    >
      <DialogTrigger
        render={
          <Button
            className="h-10 w-10 rounded-md text-2xl"
            aria-label="Add meal"
          />
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Field label="Name" error={errors.name?.message}>
            <Input placeholder="Chicken bowl" {...register("name")} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Calories" error={errors.calories?.message}>
              <Input
                type="number"
                inputMode="numeric"
                {...register("calories", { valueAsNumber: true })}
              />
            </Field>
            <Field label="Protein (g)" error={errors.proteinG?.message}>
              <Input
                type="number"
                inputMode="numeric"
                {...register("proteinG", { valueAsNumber: true })}
              />
            </Field>
            <Field label="Carbs (g)" error={errors.carbsG?.message}>
              <Input
                type="number"
                inputMode="numeric"
                {...register("carbsG", { valueAsNumber: true })}
              />
            </Field>
            <Field label="Fat (g)" error={errors.fatG?.message}>
              <Input
                type="number"
                inputMode="numeric"
                {...register("fatG", { valueAsNumber: true })}
              />
            </Field>
          </div>

          <button
            type="button"
            onClick={() => setShowDetails((value) => !value)}
            className="flex items-center gap-1 self-start text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                showDetails && "rotate-180",
              )}
            />
            {showDetails ? "Hide details" : "Add ingredients & recipe"}
          </button>

          {showDetails && (
            <>
              <Field
                label="Ingredients (optional)"
                error={errors.ingredients?.message}
              >
                <Textarea
                  rows={3}
                  className="field-sizing-fixed max-h-40 overflow-y-auto wrap-break-word"
                  placeholder="200g chicken, 100g rice, olive oil…"
                  {...register("ingredients")}
                />
              </Field>

              <Field label="Recipe (optional)" error={errors.recipe?.message}>
                <Textarea
                  rows={3}
                  className="field-sizing-fixed max-h-40 overflow-y-auto wrap-break-word"
                  placeholder="How to make it…"
                  {...register("recipe")}
                />
              </Field>
            </>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save meal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
