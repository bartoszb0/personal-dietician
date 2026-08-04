import axios from "axios"

export const api = axios.create({
  // default to the same host the app was opened from, so it works on both
  // localhost (desktop) and the LAN IP (phone) without hardcoding an address
  baseURL:
    import.meta.env.VITE_API_URL ?? `http://${window.location.hostname}:3001`,
  withCredentials: true,
})
