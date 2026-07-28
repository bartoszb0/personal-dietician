import { Outlet } from "react-router-dom"

import { BottomNav } from "./BottomNav"

export function DashboardLayout() {
  return (
    <div className="mx-auto min-h-svh w-full max-w-md">
      {/* pb clears the fixed bottom nav */}
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
