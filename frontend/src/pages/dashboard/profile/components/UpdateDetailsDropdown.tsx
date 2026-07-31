import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical, Scale, Target, Zap } from "lucide-react"
import { useState } from "react"
import UpdateActivityForm from "./UpdateActivityForm"
import UpdateGoalForm from "./UpdateGoalForm"
import UpdateWeightForm from "./UpdateWeightForm"

export default function UpdateDetailsDropdown() {
  const [active, setActive] = useState<"weight" | "activity" | "goal" | null>(
    null
  )

  const FIELDS = [
    { key: "weight", icon: Scale, Form: UpdateWeightForm },
    { key: "activity", icon: Zap, Form: UpdateActivityForm },
    { key: "goal", icon: Target, Form: UpdateGoalForm },
  ] as const

  const ActiveForm = FIELDS.find((f) => f.key === active)?.Form

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" />}>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            {FIELDS.map(({ key, icon: Icon }) => (
              <DropdownMenuItem
                key={key}
                className="gap-2.5 px-2.5 py-2 text-sm"
                onClick={() => setActive(key)}
              >
                <Icon className="size-5" />
                Update {key}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={active !== null} onOpenChange={() => setActive(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{`Update ${active}`}</DialogTitle>
          </DialogHeader>
          {ActiveForm && <ActiveForm onDone={() => setActive(null)} />}
        </DialogContent>
      </Dialog>
    </>
  )
}
