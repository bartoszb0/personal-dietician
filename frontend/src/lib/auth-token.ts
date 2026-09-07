// The JWT lives in localStorage and travels in the Authorization header —
// the backend is on a different domain than the frontend in prod, so a cookie
// would be third-party and blocked by Safari/iOS ITP and Chrome incognito.
const AUTH_TOKEN_KEY = "access_token"

// Safari private mode throws on localStorage access, so every call is guarded.
export function getToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  } catch {
    // ignore — the session just won't survive a refresh
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  } catch {
    // ignore
  }
}
