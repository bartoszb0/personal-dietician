import {
  CalendarDays,
  Home,
  ScanBarcode,
  User,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react"
import { NavLink } from "react-router-dom"

import { cn } from "@/lib/utils"

function Tab({
  to,
  label,
  icon: Icon,
}: {
  to: string
  label: string
  icon: LucideIcon
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-1 flex-col items-center justify-center gap-1 text-xs transition-colors",
          isActive
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        )
      }
    >
      <Icon className="size-5" />
      {label}
    </NavLink>
  )
}

export function BottomNav() {
  return (
    <nav className="shrink-0 border-t bg-background">
      <div className="relative mx-auto flex h-16 max-w-md items-stretch pb-[env(safe-area-inset-bottom)]">
        <Tab to="/meals" label="Meals" icon={UtensilsCrossed} />
        <Tab to="/scanner" label="Scanner" icon={ScanBarcode} />

        {/* reserved space for the centered FAB */}
        <div className="flex-1" aria-hidden />

        <Tab to="/calendar" label="Calendar" icon={CalendarDays} />
        <Tab to="/profile" label="Profile" icon={User} />

        {/* Today — circular FAB straddling the top edge */}
        <NavLink
          to="/"
          end
          aria-label="Today"
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4"
        >
          <div className="flex size-16 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95">
            <Home className="size-7" />
          </div>
        </NavLink>
      </div>
    </nav>
  )
}
