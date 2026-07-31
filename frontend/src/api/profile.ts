import { api } from "@/lib/api"
import type {
  UpdateProfilePayload,
  UpdateProfileResponse,
  UserProfile,
} from "@/types/profile"

export async function getProfileData(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>("/profile")
  return data
}

export async function updateProfile(
  patch: UpdateProfilePayload
): Promise<UpdateProfileResponse> {
  const { data } = await api.patch<UpdateProfileResponse>("/profile", patch)
  return data
}
