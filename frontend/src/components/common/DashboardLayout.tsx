import { Outlet } from "react-router-dom"

import { BottomNav } from "./BottomNav"

export function DashboardLayout() {
  return (
    // fixed-height app shell: only <main> scrolls, so the nav is always pinned
    // to the bottom and never affected by scrolling
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden">
      <main data-scroll-container className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
