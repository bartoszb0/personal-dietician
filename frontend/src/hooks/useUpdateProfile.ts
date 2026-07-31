import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateProfile } from "@/api/profile"
import { toastApiError } from "@/lib/toast-api-error"

export function useUpdateProfile(onDone: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
      queryClient.invalidateQueries({ queryKey: ["current-target"] })
      toast.success("Updated")
      onDone()
    },
    onError: toastApiError,
  })
}
