import { api } from "@/lib/api"
import type { UpdateProfilePayload, UserProfile } from "@/types/profile"

export async function getProfileData(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>("/profile")
  return data
}

export async function updateProfile(
  patch: UpdateProfilePayload
): Promise<UserProfile> {
  const { data } = await api.patch<UserProfile>("/profile", patch)
  return data
}
