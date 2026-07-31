import { api } from "@/lib/api"
import type { UserProfile } from "@/types/profile"

export async function getProfileData(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>("/profile")
  return data
}

// todo fix any
export async function updateProfile(patch: any): Promise<any> {
  const { data } = await api.patch<UserProfile>("/profile", patch)
  return data
}
