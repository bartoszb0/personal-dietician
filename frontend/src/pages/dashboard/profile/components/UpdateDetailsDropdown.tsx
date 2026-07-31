import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical, Scale, Target, Zap } from "lucide-react"

export default function UpdateDetailsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" />}>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2.5 px-2.5 py-2 text-sm">
            <Scale className="size-5" />
            Update weight
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2.5 px-2.5 py-2 text-sm">
            <Zap className="size-5" />
            Update activity
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2.5 px-2.5 py-2 text-sm">
            <Target className="size-5" />
            Update goal
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
