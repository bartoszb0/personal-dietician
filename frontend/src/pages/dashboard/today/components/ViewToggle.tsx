import { cn } from "@/lib/utils"

export type View = "remaining" | "consumed"

export function ViewToggle({
  value,
  onChange,
}: {
  value: View
  onChange: (view: View) => void
}) {
  return (
    <div className="flex justify-center">
      <div className="inline-flex rounded-full bg-muted p-1 text-sm">
        {(["remaining", "consumed"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-full px-4 py-1 transition-colors",
              value === option
                ? "bg-background font-medium shadow-sm"
                : "text-muted-foreground",
            )}
          >
            {option === "remaining" ? "Remaining" : "Intake"}
          </button>
        ))}
      </div>
    </div>
  )
}
