import { BrowserRouter, Route, Routes } from "react-router-dom"

import Home from "@/pages/Home"
import NotFound from "@/pages/NotFound"
import { ProtectedRoute } from "./components/common/ProtectedRoute"
import Login from "./pages/Login"
import Register from "./pages/Register"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
