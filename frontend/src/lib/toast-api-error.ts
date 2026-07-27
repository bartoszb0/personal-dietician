import { isAxiosError } from "axios"
import { toast } from "sonner"

export function toastApiError(
  error: unknown,
  statusMessages: Record<number, string> = {},
  fallback = "Something went wrong. Please try again."
) {
  const status = isAxiosError(error) ? error.response?.status : undefined
  const message = (status && statusMessages[status]) || fallback
  toast.error(message)
}
