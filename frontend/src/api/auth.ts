import { api } from "@/lib/api"
import { clearToken, setToken } from "@/lib/auth-token"
import { authResponseSchema } from "@/schemas/authResponseSchema"
import type { LoginValues } from "@/schemas/loginSchema"
import type { RegisterValues } from "@/schemas/registerSchema"
import type { User } from "@/types/user"

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/auth/me")
  return data
}

export async function login(input: LoginValues): Promise<User> {
  const { data } = await api.post("/auth/login", input)
  const { access_token, ...user } = authResponseSchema.parse(data)
  setToken(access_token)
  return user
}

export async function register(input: RegisterValues): Promise<User> {
  const { data } = await api.post("/auth/register", input)
  const { access_token, ...user } = authResponseSchema.parse(data)
  setToken(access_token)
  return user
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout")
  } finally {
    // drop the session client-side even if the request fails
    clearToken()
  }
}
