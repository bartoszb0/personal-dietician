import { getMe } from "@/api/auth"
import { useQuery } from "@tanstack/react-query"
import { Navigate, Outlet } from "react-router-dom"
import LoadingSpinner from "./LoadingSpinner"

export function RedirectIfOnboarded() {
  const {
    data: me,
    isPending,
    isError,
  } = useQuery({ queryKey: ["me"], queryFn: () => getMe(), retry: false })

  if (isPending) return <LoadingSpinner /> // checking
  if (isError) return <Navigate to="/login" replace /> // 401 → not logged in

  if (me.isOnboarded === true) {
    return <Navigate to="/" replace /> // already onboarded → into the app
  }

  return <Outlet />
}
