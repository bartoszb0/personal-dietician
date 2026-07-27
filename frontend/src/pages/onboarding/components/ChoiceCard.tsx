import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ChoiceCardProps = {
  selected: boolean
  onClick: () => void
  title: string
  hint?: string
}

export function ChoiceCard({ selected, onClick, title, hint }: ChoiceCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer border-2 border-transparent p-4 transition-colors hover:border-primary/60",
        selected && "border-primary",
      )}
    >
      <div className="font-medium">{title}</div>
      {hint && <div className="text-sm text-muted-foreground">{hint}</div>}
    </Card>
  )
}
