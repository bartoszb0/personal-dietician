import { logout } from "@/api/auth"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { Button } from "../ui/button"

export default function LogoutBtn() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const onLogout = async () => {
    try {
      await logout()
    } finally {
      queryClient.clear()
      navigate("/login", { replace: true })
    }
  }

  return <Button onClick={onLogout}>Logout</Button>
}
