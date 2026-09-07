import axios from "axios"
import { clearToken, getToken } from "./auth-token"

export const api = axios.create({
  // same-origin path — the Vite dev server proxies /api to the backend, so it
  // works over localhost, the LAN IP, and the ngrok tunnel without CORS or
  // mixed-content issues. In prod, set VITE_API_URL to the real backend URL.
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // A 401 from login/register means bad credentials, not an expired
      // session — leave it to the form so it can show its own message.
      const url = error.config?.url ?? ""
      const isAuthAttempt =
        url.includes("/auth/login") || url.includes("/auth/register")

      if (!isAuthAttempt) {
        clearToken()
        const path = window.location.pathname
        if (path !== "/login" && path !== "/register") {
          window.location.replace("/login")
        }
      }
    }
    return Promise.reject(error)
  }
)
