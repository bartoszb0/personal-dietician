import { BrowserRouter, Route, Routes } from "react-router-dom"

import Home from "@/pages/Home"
import NotFound from "@/pages/NotFound"
import { ProtectedRoute } from "./components/common/ProtectedRoute"
import { RedirectIfOnboarded } from "./components/common/RedirectIfOnboarded"
import { RequireOnboarding } from "./components/common/RequireOnboarding"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Onboarding from "./pages/onboarding/Onboarding"

export function App() {
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
            <Route path="/" element={<Home />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
