import { api } from "@/lib/api"
import type { LoginValues } from "@/schemas/loginSchema"
import type { RegisterValues } from "@/schemas/registerSchema"
import type { User, UserWithOnboarding } from "@/types/user"

export async function getMe(): Promise<UserWithOnboarding> {
  const { data } = await api.get<UserWithOnboarding>("/auth/me")
  return data
}

export async function login(input: LoginValues): Promise<User> {
  const { data } = await api.post<User>("/auth/login", input)
  return data
}

export async function register(input: RegisterValues): Promise<User> {
  const { data } = await api.post<User>("/auth/register", input)
  return data
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout")
}
