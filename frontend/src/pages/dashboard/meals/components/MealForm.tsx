import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDown } from "lucide-react"
import { useState, type ReactNode } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
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

export default function MealForm({
  defaultValues,
  submitLabel,
  onSubmit,
}: {
  defaultValues: MealValues
  submitLabel: string
  onSubmit: (values: MealValues) => Promise<void> | void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MealValues>({
    resolver: zodResolver(mealSchema),
    defaultValues,
  })

  // open the details section if the meal already has ingredients/recipe
  const [showDetails, setShowDetails] = useState(
    Boolean(defaultValues.ingredients || defaultValues.recipe)
  )

  return (
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
            showDetails && "rotate-180"
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
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  )
}
