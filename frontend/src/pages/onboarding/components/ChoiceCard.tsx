import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ChoiceCardProps = {
  selected: boolean
  onClick: () => void
  title: string
  hint?: string
  compact?: boolean
}

export function ChoiceCard({
  selected,
  onClick,
  title,
  hint,
  compact,
}: ChoiceCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer border-2 border-transparent transition-colors hover:border-primary/60",
        compact
          ? "flex-row items-center justify-between gap-2 p-3"
          : "p-4",
        selected && "border-primary",
      )}
    >
      <div className="font-medium">{title}</div>
      {hint && (
        <div
          className={cn(
            "text-muted-foreground",
            compact ? "text-xs" : "text-sm",
          )}
        >
          {hint}
        </div>
      )}
    </Card>
  )
}
