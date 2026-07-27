import { getMe } from "@/api/auth"
import { useQuery } from "@tanstack/react-query"
import { Navigate, Outlet } from "react-router-dom"
import LoadingSpinner from "./LoadingSpinner"

export function ProtectedRoute() {
  const { isPending, isError } = useQuery({
    queryKey: ["me"],
    queryFn: () => getMe(),
    retry: false,
  })

  if (isPending) return <LoadingSpinner /> // checking auth
  if (isError) return <Navigate to="/login" replace /> // 401 → not logged in
  return <Outlet /> // authed → render the nested route
}
