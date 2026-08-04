import { BrowserRouter, Route, Routes } from "react-router-dom"

import { useDialogScrollLock } from "@/lib/useDialogScrollLock"
import NotFound from "@/pages/NotFound"
import { DashboardLayout } from "./components/common/DashboardLayout"
import { ProtectedRoute } from "./components/common/ProtectedRoute"
import { RedirectIfOnboarded } from "./components/common/RedirectIfOnboarded"
import { RequireOnboarding } from "./components/common/RequireOnboarding"
import StreakCalendar from "./pages/dashboard/calendar/StreakCalendar"
import Meals from "./pages/dashboard/meals/Meals"
import Profile from "./pages/dashboard/profile/Profile"
import Scanner from "./pages/dashboard/scanner/Scanner"
import Today from "./pages/dashboard/today/Today"
import Login from "./pages/Login"
import Onboarding from "./pages/onboarding/Onboarding"
import Register from "./pages/Register"

export function App() {
  useDialogScrollLock()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<RedirectIfOnboarded />}>
            <Route path="/onboarding" element={<Onboarding />} />
          </Route>
          <Route element={<RequireOnboarding />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Today />} />
              <Route path="/meals" element={<Meals />} />
              <Route path="/calendar" element={<StreakCalendar />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
